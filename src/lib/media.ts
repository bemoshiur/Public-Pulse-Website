import { z } from "zod";
import { randomUUID } from "node:crypto";

/** Hard upload ceiling — 8 MB per file (spec §2). */
export const MEDIA_MAX_BYTES = 8 * 1024 * 1024;

/** Server-enforced MIME allowlist. Video is embed-only (YouTube/Vimeo),
 *  never uploaded — see the spec's non-goals. */
export const MEDIA_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export type UploadRequest = { contentType: string; size: number; filename: string };
export type UploadValidation = { ok: true } | { ok: false; error: string };

export function validateUploadRequest(input: UploadRequest): UploadValidation {
  if (!MEDIA_ALLOWED_MIME.has(input.contentType)) {
    return { ok: false, error: `Unsupported type "${input.contentType}". Use JPEG, PNG, WebP or AVIF.` };
  }
  if (!Number.isFinite(input.size) || input.size <= 0) {
    return { ok: false, error: "File is empty." };
  }
  if (input.size > MEDIA_MAX_BYTES) {
    return { ok: false, error: "File is larger than 8 MB. Compress it and try again." };
  }
  return { ok: true };
}

/** `works/<slug>/<uuid>.<ext>` — slug is sanitised so a crafted value can
 *  never escape the prefix. */
export function buildObjectKey(workSlug: string, filename: string): string {
  const safeSlug = workSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") || "untitled";
  const dot = filename.lastIndexOf(".");
  const rawExt = dot > -1 ? filename.slice(dot + 1).toLowerCase() : "";
  const ext = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : "bin";
  return `works/${safeSlug}/${randomUUID()}.${ext}`;
}

export function extensionForMime(mime: string): string {
  return EXT_BY_MIME[mime] ?? "bin";
}

/** Runtime shape of a WorkMedia entry.
 *
 *  width/height are REQUIRED (not optional-with-refine) so the inferred type
 *  matches the `WorkMedia` column type in src/db/schema.ts exactly — an
 *  optional here would make `workMediaArraySchema.parse()` unassignable to
 *  the jsonb column in the admin action. Video assets store their intrinsic
 *  frame size (e.g. 1920×1080); the uploader supplies it. */
export const workMediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  url: z.string().url(),
  alt: z.string().min(1),
  caption: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  role: z.enum(["hero", "gallery"]),
  provider: z.enum(["s3", "youtube", "vimeo"]).optional(),
  poster: z.string().url().optional(),
});

export const workMediaArraySchema = z.array(workMediaSchema);
