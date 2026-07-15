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

import { SERVICES } from "@/lib/services";
import { LOCATIONS } from "./locations";
import { INDUSTRIES } from "./industries";

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
