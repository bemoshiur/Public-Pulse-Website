import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  digitalDocumentSchema,
  faqPageSchema,
  webPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { SITE } from "@/lib/site";
import { politicalPr } from "@/content/services/political-pr";
import { bookingUrl } from "@/lib/booking";
import { PhaseTimeline } from "@/components/election/PhaseTimeline";
import {
  CampaignProfile,
  PROFILE_PAGES,
  PROFILE_PDF,
  PROFILE_PDF_BYTES,
} from "@/components/election/CampaignProfile";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";

export const metadata: Metadata = buildMetadata({
  // Title: 56 chars — under Google's 60-char SERP cutoff. Echoes the H1
  // "Win the perception first. The booth comes after." for brand recall.
  // Geo keyword "Bangladesh" leads for local-pack ranking.
  title: "Bangladesh Election PR: Win the Perception, Win the Seat",
  description:
    "Win Bangladeshi elections with our 90-day PR playbook: constituency survey, narrative design, ground + digital coordination, 24h crisis SLA from Dhaka.",
  path: "/election",
  useDynamicOg: true,
  // Social-share OG card: outcome-led, time-bounded ("in 90 days"),
  // sized to fit the 1200×630 /og factory without truncation.
  ogTitle: "Win the Seat in 90 Days — Bangladesh Election PR",
  ogEyebrow: "FOR CANDIDATES · 24-HOUR CRISIS SLA",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Election readiness", path: "/election" },
];

// Election-cycle FAQs — different from the political-pr service FAQ.
// Tuned for "what should we do before the election" / "how late is too late"
// questions a candidate's team would actually ask.
const FAQS = [
  {
    q: "When should a campaign engage you before an election?",
    a: "Ideally 6–9 months out. We can run condensed 90-day playbooks closer to polling, but the earlier we start, the cheaper and more effective the narrative work is — and the lower the crisis-response risk.",
  },
  {
    q: "What does a 90-day election playbook actually include?",
    a: "Constituency opinion survey → rival/opposition mapping → narrative design → creative production (photo, video, copy) → digital + ground-team activation → daily sentiment tracking → 24-hour crisis response → polling-day comms → post-election PR.",
  },
  {
    q: "Will you work with our opposition too?",
    a: "No. We never work with directly competing candidates in the same constituency during the same cycle. All engagements are NDA-protected by default.",
  },
  {
    q: "Is this digital-only?",
    a: "No — it's integrated. Narrative, digital reach, ground-team coordination, and crisis response run as one campaign under a single accountable team.",
  },
  {
    q: "What about crisis communication on election night?",
    a: "24-hour crisis SLA is built into every election engagement. When the news cycle turns at 11pm, a strategist and a creative are on it by midnight.",
  },
  {
    q: "Where are you based and do you serve outside Dhaka?",
    a: "Dhaka-based, with field coordinators across constituencies nationwide. We've run campaigns in Dhaka, Chattogram, Sylhet, and elsewhere across Bangladesh.",
  },
];

// 90-day phase plan, derived from political-pr.process but mapped to
// week markers so a campaign manager can read it as a calendar.
// Icons are STRING keys (not component refs) because PhaseTimeline is a
// client component — React can't serialize component refs over the wire.
const PHASES: import("@/components/election/PhaseTimeline").Phase[] = [
  {
    icon: "users",
    weeks: "Day 0–14",
    title: "Discovery + survey",
    body: "Free consultation. Constituency opinion survey, rival analysis, baseline sentiment, identify the local-hero narrative thread.",
  },
  {
    icon: "megaphone",
    weeks: "Week 3–6",
    title: "Strategy + production",
    body: "Narrative design, audience segmentation, creative production in-house — candidate photo, video, biography, public service documentation, copy.",
  },
  {
    icon: "calendar",
    weeks: "Week 7–10",
    title: "Mobilization",
    body: "Ground-team and digital activated together. Daily sentiment tracking, A/B narrative tests, weekly KPI reports, budget reallocation across booths.",
  },
  {
    icon: "warning",
    weeks: "Week 11–12",
    title: "Peak + polling day",
    body: "24-hour crisis SLA fully active. Rapid-response copy + creative. Polling-day comms, get-out-the-vote messaging, real-time sentiment monitoring.",
  },
  {
    icon: "shield",
    weeks: "Day +1 onward",
    title: "Post-election PR",
    body: "Result reframing, gracious-loss / decisive-win narrative, thank-you outreach, transition-to-governance messaging.",
  },
];

export default function ElectionPage() {
  const booking = bookingUrl();

  return (
    <div className="theme-campaign">
      <ScrollDepthTracker surface="/election" />
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: "/election",
            name: "Win the Seat in 90 Days — Bangladesh Election PR",
            description:
              "90-day election PR playbook for Bangladeshi candidates and parties.",
            about: ["political-pr"],
            keywords: [
              "Bangladesh election PR",
              "political campaign agency Bangladesh",
              "candidate image building Dhaka",
              "90-day election playbook",
              "win the seat",
            ],
          }),
          faqPageSchema(FAQS, "details"),
          digitalDocumentSchema({
            name: "Public Pulse Profile — Political PR",
            description:
              "A ten-page campaign profile: services, the QR-based campaign access system, the campaign journey and live client profiles.",
            path: PROFILE_PDF,
            bytes: PROFILE_PDF_BYTES,
            pages: PROFILE_PAGES,
            languages: ["en", "bn"],
          }),
        ]}
      />

      {/* ═══ HERO — crimson radial gradient, gold accents ═══════════════ */}
      <section className="cp-hero relative overflow-hidden text-white">
        <Container>
          <div className="py-12 md:py-20">
            <Breadcrumbs crumbs={crumbs} tone="dark" />
            <div className="mt-6 grid items-end gap-10 md:grid-cols-12">
              <div className="md:col-span-8">
                <span className="cp-tab">Election readiness · Bangladesh</span>
                <h1 className="mt-5 text-display tracking-tight text-white">
                  Win the perception <em className="not-italic cp-gold">first</em>.
                  The booth comes after.
                </h1>
                <p className="mt-6 max-w-2xl text-lead text-white/85">
                  90-day election playbook for candidates and parties in Bangladesh —
                  constituency survey, narrative design, ground + digital coordination,
                  and a 24-hour crisis SLA. NDA-protected, senior in the room, billed in BDT.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={booking ? "/book" : "/contact"} className="btn btn-gold">
                    {booking ? "Book a 30-min strategy call" : "Start a campaign brief"}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a
                    href={SITE.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold-ghost"
                  >
                    WhatsApp the strategist
                  </a>
                </div>
                <p className="mt-5 text-sm text-white/75">
                  <a href="#profile" className="cp-gold underline underline-offset-4 hover:text-cp-gold-soft">
                    Read the campaign profile (PDF)
                  </a>
                  {" · "}Focused on the paid digital push?{" "}
                  <Link
                    href="/political-facebook-ads-bangladesh"
                    className="cp-gold underline underline-offset-4 hover:text-cp-gold-soft"
                  >
                    See our political Facebook advertising
                  </Link>{" "}
                  — Meta-authorized, compliant, run from Dhaka.
                </p>
              </div>
              <div className="md:col-span-4">
                <div className="cp-panel cp-panel-gold p-5 backdrop-blur">
                  <div className="flex items-center gap-2 text-cp-gold">
                    <Clock className="h-4 w-4" aria-hidden />
                    <span className="text-eyebrow uppercase">Crisis SLA</span>
                  </div>
                  <p className="mt-3 text-h3 font-bold text-white">
                    24 hours — strategist + creative on it by midnight.
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["90", "day playbook", "from discovery to post-election PR"],
                ["24h", "crisis SLA", "strategist + creative on it by midnight"],
                ["NDA", "by default", "no work for a direct rival in your seat"],
              ].map(([n, l, d]) => (
                <div key={l} className="cp-panel px-5 py-4">
                  <dt className="font-pr-serif text-5xl font-bold leading-none cp-gold">{n}</dt>
                  <dd className="mt-2 text-body font-semibold text-white">{l}</dd>
                  <dd className="text-meta text-white/70">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="cp-surface py-12 md:py-16">
        <Container>
          <AnswerBlock>{politicalPr.answer}</AnswerBlock>
        </Container>
      </section>

      {/* ═══ THE PDF — campaign profile ══════════════════════════════════ */}
      <section id="profile" className="cp-surface-deep scroll-mt-24 border-t cp-rule py-16 md:py-24">
        <Container>
          <CampaignProfile />
        </Container>
      </section>

      <section className="cp-surface border-t cp-rule py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="cp-tab">90-day playbook</span>
            <h2 className="mt-4 text-h1 tracking-tight text-white">
              Five phases. One <span className="cp-gold">accountable team.</span>
            </h2>
            <p className="mt-5 text-lead text-white/80">
              Calendar-mapped so your campaign manager can see exactly what happens when.
              We compress this to 60 or 45 days when the timeline demands it — the order
              stays the same, the depth changes.
            </p>
          </div>
          <div className="mt-12">
            <PhaseTimeline phases={PHASES} tone="campaign" />
          </div>
        </Container>
      </section>

      <section className="cp-surface-deep border-t cp-rule py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="cp-tab">Constituency-ready</span>
            <h2 className="mt-4 text-h1 tracking-tight text-white">
              What we deliver — <span className="cp-gold">at constituency scale.</span>
            </h2>
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {politicalPr.included
              .filter((item) => !item.includes("TODO"))
              .map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-white/15 pb-4 text-body text-white/90"
                >
                  <span aria-hidden className="mt-2.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cp-gold" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </Container>
      </section>

      <section className="cp-surface border-t cp-rule py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="cp-tab">FAQ</span>
            <h2 className="mt-4 text-h1 tracking-tight text-white">
              Election cycle <span className="cp-gold">questions.</span>
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group cp-panel p-5 open:border-cp-gold"
              >
                <summary className="cursor-pointer list-none text-h3 font-bold text-white marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span aria-hidden className="mt-1 text-cp-gold transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-body text-white/80">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <Section size="lg" className="cp-surface-deep border-t cp-rule">
        <Container>
          <div className="cp-hero cp-panel-gold overflow-hidden rounded-panel-lg border-[1.5px] px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-3xl">
              <p className="text-eyebrow uppercase cp-gold">
                You lead the campaign. We work as you, for you.
              </p>
              <h2 className="mt-4 text-h1 tracking-tight text-white">
                Election cycle running? Let&rsquo;s talk this week.
              </h2>
              <p className="mt-5 text-lead text-white/85">
                Free 30-minute discovery call. We&rsquo;ll review the seat, the opposition, and the
                timeline — and tell you honestly whether we can help and when to start.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={booking ? "/book" : "/contact"} className="btn btn-gold">
                  {booking ? "Book the call" : "Send a brief"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/services/political-pr" className="btn btn-gold-ghost">
                  Read the service detail
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
