#!/usr/bin/env bash
# One-shot automated deploy for a given SST stage.
#
#   bash scripts/deploy.sh <stage>
#
# Examples:
#   bash scripts/deploy.sh production    # the live stack (CloudFront URL only)
#   bash scripts/deploy.sh staging       # only if you've reintroduced a staging stage
#
# What it does (idempotent — safe to re-run):
#   1. Loads .env.<stage> (gitignored), STOPs on missing file or blank values.
#   2. Confirms the AWS profile works.
#   3. Verifies the RESEND_API_KEY actually authenticates against Resend.
#      STOPs with a clear message if it's invalid.
#   4. Pushes every secret to SSM via `sst secret set --stage <stage>`.
#   5. Applies Drizzle schema to Neon via `drizzle-kit push`
#      (uses DATABASE_URL_DIRECT — pooled endpoints reject DDL).
#   6. Runs `sst deploy --stage <stage>` and parses out the CloudFront URL.
#   7. Triggers /manage once so the admin user is bootstrapped on first hit.
#   8. (removed) no longer seeds a placeholder case study into production.
#   9. Runs verification curls against the CloudFront URL and prints a
#      DOMAIN-STATUS banner reminding you that publicpulse.com.bd is
#      unchanged.
#
# IMPORTANT — NO DOMAIN ATTACHMENT:
#   sst.config.ts deliberately does NOT attach publicpulse.com.bd to any
#   stage. Every deploy lands on the SST-managed CloudFront URL. Apex DNS
#   stays on the legacy distribution until the manual cutover documented
#   in docs/DEPLOY.md.

set -euo pipefail

# ─── Args ───────────────────────────────────────────────────────────────

STAGE="${1:-}"
if [ -z "$STAGE" ]; then
  cat >&2 <<EOF
❌ Usage: bash scripts/deploy.sh <stage>

  Examples:
    bash scripts/deploy.sh production
    bash scripts/deploy.sh staging      # only if .env.staging exists

EOF
  exit 1
fi

ENV_FILE=".env.$STAGE"
REQUIRED=(
  DATABASE_URL
  DATABASE_URL_DIRECT
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  RESEND_REPLY_TO
  BETTER_AUTH_SECRET
  ADMIN_EMAIL
  ADMIN_PASSWORD
)
SECRETS=(
  DATABASE_URL
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  RESEND_REPLY_TO
  BETTER_AUTH_SECRET
  ADMIN_EMAIL
  ADMIN_PASSWORD
)
REGION="ap-southeast-1"
PROFILE="${AWS_PROFILE:-eventpulse}"

die() { echo "❌ $*" >&2; exit 1; }
info() { printf "\n▸ %s\n" "$*"; }
ok() { printf "  ✓ %s\n" "$*"; }

# ─── 1. Pre-flight ──────────────────────────────────────────────────────

info "Pre-flight checks (stage=$STAGE, region=$REGION, profile=$PROFILE)"
[ -f "$ENV_FILE" ] || die "$ENV_FILE not found. Copy .env.$STAGE.example to $ENV_FILE and fill it in."

# shellcheck disable=SC2046
set -a; . "./$ENV_FILE"; set +a

MISSING=()
for v in "${REQUIRED[@]}"; do
  if [ -z "${!v:-}" ]; then MISSING+=("$v"); fi
