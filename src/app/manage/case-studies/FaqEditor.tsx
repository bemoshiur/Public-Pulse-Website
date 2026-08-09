"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Structured replacement for the raw faqJson textarea that used to live in
// CaseStudyForm.tsx (that textarea threw an unstyled server exception on a
// missing comma). Same contract as MetricsEditor: rows kept in local UI
// state, blank/incomplete rows dropped from the serialized JSON but kept in
// the UI so a half-typed row doesn't vanish while the admin is still typing.

type FaqItem = { q: string; a: string };
type Row = FaqItem;
type Props = { name: string; initial?: FaqItem[] };

const EMPTY_ROW: Row = { q: "", a: "" };

function toRows(initial: FaqItem[]): Row[] {
  if (initial.length === 0) return [EMPTY_ROW];
  return initial.map((f) => ({ q: f.q, a: f.a }));
}

export function FaqEditor({ name, initial = [] }: Props) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initial));

  const clean: FaqItem[] = rows
    .filter((r) => r.q.trim() && r.a.trim())
    .map((r) => ({ q: r.q.trim(), a: r.a.trim() }));

  function patch(i: number, next: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...next } : r)));
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-brand-navy">
        FAQs (question + answer pairs, shown as an accordion on the detail page)
      </span>
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  className="form-input"
                  placeholder="Question"
                  value={row.q}
                  onChange={(e) => patch(i, { q: e.target.value })}
                />
                <textarea
                  className="form-input resize-y"
                  rows={2}
                  placeholder="Answer"
                  value={row.a}
                  onChange={(e) => patch(i, { a: e.target.value })}
                />
              </div>
              <button
                type="button"
                aria-label="Remove FAQ"
                onClick={() => setRows((p) => (p.length === 1 ? [EMPTY_ROW] : p.filter((_, idx) => idx !== i)))}
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setRows((p) => [...p, EMPTY_ROW])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add FAQ
      </button>
    </div>
  );
}
