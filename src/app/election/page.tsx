import { DcPage } from "@/components/pp/DcPage";
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
  bnPath: "/bn/election",
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
  return (
    <>
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
      <DcPage name="Election" />
    </>
  );
}