done
if [ ${#MISSING[@]} -gt 0 ]; then
  die "$ENV_FILE has blank values: ${MISSING[*]}. Fill them and re-run."
fi
ok "All required env vars present in $ENV_FILE."

aws sts get-caller-identity --profile "$PROFILE" >/dev/null \
  || die "AWS profile '$PROFILE' is not configured. Run: aws configure --profile $PROFILE"
ACCOUNT=$(aws sts get-caller-identity --profile "$PROFILE" --query Account --output text)
ok "AWS profile '$PROFILE' (account $ACCOUNT)"

# ─── 2. Resend API key + sender-domain verification ─────────────────────

info "Resend authentication + sender-domain check ($RESEND_FROM_EMAIL)"
DOMAIN="${RESEND_FROM_EMAIL#*@}"

# GET /domains lists the verified sending domains for this API key.
# A 200 with a `data` array means the key is valid; we then check the
# sender domain is present and verified.
RESEND_RESP=$(curl -sS -o /tmp/resend-domains.json -w "%{http_code}" \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  https://api.resend.com/domains || echo "000")

if [ "$RESEND_RESP" = "401" ] || [ "$RESEND_RESP" = "403" ]; then
  die "Resend rejected the API key (HTTP $RESEND_RESP). Generate a fresh one at https://resend.com/api-keys."
fi
if [ "$RESEND_RESP" != "200" ]; then
  die "Could not reach Resend (HTTP $RESEND_RESP). Check network / API status."
fi

# Parse the response for the sender domain. Resend uses status "verified"
# once DKIM has propagated. Anything else means mail will bounce.
DOMAIN_STATUS=$(python3 -c "
import json, sys
try:
  data = json.load(open('/tmp/resend-domains.json')).get('data', [])
  for d in data:
    if d.get('name') == '$DOMAIN':
      print(d.get('status', 'unknown'))
      sys.exit(0)
  print('not-found')
except Exception as e:
  print(f'parse-error: {e}')
" 2>/dev/null || echo "parse-error")

if [ "$DOMAIN_STATUS" = "verified" ]; then
  ok "Resend API key valid, sender domain '$DOMAIN' verified"
else
  cat >&2 <<EOF

❌ Resend sender domain NOT verified.
   domain ($DOMAIN):  $DOMAIN_STATUS

Action required (cannot be done by this script):
  1. Open https://resend.com/domains
  2. Add "$DOMAIN" if missing, then click "Verify DNS records".
  3. DKIM records should already exist in Route 53 under
     resend._domainkey.$DOMAIN — Resend just needs to confirm them.
  4. Re-run this script once the dashboard shows "verified".

EOF
  exit 1
fi

# ─── 3. Push secrets to SSM ─────────────────────────────────────────────

info "Pushing ${#SECRETS[@]} secrets to SSM for stage '$STAGE'"
for v in "${SECRETS[@]}"; do
  AWS_PROFILE="$PROFILE" npx --yes sst secret set "$v" "${!v}" --stage "$STAGE" >/dev/null
  ok "$v"
done

# ─── 4. Apply Drizzle migrations ────────────────────────────────────────

info "Applying Drizzle schema to Neon (uses DATABASE_URL_DIRECT)"
# --force skips the interactive "do you want to apply?" prompt, which
# would otherwise stall this script (no TTY when run unattended).
DATABASE_URL_DIRECT="$DATABASE_URL_DIRECT" npx --yes drizzle-kit push --force
ok "Schema in sync"

# ─── 4b. Generate AI-ingestion files (public/llms.txt + llms-full.txt) ──
# These MUST be regenerated here, before `sst deploy`, so OpenNext bundles the
# fresh files into S3. They can't be dynamic `.txt` routes (CloudFront routes
# `.txt` to S3, so a Lambda `.txt` route 403s). Reads DATABASE_URL for the
# blog/case sections; degrades to catalog-only if the DB is unreachable.
info "Regenerating public/llms.txt + public/llms-full.txt"
DATABASE_URL="$DATABASE_URL" DATABASE_URL_DIRECT="$DATABASE_URL_DIRECT" \
  npx --yes tsx scripts/generate-llms.ts
ok "llms files generated"

# ─── 4c. Snapshot the LIVE site for the post-deploy IndexNow diff ───────
# IndexNow forbids bulk resubmission, so after the deploy we submit only pages
# whose normalised HTML changed. That needs a "before": snapshot the site as it
# is right now (production only; best-effort, never blocks the deploy).
if [ "$STAGE" = "production" ] && [ ! -f .deploy/freshness.json ]; then
  info "Snapshotting live pages for the IndexNow diff"
  npx --yes tsx scripts/indexnow-ping.ts --snapshot || true
fi

# ─── 5. SST deploy ──────────────────────────────────────────────────────

info "Deploying SST stack (stage=$STAGE, region=$REGION)"
DEPLOY_LOG="$(mktemp)"
AWS_PROFILE="$PROFILE" npx --yes sst deploy --stage "$STAGE" 2>&1 | tee "$DEPLOY_LOG"

URL=$(grep -oE 'https://[a-z0-9.-]+\.cloudfront\.net' "$DEPLOY_LOG" | head -1 || true)
if [ -z "$URL" ]; then
  URL=$(grep -oE 'https?://[a-z0-9.-]+' "$DEPLOY_LOG" | grep -E 'cloudfront|publicpulse' | head -1 || true)
fi
[ -n "$URL" ] || die "Could not parse a public URL from the SST deploy log ($DEPLOY_LOG). Check the output above."

# The apex has been attached to the production stage since the STEP 7 cutover, so
# SST returns https://publicpulse.com.bd for production and that is expected.
# Any OTHER stage returning the apex means a misconfigured domain block.
if [[ "$URL" == *"publicpulse.com.bd"* && "$STAGE" != "production" ]]; then
  cat >&2 <<EOF

❌ SST returned the apex URL ($URL) for stage '$STAGE'.
   Only the production stage may own publicpulse.com.bd - check the
   \`domain:\` block in sst.config.ts.

EOF
  exit 1
fi
ok "Deployed: $URL"

# ─── 6. Trigger admin bootstrap ─────────────────────────────────────────

info "Triggering admin bootstrap (first /manage/sign-in hit)"
# /manage/sign-in renders the manage layout, which runs ensureAdminUser().
# (Hitting /manage directly 404s — no page.tsx at the root.)
curl -sL -o /dev/null -w "  HTTP %{http_code}\n" "$URL/manage/sign-in" || true

# ─── 7. Verification ────────────────────────────────────────────────────

verify() { printf "    %s\n" "$1"; }

info "Verification (against $URL)"

echo
verify "Homepage cache (twice — second should be a CloudFront HIT)"
curl -sI "$URL/" | grep -iE 'x-cache|cache-control' | sed 's/^/      /'
echo "    ---"
curl -sI "$URL/" | grep -iE 'x-cache|cache-control' | sed 's/^/      /'

echo
verify "/manage — no-store + noindex + redirect to sign-in"
curl -sI "$URL/manage" | grep -iE 'cache-control|x-robots-tag|location|HTTP/' | sed 's/^/      /'

echo
verify "robots.txt — /manage disallowed"
curl -s "$URL/robots.txt" | grep -i manage | sed 's/^/      /'

echo
verify "sitemap.xml — /manage absent (must be 0)"
COUNT=$(curl -s "$URL/sitemap.xml" | grep -c manage || true)
echo "      count = $COUNT"

if [ "$STAGE" = "production" ]; then
  echo
  info "IndexNow: submitting only pages whose content changed"
  # Let CloudFront/ISR settle so we hash the NEW pages, not stale cache.
  sleep 45
  npx --yes tsx scripts/indexnow-ping.ts --changed || true
fi

echo
echo "═══════════════════════════════════════════════════════════════════"
echo "  DEPLOY COMPLETE — stage: $STAGE"
echo "═══════════════════════════════════════════════════════════════════"
echo "  Reachable only at: $URL"
echo "  Admin panel:       $URL/manage  (sign in with $ADMIN_EMAIL)"
echo
echo "  ⚠  DOMAIN STATUS: publicpulse.com.bd is UNCHANGED."
echo "     This deploy is not in front of the apex. The live site at"
echo "     https://publicpulse.com.bd still points at the legacy"
echo "     CloudFront distribution. DNS cutover is a separate manual"
echo "     step — see docs/DEPLOY.md § 'Production cutover'."
echo "═══════════════════════════════════════════════════════════════════"
