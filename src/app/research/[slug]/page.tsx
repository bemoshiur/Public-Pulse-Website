import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, datasetSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProgrammaticPage, Hl } from "@/components/seo/ProgrammaticPage";
import { KeyTakeaways } from "@/components/seo/KeyTakeaways";
import { Container } from "@/components/ui/Container";
import { PUBLISHED_BENCHMARKS, getBenchmark } from "@/lib/content/benchmarks";

// First-party Bangladesh marketing benchmark pages — the "data moat".
// ONLY published benchmarks (real numbers) render; everything else 404s.
// generateStaticParams is empty until the user flips a benchmark to
// published:true in src/lib/content/benchmarks.ts, so no thin/fabricated page
// ever ships.

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PUBLISHED_BENCHMARKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBenchmark(slug);
  if (!b) return {};
  return buildMetadata({
    title: `${b.title} | Public Pulse Research`,
    description: b.description,
    path: `/research/${b.slug}`,
    useDynamicOg: true,
    ogTitle: b.metric,
    ogEyebrow: `Research · Bangladesh · ${b.temporalCoverage}`,
  });
}

export default async function BenchmarkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const b = getBenchmark(slug);
  if (!b) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
    { name: b.metric, path: `/research/${b.slug}` },
  ];

  const cite = `Public Pulse Agency, ${b.temporalCoverage} — https://publicpulse.com.bd/research/${b.slug}`;
  const faqs = [
    {
      q: `What is the ${b.metric.toLowerCase()} in Bangladesh?`,
      a: `${b.value}${b.unit ? ` ${b.unit}` : ""} (${b.context}). ${b.answer}`,
    },
    {
      q: `How was this measured?`,
      a: `${b.methodology}${b.sampleSize ? ` Sample size: ${b.sampleSize} data points.` : ""}`,
    },
    {
      q: `Can I cite this figure?`,
      a: `Yes. This is first-party Public Pulse Agency data, published under CC BY 4.0 with attribution. Cite as: ${cite}`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          datasetSchema({
            slug: b.slug,
            name: b.title,
            description: b.description,
            datePublished: b.collectedDate,
            keywords: b.keywords,
            variableMeasured: b.variableMeasured,
            measurementTechnique: b.methodology,
            sampleSize: b.sampleSize,
            temporalCoverage: b.temporalCoverage,
          }),
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs),
        ]}
      />

      <ProgrammaticPage
        crumbs={crumbs}
        chip={`Research · ${b.temporalCoverage}`}
        title={
          <>
            {b.metric} in <Hl>Bangladesh</Hl>
          </>
        }
        lead={b.description}
        answer={b.answer}
        answerQuestion={b.title}
        faqs={faqs}
        related={[
          { href: "/research", label: "All Bangladesh marketing benchmarks", eyebrow: "Research" },
          { href: "/pricing", label: "Public Pulse pricing (BDT)", eyebrow: "Pricing" },
          { href: "/contact", label: "Get a free marketing audit", eyebrow: "Talk to us" },
        ]}
        ctaTitle={
          <>
            Want numbers for <Hl>your</Hl> account?
          </>
        }
        ctaSub="We benchmark your campaigns against the Bangladesh market on a free 30-minute call."
      >
        <section className="bg-paper py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              {/* The single most-citable number, big and centered. */}
              <div className="rounded-2xl border border-ink/15 bg-paper-tint/50 p-10 text-center">
                <div className="text-mega leading-none tracking-tight text-brand-orange">
                  {b.value}
                </div>
                {b.unit && <p className="mt-3 text-lead text-ink/70">{b.unit}</p>}
                <p className="mt-1 text-sm text-ink/60">{b.context}</p>
              </div>

              {b.breakdown && b.breakdown.length > 0 && (
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/15">
                        <th className="py-2 pr-4 font-semibold text-ink">Segment</th>
                        <th className="py-2 font-semibold text-ink">{b.metric}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.breakdown.map((row) => (
                        <tr key={row.segment} className="border-b border-ink/10">
                          <td className="py-2 pr-4 text-ink/80">{row.segment}</td>
                          <td className="py-2 font-mono tabular-nums text-ink">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <KeyTakeaways
                title="Method & provenance"
                items={[
                  <>
                    <strong>Metric:</strong> {b.metric} — {b.value}
                    {b.unit ? ` ${b.unit}` : ""}
                  </>,
                  <>
                    <strong>Coverage:</strong> {b.context}
                  </>,
                  b.sampleSize ? (
                    <>
                      <strong>Sample:</strong> {b.sampleSize} data points
                    </>
                  ) : (
                    <>
                      <strong>Source:</strong> first-party Public Pulse campaign data
                    </>
                  ),
                  <>
                    <strong>Method:</strong> {b.methodology}
                  </>,
                  <>
                    <strong>Collected:</strong> {b.collectedDate} · <strong>Licence:</strong> CC BY 4.0
                    (cite with attribution)
                  </>,
                ]}
              />

              {b.body && <p className="mt-6 text-base leading-relaxed text-ink/85">{b.body}</p>}
            </div>
          </Container>
        </section>
      </ProgrammaticPage>
    </>
  );
}
