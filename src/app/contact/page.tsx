import { DcPage } from "@/components/pp/DcPage";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, contactPageSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";
import { bookingUrl } from "@/lib/booking";

export const metadata: Metadata = buildMetadata({
  title: "Contact Public Pulse Agency | Free Consultation, Dhaka",
  description:
    "Get a free 15-minute consultation. WhatsApp +880 1717-714676, email info@publicpulse.com.bd, or send us a brief through the form. We reply within 24 hours.",
  path: "/contact",
  bnPath: "/bn/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const FAQS = [
  {
    q: "How fast do you reply?",
    a: "Under 24 hours, Saturday through Thursday. WhatsApp is usually under 2 hours during business hours (09:00-21:00 BD).",
  },
  {
    q: "What information do I need to send?",
    a: "What you're trying to grow, what you've already tried, and the realistic budget if you have one. If you don't have a budget yet, that's fine — we'll ballpark on the call.",
  },
  {
    q: "Is the first call really free?",
    a: "Yes — 15 minutes, no pitch deck, no obligation. We'll either be a fit or we won't, and if we're not we'll usually be able to point you somewhere that is.",
  },
  {
    q: "Do you work with clients outside Bangladesh?",
    a: "Most of our work is BD-focused but we run engagements for BD diaspora brands and a few BD-adjacent businesses (Cox's Bazar tourism for UK-based investors, RMG buyer-facing comms, etc.). Reach out — we'll be honest about fit.",
  },
];

const PATHS = [
  {
    href: SITE.contact.whatsapp,
    external: true,
    icon: MessageCircle,
    iconTint: "text-emerald-600",
    tag: "Fastest",
    title: (
      <>
        WhatsApp <span className="text-ink/65">now</span>
      </>
    ),
    body: "Under 2h reply during business hours. Best for quick questions and to feel out whether we're a fit.",
    cta: SITE.contact.phoneDisplay,
    label: "Chat on WhatsApp now",
  },
  {
    href: "#brief",
    external: false,
    icon: Sparkles,
    iconTint: "text-brand-orange",
    tag: "Best fit",
    title: (
      <>
        Send a <span className="text-ink/65">brief</span>
      </>
    ),
    body: "Tell us what you're trying to grow, what you've tried, and we'll reply with a structured proposal.",
    cta: "Jump to the form",
    label: "Send a brief",
  },
  {
    href: `tel:${SITE.contact.phone}`,
    external: false,
    icon: Phone,
    iconTint: "text-blue-600",
    tag: "Call us",
    title: (
      <>
        Just <span className="text-ink/65">call</span>
      </>
    ),
    body: "Direct line to the sales team. Best for urgent or sensitive work (election cycles, crisis comms).",
    cta: SITE.contact.phoneDisplay,
    label: `Call ${SITE.contact.phoneDisplay}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[contactPageSchema(), breadcrumbSchema(crumbs), faqPageSchema(FAQS, "none")]} />
      <DcPage name="Contact" />
    </>
  );
}
