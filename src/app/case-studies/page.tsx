import { DcPage } from "@/components/pp/DcPage";
// Modern compact case-studies index — filterable grid, dense but breathable.
// Server fetches once, ISR-cached, statically prerendered. Client component
// (CaseStudiesFilter) renders every card unconditionally and filters via
// local useState + a CSS `hidden` class (WorksFilter's pattern — Task 6/13).
// Do NOT wrap it in <Suspense>/useSearchParams — that combination is what
// made this grid invisible to crawlers (zero /case-studies/<slug> anchors
// in the built HTML) before Task 13.

import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { InlineBlock } from "@/components/lead-capture";
import { getPublishedCaseStudies } from "@/lib/data/case-studies";
import { SERVICES } from "@/lib/services";
import { CaseStudiesFilter } from "@/components/case-studies/CaseStudiesFilter";

// 1h ISR window per CACHING.md — admin mutations also call updateTag('case-studies')
// for instant refresh, so 1h is just the safety-net regeneration cadence.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Case Studies | Public Pulse — Bangladesh client results",
  description:
    "Real client outcomes — paid, social, PR, SEO — across Bangladesh hospitality, e-commerce and political PR. Metrics-first, grounded in real campaigns.",
  path: "/case-studies",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Case studies", path: "/case-studies" },
];

export default async function CaseStudiesIndex() {
  const cases = await getPublishedCaseStudies("en");

  const serviceLabels: Record<string, string> = {};
  for (const s of SERVICES) serviceLabels[s.slug] = s.shortName;

  const serialized = cases.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    industry: c.industry,
    location: c.location ?? null,
    metric: c.metric,
    windowLabel: c.windowLabel,
    services: c.services ?? [],
    serviceSlug: c.serviceSlug ?? null,
    clientName: c.clientName ?? null,
  }));

  const faqs = [
    {
      q: "What does a Public Pulse case study contain?",
      a: "Documented metrics, the time window they cover and the services delivered, so the result can be traced back to the work behind it.",
    },
    {
      q: "Are client names always shown?",
      a: "No. Where an NDA applies, the client name is anonymised to a sector label.",
    },
    {
      q: "How many case studies are published?",
      a: `There ${cases.length === 1 ? "is" : "are"} currently ${cases.length} published case stud${cases.length === 1 ? "y" : "ies"}. Every number shown is a real result from work Public Pulse delivered, with no fabricated figures or screenshots.`,
    },
    {
      q: "How is this different from the Work section?",
      a: "Case studies lead with measured outcomes, while the Work section shows the projects themselves.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs, "none"),
          collectionPageSchema({
            path: "/case-studies",
            name: "Public Pulse case studies",
            description:
              "Real client outcomes for Bangladesh brands — paid, social, PR, SEO.",
            items: cases.map((c) => ({ url: `/case-studies/${c.slug}`, name: c.title })),
          }),
          itemListSchema(
            "Public Pulse case studies",
            cases.map((c) => ({ url: `/case-studies/${c.slug}`, name: c.title }))
          ),
        ]}
      />
      <DcPage name="Results" />
    </>
  );
}
