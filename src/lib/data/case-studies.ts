// Tagged cached read layer for case_studies.
//
// PUBLIC pages MUST go through these accessors. Direct db.select() from a
// page or layout is a bug — see docs/CACHING.md.
//
// /manage CRUD writes invalidate with revalidateTag('case-studies').

import { unstable_cache } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { caseStudies, clients, type CaseStudy, type Client } from "@/db/schema";

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
        // ASC display order: an unedited row (default 0) sorts FIRST, not
        // last — matches getPublishedWorks's ordering (Task 13 fix).
        .orderBy(asc(caseStudies.displayOrder), desc(caseStudies.publishedAt));
      return rows.filter((r) => !isSeedSlug(r.slug));
    } catch (err) {
      console.warn(
        "[case-studies] DB unavailable — returning empty list.",
        err instanceof Error ? err.message : err
      );
      return [];
    }
  },
  ["case-studies:published-v4"],
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
        // ASC display order: an unedited row (default 0) sorts FIRST, not
        // last — matches getPublishedWorks's ordering (Task 13 fix).
        .orderBy(asc(caseStudies.displayOrder), desc(caseStudies.publishedAt))
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
  ["case-studies:featured-v4"],
  { tags: [CASE_STUDIES_TAG], revalidate: 60 }
);

export type CaseStudyWithClient = CaseStudy & { client: Client | null };

/** Same publication predicate as the list accessors (`published === true`)
 *  — a row can no longer be reachable by direct URL while invisible in the
 *  index/sitemap (Task 13 fix). Also joins `clients` so the detail page can
 *  render a real client logo instead of the dead `logoUrl` column. */
export const getCaseStudyBySlug = unstable_cache(
  async (slug: string, locale: "en" | "bn" = "en"): Promise<CaseStudyWithClient | null> => {
    if (isSeedSlug(slug)) return null; // seed detail pages must 404 publicly
    try {
      const rows = await db
        .select({ study: caseStudies, client: clients })
        .from(caseStudies)
        .leftJoin(clients, eq(caseStudies.clientId, clients.id))
        .where(and(eq(caseStudies.slug, slug), eq(caseStudies.locale, locale)))
        .limit(1);
      const row = rows[0];
      if (!row || !row.study.published) return null;
      return { ...row.study, client: row.client };
    } catch {
      return null;
    }
  },
  ["case-studies:by-slug-v4"],
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
  ["case-studies:related-v4"],
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
