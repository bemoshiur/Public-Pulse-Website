import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Globe } from "@/components/home/Globe";
import { BN_SERVICES } from "@/content/bn/services";

export const metadata: Metadata = buildMetadata({
  title: "পাবলিক পালস — বাংলাদেশের ডিজিটাল মার্কেটিং ও পিআর এজেন্সি",
  description:
    "বাংলাদেশের ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর এজেন্সি। পলিটিক্যাল পিআর, সোশ্যাল মিডিয়া, কনটেন্ট, পেইড অ্যাডস, ব্র্যান্ডিং, এসইও। কল করুন +880 1717-714676।",
  path: "/bn",
  locale: "bn",
  enPath: "/",
});

export default function BnHomePage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "হোম", path: "/bn" }])]} />
      <section className="bg-cp-night text-white">
        <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-orange">ঢাকা · সিউল · ইউএসএ</p>
              <h1 className="mt-4 text-display leading-[1.1] tracking-tight">
                পাবলিক পালস — আমরা <span className="text-brand-orange">প্রভাব</span> দিয়ে ব্র্যান্ড গড়ি।
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
                ঢাকাভিত্তিক ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর স্টুডিও — রাজনৈতিক ক্যাম্পেইন, হসপিটালিটি লঞ্চ, কনজ্যুমার ব্র্যান্ড; সবই একটি দায়বদ্ধ দলের অধীনে।
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/bn/book" className="btn btn-orange">
                  কল বুক করুন <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/bn/services" className="btn border border-white/30 text-white hover:border-white">
                  আমাদের সেবা
                </Link>
              </div>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[520px] lg:col-span-5">
              <Globe />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-12">
          <div className="mx-auto max-w-3xl">
            <AnswerBlock>
              পাবলিক পালস এজেন্সি ঢাকাভিত্তিক ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর স্টুডিও। আমরা পলিটিক্যাল পিআর, সোশ্যাল মিডিয়া, কনটেন্ট প্রোডাকশন, পেইড অ্যাডস, হসপিটালিটি মার্কেটিং, ব্র্যান্ড বিল্ডিং, এসইও ও অ্যানালিটিক্স — একটি দায়বদ্ধ দলের অধীনে, ঢাকা থেকে করি। ইংরেজি ও বাংলা দুই ভাষায় কাজ হয় এবং সব বিলিং বাংলাদেশি টাকায় (বিডিটি)।
            </AnswerBlock>
          </div>
        </Container>
      </section>

      <section className="bg-cp-night py-20 text-white md:py-28">
        <Container>
          <p className="text-eyebrow uppercase text-brand-orange">আমরা যা করি</p>
          <h2 className="mt-4 text-display tracking-tight">
            নয়টি ধারালো সেবা। <span className="text-white/70">একটি দায়বদ্ধ দল।</span>
          </h2>
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BN_SERVICES.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/bn/services/${s.slug}`}
                  className="group block h-full rounded-card border border-white/15 bg-white/[0.06] p-7 transition hover:-translate-y-1 hover:border-brand-orange"
                >
                  <span className="font-mono text-meta text-white/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight">{s.name}</h3>
                  <p className="mt-3 text-white/70">{s.oneLiner}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-paper py-20 text-center md:py-24">
        <Container>
          <h2 className="text-display tracking-tight text-ink">চলুন, একসাথে শুরু করি।</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/bn/book" className="btn btn-orange">কল বুক করুন</Link>
            <Link href="/bn/contact" className="btn btn-secondary">যোগাযোগ</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
