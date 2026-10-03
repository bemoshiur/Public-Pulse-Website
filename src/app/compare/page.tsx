import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { COMPARES } from "@/lib/content/compares";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Compare Marketing Options in Bangladesh | Public Pulse",
  description:
    "Side-by-side comparisons for Bangladesh marketing decisions: in-house team vs integrated agency, Facebook Ads vs Google Ads, channel-by-channel decision matrices.",
  path: "/compare",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Compare", path: "/compare" },
];

export default function CompareIndex() {
  const ready = COMPARES.filter((c) => c.ready);
  const faqs = [
    {
      q: "What does the compare library contain?",
      a: `${ready.length} side-by-side decision matrices for Bangladesh marketing choices: ${ready.map((c) => `${c.leftLabel} vs ${c.rightLabel}`).join("; ")}.`,
    },
    {
      q: "Do the comparisons just recommend Public Pulse?",
      a: "No. Each compare ends with an honest recommendation, not an agency pitch.",
    },
    {
      q: "How is each comparison laid out?",
      a: "As a side-by-side decision matrix, followed by a recommendation and its own set of frequently asked questions.",
    },
    {
      q: "How do I get help applying a comparison to my business?",
      a: `Message the team on WhatsApp, send a brief through the contact page, or email ${SITE.contact.email}.`,
    },
  ];
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs),
          itemListSchema(
            "Public Pulse Comparisons",
            ready.map((c) => ({ url: `/compare/${c.slug}`, name: c.title }))
          ),
        ]}
      />

      <GradientHero
        crumbs={crumbs}
        chip="Compare"
        title={
          <>
            Decision <span className="text-brand-orange">matrices</span>.
          </>
        }
        lead="Honest side-by-side comparisons for Bangladesh marketing decisions — no agency boosterism, no straw-man takedowns."
        answer="The Public Pulse compare library publishes side-by-side decision matrices for the calls Bangladesh marketing teams have to make — in-house team vs integrated agency, Facebook Ads vs Google Ads, channel-by-channel cost/benefit. Each compare ends with an honest recommendation, not an agency pitch."
      />

      <section className="bg-paper py-16 md:py-24">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {ready.map((c) => (
              <li key={c.slug}>
                <Link href={`/compare/${c.slug}`} className="card group flex h-full flex-col">
                  <span className="text-meta font-semibold uppercase text-brand-orange">
                    {c.leftLabel} vs {c.rightLabel}
                  </span>
                  <h2 className="mt-3 text-h3 font-bold text-ink">{c.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {c.description}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                    Open
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
      </section>

      <FaqSection faqs={faqs} />
    </>
  );
}
