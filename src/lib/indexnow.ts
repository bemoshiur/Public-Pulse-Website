// IndexNow ping helper. Called from /manage publish actions so search
// engines (Bing, Yandex, Seznam, etc.) re-crawl freshly published or
// updated URLs without waiting for crawl-budget cycles.
//
// Key file lives at /<INDEXNOW_KEY>.txt and contains the key as text.
// Both filename and content MUST match.
//
// Best-effort: failures are logged but never block the publish path.

import { SITE } from "./site";

export const INDEXNOW_KEY = "c8e3a47b9d2f4e6a8b1c5d7e9f0a2b4c";
export const INDEXNOW_KEY_LOCATION = `${SITE.url}/${INDEXNOW_KEY}.txt`;

// IndexNow accepts at most 10,000 URLs per request.
const INDEXNOW_MAX_BATCH = 10_000;

/**
 * Submit one or more freshly published / updated URLs to IndexNow.
 *
 * IndexNow is NOT a bulk-resubmission tool ("not designed for submitting every
 * URL on your site at once"), so callers must pass only URLs whose content
 * actually changed. 200 and 202 are both success (202 = key still validating).
 */
export async function pingIndexNow(
  urlList: string[],
  opts: { host?: string } = {}
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const urls = urlList.filter((u) => u.startsWith("http"));
  if (urls.length === 0) return { ok: true };

  const host = opts.host ?? new URL(SITE.url).host;
  let last: { ok: boolean; status?: number; error?: string } = { ok: true };

  for (let i = 0; i < urls.length; i += INDEXNOW_MAX_BATCH) {
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urls.slice(i, i + INDEXNOW_MAX_BATCH),
    };
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // 429 is the only retryable code; 400/403/422 are config bugs. Never hot-loop.
        console.warn("[indexnow] non-2xx response", {
          status: res.status,
          retryAfter: res.headers.get("retry-after"),
          urls: payload.urlList.length,
        });
        return { ok: false, status: res.status };
      }
      last = { ok: true, status: res.status };
    } catch (err) {
      console.warn("[indexnow] request failed", err);
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
  return last;
}
