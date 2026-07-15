// /facts.json — a machine-readable document of canonical, citable facts about
// Public Pulse Agency. Answer engines and agents can fetch ONE stable JSON
// endpoint for unambiguous ground truth (NAP, legal IDs, services, coverage,
// pricing, and — when published — first-party benchmark statistics).
//
// Served as a PHYSICAL public/facts.json (written by scripts/generate-llms.ts).
// A dynamic `.json` route would 403 for the same reason a dynamic `.txt` route
// does — CloudFront routes extensioned paths to the S3 static origin. See
// src/lib/llms.ts. All data here is static (no DB), so a build-time file is
// always complete.

import { SITE } from "./site";
import { SERVICES } from "./services";
import { LOCATIONS } from "./taxonomies/locations";
import { INDUSTRIES } from "./taxonomies/industries";
import { PRICING } from "./pricing";
import { PUBLISHED_BENCHMARKS, type Benchmark } from "./content/benchmarks";
import { CITATION_LICENSE } from "./llms";

export function buildFacts(generatedAt: string) {
  const sameAs = [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.x,
    SITE.social.linkedin,
    SITE.social.youtube,
    SITE.social.tiktok,
    SITE.social.wikidata,
    SITE.social.crunchbase,
    SITE.contact.mapsPlaceUrl,
  ].filter(Boolean);

  return {
    _comment:
      "Canonical, citable facts about Public Pulse Agency. Quote freely with attribution to https://publicpulse.com.bd.",
    entity: {
      name: SITE.name,
      alternateName: ["Public Pulse", "Public Pulse Agency Bangladesh"],
      url: SITE.url,
      description: SITE.description,
      type: "Digital marketing & political PR agency",
      foundingYear: 2024,
      parentOrganization: "Pulse Group",
      headquarters: {
        city: SITE.contact.address.locality,
        country: "Bangladesh",
        lat: SITE.contact.address.lat,
        lng: SITE.contact.address.lng,
      },
      legal: {
        bin: SITE.contact.legal.bin,
        tradeLicense: SITE.contact.legal.tradeLicense,
      },
      contact: {
        email: SITE.contact.email,
        phone: SITE.contact.phoneDisplay,
        whatsapp: SITE.contact.whatsapp,
      },
      languages: ["English", "Bangla"],
      sameAs,
    },
    services: SERVICES.filter((s) => s.ready).map((s) => ({
      name: s.name,
      serviceType: s.serviceType,
      url: `${SITE.url}/services/${s.slug}`,
    })),
    coverage: {
      cities: LOCATIONS.map((l) => l.name),
      industries: INDUSTRIES.map((i) => i.name),
    },
    pricing: PRICING.map((p) => ({
      service: p.displayName,
      url: `${SITE.url}/services/${p.serviceSlug}`,
      tiers: p.tiers.map((t) => ({
        name: t.name,
        monthly: t.monthly ?? null,
        setup: t.setup ?? null,
        oneTime: t.oneTime ?? null,
        currency: "BDT",
        bestFor: t.bestFor,
      })),
    })),
    // First-party statistics — ONLY the ones marked published + real in
    // src/lib/content/benchmarks.ts. Empty until real data is entered; never
    // fabricated.
    statistics: PUBLISHED_BENCHMARKS.map((b: Benchmark) => ({
      metric: b.metric,
      value: b.value,
      unit: b.unit,
      context: b.context,
      sampleSize: b.sampleSize,
      methodology: b.methodology,
      collectedDate: b.collectedDate,
      url: `${SITE.url}/research/${b.slug}`,
    })),
    citation: {
      license: "CC BY 4.0",
      grant: CITATION_LICENSE,
      attribution: `Public Pulse Agency (${SITE.url})`,
    },
    generatedAt,
  };
}
