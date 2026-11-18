import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { GUIDES } from "@/lib/content/guides";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Marketing & PR Playbooks for Bangladesh | Public Pulse",
  description:
    "Step-by-step HowTo playbooks: Facebook campaigns for BD elections, Meta Conversions API setup, IndexNow publish pipeline. Grounded in Bangladesh marketing reality.",
  path: "/guides",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
];

export default function GuidesIndex() {
  const ready = GUIDES.filter((g) => g.ready);
  const faqs = [
    {
      q: "Which guides does Public Pulse publish?",
      a: `${ready.length} step-by-step playbooks: ${ready.map((g) => g.title).join("; ")}.`,
    },
    {
      q: "How is each guide structured?",
      a: "Each guide is authored as a schema.org HowTo, with ordered steps, total time and tooling specified.",
    },
    {
      q: "Are the guides specific to Bangladesh?",
      a: "Yes. Each one is grounded in real Bangladesh marketing and political PR context rather than a re-skin of a generic software-company post.",
    },
    {
      q: "Can Public Pulse run a playbook for me?",
      a: `Yes. Send a brief through the contact page, message the team on WhatsApp, or email ${SITE.contact.email}.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs),
          itemListSchema(
            "Public Pulse Guides",
            ready.map((g) => ({ url: `/guides/${g.slug}`, name: g.title }))
          ),
        ]}
      />
      <DcPage name="Guides" />
    </>
  );
}
