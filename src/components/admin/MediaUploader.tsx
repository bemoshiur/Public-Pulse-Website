"use client";

import { useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import type { WorkMedia } from "@/db/schema";

// Drag/drop → presign → PUT → read natural dimensions → store MediaAsset JSON.
// Dimensions are captured HERE because next/image needs width/height to
// reserve space (CLS budget = 0).
//
// Posts through a hidden input (JSON string) rather than a client-side
// fetch-to-save flow — this component lives inside the project's existing
// plain-<form action={serverAction}> pattern (see CaseStudyForm.tsx), so the
// server action reads the final asset list the same way it reads any other
// field.

type Props = { name: string; workSlug: string; initial?: WorkMedia[] };

export function MediaUploader({ name, workSlug, initial = [] }: Props) {
  const [items, setItems] = useState<WorkMedia[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function readDimensions(file: File): Promise<{ width: number; height: number }> {
    const url = URL.createObjectURL(file);
    try {
      const img = new window.Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("Could not read image dimensions."));
        img.src = url;
      });
      return { width: img.naturalWidth, height: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const { width, height } = await readDimensions(file);

        const res = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            workSlug,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof data.error === "string" ? data.error : `Could not start upload (${res.status}).`
          );
        }
        if (!data.uploadUrl || !data.publicUrl) {
          throw new Error("Upload server returned an unexpected response.");
        }

        const put = await fetch(data.uploadUrl, {
          method: "PUT",
          headers: { "content-type": file.type },
          body: file,
        });
        if (!put.ok) throw new Error(`"${file.name}" was rejected by storage (${put.status}).`);

        setItems((prev) => [
          ...prev,
          {
            kind: "image",
            url: data.publicUrl,
            alt: "",
            width,
            height,
            role: prev.length === 0 ? "hero" : "gallery",
            provider: "s3",
          },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function patch(i: number, next: Partial<WorkMedia>) {
    setItems((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...next } : m)));
  }

  function makeHero(i: number) {
    setItems((prev) => prev.map((m, idx) => ({ ...m, role: idx === i ? "hero" : "gallery" })));
  }

  function remove(i: number) {
    setItems((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      // Keep exactly one hero when one exists. If the removed asset was the
      // hero, promote the new first item so the list never ends up with
      // zero heroes (or, impossible by construction, more than one).
      if (next.length > 0 && !next.some((m) => m.role === "hero")) {
        next[0] = { ...next[0], role: "hero" };
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-panel border border-dashed border-ink/25 bg-paper-alt p-8 text-center">
        <UploadCloud className="h-6 w-6 text-ink/50" aria-hidden />
        <span className="text-sm font-semibold text-ink">
          {busy ? "Uploading…" : "Click to upload images"}
        </span>
        <span className="text-meta text-ink/55">JPEG, PNG, WebP or AVIF · max 8 MB each</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            void handleFiles(e.target.files);
            // Allow re-selecting the same file after a failed/removed upload.
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-brand-orange">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((m, i) => (
            <li key={m.url} className="flex gap-4 rounded-panel bg-paper-alt p-4">
              {/* Admin-only upload thumbnail — not public content imagery,
                  no CLS budget here. next/image is not required. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" className="h-20 w-28 flex-shrink-0 rounded object-cover" />
              <div className="flex-1 space-y-2">
                <input
                  className="form-input"
                  placeholder="Alt text (required for accessibility + SEO)"
                  value={m.alt}
                  onChange={(e) => patch(i, { alt: e.target.value })}
                />
                <input
                  className="form-input"
                  placeholder="Caption (optional)"
                  value={m.caption ?? ""}
                  onChange={(e) => patch(i, { caption: e.target.value })}
                />
                <div className="flex items-center gap-3 text-meta text-ink/55">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name={`${name}-hero`}
                      checked={m.role === "hero"}
                      onChange={() => makeHero(i)}
                    />
                    Hero
                  </label>
                  <span>
                    {m.width}×{m.height}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="ml-auto inline-flex items-center gap-1 text-brand-orange"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
