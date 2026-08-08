"use client";

import { useState } from "react";
import type { WorkWithClient } from "@/lib/data/works";
import type { Discipline } from "@/lib/taxonomies/disciplines";
import { WorkCard } from "./WorkCard";

// SSR-VISIBLE BY DESIGN: every card is rendered on the server and filtering
// only toggles a CSS class. Do NOT reintroduce useSearchParams/Suspense here
// — that is exactly what made the /case-studies grid invisible to crawlers
// (zero crawlable detail links in the built HTML).

type Props = { works: WorkWithClient[]; disciplines: Discipline[] };

export function WorksFilter({ works, disciplines }: Props) {
  const [active, setActive] = useState<string>("");

  const shown = (w: WorkWithClient) => !active || w.disciplines.includes(active);
  const count = (slug: string) => works.filter((w) => w.disciplines.includes(slug)).length;
  const available = disciplines.filter((d) => count(d.slug) > 0);

  return (
    <>
      {available.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("")}
            aria-pressed={active === ""}
            className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              active === "" ? "border-ink bg-ink text-paper" : "border-ink/20 bg-paper text-ink/70 hover:border-ink"
            }`}
          >
            All ({works.length})
          </button>
          {available.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setActive(d.slug)}
              aria-pressed={active === d.slug}
              className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                active === d.slug ? "border-ink bg-ink text-paper" : "border-ink/20 bg-paper text-ink/70 hover:border-ink"
              }`}
            >
              {d.name} ({count(d.slug)})
            </button>
          ))}
        </div>
      )}

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {works.map((w) => (
          <li key={w.id} className={shown(w) ? undefined : "hidden"}>
            <WorkCard work={w} />
          </li>
        ))}
      </ul>
    </>
  );
}
