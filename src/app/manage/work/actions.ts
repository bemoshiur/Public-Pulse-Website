"use server";

// All work mutations live here. Every successful mutation MUST call
// updateTag(WORKS_TAG) so /work (and the homepage rail) picks up the
// change. See docs/CACHING.md.
//
// NOTE: there is no shared `@/app/manage/_lib/session` module in this repo.
// requireSession() is defined locally in every manage/*/actions.ts file
// (see case-studies/actions.ts, clients/actions.ts) — replicated here.

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { works, type CaseStudyMetric, type WorkMedia } from "@/db/schema";
import { WORKS_TAG, getWorkById, slugExists } from "@/lib/data/works";
import { workMediaArraySchema } from "@/lib/media";
import { pingIndexNow } from "@/lib/indexnow";
import { SITE } from "@/lib/site";
import { isDisciplineSlug } from "@/lib/taxonomies/disciplines";
import { getService } from "@/lib/services";
import { getIndustry } from "@/lib/taxonomies/industries";
import { getLocation } from "@/lib/taxonomies/locations";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/manage/sign-in");
}

// ─── Parsing helpers ───────────────────────────────────────────────────

/** serviceSlugs / disciplines / deliverables all arrive as JSON-encoded
 *  arrays from client-side editors (CheckboxGroup, RepeatableEditor) via
 *  hidden inputs — never free text typed by the admin. Malformed input
 *  (only reachable via devtools tampering, not the real UI) degrades to
 *  an empty array rather than throwing, matching RepeatableEditor's
 *  own defensive JSON.stringify contract. */
function jsonArray(raw: string | undefined): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const MetricArray = z.array(
  z.object({
    label: z.string().min(1).max(80),
    value: z.string().min(1).max(40),
    timeframe: z.string().max(80).optional(),
    unit: z.string().max(20).optional(),
  })
);

/** z.coerce.number() turns an empty string into 0 (Number("") === 0)
 *  BEFORE .optional() ever runs, so leaving the Year field blank would
 *  fail .min(2000) instead of being treated as "not set". Preprocess
 *  strips blanks to undefined first. */
const optionalYear = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.coerce.number().int().min(2000).max(2100).optional()
);

// Catalog-backed validation for the fields that drive filter chips and
// related-work matching. Free text here is exactly what silently breaks
// those features on the legacy case-studies table — see docs/JOURNEY.md.
const workSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  locale: z.enum(["en", "bn"]).default("en"),
  title: z.string().min(1, "Title is required.").max(200),
  tagline: z.string().max(300).optional().or(z.literal("")),
  clientId: z.string().uuid().optional().or(z.literal("")),
  confidentiality: z.enum(["named", "anonymised"]),
  anonLabel: z.string().max(160).optional().or(z.literal("")),
  year: optionalYear,
  windowLabel: z.string().max(60).optional().or(z.literal("")),
  industrySlug: z.string().optional().or(z.literal("")),
  locationSlug: z.string().optional().or(z.literal("")),
  summary: z.string().min(1, "Summary is required.").max(900),
  context: z.string().max(3000).optional().or(z.literal("")),
  approach: z.string().max(3000).optional().or(z.literal("")),
  outcome: z.string().max(3000).optional().or(z.literal("")),
  liveUrl: z.string().url("Enter a full URL, e.g. https://example.com").max(500).optional().or(z.literal("")),
  adLibraryUrl: z
    .string()
    .url("Enter a full URL, e.g. https://example.com")
    .max(500)
    .optional()
    .or(z.literal("")),
  testimonialQuote: z.string().max(1500).optional().or(z.literal("")),
  testimonialAttribution: z.string().max(200).optional().or(z.literal("")),
  testimonialRole: z.string().max(200).optional().or(z.literal("")),
  caseStudySlug: z.string().max(120).optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  seoTitle: z.string().max(80).optional().or(z.literal("")),
  seoDescription: z.string().max(200).optional().or(z.literal("")),
});

/** MediaUploader seeds every freshly-uploaded asset with alt:"" (it can't
 *  know the alt text yet). workMediaSchema requires alt.min(1), so saving
 *  before filling it in is the single most likely validation failure on
 *  this form — give it a specific, actionable message instead of a raw
 *  zod dump. */
function parseMedia(raw: string | undefined): WorkMedia[] {
  let json: unknown;
  try {
    json = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Media could not be read. Remove the affected image and re-upload it.");
  }
  const result = workMediaArraySchema.safeParse(json);
  if (!result.success) {
    const missingAlt = result.error.issues.some((i) => i.path[i.path.length - 1] === "alt");
    if (missingAlt) {
      throw new Error(
        "Every uploaded image needs alt text before you can save (it's required for accessibility and SEO). Scroll to the Media section and fill in the alt text field for each image."
      );
    }
    throw new Error("One of the uploaded images is invalid. Remove it and re-upload.");
  }
  return result.data;
}

