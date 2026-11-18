import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProgrammaticPage, CalloutList, Hl } from "@/components/seo/ProgrammaticPage";
import { getService } from "@/lib/services";
import { getIndustry } from "@/lib/taxonomies/industries";
import { allowedServiceIndustrySlugs, isAllowedServiceIndustry, serviceIndustryAnswer } from "@/lib/taxonomies/matrix";

// SERVICE × INDUSTRY matrix at /<service>-for-<industry> (e.g. /paid-ads-for-real-estate).
//
// PRUNED: only coherent pairings (service aligned to the industry — see
// src/lib/taxonomies/matrix.ts) are prerendered + indexed. This kills nonsense
// combos like /political-pr-for-e-commerce and /hospitality-for-hospitality.
// dynamicParams=true so a valid-but-pruned pairing 308-redirects to the
// industry page rather than 404-ing; a malformed slug still 404s.

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allowedServiceIndustrySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = true;

function parseSlug(slug: string): {
  service: ReturnType<typeof getService>;
  industry: ReturnType<typeof getIndustry>;
} {
  const marker = "-for-";
  const idx = slug.indexOf(marker);
  if (idx <= 0) return { service: undefined, industry: undefined };
  const serviceSlug = slug.slice(0, idx);
  const industrySlug = slug.slice(idx + marker.length);
  return { service: getService(serviceSlug), industry: getIndustry(industrySlug) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { service, industry } = parseSlug(slug);
  if (!service || !industry) return {};
  return buildMetadata({
    title: `${service.shortName} for ${industry.name} | Public Pulse Agency`,
    description: `Public Pulse delivers ${service.shortName} for Bangladesh ${industry.name} brands — tuned to the vertical's priorities: ${industry.priorities.slice(0, 3).join(", ")}.`,
    path: `/${slug}`,
    useDynamicOg: true,
    ogTitle: `${service.shortName} for ${industry.name}`,
    ogEyebrow: `${service.category.toUpperCase()} · ${industry.name.toUpperCase()}`,
  });
}

export default async function ServiceIndustryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { service: s, industry: ind } = parseSlug(slug);
  if (!s || !s.ready || !ind) notFound();
  // Pruned/incoherent pairing: 308-redirect to the industry overview.
  if (!isAllowedServiceIndustry(s.slug, ind.slug)) permanentRedirect(`/industries/${ind.slug}`);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.shortName, path: `/services/${s.slug}` },
    { name: ind.name, path: `/${slug}` },
  ];

  const autoFaqs = [
    {
      q: `Does Public Pulse offer ${s.shortName} for ${ind.name} brands?`,
      a: `Yes. ${s.oneLiner} For ${ind.name} brands we calibrate the engagement to vertical priorities: ${ind.priorities.slice(0, 3).join(", ")}.`,
    },
    {
      q: `What makes ${s.shortName} for ${ind.name} different?`,
      a: ind.description,
    },
    {
      q: `Which other services pair well with this for ${ind.name}?`,
      a: `Our default ${ind.name} playbook pairs ${ind.alignedServices.slice(0, 3).join(", ")} — we walk through fit on a consultation call.`,
    },
    {
      q: `How is this priced?`,
      a: `Monthly retainer or per-campaign. Free 15-minute consultation; written scope + single KPI before kickoff.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            slug: s.slug,
            name: `${s.name} for ${ind.name}`,
            description: `${s.oneLiner} For Bangladesh ${ind.name} brands.`,
            serviceType: s.serviceType,
            category: s.category,
          }),
          breadcrumbSchema(crumbs),
          faqPageSchema(autoFaqs),
        ]}
      />

      <ProgrammaticPage
        crumbs={crumbs}
        chip={`${ind.name} × ${s.category}`}
        title={
          <>
            {s.shortName} for <Hl>{ind.name}</Hl>.
          </>
        }
        lead={`${s.oneLiner} Calibrated to ${ind.name} priorities.`}
        answer={serviceIndustryAnswer(s, ind)}
        answerQuestion={`What does ${s.shortName} for ${ind.name} look like?`}
        faqs={autoFaqs}
        related={[
          { href: `/services/${s.slug}`, label: `${s.shortName} (full overview)`, eyebrow: "Service" },
          { href: `/industries/${ind.slug}`, label: `${ind.name} marketing (vertical)`, eyebrow: "Industry" },
        ]}
        ctaTitle={
          <>
            <Hl>{s.shortName}</Hl> for {ind.name}?
          </>
        }
      >
        <CalloutList items={ind.priorities} />
      </ProgrammaticPage>
    </>
  );
}
