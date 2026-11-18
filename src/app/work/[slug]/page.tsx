// /work/[slug] — client-work detail page. The deepest surface of the
// portfolio: media hero, meta strip, AnswerBlock, narrative, metrics,
// gallery, deliverables, testimonial, cross-links, related work, CTA.
//
// Every section below narrative is optional data — a work can legitimately
// ship with no media, no metrics, no testimonial, and an anonymised client.
// Each section is gated on its own data so the page always renders a
// coherent whole, never an empty heading or broken layout.
//
// Anonymisation is a confidentiality boundary: when confidentiality ===
// "anonymised" the client's real name/logo/url must never reach the DOM or
// the JSON-LD — only anonLabel. See the confidentiality guard below and in
// creativeWorkSchema's clientName/clientUrl inputs.

import { permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, creativeWorkSchema, reviewSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { CountUp } from "@/components/ui/CountUp";
import { MediaFrame } from "@/components/work/MediaFrame";
import { Gallery } from "@/components/work/Gallery";
import { getWorkBySlug, getPublishedWorks, getRelatedWorks } from "@/lib/data/works";
import { getDiscipline } from "@/lib/taxonomies/disciplines";
import { getService } from "@/lib/services";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const works = await getPublishedWorks("en");
  return works.map((w) => ({ slug: w.slug }));
}

