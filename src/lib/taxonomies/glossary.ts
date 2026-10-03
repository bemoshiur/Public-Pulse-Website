// Digital marketing + political PR glossary, EN+BN entries.
// Powers /glossary (DefinedTermSet hub) and /glossary/<slug> (DefinedTerm).
// Cited by service / blog / guide pages via the GlossaryLink component.

export type GlossaryTerm = {
  slug: string;
  /** Display term (English). */
  name: string;
  /** Bangla equivalent — used for hand-authored bn glossary entries. */
  nameBn?: string;
  /** Definition (1–2 sentences). Schema.org best practice: keep short. */
  definition: string;
  /** Longer-form explanation for the /glossary/<slug> body. */
  body: string;
  /** Subject area (used to group terms in the index). */
  area: "Digital Marketing" | "Political PR" | "Paid Media" | "SEO" | "Branding" | "Analytics";
  /** Related term slugs (used for in-glossary cross-links). */
  see?: string[];
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "answer-block",
    name: "Answer Block",
    nameBn: "উত্তর ব্লক",
    area: "SEO",
    definition:
      "An answer block is a short, self-contained answer of 40–60 words placed at the top of a long-form page. AI engines such as Google AI Overviews, ChatGPT, Claude and Perplexity can lift it verbatim, so it gives them a complete, citable answer in the page's first viewport instead of synthesizing one from elsewhere.",
    body:
      "Answer blocks are the most important AEO/GEO surface on a content page. They give AI engines a complete, citable answer in the page's first viewport so the engine doesn't synthesize one from elsewhere. Public Pulse renders every long-form page's answer block inside a <section class='answer-block' data-speakable> wrapper so the Article JSON-LD's `speakable` cssSelector can target it.",
    see: ["faqpage-schema", "speakable", "geo"],
  },
  {
    slug: "aeo",
    name: "AEO (Answer Engine Optimization)",
    nameBn: "উত্তর ইঞ্জিন অপ্টিমাইজেশন",
    area: "SEO",
    definition:
      "Answer Engine Optimization is the practice of structuring a page so AI-driven answer engines, including Google AI Overviews, Bing Copilot and voice assistants, cite it as the source for direct answers. It combines answer-first prose with explicit JSON-LD, such as FAQPage, HowTo or DefinedTerm, and factual accuracy.",
    body:
      "AEO is the second-generation evolution of SEO. The win-state is no longer the blue link click; it's the citation inside an AI-generated answer. AEO works by combining clear answer-first prose (see Answer Block), explicit JSON-LD with the right @type for the question (FAQPage, HowTo, DefinedTerm), and being the most factually accurate source in your domain so the engine prefers you.",
    see: ["geo", "answer-block", "schema-jsonld"],
  },
  {
    slug: "geo",
    name: "GEO (Generative Engine Optimization)",
    nameBn: "জেনারেটিভ ইঞ্জিন অপ্টিমাইজেশন",
    area: "SEO",
    definition:
      "Generative Engine Optimization is the practice of making a page easy for generative engines such as ChatGPT, Claude, Perplexity and Gemini to ground their answers in. It requires content that LLM crawlers like GPTBot, ClaudeBot and PerplexityBot can index, written with specific dated facts and plain-language explainers.",
    body:
      "GEO is what happens after AEO: the engine isn't just citing you, it's grounding its entire generated answer in your prose. The unlock is making sure your content is indexable by the LLM crawlers (GPTBot, ClaudeBot, PerplexityBot — see robots.txt) AND making the content easy to ground in (specific dated facts, plain-language explainers, glossary cross-links).",
    see: ["aeo", "llms-txt", "robots-txt"],
  },
  {
    slug: "faqpage-schema",
    name: "FAQPage Schema",
    nameBn: "FAQPage স্কিমা",
    area: "SEO",
    definition:
      "FAQPage is a schema.org JSON-LD type that marks up a page's FAQ section, telling search engines exactly which question and answer pairs to consider for rich snippets and AI citations. Each pair should match how real users phrase their queries: short, conversational and written in their own language.",
    body:
      "Every long-form Public Pulse page emits FAQPage JSON-LD with at least 3 Question + Answer pairs (a HARD gate in the quality pipeline). The questions should match how real users phrase their queries — short, conversational, in their language — not how an SEO team would phrase a keyword.",
    see: ["schema-jsonld", "answer-block"],
  },
  {
    slug: "schema-jsonld",
    name: "JSON-LD Schema",
    nameBn: "JSON-LD স্কিমা",
    area: "SEO",
    definition:
      "JSON-LD schema is structured data embedded in a <script type='application/ld+json'> tag that describes a page's entities, such as Service, Article, Organization and FAQPage, for machines. Valid markup uses stable @id URIs that cross-reference the Organization, because field omissions silently remove a page's eligibility for rich results.",
    body:
      "Public Pulse uses typed builders in src/lib/schema.ts so every page emits valid JSON-LD with stable @id URIs that cross-reference Organization. Hand-rolling JSON-LD is banned because field omissions silently kill rich-result eligibility.",
  },
  {
    slug: "llms-txt",
    name: "llms.txt",
    nameBn: "llms.txt",
    area: "SEO",
    definition:
      "llms.txt is a plain-text file at /llms.txt that gives AI engines a curated, link-rich summary of a site to ground from, analogous to robots.txt for crawlers. It follows the llmstxt.org convention, and a companion /llms-full.txt carries the concatenated full text. Both should serve HTTP 200 directly, never redirects.",
    body:
      "llms.txt follows the llmstxt.org convention. Public Pulse publishes both /llms.txt (curated index) and /llms-full.txt (concatenated full-text). Both serve HTTP 200 directly, never redirects.",
    see: ["geo", "robots-txt"],
  },
  {
    slug: "robots-txt",
    name: "robots.txt",
    nameBn: "robots.txt",
    area: "SEO",
    definition:
      "robots.txt is a plain-text file at /robots.txt that tells crawlers which paths they are allowed to fetch. It can explicitly allow named crawlers, such as GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bingbot, and disallow private paths like /manage. Allowing AI crawlers is a deliberate choice so pages can be cited in AI answers.",
    body:
      "Public Pulse's robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bingbot for the public site, and explicitly disallows /manage and /api/auth. The AI-crawler allow-list is intentional — we want our pages cited in AI answers.",
  },
  {
    slug: "speakable",
    name: "Speakable",
    nameBn: "স্পিকেবল",
    area: "SEO",
    definition:
      "Speakable is a schema.org property on Article that tells voice assistants such as Google Assistant and Alexa which CSS selector contains the answer to read aloud. Setting speakable.cssSelector to ['.answer-block'] points them at a 40–60 word answer block rather than random body copy, so the class name must stay in sync with the schema.",
    body:
      "Public Pulse Article schema sets `speakable.cssSelector: ['.answer-block']` so the assistant reads our 40–60 word answer block, not random body copy. Don't rename the .answer-block class without updating src/lib/schema.ts.",
  },
  {
    slug: "political-pr",
    name: "Political PR",
    nameBn: "রাজনৈতিক জনসংযোগ",
    area: "Political PR",
    definition:
      "Political PR is the public communications strategy for political candidates, parties and elected officials, covering candidate image-building, narrative engineering, opposition research and crisis communications. In Bangladesh it runs on a five-phase election cycle: pre-campaign positioning, ground research, narrative launch, polling-day execution and post-election PR. Public Pulse runs all five phases.",
    body:
      "In Bangladesh, political PR runs on a five-phase election cycle: pre-campaign positioning, ground research, narrative launch, polling-day execution, post-election PR. Public Pulse runs all five.",
    see: ["narrative-engineering", "opposition-research"],
  },
  {
    slug: "narrative-engineering",
    name: "Narrative Engineering",
    nameBn: "ন্যারেটিভ ইঞ্জিনিয়ারিং",
    area: "Political PR",
    definition:
      "Narrative engineering is the deliberate construction of a campaign's core message, tested against constituency demographics and refined for sticking power. A narrative is not a slogan but a story arc: what the candidate stands for, what they oppose and what changes if they win, built to be retold by voters in their own words.",
    body:
      "A narrative isn't a slogan. It's a story arc — what the candidate stands for, what they're against, what changes if they win — engineered to be retold by voters in their own words. We test narratives in field interviews before committing media spend.",
    see: ["political-pr"],
  },
  {
    slug: "opposition-research",
    name: "Opposition Research",
    nameBn: "অপজিশন রিসার্চ",
    area: "Political PR",
    definition:
      "Opposition research is the systematic gathering of intelligence on an opponent's record, statements, vulnerabilities and likely lines of attack. Done responsibly, it relies on published statements, public records and verifiable claims. It is used to anticipate threats and to brief the candidate's own counter-messaging, never to seed disinformation.",
    body:
      "Done responsibly: published statements, public records, verifiable claims. Used to prepare the candidate, NOT to seed disinformation. Public Pulse maintains an internal ethics standard on what we publish vs what we only brief the candidate on.",
    see: ["political-pr"],
  },
  {
    slug: "meta-conversions-api",
    name: "Meta Conversions API (CAPI)",
    nameBn: "মেটা কনভার্সন এপিআই",
    area: "Paid Media",
    definition:
      "Meta Conversions API (CAPI) is server-to-server event tracking that sends conversions from a site or CRM to Meta's ad platform, recovering signal lost to iOS ATT and ad blockers. Because browser-side pixel firing drops 30–50% or more of events after iOS 14.5, sending the same events from the server gives Meta's bidding a more complete signal.",
    body:
      "Browser-side Meta Pixel firing drops 30–50%+ of events post-iOS-14.5. CAPI sends the same events from your server so Meta's bidding has a more complete signal. Public Pulse implements both pixel + CAPI on every e-commerce build.",
    see: ["roas"],
  },
  {
    slug: "roas",
    name: "ROAS (Return on Ad Spend)",
    nameBn: "বিজ্ঞাপন ব্যয়ের উপর রিটার্ন",
    area: "Paid Media",
    definition:
      "ROAS, or Return on Ad Spend, is the revenue generated for every BDT spent on advertising; a ROAS of 4× means BDT 4 of revenue per BDT 1 of ad spend. It is the headline metric for e-commerce paid media, but in isolation it can mislead, so it should be read alongside the new-versus-returning customer split.",
    body:
      "ROAS is the headline metric for e-commerce paid media. The trap: it's a vanity metric in isolation — high ROAS with declining new-customer share is a slow death. Public Pulse reports ROAS alongside new-vs-returning split and contribution-margin ROAS (revenue minus COGS minus ad spend).",
  },
  {
    slug: "ctr",
    name: "CTR (Click-Through Rate)",
    nameBn: "ক্লিক-থ্রু রেট",
    area: "Paid Media",
    definition:
      "Click-through rate (CTR) is the fraction of ad impressions that became clicks, calculated as clicks ÷ impressions × 100. Benchmarks vary by placement: a 1% CTR on Meta feed is industry average, while the same figure on a search ad is poor. CTR works as a creative-quality signal, but downstream conversion rate is the goal.",
    body:
      "Benchmark CTRs vary wildly by placement: a 1% CTR on Meta feed is industry-average; the same on a search ad is poor. CTR matters as a creative-quality signal but isn't the goal — conversion rate downstream is.",
  },
  {
    slug: "indexnow",
    name: "IndexNow",
    nameBn: "ইনডেক্সনাও",
    area: "SEO",
    definition:
      "IndexNow is an open protocol that lets a site instantly notify participating search engines, including Bing, Yandex and Seznam, when a URL is published, updated or deleted, bypassing crawl-budget delays. Google does not participate, but the major Bing-backed engines do, so publishers send the affected URLs on every publish action.",
    body:
      "Public Pulse pings IndexNow on every /manage publish action with the affected URLs. Google does not participate but the major Bing-backed engines do. Our key file lives at /indexnow-key.txt.",
    see: ["robots-txt"],
  },
  {
    slug: "speakable-schema",
    name: "Speakable Schema",
    nameBn: "স্পিকেবল স্কিমা",
    area: "SEO",
    definition:
      "Speakable schema is the schema.org SpeakableSpecification, placed on Article or WebPage JSON-LD with a cssSelector that points voice assistants at the prose they should read aloud as the answer. The selector should target a 40–60 word self-contained answer, because longer passages get truncated mid-sentence on the device.",
    body:
      "Speakable schema is the voice-assistant cousin of FAQPage. Google Assistant and Alexa pick the cssSelector you provide (Public Pulse uses ['.answer-block']) and read it verbatim. The selector should target a 40–60 word self-contained answer; longer passages get truncated mid-sentence on the device. We render every long-form page's answer block inside <section class='answer-block' data-speakable> so the selector matches deterministically.",
    see: ["answer-block", "aeo", "schema-jsonld"],
  },
  {
    slug: "first-party-data",
    name: "First-Party Data",
    nameBn: "ফার্স্ট-পার্টি ডেটা",
    area: "Analytics",
    definition:
      "First-party data is customer data a business collected directly from its own site, app, CRM, point-of-sale or call centre, as opposed to third-party data bought from brokers or rented from ad platforms. It is the strategic asset for Bangladeshi brands as Meta and Google narrow third-party signal through iOS ATT and cookie deprecation.",
    body:
      "First-party data is the strategic asset for Bangladeshi brands as Meta and Google narrow third-party signal (iOS ATT, third-party cookie deprecation). The unlock is a clean Customer ID linked across web, Bkash/Nagad transactions, and WhatsApp inbox so you can build audiences and lookalikes inside Meta CAPI / Google Enhanced Conversions without leaking PII. Public Pulse implements first-party data layers as the foundation of every analytics rebuild.",
    see: ["meta-conversions-api", "attribution-window"],
  },
  {
    slug: "attribution-window",
    name: "Attribution Window",
    nameBn: "অ্যাট্রিবিউশন উইন্ডো",
    area: "Analytics",
    definition:
      "The look-back period an ad platform credits an ad with a conversion — e.g. a 7-day-click 1-day-view window means Meta will count a purchase as the ad's outcome if it happens within 7 days of a click or 1 day of a view.",
    body:
      "Attribution windows are the single most over-looked lever in Bangladeshi paid media reporting. Meta defaults to 7-day-click; a hospitality brand selling 30-day-booking-window resorts is invisible under that default. Public Pulse audits attribution windows before every reporting setup and reconciles to first-party booking data so ROAS reflects reality, not the platform's default look-back. Mixing windows across channels — Google's data-driven model vs Meta's 7-day-click — produces double-counting at the campaign-mix level; we normalize.",
    see: ["roas", "first-party-data"],
  },
  {
    slug: "engagement-rate",
    name: "Engagement Rate",
    nameBn: "এনগেজমেন্ট রেট",
    area: "Digital Marketing",
    definition:
      "Engagement rate is the fraction of an audience that interacted with a piece of content through likes, comments, shares, saves or click-throughs, usually expressed as engagements ÷ reach × 100. It is the dominant proxy for organic content health on Facebook and Instagram, and should be kept separate from paid CTR and conversion rate.",
    body:
      "Engagement rate is the dominant proxy metric on Bangladeshi Facebook and Instagram for organic content health. Healthy benchmarks: 2–5% on Facebook, 3–6% on Instagram for branded posts in the BD market; influencer rates run higher (5–12%). The trap is using ER alone to evaluate paid creative — paid CTAs depress ER mechanically while driving the actual KPI. Public Pulse separates organic ER (community signal) from paid CTR / conversion rate (commercial signal) in every monthly report.",
    see: ["ctr", "roas"],
  },
  {
    slug: "core-web-vitals",
    name: "Core Web Vitals",
    nameBn: "কোর ওয়েব ভাইটালস",
    area: "SEO",
    definition:
      "Core Web Vitals are Google's three page-experience metrics: LCP (largest contentful paint, load speed), INP (interaction to next paint, responsiveness) and CLS (cumulative layout shift, visual stability). They act as a ranking signal and appear in Search Console. Pass thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.",
    body:
      "Core Web Vitals matter twice in Bangladesh: as a ranking signal Google demonstrably uses, and as a UX-on-3G signal that dominates conversion for hospitality, real estate, and e-commerce sites where buyers research on phones over patchy networks. Pass-thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Public Pulse's standard build (Next.js + OpenNext + CloudFront with AVIF/WebP image responses) ships green CWV on a Bangladeshi 4G device out of the box; the failure mode is usually heavy embeds added later (chat widgets, slow Tag Manager containers).",
    see: ["aeo", "geo"],
  },
  {
    slug: "conversion-api",
    name: "Conversion API",
    nameBn: "কনভার্সন এপিআই",
    area: "Paid Media",
    definition:
      "A conversion API is a server-to-server event protocol, such as Meta's Conversions API, Google's Enhanced Conversions or TikTok's Events API, that sends conversion data from the brand's server straight to the ad platform. It bypasses browser tracking that iOS ATT and ad blockers degrade, restoring 30–50% of the lost conversion signal.",
    body:
      "Conversion API is one of two technical lifts every Bangladeshi e-commerce stack must do post-iOS-14.5 (the other is first-party data). Server-side events restore 30–50% of the conversion signal lost from browser-side pixels. Public Pulse implements Meta CAPI alongside the browser pixel (dedup by event_id), so the platform sees both signals and Meta's bidding has clean attribution. Without CAPI, Meta's algorithm optimizes against a partial dataset and CPA inflates 20–40% over a 6-month decay curve.",
    see: ["meta-conversions-api", "first-party-data", "roas"],
  },
  {
    slug: "boosted-post",
    name: "Boosted Post",
    nameBn: "বুস্টেড পোস্ট",
    area: "Paid Media",
    definition:
      "A boosted post is a Facebook or Instagram post that is paid to reach more people, making it the simplest Meta ad. It offers limited targeting, one creative and no frequency control. When the content is political, a boosted post still requires ad authorization and a “Paid for by” disclaimer.",
    body:
      "Boosting is where almost every Bangladeshi candidate starts, because it is one tap from a page post. It is fast and blunt: limited targeting, one creative, no message testing, no frequency control. It works to amplify a moment that is already resonating — a rally clip, a local win — but it does not carry a message through a constituency the way an Ads Manager campaign does. Crucially, boosting political content without completing Meta’s authorization and disclaimer is a policy violation that gets ads rejected and pages restricted. Public Pulse boosts only from authorized, disclaimed accounts, and only when a boost is genuinely the right tool.",
    see: ["ad-authorization", "paid-for-by-disclaimer", "special-ad-category"],
  },
  {
    slug: "ad-authorization",
    name: "Ad Authorization",
    nameBn: "বিজ্ঞাপন অনুমোদন",
    area: "Paid Media",
    definition:
      "Ad authorization is Meta’s identity and location verification that an advertiser must complete before running ads about elections, politics or social issues. The advertiser confirms a verified identity and an in-country location and registers who is paying. Without it political ads are rejected, and it can take days to complete.",
    body:
      "Before a single political ad runs, Meta requires the advertiser to confirm a verified identity and an in-country location, and to register who is paying. In Bangladesh this step is the one most local operators skip — and it is exactly why their ads get pulled at the worst moment, often in the final week. Authorization can take days, so Public Pulse completes it per account ahead of the campaign, not at launch. It is the gate the entire operation depends on: no authorization, no compliant reach.",
    see: ["paid-for-by-disclaimer", "special-ad-category", "boosted-post"],
  },
  {
    slug: "paid-for-by-disclaimer",
    name: "“Paid for by” Disclaimer",
    nameBn: "“যার অর্থায়নে” ঘোষণা",
    area: "Paid Media",
    definition:
      "The “Paid for by” disclaimer is the mandatory label on every political ad naming who paid for it. Registered once during authorization on an authorized account, it is then applied automatically to every ad the campaign runs, and it feeds the public Ad Library where anyone can see what a candidate is running.",
    body:
      "Meta requires political ads to carry a visible disclaimer stating who paid. It is registered once during authorization and applied automatically to every ad. The disclaimer is not a formality — it is what keeps a campaign on the right side of both Meta’s rules and public scrutiny, and it feeds the public Ad Library where anyone can see what a candidate is running. Public Pulse treats the disclaimer as a discipline: if a message could not stand next to the name of who paid for it, it does not run.",
    see: ["ad-authorization", "boosted-post", "constituency-targeting"],
  },
  {
    slug: "special-ad-category",
    name: "Special Ad Category",
    nameBn: "বিশেষ বিজ্ঞাপন শ্রেণি",
    area: "Paid Media",
    definition:
      "Special Ad Category is Meta’s restricted classification for political, electoral and social-issue ads. It limits targeting, so advertisers cannot narrow by age, gender, detailed demographics or many interest traits the way commercial ads allow. Campaigns instead build reach on geography and legitimate affinity, and must be designed to perform inside these limits.",
    body:
      "When an ad is classified as political or social-issue, Meta places it in a Special Ad Category and strips away much of the fine-grained targeting available to commercial advertisers. You cannot narrow by detailed demographics or many interest traits. That sounds like a handicap; in practice it forces the discipline that actually wins constituencies — building reach on geography and legitimate affinity. Public Pulse designs every political campaign to perform inside these limits from the start, rather than fighting them, so nothing is rejected on review.",
    see: ["constituency-targeting", "ad-authorization", "boosted-post"],
  },
  {
    slug: "constituency-targeting",
    name: "Constituency Targeting",
    nameBn: "আসনভিত্তিক টার্গেটিং",
    area: "Paid Media",
    definition:
      "Constituency targeting focuses paid Facebook reach on a specific electoral seat using Meta’s geography and affinity layers, within Special Ad Category limits. It tunes the location radius to union, ward and upazila lines and weights spend toward the pockets that decide the seat, targeting the voters who decide the margin rather than vanity reach.",
    body:
      "A national ad set wastes most of a candidate’s budget on people who cannot vote for them. Constituency targeting tunes the location radius to union, ward, and upazila lines and weights spend toward the pockets that decide the seat. Because political ads sit in the Special Ad Category, this is built on geography and legitimate affinity rather than protected traits. In Bangladesh it also means designing for a mobile, data-light, Bangla-first electorate. Public Pulse targets the seat, tracks reach and frequency against it, and reallocates daily toward the wards that move.",
    see: ["special-ad-category", "paid-for-by-disclaimer", "boosted-post"],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}
