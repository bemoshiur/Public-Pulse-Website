/**
 * Deploy-time IndexNow submission - only for pages whose CONTENT changed.
 *
 *   tsx scripts/indexnow-ping.ts --snapshot          record hashes of the live site (no submit)
 *   tsx scripts/indexnow-ping.ts --changed [--dry-run]   hash again, submit only what differs
 *   tsx scripts/indexnow-ping.ts --urls <u1> <u2> ...    submit exactly these URLs
 *
 * Why a manifest: IndexNow is explicitly "not designed for submitting every URL
 * on your site at once", and every submitted URL counts against crawl quota. So
 * we hash each sitemap page's NORMALISED HTML (scripts, styles, comments, nonces
 * and build hashes removed - they change every deploy) and submit the delta.
 * JSON-LD blocks are kept: a schema change is a real content change.
 *
 * Manifest: .deploy/freshness.json (gitignored). Best-effort: never exits
 * non-zero for network problems, so it can never fail a deploy.
 */
import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { pingIndexNow } from "../src/lib/indexnow";

const SITE = process.env.INDEXNOW_SITE ?? "https://publicpulse.com.bd";
const MANIFEST = ".deploy/freshness.json";
const CONCURRENCY = 6;
const TIMEOUT_MS = 45_000;

type Manifest = { version: 1; site: string; capturedAt: string; urls: Record<string, string> };

function normalise(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/\snonce="[^"]*"/gi, "")
    .replace(/\sintegrity="[^"]*"/gi, "")
    .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/X")
    .replace(/\/_next\/image\?[^"'\s)]+/g, "/_next/image")
    .replace(/\s+/g, " ")
    .trim();
}

async function sitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`sitemap.xml -> HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

async function hashAll(urls: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++];
      try {
        const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (res.status !== 200) continue; // never hash an error page as "content"
        out[url] = createHash("sha256").update(normalise(await res.text())).digest("hex");
      } catch {
        /* unreachable page: leave it out so it is neither "changed" nor recorded */
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

function load(): Manifest | null {
  return existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest) : null;
}
function save(urls: Record<string, string>) {
  mkdirSync(dirname(MANIFEST), { recursive: true });
  const m: Manifest = { version: 1, site: SITE, capturedAt: new Date().toISOString(), urls };
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n");
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");

  if (args[0] === "--urls") {
    const urls = args.slice(1).filter((a) => !a.startsWith("--"));
    console.log(`[indexnow] submitting ${urls.length} explicit URL(s)${dry ? " (dry run)" : ""}`);
    if (!dry) console.log("[indexnow] result:", await pingIndexNow(urls));
    return;
  }

  const urls = await sitemapUrls();
  console.log(`[indexnow] hashing ${urls.length} sitemap pages from ${SITE}`);
  const now = await hashAll(urls);

  if (args.includes("--snapshot")) {
    save(now);
    console.log(`[indexnow] snapshot saved: ${Object.keys(now).length} pages -> ${MANIFEST}`);
    return;
  }

  if (args.includes("--changed")) {
    const before = load();
    if (!before) {
      save(now);
      console.log("[indexnow] no earlier snapshot - baseline recorded, nothing submitted.");
      console.log("           (Run --snapshot BEFORE deploying so the next deploy can diff.)");
      return;
    }
    const changed = Object.keys(now).filter((u) => before.urls[u] !== now[u]);
    const added = changed.filter((u) => !(u in before.urls)).length;
    console.log(`[indexnow] ${changed.length} changed/new of ${Object.keys(now).length} (${added} new)`);
    for (const u of changed.slice(0, 40)) console.log("   ", u);
    if (changed.length > 40) console.log(`    ...and ${changed.length - 40} more`);
    if (dry) return console.log("[indexnow] dry run - nothing submitted, manifest not updated.");
    if (changed.length === 0) return save(now);
    const r = await pingIndexNow(changed);
    console.log("[indexnow] result:", r);
    if (r.ok) save(now); // only advance the baseline once the submission was accepted
    return;
  }

  console.log("usage: --snapshot | --changed [--dry-run] | --urls <url...>");
}

main().catch((e) => {
  console.warn("[indexnow] skipped:", e instanceof Error ? e.message : e);
});
