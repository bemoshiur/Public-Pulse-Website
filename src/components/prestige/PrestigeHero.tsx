import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Seal } from "./Primitives";

type Cta = { href: string; label: string };

/** Asymmetric prestige hero: kicker + serif H1 + lede + CTAs, with an aside
 *  slot (the dossier / AnswerBlock card). One signature staggered load reveal. */
export function PrestigeHero({
  eyebrow,
  title,
  lede,
  ctaPrimary,
  ctaSecondary,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  ctaPrimary: Cta;
  ctaSecondary?: Cta;
  aside: ReactNode;
}) {
  return (
    <section className="pb-14 pt-[76px]">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.55fr_1fr] md:items-start md:gap-14">
          <div>
            <div className="pr-reveal mb-6 flex items-center gap-3.5">
              <Seal />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-pr-muted">
                {eyebrow}
              </span>
            </div>
            <h1 className="pr-reveal d1 text-balance font-pr-serif text-[clamp(37px,6vw,72px)] font-semibold leading-[1.03] tracking-[-0.02em] text-pr-ink">
              {title}
            </h1>
            <p className="pr-reveal d2 mt-6 max-w-[46ch] text-[clamp(18px,2.1vw,21px)] leading-[1.5] text-pr-ink-soft">
              {lede}
            </p>
            <div className="pr-reveal d3 mt-8 flex flex-wrap gap-3">
              <Link
                href={ctaPrimary.href}
                className="group inline-flex items-center gap-2 rounded-[3px] bg-pr-accent px-[22px] py-[13px] text-[14.5px] font-semibold text-cp-gold-ink transition hover:bg-pr-accent-ink"
              >
                {ctaPrimary.label}
                <span aria-hidden className="transition-transform group-hover:translate-x-[3px]">→</span>
              </Link>
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center gap-2 rounded-[3px] border border-pr-hairline px-[22px] py-[13px] text-[14.5px] font-semibold text-pr-ink transition hover:border-pr-ink"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
          <div className="pr-reveal d2">{aside}</div>
        </div>
      </Container>
    </section>
  );
}
