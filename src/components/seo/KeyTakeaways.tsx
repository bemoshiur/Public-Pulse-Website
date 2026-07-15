// A labeled "Key takeaways" box — a scannable, self-contained list of the
// page's most citable facts. Answer engines extract labeled, list-shaped
// summaries reliably, so a semantic <ul> under a clear heading is a high-value
// AEO surface. Server component, no JS.
//
// Use with REAL facts only (numbers, dates, named entities) — this is a
// citation surface, so a fabricated takeaway is a fabricated citation.

import type { ReactNode } from "react";

export function KeyTakeaways({
  items,
  title = "Key takeaways",
}: {
  items: ReactNode[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <aside
      className="key-takeaways my-8 rounded-2xl border border-brand-orange/25 bg-paper-tint/60 p-6"
      aria-label={title}
    >
      <h2 className="mb-3 text-eyebrow font-semibold uppercase tracking-wide text-brand-orange">
        {title}
      </h2>
      <ul className="space-y-2 text-ink/90">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-1 select-none text-brand-orange">
              →
            </span>
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
