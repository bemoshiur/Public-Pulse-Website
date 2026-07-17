import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Info } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pricingSchema, webPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { PRICING } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { bookingUrl } from "@/lib/booking";

export const metadata: Metadata = buildMetadata({
  title: "Pricing | Public Pulse — Service tiers + starting BDT rates",
  description:
    "Transparent starting prices for every Public Pulse service — political PR, paid ads, social media, content, brand, SEO, hospitality, analytics, influencer. Billed in BDT.",
  path: "/pricing",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
];

const FAQS = [
  {
    q: "Are these final prices?",
    a: "These are STARTING points. The final quote comes after a free discovery call — usually within 24 hours of a brief landing in our inbox. We won't quote without scope.",
  },
  {
    q: "How are you billed?",
    a: "Monthly retainers are invoiced at the start of each cycle. Project work is split 50/50 — half on kickoff, half on delivery. All BDT, with VAT where applicable. Foreign-currency billing available on request.",
  },
  {
    q: "Is the media spend included?",
    a: "No. Agency fees are separate from the media budget you spend on Meta, Google, etc. We can quote both together if you want a single number.",
  },
  {
    q: "What does the discovery call cover?",
    a: "30 minutes. We map your goal to a scope and confirm whether we're the right fit. No pitch deck — you get a written proposal within 24 hours after the call.",
  },
  {
    q: "Can you work with smaller budgets?",
    a: "Some of our services scale down (content production has per-day rates; SEO has audits below ৳50k). For full retainers, BDT 45,000+/month is the realistic minimum.",
  },
];

export default function PricingPage() {
  const booking = bookingUrl();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: "/pricing",
            name: "Public Pulse Pricing",
            description: "Starting prices for every Public Pulse service, billed in BDT.",
          }),
          pricingSchema(),
          faqPageSchema(FAQS),
        ]}
      />

      {/* ─── Hero — inset panel ──────────────────────────────────────── */}
      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 px-6 py-12 md:px-12 md:py-16">
            <div className="max-w-3xl">
              <p className="text-eyebrow uppercase text-brand-orange">Pricing</p>
              <h1 className="mt-4 text-h1 tracking-tight text-ink">
                Starting rates for every service.
              </h1>
            </div>
          </GreyPanel>
          <div className="mt-6 max-w-3xl">
            <AnswerBlock>
              Public Pulse Agency is billed in BDT from a registered Bangladesh entity. Monthly
              retainers start from ৳45,000 for single-platform social or paid-ads campaigns; full
              multi-channel engagements typically run ৳1,20,000+/month. Project work (brand identity,
              video production, websites) starts from ৳1,50,000 one-time. Every quote is anchored on
              a 30-min free discovery call, then a written proposal within 24 hours.
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {/* ─── Per-service tier blocks ────────────────────────────── */}
      <Section size="md" className="bg-paper-alt">
        <Container>
          <div className="space-y-16">
            {PRICING.map((svc) => (
              <div key={svc.serviceSlug} id={svc.serviceSlug} className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-eyebrow uppercase text-ink/55">Service</p>
                    <h2 className="mt-2 text-h2 tracking-tight text-ink">{svc.displayName}</h2>
                  </div>
                  <Link
                    href={`/services/${svc.serviceSlug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
                  >
                    Service detail
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {svc.tiers.map((tier, ti) => {
                    // Highlight the middle tier when a service ships three (the
                    // Dataplace "featured plan" pattern) — subtle, not loud.
                    const featured = svc.tiers.length === 3 && ti === 1;
                    return (
                      <article
                        key={tier.name}
                        className={`flex flex-col rounded-panel p-6 md:p-7 ${
                          featured
                            ? "bg-paper ring-2 ring-brand-orange/50"
                            : "border border-ink/10 bg-paper"
                        }`}
                      >
                        <p className="text-eyebrow uppercase tracking-wider text-brand-orange">
                          {tier.name}
                        </p>
                        <div className="mt-3 flex items-baseline gap-2">
                          {tier.monthly && (
                            <>
                              <span className="font-pr-serif text-display-number font-medium tracking-tight text-ink">
                                {tier.monthly}
                              </span>
                              <span className="text-meta text-ink/55">/ month</span>
                            </>
                          )}
                          {!tier.monthly && tier.setup && (
                            <>
                              <span className="font-pr-serif text-h2 tracking-tight text-ink">
                                {tier.setup}
                              </span>
                              <span className="text-meta text-ink/55">setup</span>
                            </>
                          )}
                          {!tier.monthly && !tier.setup && tier.oneTime && (
                            <span className="font-pr-serif text-h2 tracking-tight text-ink">
                              {tier.oneTime}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-meta text-ink/65">{tier.bestFor}</p>
                        <ul className="mt-5 flex-1 space-y-2">
                          {tier.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                              <Check
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange"
                                aria-hidden
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={
                            booking
                              ? `/book?service=${svc.serviceSlug}`
                              : `/contact?service=${svc.serviceSlug}`
                          }
                          className="btn btn-orange mt-6 w-full justify-center text-[14px]"
                        >
                          {booking ? "Book a call" : "Talk to us"}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {svc.notes && svc.notes.length > 0 && (
                  <div className="mt-4 flex items-start gap-2 text-meta text-ink/55">
                    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden />
                    <div>{svc.notes.join(" · ")}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── FAQ ─────────────────────────────────────────────────────── */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">FAQ</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Pricing questions.</h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-panel bg-paper-alt p-6 md:p-7"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-h3 tracking-tight text-ink marker:hidden">
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className="mt-1 text-brand-orange transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-body text-ink/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── Closing CTA — dark inset panel ─────────────────────────── */}
      <Section size="lg" className="bg-paper">
        <Container>
          <GreyPanel tone="ink" radius="lg" className="px-6 py-14 md:px-12 md:py-16">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="text-h2 tracking-tight text-paper">Got a budget in mind?</h2>
                <p className="mt-3 text-white/70">
                  Send us your range + goal and we&rsquo;ll come back with a scope that fits. Reply
                  within 24 hours, Sat–Thu.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={booking ? "/book" : "/contact"} className="btn btn-orange group">
                  {booking ? "Book a 30-min call" : "Send a brief"}
                  <ArrowCircle onDark />
                </Link>
                <a
                  href={SITE.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-dark"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </GreyPanel>
        </Container>
      </Section>
    </>
  );
}
