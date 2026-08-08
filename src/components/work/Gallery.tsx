"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { WorkMedia } from "@/db/schema";
import { MediaFrame } from "./MediaFrame";

// Client component for the lightbox's open/close state only. The grid below
// always renders every item via .map() on first render (server AND client),
// so crawlers and no-JS visitors see the full gallery — only the modal
// overlay is gated behind interaction.

type Props = { items: WorkMedia[] };

export function Gallery({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((m, i) => (
          <li key={m.url} className={items.length % 2 === 1 && i === 0 ? "md:col-span-2" : undefined}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open image: ${m.alt}`}
              className="block w-full text-left transition hover:opacity-95"
            >
              <MediaFrame media={m} sizes="(min-width: 768px) 50vw, 100vw" />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="max-h-full w-full max-w-5xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <MediaFrame media={items[open]} sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}
