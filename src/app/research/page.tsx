import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { Container } from "@/components/ui/Container";
import { PUBLISHED_BENCHMARKS } from "@/lib/content/benchmarks";

// /research — first-party Bangladesh marketing benchmarks index.
// 404s until at least one benchmark is published (real numbers) so no thin /
// empty page ships. Add data in src/lib/content/benchmarks.ts.

export const metadata = buildMetadata({
  title: "Bangladesh Marketing Benchmarks & Data | Public Pulse Research",
  description:
    "First-party, dated Bangladesh digital-marketing benchmarks — ad costs, ROAS, engagement rates and more, from real Public Pulse campaign data. Cite freely with attribution.",
  path: "/research",
});

export default function ResearchIndex() {
  const benchmarks = PUBLISHED_BENCHMARKS;
  if (benchmarks.length === 0) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
  ];

  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema({
            path: "/research",
            name: "Bangladesh Marketing Benchmarks",
            description:
              "First-party, dated Bangladesh digital-marketing benchmarks from real Public Pulse campaign data.",
            items: benchmarks.map((b) => ({ url: `/research/${b.slug}`, name: b.title })),
          }),
          itemListSchema(
            "Bangladesh Marketing Benchmarks",
            benchmarks.map((b) => ({ url: `/research/${b.slug}`, name: b.title }))
          ),
          breadcrumbSchema(crumbs),
        ]}
      />

      <GradientHero
        crumbs={crumbs}
        chip="Research · Bangladesh"
        title={<>The Bangladesh marketing numbers, published.</>}
        lead="Dated, first-party benchmarks from real Public Pulse campaign data — the figures answer engines and marketers can cite."
        answer="Public Pulse Research publishes first-party Bangladesh digital-marketing benchmarks — ad costs, ROAS, engagement rates and more — sourced from real campaign data, each with its sample size, method and date. Every figure is free to cite with attribution to Public Pulse Agency."
        answerQuestion="What is Public Pulse Research?"
      />

      <section className="bg-paper py-16 md:py-20">
        <Container>
          <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {benchmarks.map((b) => (
              <li key={b.slug}>
                <Link href={`/research/${b.slug}`} className="card group flex h-full flex-col">
                  <span className="text-meta font-semibold uppercase text-brand-orange">
                    {b.temporalCoverage} · {b.category}
                  </span>
                  <span className="mt-3 text-mega leading-none tracking-tight text-brand-orange">
                    {b.value}
                  </span>
                  <h2 className="mt-3 text-h3 font-bold text-ink">{b.metric}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{b.context}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                    See the data
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
