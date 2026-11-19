import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GradientHero } from "@/components/seo/GradientHero";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceMatcher } from "@/components/services/ServiceMatcher";
import { SERVICES } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Services in Bangladesh | Public Pulse",
  description:
    "Political PR, social media, content, paid ads, hospitality, branding, SEO, analytics and influencer marketing — nine integrated services under one Dhaka roof.",
  path: "/services",
  bnPath: "/bn/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const FAQS = [
  {
    q: "How many services does Public Pulse offer?",
    a: `Public Pulse offers ${SERVICES.length} integrated services: ${SERVICES.map((s) => s.name).join(", ")}. They can be taken one at a time or combined into a full 360° engagement.`,
  },
  {
    q: "How do I choose the right service?",
    a: "Use the three-question service matcher on this page. It asks about your goal, channels and industry, then ranks the top three matching services. You can also ask the team directly on WhatsApp.",
  },
  {
    q: "Who leads an engagement?",
    a: "Each engagement is led by a senior member of the team, with a single KPI agreed before kickoff.",
  },
  {
    q: "Are service prices published, and in which currency?",
    a: `Starting prices for every service are listed on the pricing page and billed in BDT. For a quote, email ${SITE.contact.email} or call ${SITE.contact.phoneDisplay}.`,
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), ]} />
      <DcPage name="Services" />
    </>
  );
}
