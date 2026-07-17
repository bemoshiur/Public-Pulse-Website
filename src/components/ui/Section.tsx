import type { ReactNode, ElementType } from "react";

// Dataplace vertical-rhythm primitive. Three padding steps mirror the
// template's padding-section small/medium/large (3/5/7rem), compressing on
// mobile. Background/border is applied by the caller via className.
type Size = "sm" | "md" | "lg";

const PAD: Record<Size, string> = {
  sm: "py-12 md:py-16", // ~3rem → 4rem
  md: "py-16 md:py-24", // ~4rem → 6rem
  lg: "py-20 md:py-32", // ~5rem → 8rem
};

type Props = {
  children: ReactNode;
  size?: Size;
  className?: string;
  as?: ElementType;
};

export function Section({ children, size = "md", className = "", as: As = "section" }: Props) {
  return <As className={`${PAD[size]} ${className}`}>{children}</As>;
}
