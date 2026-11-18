import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProgrammaticPage, CalloutList, Hl } from "@/components/seo/ProgrammaticPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LOCATIONS, getLocation } from "@/lib/taxonomies/locations";
import { getIndustry } from "@/lib/taxonomies/industries";
import { SERVICES, getService } from "@/lib/services";
import { locationAnswer } from "@/lib/taxonomies/matrix";
import { getWorksByLocation } from "@/lib/data/works";
import { WorkCard } from "@/components/work/WorkCard";

type Params = { city: string };

export function generateStaticParams(): Params[] {
  return LOCATIONS.map((l) => ({ city: l.slug }));
}

// dynamicParams=true → unknown city redirects (308) instead of 502ing.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return {};
  return buildMetadata({
    title: `Digital Marketing Agency in ${loc.name} | Public Pulse`,
    description: `Public Pulse Agency for ${loc.name}: digital marketing, paid ads, SEO, PR, content. Grounded in the real ${loc.name} market — ${loc.topIndustries.slice(0, 3).join(", ")}.`,
    path: `/locations/${loc.slug}`,
    useDynamicOg: true,
    ogTitle: `Digital Marketing in ${loc.name}`,
    ogEyebrow: `LOCATION · ${loc.name.toUpperCase()}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) permanentRedirect("/locations");

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: loc.name, path: `/locations/${loc.slug}` },
  ];

  // Aligned services for this city (intersection of topIndustries → SERVICES).
  const aligned = SERVICES.filter((s) => s.ready).slice(0, 6);

  // Top 3 over-indexed industries — content hook for FAQ + body copy.
  const top = loc.topIndustries.slice(0, 3);

  // Inbound proof rail — published client work delivered in this city.
  const locationWorks = await getWorksByLocation(loc.slug, 3);

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema({
            city: loc.name,
            url: `https://publicpulse.com.bd/locations/${loc.slug}`,
          }),
          breadcrumbSchema(crumbs),
          faqPageSchema([
            {
              q: `Does Public Pulse Agency serve clients in ${loc.name}?`,
              a: `Yes. We run active digital marketing and political PR engagements in ${loc.name} from our Dhaka HQ. ${loc.characterizedBy}`,
            },
            {
              q: `What industries in ${loc.name} does Public Pulse focus on?`,
              a: `${loc.name}'s economy over-indexes on ${top.join(", ")}. We tailor every engagement to the dominant local verticals rather than running a generic playbook.`,
            },
            {
              q: `How does Public Pulse handle billing for ${loc.name} clients?`,
              a: `Standard BDT invoicing from our registered Bangladesh entity (BIN 009043032-0102). VAT included. Monthly retainer or per-campaign — your call.`,
            },
            {
              q: `Can engagements be run fully remote from ${loc.name}?`,
              a: `Yes for most digital work. Field-heavy engagements (event activation, on-the-ground political PR, location photo/video) require a local production day which we'll cost separately.`,
            },
          ]),
        ]}
      />

      <ProgrammaticPage
        crumbs={crumbs}
        chip={`${loc.division} Division`}
        title={
          <>
            Digital marketing agency in <Hl>{loc.name}</Hl>.
          </>
        }
        lead={`${loc.characterizedBy} Public Pulse delivers paid ads, SEO, PR and content across the city's dominant industries.`}
        answer={locationAnswer(loc)}
        answerQuestion={`What does Public Pulse do for clients in ${loc.name}?`}
        faqs={[
          {
            q: `Does Public Pulse Agency serve clients in ${loc.name}?`,
            a: `Yes. We run active digital marketing and political PR engagements in ${loc.name} from our Dhaka HQ. ${loc.characterizedBy}`,
          },
          {
            q: `What industries in ${loc.name} does Public Pulse focus on?`,
            a: `${loc.name}'s economy over-indexes on ${top.join(", ")}. We tailor every engagement to the dominant local verticals rather than running a generic playbook.`,
          },
          {
            q: `How does Public Pulse handle billing for ${loc.name} clients?`,
            a: `Standard BDT invoicing from our registered Bangladesh entity (BIN 009043032-0102). VAT included. Monthly retainer or per-campaign — your call.`,
          },
          {
            q: `Can engagements be run fully remote from ${loc.name}?`,
            a: `Yes for most digital work. Field-heavy engagements (event activation, on-the-ground political PR, location photo/video) require a local production day which we'll cost separately.`,
          },
        ]}
        related={[
          // Only link industries that actually have a page — some cities'
          // topIndustries (logistics, manufacturing, fmcg…) aren't in the
          // 10-item INDUSTRIES catalog, so linking them raw = a real 404.
          ...top
            .filter((ind) => getIndustry(ind))
            .map((ind) => ({
              href: `/industries/${ind}`,
              label: `${ind.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())} marketing`,
              eyebrow: "Industry",
            })),
          ...aligned.slice(0, Math.max(0, 3 - top.filter((ind) => getIndustry(ind)).length)).map((s) => ({
            href: `/${s.slug}/${loc.slug}`,
            label: `${s.shortName} in ${loc.name}`,
            eyebrow: "Service × Location",
          })),
        ].slice(0, 3)}
        ctaTitle={
          <>
            A campaign in <Hl>{loc.name}</Hl>?
          </>
        }
      >
        <CalloutList
          items={[
            `In-house BDT invoicing — VAT-compliant, registered Bangladesh entity`,
            `Active client roster across ${loc.topIndustries.length} ${loc.name} verticals`,
            `${loc.population} population — campaign sizing calibrated to real market reach`,
            `Same one-team accountability as a Dhaka engagement`,
            `Local production day available for field-heavy work`,
            `Bangla + English creative, both calibrated for ${loc.name}`,
          ]}
        />

        <section className="bg-paper py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <div className="border-t border-ink/15 pt-8">
              <p className="text-eyebrow uppercase text-brand-orange">Service mix</p>
              <h2 className="mt-4 text-h2 tracking-tight text-ink">
                The services {loc.name} brands ask for.
              </h2>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {aligned.map((s, i) => (
                <li
                  key={s.slug}
                  className="flex items-center gap-3 rounded-panel bg-paper-alt p-4"
                >
                  <span className="font-mono text-meta font-semibold text-ink/75">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink">{s.shortName}</span>
                  <a
                    href={`/${s.slug}/${loc.slug}`}
                    className="text-meta font-semibold uppercase text-brand-orange"
                  >
                    In {loc.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Proof rail — same markup as the industry rail in
            src/app/industries/[industry]/page.tsx. Both are ProgrammaticPage
            children, so both use the Section/Container primitives rather than
            a hand-rolled <section> + max-w wrapper. */}
        {locationWorks.length > 0 && (
          <Section size="md" className="bg-paper">
            <Container>
              <div className="max-w-3xl border-t border-ink/15 pt-8">
                <p className="text-eyebrow uppercase text-brand-orange">Proof</p>
                <h2 className="mt-4 text-h2 tracking-tight text-ink">
                  Work we&rsquo;ve shipped in {loc.name}.
                </h2>
              </div>
              <ul className="mt-10 grid gap-4 md:grid-cols-3">
                {locationWorks.map((w) => (
                  <li key={w.id}>
                    <WorkCard work={w} />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )}
      </ProgrammaticPage>
    </>
  );
}

// Keep an export for getService usage elsewhere referenced in the dynamic body.
void getService;
