#!/usr/bin/env tsx
//
// Seeds the 4 Political-Facebook-advertising blog cluster posts into Neon.
//
// The blog is DB-backed, so these posts can't ship as code — run this script
// with DATABASE_URL to insert them, then bulk-publish via /manage/blog (they
// seed as status:'review', so nothing goes live automatically).
//
//   DATABASE_URL="postgres://..." npx tsx scripts/seed-political-fb-cluster.ts
//
// Idempotent: re-running skips posts whose (slug, locale) already exist.
// Compliance-anchored, evergreen, real-only (BDT figures are planning ranges).

import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local"), override: true });

type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  answerFirst: string;
  bodyMdx: string;
  tags: string[];
  faqJson: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  targetKeyword: string;
  readingTime: number;
};

const AUTHOR = "moshiur-rahman"; // existing author slug (seed-blog.ts)
const CATEGORY = "political-pr"; // existing blog category
const FLAGSHIP = "/political-facebook-ads-bangladesh";

const POSTS: SeedPost[] = [
  {
    slug: "meta-political-ad-authorization-bangladesh",
    title: "Meta political ad authorization in Bangladesh: the exact steps",
    targetKeyword: "meta political ad authorization bangladesh",
    seoTitle: "Meta Political Ad Authorization in Bangladesh (Steps)",
    seoDescription:
      "How a Bangladeshi candidate or party gets authorized to run political ads on Facebook — identity, location, and the 'Paid for by' disclaimer, step by step.",
    excerpt:
      "Before any political ad runs on Facebook in Bangladesh, Meta requires authorization: a verified identity, a confirmed in-country location, and a registered 'Paid for by' disclaimer. Here's exactly how it works and why it can't wait until launch week.",
    answerFirst:
      "To run political ads on Facebook in Bangladesh you must complete Meta's ad authorization first: confirm a verified identity, confirm an in-country location, and register a 'Paid for by' disclaimer. Only then can a candidate or party run ads about elections or social issues. Unauthorized political ads are rejected and pages get restricted.",
    tags: ["political ads", "meta", "compliance", "facebook", "bangladesh"],
    bodyMdx: [
      "## What is Meta ad authorization, and who needs it?",
      "Meta requires anyone running ads about elections, politics, or social issues to be **authorized** before those ads can run. For a Bangladeshi candidate, party, or the agency running their account, that means proving who you are and where you are, and declaring who is paying. It is not optional and it is not a formality — it is the gate the entire paid operation depends on.",
      "## The steps, in order",
      "1. **Confirm your identity.** Meta verifies a government ID for the person managing the ads. 2. **Confirm your location.** You confirm you are in the country where the ads will run — Bangladesh. 3. **Register the disclaimer.** You set up the '[Paid for by](/glossary/paid-for-by-disclaimer)' label that will appear on every ad, naming who paid. Once registered, it applies automatically to all political ads from that account.",
      "## Why you can't leave this to the final week",
      "Authorization takes time — identity and location checks are not instant, and mistakes send you to the back of the queue. Campaigns that discover this in the final fortnight lose days they cannot afford, or worse, run unauthorized ads that get pulled and put the whole page at risk. The disciplined move is to authorize the account *early*, well before the first taka is spent. This is exactly why our [political Facebook advertising](" + FLAGSHIP + ") process treats authorization as step one, ahead of audience or creative.",
      "## What authorization does not let you do",
      "Being authorized is permission to advertise **compliantly** — not a loophole. Political ads still sit in the [Special Ad Category](/glossary/special-ad-category), which limits targeting, and every ad is archived in Meta's public Ad Library for years. Authorization is the price of running real, legitimate reach; it is not a way around the rules, and nothing about it enables fake engagement or hidden spend.",
    ].join("\n\n"),
    faqJson: [
      { q: "How long does Meta political ad authorization take in Bangladesh?", a: "It varies — identity and location confirmation can take several days, and any mismatch resets the clock. Start weeks before your first ad, not in campaign week." },
      { q: "Do I need authorization just to boost a post?", a: "Yes. Boosting political content is still a political ad — it requires authorization and a 'Paid for by' disclaimer exactly like an Ads Manager campaign." },
      { q: "What happens if we run political ads without authorization?", a: "They get rejected, and repeated attempts can restrict the page and ad account — a catastrophic outcome mid-campaign. Authorize first, always." },
    ],
    readingTime: 4,
  },
  {
    slug: "political-facebook-boost-cost-bangladesh",
    title: "What it costs to boost political posts in Bangladesh (BDT)",
    targetKeyword: "political facebook boost cost bangladesh",
    seoTitle: "Political Facebook Boost Cost in Bangladesh (BDT)",
    seoDescription:
      "How much it costs to boost or advertise political posts on Facebook in Bangladesh — management fees vs media spend, planning ranges in BDT, and what actually drives the number.",
    excerpt:
      "There's no single price to boost a political post in Bangladesh — it splits into media spend (paid to Meta) and management, and the real number depends on the seat, the timeline, and how contested it is. Here are honest planning ranges in BDT.",
    answerFirst:
      "Boosting or advertising political posts on Facebook in Bangladesh has two costs: media spend paid directly to Meta, and a management fee if an agency runs it. Media for a single constituency typically plans at BDT 3–12 lakh over a cycle; agency management commonly starts around BDT 50,000–1,50,000+ per month. The real figure depends on the seat, timeline, and competition.",
    tags: ["political ads", "budget", "pricing", "facebook", "bangladesh"],
    bodyMdx: [
      "## Why there's no single 'boost price'",
      "The question 'how much to boost a political post' hides two very different costs. The first is **media spend** — the money paid to Meta to actually deliver reach. The second is **management** — the work of authorizing the account, building audiences, producing Bangla-first creative, and optimizing daily. Confusing the two is how campaigns overpay for reach they can't use.",
      "## Planning ranges, in taka",
      "These are *illustrative planning ranges*, not a quote or a performance promise:",
      "- **Amplifying a moment (boost desk):** media from ~BDT 50k–2 lakh; light management from ~BDT 50,000/mo.",
      "- **A single constituency campaign (Ads Manager):** media ~BDT 3–12 lakh over the cycle; management from ~BDT 1,50,000/mo.",
      "- **Multi-seat / party push:** scoped per plan; management from ~BDT 3,00,000/mo.",
      "Every real number is built against your specific seat on a briefing call — see the [pricing page](/pricing) and the [flagship](" + FLAGSHIP + ") for the full picture.",
      "## What actually drives the number",
      "Three things move the cost more than anything else: the **size of the constituency** (more voters, more reach to buy), the **timeline** (a late start compresses spend into fewer, more expensive days), and how **contested** the seat is (a real fight needs more frequency and more message testing). A [boost](/glossary/boosted-post) is cheap; a campaign that actually carries a message through a seat is an investment.",
      "## Spend it compliantly or don't spend it",
      "None of this budget is legitimate without [ad authorization](/glossary/ad-authorization) and a 'Paid for by' disclaimer. Money spent on unauthorized political ads is money spent to get your page restricted. Plan the budget, yes — but plan it inside the rules.",
    ].join("\n\n"),
    faqJson: [
      { q: "Is the boost price the same as the agency fee?", a: "No. Media spend is paid to Meta for reach; the agency fee is separate and covers strategy, authorization, creative, and daily optimization." },
      { q: "What's the minimum useful budget for a constituency?", a: "It depends on the seat, but a serious single-constituency Ads Manager operation usually plans media in the BDT 3–12 lakh range over a cycle. Below that, you're amplifying moments, not running a campaign." },
      { q: "Can you just tell me a fixed price?", a: "Not honestly — the number depends on constituency size, timeline, and competition. We build a real figure on a briefing call rather than quote a template." },
    ],
    readingTime: 5,
  },
  {
    slug: "facebook-constituency-targeting-bangladesh",
    title: "Targeting a Bangladesh constituency on Facebook (within the rules)",
    targetKeyword: "facebook constituency targeting bangladesh",
    seoTitle: "Facebook Constituency Targeting in Bangladesh",
    seoDescription:
      "How to target a specific electoral seat on Facebook in Bangladesh — geography and affinity within Special Ad Category limits, tuned for a Bangla-first, mobile electorate.",
    excerpt:
      "A national ad set wastes most of a candidate's budget on people who can't vote for them. Constituency targeting fixes that — using Meta's geography and affinity within the Special Ad Category, tuned for how Bangladesh actually uses Facebook.",
    answerFirst:
      "To target a Bangladesh constituency on Facebook, pin the location radius to the seat's union, ward, and upazila lines and build reach on geography and legitimate affinity — because political ads sit in Meta's Special Ad Category, which forbids narrowing by protected traits. Weight spend toward the pockets that decide the margin, in Bangla-first creative built for mobile.",
    tags: ["political ads", "targeting", "facebook", "compliance", "bangladesh"],
    bodyMdx: [
      "## Why 'the whole country' is the wrong audience",
      "The most common mistake in Bangladeshi political advertising is buying national reach for a local seat. Every impression served to someone who can't vote in your constituency is wasted budget. [Constituency targeting](/glossary/constituency-targeting) tunes the location radius to the seat itself — union, ward, and upazila lines — so the money goes to voters who actually decide the margin.",
      "## Targeting inside the Special Ad Category",
      "Political ads are placed in Meta's [Special Ad Category](/glossary/special-ad-category), which strips away the fine-grained demographic and interest targeting commercial advertisers get. You cannot narrow by age brackets, gender, or many detailed traits. That is not a handicap once you design for it: you build reach on **geography** and **legitimate affinity**, which is exactly what a constituency race needs anyway.",
      "## Design for how Bangladesh uses Facebook",
      "Targeting is only half the job — the creative has to land. The Bangladeshi electorate is **Bangla-first**, on **mid-range Android over metered data**. That means Bangla copy and voiceover with dialect judgment for the seat, creative that reads in the first second on a small screen, and messages that work with the sound off. Reach the right geography with the wrong creative and you've still wasted the budget.",
      "## Measure against the seat, then reallocate",
      "Set one objective, cap frequency so you don't burn the audience, and track reach against the constituency daily — then move budget toward the wards, messages, and hours that perform. This is the difference between a [campaign and a boost](/compare/boosting-vs-ads-manager-political). For the full operation, see our [political Facebook advertising](" + FLAGSHIP + ") page.",
    ].join("\n\n"),
    faqJson: [
      { q: "Can I target voters by age or gender for a political ad in Bangladesh?", a: "No — political ads sit in Meta's Special Ad Category, which forbids narrowing by protected traits. You build reach on geography and legitimate affinity instead." },
      { q: "How precise can constituency geo-targeting get?", a: "You can tune the location radius to union, ward, and upazila lines and weight spend toward specific pockets — precise enough to focus a seat, within Meta's rules." },
      { q: "Should political creative be in Bangla or English?", a: "Bangla-first, almost always. English under-delivers outside a few urban pockets. Author in Bangla with dialect judgment for the seat rather than translating after the fact." },
    ],
    readingTime: 5,
  },
  {
    slug: "boosting-vs-ads-manager-political-campaigns",
    title: "Boosting vs Ads Manager for a political campaign in Bangladesh",
    targetKeyword: "boosting vs ads manager political campaign",
    seoTitle: "Boosting vs Ads Manager for Political Campaigns (BD)",
    seoDescription:
      "For a Bangladeshi candidate, when should you boost a Facebook post and when do you need a full Ads Manager campaign? A practical, compliance-first breakdown.",
    excerpt:
      "Boosting is the moment-rider; Ads Manager is the engine. For a political campaign in Bangladesh, most winning constituencies use both — and neither is legitimate without authorization and a disclaimer.",
    answerFirst:
      "For a political campaign in Bangladesh, use Ads Manager as the engine — real audiences, message variants, frequency control, daily optimization — and use boosting to amplify a moment that's already working. Boosting alone can't carry a message through a constituency. Both require Meta ad authorization and a 'Paid for by' disclaimer; neither is a shortcut around the rules.",
    tags: ["political ads", "facebook", "ads manager", "boosting", "bangladesh"],
    bodyMdx: [
      "## The short answer",
      "[Boosting](/glossary/boosted-post) and Ads Manager are not rivals — they're an engine and an amplifier. Ads Manager carries a message through a seat; boosting rides a spike. Most winning constituency operations in Bangladesh use both. If you can only run one and you're past the amplify-a-moment stage, choose Ads Manager.",
      "## What boosting is good for",
      "Boosting is one tap from a page post: fast, blunt, minimal setup. It's the right tool to amplify a rally clip that's already resonating, a local win, or a moment you want in front of more of your existing followers quickly. What it can't do is test messages, control frequency, or target a constituency with precision.",
      "## What Ads Manager gives you",
      "Ads Manager is the campaign engine: proper [constituency targeting](/glossary/constituency-targeting) within Special Ad Category limits, multiple message variants tested against the same audience, frequency capping so you don't burn voters, and daily budget reallocation toward what performs. This is how a message actually moves through a seat rather than flaring and fading. The full comparison is on our [decision page](/compare/boosting-vs-ads-manager-political).",
      "## Neither is a loophole",
      "Whichever you use, the compliance floor is the same: [ad authorization](/glossary/ad-authorization) and a 'Paid for by' disclaimer, targeting on geography and affinity, and every ad public in Meta's Ad Library. A boost is not a way to sneak political content past the rules. For the full operation — authorize, audience, message, measure — see our [political Facebook advertising](" + FLAGSHIP + ") page.",
    ].join("\n\n"),
    faqJson: [
      { q: "Is boosting cheaper than Ads Manager?", a: "Per action it can look cheaper, but as a whole strategy it's usually more wasteful — no targeting precision, no message testing, no frequency control. Ads Manager spends the same taka more efficiently." },
      { q: "Do boosted political posts still need a disclaimer?", a: "Yes. A boosted political post is a political ad — it needs authorization and a 'Paid for by' disclaimer exactly like an Ads Manager campaign." },
      { q: "Which should a first-time candidate start with?", a: "Get authorized, then run a small Ads Manager campaign for real reach and learning, and boost sparingly to amplify genuine moments. Don't rely on boosting alone for a contested seat." },
    ],
    readingTime: 5,
  },
];

