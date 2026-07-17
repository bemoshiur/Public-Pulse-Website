// Reality/feature cards — mono index + serif heading + body. Pure body
// component (page supplies Container + SectionHead).

export type PrestigeCard = { num: string; heading: string; body: string };

export function CardGrid({ cards }: { cards: PrestigeCard[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {cards.map((c) => (
        <div key={c.num} className="rounded-[4px] border border-pr-hairline bg-pr-surface p-6">
          <div className="font-mono text-[12px] text-pr-accent">{c.num}</div>
          <h3 className="mb-2 mt-2.5 font-pr-serif text-[19px] font-semibold text-pr-ink">
            {c.heading}
          </h3>
          <p className="text-[14.5px] leading-[1.55] text-pr-ink-soft">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
