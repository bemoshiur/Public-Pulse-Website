// Programmatic-matrix PRUNE POLICY.
//
// The service×city (81) + service×industry (90) matrix was 171 thin, single
// -template pages differing only by a swapped entity name — Google's textbook
// "doorway page" / "scaled content abuse" profile, and it included nonsense
// combos (political-pr-for-e-commerce, hospitality-for-hospitality). On a
// young domain that can suppress the WHOLE site's rankings.
//
// Fix (user-chosen "prune + fix"): only the coherent, real-intent combos below
// are indexable — listed in the sitemap and prerendered via generateStaticParams.
// Every OTHER combo permanent-redirects (308) to its parent page. Tune the
// three constants to widen/narrow the indexable set; the counts follow
// automatically into the sitemap + prerender + redirects.

import { SERVICES, type Service } from "@/lib/services";
import { LOCATIONS, type Location } from "./locations";
import { INDUSTRIES, type Industry } from "./industries";

// Cities that get a per-service page for EVERY service (primary markets with
// real local search demand).
export const MATRIX_PRIMARY_CITIES = ["dhaka", "chattogram"] as const;

// Extra service→cities where a service is uniquely relevant to that place
// (e.g. hospitality in Cox's Bazar / Sylhet).
const MATRIX_CITY_EXTRAS: Record<string, string[]> = {
  hospitality: ["coxs-bazar", "sylhet"],
  "political-pr": ["sylhet"],
  "social-media": ["sylhet"],
  "seo-website": ["sylhet"],
};

// How many of each industry's aligned services (listed most-relevant-first in
// industries.ts) get an indexable page. Lower = fewer, tighter pages.
const MATRIX_INDUSTRY_TOP_N = 3;

const READY = new Set(SERVICES.filter((s) => s.ready).map((s) => s.slug));
const CITY_SLUGS = new Set(LOCATIONS.map((l) => l.slug));

export function isAllowedServiceCity(serviceSlug: string, citySlug: string): boolean {
  if (!READY.has(serviceSlug) || !CITY_SLUGS.has(citySlug)) return false;
  if ((MATRIX_PRIMARY_CITIES as readonly string[]).includes(citySlug)) return true;
  return (MATRIX_CITY_EXTRAS[serviceSlug] ?? []).includes(citySlug);
}

export function isAllowedServiceIndustry(serviceSlug: string, industrySlug: string): boolean {
  if (!READY.has(serviceSlug)) return false;
  // Guard self-referential naming ("Hospitality for Hospitality").
  if (serviceSlug === industrySlug) return false;
  const ind = INDUSTRIES.find((i) => i.slug === industrySlug);
  if (!ind) return false;
  // Only coherent pairings: the service must be among the industry's top-N
  // aligned services. This is what kills political-pr-for-e-commerce etc.
  return ind.alignedServices.slice(0, MATRIX_INDUSTRY_TOP_N).includes(serviceSlug);
}

/** Allowed service×city params for generateStaticParams + sitemap. */
export function allowedServiceCityParams(): { slug: string; city: string }[] {
  return SERVICES.filter((s) => s.ready).flatMap((s) =>
    LOCATIONS.filter((l) => isAllowedServiceCity(s.slug, l.slug)).map((l) => ({
      slug: s.slug,
      city: l.slug,
    }))
  );
}

/** Allowed service×industry combined slugs ("<service>-for-<industry>"). */
export function allowedServiceIndustrySlugs(): string[] {
  return SERVICES.filter((s) => s.ready).flatMap((s) =>
    INDUSTRIES.filter((i) => isAllowedServiceIndustry(s.slug, i.slug)).map(
      (i) => `${s.slug}-for-${i.slug}`
    )
  );
}

// ---------------------------------------------------------------------------
// AnswerBlock copy for every programmatic page.
//
// The AEO contract (docs/SEO-AEO-GEO.md) is a 40-60 word ANSWER. These pages
// compose their answer from entity data whose length varies (service names,
// city blurbs, industry priorities), so a single fixed template drifts out of
// range. Instead each builder produces several candidate phrasings — varying how
// many data points it cites and whether a closing fact sentence is appended —
// and `fitAnswer` picks the one closest to the middle of the 46-56 word target
// band. The set always contains both a short and a long form, so the result
// stays inside 40-60 for any catalog entry. Only facts already on the site are
// used (Dhaka HQ, BDT billing from a registered entity, Bangla + English work).
// ---------------------------------------------------------------------------

