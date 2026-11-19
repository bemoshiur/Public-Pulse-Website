import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Download, Mail, FileText, Newspaper } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  webPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Press & media | Public Pulse",
  description:
    "Press, media, and brand resources for Public Pulse Agency — boilerplate, logo files, founder bio, and direct contact for journalists.",
  path: "/press",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Press", path: "/press" },
];

const FAQS = [
  {
    q: "Can I download your logo?",
    a: "Yes. The brand mark is on this page in PNG (light + dark backgrounds). For SVG or print-ready EPS, email press@publicpulse.com.bd and we'll send a brand-kit zip within a working day.",
  },
  {
    q: "Who do I contact for press enquiries?",
    a: `Email ${SITE.contact.email} with "Press" in the subject line. For time-sensitive enquiries (same-day deadline), WhatsApp ${SITE.contact.phoneDisplay}. We reply Saturday–Thursday within business hours.`,
  },
  {
    q: "Do you have a spokesperson available for comment?",
    a: "Yes — for stories on Bangladesh digital marketing, political PR, election communications, AEO/GEO, or the Pulse Group (Event Pulse, Tender Pulse, Social Pulse, The Pulse Today). Reach out at the address above with topic + outlet + deadline.",
  },
  {
    q: "Where are you registered?",
    a: "Dhaka, Bangladesh. BIN 009043032-0102, Trade License TRAD/DNCC/037136/2025. We're a sister concern within Pulse Group.",
  },
];

export default function PressPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            path: "/press",
            name: "Press & media — Public Pulse Agency",
            description:
              "Press, media, and brand resources for Public Pulse Agency.",
            keywords: [
              "Public Pulse press",
              "Bangladesh agency media kit",
              "Public Pulse brand assets",
            ],
          }),
          faqPageSchema(FAQS, "none"),
        ]}
      />
      <DcPage name="Press" />
    </>
  );
}
