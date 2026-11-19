import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  Building2,
  Globe2,
  Layers,
  MapPin,
  MessageCircleMore,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { aboutPageSchema, breadcrumbSchema, faqPageSchema, type Faq } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { PULSE_GROUP, SISTER_BRANDS } from "@/lib/group";
import { ScrollRevealV2 as ScrollReveal, Stagger } from "@/components/motion";

export const metadata: Metadata = buildMetadata({
  title: "About Public Pulse Agency | Dhaka Digital Marketing & Political PR",
  description:
    "Public Pulse Agency is Bangladesh's 360° digital marketing & political PR studio, founded in Dhaka in 2024. Nine integrated services billed in BDT from a registered Bangladesh entity.",
  path: "/about",
  bnPath: "/bn/about",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

// Four brand principles — phrased as brand promises, not "our team is great".
const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Senior brief, every brief",
    body:
      "Every engagement is owned at the senior level inside the studio. No junior account handler escalating to a senior on a Friday review — the senior writes the brief and signs the report.",
  },
  {
    icon: MapPin,
    title: "Built for Bangladesh",
    body:
      "Founded in Dhaka, hires in Bangladesh, bills in BDT. Channel mix is Facebook-first because the market is; CAPI + Bkash/Nagad funnel design baked in; constituency-level PR works because the studio works at constituency level.",
  },
  {
    icon: Workflow,
    title: "One accountable team",
    body:
      "Strategy, creative, paid media, PR and analytics sit on one brief, in one office, with one weekly report. The hand-offs other agencies lose campaigns inside don't exist here.",
  },
  {
    icon: ScrollText,
    title: "Honest reporting",
    body:
      "Monthly business review covers what worked, what didn't, what we're killing this week. No vanity dashboards, no metric inflation. The numbers reconcile to your finance team.",
  },
];

const FAQS: Faq[] = [
  {
    q: "Who is Public Pulse Agency?",
    a: "Public Pulse Agency is a Bangladesh-based digital marketing and political PR studio. We run nine integrated services — political PR, social media, content production, paid media, hospitality marketing, brand building, SEO, analytics, and influencer marketing — under one roof from Dhaka.",
  },
  {
    q: "Where is Public Pulse based?",
    a: `Dhaka, Bangladesh. The studio is a registered Bangladesh entity (BIN ${SITE.contact.legal.bin}, Trade License ${SITE.contact.legal.tradeLicense}). All work is billed in BDT from the Dhaka office; client calls happen in Bengali and English.`,
  },
  {
    q: "What services does Public Pulse offer?",
    a: "Nine integrated services delivered by one accountable team: political PR, social media, content production, paid ads, hospitality marketing, brand building, SEO + website, analytics & reporting, and influencer marketing. Each service can run standalone or as part of an integrated campaign.",
  },
  {
    q: "Is Public Pulse a registered company in Bangladesh?",
    a: `Yes. Public Pulse Agency operates as a Bangladesh-registered business entity with BIN ${SITE.contact.legal.bin} and Trade License ${SITE.contact.legal.tradeLicense}. Invoices, contracts, and bank transfers are all handled through the registered entity.`,
  },
  {
    q: "How does Public Pulse bill?",
    a: "All engagements are billed in BDT against a written scope and a monthly retainer or project fee. Campaign media spend is invoiced separately at cost with line-item reconciliation. Government and NGO clients can be billed on standard tender-aligned payment terms.",
  },
  {
    q: "What is Pulse Group?",
    a: `Pulse Group is the parent organization. Public Pulse Agency is one of five sister concerns: ${SISTER_BRANDS.map((b) => b.name).join(", ")} and Public Pulse Agency. The group focuses on Bangladesh-specific digital businesses.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          aboutPageSchema({ path: "/about", inLanguage: "en" }),
          breadcrumbSchema(crumbs),
          faqPageSchema(FAQS, "details"),
        ]}
      />
      <DcPage name="Studio" />
    </>
  );
}
