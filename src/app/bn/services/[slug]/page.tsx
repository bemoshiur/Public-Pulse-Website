import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { SERVICES, getService } from "@/lib/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { BnHero } from "@/components/bn/BnHero";
import { BN_SERVICES, BN_PROCESS, getBnService } from "@/content/bn/services";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BN_SERVICES.filter((b) => getService(b.slug)?.ready).map((b) => ({ slug: b.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const bn = getBnService(slug);
  if (!bn) return {};
  return buildMetadata({
    title: bn.seoTitle,
    description: bn.seoDescription,
    path: `/bn/services/${bn.slug}`,
    locale: "bn",
    enPath: `/services/${bn.slug}`,
  });
}

export default async function BnServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const bn = getBnService(slug);
  const en = getService(slug);
  if (!bn || !en || !en.ready) notFound();

  const crumbs = [
    { name: "হোম", path: "/bn" },
    { name: "সেবা", path: "/bn/services" },
    { name: bn.shortName, path: `/bn/services/${bn.slug}` },
  ];
  const svc = serviceSchema({
    slug: en.slug,
    name: bn.name,
    description: bn.oneLiner,
    serviceType: en.serviceType,
    category: en.category,
  });

  return (
    <article>
      <JsonLd
        data={[
          {
            ...svc,
            "@id": `${absoluteUrl(`/bn/services/${bn.slug}`)}#service`,
            url: absoluteUrl(`/bn/services/${bn.slug}`),
            inLanguage: "bn-BD",
            sameAs: absoluteUrl(`/services/${bn.slug}`),
          },
          breadcrumbSchema(crumbs),
        ]}
      />
      <BnHero crumbs={crumbs} chip={bn.shortName} title={bn.name} lead={bn.oneLiner} answer={bn.answer} />

      <section className="border-y border-ink bg-paper-alt py-16 md:py-20">
        <Container>
          <p className="mx-auto max-w-3xl text-center text-lead text-ink/80">{bn.intro}</p>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <p className="text-eyebrow uppercase text-brand-orange">কী কী থাকছে</p>
          <h2 className="mt-4 text-display tracking-tight text-ink">বক্সে যা যা আছে।</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {bn.included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-card border border-ink/15 p-5 transition hover:border-ink">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" aria-hidden />
                <span className="text-ink/85">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink py-20 text-paper md:py-28">
        <Container>
          <p className="text-eyebrow uppercase text-brand-green">কাজের ধাপ</p>
          <h2 className="mt-4 text-display tracking-tight">পাঁচ ধাপে কাজ।</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-5">
            {BN_PROCESS.map((p, i) => (
              <li key={p.title} className="rounded-card border border-white/15 p-5">
                <span className="font-mono text-meta text-brand-green">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper py-20 text-center md:py-24">
        <Container>
          <h2 className="text-display tracking-tight text-ink">শুরু করতে প্রস্তুত?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lead text-ink/70">
            বিনামূল্যে ১৫ মিনিটের কলে আপনার লক্ষ্য শুনে আমরা একটি কার্যকর পরিকল্পনার রূপরেখা দেব।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/bn/book" className="btn btn-orange">
              কল বুক করুন <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/bn/services" className="btn btn-secondary">সব সেবা</Link>
          </div>
        </Container>
      </section>
    </article>
  );
}
