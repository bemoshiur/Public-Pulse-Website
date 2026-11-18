import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WorkWithClient } from "@/lib/data/works";
import { MediaFrame } from "./MediaFrame";

// Media-led when a hero asset exists; typographic fallback otherwise (the
// "Mixed" content requirement — a numbers-only work is deliberate, not
// broken). Anonymised works never leak the client name or logo.

export function WorkCard({ work }: { work: WorkWithClient }) {
  const hero = work.media.find((m) => m.role === "hero") ?? work.media[0];
  const clientLabel =
    work.confidentiality === "anonymised" ? work.anonLabel ?? "Confidential client" : work.client?.name ?? "";
  const headlineMetric = work.metrics[0];

  return (
    <Link
      href={`/work/${work.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-panel bg-paper-alt transition duration-300 hover:-translate-y-1 hover:bg-paper-tint"
    >
      {hero ? (
        <MediaFrame media={hero} className="rounded-none" sizes="(min-width: 1024px) 33vw, 100vw" />
      ) : (
        // Typographic fallback — a numbers-only work is deliberate, not broken.
        <div className="flex min-h-[12rem] flex-col justify-end bg-paper-tint p-7">
          {headlineMetric && (
            <p className="font-pr-serif text-[clamp(2.25rem,4vw,3.25rem)] leading-none tracking-tight text-ink">
              {headlineMetric.value}
            </p>
          )}
          <p className="mt-2 text-meta uppercase tracking-wider text-ink/75">
            {headlineMetric?.label ?? work.windowLabel ?? "Case"}
          </p>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {clientLabel && (
          <p className="text-meta uppercase tracking-wider text-ink/75">{clientLabel}</p>
        )}
        <h3 className="mt-2 text-h3 font-bold leading-tight text-ink">{work.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/70">{work.summary}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
          View work
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
        </p>
      </div>
    </Link>
  );
}
