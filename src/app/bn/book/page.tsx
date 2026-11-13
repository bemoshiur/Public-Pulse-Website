import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { bookingUrl, bookingEmbedUrl } from "@/lib/booking";

export const metadata: Metadata = buildMetadata({
  title: "স্ট্র্যাটেজি কল বুক করুন | পাবলিক পালস",
  description:
    "পাবলিক পালস এজেন্সির সাথে ১৫ মিনিটের স্ট্র্যাটেজি কল বুক করুন। আপনার লক্ষ্য, বর্তমান সেটআপ এবং বাংলাদেশে কী কাজ করতে পারে — আমরা আলোচনা করব।",
  path: "/bn/book",
  locale: "bn",
  enPath: "/book",
});

const crumbs = [
  { name: "হোম", path: "/bn" },
  { name: "কল বুক করুন", path: "/bn/book" },
];

export default function BnBookPage() {
  const url = bookingUrl();
  const embed = bookingEmbedUrl();
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <section className="bg-paper py-12 md:py-20">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-6 max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">কল বুক করুন</p>
            <h1 className="mt-4 text-h1 tracking-tight text-ink">আপনার সুবিধামতো সময় বেছে নিন।</h1>
            <p className="mt-5 text-lead text-ink/70">
              স্টুডিওর একজন সিনিয়রের সাথে ১৫ মিনিটের স্ট্র্যাটেজি কল। আপনার লক্ষ্য, বর্তমান সেটআপ এবং একটি কার্যকর পরিকল্পনা কেমন হতে পারে — ঢাকার সময় অনুযায়ী।
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-card border border-ink/20 bg-ink shadow-card">
            <iframe
              src={embed ?? url ?? ""}
              title="পাবলিক পালসের সাথে কল শিডিউল করুন"
              loading="lazy"
              className="h-[820px] w-full"
              style={{ border: 0 }}
            />
          </div>
          <p className="mt-6 text-meta text-ink/55">
            ক্যালেন্ডার দেখতে পাচ্ছেন না?{" "}
            <a href={url ?? "#"} target="_blank" rel="noopener noreferrer" className="text-brand-orange underline hover:no-underline">
              নতুন ট্যাবে বুকিং পেজ খুলুন
            </a>
            ।
          </p>
        </Container>
      </section>
    </>
  );
}
