// Fonts for next/og ImageResponse (satori needs ttf/otf/woff — NOT woff2).
// Shared by /og and the per-post blog card so both use the brand serif.
//
// Load order: (1) read from disk (works in dev / `next start`), (2) fetch the
// same file from the site's static assets (works on the OpenNext Lambda, where
// public/ lives in S3, not in the function bundle). Never throws.
//
// Two traps this guards against:
//  - ImageResponse THROWS ("No fonts are loaded") if you pass `fonts: []`.
//    Callers must pass `ogFontOptions(fonts)` (undefined when empty) instead.
//  - Only successes are cached, so one transient failure can't pin the
//    fallback for the life of a warm Lambda.
import { SITE } from "./site";

export type OgFont = { name: string; data: ArrayBuffer; weight: 700; style: "normal" };

const FONT_PATH = "/fonts/og/fraunces-700.woff";
let cached: OgFont[] | null = null;

async function readFromDisk(): Promise<ArrayBuffer | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const buf = await readFile(join(process.cwd(), "public", FONT_PATH));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

async function readFromSite(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${SITE.url}${FONT_PATH}`, { signal: AbortSignal.timeout(4000) });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function loadOgFonts(): Promise<OgFont[]> {
  if (cached) return cached;
  const data = (await readFromDisk()) ?? (await readFromSite());
  if (!data) return [];
  cached = [{ name: "Fraunces", data, weight: 700, style: "normal" }];
  return cached;
}

/** `fonts` option for ImageResponse: undefined (not []) when nothing loaded. */
export function ogFontOptions(fonts: OgFont[]) {
  return fonts.length ? { fonts } : {};
}
