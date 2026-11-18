import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { aboutPageSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { BnHero } from "@/components/bn/BnHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "পাবলিক পালস এজেন্সি সম্পর্কে | ঢাকার পিআর ও মার্কেটিং",
  description:
    "পাবলিক পালস এজেন্সি বাংলাদেশের ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর স্টুডিও, ২০২৪ সালে ঢাকায় প্রতিষ্ঠিত। নিবন্ধিত বাংলাদেশি প্রতিষ্ঠান থেকে টাকায় বিলযুক্ত নয়টি সমন্বিত সেবা।",
  path: "/bn/about",
  locale: "bn",
  enPath: "/about",
});

const crumbs = [
  { name: "হোম", path: "/bn" },
  { name: "আমাদের সম্পর্কে", path: "/bn/about" },
];

const PRINCIPLES = [
  { title: "প্রতিটি ব্রিফ সিনিয়রের হাতে", body: "প্রতিটি কাজের দায়িত্ব স্টুডিওর সিনিয়র পর্যায়ে। সিনিয়র নিজে ব্রিফ লেখেন এবং রিপোর্টে স্বাক্ষর করেন।" },
  { title: "বাংলাদেশের জন্য তৈরি", body: "ঢাকায় প্রতিষ্ঠিত, বাংলাদেশে নিয়োগ, টাকায় বিল। বাজার ফেসবুক-প্রথম বলে চ্যানেল মিশ্রণও তা-ই; নির্বাচনী এলাকা-স্তরের পিআর কারণ আমরা সেই স্তরেই কাজ করি।" },
  { title: "একটি দায়বদ্ধ দল", body: "কৌশল, ক্রিয়েটিভ, পেইড মিডিয়া, পিআর ও অ্যানালিটিক্স একই ব্রিফে, একই অফিসে, একটি সাপ্তাহিক রিপোর্টে। অন্য এজেন্সির হাত-বদলের ফাঁক এখানে নেই।" },
  { title: "সৎ রিপোর্টিং", body: "মাসিক বিজনেস রিভিউতে কী কাজ করল, কী করল না, এ সপ্তাহে কী বন্ধ করছি — সব থাকে। লোক-দেখানো ড্যাশবোর্ড নেই, সংখ্যা ফোলানো নেই; হিসাব আপনার ফাইন্যান্স দলের সাথে মেলে।" },
];

export default function BnAboutPage() {
  return (
    <>
      <JsonLd data={[{ ...aboutPageSchema({ path: "/bn/about", inLanguage: "bn-BD" }) }, breadcrumbSchema(crumbs)]} />
      <BnHero
        crumbs={crumbs}
        chip="স্টুডিও সম্পর্কে"
        title={<>সমন্বিত কাজের জন্য গড়া <span className="text-brand-orange">বাংলাদেশি স্টুডিও।</span></>}
        lead="পাবলিক পালস এজেন্সি ঢাকাভিত্তিক ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর স্টুডিও। নয়টি সমন্বিত সেবা, এক ছাদের নিচে।"
        answer="পাবলিক পালস এজেন্সি বাংলাদেশভিত্তিক ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর স্টুডিও। আমরা নয়টি সমন্বিত সেবা দিই — পলিটিক্যাল পিআর, সোশ্যাল মিডিয়া, কনটেন্ট প্রোডাকশন, পেইড মিডিয়া, হসপিটালিটি মার্কেটিং, ব্র্যান্ড বিল্ডিং, এসইও, অ্যানালিটিক্স ও ইনফ্লুয়েন্সার মার্কেটিং — ঢাকা থেকে, এক ছাদের নিচে।"
        ctaLabel="যোগাযোগ করুন"
        ctaHref="/bn/contact"
      />
      <section className="bg-cp-night py-20 text-white md:py-28">
        <Container>
          <p className="text-eyebrow uppercase text-brand-orange">আমাদের নীতি</p>
          <h2 className="mt-4 text-display tracking-tight">চারটি প্রতিশ্রুতি।</h2>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="rounded-card border border-white/15 p-7">
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-white/70">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="bg-paper py-16 md:py-20">
        <Container>
          <h2 className="text-h2 tracking-tight text-ink">নিবন্ধন ও তথ্য</h2>
          <ul className="mt-6 space-y-2 text-ink/80">
            <li>বিআইএন: {SITE.contact.legal.bin}</li>
            <li>ট্রেড লাইসেন্স: {SITE.contact.legal.tradeLicense}</li>
            <li>অবস্থান: ঢাকা, বাংলাদেশ</li>
          </ul>
        </Container>
      </section>
    </>
  );
}
