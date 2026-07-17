import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { SplitHeader } from "@/components/sections/SplitHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/ui/CountUp";
import { SERVICES } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";
import { getFeaturedCaseStudies } from "@/lib/data/case-studies";
import { InlineBlock } from "@/components/lead-capture";

// JSON-LD Organization + WebSite emit site-wide from app/layout.tsx.

// Real, defensible coverage facts (derived from the catalogs) — replaces the
// unverified 50+/300% vanity stats the audit flagged. All auditable.
const STATS = [
  { number: "9", label: "Services in-house" },
  { number: "9", label: "Cities covered" },
  { number: "10", label: "Industries served" },
  { number: "2", label: "Languages (EN + বাংলা)" },
];

const FACTS: [string, string][] = [
  ["Founded", "2024 · Dhaka"],
  ["Services", "9 in-house"],
  ["Billing", "BDT · registered BD entity"],
  ["Languages", "English + Bangla"],
];

const PROCESS = [
  { n: "01", title: "Listen", body: "30-min strategy call. Channels audit. What's working, what isn't, and what you've already tried." },
  { n: "02", title: "Plan", body: "Quarterly plan with named owners, the calendar, the budget, and ONE KPI we'll be held to." },
  { n: "03", title: "Make", body: "Strategy, creative, paid, PR, analytics — one room, one brief, one weekly stand-up." },
  { n: "04", title: "Sharpen", body: "Monthly review. Honest call on what to double down on. What to kill. No vanity dashboards." },
];