// dynamicParams=true + redirect-on-miss: an unknown slug 308s to the hub
// instead of 404ing (project-wide crawl rule; see JOURNEY STEP 28).
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  const client =
    work.confidentiality === "anonymised" ? (work.anonLabel ?? "") : (work.client?.name ?? "");
  return buildMetadata({
    title: work.seoTitle ?? `${work.title} | Public Pulse Work`,
    description: work.seoDescription ?? work.summary,
    path: `/work/${work.slug}`,
    ogType: "article",
    useDynamicOg: true,
    ogTitle: work.title,
    ogEyebrow: client ? client.toUpperCase() : "CLIENT WORK",
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) permanentRedirect("/work");

  const related = await getRelatedWorks(work.slug, {
    clientId: work.clientId,
    industrySlug: work.industrySlug,
    disciplines: work.disciplines,
  });

  const isAnon = work.confidentiality === "anonymised";
  const clientLabel = isAnon ? (work.anonLabel ?? "Confidential client") : (work.client?.name ?? "");
  const hero = work.media.find((m) => m.role === "hero") ?? work.media[0];
  const gallery = work.media.filter((m) => m !== hero);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: work.title, path: `/work/${work.slug}` },
  ];

  // Stable @id creativeWorkSchema emits for this page — reused by
  // reviewSchema's itemReviewed so the Review node cross-references the
  // CreativeWork node rather than a bare name string.
  const creativeWorkId = `${absoluteUrl(`/work/${work.slug}`)}#creativework`;

  return (
    <article>
      <JsonLd
        data={[
          creativeWorkSchema({
            slug: work.slug,
            name: work.title,
            description: work.summary,
            // Client identity is suppressed entirely when anonymised.
            clientName: isAnon ? undefined : work.client?.name,
            clientUrl: isAnon ? undefined : (work.client?.website ?? undefined),
            datePublished: work.publishedAt ? new Date(work.publishedAt).toISOString() : undefined,
            images: work.media
              .filter((m) => m.kind === "image")
              .map((m) => ({ url: m.url, width: m.width, height: m.height, caption: m.caption })),
            keywords: work.disciplines.map((d) => getDiscipline(d)?.name ?? d),
            serviceSlugs: work.serviceSlugs,
          }),
          breadcrumbSchema(crumbs),
          // Review only when BOTH quote and attribution are real (rating-free).
          ...(work.testimonialQuote && work.testimonialAttribution
            ? [
                reviewSchema({
                  itemReviewed: creativeWorkId,
                  body: work.testimonialQuote,
                  // no `rating` — a testimonial quote is not a star rating (real-only)
                  authorName: work.testimonialAttribution,
                  ...(work.testimonialRole && { authorJobTitle: work.testimonialRole }),
                }),
              ]
            : []),
        ]}
      />

      {/* HERO — media-led when present, typographic when not */}
      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 overflow-hidden">
            <div className="px-6 py-12 md:px-12 md:py-14">
              <div className="max-w-3xl">
                {clientLabel && (
                  <p className="text-meta uppercase tracking-wider text-ink/65">{clientLabel}</p>
                )}
                <h1 className="mt-4 text-h1 tracking-tight text-ink">{work.title}</h1>
                {work.tagline && <p className="mt-5 text-lead text-ink/70">{work.tagline}</p>}
              </div>
            </div>
            {hero && <MediaFrame media={hero} priority className="rounded-none" sizes="100vw" />}
          </GreyPanel>

          {/* Meta strip */}
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/12 pt-8 md:grid-cols-4">
            {work.year && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
                  Year
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{work.year}</dd>
              </div>
            )}
            {work.disciplines.length > 0 && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
                  Disciplines
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">
                  {work.disciplines.map((d) => getDiscipline(d)?.name ?? d).join(" · ")}
                </dd>
              </div>
            )}
            {work.serviceSlugs.length > 0 && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
                  Services
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-x-2 text-sm font-medium text-ink">
                  {work.serviceSlugs.map((s) => {
                    const svc = getService(s);
                    return svc ? (
                      <Link
                        key={s}
                        href={`/services/${s}`}
                        className="underline underline-offset-4 hover:text-brand-orange"
                      >
                        {svc.shortName}
                      </Link>
                    ) : null;
                  })}
                </dd>
              </div>
            )}
            {work.windowLabel && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
                  Window
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{work.windowLabel}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 max-w-3xl">
            <AnswerBlock question={`What did Public Pulse do for ${clientLabel || "this client"}?`}>
              {work.summary}
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {/* NARRATIVE */}
      {(work.context || work.approach || work.outcome) && (
        <Section size="lg" className="bg-paper">
          <Container>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {(
                [
                  ["Context", work.context],
                  ["Approach", work.approach],
                  ["Outcome", work.outcome],
                ] as const
              )
                .filter(([, body]) => Boolean(body))
                .map(([label, body]) => (
                  <div key={label}>
                    <h2 className="text-h3 font-bold text-ink">{label}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{body}</p>
                  </div>
                ))}
            </div>
          </Container>
        </Section>
      )}

      {/* METRICS */}
      {work.metrics.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <GreyPanel tone="alt" radius="lg" className="px-6 py-12 md:px-12">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {work.metrics.map((m) => (
                  <li key={m.label}>
                    <CountUp
                      value={m.value}
                      className="block font-pr-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-tight text-ink"
                    />
                    <div className="mt-3 text-meta uppercase text-ink/65">{m.label}</div>
                    {m.timeframe && <div className="mt-1 text-meta text-ink/65">{m.timeframe}</div>}
                  </li>
                ))}
              </ul>
            </GreyPanel>
          </Container>
        </Section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <Section size="lg" className="bg-paper">
          <Container>
            <h2 className="sr-only">Gallery</h2>
            <Gallery items={gallery} />
          </Container>
        </Section>
      )}

      {/* DELIVERABLES */}
      {work.deliverables.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h2 tracking-tight text-ink">What we shipped.</h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {work.deliverables.map((d) => (
                  <li key={d} className="rounded-panel bg-paper-alt p-4 text-sm text-ink">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* TESTIMONIAL — real only */}
      {work.testimonialQuote && work.testimonialAttribution && (
        <Section size="lg" className="bg-paper">
          <Container>
            <figure className="mx-auto max-w-3xl rounded-panel bg-paper-alt p-8 md:p-12">
              <blockquote className="font-pr-serif text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-ink">
                &ldquo;{work.testimonialQuote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-ink/70">
                <span className="font-bold text-ink">{work.testimonialAttribution}</span>
                {work.testimonialRole && <span> · {work.testimonialRole}</span>}
              </figcaption>
            </figure>
          </Container>
        </Section>
      )}

      {/* CROSS-LINKS */}
      {(work.caseStudySlug || work.liveUrl || work.adLibraryUrl) && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-wrap gap-3">
              {work.caseStudySlug && (
                <Link href={`/case-studies/${work.caseStudySlug}`} className="btn btn-secondary">
                  See the numbers
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              {work.liveUrl && (
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Visit the live work
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
              {work.adLibraryUrl && (
                <a
                  href={work.adLibraryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Meta Ad Library
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <Section size="lg" className="bg-paper">
          <Container>
            <div className="max-w-3xl border-t border-ink/15 pt-8">
              <h2 className="text-h2 tracking-tight text-ink">More work.</h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/work/${r.slug}`} className="card group flex h-full flex-col">
                    <h3 className="text-h3 font-bold text-ink">{r.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{r.summary}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                      View work
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section size="lg" className="bg-paper">
        <Container>
          <GreyPanel tone="ink" radius="lg" className="px-6 py-20 text-center md:px-16 md:py-24">
            <h2 className="mx-auto max-w-4xl text-display leading-[0.98] tracking-tight text-white">
              Want work like this?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lead text-white/70">
              Free 15-minute consultation. We&rsquo;ll review your goals and tell you honestly whether
              we&rsquo;re the right fit.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/contact" className="btn btn-orange group">
                Start a project
                <ArrowCircle onDark />
              </Link>
            </div>
          </GreyPanel>
        </Container>
      </Section>
    </article>
  );
}
