import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { LOCATIONS } from "@/lib/taxonomies/locations";
import { INDUSTRIES } from "@/lib/taxonomies/industries";
import { GLOSSARY } from "@/lib/taxonomies/glossary";
import { GUIDES } from "@/lib/content/guides";
import { COMPARES } from "@/lib/content/compares";
import { allowedServiceCityParams, allowedServiceIndustrySlugs } from "@/lib/taxonomies/matrix";
import { PUBLISHED_BENCHMARKS } from "@/lib/content/benchmarks";
import { getPublishedPosts } from "@/lib/data/blog";
import { getPublishedCaseStudies } from "@/lib/data/case-studies";

// Single flat sitemap.xml — Next.js doesn't have first-class sitemap-index
// support without a route handler. We list every URL here with `alternates`
// so Google sees the bn/en relationship even though only en pages exist
// today; bn entries are commented in once hand-authored content lands.
//
// Programmatic surfaces grouped by category — each entry is also referenced
// in docs/JOURNEY.md so the SEO surface is auditable.

const today = new Date().toISOString().slice(0, 10);

// Stable lastmod for static + programmatic pages. Using new Date() here stamped
// EVERY page with today's date on every rebuild — Google detects that lastmod
// inflation and stops trusting the field. Bump this constant only when the
// static/catalog content actually changes. DB-backed pages (blog/cases) use
// their real publishedAt below.
const CATALOG_LASTMOD = "2026-07-15";

function entry(
  path: string,
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
  priority = 0.7
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: CATALOG_LASTMOD,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: absoluteUrl(path),
        "x-default": absoluteUrl(path),
        // bn: absoluteUrl(`/bn${path === "/" ? "" : path}`),  // unlock when bn content lands
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Core marketing pages ───────────────────────────────────────────
  const core: MetadataRoute.Sitemap = [
    entry("/", "weekly", 1),
    entry("/about", "monthly", 0.8),
    entry("/services", "monthly", 0.9),
    entry("/blog", "weekly", 0.8),
    entry("/contact", "yearly", 0.7),
    entry("/glossary", "weekly", 0.7),
    entry("/guides", "weekly", 0.7),
    entry("/case-studies", "weekly", 0.8),
    entry("/locations", "monthly", 0.7),
    entry("/industries", "monthly", 0.7),
    entry("/election", "monthly", 0.85),
    entry("/pricing", "monthly", 0.85),
    entry("/tools", "monthly", 0.7),
    entry("/tools/seo-audit", "monthly", 0.7),
    entry("/press", "monthly", 0.5),
    entry("/search", "yearly", 0.3),
    entry("/privacy", "yearly", 0.3),
    entry("/terms", "yearly", 0.3),
    entry("/data-deletion", "yearly", 0.3),
  ];

  // ── Services × 9 ───────────────────────────────────────────────────
  const services = SERVICES.filter((s) => s.ready).map((s) =>
    entry(`/services/${s.slug}`, "monthly", 0.8)
  );

  // ── Locations × N ──────────────────────────────────────────────────
  const locations = LOCATIONS.map((l) => entry(`/locations/${l.slug}`, "monthly", 0.7));

  // ── Industries × N ─────────────────────────────────────────────────
  const industries = INDUSTRIES.map((i) => entry(`/industries/${i.slug}`, "monthly", 0.7));

  // ── Service × Location matrix (PRUNED to coherent combos) ──────────
  // Only the allow-listed combos are indexable; the rest 308-redirect. See
  // src/lib/taxonomies/matrix.ts.
  const serviceLocation = allowedServiceCityParams().map(({ slug, city }) =>
    entry(`/${slug}/${city}`, "monthly", 0.65)
  );

  // ── Service × Industry matrix (PRUNED to coherent pairings) ────────
  const serviceIndustry = allowedServiceIndustrySlugs().map((slug) =>
    entry(`/${slug}`, "monthly", 0.65)
  );

  // ── Glossary terms ─────────────────────────────────────────────────
  const glossary = GLOSSARY.map((t) => entry(`/glossary/${t.slug}`, "monthly", 0.5));

  // ── Guides (HowTo playbooks) ───────────────────────────────────────
  const guides = GUIDES.map((g) => entry(`/guides/${g.slug}`, "monthly", 0.7));

  // ── Compare pages ──────────────────────────────────────────────────
  const compares = COMPARES.map((c) => entry(`/compare/${c.slug}`, "monthly", 0.6));

  // ── Research / first-party benchmarks (only published, real ones) ──
  const research: MetadataRoute.Sitemap =
    PUBLISHED_BENCHMARKS.length > 0
      ? [
          entry("/research", "monthly", 0.8),
          ...PUBLISHED_BENCHMARKS.map((b) =>
            entry(`/research/${b.slug}`, "yearly", 0.85)
          ),
        ]
      : [];

  // ── Blog (DB-backed, English only — BN retired 2026-05-31) ─────────
  const publishedEn = await getPublishedPosts("en");
  const blog: MetadataRoute.Sitemap = publishedEn.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : today,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ── Case studies (DB-backed, English only) ─────────────────────────
  const caseEn = await getPublishedCaseStudies("en");
  const cases: MetadataRoute.Sitemap = caseEn.map((c) => ({
    url: absoluteUrl(`/case-studies/${c.slug}`),
    lastModified: c.publishedAt ? new Date(c.publishedAt).toISOString().slice(0, 10) : today,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...core,
    ...services,
    ...locations,
    ...industries,
    ...serviceLocation,
    ...serviceIndustry,
    ...glossary,
    ...guides,
    ...compares,
    ...research,
    ...blog,
    ...cases,
  ];
}

export const revalidate = 3600;
export const dynamic = "force-static";
void SITE.url;
