import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Info } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pricingSchema, webPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { PRICING } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { bookingUrl } from "@/lib/booking";

export const metadata: Metadata = buildMetadata({
  title: "Pricing | Public Pulse — Service tiers + starting BDT rates",
  description:
    "Transparent starting prices for every Public Pulse service — political PR, paid ads, social media, content, brand, SEO, hospitality, analytics, influencer. Billed in BDT.",
  path: "/pricing",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
];

const FAQS = [
  {
    q: "Are these final prices?",
    a: "These are STARTING points. The final quote comes after a free discovery call — usually within 24 hours of a brief landing in our inbox. We won't quote without scope.",
  },
  {
    q: "How are you billed?",
    a: "Monthly retainers are invoiced at the start of each cycle. Project work is split 50/50 — half on kickoff, half on delivery. All BDT, with VAT where applicable. Foreign-currency billing available on request.",
  },
  {
    q: "What does the discovery call cover?",
    a: "15 minutes. We map your goal to a scope and confirm whether we're the right fit. No pitch deck — you get a written proposal within 24 hours after the call.",
  },
  {
    q: "Can you work with smaller budgets?",
    a: "Some of our services scale down (content production has per-day rates; SEO has audits below ৳50k). For full retainers, BDT 45,000+/month is the realistic minimum.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: "/pricing",
            name: "Public Pulse Pricing",
            description: "Starting prices for every Public Pulse service, billed in BDT.",
          }),
          pricingSchema(),
          faqPageSchema(FAQS, "none"),
        ]}
      />
      <DcPage name="Pricing" />
    </>
  );
}