/** Defense-in-depth mirror of MetricsEditor's own filtering — the UI never
 *  emits an incomplete row, so this should only fire on tampered input. */
function parseMetrics(raw: string | undefined): CaseStudyMetric[] {
  let json: unknown;
  try {
    json = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Metrics could not be read. Remove the row and re-add it.");
  }
  const result = MetricArray.safeParse(json);
  if (!result.success) {
    throw new Error("Metrics could not be read. Remove the row and re-add it.");
  }
  return result.data;
}

async function parse(formData: FormData, excludeId?: string) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = workSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${String(i.path[0])}: ${i.message}`).join("; "));
  }
  const p = parsed.data;

  if (await slugExists(p.slug, p.locale, excludeId)) {
    throw new Error(`Slug "${p.slug}" is already used for locale "${p.locale}". Choose another.`);
  }
  if (p.confidentiality === "anonymised" && !p.anonLabel?.trim()) {
    throw new Error(`An anonymised work needs an anonymous label (e.g. "A Cox's Bazar resort").`);
  }

  const serviceSlugs = jsonArray(raw.serviceSlugs).filter((s) => Boolean(getService(s)));
  const disciplines = jsonArray(raw.disciplines).filter(isDisciplineSlug);
  const deliverables = jsonArray(raw.deliverables);
  const metrics = parseMetrics(raw.metrics);
  const media = parseMedia(raw.media);

  const isPublished = p.status === "published";
  // Preserve the original publishedAt across edits to an already-published
  // work — otherwise a typo fix would silently bump its "went live" date
  // every time it's saved. togglePublishWork below applies the same rule.
  const existing = excludeId ? await getWorkById(excludeId) : null;

  return {
    slug: p.slug,
    locale: p.locale,
    title: p.title,
    tagline: p.tagline || null,
    clientId: p.clientId || null,
    confidentiality: p.confidentiality,
    anonLabel: p.anonLabel || null,
    year: p.year ?? null,
    windowLabel: p.windowLabel || null,
    industrySlug: p.industrySlug && getIndustry(p.industrySlug) ? p.industrySlug : null,
    locationSlug: p.locationSlug && getLocation(p.locationSlug) ? p.locationSlug : null,
    serviceSlugs,
    disciplines,
    summary: p.summary,
    context: p.context || null,
    approach: p.approach || null,
    outcome: p.outcome || null,
    deliverables,
    metrics,
    media,
    liveUrl: p.liveUrl || null,
    adLibraryUrl: p.adLibraryUrl || null,
    testimonialQuote: p.testimonialQuote || null,
    testimonialAttribution: p.testimonialAttribution || null,
    testimonialRole: p.testimonialRole || null,
    caseStudySlug: p.caseStudySlug || null,
    featured: p.featured,
    displayOrder: p.displayOrder,
    status: p.status,
    // status is the single source of truth for publication — keep the
    // boolean column in sync on every write.
    published: isPublished,
    publishedAt: isPublished ? existing?.publishedAt ?? new Date() : null,
    updatedAt: new Date(),
  };
}

function refreshPublic(slug?: string) {
  updateTag(WORKS_TAG);
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
  const urls = [`${SITE.url}/work`];
  if (slug) urls.push(`${SITE.url}/work/${slug}`);
  void pingIndexNow(urls).catch(() => {});
}

export async function createWork(formData: FormData): Promise<void> {
  await requireSession();
  const values = await parse(formData);
  await db.insert(works).values(values);
  refreshPublic(values.slug);
  redirect("/manage/work");
}

export async function updateWork(id: string, formData: FormData): Promise<void> {
  await requireSession();
  const values = await parse(formData, id);
  await db.update(works).set(values).where(eq(works.id, id));
  refreshPublic(values.slug);
  redirect("/manage/work");
}

export async function deleteWork(id: string): Promise<void> {
  await requireSession();
  const existing = await getWorkById(id);
  await db.delete(works).where(eq(works.id, id));
  refreshPublic(existing?.slug);
  redirect("/manage/work");
}

export async function togglePublishWork(id: string): Promise<void> {
  await requireSession();
  const existing = await getWorkById(id);
  if (!existing) redirect("/manage/work");
  const next = existing.status === "published" ? "draft" : "published";
  await db
    .update(works)
    .set({
      status: next,
      published: next === "published",
      publishedAt: next === "published" ? existing.publishedAt ?? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(works.id, id));
  refreshPublic(existing.slug);
  redirect("/manage/work");
}
