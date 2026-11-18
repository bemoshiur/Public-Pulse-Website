import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { BN_SERVICES } from "@/content/bn/services";

export function FooterBn() {
  return (
    <footer className="bg-cp-night text-white">
      <div className="overflow-hidden border-b border-white/10 py-5" aria-hidden>
        <div className="pp-ticker flex gap-10 whitespace-nowrap text-5xl font-extrabold tracking-tight md:text-7xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              <span>কথা বলি।</span>
              <span className="text-brand-orange">✦</span>
              <span className="text-brand-orange">চলুন আলোড়ন তুলি।</span>
              <span className="text-brand-orange">✦</span>
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-white/10">
        <div className="max-w-container mx-auto flex flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-md text-lg text-white/75">ঢাকা · সিউল · ইউএসএ। আপনার পরবর্তী ক্যাম্পেইনের জন্য একটি দায়বদ্ধ দল।</p>
          <Link href="/bn/book" className="btn btn-orange text-[14px] uppercase tracking-wide">
            কল বুক করুন <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="max-w-container mx-auto grid grid-cols-2 gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="col-span-2">
          <Link href="/bn" className="flex items-baseline gap-1" aria-label="পাবলিক পালস এজেন্সি হোম">
            <span className="text-[22px] font-extrabold tracking-tight">Public</span>
            <span className="text-[22px] font-extrabold tracking-tight text-brand-orange">Pulse</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            বাংলাদেশের ৩৬০° ডিজিটাল মার্কেটিং ও পলিটিক্যাল পিআর এজেন্সি — ঢাকার এক ছাদের নিচে।
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-wider">
            <a href={`tel:${SITE.contact.phone}`} className="rounded-full border border-white/20 px-5 py-3 text-white/85 hover:border-white/50">{SITE.contact.phoneDisplay}</a>
            <a href={`mailto:${SITE.contact.email}`} className="rounded-full border border-white/20 px-5 py-3 text-white/85 hover:border-white/50">{SITE.contact.email}</a>
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">সেবা</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {BN_SERVICES.slice(0, 5).map((s) => (
              <li key={s.slug}><Link href={`/bn/services/${s.slug}`} className="text-white/80 hover:text-white">{s.shortName}</Link></li>
            ))}
            <li><Link href="/bn/services" className="text-white/80 hover:text-white">সব সেবা →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">স্টুডিও</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/bn/about" className="text-white/80 hover:text-white">আমাদের সম্পর্কে</Link></li>
            <li><Link href="/bn/election" className="text-white/80 hover:text-white">নির্বাচনী প্রস্তুতি</Link></li>
            <li><Link href="/bn/contact" className="text-white/80 hover:text-white">যোগাযোগ</Link></li>
            <li><Link href="/bn/book" className="text-white/80 hover:text-white">কল বুক করুন</Link></li>
            <li><Link href="/" className="text-white/80 hover:text-white">English</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-container mx-auto flex flex-col gap-2 px-5 py-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            © {new Date().getFullYear()} {SITE.name}. ঢাকা, বাংলাদেশ। · ডিজাইন:{" "}
            <a href="https://mahir.design" target="_blank" rel="noopener" className="text-brand-orange hover:underline">mahir.design</a>
          </div>
          <div>
            <Link href="/privacy" className="hover:text-white">Privacy</Link> ·{" "}
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
