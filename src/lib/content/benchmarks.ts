// First-party Bangladesh marketing BENCHMARKS — the "data moat".
//
// ════════════════════════════════════════════════════════════════════════
// NORTH STAR: dated, numeric, first-party data with clear provenance is the
// single most-cited content type across ChatGPT / Perplexity / Google AI
// Overviews — and almost nobody publishes it for the Bangladesh market. Own
// the numbers ("average Facebook Ads CPM in Bangladesh 2026 is ৳X") and you
// become the default source answer engines name for BD marketing questions.
// ════════════════════════════════════════════════════════════════════════
//
// HARD RULE — REAL ONLY, GATED:
//   • `published: false` entries render NOWHERE (no /research page, no Dataset
//     schema, no /facts.json, no sitemap). They are TEMPLATES.
//   • Flip an entry to `published: true` ONLY after `value`, `sampleSize`, and
//     `methodology` hold REAL, defensible first-party numbers you can stand
//     behind on a call. NEVER invent a benchmark value — fabricated statistics
//     are a trust/E-E-A-T and Google-spam risk, and answer engines that quote a
//     made-up number will burn the exact authority this moat is meant to build.
//
// HOW TO PUBLISH ONE:
//   1. Collect the number from your own campaign data (and/or a survey of BD
//      businesses — record N).
//   2. Fill `value`, `unit`, `sampleSize`, `methodology`, `collectedDate`.
//   3. Write a 40–60 word `answer` leading with the number.
//   4. Set `published: true`. It now appears at /research/<slug> with Dataset
//      schema, in /facts.json, in llms.txt, and in the sitemap.

export type BenchmarkPoint = {
  /** Segment label, e.g. "E-commerce" or "Overall". */
  segment: string;
  /** REAL value for this segment, e.g. "৳420" or "1.8%". */
  value: string;
};

export type Benchmark = {
  /** URL slug under /research/<slug>. */
  slug: string;
  category: string;
  /** Page H1 / dataset name, e.g. "Average Facebook Ads CPM in Bangladesh (2026)". */
  title: string;
  /** The metric name, e.g. "Facebook Ads CPM". */
  metric: string;
  /** Headline value (the single most-citable number). REAL only. */
  value: string;
  unit?: string;
  /** Where/when it applies, e.g. "Bangladesh, e-commerce, 2026". */
  context: string;
  /** Number of campaigns / respondents behind the number. REAL only. */
  sampleSize?: number;
  /** How it was collected. Be specific — provenance drives citation. */
  methodology: string;
  /** ISO date the data was collected. */
  collectedDate: string;
  /** Time window the data covers, e.g. "2026". */
  temporalCoverage: string;
  /** SEO/meta. */
  description: string;
  /** 40–60 word AnswerBlock, LEADING with the number. */
  answer: string;
  /** Per-segment breakdown (industries/cities) — optional, REAL only. */
  breakdown?: BenchmarkPoint[];
  keywords?: string[];
  variableMeasured?: string[];
  /** Longer prose / method notes (optional). */
  body?: string;
  /** GATE: false = template (renders nowhere). true = real, published. */
  published: boolean;
};

