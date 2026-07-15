// /llms-full — the always-fresh full-text corpus for AI ingestion.
//
// This is the EXTENSIONLESS companion to the static public/llms-full.txt.
// Because it has no `.txt` extension, CloudFront routes it to the Lambda
// server (not the S3 static origin), so it can render on demand and always
// reflects the latest published posts/case studies — unlike the build-time
// static file which only refreshes on deploy. See src/lib/llms.ts for why
// the `.txt` version must be a physical static asset.

import { buildLlmsFull } from "@/lib/llms";

// Rendered on demand (reads the DB), then cached at CloudFront via the
// s-maxage header below — so origin work is bounded while content stays fresh.
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const body = await buildLlmsFull();
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "x-robots-tag": "all",
    },
  });
}
