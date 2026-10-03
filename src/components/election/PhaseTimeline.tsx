"use client";

import { useState } from "react";
import { Users, Megaphone, Calendar, AlertTriangle, ShieldCheck, Clock } from "lucide-react";

// Interactive 5-phase timeline for /election. Tabs across the top, body
// fades in below. Keyboard-navigable (←/→), accessible roles.
//
// Icons are passed as string keys (not component refs) because this is a
// client component receiving props from a server component — React can't
// serialize component references across that boundary.

const ICONS = {
  users: Users,
  megaphone: Megaphone,
  calendar: Calendar,
  warning: AlertTriangle,
  shield: ShieldCheck,
  clock: Clock,
} as const;
export type PhaseIcon = keyof typeof ICONS;

export type Phase = {
  icon: PhaseIcon;
  weeks: string;
  title: string;
  body: string;
};

type Tone = "light" | "campaign";

// "campaign" = the crimson/gold treatment used on /election (see .theme-campaign).
const T = {
  light: {
    tabOn: "border-brand-orange bg-brand-orange/5 shadow-card",
    tabOff: "border-ink/10 bg-paper hover:border-ink/40",
    iconOn: "bg-brand-orange text-cp-gold-ink",
    iconOff: "bg-ink/5 text-ink",
    idx: "text-ink/65", weeks: "text-ink/65", title: "text-ink",
    panel: "border-ink/10 bg-paper", eyebrow: "text-brand-orange", h3: "text-ink", body: "text-ink/70",
    barOn: "bg-brand-orange", barDone: "bg-brand-orange/40", barOff: "bg-ink/10",
  },
  campaign: {
    tabOn: "border-cp-gold bg-black/30 shadow-card",
    tabOff: "border-cp-line/70 bg-black/20 hover:border-cp-gold/70",
    iconOn: "bg-cp-gold text-cp-gold-ink",
    iconOff: "bg-white/10 text-white",
    idx: "text-white/65", weeks: "text-white/70", title: "text-white",
    panel: "border-cp-line/80 bg-black/25", eyebrow: "text-cp-gold", h3: "text-white", body: "text-white/80",
    barOn: "bg-cp-gold", barDone: "bg-cp-gold/45", barOff: "bg-white/15",
  },
} as const;

export function PhaseTimeline({ phases, tone = "light" }: { phases: Phase[]; tone?: Tone }) {
  const c = T[tone];
  const [active, setActive] = useState(0);

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => Math.min(phases.length - 1, a + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    }
  }

  return (
    <div>
      {/* Tabs / phase chips */}
      <div
        role="tablist"
        aria-label="Election readiness phases"
        onKeyDown={onKey}
        className="grid grid-cols-2 gap-2 md:grid-cols-5"
      >
        {phases.map((p, i) => {
          const isActive = i === active;
          const Icon = ICONS[p.icon];
          return (
            <button
              key={p.title}
              type="button"
              role="tab"
              id={`phase-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`phase-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex flex-col items-start gap-2 rounded-card border p-4 text-left transition ${
                isActive ? c.tabOn : c.tabOff
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  aria-hidden
                  className={`grid h-9 w-9 place-items-center rounded-full transition ${
                    isActive ? c.iconOn : c.iconOff
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={`text-meta font-mono uppercase tracking-wider ${c.idx}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className={`text-meta uppercase tracking-wider ${c.weeks}`}>{p.weeks}</p>
                <p className={`mt-1 text-sm font-bold ${c.title}`}>{p.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active phase body */}
      <div
        id={`phase-${active}`}
        role="tabpanel"
        aria-labelledby={`phase-tab-${active}`}
        className={`mt-6 rounded-card border p-6 md:p-8 ${c.panel}`}
        key={active /* re-render to retrigger fade */}
      >
        <p className={`text-eyebrow uppercase ${c.eyebrow}`}>{phases[active].weeks}</p>
        <h3 className={`mt-3 text-h2 tracking-tight ${c.h3}`}>{phases[active].title}</h3>
        <p className={`mt-4 text-lead ${c.body}`}>{phases[active].body}</p>

        {/* Phase index ruler */}
        <div className="mt-8 flex items-center gap-3">
          {phases.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Phase ${i + 1}`}
              className={`h-1 flex-1 rounded-full transition ${
                i === active ? c.barOn : i < active ? c.barDone : c.barOff
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
