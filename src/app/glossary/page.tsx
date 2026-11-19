import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, definedTermSetSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { GLOSSARY } from "@/lib/taxonomies/glossary";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Glossary | Public Pulse Agency",
  description:
    "Digital marketing and political PR vocabulary, defined for the Bangladesh market — AEO, GEO, JSON-LD, IndexNow, Meta CAPI, ROAS, narrative engineering, and more.",
  path: "/glossary",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Glossary", path: "/glossary" },
];

const AREAS = [
  "Digital Marketing",
  "Political PR",
  "Paid Media",
  "SEO",
  "Branding",
  "Analytics",
] as const;

const GLOSSARY_AREAS = AREAS.filter((area) => GLOSSARY.some((t) => t.area === area));
const BN_TERMS = GLOSSARY.filter((t) => t.nameBn).length;

const FAQS = [
  {
    q: "What does the Public Pulse glossary cover?",
    a: `${GLOSSARY.length} working terms of digital marketing and political PR, grouped into ${GLOSSARY_AREAS.length} areas: ${GLOSSARY_AREAS.join(", ")}.`,
  },
  {
    q: "Does each term have its own page?",
    a: "Yes. Every term links to its own page with a short definition and a longer explanation written for the Bangladesh market.",
  },
  {
    q: "Are the terms available in Bangla?",
    a: `Where relevant, yes. ${BN_TERMS} of the ${GLOSSARY.length} terms carry a Bangla name alongside the English one.`,
  },
  {
    q: "Who can I ask about a term that is not listed?",
    a: `Email ${SITE.contact.email} or message the team on WhatsApp. Public Pulse works in English and Bangla.`,
  },
];

export default function GlossaryIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          definedTermSetSchema(GLOSSARY.map((t) => ({ slug: t.slug, name: t.name }))),
          
        ]}
      />
      <DcPage name="Glossary" />
    </>
  );
}
