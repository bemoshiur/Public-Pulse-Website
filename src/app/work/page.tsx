import { DcPage } from "@/components/pp/DcPage";
// /work index — the client-works portfolio landing page. The grid is
// SSR-visible by construction (see WorksFilter): no Suspense/useSearchParams
// wrapping it, unlike the /case-studies anti-pattern this section must avoid.

import type { Metadata } from "next";
import Image from "next/image";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { InlineBlock } from "@/components/lead-capture";
import { WorksFilter } from "@/components/work/WorksFilter";
import { getPublishedWorks } from "@/lib/data/works";
import { getClientsWithLogos } from "@/lib/data/clients";
import { DISCIPLINES } from "@/lib/taxonomies/disciplines";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Work | Public Pulse — Bangladesh campaigns, brands & content",
  description:
    "Selected client work from Public Pulse Agency — campaigns, brand systems, social, paid media and film for Bangladeshi brands, candidates and hospitality businesses.",
  path: "/work",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

export default async function WorkIndexPage() {
  const [works, allLogoClients] = await Promise.all([getPublishedWorks("en"), getClientsWithLogos()]);

  // A client is only shown in the "Trusted by" logo wall if at least one of
  // their PUBLISHED works names them (confidentiality !== "anonymised").
  // getClientsWithLogos() is a global accessor unaware of any single work's
  // confidentiality flag — showing every logo unconditionally would let a
  // visitor match an anonymised card's outcome to a named logo on the same
  // page, defeating the NDA the anonymisation exists to honour. Do not
  // simplify this away; it is a confidentiality boundary, not decoration.
  const namedClientIds = new Set(
    works
      .filter((w) => w.confidentiality !== "anonymised" && w.clientId)
      .map((w) => w.clientId as string)
  );
  const logoClients = allLogoClients.filter((c) => namedClientIds.has(c.id));

  const faqs = [
    {
      q: "What does the Work section show?",
      a: "Campaigns, brand systems, social, paid media and film for Bangladeshi brands, candidates and hospitality businesses, with the services delivered on each project.",
    },
    {
      q: "Why are some clients not named?",
      a: "Where a client is under NDA, the outcome is shown without the name. Outcomes are published only where the client permits it.",
    },
    {
      q: "Which disciplines are covered?",
      a: `${DISCIPLINES.length} disciplines: ${DISCIPLINES.map((d) => d.name).join(", ")}. Use the filters on the grid to narrow the list.`,
    },
    {
      q: "How is this different from the case studies?",
      a: "The Work section shows the projects themselves, while case studies lead with measured outcomes and metrics.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs),
          collectionPageSchema({
            path: "/work",
            name: "Public Pulse client work",
            description: "Selected client work from Public Pulse Agency in Bangladesh.",
            items: works.map((w) => ({ url: `/work/${w.slug}`, name: w.title })),
          }),
          itemListSchema(
            "Public Pulse client work",
            works.map((w) => ({ url: `/work/${w.slug}`, name: w.title }))
          ),
        ]}
      />
      <DcPage name="Work" />
    </>
  );
}
