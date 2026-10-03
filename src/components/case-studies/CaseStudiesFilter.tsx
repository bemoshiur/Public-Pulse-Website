"use client";

// Client-side filter for /case-studies. SSR-VISIBLE BY DESIGN: every case
// study card is rendered on the server (every entry in `cases` is mapped
// unconditionally) and filtering only toggles a CSS `hidden` class via
// local useState. Do NOT reintroduce useSearchParams/Suspense here — that
// combination is exactly what made this grid invisible to crawlers (zero
// crawlable /case-studies/<slug> anchors in the built HTML). See
// WorksFilter.tsx for the reference pattern this mirrors (Task 6 / Task 13).

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { CountUp } from "@/components/ui/CountUp";

export type CaseStudyCard = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  industry: string;
  location: string | null;
  metric: string;
  windowLabel: string;
  services: string[];
  serviceSlug: string | null;
  clientName: string | null;
};

type Props = {
  cases: CaseStudyCard[];
  serviceLabels: Record<string, string>;
};

function parseMetric(metric: string): {
  num?: number;
  prefix: string;
  suffix: string;
} {
  const m = metric.trim().match(/^([+-])?\s*([\d.,]+)\s*([%a-zA-Z×x]*)$/);
  if (!m) return { prefix: "", suffix: "" };
  const sign = m[1];
  const digits = m[2];
  const unit = m[3];
  const n = parseFloat(digits.replace(/,/g, ""));
  if (!isFinite(n)) return { prefix: "", suffix: "" };
  return {
    num: n,
    prefix: sign === "-" ? "-" : sign === "+" ? "+" : "",
    suffix: unit ?? "",
  };
}

export function CaseStudiesFilter({ cases, serviceLabels }: Props) {
  const [activeIndustry, setActiveIndustry] = useState<string>("");
  const [activeService, setActiveService] = useState<string>("");

  const industries = useMemo(
    () => Array.from(new Set(cases.map((c) => c.industry))).sort(),
    [cases]
  );
  const servicesSeen = useMemo(
    () =>
      Array.from(
        new Set([
          ...cases.flatMap((c) => c.services),
          ...cases.flatMap((c) => (c.serviceSlug ? [c.serviceSlug] : [])),
        ])
      ).sort(),
    [cases]
  );

  function shown(c: CaseStudyCard): boolean {
    if (activeIndustry && c.industry !== activeIndustry) return false;
    if (activeService) {
      const matches = c.services.includes(activeService) || c.serviceSlug === activeService;
      if (!matches) return false;
    }
    return true;
  }

  const visibleCount = cases.filter(shown).length;

  return (
    <>
      {cases.length > 0 && (
        <section className="bg-paper py-6">
          <div className="max-w-container mx-auto px-5 md:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveIndustry("");
                  setActiveService("");
                }}
                aria-pressed={!activeIndustry && !activeService}
                className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  !activeIndustry && !activeService
                    ? "border-brand-orange bg-brand-orange text-cp-gold-ink"
                    : "border-ink/20 bg-paper text-ink/70 hover:border-ink"
                }`}
              >
                All ({cases.length})
              </button>
              {industries.map((ind) => {
                const count = cases.filter((c) => c.industry === ind).length;
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setActiveIndustry(ind)}
                    aria-pressed={activeIndustry === ind}
                    className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      activeIndustry === ind
                        ? "border-brand-orange bg-brand-orange text-cp-gold-ink"
                        : "border-ink/20 bg-paper text-ink/70 hover:border-ink"
                    }`}
                  >
                    {ind} ({count})
                  </button>
                );
              })}
              {servicesSeen.length > 0 && (
                <span className="mx-2 h-4 w-px bg-ink/15" aria-hidden />
              )}
              {servicesSeen.map((s) => {
                const count = cases.filter(
                  (c) => c.services.includes(s) || c.serviceSlug === s
                ).length;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveService(s)}
                    aria-pressed={activeService === s}
                    className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      activeService === s
                        ? "border-brand-orange bg-brand-orange text-cp-gold-ink"
                        : "border-ink/20 bg-paper text-ink/70 hover:border-ink"
                    }`}
                  >
                    {serviceLabels[s] ?? s} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-paper pb-20 md:pb-28">
        <div className="max-w-container mx-auto px-5 md:px-8">
          {cases.length === 0 ? (
            <div className="rounded-panel border border-dashed border-ink/20 bg-paper-alt p-10 text-center">
              <p className="text-ink/65">
                Case studies are being written up — the latest will appear here soon.
              </p>
              <p className="mt-4 text-meta text-ink/65">
                In the meantime, see what we deliver under{" "}
                <Link href="/services" className="underline hover:text-brand-orange">
                  services
                </Link>
                {" "}or{" "}
                <Link href="/contact" className="underline hover:text-brand-orange">
                  talk to the team
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div
                role="status"
                className={
                  visibleCount === 0
                    ? "rounded-panel border border-dashed border-ink/20 bg-paper-alt p-10 text-center"
                    : "hidden"
                }
              >
                <p className="text-ink/65">
                  No case studies match these filters. Try removing them above.
                </p>
              </div>
              <ul
                className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${
                  visibleCount === 0 ? "hidden" : ""
                }`}
              >
                {cases.map((c) => {
                  const parsed = parseMetric(c.metric);
                  return (
                    <li key={c.id} className={shown(c) ? undefined : "hidden"}>
                      <Link
                        href={`/case-studies/${c.slug}`}
                        className="card group flex h-full flex-col"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="chip chip-orange">{c.industry}</span>
                          {c.location && (
                            <span className="inline-flex items-center rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink/65">
                              {c.location}
                            </span>
                          )}
                        </div>
                        <div className="mt-6">
                          <div className="font-pr-serif text-[clamp(2.2rem,4vw+0.5rem,3.5rem)] leading-[0.95] tracking-tight text-ink">
                            {parsed.num !== undefined ? (
                              <CountUp value={`${parsed.prefix}${parsed.num}${parsed.suffix}`} />
                            ) : (
                              c.metric
                            )}
                          </div>
                          <div className="mt-2 text-eyebrow text-ink/65">{c.windowLabel}</div>
                        </div>
                        <h2 className="mt-5 line-clamp-3 text-h3 font-bold text-ink">{c.title}</h2>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">
                          {c.summary}
                        </p>
                        {c.services.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {c.services.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-ink/15 bg-paper-tint px-2 py-0.5 text-[10px] font-semibold uppercase text-ink/65"
                              >
                                {serviceLabels[s] ?? s}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-meta text-ink/65">
                          <span>{c.clientName ?? c.industry}</span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                            Read
                            <ArrowRight
                              className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                              aria-hidden
                            />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
