import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, MessageCircleMore } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Crumb } from "@/lib/schema";
import { SITE } from "@/lib/site";

// Re-usable "homepage-vibe" hero for every page type. Mega wordmark on the
// left, optional gradient panel on the right with sales-team card and
// avoora-style cloud bg. AnswerBlock anchored below.
//
// Variants:
//   • "panel"   — full avoora gradient panel right side (default)
//   • "compact" — just the headline + chip; no right panel (use for the
//                   minimal AnswerBlock-only pages where the gradient noise
//                   would distract)

type Variant = "panel" | "compact";

type Props = {
  crumbs: Crumb[];
  chip: string;
  title: ReactNode;
  lead: string;
  /** AEO/GEO 40–60 word block, required. */
  answer: string;
  answerQuestion?: string;
  /** "Book a free audit" → "/contact" by default. Override per page if needed. */
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  variant?: Variant;
  /** Panel-only — replaces the default "Sales team online" card. */
  rightPanel?: ReactNode;
};

const SECONDARY_CTA = { label: "WhatsApp", href: SITE.contact.whatsapp };

export function GradientHero({
  crumbs,
  chip,
  title,
  lead,
  answer,
  answerQuestion,
  primaryCtaLabel = "Book a free audit",
  primaryCtaHref = "/contact",
  variant = "panel",
  rightPanel,
}: Props) {
  return (
    <section className="relative bg-paper">
      <Container className="relative pt-8 md:pt-10">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <Container className="relative pb-12 pt-6 md:pb-16">
        {/* Dataplace inset hero panel (matches the homepage hero) */}
        <GreyPanel tone="tint" radius="lg" className="px-6 py-12 md:px-12 md:py-16">
          <div
            className={`grid items-end gap-8 lg:gap-10 ${
              variant === "panel" ? "lg:grid-cols-12" : ""
            }`}
          >
            <div className={variant === "panel" ? "lg:col-span-7" : "max-w-4xl"}>
              <span className="chip chip-orange">{chip}</span>
              {/* text-display (44-104px clamp) NOT text-mega — text-mega is
                  reserved for the homepage wordmark + footer sign-off. */}
              <h1 className="mt-6 text-display leading-[0.98] tracking-tight text-ink">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-lead text-ink/70">{lead}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={primaryCtaHref} className="btn btn-primary group">
                  {primaryCtaLabel}
                  <ArrowCircle onDark />
                </Link>
                <a
                  href={SECONDARY_CTA.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn btn-secondary"
                >
                  <MessageCircleMore className="h-4 w-4" aria-hidden />
                  {SECONDARY_CTA.label}
                </a>
              </div>
            </div>

            {variant === "panel" && (
              <div className="lg:col-span-5">{rightPanel ?? <DefaultSalesPanel />}</div>
            )}
          </div>
        </GreyPanel>

        <div className="mt-8 max-w-3xl">
          <AnswerBlock question={answerQuestion}>{answer}</AnswerBlock>
        </div>
      </Container>
    </section>
  );
}

/** Default right-side gradient panel — Sales team availability card. */
function DefaultSalesPanel() {
  return (
    <Link
      href="/contact"
      aria-label="Sales team online — available 09:00–21:00 Asia/Dhaka"
      className="group relative block overflow-hidden rounded-panel border border-ink/10 bg-cp-night p-6 text-white transition hover:-translate-y-0.5"
    >
      <span aria-hidden className="mb-4 inline-block h-[3px] w-6 bg-brand-orange" />
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/25"
        />
        Sales team online
      </div>
      <p className="mt-3 font-pr-serif text-h3 font-semibold leading-tight">Talk to us now.</p>
      <p className="mt-1 text-sm text-white/65">
        Reply usually under 2 hours on WhatsApp · Sat–Thu, 09:00–21:00 BD.
      </p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-orange">
        Let&rsquo;s talk
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}
