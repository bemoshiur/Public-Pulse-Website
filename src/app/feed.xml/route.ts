import { SITE, absoluteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/data/blog";

// Rendered per request (not force-static): the posts live in Neon, and the build
// has no DB access, so a static render would bake in an EMPTY feed until the
// next deploy. The data layer is tag-cached (60s), and CloudFront caches the
// response for an hour via the header below.
export const dynamic = "force-dynamic";

const MAX_ITEMS = 50;

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = (await getPublishedPosts("en")).slice(0, MAX_ITEMS);

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      const published = p.publishedAt ? new Date(p.publishedAt) : null;
      return `
    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>${
        published && !Number.isNaN(published.getTime())
          ? `
      <pubDate>${published.toUTCString()}</pubDate>`
          : ""
      }
      <category>${escape(p.categorySlug)}</category>
      <description>${escape(p.excerpt ?? "")}</description>
    </item>`;
    })
    .join("");

  const newest = posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.name)} — Blog</title>
    <link>${SITE.url}/blog</link>
    <description>Digital marketing, political PR and brand-building insights from ${escape(SITE.name)}, Dhaka.</description>
    <language>en-bd</language>
    <lastBuildDate>${newest.toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
