import { permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { InlineBlock } from "@/components/lead-capture";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SERVICES, getService } from "@/lib/services";
import { getServiceContent } from "@/content/services";
import { getPostsBySourceRef } from "@/lib/data/blog";
import { getWorksByService } from "@/lib/data/works";
import { WorkCard } from "@/components/work/WorkCard";
import { CampaignProfile } from "@/components/election/CampaignProfile";
import { getBnService } from "@/content/bn/services";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICES.filter((s) => s.ready).map((s) => ({ slug: s.slug }));
}

// dynamicParams=true so an unknown /services/<slug> renders at runtime and
// hits the redirect below (a clean 308 to the hub) instead of the 502 that
// OpenNext/Lambda returns for an unmatched param when dynamicParams=false.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    bnPath: getBnService(service.slug) ? `/bn/services/${service.slug}` : undefined,
    // Per-service OG card via the dynamic /og?title=&eyebrow= factory.
    // Headline uses the clean service name (not the verbose SEO title with
    // "| Public Pulse" suffix); chip uses the category in caps. Each service
    // now shares a distinct preview instead of the generic homepage OG.
    useDynamicOg: true,
    ogTitle: service.name,
    ogEyebrow: service.category.toUpperCase(),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  const content = service && service.ready ? getServiceContent(service.slug) : undefined;
  if (!service || !service.ready || !content) permanentRedirect("/services");

  // Topical cluster: blog posts whose grounding cites this service slug.
  const relatedPosts = await getPostsBySourceRef(service.slug, "en", 3);
  // Inbound proof rail — published client work citing this service slug.
  const serviceWorks = await getWorksByService(service.slug, 3);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortName, path: `/services/${service.slug}` },
  ];

  return (
    <article>
      <JsonLd
        data={[
          serviceSchema({
            slug: service.slug,
            name: service.name,
            description: service.oneLiner,
            serviceType: service.serviceType,
            category: service.category,
          }),
          breadcrumbSchema(crumbs),
          faqPageSchema(content.faqs),
        ]}
      />

      <GradientHero
        crumbs={crumbs}
        chip={service.category}
        title={
          <>
            {service.name}
            <span className="text-brand-orange">.</span>
          </>
        }
        lead={service.oneLiner}
        answer={content.answer}
        answerQuestion={`What is ${service.shortName} at Public Pulse Agency?`}
        primaryCtaLabel="Start a project"
      />

      {/* ═══ INTRO ═══════════════════════════════════════════════════════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <GreyPanel tone="alt" radius="lg" className="px-6 py-12 md:px-12 md:py-14">
            <p className="mx-auto max-w-3xl text-center text-lead text-ink/80">{content.intro}</p>
          </GreyPanel>
        </Container>
      </Section>

      {/* ═══ DELIVERABLES ════════════════════════════════════════════════ */}
      <Section size="lg" id="deliverables" className="bg-paper">
        <Container>
          <div className="max-w-3xl border-t border-ink/15 pt-8">
            <p className="text-eyebrow uppercase text-brand-orange">Deliverables</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">What&rsquo;s in the box.</h2>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2">
            {content.included.map((item, i) => (
              <li key={item}>
                <ScrollReveal delayMs={Math.min(i, 8) * 40}>
                  <div className="flex items-start gap-3 rounded-panel bg-paper-alt p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" aria-hidden />
                    <span className="text-sm leading-relaxed text-ink">{item}</span>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ═══ PROCESS — light inset cards ═════════════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="max-w-3xl border-t border-ink/15 pt-8">
            <p className="text-eyebrow uppercase text-brand-orange">How it runs</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">5-step process.</h2>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {content.process.map((step, i) => (
              <li key={step.title}>
                <ScrollReveal delayMs={i * 60}>
                  <div className="h-full rounded-panel bg-paper-alt p-6">
                    <span className="font-mono text-meta font-semibold uppercase text-brand-orange">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-h3 font-bold leading-tight text-ink">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.body}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ═══ WHY US ══════════════════════════════════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="max-w-3xl border-t border-ink/15 pt-8">
            <p className="text-eyebrow uppercase text-brand-orange">Why us</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">
              Why Public Pulse for {service.shortName}?
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {content.whyChooseUs.map((w) => (
              <li key={w.title}>
                <div className="card h-full">
                  <h3 className="text-h3 font-bold text-ink">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ═══ FAQ ═════════════════════════════════════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">FAQ</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Frequently asked.</h2>
            <dl className="mt-10 space-y-3">
              {content.faqs.map((f) => (
                <div key={f.q} className="rounded-panel bg-paper-alt p-6 md:p-7">
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* ═══ FREE AUDIT — service-specific lead capture ══════════════════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <InlineBlock context="service" />
        </Container>
      </Section>

      {/* ═══ RELATED POSTS (topical cluster — only if posts cite this service) ══ */}
      {relatedPosts.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="max-w-3xl border-t border-ink/15 pt-8">
              <p className="text-eyebrow uppercase text-brand-orange">From the blog</p>
              <h2 className="mt-4 text-h2 tracking-tight text-ink">
                Practitioner guides on {service.shortName.toLowerCase()}.
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <li key={`${p.slug}-${p.locale}`}>
                  <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col">
                    <span className="text-meta font-semibold uppercase text-brand-orange">
                      {p.categorySlug}
                    </span>
                    <h3 className="mt-3 text-h3 font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{p.excerpt}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                      Read · {p.readingTime} min
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ═══ PROOF — inbound client work citing this service ═══════════════ */}
      {serviceWorks.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="max-w-3xl border-t border-ink/15 pt-8">
              <p className="text-eyebrow uppercase text-brand-orange">Proof</p>
              <h2 className="mt-4 text-h2 tracking-tight text-ink">
                {service.shortName} work we&rsquo;ve shipped.
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {serviceWorks.map((w) => (
                <li key={w.id}>
                  <WorkCard work={w} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ═══ SPECIALIZATION (political-pr + paid-ads → flagship) ═══════════ */}
      {(service.slug === "political-pr" || service.slug === "paid-ads") && (
        <Section size="sm" className="bg-paper">
          <Container>
            <GreyPanel tone="alt" radius="lg" className="px-6 py-10 md:px-12">
              <div className="mx-auto max-w-3xl">
                <p className="text-eyebrow uppercase text-brand-orange">Specialization</p>
                <h2 className="mt-3 text-h2 tracking-tight text-ink">Running for office?</h2>
                <p className="mt-4 text-lead text-ink/70">
                  We run compliant, Meta-authorized{" "}
                  <Link
                    href="/political-facebook-ads-bangladesh"
                    className="font-semibold text-brand-orange underline underline-offset-4"
                  >
                    political Facebook advertising
                  </Link>{" "}
                  for Bangladeshi candidates and parties — constituency targeting, &ldquo;Paid for
                  by&rdquo; disclaimers, and BDT budgets, run from Dhaka.
                </p>
              </div>
            </GreyPanel>
          </Container>
        </Section>
      )}

      {/* ═══ CAMPAIGN PROFILE (political-pr only — the Canva brochure, as PDF) ══ */}
      {service.slug === "political-pr" && (
        <Section size="sm" className="bg-paper">
          <Container>
            <CampaignProfile variant="band" />
          </Container>
        </Section>
      )}

      {/* ═══ RELATED ═════════════════════════════════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="max-w-3xl border-t border-ink/15 pt-8">
            <p className="text-eyebrow uppercase text-brand-orange">Related</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Pair with.</h2>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {SERVICES.filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="card group flex h-full flex-col">
                    <span className="text-meta font-semibold uppercase text-brand-orange">
                      {s.category}
                    </span>
                    <h3 className="mt-3 text-h3 font-bold text-ink">{s.shortName}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{s.oneLiner}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                      Explore
                      <ArrowRight
                        className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                        aria-hidden
                      />
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </Container>
      </Section>

      {/* ═══ CTA — dark inset panel (Dataplace T9) ═══════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <GreyPanel tone="ink" radius="lg" className="px-6 py-20 text-center md:px-16 md:py-24">
            <h2 className="mx-auto max-w-4xl text-display leading-[0.98] tracking-tight text-white">
              Ready for <span className="text-brand-orange">{service.shortName}</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lead text-white/70">
              Free 15-minute consultation. We&rsquo;ll review your situation and propose a plan.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn btn-orange group">
                Get a free consultation
                <ArrowCircle onDark />
              </Link>
            </div>
          </GreyPanel>
        </Container>
      </Section>
    </article>
  );
}
