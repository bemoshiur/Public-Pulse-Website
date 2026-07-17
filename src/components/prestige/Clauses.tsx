// Compliance clause grid for the dark "briefing room" section. Pure body
// component — the page wraps it in a `bg-pr-briefing` section + dark SectionHead.

export type Clause = { ref: string; heading: string; body: string };

export function Clauses({ clauses }: { clauses: Clause[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[4px] border border-pr-briefing-line bg-pr-briefing-line md:grid-cols-2">
      {clauses.map((c) => (
        <div key={c.ref} className="bg-pr-briefing p-[22px]">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-pr-accent-ink">
            {c.ref}
          </div>
          <h3 className="mb-2 mt-2.5 font-pr-serif text-[18px] font-semibold text-pr-briefing-ink">
            {c.heading}
          </h3>
          <p className="text-[14px] leading-[1.55] text-pr-briefing-muted">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