const ANSWER_MIN = 46;
const ANSWER_MAX = 56;
const ANSWER_TARGET = 51;

/** Word count exactly as the audit measures it: whitespace-separated tokens. */
export function answerWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Pick the candidate nearest ANSWER_TARGET, preferring any inside [MIN, MAX]. */
export function fitAnswer(candidates: string[]): string {
  const scored = candidates.map((text) => {
    const n = answerWordCount(text);
    const inBand = n >= ANSWER_MIN && n <= ANSWER_MAX;
    return { text, dist: Math.abs(n - ANSWER_TARGET), inBand };
  });
  const pool = scored.some((c) => c.inBand) ? scored.filter((c) => c.inBand) : scored;
  return pool.reduce((best, c) => (c.dist < best.dist ? c : best)).text;
}

/** "real-estate" -> "real estate" (keeps prose readable; slugs stay in URLs). */
function plain(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\be commerce\b/, "e-commerce");
}

/** "a, b and c" list; single item returns itself. */
function andList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const BILLING = "Work is billed in BDT by a registered Bangladesh entity.";

export function serviceCityAnswer(s: Pick<Service, "shortName">, l: Pick<Location, "name" | "topIndustries">): string {
  const out: string[] = [];
  for (const n of [3, 2, 1]) {
    const inds = andList(l.topIndustries.slice(0, n).map(plain));
    const core = `Public Pulse Agency delivers ${s.shortName} for ${l.name} brands from its Dhaka HQ. ${l.name} over-indexes on ${inds}, so the playbook, creative and KPIs are tuned to that market rather than copied from generic ${s.shortName} delivered elsewhere in Bangladesh.`;
    out.push(core, `${core} ${BILLING}`, `${core} Creative runs in Bangla and English. ${BILLING}`);
  }
  return fitAnswer(out);
}

export function serviceIndustryAnswer(
  s: Pick<Service, "shortName">,
  ind: Pick<Industry, "name" | "description" | "priorities">,
): string {
  const out: string[] = [];
  // The industry's free-text description is deliberately NOT pasted in: several
  // read as sentence fragments ("Bangladesh's $40B+ RMG sector — B2B ...").
  for (const n of [3, 2, 1]) {
    const pri = andList(ind.priorities.slice(0, n));
    const core = `Public Pulse Agency delivers ${s.shortName} for Bangladesh ${ind.name} brands. Each engagement is tuned to ${ind.name} priorities such as ${pri}, not generic ${s.shortName} sold to whoever signs.`;
    out.push(
      core,
      `${core} Work is scoped in writing with a single KPI, named owners and BDT billing from a registered Bangladesh entity.`,
    );
  }
  return fitAnswer(out);
}

export function industryAnswer(
  ind: Pick<Industry, "name" | "priorities">,
  services: Pick<Service, "shortName">[],
): string {
  const out: string[] = [];
  for (const sn of [4, 3, 2]) {
    const svc = andList(services.slice(0, sn).map((s) => s.shortName));
    for (const pn of [3, 2, 1]) {
      const pri = andList(ind.priorities.slice(0, pn));
      const core = `Public Pulse Agency runs ${svc} for ${ind.name} brands in Bangladesh. The work prioritises ${pri}, the moves that matter most in this vertical, rather than a generic agency playbook.`;
      out.push(
        core,
        `${core} ${BILLING}`,
        `${core} Every engagement starts with a discovery call and a written scope with named owners and a single KPI.`,
      );
    }
  }
  return fitAnswer(out);
}

export function locationAnswer(loc: Pick<Location, "name" | "division" | "topIndustries">): string {
  const out: string[] = [];
  for (const n of [3, 2, 1]) {
    const inds = andList(loc.topIndustries.slice(0, n).map(plain));
    const core = `Public Pulse Agency runs digital marketing, paid ads, SEO, PR and content for businesses in ${loc.name}, ${loc.division} Division, Bangladesh. The work centres on ${inds}, the dominant ${n === 1 ? "vertical" : "verticals"} in the ${loc.name} market, and is delivered from the Dhaka HQ.`;
    out.push(core, `${core} ${BILLING}`, `${core} Creative runs in Bangla and English. ${BILLING}`);
  }
  return fitAnswer(out);
}
