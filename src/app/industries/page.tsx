import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { INDUSTRIES } from "@/lib/taxonomies/industries";
import { getIndustryIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Industries | Public Pulse Agency",
  description:
    "Vertical-specific digital marketing across the Bangladesh economy — real estate, e-commerce, restaurants, healthcare, education, NGO, government, RMG, hospitality, fintech.",
  path: "/industries",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Industries", path: "/industries" },
];

const FAQS = [
  {
    q: "Which industries does Public Pulse serve?",
    a: `${INDUSTRIES.length} verticals across the Bangladesh economy: ${INDUSTRIES.map((i) => i.name).join(", ")}.`,
  },
  {
    q: "What does an industry page include?",
    a: "Each industry page surfaces the priorities and aligned services for that vertical, plus its own frequently asked questions.",
  },
  {
    q: "Is the marketing the same for every industry?",
    a: "No. Each vertical has its own dominant channels, priorities and tested playbooks, so the service mix differs from sector to sector.",
  },
  {
    q: "How do I discuss my industry with the team?",
    a: `Send a brief through the contact page, message the team on WhatsApp, or email ${SITE.contact.email}.`,
  },
];

export default function IndustriesIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(FAQS),
          itemListSchema(
            "Public Pulse Industries",
            INDUSTRIES.map((i) => ({ url: `/industries/${i.slug}`, name: i.name }))
          ),
        ]}
      />
      <DcPage name="Industries" />
    </>
  );
}
