import type { ReactNode } from "react";

// Dataplace T6 — split section header: serif statement left, small right-
// aligned aside, opened by a hairline top rule. The section heading is always
// an <h2> (one <h1> per page lives in the hero).
type Props = {
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function SplitHeader({ eyebrow, title, aside, className = "" }: Props) {
  return (
    <div
      className={`grid items-end gap-6 border-t border-ink/15 pt-8 md:grid-cols-2 md:gap-10 ${className}`}
    >
      <div>
        {eyebrow && <p className="text-eyebrow uppercase text-brand-orange">{eyebrow}</p>}
        <h2 className="mt-4 text-h2 tracking-tight text-ink">{title}</h2>
      </div>
      {aside && (
        <div className="text-lead text-ink/70 md:max-w-md md:justify-self-end md:text-right">
          {aside}
        </div>
      )}
    </div>
  );
}
