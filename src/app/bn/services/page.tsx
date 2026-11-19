import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { BnHero } from "@/components/bn/BnHero";
import { BN_SERVICES } from "@/content/bn/services";

export const metadata: Metadata = buildMetadata({
  title: "৯টি ডিজিটাল মার্কেটিং সেবা | পাবলিক পালস এজেন্সি",
  description:
    "পলিটিক্যাল পিআর, সোশ্যাল মিডিয়া, কনটেন্ট প্রোডাকশন, পেইড অ্যাডস, হসপিটালিটি, ব্র্যান্ডিং, এসইও ও অ্যানালিটিক্স — ঢাকার এক ছাদের নিচে।",
  path: "/bn/services",
  locale: "bn",
  enPath: "/services",
});

const crumbs = [
  { name: "হোম", path: "/bn" },
  { name: "সেবা", path: "/bn/services" },
];

export default function BnServicesPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <BnHero
        crumbs={crumbs}
        chip="আমাদের সেবা"
        title={<>নয়টি ধারালো সেবা। <span className="text-brand-orange">একটি দায়বদ্ধ দল।</span></>}
        lead="কৌশল, ক্রিয়েটিভ, পেইড মিডিয়া ও অ্যানালিটিক্স — একই ঘরে, একই সাপ্তাহিক রিপোর্টে।"
        answer="পাবলিক পালস এজেন্সি ঢাকাভিত্তিক ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর প্রতিষ্ঠান। আমরা পলিটিক্যাল পিআর, সোশ্যাল মিডিয়া, কনটেন্ট প্রোডাকশন, পেইড অ্যাডস, হসপিটালিটি মার্কেটিং, ব্র্যান্ড বিল্ডিং, এসইও ও অ্যানালিটিক্স — সবই একটি দায়বদ্ধ দলের অধীনে করি।"
      />
      <section className="border-t border-white/10 bg-cp-night py-20 text-white md:py-28">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BN_SERVICES.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/bn/services/${s.slug}`}
                  className="group block h-full rounded-card border border-white/15 bg-white/[0.06] p-7 transition hover:-translate-y-1 hover:border-brand-orange"
                >
                  <span className="font-mono text-meta text-white/70">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight">{s.name}</h2>
                  <p className="mt-3 text-white/70">{s.oneLiner}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                    বিস্তারিত <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
