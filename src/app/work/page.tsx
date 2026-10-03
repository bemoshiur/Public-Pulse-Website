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

      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 px-6 py-12 md:px-12 md:py-16">
            <div className="max-w-3xl">
              <span className="chip chip-orange">Work</span>
              <h1 className="mt-5 text-h1 tracking-tight text-ink">
                The work, <span className="text-brand-orange">in the open</span>.
              </h1>
              <p className="mt-5 text-lead text-ink/70">
                Campaigns, brand systems, social, paid media and film for Bangladeshi brands. Where a
                client is under NDA we show the outcome without the name.
              </p>
            </div>
          </GreyPanel>
          <div className="mt-6 max-w-3xl">
            <AnswerBlock>
              Public Pulse Agency&rsquo;s client work spans political campaigns, hospitality, e-commerce
              and brand building across Bangladesh. Each project below lists the client (or an
              anonymised sector label under NDA), the services delivered, the work itself, and the
              measured outcome where the client permits publication.
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {logoClients.length > 0 && (
        <Section size="sm" className="bg-paper">
          <Container>
            <p className="text-center text-meta uppercase tracking-wider text-ink/65">Trusted by</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {logoClients.map((c) => (
                <li key={c.id}>
                  <Image
                    src={c.logoUrl as string}
                    alt={c.name}
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain opacity-70"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section size="lg" className="bg-paper">
        <Container>
          <h2 className="text-h2 tracking-tight text-ink">Selected work</h2>
          {works.length === 0 ? (
            <div className="mt-8 rounded-panel border border-dashed border-ink/20 bg-paper-alt p-10 text-center">
              <p className="text-ink/65">
                Selected work is being prepared for publication — check back shortly.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <WorksFilter works={works} disciplines={DISCIPLINES} />
            </div>
          )}
        </Container>
      </Section>

      <Section size="sm" className="bg-paper">
        <Container>
          <InlineBlock context="service" />
        </Container>
      </Section>

      <FaqSection faqs={faqs} />
    </>
  );
}
