import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceMatcher } from "@/components/services/ServiceMatcher";
import { SERVICES } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Services in Bangladesh | Public Pulse",
  description:
    "Political PR, social media, content, paid ads, hospitality, branding, SEO, analytics and influencer marketing — nine integrated services under one Dhaka roof.",
  path: "/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const FAQS = [
  {
    q: "How many services does Public Pulse offer?",
    a: `Public Pulse offers ${SERVICES.length} integrated services: ${SERVICES.map((s) => s.name).join(", ")}. They can be taken one at a time or combined into a full 360° engagement.`,
  },
  {
    q: "How do I choose the right service?",
    a: "Use the three-question service matcher on this page. It asks about your goal, channels and industry, then ranks the top three matching services. You can also ask the team directly on WhatsApp.",
  },
  {
    q: "Who leads an engagement?",
    a: "Each engagement is led by a senior member of the team, with a single KPI agreed before kickoff.",
  },
  {
    q: "Are service prices published, and in which currency?",
    a: `Starting prices for every service are listed on the pricing page and billed in BDT. For a quote, email ${SITE.contact.email} or call ${SITE.contact.phoneDisplay}.`,
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqPageSchema(FAQS)]} />

      <GradientHero
        crumbs={crumbs}
        chip="Platform"
        title={
          <>
            Nine services. <span className="text-brand-orange">One</span> team.
          </>
        }
        lead="Pick one, or take the full 360°. Each engagement is led by a senior on our team with a single KPI agreed before kickoff."
        answer="Public Pulse Agency runs nine integrated digital marketing services for Bangladeshi brands, political candidates and hospitality businesses. They are political PR and election campaigns, social media, content production, paid ads, branding, SEO, analytics and influencer marketing. Each engagement is led by a senior team member with a single KPI agreed before kickoff."
      />

      <section className="bg-paper py-16 md:py-24">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              return (
                <li key={s.slug}>
                  <ScrollReveal delayMs={Math.min(i, 5) * 60}>
                    <Link href={`/services/${s.slug}`} className="card group flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-meta font-semibold text-ink/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="grid h-11 w-11 place-items-center rounded-full bg-brand-orange/12 text-brand-orange transition-transform duration-300 group-hover:scale-110"
                          aria-hidden
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h2 className="mt-6 text-h3 font-bold text-ink">{s.name}</h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{s.oneLiner}</p>
                      <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                        Explore
                        <ArrowRight
                          className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                          aria-hidden
                        />
                      </p>
                    </Link>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ─── Service matcher quiz ─────────────────────────────────────
          Interactive 3-question matcher → ranks top 3 services →
          deep-links into /book with service preselected. */}
      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">Not sure where to start?</p>
            <h2 className="mt-4 text-h1 tracking-tight text-ink">
              Three quick questions. We&rsquo;ll point you to the right service.
            </h2>
            <p className="mt-5 text-lead text-ink/65">
              Tells us your goal, channels, and industry. We rank our nine services against your answers and surface the top three matches.
            </p>
          </div>
          <div className="mt-10 max-w-3xl">
            <ServiceMatcher />
          </div>
        </Container>
      </section>

      <FaqSection faqs={FAQS} />
    </>
  );
}
