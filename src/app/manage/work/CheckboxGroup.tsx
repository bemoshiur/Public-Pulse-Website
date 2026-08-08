"use client";

import { useState } from "react";

// Multi-select taxonomy picker (serviceSlugs / disciplines) that serializes
// to a JSON array in a hidden input — same "client island inside a plain
// <form action>" contract as RepeatableEditor / MediaUploader. Chips instead
// of a raw <select multiple> so the admin doesn't need ctrl/cmd-click to
// pick more than one, and so selections are catalog-backed by construction
// (the option list IS the catalog — there's no way to type free text here).

type Option = { slug: string; label: string };
type Props = { name: string; label: string; options: Option[]; initial?: string[] };

export function CheckboxGroup({ name, label, options, initial = [] }: Props) {
  const [selected, setSelected] = useState<string[]>(initial);

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-brand-navy">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(selected)} />
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.slug);
          return (
            <label
              key={opt.slug}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                checked
                  ? "border-brand-orange bg-brand-orange/10 text-brand-navy"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(opt.slug)} />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
