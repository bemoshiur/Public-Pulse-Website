import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, MessageCircleMore } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
    <section className="relative overflow-hidden bg-paper">
      <Container className="relative pt-10 pb-12 md:pt-14 md:pb-16">
        <Breadcrumbs crumbs={crumbs} />

        <div
          className={`mt-8 grid items-end gap-8 lg:gap-10 ${
            variant === "panel" ? "lg:grid-cols-12" : ""
          }`}
        >
          <div className={variant === "panel" ? "lg:col-span-7" : "max-w-5xl"}>
            <span className="chip chip-orange">{chip}</span>
            {/* text-display (44-104px clamp) NOT text-mega (56-136px).
                text-mega is reserved for the homepage wordmark + the footer
                sign-off — using it on long article titles like blog posts
                blows past the viewport and looks broken. text-display sits
                in the right scale for inner-page heroes. */}
            <h1 className="mt-6 text-display tracking-tight text-ink leading-[0.98]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-ink/70">{lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={primaryCtaHref} className="btn btn-primary">
                {primaryCtaLabel}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
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
            <div className="lg:col-span-5">
              {rightPanel ?? <DefaultSalesPanel />}
            </div>
          )}
        </div>

        <div className="mt-12 max-w-3xl">
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
      className="group relative block overflow-hidden rounded-panel border border-ink/10 bg-ink p-6 text-paper transition hover:-translate-y-0.5"
    >
      <span aria-hidden className="mb-4 inline-block h-[3px] w-6 bg-brand-orange" />
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/25"
        />
        Sales team online
      </div>
      <p className="mt-3 font-pr-serif text-h3 font-semibold leading-tight">Talk to us now.</p>
      <p className="mt-1 text-sm text-paper/70">
        Reply usually under 2 hours on WhatsApp · Sat–Thu, 09:00–21:00 BD.
      </p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-orange">
        Let&rsquo;s talk
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}
