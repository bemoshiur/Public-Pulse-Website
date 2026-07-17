// /compare/<slug> pages — in-house vs agency, channel comparisons,
// tool vs tool. Each compare seeds an Article with FAQPage + AnswerBlock.

export type ComparePoint = { dimension: string; left: string; right: string };
export type Compare = {
  slug: string;
  title: string;
  description: string;
  answer: string;
  leftLabel: string;
  rightLabel: string;
  points: ComparePoint[];
  /** Plain-prose recommendation. */
  recommendation: string;
  glossaryRefs?: string[];
  groundingRefs: string[];
  ready: boolean;
  datePublished: string;
};

export const COMPARES: Compare[] = [
  {
    slug: "agency-vs-in-house-marketing-bangladesh",
    title: "Agency vs in-house marketing team — which makes sense for a Bangladesh brand?",
    description:
      "Honest side-by-side comparison: cost, speed, range of skills, accountability, and brand control for an in-house marketing team vs an integrated agency in Bangladesh.",
    answer:
      "Below BDT 5 lakh/month total marketing spend, an integrated agency is more honest economically — you get strategy + creative + paid + analytics for the salary of one mid-level manager. Above BDT 15 lakh/month with stable channel mix, in-house starts to win on speed-of-iteration and brand depth.",
    leftLabel: "Integrated Agency (Public Pulse)",
    rightLabel: "In-house Marketing Team",
    points: [
      {
        dimension: "Monthly cost (entry)",
        left: "BDT 75k–150k retainer covers strategy + 2-3 channels + reporting",
        right: "BDT 80k+ for one mid-level manager (no creative, no media-buy depth)",
      },
      {
        dimension: "Range of skills on day 1",
        left: "Strategy, creative, paid, content, PR, analytics — same room",
        right: "Whatever the one person knows; gaps need 2-3 more hires",
      },
      {
        dimension: "Speed to launch a campaign",
        left: "Days to weeks — playbooks already exist from other clients",
        right: "Weeks to months for first hire to build internal process",
      },
      {
        dimension: "Brand depth (12+ months in)",
        left: "Good, but capped — agency knows BD market but not your specific muscle memory",
        right: "Wins on depth — internal team lives the brand daily",
      },
      {
        dimension: "Accountability when things break",
        left: "One client lead owns the relationship + the KPI",
        right: "Internal politics + reporting lines can fuzz it",
      },
    ],
    recommendation:
      "Start with an agency until you've validated the channel mix and have stable monthly spend > BDT 10 lakh. Hire in-house for ownership of the muscles you'll exercise weekly; keep the agency for specialist surges (political PR cycles, brand re-launches).",
    glossaryRefs: ["roas"],
    groundingRefs: ["brand-building", "paid-ads"],
    ready: true,
    datePublished: "2026-05-25",
  },
  {
    slug: "facebook-vs-google-ads-bangladesh",
    title: "Facebook Ads vs Google Ads — which works better in Bangladesh?",
    description:
      "Channel comparison for paid-ads spend in Bangladesh: Meta's reach + creator culture vs Google's intent + search demand. Cost, audience, creative requirements per platform.",
    answer:
      "Facebook still drives more reach + conversions for most Bangladesh consumer brands because of dominant social usage + DTC + Foodpanda-style discovery. Google Ads outperforms for high-intent verticals (B2B, real estate, education enquiry, healthcare appointments) where someone is actively searching.",
    leftLabel: "Facebook / Meta Ads",
    rightLabel: "Google Ads (Search + YouTube)",
    points: [
      {
        dimension: "Best for",
        left: "Discovery, brand-building, lower-intent conversion, video-led storytelling",
        right: "High-intent capture — someone already searching for what you sell",
      },
      {
        dimension: "Audience reach in BD",
        left: "~45M+ active Bangladeshi users; near-universal mobile reach",
        right: "Wide but more transactional; YouTube ~50M+ but skews younger urban",
      },
      {
        dimension: "Creative format",
        left: "Heavy video + carousel + lifestyle imagery",
        right: "Plain-text search ads + responsive display + YouTube video",
      },
      {
        dimension: "Typical entry CPC",
        left: "BDT 3-15 depending on audience + creative quality",
        right: "BDT 10-100 depending on keyword competition",
      },
      {
        dimension: "Signal loss to iOS / blockers",
        left: "Significant; mitigated by Meta Conversions API",
        right: "Lower; Google's own tag handles most signal natively",
      },
    ],
    recommendation:
      "Run both. Use Facebook for top-of-funnel discovery + retargeting; use Google Search for the last-mile high-intent click. Split budget 70/30 (FB/Google) for most consumer brands, flipped 30/70 for high-intent B2B/services.",
    glossaryRefs: ["roas", "ctr", "meta-conversions-api"],
    groundingRefs: ["paid-ads"],
    ready: true,
    datePublished: "2026-05-25",
  },
  {
    slug: "boosting-vs-ads-manager-political",
    title: "Boosting vs Ads Manager for political campaigns in Bangladesh",
    description:
      "For a Bangladeshi candidate, when should you boost a Facebook post and when do you need a full Ads Manager campaign? A practical, compliance-first comparison.",
    answer:
      "For a political campaign in Bangladesh, Ads Manager is the engine and boosting is the moment-rider. Ads Manager gives real audiences, message variants, frequency control, and daily optimization; boosting just amplifies one post fast. Both are only legitimate from an authorized, disclaimed account. Most winning constituencies use both — Ads Manager to carry the message, boosting to ride a spike.",
    leftLabel: "Boosting",
    rightLabel: "Ads Manager",
    points: [
      {
        dimension: "Control",
        left: "One tap on a page post; almost no settings",
        right: "Full control of objective, placements, schedule, and budget pacing",
      },
      {
        dimension: "Targeting",
        left: "Basic location + a few interests",
        right: "Constituency-tuned geography + affinity within Special Ad Category limits",
      },
      {
        dimension: "Message testing",
        left: "One creative, no real testing",
        right: "Multiple variants tested against the same audience — find what moves the seat",
      },
      {
        dimension: "Frequency",
        left: "No frequency control — can burn the audience",
        right: "Frequency capped so you don’t exhaust or annoy voters",
      },
      {
        dimension: "Cost efficiency",
        left: "Fine for a short amplify; wasteful as a whole strategy",
        right: "Budget reallocates daily toward the wards, messages, and hours that perform",
      },
      {
        dimension: "Compliance",
        left: "Still needs authorization + “Paid for by” — no exceptions for boosts",
        right: "Same authorization + disclaimer; more room to run it cleanly",
      },
    ],
    recommendation:
      "Run Ads Manager as the campaign engine — audiences, variants, frequency, daily optimization — and use boosting sparingly to amplify a moment that’s already working. Neither is legitimate without Meta ad authorization and a “Paid for by” disclaimer. If your budget or timeline only allows one, and you’re past the amplify-a-moment stage, choose Ads Manager.",
    glossaryRefs: ["boosted-post", "ad-authorization", "special-ad-category", "constituency-targeting"],
    groundingRefs: ["paid-ads", "political-pr"],
    ready: true,
    datePublished: "2026-07-17",
  },
];

export function getCompare(slug: string): Compare | undefined {
  return COMPARES.find((c) => c.slug === slug);
}
