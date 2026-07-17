// BDT budget table — mono tabular-nums figures in a horizontally-scrollable
// container. Pure body component (page supplies Container + SectionHead).

export type BudgetRow = { tier: string; bestFor: string; fee: string; media: string };

const HEADERS = ["Engagement", "Best for", "Management fee", "Suggested media / mo"];

export function BudgetTable({ rows, note }: { rows: BudgetRow[]; note: string }) {
  return (
    <>
      <div className="overflow-x-auto rounded-[4px] border border-pr-hairline">
        <table className="w-full min-w-[560px] border-collapse text-[14.5px]">
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="border-b border-pr-hairline bg-pr-surface px-[18px] py-3.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-pr-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.tier}>
                <td className="border-b border-pr-hairline px-[18px] py-3.5 font-semibold text-pr-ink">
                  {r.tier}
                </td>
                <td className="border-b border-pr-hairline px-[18px] py-3.5 text-pr-ink-soft">
                  {r.bestFor}
                </td>
                <td className="whitespace-nowrap border-b border-pr-hairline px-[18px] py-3.5 font-mono tabular-nums text-pr-ink">
                  {r.fee}
                </td>
                <td className="whitespace-nowrap border-b border-pr-hairline px-[18px] py-3.5 font-mono tabular-nums text-pr-ink">
                  {r.media}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[12.5px] text-pr-muted">{note}</p>
    </>
  );
}
