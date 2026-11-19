import { DcPage } from "@/components/pp/DcPage";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { bookingUrl, bookingEmbedUrl } from "@/lib/booking";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book a strategy call | Public Pulse",
  description:
    "Schedule a 15-minute strategy call with Public Pulse Agency. We'll review your goals, current setup, and outline what could move the needle in Bangladesh.",
  path: "/book",
  bnPath: "/bn/book",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Book a call", path: "/book" },
];

export default function BookPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          
        ]}
      />
      <DcPage name="Book" />
    </>
  );
}
