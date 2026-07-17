// FAQ accordion in the dossier style — native <details>, no client JS. Serif
// summaries, rotating mono "+" marker. Pure body component.

export function PrestigeFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-pr-hairline">
      {faqs.map((f, i) => (
        <details key={f.q} open={i === 0} className="group border-b border-pr-hairline">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-5 py-[22px] font-pr-serif text-[19px] font-semibold text-pr-ink [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span className="shrink-0 font-mono text-[20px] text-pr-accent transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="max-w-[68ch] pb-6 text-[15.5px] leading-[1.6] text-pr-ink-soft">
            {f.a}
          </div>
        </details>
      ))}
    </div>
  );
}
