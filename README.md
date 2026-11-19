# publicpulse.com.bd — Public Pulse Agency website

Live site: https://publicpulse.com.bd/
GitHub: https://github.com/The-Public-Pulse-Agency/Public-Pulse-Website
AWS account `739275468267`, region `ap-southeast-1`, CLI profile `default` (the `eventpulse` profile token is invalid).

Next.js 16 (App Router) + TypeScript strict + Tailwind, deployed with SST v3 (OpenNext) to CloudFront + Lambda + S3, Neon Postgres via Drizzle, Resend for email, SSM for secrets.

**Start here:** [CLAUDE.md](CLAUDE.md) (rules) and [docs/JOURNEY.md](docs/JOURNEY.md) (what changed, newest first). Architecture, SEO/AEO/GEO and brand notes are in [docs/](docs/).

## Quick start

```bash
npm ci
npm run dev                      # http://localhost:3000
npx tsc --noEmit && npm run build

# Deploy to production (needs .env.production; see docs/DEPLOY.md and docs/ENV.md)
AWS_PROFILE=default bash scripts/deploy.sh production
```

`npm run build` regenerates `public/llms.txt`, `llms-full.txt` and `facts.json` without a database; do not commit those after a local build (the deploy script regenerates them with the live DB).

## Notes

- The pre-2026 static mirror (`site/`) and its helper scripts (`deploy.sh`, `pull.sh`, `preview.sh`) were removed; they remain in git history. The legacy CloudFront distribution `EFMM4G8ZO6TJX` and S3 bucket `publicpulse.com.bd` still exist in AWS.
- Rollback = `git checkout <known-good-commit>` and redeploy with the command above.
