import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";

export const metadata: Metadata = buildMetadata({
  title: "Free Tools | Public Pulse — SEO, social, ad-spend audits",
  description:
    "Free interactive tools from Public Pulse Agency: instant SEO audit, social benchmark, ad-spend calculator. Built for Bangladesh brands.",
  path: "/tools",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools" },
];

const TOOLS = [
  {
    slug: "seo-audit",
    icon: Search,
    title: "SEO audit",
    body: "Enter your domain, get a 10-point on-page snapshot in 10 seconds. Title, meta, H1, OG, schema, TTFB, HSTS.",
    available: true,
  },
];

const FAQS = [
  {
    q: "Which free tools does Public Pulse offer?",
    a: "One tool is live today: the SEO audit, a 10-point on-page snapshot of a domain's homepage. A social benchmark, an ad-spend ROI calculator and an election readiness checker are listed as shipping soon.",
  },
  {
    q: "Do I need to sign up to use the tools?",
    a: "No. The basic versions need no signup. You can run the tool, read the findings and leave.",
  },
  {
    q: "Is there a limit on SEO audit runs, and is my domain stored?",
    a: "Each visitor can run five SEO audits per hour. Each run is stateless: the domain and the findings are not stored, and only a hashed IP address is counted for the rate limit.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: "/tools",
            name: "Free Tools",
            description: "Interactive tools from Public Pulse Agency for BD brands.",
          }),
          faqPageSchema(FAQS, "details"),
        ]}
      />

      <section className="bg-paper py-12 md:py-20">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-6 max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">Free tools</p>
            <h1 className="mt-4 text-h1 tracking-tight text-ink">
              Diagnostics you can run without a sales call.
            </h1>
            <p className="mt-5 text-lead text-ink/75">
              Interactive tools we built for Bangladesh brands. No signup for any of the basic versions — find out where you stand, then decide if you want help.
            </p>
            <AnswerBlock>
              The free tools page lists interactive diagnostics from Public Pulse Agency. Today it offers one tool, an on-page SEO audit that checks a domain&rsquo;s title, meta description, heading, Open Graph tags and schema in seconds. The basic versions need no signup, and a social benchmark, ad-spend calculator and election readiness checker are planned.
            </AnswerBlock>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-card-hover"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <t.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-h3 tracking-tight text-ink">{t.title}</h2>
                    <p className="mt-2 text-body text-ink/75">{t.body}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
                    Open <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
            <li className="rounded-card border border-dashed border-ink/15 p-6 text-meta text-ink/75">
              More tools shipping soon: social benchmark, ad-spend ROI calculator, election readiness checker.
            </li>
          </ul>
        </Container>
      </section>

      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">FAQ</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Tool questions.</h2>
          </div>
          <div className="mt-10 space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-card border border-ink/10 bg-paper p-5 open:shadow-card">
                <summary className="cursor-pointer list-none text-h3 tracking-tight text-ink marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span aria-hidden className="mt-1 text-brand-orange transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-body text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
