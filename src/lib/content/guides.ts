// HowTo playbooks rendered under /guides/<slug>. Each guide carries enough
// metadata to emit valid HowTo JSON-LD (step list + estimated time + tools).
// First batch is the highest-search-intent guides for the BD market.

export type GuideStep = { name: string; text: string };
export type Guide = {
  slug: string;
  title: string;
  titleBn?: string;
  description: string;
  /** 40–60 word answer block. */
  answer: string;
  /** ISO 8601 duration, e.g. "PT45M". */
  totalTime: string;
  /** Tools/services referenced in the steps. */
  tools: string[];
  /** Pre-requisites the reader needs. */
  prerequisites: string[];
  steps: GuideStep[];
  /** Cross-link to glossary terms by slug. */
  glossaryRefs?: string[];
  /** Grounding refs (service slug / industry slug / location slug). */
  groundingRefs: string[];
  /** Publish state — ungated guides are excluded from sitemap. */
  ready: boolean;
  datePublished: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "facebook-campaign-bd-election",
    title: "How to run a Facebook ad campaign for a Bangladesh constituency election",
    description:
      "Step-by-step playbook for setting up a constituency-targeted Meta ads campaign for a Bangladeshi political candidate — from audience build to compliance to budget pacing.",
    answer:
      "Before anything else, complete Meta ad authorization (identity + location) and register the “Paid for by” disclaimer — political ads are rejected without them. Then pin a geo-radius to the constituency, run Bangla-first creative within Special Ad Category limits, back it with CAPI, and heavy-weight budget in the final 14 days. Full offer: /political-facebook-ads-bangladesh.",
    totalTime: "PT2H30M",
    tools: ["Meta Ads Manager", "Meta Business Suite", "Meta Conversions API", "Meta Ad Library"],
    prerequisites: [
      "Verified Meta Business Page for the candidate",
      "Ability to complete Meta political-ad authorization (ID + in-country location)",
      "Ad account with BDT payment method on file",
      "Constituency boundary coordinates (lat/lng polygon)",
    ],
    steps: [
      {
        name: "Authorize the ad account + register the “Paid for by” disclaimer",
        text: "Before any spend: complete Meta’s political-ad authorization (verified identity + in-country location) and register the disclaimer naming who pays. This can take days — do it early, because unauthorized political ads are rejected and pages get restricted. See /political-facebook-ads-bangladesh for the full compliance regime.",
      },
      {
        name: "Build the constituency-pinned audience",
        text: "In Meta Ads Manager → Audiences → Create a custom audience with a geo-radius drawn over the constituency. Layer in age 18+ and language=Bangla. Save this audience by name — you'll reuse it for every ad in the cycle.",
      },
      {
        name: "Set up Conversions API (CAPI) for the campaign site",
        text: "Server-side event tracking from the candidate's microsite to Meta — recovers signal lost to iOS ATT and ad blockers, which is critical during a campaign's final week when click-noise spikes.",
      },
      {
        name: "Author Bangla-first creative (image + video variants)",
        text: "Test 3 image and 2 video variants on a BDT 5,000 micro-budget. Winning variants by reach + CTR move to the main campaign.",
      },
      {
        name: "Configure budget pacing for the cycle",
        text: "Heavy-weight the final 14 days. Recommended split: 20% pre-narrative (T-60 to T-30), 30% sustained (T-30 to T-14), 50% closing window (T-14 to polling day).",
      },
      {
        name: "Stay inside Special Ad Category + Ad Library, then archive",
        text: "Keep every ad within Meta's Special Ad Category — no protected-trait targeting — and remember all political ads are archived in Meta's public Ad Library for years, so write and target assuming full visibility. Save all creative, targeting, and spend to a candidate archive; BD has no BCRA-equivalent disclosure yet, but expect a request from the EC — have it ready.",
      },
    ],
    glossaryRefs: ["ad-authorization", "paid-for-by-disclaimer", "special-ad-category", "constituency-targeting", "meta-conversions-api"],
    groundingRefs: ["political-pr", "paid-ads"],
    ready: true,
    datePublished: "2026-07-17",
  },
  {
    slug: "meta-conversions-api-setup",
    title: "Set up Meta Conversions API for a Bangladesh e-commerce site",
    description:
      "Recover the 30–50% of conversion signal lost to iOS ATT and ad blockers. Walkthrough of server-side event tracking via Meta CAPI on a Next.js / Shopify / WooCommerce stack.",
    answer:
      "Meta Conversions API is server-to-server event tracking from your site to Meta — recovering the 30–50% of conversion signal that browser pixels lose to iOS ATT and ad blockers. Setup is one-time, takes about an hour, and is essential for Bangladesh e-commerce where COD pushes the last-mile event off-site entirely.",
    totalTime: "PT1H",
    tools: ["Meta Events Manager", "Meta Business Suite", "Server-side webhook"],
    prerequisites: [
      "Existing Meta Pixel installed",
      "Server-side language access (Node, PHP, Python — any HTTP-capable runtime)",
      "Access token from Meta Events Manager",
    ],
    steps: [
      {
        name: "Generate a Conversions API access token",
        text: "Meta Events Manager → Data Sources → your pixel → Settings → Set up manually → Generate access token. Store it in your server secrets (NEVER in client code).",
      },
      {
        name: "Emit events server-side from purchase / lead routes",
        text: "POST /v18.0/{pixel_id}/events with the same event_name + event_id you use client-side. Matching event_ids let Meta dedupe between browser + server events.",
      },
      {
        name: "Hash all PII before sending",
        text: "Email, phone, name fields must be SHA-256 hashed before sending. Meta's docs show the exact normalization (lowercase email, strip whitespace, etc.) — follow it exactly.",
      },
      {
        name: "Verify event match quality in Events Manager",
        text: "Wait 24 hours, then check Events Manager → Overview → Event Match Quality. Target ≥ 7.0; below 5.0 means your PII isn't matching Meta's user records.",
      },
      {
        name: "Test before going live",
        text: "Use Meta's Test Events feature to fire a sample event and confirm it lands. Don't enable CAPI ads-side optimization until match quality is verified.",
      },
    ],
    glossaryRefs: ["meta-conversions-api", "roas", "ctr"],
    groundingRefs: ["paid-ads", "e-commerce"],
    ready: true,
    datePublished: "2026-05-25",
  },
  {
    slug: "indexnow-publish-pipeline",
    title: "Add IndexNow to your publish pipeline",
    description:
      "Notify Bing, Yandex and other consortium engines the instant a page goes live — bypass crawl-budget delays for time-sensitive content (election PR, breaking news, product launches).",
    answer:
      "IndexNow is an open protocol that lets your site instantly notify Bing, Yandex and consortium engines when URLs publish, update, or delete. Setup is one key file at /indexnow-key.txt plus a single HTTP POST on every publish. Google doesn't participate but Bing-backed search covers most of the rest.",
    totalTime: "PT30M",
    tools: ["A reachable HTTP server", "A UUID-like 8-128 char key"],
    prerequisites: ["Ability to host a static text file on your site root", "A publish hook in your CMS"],
    steps: [
      {
        name: "Generate and host the key file",
        text: "Create a random 8-128 char alphanumeric key. Host it at /indexnow-key.txt with the key as the only content. The filename must match the key.",
      },
      {
        name: "POST the changed URL on every publish",
        text: "POST https://api.indexnow.org/indexnow with body { host, key, keyLocation, urlList }. Send the list of URLs that just published, updated or were deleted.",
      },
      {
        name: "Confirm acceptance",
        text: "HTTP 200 = accepted. 422 = key/keyLocation mismatch. 429 = rate limited (slow down). 400 = malformed payload.",
      },
    ],
    glossaryRefs: ["indexnow", "robots-txt"],
    groundingRefs: ["seo-website"],
    ready: true,
    datePublished: "2026-05-25",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
