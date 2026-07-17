// Prestige primitives — "restrained luxury / campaign dossier" language.
// Scoped to the political-ad flagship + prestige surfaces. Server components,
// no JS. Uses only pr-* tokens + font-pr-serif (Fraunces) / font-mono.

import type { ReactNode } from "react";

/** Accent seal bar — the one disciplined orange mark per header. */
export function Seal() {
  return <span className="inline-block h-[3px] w-[26px] bg-pr-accent" aria-hidden />;
}

/** Monospace "field-dossier" metadata tag. */
export function MonoTag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "accent";
}) {
  return (
    <span
      className={`font-mono text-[11.5px] tracking-[0.06em] ${
        tone === "accent" ? "text-pr-accent-ink" : "text-pr-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** Two-column section header: mono § index label | serif H2 (+ optional sub). */
export function SectionHead({
  index,
  title,
  sub,
  dark = false,
}: {
  index: string;
  title: ReactNode;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 grid gap-3 md:grid-cols-[220px_1fr] md:gap-10">
      <div>
        <span
          className={`font-mono text-xs tracking-[0.1em] ${
            dark ? "text-pr-briefing-muted" : "text-pr-muted"
          }`}
        >
          {index}
        </span>
      </div>
      <div>
        <h2
          className={`text-balance font-pr-serif text-[clamp(26px,3.4vw,40px)] font-semibold leading-[1.1] tracking-tight ${
            dark ? "text-pr-briefing-ink" : "text-pr-ink"
          }`}
        >
          {title}
        </h2>
        {sub && (
          <p
            className={`mt-3.5 max-w-[68ch] text-base ${
              dark ? "text-pr-briefing-muted" : "text-pr-muted"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
