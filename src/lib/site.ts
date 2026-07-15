export const SITE = {
  name: "Public Pulse Agency",
  shortName: "Public Pulse",
  url: "https://publicpulse.com.bd",
  description:
    "Bangladesh's 360° digital marketing and political PR agency. Political PR, social media, content production, paid ads, hospitality marketing, branding, SEO and analytics — under one roof in Dhaka.",
  locale: "en_BD",
  language: "en",
  twitter: "@publicpulse_bd",
  themeColor: "#D32F2F",
  contact: {
    phone: "+8801717714676",
    phoneDisplay: "+880 1717-714676",
    email: "info@publicpulse.com.bd",
    whatsapp: "https://wa.me/message/TBIM4KYTCFPEI1",
    // Google Maps — short share link (resolves to the same Place) +
    // canonical place URL (used by schema.org `hasMap`). Place ID is
    // ChIJY7S7LNYHXEUR5OOT3k5XIJI · CID 10529027197574464404.
    mapsShareUrl: "https://share.google/g11S4Cxv9APnuvs92",
    mapsPlaceUrl:
      "https://www.google.com/maps/place/Public+Pulse+Agency/data=!4m2!3m1!1s0x455c07d62cbbb463:0x9220574ede93e394",
    address: {
      locality: "Dhaka",
      region: "BD-13",
      country: "BD",
      lat: 23.8103,
      lng: 90.4125,
    },
    legal: {
      bin: "009043032-0102",
      tradeLicense: "TRAD/DNCC/037136/2025",
    },
  },
  // sameAs / entity-graph anchors. Every non-empty URL here is emitted into
  // Organization.sameAs (src/lib/schema.ts) — the set of independent profiles
  // answer engines + Google's Knowledge Graph triangulate to confirm this is a
  // real, notable entity. MORE authoritative profiles = stronger entity
  // resolution = higher citation confidence.
  //
  // TODO(user): paste the REAL profile URLs below. Blank strings are filtered
  // out automatically (a sameAs pointing at a nonexistent profile HURTS entity
  // trust), so leaving one empty is safe — never invent a URL.
  //   • linkedin  — the LinkedIn *company* page (strongest B2B authority anchor)
  //   • youtube   — channel URL
  //   • tiktok    — profile URL
  //   • wikidata  — a Wikidata item URL once created (highest-leverage node)
  //   • crunchbase — company profile URL
  social: {
    facebook: "https://web.facebook.com/publicpulse.agency",
    instagram: "https://www.instagram.com/publicpulse_agency/",
    // X handle is also declared as `twitter` above for the Twitter card meta.
    // TODO(user): confirm @publicpulse_bd is a live account; blank this if not.
    x: "https://x.com/publicpulse_bd",
    linkedin: "",
    youtube: "",
    tiktok: "",
    wikidata: "",
    crunchbase: "",
  },
  tracking: {
    gtm: "GTM-TNK2J29K",
    ga4: "G-WVF3TSEL3Q",
    metaPixel: "938966755334049",
  },
  organizationId: "https://publicpulse.com.bd/#organization",
} as const;

export const absoluteUrl = (path: string) =>
  `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
