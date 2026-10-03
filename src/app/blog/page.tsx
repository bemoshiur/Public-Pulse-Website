import type { Metadata } from "next";
import { Suspense } from "react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { getCategories, getPublishedPosts } from "@/lib/data/blog";
import { SITE } from "@/lib/site";
import { BlogFilter } from "@/components/blog/BlogFilter";

// ISR — page is server-rendered once + cached at the CDN. Filters/search
// run on the client (BlogFilter reads useSearchParams), so different
// ?category=&q= variants share the same cached HTML.
// 1h ISR window per CACHING.md — admin mutations also call updateTag('blog')
// for instant cache refresh, so 1h is just the safety-net regeneration cadence.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Insights | Public Pulse Agency — Digital Marketing Guides",
  description:
    "Long-form practitioner guides on digital marketing, political PR, paid ads, SEO, hospitality marketing and brand building in Bangladesh.",
  path: "/blog",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Insights", path: "/blog" },
];

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts("en"),
    getCategories(),
  ]);

  // Serialize Date → ISO string so we can pass through the server/client boundary.
  const serializedPosts = posts.map((p) => ({
    slug: p.slug,
    locale: p.locale,
    title: p.title,
    excerpt: p.excerpt,
    categorySlug: p.categorySlug,
    tags: p.tags ?? [],
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    readingTime: p.readingTime,
  }));
  const serializedCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameEn: c.nameEn,
  }));

  const faqs = [
    {
      q: "What does the Public Pulse Insights blog cover?",
      a: "Long-form practitioner guides on digital marketing, political PR, paid ads, SEO, hospitality marketing and brand building in Bangladesh. Each guide is grounded in a service, city or vertical Public Pulse actually delivers for.",
    },
    {
      q: "How many guides are published?",
      a: `There ${posts.length === 1 ? "is" : "are"} currently ${posts.length} published article${posts.length === 1 ? "" : "s"} across ${categories.length} categories, and the library keeps growing.`,
    },
    {
      q: "Can I filter or search the guides?",
      a: "Yes. Use the category chips to narrow the list to one topic, or use the search box to find a guide by keyword.",
    },
    {
      q: "How do I discuss a topic with the team?",
      a: `Send a brief through the contact page, message the team on WhatsApp, or email ${SITE.contact.email}. Replies come within 24 hours, Saturday through Thursday.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(faqs),
          collectionPageSchema({
            path: "/blog",
            name: "Public Pulse Insights",
            description:
              "Practitioner guides for Bangladesh digital marketing and political PR.",
            items: posts.map((p) => ({ url: `/blog/${p.slug}`, name: p.title })),
          }),
          itemListSchema(
            "Public Pulse Insights",
            posts.map((p) => ({ url: `/blog/${p.slug}`, name: p.title }))
          ),
        ]}
      />

      <GradientHero
        crumbs={crumbs}
        chip="Insights"
        title={
          <>
            Notes from the <span className="text-brand-orange">studio</span>.
          </>
        }
        lead={`English + বাংলা · ${posts.length} guide${posts.length === 1 ? "" : "s"} and growing. Long-form practitioner notes for the Bangladesh market.`}
        answer={`Public Pulse Insights is the agency's blog of long-form practitioner guides on digital marketing and political PR in Bangladesh. It currently holds ${posts.length} published article${posts.length === 1 ? "" : "s"} across ${categories.length} categories, including paid media, SEO, hospitality marketing and brand building. Every guide is grounded in a service, city or industry the agency actually works in.`}
      />

      {/* Suspense boundary is required because BlogFilter uses
          useSearchParams — without it Next refuses to statically generate. */}
      <Suspense fallback={null}>
        <BlogFilter posts={serializedPosts} categories={serializedCategories} />
      </Suspense>

      <FaqSection faqs={faqs} />
    </>
  );
}
