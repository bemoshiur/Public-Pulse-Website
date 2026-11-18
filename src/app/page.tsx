import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Phone,
  Quote,
} from "lucide-react";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Marquee } from "@/components/ui/Marquee";
import { CountUp } from "@/components/ui/CountUp";
import { HeroPanel } from "@/components/home/HeroPanel";
import { SERVICES } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";
import { getFeaturedCaseStudies } from "@/lib/data/case-studies";
import { InlineBlock } from "@/components/lead-capture";

export const metadata: Metadata = buildMetadata({
  // Same title/description as the root layout default — repeated here only
  // to attach the bn-BD hreflang alternate to the homepage.
  title: "Public Pulse — Bangladesh Digital Marketing & PR Agency",
  description:
    "Bangladesh's 360° digital marketing & political PR agency. Political PR, social media, content, paid ads, hospitality, branding, SEO. Call +880 1717-714676.",
  path: "/",
  bnPath: "/bn",
});

// JSON-LD Organization + WebSite emit site-wide from app/layout.tsx.

// TODO(user): confirm these numbers — defaults from AUDIT.md.
const STATS = [
  { number: "50+", label: "Active clients" },
  { number: "300%+", label: "Avg engagement lift" },
  { number: "10+", label: "Industries served" },
  { number: "9", label: "Services in-house" },
];

const PROCESS = [
  { n: "01", title: "Listen", body: "30-min strategy call. Channels audit. What's working, what isn't, and what you've already tried." },
  { n: "02", title: "Plan", body: "Quarterly plan with named owners, the calendar, the budget, and ONE KPI we'll be held to." },
  { n: "03", title: "Make", body: "Strategy, creative, paid, PR, analytics — one room, one brief, one weekly stand-up." },
  { n: "04", title: "Sharpen", body: "Monthly review. Honest call on what to double down on. What to kill. No vanity dashboards." },
];

export default async function HomePage() {
  return (
    <>
      <DcPage name="Main" />
    </>
  );
}
