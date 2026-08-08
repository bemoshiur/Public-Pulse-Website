// Tagged cached read layer for works (/work portfolio).
//
// PUBLIC pages MUST go through these accessors. Direct db.select() from a
// page or layout is a bug — see docs/CACHING.md.
//
// /manage CRUD writes invalidate with updateTag('works').

import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { works, clients, type Work, type Client } from "@/db/schema";

export const WORKS_TAG = "works";

/** Seed rows must never reach a public surface (same guard as case studies). */
const isSeedSlug = (slug: string) => slug.startsWith("seed-");

export type WorkWithClient = Work & { client: Client | null };

/** status is the single source of truth for publication (the case_studies
 *  published/status split is a known ambiguity — fixed in Task 13). */
const publishedWhere = (locale: "en" | "bn") =>
  and(eq(works.status, "published"), eq(works.locale, locale));

async function selectWithClient(where: ReturnType<typeof publishedWhere>) {
  const rows = await db
    .select({ work: works, client: clients })
    .from(works)
    .leftJoin(clients, eq(works.clientId, clients.id))
    .where(where)
    // ASC display order: an unedited row (default 0) sorts FIRST, not last.
    .orderBy(asc(works.displayOrder), desc(works.publishedAt));
  return rows.map((r) => ({ ...r.work, client: r.client })).filter((w) => !isSeedSlug(w.slug));
}

export const getPublishedWorks = unstable_cache(
  async (locale: "en" | "bn" = "en"): Promise<WorkWithClient[]> => {
    try {
      return await selectWithClient(publishedWhere(locale));
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:published-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getFeaturedWorks = unstable_cache(
  async (locale: "en" | "bn" = "en", limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere(locale));
      const featured = all.filter((w) => w.featured);
      return (featured.length > 0 ? featured : all).slice(0, limit);
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:featured-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorkBySlug = unstable_cache(
  async (slug: string, locale: "en" | "bn" = "en"): Promise<WorkWithClient | null> => {
    if (isSeedSlug(slug)) return null;
    try {
      const rows = await db
        .select({ work: works, client: clients })
        .from(works)
        .leftJoin(clients, eq(works.clientId, clients.id))
        .where(and(eq(works.slug, slug), eq(works.locale, locale)))
        .limit(1);
      const row = rows[0];
      if (!row || row.work.status !== "published") return null;
      return { ...row.work, client: row.client };
    } catch (err) {
      console.warn("[works] DB unavailable — returning null.", err instanceof Error ? err.message : err);
      return null;
    }
  },
  ["works:by-slug-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

/** Editorial "related": same client first, then shared discipline/industry. */
export const getRelatedWorks = unstable_cache(
  async (
    excludeSlug: string,
    opts: { clientId?: string | null; industrySlug?: string | null; disciplines?: string[] },
    limit = 3
  ): Promise<WorkWithClient[]> => {
    try {
      const all = (await selectWithClient(publishedWhere("en"))).filter((w) => w.slug !== excludeSlug);
      const score = (w: WorkWithClient) => {
        let s = 0;
        if (opts.clientId && w.clientId === opts.clientId) s += 3;
        if (opts.industrySlug && w.industrySlug === opts.industrySlug) s += 2;
        if (opts.disciplines?.some((d) => w.disciplines.includes(d))) s += 1;
        return s;
      };
      return all
        .map((w) => ({ w, s: score(w) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map((x) => x.w);
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:related-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

/** Inbound proof rails — closes the "nothing links in" gap. */
export const getWorksByService = unstable_cache(
  async (serviceSlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.serviceSlugs.includes(serviceSlug)).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-service-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorksByIndustry = unstable_cache(
  async (industrySlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.industrySlug === industrySlug).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-industry-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorksByLocation = unstable_cache(
  async (locationSlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.locationSlug === locationSlug).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-location-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

// ─── Admin-only (uncached) ───────────────────────────────────────────
export async function listAllWorks(): Promise<Work[]> {
  return db.select().from(works).orderBy(asc(works.displayOrder), desc(works.updatedAt));
}

export async function getWorkById(id: string): Promise<Work | null> {
  const rows = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Slug collision check for the admin form (avoids a raw Postgres error). */
export async function slugExists(slug: string, locale: "en" | "bn", excludeId?: string): Promise<boolean> {
  const rows = await db
    .select({ id: works.id })
    .from(works)
    .where(
      excludeId
        ? and(eq(works.slug, slug), eq(works.locale, locale), ne(works.id, excludeId))
        : and(eq(works.slug, slug), eq(works.locale, locale))
    )
    .limit(1);
  return rows.length > 0;
}
