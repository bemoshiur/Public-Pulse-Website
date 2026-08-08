// Craft/discipline taxonomy for /work. Mirrors the shape of
// taxonomies/locations.ts + industries.ts so filters and validation
// behave identically across the site.

export type Discipline = {
  slug: string;
  /** Display name for chips + meta strip. */
  name: string;
  /** One-line description used in filter tooltips + llms.txt. */
  blurb: string;
};

export const DISCIPLINES: Discipline[] = [
  { slug: "branding", name: "Branding", blurb: "Identity, logo systems, brand guidelines and positioning." },
  { slug: "campaign", name: "Campaign", blurb: "Integrated multi-channel campaigns with a single narrative." },
  { slug: "social", name: "Social", blurb: "Always-on social content, community and channel management." },
  { slug: "paid", name: "Paid media", blurb: "Meta, Google and YouTube buying with ROAS accountability." },
  { slug: "film", name: "Film & motion", blurb: "Video, reels, motion graphics and on-location production." },
  { slug: "web", name: "Web", blurb: "Websites, landing pages and conversion-focused builds." },
];

export const getDiscipline = (slug: string): Discipline | undefined =>
  DISCIPLINES.find((d) => d.slug === slug);

export const isDisciplineSlug = (slug: string): boolean =>
  DISCIPLINES.some((d) => d.slug === slug);
