import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { LOCATIONS } from "@/lib/taxonomies/locations";
import { BangladeshMap } from "@/components/locations/BangladeshMap";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Locations | Public Pulse Agency in Bangladesh",
  description:
    "Public Pulse Agency delivers digital marketing and political PR across Bangladesh — Dhaka, Chattogram, Sylhet, Cox's Bazar, Khulna, Rajshahi, Gazipur, Narayanganj, Comilla.",
  path: "/locations",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations" },
];

const FAQS = [
  {
    q: "Which cities does Public Pulse cover?",
    a: `Public Pulse is headquartered in Dhaka and has a dedicated page for each of ${LOCATIONS.length} cities: ${LOCATIONS.map((l) => l.name).join(", ")}.`,
  },
  {
    q: "Are the city pages generic templates?",
    a: "No. Each city page is grounded in that city's local industry mix and consumer behaviour rather than copied from a template.",
  },
  {
    q: "Where is the Public Pulse office?",
    a: `Public Pulse Agency is based in Dhaka, Bangladesh. You can reach the team on ${SITE.contact.phoneDisplay} or at ${SITE.contact.email}.`,
  },
  {
    q: "Which languages does Public Pulse work in?",
    a: "English and Bangla.",
  },
];

export default function LocationsIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(FAQS),
          itemListSchema(
            "Public Pulse Locations",
            LOCATIONS.map((l) => ({ url: `/locations/${l.slug}`, name: l.name }))
          ),
        ]}
      />
      <DcPage name="Locations" />
    </>
  );
}
