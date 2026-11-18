import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  /** Eyebrow text for the dynamic OG factory (defaults to chip text). */
  ogEyebrow?: string;
  /** When set, uses the dynamic /og?title=&eyebrow= factory instead of the static OG. */
  useDynamicOg?: boolean;
  /** Override the OG card headline (only used when useDynamicOg=true).
   *  Useful when the page <title> is verbose (e.g. "X | Public Pulse")
   *  but the OG card should show a cleaner phrase. Falls back to `title`. */
  ogTitle?: string;
  /** Extra hreflang entries merged into alternates.languages (e.g. bn-BD pointing at /bn/...). */
  alternateLanguages?: Record<string, string>;
  /** Set to "bn" for native Bengali pages. `path` is then the /bn/... path. */
  locale?: "en" | "bn";
  /** English counterpart path of a Bengali page (hreflang `en` + `x-default`). */
  enPath?: string;
  /** Bengali counterpart path of an English page — emits hreflang `bn-BD`. */
  bnPath?: string;
};

const DEFAULT_OG = "/og-image.jpg";

function warnIfLong(label: string, value: string, max: number) {
  if (value.length > max && process.env.NODE_ENV !== "production") {
    console.warn(
      `[seo] ${label} is ${value.length} chars (recommended ≤ ${max}): "${value}"`
    );
  }
}

// Backstop: clamp the META description to ≤160 chars at a word boundary so
// Google doesn't truncate mid-word. The full text stays on the page — this
// only trims the <meta>/OG/Twitter snippet. Catches unbounded sources
// (glossary raw definitions, matrix priority tails) in one place.
function clampDescription(desc: string, max = 160): string {
  if (desc.length <= max) return desc;
  const cut = desc.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max - 30 ? cut.slice(0, lastSpace) : cut;
  return trimmed.replace(/[\s,;:.—-]+$/, "") + "…";
}

// Backstop: keep the <title> at <= 60 chars so Google doesn't rewrite or truncate
// it. Titles are authored per page/template/DB row, so this is the one place that
// guarantees the budget. Order of preference: (1) drop a trailing brand segment
// ("| Public Pulse Glossary"), (2) cut at the last natural separator that still
// leaves a meaningful head, (3) cut at a word boundary with an ellipsis.
const TITLE_BRAND_TAIL = /\s*[|\u2014\u2013-]\s*Public Pulse[^|\u2014\u2013]*$/i;
const TITLE_SEPARATORS = [" \u2014 ", " | ", " \u2013 ", ": "];
export function clampTitle(title: string, max = 60): string {
  if (title.length <= max) return title;
  const noBrand = title.replace(TITLE_BRAND_TAIL, "").trim();
  if (noBrand.length > 0 && noBrand.length <= max) return noBrand;
  const base = noBrand.length > 0 ? noBrand : title;
  let cut = -1;
  for (const sep of TITLE_SEPARATORS) {
    const idx = base.lastIndexOf(sep, max);
    if (idx >= 24 && idx > cut) cut = idx;
  }
  if (cut > 0) return base.slice(0, cut).trim();
  const head = base.slice(0, max - 1);
  const sp = head.lastIndexOf(" ");
  return (sp > max - 20 ? head.slice(0, sp) : head).replace(/[\s,;:.\u2014-]+$/, "") + "\u2026";
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    title: rawTitle,
    description: rawDescription,
    path,
    ogImage,
    ogType = "website",
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noIndex,
    ogEyebrow,
    // Default to static OG. The dynamic /og factory works at build time and
    // returns a per-title PNG, but on first request it can cold-start slowly;
    // opt-in per page if you want the dynamic image.
    useDynamicOg = false,
    alternateLanguages,
    ogTitle,
    locale = "en",
    enPath,
    bnPath,
  } = input;
  const isBn = locale === "bn";

  const title = clampTitle(rawTitle);
  warnIfLong("title", rawTitle, 60);
  warnIfLong("description", rawDescription, 160);
  const description = clampDescription(rawDescription);

  const canonical = absoluteUrl(path);
  const resolvedOg = useDynamicOg
    ? absoluteUrl(
        `/og?title=${encodeURIComponent(ogTitle ?? title)}&eyebrow=${encodeURIComponent(
          ogEyebrow ?? "Public Pulse · Dhaka"
        )}`
      )
    : (ogImage ?? DEFAULT_OG).startsWith("http")
    ? (ogImage ?? DEFAULT_OG)
    : absoluteUrl(ogImage ?? DEFAULT_OG);

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    keywords: tags?.join(", "),
    applicationName: SITE.name,
    creator: SITE.name,
    publisher: SITE.name,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical,
      languages: isBn
        ? {
            en: absoluteUrl(enPath ?? "/"),
            "bn-BD": canonical,
            "x-default": absoluteUrl(enPath ?? "/"),
            ...(alternateLanguages ?? {}),
          }
        : {
            en: canonical,
            "x-default": canonical,
            ...(bnPath ? { "bn-BD": absoluteUrl(bnPath) } : {}),
            ...(alternateLanguages ?? {}),
          },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
    openGraph: {
      type: ogType,
      url: canonical,
      title,
      description,
      siteName: SITE.name,
      locale: isBn ? "bn_BD" : SITE.locale,
      alternateLocale: isBn ? [SITE.locale] : bnPath ? ["bn_BD"] : undefined,
      images: [{ url: resolvedOg, width: 1200, height: 630, alt: title }],
      ...(ogType === "article" && {
        publishedTime,
        modifiedTime: modifiedTime ?? publishedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOg],
      site: SITE.twitter,
      creator: SITE.twitter,
    },
    other: {
      // Geo meta (legacy but still consumed by some crawlers)
      "geo.region": SITE.contact.address.region,
      "geo.placename": SITE.contact.address.locality,
      "geo.position": `${SITE.contact.address.lat};${SITE.contact.address.lng}`,
      "ICBM": `${SITE.contact.address.lat}, ${SITE.contact.address.lng}`,
      // Mobile-app hints
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": SITE.shortName,
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#0A0A0A",
      "msapplication-tap-highlight": "no",
      // Color scheme + theme hints (browsers tint UI chrome to match)
      "color-scheme": "light",
      "theme-color": "#0A0A0A",
    },
  };
}
