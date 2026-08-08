"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Replaces the raw-JSON textareas that currently throw unstyled server
// exceptions on a missing comma (see CaseStudyForm.tsx's metricsJson /
// faqJson textareas). Renders one text row per array entry; the author
// never types JSON — this component serializes to it behind a hidden input,
// same contract as MediaUploader.
//
// Blank rows are dropped from the serialized value (not saved as empty
// strings) but kept in local UI state so a half-typed row doesn't vanish
// out from under the author while they're still typing it.

type Props = { name: string; label: string; initial?: string[]; placeholder?: string };

export function RepeatableEditor({ name, label, initial = [], placeholder }: Props) {
  const [rows, setRows] = useState<string[]>(initial.length ? initial : [""]);
  const clean = rows.map((r) => r.trim()).filter(Boolean);

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={i} className="flex gap-2">
            <input
              className="form-input"
              placeholder={placeholder}
              value={row}
              onChange={(e) => setRows((p) => p.map((r, idx) => (idx === i ? e.target.value : r)))}
            />
            <button
              type="button"
              aria-label="Remove row"
              onClick={() => setRows((p) => (p.length === 1 ? [""] : p.filter((_, idx) => idx !== i)))}
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-paper-alt text-ink/60"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setRows((p) => [...p, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add
      </button>
    </div>
  );
}