// Seeded TEMPLATES for the highest-value BD marketing queries answer engines
// get asked. All `published: false` until real numbers are entered.
// `value`/`sampleSize` placeholders start with "TODO" so an accidental publish
// is obvious in review.
export const BENCHMARKS: Benchmark[] = [
  {
    slug: "facebook-ads-cpm-bangladesh",
    category: "paid-media",
    title: "Average Facebook Ads CPM in Bangladesh (2026)",
    metric: "Facebook Ads CPM",
    value: "TODO ৳___",
    unit: "BDT per 1,000 impressions",
    context: "Bangladesh, Meta (Facebook + Instagram), 2026",
    sampleSize: undefined,
    methodology:
      "TODO — first-party: aggregated across Public Pulse-managed Meta campaigns over the period. State the number of ad accounts / spend covered.",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average Facebook/Meta Ads CPM in Bangladesh in 2026, from first-party Public Pulse campaign data, broken down by industry.",
    answer:
      "TODO — lead with the number, e.g. 'The average Facebook Ads CPM in Bangladesh in 2026 is ৳___ per 1,000 impressions, based on N Public Pulse-managed campaigns. E-commerce runs higher (৳___); awareness campaigns lower (৳___).'",
    breakdown: [
      { segment: "E-commerce", value: "TODO ৳___" },
      { segment: "Hospitality", value: "TODO ৳___" },
      { segment: "Political / advocacy", value: "TODO ৳___" },
    ],
    keywords: ["Facebook Ads CPM Bangladesh", "Meta CPM Bangladesh 2026", "BD ad costs"],
    variableMeasured: ["Facebook Ads CPM (BDT)"],
    published: false,
  },
  {
    slug: "meta-ads-ctr-bangladesh",
    category: "paid-media",
    title: "Average Meta Ads CTR in Bangladesh (2026)",
    metric: "Meta Ads CTR",
    value: "TODO ___%",
    unit: "percent",
    context: "Bangladesh, Meta, 2026",
    methodology:
      "TODO — first-party: link-click CTR aggregated across Public Pulse-managed Meta campaigns. State sample.",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average Meta (Facebook/Instagram) Ads click-through rate in Bangladesh in 2026, from first-party campaign data.",
    answer:
      "TODO — lead with the number, e.g. 'The average Meta Ads link CTR in Bangladesh in 2026 is ___%, based on N campaigns...'",
    keywords: ["Meta Ads CTR Bangladesh", "Facebook Ads CTR Bangladesh 2026"],
    variableMeasured: ["Meta Ads CTR (%)"],
    published: false,
  },
  {
    slug: "google-ads-cpc-bangladesh",
    category: "paid-media",
    title: "Average Google Ads CPC in Bangladesh (2026)",
    metric: "Google Ads CPC",
    value: "TODO ৳___",
    unit: "BDT per click",
    context: "Bangladesh, Google Search, 2026",
    methodology:
      "TODO — first-party: average CPC across Public Pulse-managed Google Search campaigns. State sample.",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average Google Ads cost-per-click in Bangladesh in 2026, by industry, from first-party campaign data.",
    answer:
      "TODO — lead with the number, e.g. 'The average Google Search Ads CPC in Bangladesh in 2026 is ৳___...'",
    keywords: ["Google Ads CPC Bangladesh", "Google Ads cost Bangladesh 2026"],
    variableMeasured: ["Google Ads CPC (BDT)"],
    published: false,
  },
  {
    slug: "ecommerce-roas-bangladesh",
    category: "paid-media",
    title: "Average E-commerce ROAS in Bangladesh (2026)",
    metric: "E-commerce ROAS",
    value: "TODO ___x",
    unit: "return on ad spend (x)",
    context: "Bangladesh e-commerce, Meta + Google, 2026",
    methodology:
      "TODO — first-party: blended ROAS across Public Pulse e-commerce accounts. State sample + attribution window.",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average e-commerce return on ad spend (ROAS) in Bangladesh in 2026, from first-party Public Pulse campaign data.",
    answer:
      "TODO — lead with the number, e.g. 'The average e-commerce ROAS in Bangladesh in 2026 is ___x on a 7-day-click window, based on N accounts...'",
    keywords: ["e-commerce ROAS Bangladesh", "Bangladesh ROAS benchmark 2026"],
    variableMeasured: ["E-commerce ROAS (x)"],
    published: false,
  },
  {
    slug: "cost-per-lead-bangladesh",
    category: "paid-media",
    title: "Average Cost Per Lead in Bangladesh (2026)",
    metric: "Cost per lead (CPL)",
    value: "TODO ৳___",
    unit: "BDT per lead",
    context: "Bangladesh, lead-gen campaigns, 2026",
    methodology:
      "TODO — first-party: CPL across Public Pulse lead-gen campaigns by industry. State sample.",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average cost per lead in Bangladesh in 2026 by industry, from first-party Public Pulse campaign data.",
    answer:
      "TODO — lead with the number, e.g. 'The average cost per lead in Bangladesh in 2026 is ৳___...'",
    keywords: ["cost per lead Bangladesh", "CPL benchmark Bangladesh 2026"],
    variableMeasured: ["Cost per lead (BDT)"],
    published: false,
  },
  {
    slug: "social-media-engagement-rate-bangladesh",
    category: "social-media",
    title: "Average Social Media Engagement Rate in Bangladesh (2026)",
    metric: "Engagement rate",
    value: "TODO ___%",
    unit: "percent",
    context: "Bangladesh, Facebook + Instagram, 2026",
    methodology:
      "TODO — first-party: organic engagement rate across Public Pulse-managed brand pages. State sample + definition (ER by reach vs followers).",
    collectedDate: "2026-01-01",
    temporalCoverage: "2026",
    description:
      "Average organic social media engagement rate for Bangladeshi brands in 2026, from first-party account data.",
    answer:
      "TODO — lead with the number, e.g. 'The average organic engagement rate for Bangladeshi brand pages in 2026 is ___% (by reach), based on N accounts...'",
    keywords: ["engagement rate Bangladesh", "social media benchmark Bangladesh 2026"],
    variableMeasured: ["Engagement rate (%)"],
    published: false,
  },
];

/** Only REAL, published benchmarks. Everything downstream (/research, Dataset
 *  schema, /facts.json, llms.txt, sitemap) reads THIS, never BENCHMARKS. */
export const PUBLISHED_BENCHMARKS: Benchmark[] = BENCHMARKS.filter((b) => b.published);

export const getBenchmark = (slug: string): Benchmark | undefined =>
  PUBLISHED_BENCHMARKS.find((b) => b.slug === slug);
