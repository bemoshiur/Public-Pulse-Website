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
    "Get a free 30-minute consultation. WhatsApp +880 1717-714676, email info@publicpulse.com.bd, or send us a brief through the form. We reply within 24 hours.",
  path: "/contact",
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
    a: "Yes — 30 minutes, no pitch deck, no obligation. We'll either be a fit or we won't, and if we're not we'll usually be able to point you somewhere that is.",
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
      <JsonLd data={[contactPageSchema(), breadcrumbSchema(crumbs), faqPageSchema(FAQS)]} />

      {/* ═══ HERO — inset panel + live availability card ════════════════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 px-6 py-12 md:px-12 md:py-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="chip chip-orange">Contact</span>
                <h1 className="mt-5 text-h1 tracking-tight text-ink">
                  Talk to a <span className="text-brand-orange">human</span> in under an hour.
                </h1>
                <p className="mt-5 max-w-2xl text-lead text-ink/70">
                  No pitch deck, no qualifying questions, no SDR. Pick the channel that suits you and
                  the sales team picks up.
                </p>
              </div>
              {/* Live status card — the one dark accent in the panel */}
              <div className="lg:col-span-5">
                <div className="rounded-panel bg-cp-night p-6 text-white">
                  <div className="flex items-center gap-2 text-meta uppercase tracking-wider text-white/65">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30"
                    />
                    Sales team online
                  </div>
                  <p className="mt-3 text-h3 font-bold leading-tight">Available 09:00 – 21:00 BD</p>
                  <p className="mt-1 text-sm text-white/65">
                    Average WhatsApp reply: <strong className="text-white">under 2 hours</strong>
                    &nbsp;during business hours.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
                    <Stat n="<2h" k="WhatsApp" />
                    <Stat n="<24h" k="Email" />
                    <Stat n="6 days" k="Sat–Thu" />
                  </div>
                </div>
              </div>
            </div>
          </GreyPanel>

          <div className="mt-6 max-w-3xl">
            <AnswerBlock>
              Public Pulse Agency replies to every email and WhatsApp message within 24 hours,
              Saturday through Thursday. Office hours run 09:00–21:00 Asia/Dhaka, and WhatsApp is
              the fastest channel. The first 30-minute consultation is free, with no pitch deck and
              no qualifying questions, and you can also call or send a brief through the form.
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {/* ═══ PICK YOUR PATH — light inset cards ═════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow uppercase text-brand-orange">Pick your path</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Three ways in. All of them work.</h2>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {PATHS.map((p) => {
              const Icon = p.icon;
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper ring-1 ring-ink/10 ${p.iconTint}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="chip">{p.tag}</span>
                  </div>
                  <h3 className="mt-6 text-h3 font-bold leading-tight text-ink">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{p.body}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                    {p.cta}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </div>
                </>
              );
              const cls =
                "group flex h-full flex-col rounded-panel bg-paper-alt p-6 transition duration-300 hover:-translate-y-1 hover:bg-paper-tint";
              return (
                <li key={p.tag}>
                  {p.external ? (
                    <a href={p.href} rel="noopener noreferrer" target="_blank" aria-label={p.label} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={p.href} aria-label={p.label} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Email + Maps — secondary rows */}
          <div className="mt-4 space-y-3">
            <a
              href={`mailto:${SITE.contact.email}`}
              className="group flex flex-col items-start justify-between gap-3 rounded-panel bg-paper-alt p-5 transition hover:bg-paper-tint sm:flex-row sm:items-center"
              aria-label={`Email ${SITE.contact.email}`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-ink/10">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-meta uppercase tracking-wider text-ink/65">Email</p>
                  <p className="break-all text-base font-bold text-ink">{SITE.contact.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                Compose
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </a>
            <a
              href={SITE.contact.mapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start justify-between gap-3 rounded-panel bg-paper-alt p-5 transition hover:bg-paper-tint sm:flex-row sm:items-center"
              aria-label="Get directions to Public Pulse Agency on Google Maps"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-ink/10">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-meta uppercase tracking-wider text-ink/65">Location</p>
                  <p className="text-base font-bold text-ink">Dhaka, Bangladesh</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                Get directions
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </a>
          </div>
        </Container>
      </Section>

      {/* ═══ BRIEF FORM ═════════════════════════════════════════════════ */}
      <Section id="brief" size="lg" className="bg-paper-alt">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <p className="text-eyebrow uppercase text-brand-orange">Brief</p>
              <h2 className="mt-4 text-h2 tracking-tight text-ink">Send your brief.</h2>
              <p className="mt-4 text-ink/70">
                Lands in our inbox the moment you hit send. Read by a human, replied to by the same
                human.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <Promise icon={Clock} text="Reply within 24 hours, Sat–Thu" />
                <Promise icon={ShieldCheck} text="No marketing emails ever; we use it only to reply" />
                <Promise icon={CalendarDays} text="If a fit, we'll book a 30-min call within 2 working days" />
              </ul>
            </aside>
            <div className="lg:col-span-8">
              {/* Resolve booking URL server-side and pass as prop — avoids the
                  NEXT_PUBLIC build-time inline problem when the URL comes from
                  an SST runtime secret. */}
              <div className="rounded-panel bg-paper p-6 md:p-8">
                <ContactForm bookingUrl={bookingUrl()} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ FAQ ════════════════════════════════════════════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-eyebrow uppercase text-brand-orange">FAQ</p>
            <h2 className="mt-4 text-h2 tracking-tight text-ink">Before you write.</h2>
            <dl className="mt-10 space-y-3">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-panel bg-paper-alt p-6 md:p-7">
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Stat({ n, k }: { n: string; k: string }) {
  return (
    <div>
      <div className="text-xl font-extrabold leading-none text-white">{n}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-white/65">{k}</div>
    </div>
  );
}

function Promise({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cp-night text-white">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <span className="text-ink/80">{text}</span>
    </li>
  );
}
