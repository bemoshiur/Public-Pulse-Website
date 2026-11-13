import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Globe } from "@/components/home/Globe";
import { SERVICES } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";

// Hero: dark stage with the interactive Dhaka ↔ USA / Seoul globe, the
// existing wordmark H1 + sub-headline copy, and the five numbered service
// tiles. Copy and links are unchanged from the previous hero.

const CARDS = [
  { cls: "left-0 top-[16%]", label: "Dhaka · HQ", sub: "Head office", tone: "red" },
  { cls: "right-[2%] top-[30%]", label: "USA", sub: "Client partnerships", tone: "green" },
  { cls: "right-[4%] top-[4%]", label: "Seoul", sub: "Branch office", tone: "red" },
] as const;

export function HeroPanel() {
  const tiles = SERVICES.slice(0, 5);

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <Container className="relative pb-10 pt-8 md:pb-14 md:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-green">
              Dhaka · Seoul · USA
            </p>
            <h1 className="mt-4 text-mega leading-[0.92] tracking-[-0.04em]">
              Public<span className="text-paper/30">_</span>Pulse
              <sup className="align-top text-[0.28em] tracking-normal text-brand-orange">®</sup>
            </h1>
            <h2 className="mt-8 max-w-[18ch] text-display leading-[1.02] tracking-tight">
              We build brands with <span className="text-brand-orange">influence.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-paper/75 md:text-lg">
              A 360° digital marketing + political PR studio out of Dhaka — political campaigns,
              hospitality launches, consumer brand builds, all under one accountable team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-orange uppercase tracking-wide">
                Book a call
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/case-studies"
                className="btn border border-paper/30 text-paper uppercase tracking-wide hover:border-paper"
              >
                See our work
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:col-span-5">
            <Globe />
            {CARDS.map((c, i) => (
              <div
                key={c.label}
                aria-hidden
                style={{ animationDelay: `${-i * 2}s` }}
                className={`pp-float absolute hidden rounded-[14px] border bg-ink/85 px-3.5 py-2.5 backdrop-blur sm:block ${c.cls} ${
                  c.tone === "green" ? "border-brand-green/45" : "border-brand-orange/45"
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/55">
                  {c.sub}
                </div>
                <div className="text-sm font-bold">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-2">
          {tiles.map((s, i) => {
            const Icon = getServiceIcon(s.slug);
            return (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full items-center gap-3 rounded-card border border-paper/15 bg-paper/5 p-2.5 transition hover:-translate-y-0.5 hover:border-brand-green"
                >
                  <span
                    className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-[8px] bg-brand-orange text-paper transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[11px] text-paper/50">
                      ({String(i + 1).padStart(2, "0")})
                    </div>
                    <div className="truncate text-xs font-bold leading-tight md:text-sm">
                      {s.shortName}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
