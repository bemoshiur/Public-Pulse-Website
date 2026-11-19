import Link from "next/link";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, contactPageSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { BnHero } from "@/components/bn/BnHero";
import { BnFaq } from "@/components/bn/BnFaq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "পাবলিক পালস এজেন্সির সাথে যোগাযোগ | ঢাকা",
  description:
    "বিনামূল্যে পরামর্শ নিন। হোয়াটসঅ্যাপ +880 1717-714676, ইমেইল info@publicpulse.com.bd। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।",
  path: "/bn/contact",
  locale: "bn",
  enPath: "/contact",
});

const crumbs = [
  { name: "হোম", path: "/bn" },
  { name: "যোগাযোগ", path: "/bn/contact" },
];

const FAQS = [
  { q: "আপনারা কত দ্রুত উত্তর দেন?", a: "শনিবার থেকে বৃহস্পতিবার ২৪ ঘণ্টার মধ্যে। কর্মঘণ্টায় (সকাল ৯টা–রাত ৯টা, বাংলাদেশ সময়) হোয়াটসঅ্যাপে সাধারণত ২ ঘণ্টার মধ্যে।" },
  { q: "আমাকে কী তথ্য পাঠাতে হবে?", a: "আপনি কী বাড়াতে চান, ইতিমধ্যে কী চেষ্টা করেছেন এবং বাস্তবসম্মত বাজেট (থাকলে)। বাজেট না থাকলে সমস্যা নেই — কলে আমরা মোটামুটি ধারণা দেব।" },
  { q: "প্রথম কল কি সত্যিই বিনামূল্যে?", a: "হ্যাঁ — কোনো পিচ ডেক নেই, কোনো বাধ্যবাধকতা নেই। আমরা মানানসই হলে ভালো, না হলে সাধারণত যারা মানায় তাদের দিকে ইঙ্গিত দিতে পারি।" },
  { q: "বাংলাদেশের বাইরের ক্লায়েন্টদের সাথে কি কাজ করেন?", a: "বেশিরভাগ কাজ বাংলাদেশকেন্দ্রিক, তবে প্রবাসী ব্র্যান্ড ও কিছু বাংলাদেশ-সংশ্লিষ্ট ব্যবসার জন্যও কাজ করি। যোগাযোগ করুন — আমরা সৎভাবে বলব মানানসই কি না।" },
];

export default function BnContactPage() {
  const rows = [
    { Icon: MessageCircle, label: "হোয়াটসঅ্যাপ (দ্রুততম)", value: SITE.contact.phoneDisplay, href: SITE.contact.whatsapp },
    { Icon: Phone, label: "ফোন", value: SITE.contact.phoneDisplay, href: `tel:${SITE.contact.phone}` },
    { Icon: Mail, label: "ইমেইল", value: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
    { Icon: MapPin, label: "অবস্থান", value: "ঢাকা, বাংলাদেশ — গুগল ম্যাপে দেখুন", href: SITE.contact.mapsShareUrl },
  ];
  return (
    <>
      <JsonLd data={[contactPageSchema(), breadcrumbSchema(crumbs), faqPageSchema(FAQS, "none")]} />
      <BnHero
        crumbs={crumbs}
        chip="যোগাযোগ"
        title={<>চলুন কথা বলি। <span className="text-brand-orange">আপনার ব্রিফ শুনি।</span></>}
        lead="প্রতিটি ইমেইল ও হোয়াটসঅ্যাপ বার্তার উত্তর আমরা ২৪ ঘণ্টায় দিই (শনি–বৃহস্পতি)। অফিস সময় সকাল ৯টা–রাত ৯টা, এশিয়া/ঢাকা।"
        answer="পাবলিক পালস এজেন্সির সাথে ঢাকায় হোয়াটসঅ্যাপে +৮৮০ ১৭১৭-৭১৪৬৭৬ নম্বরে, ইমেইলে info@publicpulse.com.bd ঠিকানায় অথবা এই পেজের ফর্মের মাধ্যমে যোগাযোগ করা যায়। হোয়াটসঅ্যাপে সাধারণত দুই ঘণ্টার মধ্যে এবং ইমেইলে চব্বিশ ঘণ্টার মধ্যে উত্তর দেওয়া হয়। দল শনিবার থেকে বৃহস্পতিবার কাজ করে, আর প্রথম পরামর্শ বিনামূল্যে।"
        ctaLabel="১৫ মিনিটের কল বুক করুন"
        ctaHref="/bn/book"
      />
      <section className="bg-cp-night py-16 text-white md:py-24">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {rows.map(({ Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 rounded-card border border-white/15 p-6 transition hover:border-brand-orange"
                >
                  <Icon className="h-6 w-6 text-brand-orange" aria-hidden />
                  <span>
                    <span className="block font-mono text-meta uppercase tracking-wider text-white/70">{label}</span>
                    <span className="mt-1 block text-lg font-bold">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-white/70">
            বিস্তারিত ব্রিফ পাঠাতে চান? <Link href="/contact" className="text-brand-orange underline">ইংরেজি ফর্ম</Link> ব্যবহার করুন, অথবা বাংলায় সরাসরি হোয়াটসঅ্যাপ করুন।
          </p>
        </Container>
      </section>
      <BnFaq faqs={FAQS} />
    </>
  );
}
