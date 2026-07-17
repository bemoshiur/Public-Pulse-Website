import type { ReactNode } from "react";

// The Dataplace signature: content nested inside a soft-radius panel. Grey
// tones for light sections, ink for the one dark accent moment per page.
type Tone = "alt" | "tint" | "ink";
type Radius = "md" | "lg";

const TONE: Record<Tone, string> = {
  alt: "bg-paper-alt", // #F6F6F6 — the workhorse inset grey
  tint: "bg-paper-tint", // #F3F4F5 — slightly cooler
  ink: "bg-ink text-paper", // the single dark panel (hero-panel / closing CTA)
};

const RADIUS: Record<Radius, string> = {
  md: "rounded-panel", // 20px
  lg: "rounded-panel-lg", // 32px
};

type Props = {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  radius?: Radius;
};

export function GreyPanel({ children, className = "", tone = "alt", radius = "lg" }: Props) {
  return (
    <div className={`${TONE[tone]} ${RADIUS[radius]} overflow-hidden ${className}`}>{children}</div>
  );
}
