"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CaseStudyMetric } from "@/db/schema";

// Structured replacement for the raw metricsJson textarea that used to live
// in CaseStudyForm.tsx (that textarea threw an unstyled server exception on a
// missing comma). Same contract as RepeatableEditor: rows kept in local UI
// state, blank/incomplete rows dropped from the serialized JSON but kept in
// the UI so a half-typed row doesn't vanish while the admin is still typing.
//
// SHARED by both admin surfaces (manage/work + manage/case-studies). It used
// to exist as two copies in those route folders that differed only in the
// heading string — that string is now the `heading` prop, so behaviour at
// both call sites is unchanged.

type Row = { label: string; value: string; timeframe: string; unit: string };
type Props = { name: string; initial?: CaseStudyMetric[]; heading?: string };

const EMPTY_ROW: Row = { label: "", value: "", timeframe: "", unit: "" };

function toRows(initial: CaseStudyMetric[]): Row[] {
  if (initial.length === 0) return [EMPTY_ROW];
  return initial.map((m) => ({
    label: m.label,
    value: m.value,
    timeframe: m.timeframe ?? "",
    unit: m.unit ?? "",
  }));
}

export function MetricsEditor({ name, initial = [], heading = "Metrics" }: Props) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initial));

  const clean: CaseStudyMetric[] = rows
    .filter((r) => r.label.trim() && r.value.trim())
    .map((r) => ({
      label: r.label.trim(),
      value: r.value.trim(),
      ...(r.timeframe.trim() ? { timeframe: r.timeframe.trim() } : {}),
      ...(r.unit.trim() ? { unit: r.unit.trim() } : {}),
    }));

  function patch(i: number, next: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...next } : r)));
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-brand-navy">{heading}</span>
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={i} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
            <input
              className="form-input"
              placeholder="Label (e.g. Direct bookings)"
              value={row.label}
              onChange={(e) => patch(i, { label: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Value (e.g. 47 or +47)"
              value={row.value}
              onChange={(e) => patch(i, { value: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Timeframe (optional)"
              value={row.timeframe}
              onChange={(e) => patch(i, { timeframe: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Unit (optional, %)"
              value={row.unit}
              onChange={(e) => patch(i, { unit: e.target.value })}
            />
            <button
              type="button"
              aria-label="Remove metric"
              onClick={() => setRows((p) => (p.length === 1 ? [EMPTY_ROW] : p.filter((_, idx) => idx !== i)))}
              className="col-span-2 grid h-11 w-11 place-items-center justify-self-end rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 md:col-span-1"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setRows((p) => [...p, EMPTY_ROW])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add metric
      </button>
    </div>
  );
}
