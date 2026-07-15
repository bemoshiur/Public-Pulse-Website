// Tagged cached read layer for case_studies.
//
// PUBLIC pages MUST go through these accessors. Direct db.select() from a
// page or layout is a bug — see docs/CACHING.md.
//
// /manage CRUD writes invalidate with revalidateTag('case-studies').

import { unstable_cache } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { caseStudies, type CaseStudy } from "@/db/schema";

export const CASE_STUDIES_TAG = "case-studies";

// Developer seed rows (src/db/seed.ts) use a "seed-" slug prefix. They exist so
// the data layer has something to read before real cases are published — but
// they must NEVER reach a public surface (they render placeholder copy like
// "Untitled case study" / "Replace this seed entry"). This is a hard,
// belt-and-braces guard at the read layer so a stray published=true seed row
// can't leak to the homepage / sitemap / llms even if it's never deleted.
const isSeedSlug = (slug: string) => slug.startsWith("seed-");

/** All published case studies for a locale. The `eq(published,true)` filter
 *  is the durable signal — legacy rows pre-date the `status` column. */
export const getPublishedCaseStudies = unstable_cache(
  async (locale: "en" | "bn" = "en"): Promise<CaseStudy[]> => {
    try {
      const rows = await db
        .select()
        .from(caseStudies)
        .where(
          and(
            eq(caseStudies.published, true),
            eq(caseStudies.locale, locale)
          )
        )
        .orderBy(desc(caseStudies.displayOrder), desc(caseStudies.publishedAt));
      return rows.filter((r) => !isSeedSlug(r.slug));
    } catch (err) {
      console.warn(
        "[case-studies] DB unavailable — returning empty list.",
        err instanceof Error ? err.message : err
      );
      return [];
    }
  },
  ["case-studies:published-v3"],
  { tags: [CASE_STUDIES_TAG], revalidate: 60 }
);

/** Featured case studies for the homepage Selected results. Falls back to
 *  most-recent published if no featured set, so the homepage never stays
 *  empty once even one row is published. */
export const getFeaturedCaseStudies = unstable_cache(
  async (locale: "en" | "bn" = "en", limit = 4): Promise<CaseStudy[]> => {
    try {
      const rows = await db
        .select()
        .from(caseStudies)
        .where(
          and(
            eq(caseStudies.published, true),
            eq(caseStudies.locale, locale),
            eq(caseStudies.featured, true)
          )
        )
        .orderBy(desc(caseStudies.displayOrder), desc(caseStudies.publishedAt))
        .limit(limit + 4);
      const featured = rows.filter((r) => !isSeedSlug(r.slug)).slice(0, limit);
      if (featured.length === 0) {
        const recent = await db
          .select()
          .from(caseStudies)
          .where(
            and(
              eq(caseStudies.published, true),
              eq(caseStudies.locale, locale)
            )
          )
          .orderBy(desc(caseStudies.publishedAt))
          .limit(limit + 4);
        return recent.filter((r) => !isSeedSlug(r.slug)).slice(0, limit);
      }
      return featured;
    } catch {
      return [];
    }
  },
  ["case-studies:featured-v3"],
  { tags: [CASE_STUDIES_TAG], revalidate: 60 }
);

export const getCaseStudyBySlug = unstable_cache(
  async (slug: string, locale: "en" | "bn" = "en"): Promise<CaseStudy | null> => {
    if (isSeedSlug(slug)) return null; // seed detail pages must 404 publicly
    try {
      const [row] = await db
        .select()
        .from(caseStudies)
        .where(and(eq(caseStudies.slug, slug), eq(caseStudies.locale, locale)))
        .limit(1);
      if (!row) return null;
      if (row.published || row.status === "published") return row;
      return null;
    } catch {
      return null;
    }
  },
  ["case-studies:by-slug-v3"],
  { tags: [CASE_STUDIES_TAG], revalidate: 60 }
);

/** Related case studies by industry overlap. */
export const getRelatedCaseStudies = unstable_cache(
  async (
    excludeSlug: string,
    industry: string,
    locale: "en" | "bn" = "en",
    limit = 3
  ): Promise<CaseStudy[]> => {
    try {
      const rows = await db
        .select()
        .from(caseStudies)
        .where(
          and(
            eq(caseStudies.published, true),
            eq(caseStudies.locale, locale),
            eq(caseStudies.industry, industry)
          )
        )
        .orderBy(desc(caseStudies.publishedAt))
        .limit(limit + 2);
      return rows
        .filter((r) => r.slug !== excludeSlug && !isSeedSlug(r.slug))
        .slice(0, limit);
    } catch {
      return [];
    }
  },
  ["case-studies:related-v3"],
  { tags: [CASE_STUDIES_TAG], revalidate: 60 }
);

// Admin-only — NOT cached. /manage routes are uncached anyway.
export async function listAllCaseStudies(): Promise<CaseStudy[]> {
  return db.select().from(caseStudies).orderBy(desc(caseStudies.updatedAt));
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | undefined> {
  const rows = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
  return rows[0];
}
