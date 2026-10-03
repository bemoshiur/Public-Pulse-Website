import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  specializedServiceSchema,
  webPageSchema,
  qaPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { bookingUrl } from "@/lib/booking";
import {
  PrestigeHero,
  SectionHead,
  Seal,
  Framework,
  Clauses,
  CardGrid,
  BudgetTable,
  PrestigeFaq,
} from "@/components/prestige";

// Flagship pillar — Political Facebook Advertising, Bangladesh. Bespoke page in
// the "restrained luxury / campaign dossier" prestige language. This explicit
// route shadows the (matrix)/[slug] catch-all (Next resolves the literal folder
// first). Compliance-anchored, evergreen, real-only.

const PATH = "/political-facebook-ads-bangladesh";

const ANSWER_Q = "What is political Facebook advertising in Bangladesh?";
const ANSWER =
  'Political Facebook advertising in Bangladesh is the use of Meta’s paid tools, boosted posts and Ads Manager, to reach a defined electorate. It must run only from an authorized ad account with a “Paid for by” disclaimer, target by geography and interest rather than protected traits, and serve one campaign objective. Public Pulse runs it.';

export const metadata: Metadata = buildMetadata({
  title: "Political Facebook Ads in Bangladesh | Public Pulse",
  description:
    "Compliant Facebook & Instagram advertising for Bangladeshi candidates and parties — Meta ad authorization, “Paid for by” disclaimers, constituency targeting, BDT budgets. Run from Dhaka.",
  path: PATH,
  useDynamicOg: true,
  ogTitle: "Political Facebook Advertising · Bangladesh",
  ogEyebrow: "POLITICAL DIGITAL OPS · DHAKA",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Political Facebook Ads", path: PATH },
];

const STEPS = [
  {
    code: "01 · AUTH",
    name: "Authorize",
    body: "Confirm identity and location, register the “Paid for by” disclaimer, and stand up a compliant ad account before a single taka is spent. This is the step most local operators skip — and the reason their ads get pulled at the worst moment.",
  },
  {
    code: "02 · AUD",
    name: "Audience",
    body: "Map the constituency to Meta’s geo and interest layers — location radius, age, language (Bangla-first creative), device and data reality. Political targeting sits under a restricted category, so we build reach on geography and affinity, never on protected traits.",
  },
  {
    code: "03 · MSG",
    name: "Message",
    body: "One narrative, several proofs. We produce Bangla-first creative — candidate record, local issue, public-service documentation — as testable variants, not a single hero post. The message that moves a rural union is rarely the one that moves an urban ward.",
  },
  {
    code: "04 · MSR",
    name: "Measure",
    body: "One objective per campaign, tracked daily. Frequency capped so we don’t burn the audience. Budget moves toward the wards, messages, and hours that perform — with a written weekly read the campaign manager can actually act on.",
  },
];

const CLAUSES = [
  {
    ref: "Clause · Authorization",
    heading: "Identity & location confirmation",
    body: "Anyone running political ads must be authorized by Meta — a verified identity plus a confirmed in-country location. We complete this per account, ahead of the campaign, so nothing stalls at launch.",
  },
  {
    ref: "Clause · Disclaimer",
    heading: "“Paid for by” on every ad",
    body: "Political ads carry a visible disclaimer naming who paid. It’s registered once, applied to every ad, and it’s what keeps the campaign on the right side of both Meta and public scrutiny.",
  },
  {
    ref: "Clause · Category",
    heading: "Special Ad Category limits",
    body: "Political advertising restricts targeting — no narrowing by age, gender, or detailed traits the way commercial ads can. We build reach within those limits, on geography and legitimate affinity.",
  },
  {
    ref: "Clause · Transparency",
    heading: "Public Ad Library, by design",
    body: "Every political ad is archived in Meta’s public Ad Library for years. We write and target assuming full public visibility — because it is public. Nothing runs that we couldn’t defend on the record.",
  },
];

const CARDS = [
  {
    num: "R-01",
    heading: "Bangla-first creative",
    body: "Reach and trust live in Bangla. English creative under-delivers outside a few urban pockets. Copy, captions, and voiceover are authored in Bangla, with dialect judgment for the seat, not translated after the fact.",
  },
  {
    num: "R-02",
    heading: "Mobile, data-light",
    body: "The electorate is on mid-range Android over metered data. Creative is built to land in the first second, legible on a small screen, and to work with sound off — because that’s how most of it is seen.",
  },
  {
    num: "R-03",
    heading: "Constituency geography",
    body: "We target the seat, not the country — location radius tuned to union, ward, and upazila lines, with spend weighted toward the pockets that decide the margin, not vanity reach across places that don’t vote here.",
  },
  {
    num: "R-04",
    heading: "Taka efficiency",
    body: "Budgets are real and finite. We plan in BDT against reach and frequency the campaign can sustain to polling day, and we say plainly when a boost is enough and when it isn’t.",
  },
];

const BUDGET_ROWS = [
  { tier: "Boost desk", bestFor: "Amplifying moments on an existing page", fee: "৳50,000+ / mo", media: "৳50k – ৳2L" },
  { tier: "Constituency campaign", bestFor: "Single seat, full Ads Manager operation", fee: "৳1,50,000+ / mo", media: "৳3L – ৳12L" },
  { tier: "Multi-seat / party", bestFor: "Coordinated push across constituencies", fee: "৳3,00,000+ / mo", media: "Scoped per plan" },
];

const FAQS = [
  {
    q: "Is running political ads on Facebook even legal in Bangladesh?",
    a: "Yes — political advertising on Meta is permitted, but it’s a regulated category. You must be authorized (identity + location confirmed), carry a “Paid for by” disclaimer, and accept that every ad is archived publicly. We run only inside that regime. What isn’t legitimate — fake engagement, undisclosed spend, impersonation — we don’t touch, on principle and because it gets accounts and pages destroyed.",
  },
  {
    q: "Boosting vs. Ads Manager — which do we need?",
    a: "Boosting amplifies a post that’s already resonating; it’s fast and blunt. Ads Manager gives you real audiences, message variants, frequency control, and daily optimization — which is what actually carries a message through a constituency. Most winning operations use both: Ads Manager as the engine, boosting to ride a moment. We’ll tell you honestly when a boost is all you need.",
  },
  {
    q: "How much should a constituency campaign budget?",
    a: "It depends on the seat’s size, the timeline, and how contested it is — which is why the ranges above are for scoping only. Management fee is separate from media spend, and media is paid directly to Meta. On the briefing call we build a real number against your constituency and your calendar, not a template.",
  },
  {
    q: "Will you work with our opponent too?",
    a: "No. One candidate per constituency per cycle. Every engagement is NDA-protected by default. Your strategy, targeting, and creative never leave the room.",
  },
  {
    q: "How early should we start?",
    a: "Authorization alone can take days, and audience-building compounds over time — so the earlier the better. We can stand up a compliant operation quickly when the calendar is tight, but the campaigns that win on Facebook are the ones that started building reach months before polling, not in the final fortnight.",
  },
];

export default function PoliticalFacebookAdsPage() {
  const booking = bookingUrl() || "/contact";

  return (
    <div className="bg-pr-paper font-sans text-pr-ink">
      <JsonLd
        data={[
          specializedServiceSchema({
            slug: "political-facebook-ads-bangladesh",
            name: "Political Facebook Advertising",
            description:
              "Compliant Facebook & Instagram advertising for Bangladeshi candidates and parties — Meta ad authorization, disclaimers, constituency targeting, run from Dhaka.",
            serviceType: "Political Advertising",
            relatedServiceSlugs: ["political-pr", "paid-ads"],
            minPriceBdt: 50000,
          }),
          faqPageSchema(FAQS),
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: PATH,
            name: "Political Facebook Advertising in Bangladesh",
            description:
              "Compliant Facebook advertising for Bangladeshi candidates and parties, run from Dhaka.",
          }),
          qaPageSchema(ANSWER_Q, ANSWER),
        ]}
      />

      {/* Breadcrumbs (visible + already schema'd above) */}
      <div className="border-b border-pr-hairline">
        <Container>
          <div className="py-4">
            <Breadcrumbs crumbs={crumbs} />
          </div>
        </Container>
      </div>

      {/* HERO */}
      <PrestigeHero
        eyebrow="Political Facebook Advertising · Bangladesh"
        title={
          <>
            Move a constituency on Facebook —{" "}
            <em className="italic text-pr-accent-ink">run to the letter</em> of Meta’s rules.
          </>
        }
        lede="Public Pulse plans, authorizes, and runs Facebook & Instagram advertising for Bangladeshi candidates and parties — audience-first, message-disciplined, and fully inside Meta’s political-ad transparency regime. No bought engagement. No shortcuts that get an account shut down mid-campaign."
        ctaPrimary={{ href: "#brief", label: "Request a campaign briefing" }}
        ctaSecondary={{ href: "#method", label: "See the method" }}
        aside={
          <div className="relative overflow-hidden rounded-[4px] border border-pr-hairline bg-pr-surface p-[26px]">
            <span className="absolute bottom-[26px] left-0 top-[26px] w-[3px] bg-pr-accent" aria-hidden />
            <div className="mb-3.5 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-pr-muted">
              <span>Brief · Definition</span>
              <span>PP/FB-01</span>
            </div>
            <AnswerBlock>
              Political Facebook advertising in Bangladesh is the use of Meta’s paid tools, boosted
              posts and Ads Manager, to reach a defined electorate. It must run <b>only</b>{" "}
              from an authorized ad account with a “Paid for by” disclaimer, target by geography and
              interest rather than protected traits, and serve one campaign objective. Public Pulse
              runs it.
            </AnswerBlock>
            <dl className="mt-1 grid gap-px overflow-hidden rounded-[4px] border border-pr-hairline bg-pr-hairline">
              {[
                ["Entity", "Registered BD company · BIN + Trade License"],
                ["Process", "Meta ad-authorization & disclaimer on every account"],
                ["Terms", "NDA by default · one candidate per constituency"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2.5 bg-pr-surface px-[15px] py-3">
                  <dt className="min-w-[74px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-pr-muted">
                    {k}
                  </dt>
                  <dd className="text-[13.5px] text-pr-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      {/* §01 SCOPE */}
      <section className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead
            index="§ 01 — Scope"
            title={<>Not “boost and hope.” A paid operation with a plan behind every taka.</>}
          />
          <div className="ml-auto max-w-[68ch] space-y-[18px] text-pr-ink-soft">
            <p>
              Most candidates in Bangladesh already boost posts. Few run a <em>campaign</em>. The
              difference is whether spend is attached to a defined audience, a tested message, and a
              number you’re trying to move — or whether it’s ৳500 dropped on
              whatever the page manager posted that morning.
            </p>
            <p>
              We treat a Facebook budget the way a campaign treats a rally: a plan, a route, a headcount
              target, and a debrief. Boosting has its place — it’s how you amplify a moment
              that’s already working. But durable reach through a constituency comes from Ads
              Manager: proper audiences, message variants, frequency control, and daily reallocation
              toward whatever is actually landing.
            </p>
          </div>
        </Container>
      </section>

      {/* §02 METHOD */}
      <section id="method" className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead
            index="§ 02 — Method"
            title="Four movements, in order. Rigor is the whole edge."
            sub="The sequence is deliberate. Authorization gates everything; audience defines message; message defines creative; measurement decides where the next taka goes."
          />
          <Framework steps={STEPS} />
        </Container>
      </section>

      {/* §03 COMPLIANCE (briefing / dark) */}
      <section className="border-t border-pr-briefing-line bg-pr-briefing py-[66px]">
        <Container>
          <SectionHead
            dark
            index="§ 03 — Compliance"
            title="The rules aren’t red tape. They’re the difference between a live campaign and a dead account."
            sub="Meta enforces a specific regime for ads about social issues, elections and politics. We run every account to it — because a suspension in the final week is unrecoverable."
          />
          <Clauses clauses={CLAUSES} />
        </Container>
      </section>

      {/* §04 TERRAIN */}
      <section className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead
            index="§ 04 — Terrain"
            title="Built for how Bangladesh actually uses Facebook."
            sub="National playbooks don’t survive contact with a Bangladeshi constituency. Four realities shape every plan we run."
          />
          <CardGrid cards={CARDS} />
        </Container>
      </section>

      {/* §05 BUDGET */}
      <section className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead
            index="§ 05 — Budget"
            title="Illustrative planning ranges, in taka."
            sub="Management fee, separate from media spend. Ranges for scoping only — every constituency gets a real plan on the briefing call. These are planning figures, not a performance promise."
          />
          <BudgetTable
            rows={BUDGET_ROWS}
            note="MEDIA SPEND PAID TO META, SEPARATE FROM FEE · NDA-PROTECTED · ONE CANDIDATE PER CONSTITUENCY PER CYCLE"
          />
        </Container>
      </section>

      {/* §06 STANDING */}
      <section className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead index="§ 06 — Standing" title="Why the method is the proof." />
          <div className="ml-auto max-w-[68ch] space-y-[18px] text-pr-ink-soft">
            <p>
              Every serious agency will show you screenshots. Screenshots are the easiest thing in the
              world to fake — and in political work, the last thing you should trust. So we lead
              with what can’t be faked: a registered Bangladeshi entity, a compliant authorization
              process on every account, NDA terms, and a written method a campaign manager can hold us
              to.
            </p>
            <p>
              <span className="font-mono text-[13px] tracking-[0.06em] text-pr-accent-ink">
                [ BENCHMARK · FORTHCOMING ]
              </span>{" "}
              We’re compiling first-party Bangladesh political-ad cost benchmarks — CPM, reach
              efficiency by division — from our own managed campaigns, to publish dated and sourced.
              We’d rather ship one real number than borrow ten.
            </p>
          </div>
        </Container>
      </section>

      {/* §07 FAQ */}
      <section className="border-t border-pr-hairline py-[66px]">
        <Container>
          <SectionHead index="§ 07 — Questions" title="What campaigns actually ask." />
          <PrestigeFaq faqs={FAQS} />
        </Container>
      </section>

      {/* CLOSING CTA (dark) */}
      <section id="brief" className="border-t border-pr-briefing-line bg-pr-briefing py-[76px] text-pr-briefing-ink">
        <Container>
          <div className="mb-6 flex items-center gap-3.5">
            <Seal />
            <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-pr-briefing-muted">
              Request a campaign briefing
            </span>
          </div>
          <h2 className="max-w-[18ch] text-balance font-pr-serif text-[clamp(30px,4.5vw,54px)] font-semibold leading-[1.04] text-pr-briefing-ink">
            Bring us the seat. We’ll bring the{" "}
            <em className="italic text-pr-accent-ink">plan</em>.
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] text-pr-briefing-muted">
            A confidential 30-minute briefing: your constituency, your timeline, and a straight read on
            what a compliant Facebook operation would cost and deliver. No pitch theatre.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={booking}
              className="group inline-flex items-center gap-2 rounded-[3px] bg-pr-accent px-[22px] py-[13px] text-[14.5px] font-semibold text-cp-gold-ink transition hover:bg-pr-accent-ink"
            >
              Book the briefing
              <span aria-hidden className="transition-transform group-hover:translate-x-[3px]">→</span>
            </Link>
            <a
              href="tel:+8801717714676"
              className="inline-flex items-center gap-2 rounded-[3px] border border-pr-briefing-line px-[22px] py-[13px] text-[14.5px] font-semibold text-pr-briefing-ink transition hover:border-pr-briefing-ink"
            >
              +880 1717-714676
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
