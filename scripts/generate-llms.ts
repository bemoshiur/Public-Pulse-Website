#!/usr/bin/env tsx
//
// Generates the physical public/llms.txt + public/llms-full.txt files.
//
// WHY physical files (not dynamic routes): OpenNext/CloudFront routes any
// `.txt` path to the S3 static-asset origin, so a dynamic `.txt` route 403s.
// Real files in public/ are served from S3 correctly. See src/lib/llms.ts.
//
// Runs automatically before every build:
//   • `npm run build` → the `prebuild` hook fires this.
//   • `sst deploy`    → scripts/deploy.sh calls this BEFORE `sst deploy`, so
//     the freshly-written files are bundled into S3 by OpenNext.
//
// Env: DATABASE_URL (for the blog/case-study sections). If absent — e.g. the
// CI verify build — the DB sections degrade to "unavailable" and the catalog
// sections still generate, so the build never fails on a missing DB.

import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";

// Load .env then .env.local (local wins) so a developer / CI run picks up
// whatever DATABASE_URL is present. deploy.sh exports it inline for prod.
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local"), override: true });

async function main() {
  // Imported after env is loaded so db/client sees DATABASE_URL.
  const { buildLlmsIndex, buildLlmsFull } = await import("../src/lib/llms");
  const { buildFacts } = await import("../src/lib/facts");

  const [index, full] = await Promise.all([buildLlmsIndex(), buildLlmsFull()]);
  // Static, no DB — a build-time facts.json is always complete.
  const facts = buildFacts(new Date().toISOString());

  const publicDir = resolve(process.cwd(), "public");
  writeFileSync(resolve(publicDir, "llms.txt"), index.trimEnd() + "\n", "utf8");
  writeFileSync(resolve(publicDir, "llms-full.txt"), full.trimEnd() + "\n", "utf8");
  writeFileSync(resolve(publicDir, "facts.json"), JSON.stringify(facts, null, 2) + "\n", "utf8");

  const hasDb = Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_DIRECT);
  console.log(
    `[generate-llms] wrote public/llms.txt (${index.length} chars) + public/llms-full.txt (${full.length} chars) + public/facts.json (${facts.statistics.length} live stats)` +
      (hasDb ? "" : "  — WARNING: no DATABASE_URL, blog/case sections are catalog-only")
  );
}

main().catch((err) => {
  // Never fail the build on this — a stale llms file is far better than a
  // broken deploy. Log loudly so it's visible in CI/deploy output.
  console.error("[generate-llms] FAILED (continuing build with existing files):", err);
  process.exit(0);
});
