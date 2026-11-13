# Deploying on AWS Amplify Hosting

This repo is a Next.js 16 (App Router) SSR app. Amplify Hosting runs it as a
`WEB_COMPUTE` app using the committed `amplify.yml`. (The older SST/OpenNext
path in `docs/DEPLOY.md` still works; use one or the other, not both.)

## 1. Connect
Amplify console → *Create new app* → *GitHub* → pick this repo + branch.
Platform: **Next.js – SSR** (auto-detected). Build settings come from `amplify.yml`.

## 2. Environment variables (App settings → Environment variables)
Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`,
`CRON_SECRET`, `NEXT_PUBLIC_SITE_URL=https://publicpulse.com.bd`.
Booking: `NEXT_PUBLIC_BOOKING_URL=https://cal.com/publicpulse/15min` (this is also
the built-in default if unset), `CAL_WEBHOOK_SECRET` for the Cal.com webhook.
Optional integrations: `MESSENGER_*`, `FACEBOOK_*`, `META_CAPI_*`, `RESEND_WEBHOOK_SECRET`,
`BEDROCK_*`, `GENERATOR_*`, `DIGEST_URL`.
`amplify.yml` copies these into `.env.production` at build time so the SSR runtime sees them.

## 3. Things Amplify does NOT do for you
- **Cron jobs** (`/api/cron/auto-publish`, `/digest`, `/lead-maintenance`, `/welcome-drip`):
  SST created EventBridge schedules. On Amplify, schedule HTTPS calls yourself
  (EventBridge Scheduler API destination, or a GitHub Actions `schedule:`) sending
  `Authorization: Bearer $CRON_SECRET` to those routes.
- **Bedrock** (blog generator): attach `bedrock:InvokeModel` to the Amplify *compute role*.
- **Security headers / redirects** live in `next.config.ts` and keep working.

## 4. Domain cut-over (do this last)
Test on the `*.amplifyapp.com` URL first: `/`, `/bn`, `/services/paid-ads`, `/book`,
`/sitemap.xml`, `/robots.txt`, `/llms.txt`. Then *Domain management* → add
`publicpulse.com.bd` + `www`. Keep the old CloudFront distribution until DNS has settled.
