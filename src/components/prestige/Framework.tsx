// Numbered strategic framework — hairline-separated rows: mono code / serif
// name / body. A pure body component (the page supplies Container + SectionHead).

export type FrameworkStep = { code: string; name: string; body: string };

export function Framework({ steps }: { steps: FrameworkStep[] }) {
  return (
    <div className="border-t border-pr-hairline">
      {steps.map((s) => (
        <div
          key={s.code}
          className="grid gap-2 border-b border-pr-hairline py-[26px] md:grid-cols-[64px_200px_1fr] md:items-baseline md:gap-8"
        >
          <div className="font-mono text-[13px] tracking-[0.05em] text-pr-accent">{s.code}</div>
          <div className="font-pr-serif text-[21px] font-semibold text-pr-ink">{s.name}</div>
          <div className="max-w-[56ch] text-[15.5px] leading-[1.55] text-pr-ink-soft">{s.body}</div>
        </div>
      ))}
    </div>
  );
}
