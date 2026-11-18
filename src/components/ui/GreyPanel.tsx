import type { ReactNode } from "react";

// The Dataplace signature: content nested inside a soft-radius panel. Grey
// tones for light sections, ink for the one dark accent moment per page.
type Tone = "alt" | "tint" | "ink";
type Radius = "md" | "lg";

const TONE: Record<Tone, string> = {
  alt: "bg-paper-alt border border-ink/10", // raised maroon surface
  tint: "cp-hero border border-cp-gold/30 text-white", // hero panels: crimson radial gradient, hot upper-right core
  ink: "cp-hero cp-hero--flip border border-cp-gold/50 text-white", // closing CTAs: mirrored glow, stronger gold hairline
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
