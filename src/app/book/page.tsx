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
          faqPageSchema([
            {
              q: "How long is the strategy call?",
              a: "15 minutes. Long enough to map your goals to a workable plan; short enough that you can fit it in.",
            },
            {
              q: "What should I prepare?",
              a: "A rough goal (lead volume, brand reach, election timeline, whatever), current channels you run on, and any past performance numbers if you have them. We'll do the rest.",
            },
            {
              q: "Is it billed?",
              a: "The discovery call is free. We only quote scope + price after we understand the brief — written proposal within 24 hours.",
            },
          ]),
        ]}
      />
      <DcPage name="Book" />
    </>
  );
}