async function main() {
  const { db } = await import("@/db/client");
  const { blogPosts } = await import("@/db/schema");

  let inserted = 0;
  let skipped = 0;
  for (const p of POSTS) {
    try {
      const res = await db
        .insert(blogPosts)
        .values({
          slug: p.slug,
          locale: "en",
          title: p.title,
          excerpt: p.excerpt,
          bodyMdx: p.bodyMdx,
          categorySlug: CATEGORY,
          tags: p.tags,
          authorSlug: AUTHOR,
          status: "review", // review-first — nothing auto-publishes
          faqJson: p.faqJson,
          answerFirst: p.answerFirst,
          sourceRefs: ["political-pr", "paid-ads"],
          readingTime: p.readingTime,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          targetKeyword: p.targetKeyword,
        })
        .onConflictDoNothing({ target: [blogPosts.slug, blogPosts.locale] })
        .returning({ slug: blogPosts.slug });
      if (res.length > 0) {
        inserted += 1;
        console.log(`  + inserted ${p.slug}`);
      } else {
        skipped += 1;
        console.log(`  · skipped ${p.slug} (already exists)`);
      }
    } catch (err) {
      console.error(`  ! failed ${p.slug}:`, err instanceof Error ? err.message : err);
    }
  }
  console.log(`\n[seed-political-fb-cluster] ${inserted} inserted, ${skipped} skipped (status: review).`);
  console.log("Publish them via /manage/blog when ready.");
}

main().catch((err) => {
  console.error(
    "[seed-political-fb-cluster] FAILED — is DATABASE_URL set?",
    err instanceof Error ? err.message : err
  );
  process.exit(1);
});