export default async function HomePage() {
  // Featured case studies for the homepage Selected results — curated set
  // (max 4). Falls back to most-recent published when none are featured;
  // returns [] if DB unreachable (homepage hides the section gracefully).
  const caseStudies = await getFeaturedCaseStudies("en", 4);
  return (
    <>
      {/* ═══════ HERO — inset panel, centered serif (Dataplace T1) ═══════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <GreyPanel tone="tint" radius="lg" className="px-6 py-16 text-center md:px-16 md:py-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center">
              <div className="mb-6 flex items-center gap-3">
                <span aria-hidden className="inline-block h-[3px] w-6 bg-brand-orange" />
                <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-ink-mute">
                  Digital marketing &amp; political PR · Dhaka
                </span>
              </div>
              <h1 className="text-display leading-[1.02] tracking-tight text-ink">
                Reach that <em className="italic text-brand-orange">moves</em>. Narratives that{" "}
                <em className="italic text-brand-orange">hold</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lead text-ink-soft">
                Public Pulse is a Dhaka-based 360° digital marketing and political-PR studio —
                strategy, creative, paid media, PR, and analytics under one accountable team, billed
                in BDT from a registered Bangladeshi entity.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn btn-orange group">
                  Book a free consultation
                  <ArrowCircle onDark />
                </Link>
                <Link href="/services" className="btn btn-secondary">
                  See our services
                </Link>
              </div>
            </div>
            {/* Operational facts — real (not the 50+/300% placeholders) */}
            <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/12 pt-8 text-left md:grid-cols-4">
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
                    {k}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </GreyPanel>
        </Container>
      </Section>

      {/* ═══════ ANSWER BLOCK (AEO) ═════════════════════════════════════ */}
      <Section size="sm" className="bg-paper !pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <AnswerBlock>
              Public Pulse Agency is a Dhaka-based 360° digital marketing and political PR studio.
              We run political PR, social media, content production, paid ads, hospitality
              marketing, brand building, SEO and analytics — under one accountable team, for
              Bangladeshi brands and candidates.
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {/* ═══════ SERVICES — light inset cards (Dataplace T7) ════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <SplitHeader
            eyebrow="What we do"
            title={
              <>
                Nine sharp services.{" "}
                <span className="text-ink/40">One accountable team.</span>
              </>
            }
            aside={
              <>
                We don&rsquo;t hand off between three agencies. Strategy, creative, paid media and
                analytics sit in the same room — and the same weekly report.
              </>
            }
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              return (
                <li key={s.slug}>
                  <ScrollReveal delayMs={Math.min(i, 5) * 70}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex h-full flex-col rounded-panel border border-transparent bg-paper-alt p-7 transition duration-300 hover:-translate-y-1 hover:border-ink/10 hover:bg-paper-tint"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-meta font-semibold text-ink/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="grid h-11 w-11 place-items-center rounded-full bg-brand-orange/12 text-brand-orange transition-transform duration-300 group-hover:scale-110"
                          aria-hidden
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h3 className="mt-6 text-h3 font-bold leading-tight text-ink">{s.name}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{s.oneLiner}</p>
                      <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                        Explore
                        <ArrowRight
                          className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                          aria-hidden
                        />
                      </p>
                    </Link>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ═══════ STATS — inset grey panel, serif numerals ═══════════════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <GreyPanel tone="alt" radius="lg" className="px-6 py-12 md:px-12">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
              {STATS.map((s, i) => (
                <li key={s.label} className="text-center md:text-left">
                  <ScrollReveal delayMs={i * 70}>
                    <CountUp
                      value={s.number}
                      className="block font-pr-serif text-[clamp(2.75rem,5vw,4.5rem)] leading-none tracking-tight text-ink"
                    />
                    <div className="mt-3 text-meta uppercase text-ink/55">{s.label}</div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </GreyPanel>
        </Container>
      </Section>

      {/* ═══════ PROCESS — light, soft cards (Dataplace T4/T7) ══════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <SplitHeader
            eyebrow="How we run"
            title={
              <>
                Four steps. <span className="text-ink/40">No fog.</span>
              </>
            }
            aside={<>Same framework for a 30-day political PR push or a 12-month brand build.</>}
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <li key={step.title}>
                <ScrollReveal delayMs={i * 70}>
                  <div className="card h-full">
                    <div className="font-mono text-meta font-semibold text-brand-orange">
                      {step.n}
                    </div>
                    <h3 className="mt-3 text-h3 font-bold text-ink">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.body}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ═══════ RESULTS / CASE STUDIES — light metric cards ════════════ */}
      {caseStudies.length > 0 && (
        <Section size="lg" className="bg-paper">
          <Container>
            <SplitHeader
              eyebrow="Selected results"
              title={
                <>
                  Receipts. <span className="text-ink/40">Not vibes.</span>
                </>
              }
              aside={
                <>
                  Live engagements. Names withheld where NDAs apply — happy to walk specifics on a
                  call.
                </>
              }
            />
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {caseStudies.slice(0, 6).map((c, i) => (
                <li key={c.id}>
                  <ScrollReveal delayMs={i * 70}>
                    <article className="group flex h-full flex-col rounded-panel bg-paper-alt p-7 transition duration-300 hover:-translate-y-1 hover:bg-paper-tint">
                      <div className="flex items-center justify-between">
                        <p className="chip chip-light">{c.industry}</p>
                        <span className="font-mono text-meta font-semibold text-ink/35">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-7 font-pr-serif text-[clamp(2.5rem,3.5vw+1rem,4rem)] leading-none tracking-tight text-ink">
                        {c.metric}
                      </p>
                      <p className="mt-2 text-meta uppercase tracking-wider text-ink/55">
                        Over {c.windowLabel}
                      </p>
                      <p className="mt-6 flex-1 text-sm leading-relaxed text-ink/70">{c.summary}</p>
                      {c.serviceSlug && (
                        <Link
                          href={`/services/${c.serviceSlug}`}
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
                        >
                          See service
                          <ArrowRight
                            className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                            aria-hidden
                          />
                        </Link>
                      )}
                    </article>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-meta text-ink/55">
                Numbers from active client engagements; specific accounts named with permission.
              </p>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
              >
                Browse all case studies
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* ═══════ TESTIMONIAL — Dataplace scoop card (T5) ════════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <ScrollReveal>
            <GreyPanel tone="alt" radius="lg" className="p-3 md:p-4">
              <div className="grid gap-3 md:grid-cols-12 md:gap-4">
                {/* Quote card — asymmetric bottom-right scoop */}
                <figure className="flex flex-col justify-between gap-8 rounded-[20px] bg-paper p-8 md:col-span-8 md:rounded-[24px_24px_80px_24px] md:p-12">
                  <blockquote className="font-pr-serif text-[clamp(1.5rem,2.4vw+0.5rem,2.3rem)] leading-snug tracking-tight text-ink">
                    &ldquo;We replaced three agencies with Public Pulse. Reporting got simpler,
                    decisions got faster, and the work — finally — looks like it&rsquo;s coming from{" "}
                    <span className="text-brand-orange">one brand</span>.&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-brand-orange text-lg font-extrabold text-paper"
                      aria-hidden
                    >
                      H
                    </span>
                    <span className="leading-tight">
                      <span className="block text-sm font-bold text-ink">Hospitality brand</span>
                      <span className="block text-[11px] uppercase tracking-wider text-ink/55">
                        Marketing director · Cox&rsquo;s Bazar
                      </span>
                    </span>
                  </figcaption>
                </figure>
                {/* Stat column */}
                <div className="flex flex-col justify-between gap-6 rounded-[20px] bg-ink p-8 text-paper md:col-span-4 md:p-10">
                  <span aria-hidden className="inline-block h-[3px] w-6 bg-brand-orange" />
                  <ul className="space-y-6">
                    <li>
                      <div className="font-pr-serif text-[clamp(2rem,2.5vw+0.5rem,2.75rem)] leading-none text-paper">
                        3 → 1
                      </div>
                      <div className="mt-2 text-meta uppercase text-paper/55">
                        Vendor consolidation
                      </div>
                    </li>
                    <li>
                      <div className="font-pr-serif text-[clamp(2rem,2.5vw+0.5rem,2.75rem)] leading-none text-paper">
                        2×
                      </div>
                      <div className="mt-2 text-meta uppercase text-paper/55">Decision speed</div>
                    </li>
                    <li>
                      <div className="font-pr-serif text-[clamp(2rem,2.5vw+0.5rem,2.75rem)] leading-none text-paper">
                        1
                      </div>
                      <div className="mt-2 text-meta uppercase text-paper/55">
                        Weekly report, one team
                      </div>
                    </li>
                  </ul>
                  <p className="text-sm text-paper/70">
                    Replaced three agencies with Public Pulse in Q3 2025.
                  </p>
                </div>
              </div>
            </GreyPanel>
          </ScrollReveal>
        </Container>
      </Section>

      {/* ═══════ NEWSLETTER — homepage value block ════════════════════════ */}
      <Section size="sm" className="bg-paper">
        <Container>
          <InlineBlock context="homepage" />
        </Container>
      </Section>

      {/* ═══════ FINAL CTA — dark inset panel (Dataplace T9) ════════════ */}
      <Section size="lg" className="bg-paper">
        <Container>
          <GreyPanel tone="ink" radius="lg" className="px-6 py-20 text-center md:px-16 md:py-28">
            <h2 className="mx-auto max-w-4xl text-display leading-[0.98] tracking-tight text-paper">
              Got a campaign that <span className="text-brand-orange">needs to land</span>?
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lead text-white/70">
              Free 30-minute consultation. We&rsquo;ll review your channels, your goals, and whether
              we&rsquo;re the right fit. No deck, no pitch.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn btn-orange group">
                Book the call
                <ArrowCircle onDark />
              </Link>
              <a href={`tel:${SITE.contact.phone}`} className="btn btn-ghost-dark">
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.contact.phoneDisplay}
              </a>
            </div>
          </GreyPanel>
        </Container>
      </Section>
    </>
  );
}
