# Client Works (`/work`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a dedicated, dynamic, detail-rich client-works showcase at `/work` — backed by a real S3 upload pipeline so it can actually be filled — and repair the sibling `/case-studies` system so the two operate as a complementary pair.

**Architecture:** Three tables (`clients`, `works`, plus additive columns on `case_studies`) behind the project's established `unstable_cache` + tag-invalidation data layer. Media lives in an SST-provisioned S3 bucket, uploaded via a `requireSession()`-gated presign route, and is stored as a nullable `MediaAsset[]` JSONB column so a numbers-only work is a valid record. Public pages reuse the Dataplace primitives (`Section`/`GreyPanel`/`ScrollReveal`/`CountUp`) and are prerendered with an SSR-visible grid.

**Tech Stack:** Next.js 16 App Router · TypeScript strict · Drizzle + Neon Postgres · Zod 4 · SST v3 / OpenNext on AWS · Tailwind v3 · `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (new)

**Spec:** [docs/superpowers/specs/2026-08-09-client-works-section-design.md](../specs/2026-08-09-client-works-section-design.md)

---

## Global Constraints

Every task's requirements implicitly include this section.

**Verification model — read this first.** This repo has **no test runner** (0 test files; no vitest/jest/playwright config; `package.json` scripts are `dev`, `build`, `start`, `typecheck`, `generate:llms`). Thirty shipped steps were verified with type-check + build + SSR-HTML greps + live curl. This plan follows that established pattern rather than unilaterally introducing a test framework. Concretely:

- **Pure logic** (validators, parsers, catalog lookups) gets an executable assertion script at `scripts/verify-<thing>.ts`, run with `npx tsx` — `tsx` is already a dependency, so this adds nothing. These scripts use `node:assert/strict` and exit non-zero on failure. Write the script FIRST, watch it fail, then implement.
- **Integration** (pages, routes, schema output) is verified by `npm run build` + greps against the built SSR HTML in `.next/server/app/*.html`.
- **Runtime** (upload, redirects) is verified with `npx next start` + `curl`.

**Non-negotiables carried from the project:**

- **SEO gate on every public page**, checked in built HTML: exactly one `<h1>`, `.answer-block[data-speakable]` present, `application/ld+json` present, `rel="canonical"` present.
- **No raw 404s.** An unknown `/work/<slug>` must `permanentRedirect("/work")` (308). Never `notFound()`.
- **Real-only content.** Testimonials render only when quote AND attribution both exist. No fabricated ratings — `reviewSchema` stays rating-free.
- **Public pages never query the DB directly.** Always go through the cached accessors in `src/lib/data/*` (see `docs/CACHING.md`).
- **Never `revalidate: false`** in a data layer (documented stuck-empty-cache bug class). Use `revalidate: 60`.
- **Versioned cache keys** — `works:published-v1` etc. Bump the version on any shape change.
- **CLS budget is 0.** Every image renders through `next/image` with explicit `width`/`height`.
- **Media is optional at every level.** A work with zero media must render as a deliberate typographic page, never a broken one.
- **Catalog-backed taxonomy.** `industrySlug`/`locationSlug`/`serviceSlugs`/`disciplines` validate against the typed catalogs — never free text.
- `npm run typecheck` clean and `npm run build` green before every commit.
- Work on branch `feat/client-works`, branched from current `HEAD`. Do not deploy until Task 14.

**Exact values from the spec:**

- Upload limits: MIME allowlist `image/jpeg | image/png | image/webp | image/avif`; **max 8 MB per file**; presigned URL TTL **5 minutes**; object key pattern `works/<workSlug>/<uuid>.<ext>`.
- `confidentiality` is `'named' | 'anonymised'`. When `anonymised`, render `anonLabel` and suppress the client logo.
- Works ordering: `displayOrder ASC, publishedAt DESC` (note: the existing case-studies table sorts DESC — that is a bug fixed in Task 13).
- Publish gating: single source of truth `status === 'published'`, with the `published` boolean kept in sync on write.

---

## File Structure

**Create:**

| Path | Responsibility |
|---|---|
| `src/lib/taxonomies/disciplines.ts` | Typed discipline catalog (branding, film, campaign, social, paid, web) |
| `src/lib/data/works.ts` | Cached read layer for works + `WORKS_TAG` |
| `src/lib/data/clients.ts` | Cached read layer for clients |
| `src/lib/media.ts` | `MediaAsset` type + zod schema + upload constraint validators (pure) |
| `src/app/api/media/presign/route.ts` | Auth-gated S3 presign endpoint |
| `src/components/admin/MediaUploader.tsx` | Client-side drag/drop uploader |
| `src/components/admin/RepeatableEditor.tsx` | Generic add/remove row editor (metrics, deliverables) |
| `src/components/work/MediaFrame.tsx` | Aspect-ratio-safe `next/image` wrapper (CLS 0) |
| `src/components/work/Gallery.tsx` | Gallery grid + lightbox |
| `src/components/work/WorkCard.tsx` | Grid card — media-led or typographic fallback |
| `src/components/work/WorksFilter.tsx` | SSR-safe filter (renders full grid, toggles visibility) |
| `src/app/work/page.tsx` | `/work` index |
| `src/app/work/[slug]/page.tsx` | `/work/[slug]` detail |
| `src/app/manage/work/*` | Works CRUD (page, new, [id], actions, WorkForm) |
| `src/app/manage/clients/*` | Clients CRUD (page, new, [id], actions, ClientForm) |
| `scripts/verify-media.ts` | Assertion script for media validators |
| `scripts/verify-disciplines.ts` | Assertion script for the discipline catalog |

**Modify:**

| Path | Change |
|---|---|
| `src/db/schema.ts` | Add `clients`, `works` tables + `clientId`/`workSlug` on `case_studies` |
| `src/lib/schema.ts` | Add `creativeWorkSchema()` |
| `next.config.ts:9-17` | Add `images.remotePatterns` |
| `sst.config.ts` | Add `sst.aws.Bucket` + link to `Web` |
| `src/app/sitemap.ts` | Add `/work` + work detail URLs |
| `src/lib/llms.ts` | Add `## Client work` section |
| `src/lib/site-search.ts` | Add `kind: 'work'` |
| `src/components/layout/Header.tsx` · `Footer.tsx` | Nav entry for `/work` |
| `src/app/manage/layout.tsx` | Manage-nav entries |
| `src/app/services/[slug]/page.tsx` · `locations/[city]` · `industries/[industry]` | Inbound proof rails |
| `src/app/case-studies/*` · `src/lib/data/case-studies.ts` | Task 13 repairs |

---

## Task 1: Discipline catalog + database schema

**Files:**
- Create: `src/lib/taxonomies/disciplines.ts`
- Create: `scripts/verify-disciplines.ts`
- Modify: `src/db/schema.ts` (append after the `CaseStudyMetric` type block, ~line 146)

**Interfaces:**
- Produces: `DISCIPLINES: Discipline[]`, `getDiscipline(slug): Discipline | undefined`, `isDisciplineSlug(slug): boolean`
- Produces: `clients`, `works` Drizzle tables; types `Client`/`NewClient`/`Work`/`NewWork`; `WorkMedia` type
- Consumes: existing `CaseStudyMetric` type from `src/db/schema.ts`

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-disciplines.ts`:

```ts
import assert from "node:assert/strict";
import { DISCIPLINES, getDiscipline, isDisciplineSlug } from "../src/lib/taxonomies/disciplines";

assert.ok(DISCIPLINES.length >= 6, "expected at least 6 disciplines");
const slugs = DISCIPLINES.map((d) => d.slug);
assert.equal(new Set(slugs).size, slugs.length, "discipline slugs must be unique");
for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `slug not kebab-case: ${s}`);
assert.equal(getDiscipline("branding")?.name, "Branding");
assert.equal(getDiscipline("nope"), undefined);
assert.equal(isDisciplineSlug("film"), true);
assert.equal(isDisciplineSlug("nope"), false);
console.log("✓ disciplines catalog OK");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/verify-disciplines.ts`
Expected: FAIL — `Cannot find module '../src/lib/taxonomies/disciplines'`

- [ ] **Step 3: Create the catalog**

Create `src/lib/taxonomies/disciplines.ts`:

```ts
// Craft/discipline taxonomy for /work. Mirrors the shape of
// taxonomies/locations.ts + industries.ts so filters and validation
// behave identically across the site.

export type Discipline = {
  slug: string;
  /** Display name for chips + meta strip. */
  name: string;
  /** One-line description used in filter tooltips + llms.txt. */
  blurb: string;
};

export const DISCIPLINES: Discipline[] = [
  { slug: "branding", name: "Branding", blurb: "Identity, logo systems, brand guidelines and positioning." },
  { slug: "campaign", name: "Campaign", blurb: "Integrated multi-channel campaigns with a single narrative." },
  { slug: "social", name: "Social", blurb: "Always-on social content, community and channel management." },
  { slug: "paid", name: "Paid media", blurb: "Meta, Google and YouTube buying with ROAS accountability." },
  { slug: "film", name: "Film & motion", blurb: "Video, reels, motion graphics and on-location production." },
  { slug: "web", name: "Web", blurb: "Websites, landing pages and conversion-focused builds." },
];

export const getDiscipline = (slug: string): Discipline | undefined =>
  DISCIPLINES.find((d) => d.slug === slug);

export const isDisciplineSlug = (slug: string): boolean =>
  DISCIPLINES.some((d) => d.slug === slug);
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx tsx scripts/verify-disciplines.ts`
Expected: `✓ disciplines catalog OK`

- [ ] **Step 5: Add the `clients` and `works` tables**

In `src/db/schema.ts`, append after the `CaseStudyMetric` type block. Reuse the imports already at the top of the file (`pgTable`, `uuid`, `text`, `jsonb`, `boolean`, `integer`, `timestamp`, `index`, `uniqueIndex`, `sql`):

```ts
// ─── Clients (shared by works + case studies) ─────────────────────────
// A real client identity record. Replaces the dead `case_studies.logo_url`
// column and enables the logo wall, "more work for this client" rails, and
// a client Organization node in JSON-LD.

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    /** Logo for light surfaces. Optional — anonymised work has none. */
    logoUrl: text("logo_url"),
    /** Optional inverted logo for dark panels. */
    logoDarkUrl: text("logo_dark_url"),
    website: text("website"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("clients_slug_idx").on(t.slug),
  })
);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// ─── Works (the /work portfolio) ──────────────────────────────────────
// Visual-led counterpart to case_studies. EVERY media field is nullable:
// a numbers-only work is a valid, complete record (see the spec's
// "Mixed" content decision).

export const works = pgTable(
  "works",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull(),
    locale: text("locale").notNull().default("en"),
    title: text("title").notNull(),
    tagline: text("tagline"),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "restrict" }),
    /** 'named' renders client.name + logo; 'anonymised' renders anonLabel only. */
    confidentiality: text("confidentiality").notNull().default("named"),
    anonLabel: text("anon_label"),
    year: integer("year"),
    windowLabel: text("window_label"),
    industrySlug: text("industry_slug"),
    locationSlug: text("location_slug"),
    serviceSlugs: jsonb("service_slugs").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    disciplines: jsonb("disciplines").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    /** Card copy + AnswerBlock source. 40-60 words. */
    summary: text("summary").notNull(),
    context: text("context"),
    approach: text("approach"),
    outcome: text("outcome"),
    deliverables: jsonb("deliverables").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    metrics: jsonb("metrics").$type<CaseStudyMetric[]>().notNull().default(sql`'[]'::jsonb`),
    media: jsonb("media").$type<WorkMedia[]>().notNull().default(sql`'[]'::jsonb`),
    liveUrl: text("live_url"),
    adLibraryUrl: text("ad_library_url"),
    testimonialQuote: text("testimonial_quote"),
    testimonialAttribution: text("testimonial_attribution"),
    testimonialRole: text("testimonial_role"),
    /** Cross-link to the metrics-led counterpart at /case-studies/<slug>. */
    caseStudySlug: text("case_study_slug"),
    featured: boolean("featured").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    status: text("status").notNull().default("draft"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugLocaleIdx: uniqueIndex("works_slug_locale_idx").on(t.slug, t.locale),
    publishedIdx: index("works_published_idx").on(t.published, t.displayOrder),
    statusIdx: index("works_status_idx").on(t.status, t.publishedAt.desc()),
    featuredIdx: index("works_featured_idx").on(t.featured, t.displayOrder),
    clientIdx: index("works_client_idx").on(t.clientId),
  })
);

export type Work = typeof works.$inferSelect;
export type NewWork = typeof works.$inferInsert;

/** A single media asset on a work. `width`/`height` are REQUIRED on images
 *  so next/image can reserve space — the CLS budget is 0. */
export type WorkMedia = {
  kind: "image" | "video";
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  role: "hero" | "gallery";
  provider?: "s3" | "youtube" | "vimeo";
  poster?: string;
};
```

- [ ] **Step 6: Add the cross-link columns to `case_studies`**

In `src/db/schema.ts`, inside the existing `caseStudies` column block, add after `logoUrl`:

```ts
    /** Client identity record (replaces the flat logo_url/client_name pair). */
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
    /** Reverse cross-link to the visual counterpart at /work/<slug>. */
    workSlug: text("work_slug"),
```

- [ ] **Step 7: Type-check**

Run: `npm run typecheck`
Expected: exits 0, no output.

Note: `WorkMedia` is referenced by the `works` table before its `type` declaration — this is legal because TypeScript type declarations hoist.

- [ ] **Step 8: Apply the schema to the database**

Run: `DATABASE_URL_DIRECT="<neon direct url>" npx drizzle-kit push --force`
Expected: creates `clients` + `works` and adds two columns to `case_studies`. Additive only — no DROP, no ALTER COLUMN.

- [ ] **Step 9: Commit**

```bash
git add src/lib/taxonomies/disciplines.ts scripts/verify-disciplines.ts src/db/schema.ts
git commit -m "feat(work): discipline catalog + clients/works tables"
```

---

## Task 2: Media pipeline — S3 bucket, presign route, image config

**Files:**
- Create: `src/lib/media.ts`
- Create: `scripts/verify-media.ts`
- Create: `src/app/api/media/presign/route.ts`
- Modify: `sst.config.ts` (secrets block ~line 113, `Web` component ~line 119)
- Modify: `next.config.ts:9-17` (images) and the CSP header block

**Interfaces:**
- Consumes: `WorkMedia` from `src/db/schema.ts`; `requireSession()` from the existing manage auth helper
- Produces: `MEDIA_MAX_BYTES`, `MEDIA_ALLOWED_MIME`, `validateUploadRequest(input)`, `buildObjectKey(workSlug, filename)`, `workMediaSchema` (zod)
- Produces: `POST /api/media/presign` → `{ uploadUrl: string; publicUrl: string; key: string }`

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-media.ts`:

```ts
import assert from "node:assert/strict";
import {
  MEDIA_MAX_BYTES,
  MEDIA_ALLOWED_MIME,
  validateUploadRequest,
  buildObjectKey,
  workMediaSchema,
} from "../src/lib/media";

assert.equal(MEDIA_MAX_BYTES, 8 * 1024 * 1024, "max upload must be 8 MB");
assert.deepEqual([...MEDIA_ALLOWED_MIME].sort(), [
  "image/avif", "image/jpeg", "image/png", "image/webp",
]);

// rejects oversize
let r = validateUploadRequest({ contentType: "image/png", size: MEDIA_MAX_BYTES + 1, filename: "a.png" });
assert.equal(r.ok, false);
assert.match(r.ok === false ? r.error : "", /8 MB/);

// rejects disallowed mime
r = validateUploadRequest({ contentType: "image/gif", size: 100, filename: "a.gif" });
assert.equal(r.ok, false);

// rejects empty
r = validateUploadRequest({ contentType: "image/png", size: 0, filename: "a.png" });
assert.equal(r.ok, false);

// accepts valid
r = validateUploadRequest({ contentType: "image/webp", size: 1024, filename: "a.webp" });
assert.equal(r.ok, true);

// object key: namespaced, uuid'd, extension preserved, traversal-safe
const key = buildObjectKey("cox-resort", "My Photo (1).PNG");
assert.match(key, /^works\/cox-resort\/[0-9a-f-]{36}\.png$/, `bad key: ${key}`);
assert.ok(!buildObjectKey("../../etc", "x.png").includes(".."), "must not allow traversal");

// zod schema requires dimensions on images
assert.equal(workMediaSchema.safeParse({
  kind: "image", url: "https://x/y.png", alt: "a", role: "hero",
}).success, false, "image without width/height must fail");
assert.equal(workMediaSchema.safeParse({
  kind: "image", url: "https://x/y.png", alt: "a", role: "hero", width: 1200, height: 630,
}).success, true);

console.log("✓ media validators OK");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/verify-media.ts`
Expected: FAIL — `Cannot find module '../src/lib/media'`

- [ ] **Step 3: Implement the validators**

Create `src/lib/media.ts`:

```ts
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
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx tsx scripts/verify-media.ts`
Expected: `✓ media validators OK`

- [ ] **Step 5: Install the AWS SDK packages**

Run: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`

- [ ] **Step 6: Provision the bucket in SST**

In `sst.config.ts`, inside `async run()` before the `const web = new sst.aws.Nextjs("Web", {` line:

```ts
    // Public-read media bucket for /work portfolio assets. Uploaded via the
    // presigned PUT at /api/media/presign (admin-auth gated).
    const media = new sst.aws.Bucket("Media", { access: "public" });
```

Then add `media` to the `Web` component's `link` array (alongside the existing secrets), and add to its `environment`:

```ts
        NEXT_PUBLIC_MEDIA_HOST: media.domain,
```

- [ ] **Step 7: Add `remotePatterns` and CSP allowances**

In `next.config.ts`, inside the `images` block (after `localPatterns`), add:

```ts
    // Portfolio media lives in the SST-provisioned S3 bucket. Without this,
    // next/image HARD-ERRORS on any remote src — the bug that made the old
    // case-study heroImageUrl field a trap rather than a broken image.
    remotePatterns: [
      { protocol: "https", hostname: "*.s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
    ],
```

In the CSP header value in the same file, extend `img-src` to include `https://*.s3.amazonaws.com https://*.s3.ap-southeast-1.amazonaws.com` (it already has a broad `https:` token — verify and only add if that token was tightened), and leave `frame-src` unchanged (video embeds are out of scope this pass).

- [ ] **Step 8: Implement the presign route**

Create `src/app/api/media/presign/route.ts`:

```ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validateUploadRequest, buildObjectKey } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Presigned URL lifetime — 5 minutes (spec §2). */
const PRESIGN_TTL_SECONDS = 300;

export async function POST(request: Request) {
  // Admin-only. Same session gate the /manage surfaces use.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; contentType?: string; size?: number; workSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { filename = "", contentType = "", size = 0, workSlug = "untitled" } = body;
  const check = validateUploadRequest({ filename, contentType, size });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const key = buildObjectKey(workSlug, filename);
  const bucket = Resource.Media.name;
  const client = new S3Client({});

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: PRESIGN_TTL_SECONDS }
  );

  const host = process.env.NEXT_PUBLIC_MEDIA_HOST ?? `${bucket}.s3.amazonaws.com`;
  return NextResponse.json({ uploadUrl, publicUrl: `https://${host}/${key}`, key });
}
```

- [ ] **Step 9: Verify types and build**

Run: `npm run typecheck && npm run build`
Expected: typecheck exits 0; build green with `/api/media/presign` listed as a dynamic route (`ƒ`).

- [ ] **Step 10: Verify the route rejects unauthenticated callers**

Run:
```bash
npx next start -p 3178 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3178/api/media/presign \
  -H 'content-type: application/json' \
  -d '{"filename":"a.png","contentType":"image/png","size":1024,"workSlug":"demo"}'
kill %1
```
Expected: `401`

- [ ] **Step 11: Commit**

```bash
git add src/lib/media.ts scripts/verify-media.ts src/app/api/media/presign/route.ts \
        sst.config.ts next.config.ts package.json package-lock.json
git commit -m "feat(work): S3 media pipeline — presign route, bucket, remotePatterns"
```

---

## Task 3: Cached data layer for works + clients

**Files:**
- Create: `src/lib/data/works.ts`
- Create: `src/lib/data/clients.ts`

**Interfaces:**
- Consumes: `works`, `clients`, `Work`, `Client` from `src/db/schema.ts`
- Produces: `WORKS_TAG = "works"`, `CLIENTS_TAG = "clients"`
- Produces: `getPublishedWorks(locale?)`, `getFeaturedWorks(locale?, limit?)`, `getWorkBySlug(slug, locale?)`, `getRelatedWorks(excludeSlug, opts, limit?)`, `getWorksByService(serviceSlug, limit?)`, `getWorksByIndustry(industrySlug, limit?)`, `getWorksByLocation(locationSlug, limit?)`, `listAllWorks()`, `getWorkById(id)`
- Produces: `getClients()`, `getClientsWithLogos()`, `listAllClients()`, `getClientById(id)`

- [ ] **Step 1: Create the clients read layer**

Create `src/lib/data/clients.ts`:

```ts
// Tagged cached read layer for clients. Public pages MUST use these
// accessors — never db.select() directly (docs/CACHING.md).

import { unstable_cache } from "next/cache";
import { asc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, type Client } from "@/db/schema";

export const CLIENTS_TAG = "clients";

export const getClients = unstable_cache(
  async (): Promise<Client[]> => {
    try {
      return await db.select().from(clients).orderBy(asc(clients.name));
    } catch (err) {
      console.warn("[clients] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["clients:all-v1"],
  { tags: [CLIENTS_TAG], revalidate: 60 }
);

/** Clients that have a logo — drives the "trusted by" wall. */
export const getClientsWithLogos = unstable_cache(
  async (): Promise<Client[]> => {
    try {
      return await db.select().from(clients).where(isNotNull(clients.logoUrl)).orderBy(asc(clients.name));
    } catch (err) {
      console.warn("[clients] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["clients:with-logos-v1"],
  { tags: [CLIENTS_TAG], revalidate: 60 }
);

// ─── Admin-only (uncached) ───────────────────────────────────────────
export async function listAllClients(): Promise<Client[]> {
  return db.select().from(clients).orderBy(asc(clients.name));
}

export async function getClientById(id: string): Promise<Client | null> {
  const rows = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return rows[0] ?? null;
}
```

- [ ] **Step 2: Create the works read layer**

Create `src/lib/data/works.ts`:

```ts
// Tagged cached read layer for works (/work portfolio).
//
// PUBLIC pages MUST go through these accessors. Direct db.select() from a
// page or layout is a bug — see docs/CACHING.md.
//
// /manage CRUD writes invalidate with updateTag('works').

import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { works, clients, type Work, type Client } from "@/db/schema";

export const WORKS_TAG = "works";

/** Seed rows must never reach a public surface (same guard as case studies). */
const isSeedSlug = (slug: string) => slug.startsWith("seed-");

export type WorkWithClient = Work & { client: Client | null };

/** status is the single source of truth for publication (the case_studies
 *  published/status split is a known ambiguity — fixed in Task 13). */
const publishedWhere = (locale: "en" | "bn") =>
  and(eq(works.status, "published"), eq(works.locale, locale));

async function selectWithClient(where: ReturnType<typeof publishedWhere>) {
  const rows = await db
    .select({ work: works, client: clients })
    .from(works)
    .leftJoin(clients, eq(works.clientId, clients.id))
    .where(where)
    // ASC display order: an unedited row (default 0) sorts FIRST, not last.
    .orderBy(asc(works.displayOrder), desc(works.publishedAt));
  return rows.map((r) => ({ ...r.work, client: r.client })).filter((w) => !isSeedSlug(w.slug));
}

export const getPublishedWorks = unstable_cache(
  async (locale: "en" | "bn" = "en"): Promise<WorkWithClient[]> => {
    try {
      return await selectWithClient(publishedWhere(locale));
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:published-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getFeaturedWorks = unstable_cache(
  async (locale: "en" | "bn" = "en", limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere(locale));
      const featured = all.filter((w) => w.featured);
      return (featured.length > 0 ? featured : all).slice(0, limit);
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:featured-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorkBySlug = unstable_cache(
  async (slug: string, locale: "en" | "bn" = "en"): Promise<WorkWithClient | null> => {
    if (isSeedSlug(slug)) return null;
    try {
      const rows = await db
        .select({ work: works, client: clients })
        .from(works)
        .leftJoin(clients, eq(works.clientId, clients.id))
        .where(and(eq(works.slug, slug), eq(works.locale, locale)))
        .limit(1);
      const row = rows[0];
      if (!row || row.work.status !== "published") return null;
      return { ...row.work, client: row.client };
    } catch (err) {
      console.warn("[works] DB unavailable — returning null.", err instanceof Error ? err.message : err);
      return null;
    }
  },
  ["works:by-slug-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

/** Editorial "related": same client first, then shared discipline/industry. */
export const getRelatedWorks = unstable_cache(
  async (
    excludeSlug: string,
    opts: { clientId?: string | null; industrySlug?: string | null; disciplines?: string[] },
    limit = 3
  ): Promise<WorkWithClient[]> => {
    try {
      const all = (await selectWithClient(publishedWhere("en"))).filter((w) => w.slug !== excludeSlug);
      const score = (w: WorkWithClient) => {
        let s = 0;
        if (opts.clientId && w.clientId === opts.clientId) s += 3;
        if (opts.industrySlug && w.industrySlug === opts.industrySlug) s += 2;
        if (opts.disciplines?.some((d) => w.disciplines.includes(d))) s += 1;
        return s;
      };
      return all
        .map((w) => ({ w, s: score(w) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map((x) => x.w);
    } catch (err) {
      console.warn("[works] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["works:related-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

/** Inbound proof rails — closes the "nothing links in" gap. */
export const getWorksByService = unstable_cache(
  async (serviceSlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.serviceSlugs.includes(serviceSlug)).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-service-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorksByIndustry = unstable_cache(
  async (industrySlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.industrySlug === industrySlug).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-industry-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

export const getWorksByLocation = unstable_cache(
  async (locationSlug: string, limit = 3): Promise<WorkWithClient[]> => {
    try {
      const all = await selectWithClient(publishedWhere("en"));
      return all.filter((w) => w.locationSlug === locationSlug).slice(0, limit);
    } catch {
      return [];
    }
  },
  ["works:by-location-v1"],
  { tags: [WORKS_TAG], revalidate: 60 }
);

// ─── Admin-only (uncached) ───────────────────────────────────────────
export async function listAllWorks(): Promise<Work[]> {
  return db.select().from(works).orderBy(asc(works.displayOrder), desc(works.updatedAt));
}

export async function getWorkById(id: string): Promise<Work | null> {
  const rows = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Slug collision check for the admin form (avoids a raw Postgres error). */
export async function slugExists(slug: string, locale: "en" | "bn", excludeId?: string): Promise<boolean> {
  const rows = await db
    .select({ id: works.id })
    .from(works)
    .where(
      excludeId
        ? and(eq(works.slug, slug), eq(works.locale, locale), ne(works.id, excludeId))
        : and(eq(works.slug, slug), eq(works.locale, locale))
    )
    .limit(1);
  return rows.length > 0;
}
```

- [ ] **Step 3: Type-check**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: Verify the resilience contract (no DATABASE_URL → empty, not a crash)**

Run: `npm run build`
Expected: green. The build runs without a DB connection; the try/catch in each accessor must return `[]`/`null` rather than failing the build.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/works.ts src/lib/data/clients.ts
git commit -m "feat(work): cached data layer for works + clients"
```

---

## Task 4: `creativeWorkSchema` JSON-LD builder

**Files:**
- Modify: `src/lib/schema.ts` (append near `articleSchema`, after line ~360)

**Interfaces:**
- Consumes: `SITE` from `src/lib/site.ts`, `absoluteUrl`, and the existing `ORGANIZATION_ID` / `@id` conventions in the file
- Produces: `creativeWorkSchema(input: CreativeWorkInput)` returning a JSON-LD object

- [ ] **Step 1: Add the builder**

In `src/lib/schema.ts`, following the conventions already used by `articleSchema` (stable `@id`, `provider` cross-ref, `speakable`):

```ts
export type CreativeWorkInput = {
  slug: string;
  name: string;
  description: string;
  /** Client display name — omitted entirely when the work is anonymised. */
  clientName?: string;
  clientUrl?: string;
  datePublished?: string;
  /** Absolute or site-relative image URLs (hero first). */
  images?: { url: string; width: number; height: number; caption?: string }[];
  keywords?: string[];
  serviceSlugs?: string[];
};

/** CreativeWork for a /work portfolio piece. The client is emitted as a
 *  distinct Organization node so answer engines can resolve "who did this
 *  for whom"; `provider` cross-links the site Organization @id. */
export function creativeWorkSchema(input: CreativeWorkInput) {
  const url = absoluteUrl(`/work/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#creativework`,
    url,
    name: input.name,
    headline: input.name,
    description: input.description,
    inLanguage: "en",
    ...(input.datePublished && { datePublished: input.datePublished }),
    // Disciplines + the services delivered both act as keywords — this is the
    // only consumer of input.serviceSlugs, so it is not a dead parameter.
    ...(() => {
      const kw = [...(input.keywords ?? []), ...(input.serviceSlugs ?? [])];
      return kw.length ? { keywords: kw.join(", ") } : {};
    })(),
    provider: { "@id": SITE.organizationId },
    creator: { "@id": SITE.organizationId },
    ...(input.clientName && {
      about: {
        "@type": "Organization",
        name: input.clientName,
        ...(input.clientUrl && { url: input.clientUrl }),
      },
    }),
    ...(input.images?.length && {
      image: input.images.map((img) => ({
        "@type": "ImageObject",
        url: img.url.startsWith("http") ? img.url : absoluteUrl(img.url),
        width: img.width,
        height: img.height,
        ...(img.caption && { caption: img.caption }),
      })),
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".answer-block"],
    },
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}
```

Note: use whatever the file's existing constant is for the Organization `@id` (it is referenced by `articleSchema` as `publisher`); match it exactly rather than introducing `SITE.organizationId` if that name differs.

- [ ] **Step 2: Type-check**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/schema.ts
git commit -m "feat(work): creativeWorkSchema JSON-LD builder"
```

---

## Task 5: Media display primitives

**Files:**
- Create: `src/components/work/MediaFrame.tsx`
- Create: `src/components/work/Gallery.tsx`

**Interfaces:**
- Consumes: `WorkMedia` from `src/db/schema.ts`
- Produces: `<MediaFrame media priority? className? sizes?>`, `<Gallery items={WorkMedia[]}>`

- [ ] **Step 1: Create `MediaFrame`**

Create `src/components/work/MediaFrame.tsx`:

```tsx
import Image from "next/image";
import type { WorkMedia } from "@/db/schema";

// Aspect-ratio-safe media wrapper. width/height always come from the stored
// asset, so the browser reserves space before load — CLS budget stays 0.

type Props = {
  media: WorkMedia;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function MediaFrame({ media, priority = false, className = "", sizes = "100vw" }: Props) {
  if (media.kind === "video") {
    const src =
      media.provider === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${media.url}`
        : media.provider === "vimeo"
        ? `https://player.vimeo.com/video/${media.url}`
        : media.url;
    return (
      <div className={`relative overflow-hidden rounded-panel bg-paper-alt ${className}`}>
        <div className="aspect-video">
          <iframe
            src={src}
            title={media.alt}
            loading="lazy"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-panel bg-paper-alt ${className}`}>
      <Image
        src={media.url}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full object-cover"
      />
      {media.caption && (
        <figcaption className="px-4 py-3 text-meta text-ink/55">{media.caption}</figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: Create `Gallery`**

Create `src/components/work/Gallery.tsx`. It is a client component (lightbox state) that renders every image in the SSR output so crawlers see them:

```tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { WorkMedia } from "@/db/schema";
import { MediaFrame } from "./MediaFrame";

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
```

- [ ] **Step 3: Type-check and build**

Run: `npm run typecheck && npm run build`
Expected: typecheck exits 0; build green.

- [ ] **Step 4: Commit**

```bash
git add src/components/work/MediaFrame.tsx src/components/work/Gallery.tsx
git commit -m "feat(work): MediaFrame + Gallery display primitives"
```

---

## Task 6: `/work` index page (SSR-visible grid)

**Files:**
- Create: `src/components/work/WorkCard.tsx`
- Create: `src/components/work/WorksFilter.tsx`
- Create: `src/app/work/page.tsx`

**Interfaces:**
- Consumes: `getPublishedWorks`, `getClientsWithLogos`, `DISCIPLINES`, `MediaFrame`, `Section`/`GreyPanel`/`Container`/`ScrollReveal`, `buildMetadata`, `collectionPageSchema`, `itemListSchema`, `breadcrumbSchema`, `AnswerBlock`
- Produces: `<WorkCard work>`, `<WorksFilter works disciplines>`; the route `/work`

**Critical constraint:** the current `/case-studies` grid is invisible to crawlers because `<Suspense fallback={null}>` + `useSearchParams()` makes Next skip prerendering it. `WorksFilter` must therefore **render every card in the server HTML** and filter by toggling CSS visibility with local state — no `useSearchParams`, no Suspense boundary around the grid.

- [ ] **Step 1: Create `WorkCard`**

Create `src/components/work/WorkCard.tsx`. Media-led when a hero asset exists; typographic fallback otherwise (the "Mixed" requirement):

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WorkWithClient } from "@/lib/data/works";
import { MediaFrame } from "./MediaFrame";

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
          <p className="mt-2 text-meta uppercase tracking-wider text-ink/55">
            {headlineMetric?.label ?? work.windowLabel ?? "Case"}
          </p>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {clientLabel && (
          <p className="text-meta uppercase tracking-wider text-ink/55">{clientLabel}</p>
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
```

- [ ] **Step 2: Create the SSR-safe `WorksFilter`**

Create `src/components/work/WorksFilter.tsx`:

```tsx
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
```

- [ ] **Step 3: Create the index route**

Create `src/app/work/page.tsx`. Mirror the structure of `src/app/case-studies/page.tsx` for metadata/JSON-LD, but with the inset-panel hero used across the Dataplace restyle:

```tsx
import type { Metadata } from "next";
import Image from "next/image";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { InlineBlock } from "@/components/lead-capture";
import { WorksFilter } from "@/components/work/WorksFilter";
import { getPublishedWorks } from "@/lib/data/works";
import { getClientsWithLogos } from "@/lib/data/clients";
import { DISCIPLINES } from "@/lib/taxonomies/disciplines";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Work | Public Pulse — Bangladesh campaigns, brands & content",
  description:
    "Selected client work from Public Pulse Agency — campaigns, brand systems, social, paid media and film for Bangladeshi brands, candidates and hospitality businesses.",
  path: "/work",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

export default async function WorkIndexPage() {
  const [works, logoClients] = await Promise.all([getPublishedWorks("en"), getClientsWithLogos()]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            path: "/work",
            name: "Public Pulse client work",
            description: "Selected client work from Public Pulse Agency in Bangladesh.",
            items: works.map((w) => ({ url: `/work/${w.slug}`, name: w.title })),
          }),
          itemListSchema(
            "Public Pulse client work",
            works.map((w) => ({ url: `/work/${w.slug}`, name: w.title }))
          ),
        ]}
      />

      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 px-6 py-12 md:px-12 md:py-16">
            <div className="max-w-3xl">
              <span className="chip chip-orange">Work</span>
              <h1 className="mt-5 text-h1 tracking-tight text-ink">
                The work, <span className="text-brand-orange">in the open</span>.
              </h1>
              <p className="mt-5 text-lead text-ink/70">
                Campaigns, brand systems, social, paid media and film for Bangladeshi brands. Where a
                client is under NDA we show the outcome without the name.
              </p>
            </div>
          </GreyPanel>
          <div className="mt-6 max-w-3xl">
            <AnswerBlock>
              Public Pulse Agency&rsquo;s client work spans political campaigns, hospitality, e-commerce
              and brand building across Bangladesh. Each project below lists the client (or an
              anonymised sector label under NDA), the services delivered, the work itself, and the
              measured outcome where the client permits publication.
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {logoClients.length > 0 && (
        <Section size="sm" className="bg-paper">
          <Container>
            <p className="text-center text-meta uppercase tracking-wider text-ink/55">Trusted by</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {logoClients.map((c) => (
                <li key={c.id}>
                  <Image
                    src={c.logoUrl as string}
                    alt={c.name}
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain opacity-70"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section size="lg" className="bg-paper">
        <Container>
          {works.length === 0 ? (
            <div className="rounded-panel border border-dashed border-ink/20 bg-paper-alt p-10 text-center">
              <p className="text-ink/55">
                Selected work is being prepared for publication — check back shortly.
              </p>
            </div>
          ) : (
            <WorksFilter works={works} disciplines={DISCIPLINES} />
          )}
        </Container>
      </Section>

      <Section size="sm" className="bg-paper">
        <Container>
          <InlineBlock context="service" />
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Build and verify the SEO gate**

Run:
```bash
npm run typecheck && npm run build
H=.next/server/app/work.html
printf "H1=%s answer=%s ld=%s canon=%s\n" \
  "$(grep -oc '<h1' $H)" "$(grep -oc 'answer-block' $H)" \
  "$(grep -oc 'application/ld+json' $H)" "$(grep -oc 'rel=\"canonical\"' $H)"
```
Expected: `H1=1 answer=1 ld=3 canon=1` (ld count ≥1 is the gate; 3 blocks are emitted).

- [ ] **Step 5: Commit**

```bash
git add src/components/work/WorkCard.tsx src/components/work/WorksFilter.tsx src/app/work/page.tsx
git commit -m "feat(work): /work index with SSR-visible grid"
```

---

## Task 7: `/work/[slug]` detail page

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getWorkBySlug`, `getPublishedWorks`, `getRelatedWorks`, `creativeWorkSchema`, `breadcrumbSchema`, `reviewSchema`, `MediaFrame`, `Gallery`, `CountUp`, `getService`/`getIndustry`/`getLocation`, `getDiscipline`
- Produces: the route `/work/[slug]`

- [ ] **Step 1: Create the route**

Create `src/app/work/[slug]/page.tsx`:

```tsx
import { permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, creativeWorkSchema, reviewSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GreyPanel } from "@/components/ui/GreyPanel";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { CountUp } from "@/components/ui/CountUp";
import { MediaFrame } from "@/components/work/MediaFrame";
import { Gallery } from "@/components/work/Gallery";
import { getWorkBySlug, getPublishedWorks, getRelatedWorks } from "@/lib/data/works";
import { getDiscipline } from "@/lib/taxonomies/disciplines";
import { getService } from "@/lib/services";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const works = await getPublishedWorks("en");
  return works.map((w) => ({ slug: w.slug }));
}

// dynamicParams=true + redirect-on-miss: an unknown slug 308s to the hub
// instead of 404ing (project-wide crawl rule; see JOURNEY STEP 28).
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  const client =
    work.confidentiality === "anonymised" ? work.anonLabel ?? "" : work.client?.name ?? "";
  return buildMetadata({
    title: work.seoTitle ?? `${work.title} | Public Pulse Work`,
    description: work.seoDescription ?? work.summary,
    path: `/work/${work.slug}`,
    ogType: "article",
    useDynamicOg: true,
    ogTitle: work.title,
    ogEyebrow: client ? client.toUpperCase() : "CLIENT WORK",
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) permanentRedirect("/work");

  const related = await getRelatedWorks(work.slug, {
    clientId: work.clientId,
    industrySlug: work.industrySlug,
    disciplines: work.disciplines,
  });

  const isAnon = work.confidentiality === "anonymised";
  const clientLabel = isAnon ? work.anonLabel ?? "Confidential client" : work.client?.name ?? "";
  const hero = work.media.find((m) => m.role === "hero") ?? work.media[0];
  const gallery = work.media.filter((m) => m !== hero);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: work.title, path: `/work/${work.slug}` },
  ];

  return (
    <article>
      <JsonLd
        data={[
          creativeWorkSchema({
            slug: work.slug,
            name: work.title,
            description: work.summary,
            // Client identity is suppressed entirely when anonymised.
            clientName: isAnon ? undefined : work.client?.name,
            clientUrl: isAnon ? undefined : work.client?.website ?? undefined,
            datePublished: work.publishedAt ? new Date(work.publishedAt).toISOString() : undefined,
            images: work.media
              .filter((m) => m.kind === "image")
              .map((m) => ({ url: m.url, width: m.width, height: m.height, caption: m.caption })),
            keywords: work.disciplines.map((d) => getDiscipline(d)?.name ?? d),
            serviceSlugs: work.serviceSlugs,
          }),
          breadcrumbSchema(crumbs),
          // Review only when BOTH quote and attribution are real (rating-free).
          ...(work.testimonialQuote && work.testimonialAttribution
            ? [
                reviewSchema({
                  itemName: work.title,
                  reviewBody: work.testimonialQuote,
                  authorName: work.testimonialAttribution,
                }),
              ]
            : []),
        ]}
      />

      {/* HERO — media-led when present, typographic when not */}
      <Section size="sm" className="bg-paper">
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <GreyPanel tone="tint" radius="lg" className="mt-6 overflow-hidden">
            <div className="px-6 py-12 md:px-12 md:py-14">
              <div className="max-w-3xl">
                {clientLabel && (
                  <p className="text-meta uppercase tracking-wider text-ink/55">{clientLabel}</p>
                )}
                <h1 className="mt-4 text-h1 tracking-tight text-ink">{work.title}</h1>
                {work.tagline && <p className="mt-5 text-lead text-ink/70">{work.tagline}</p>}
              </div>
            </div>
            {hero && <MediaFrame media={hero} priority className="rounded-none" sizes="100vw" />}
          </GreyPanel>

          {/* Meta strip */}
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/12 pt-8 md:grid-cols-4">
            {work.year && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">Year</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{work.year}</dd>
              </div>
            )}
            {work.disciplines.length > 0 && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">Disciplines</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">
                  {work.disciplines.map((d) => getDiscipline(d)?.name ?? d).join(" · ")}
                </dd>
              </div>
            )}
            {work.serviceSlugs.length > 0 && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">Services</dt>
                <dd className="mt-1.5 flex flex-wrap gap-x-2 text-sm font-medium text-ink">
                  {work.serviceSlugs.map((s) => {
                    const svc = getService(s);
                    return svc ? (
                      <Link key={s} href={`/services/${s}`} className="underline underline-offset-4 hover:text-brand-orange">
                        {svc.shortName}
                      </Link>
                    ) : null;
                  })}
                </dd>
              </div>
            )}
            {work.windowLabel && (
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">Window</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{work.windowLabel}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 max-w-3xl">
            <AnswerBlock question={`What did Public Pulse do for ${clientLabel || "this client"}?`}>
              {work.summary}
            </AnswerBlock>
          </div>
        </Container>
      </Section>

      {/* NARRATIVE */}
      {(work.context || work.approach || work.outcome) && (
        <Section size="lg" className="bg-paper">
          <Container>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {[
                ["Context", work.context],
                ["Approach", work.approach],
                ["Outcome", work.outcome],
              ]
                .filter(([, body]) => Boolean(body))
                .map(([label, body]) => (
                  <div key={label as string}>
                    <h2 className="text-h3 font-bold text-ink">{label}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{body}</p>
                  </div>
                ))}
            </div>
          </Container>
        </Section>
      )}

      {/* METRICS */}
      {work.metrics.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <GreyPanel tone="alt" radius="lg" className="px-6 py-12 md:px-12">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {work.metrics.map((m) => (
                  <li key={m.label}>
                    <CountUp
                      value={m.value}
                      className="block font-pr-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-tight text-ink"
                    />
                    <div className="mt-3 text-meta uppercase text-ink/55">{m.label}</div>
                    {m.timeframe && <div className="mt-1 text-meta text-ink/40">{m.timeframe}</div>}
                  </li>
                ))}
              </ul>
            </GreyPanel>
          </Container>
        </Section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <Section size="lg" className="bg-paper">
          <Container>
            <h2 className="sr-only">Gallery</h2>
            <Gallery items={gallery} />
          </Container>
        </Section>
      )}

      {/* DELIVERABLES */}
      {work.deliverables.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h2 tracking-tight text-ink">What we shipped.</h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {work.deliverables.map((d) => (
                  <li key={d} className="rounded-panel bg-paper-alt p-4 text-sm text-ink">{d}</li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* TESTIMONIAL — real only */}
      {work.testimonialQuote && work.testimonialAttribution && (
        <Section size="lg" className="bg-paper">
          <Container>
            <figure className="mx-auto max-w-3xl rounded-panel bg-paper-alt p-8 md:p-12">
              <blockquote className="font-pr-serif text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-ink">
                &ldquo;{work.testimonialQuote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-ink/70">
                <span className="font-bold text-ink">{work.testimonialAttribution}</span>
                {work.testimonialRole && <span> · {work.testimonialRole}</span>}
              </figcaption>
            </figure>
          </Container>
        </Section>
      )}

      {/* CROSS-LINKS */}
      {(work.caseStudySlug || work.liveUrl || work.adLibraryUrl) && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-wrap gap-3">
              {work.caseStudySlug && (
                <Link href={`/case-studies/${work.caseStudySlug}`} className="btn btn-secondary">
                  See the numbers
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              {work.liveUrl && (
                <a href={work.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Visit the live work
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
              {work.adLibraryUrl && (
                <a href={work.adLibraryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Meta Ad Library
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <Section size="lg" className="bg-paper">
          <Container>
            <div className="max-w-3xl border-t border-ink/15 pt-8">
              <h2 className="text-h2 tracking-tight text-ink">More work.</h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/work/${r.slug}`} className="card group flex h-full flex-col">
                    <h3 className="text-h3 font-bold text-ink">{r.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{r.summary}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                      View work
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section size="lg" className="bg-paper">
        <Container>
          <GreyPanel tone="ink" radius="lg" className="px-6 py-20 text-center md:px-16 md:py-24">
            <h2 className="mx-auto max-w-4xl text-display leading-[0.98] tracking-tight text-paper">
              Want work like this?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lead text-white/70">
              Free 30-minute consultation. We&rsquo;ll review your goals and tell you honestly whether
              we&rsquo;re the right fit.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/contact" className="btn btn-orange group">
                Start a project
                <ArrowCircle onDark />
              </Link>
            </div>
          </GreyPanel>
        </Container>
      </Section>
    </article>
  );
}
```

- [ ] **Step 2: Verify `reviewSchema`'s actual parameter names**

Run: `grep -n "export function reviewSchema" -A 12 src/lib/schema.ts`
Adjust the `reviewSchema({...})` call in Step 1 to match the real input type exactly (the existing case-study detail page calls it — copy that call shape).

- [ ] **Step 3: Build and verify redirect-on-miss**

Run:
```bash
npm run typecheck && npm run build
npx next start -p 3178 &
sleep 8
curl -s -o /dev/null -w "unknown slug: %{http_code}\n" http://localhost:3178/work/zzz-nope
curl -s -o /dev/null -w "index: %{http_code}\n" http://localhost:3178/work
kill %1
```
Expected: `unknown slug: 308`, `index: 200`. **Never 404.**

- [ ] **Step 4: Commit**

```bash
git add src/app/work/\[slug\]/page.tsx
git commit -m "feat(work): /work/[slug] detail page with 308-on-miss"
```

---

## Task 8: Admin — media uploader + repeatable editor

**Files:**
- Create: `src/components/admin/MediaUploader.tsx`
- Create: `src/components/admin/RepeatableEditor.tsx`

**Interfaces:**
- Consumes: `POST /api/media/presign`, `WorkMedia`
- Produces: `<MediaUploader name workSlug initial?>` (writes a JSON string into a hidden input named `name`), `<RepeatableEditor name label initial? placeholder?>` (writes a JSON string array)

- [ ] **Step 1: Create `MediaUploader`**

Create `src/components/admin/MediaUploader.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import type { WorkMedia } from "@/db/schema";

// Drag/drop → presign → PUT → read natural dimensions → store MediaAsset JSON.
// Dimensions are captured HERE because next/image needs width/height to
// reserve space (CLS budget = 0).

type Props = { name: string; workSlug: string; initial?: WorkMedia[] };

export function MediaUploader({ name, workSlug, initial = [] }: Props) {
  const [items, setItems] = useState<WorkMedia[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function readDimensions(file: File): Promise<{ width: number; height: number }> {
    const url = URL.createObjectURL(file);
    try {
      const img = new window.Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed.");

        const put = await fetch(data.uploadUrl, {
          method: "PUT",
          headers: { "content-type": file.type },
          body: file,
        });
        if (!put.ok) throw new Error(`Upload rejected (${put.status}).`);

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
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function patch(i: number, next: Partial<WorkMedia>) {
    setItems((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...next } : m)));
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
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm font-semibold text-brand-orange">{error}</p>}

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((m, i) => (
            <li key={m.url} className="flex gap-4 rounded-panel bg-paper-alt p-4">
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
                      onChange={() =>
                        setItems((prev) =>
                          prev.map((x, idx) => ({ ...x, role: idx === i ? "hero" : "gallery" }))
                        )
                      }
                    />
                    Hero
                  </label>
                  <span>{m.width}×{m.height}</span>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
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
```

- [ ] **Step 2: Create `RepeatableEditor`**

Create `src/components/admin/RepeatableEditor.tsx` — replaces the raw-JSON textareas that currently throw unstyled server exceptions on a missing comma:

```tsx
"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
```

- [ ] **Step 3: Type-check and build**

Run: `npm run typecheck && npm run build`
Expected: typecheck exits 0; build green.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/MediaUploader.tsx src/components/admin/RepeatableEditor.tsx
git commit -m "feat(admin): media uploader + repeatable field editor"
```

---

## Task 9: Admin — clients CRUD

**Files:**
- Create: `src/app/manage/clients/page.tsx`, `actions.ts`, `ClientForm.tsx`, `new/page.tsx`, `[id]/page.tsx`
- Modify: `src/app/manage/layout.tsx` (nav)

**Interfaces:**
- Consumes: `listAllClients`, `getClientById`, `CLIENTS_TAG`, existing `requireSession()` helper, `MediaUploader` (for logo)
- Produces: `createClient(formData)`, `updateClient(id, formData)`, `deleteClient(id)`

- [ ] **Step 1: Read the existing pattern to mirror exactly**

Run: `sed -n '1,80p' src/app/manage/case-studies/actions.ts`
Copy its structure: `"use server"`, `requireSession()` at the top of every action, Zod parse, `refreshPublic()`, `redirect()`.

- [ ] **Step 2: Create the actions**

Create `src/app/manage/clients/actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { CLIENTS_TAG } from "@/lib/data/clients";
import { requireSession } from "@/app/manage/_lib/session";

const clientSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  name: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  logoDarkUrl: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = clientSchema.parse(raw);
  return {
    slug: parsed.slug,
    name: parsed.name,
    logoUrl: parsed.logoUrl || null,
    logoDarkUrl: parsed.logoDarkUrl || null,
    website: parsed.website || null,
  };
}

function refreshPublic() {
  updateTag(CLIENTS_TAG);
  revalidatePath("/work");
}

export async function createClient(formData: FormData) {
  await requireSession();
  await db.insert(clients).values(parse(formData));
  refreshPublic();
  redirect("/manage/clients");
}

export async function updateClient(id: string, formData: FormData) {
  await requireSession();
  await db.update(clients).set({ ...parse(formData), updatedAt: new Date() }).where(eq(clients.id, id));
  refreshPublic();
  redirect("/manage/clients");
}

export async function deleteClient(id: string) {
  await requireSession();
  await db.delete(clients).where(eq(clients.id, id));
  refreshPublic();
  redirect("/manage/clients");
}
```

Note: confirm the real import path of `requireSession` (Step 1 shows it) and match it; if the manage layout inlines the session check instead, replicate that exact approach.

- [ ] **Step 3: Create the list, form, new and edit pages**

Mirror `src/app/manage/case-studies/` structure exactly:
- `page.tsx` — `await requireSession()`, `listAllClients()`, table of name/slug/logo with Edit links and a `ConfirmButton` delete (reuse `src/app/manage/_components/ConfirmButton.tsx`).
- `ClientForm.tsx` — plain form posting to the bound action, fields: `slug`, `name`, `logoUrl`, `logoDarkUrl`, `website`, using the existing `Field` helper + `.form-input` class.
- `new/page.tsx` — renders `<ClientForm action={createClient} />`.
- `[id]/page.tsx` — `getClientById(id)`, renders `<ClientForm action={updateClient.bind(null, id)} initial={client} />`.

- [ ] **Step 4: Add the manage-nav entry**

In `src/app/manage/layout.tsx`, add `{ href: "/manage/clients", label: "Clients" }` to the nav array alongside the existing `/manage/case-studies` entry.

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run build`
Expected: typecheck exits 0; build green with `/manage/clients` listed as dynamic (`ƒ`).

- [ ] **Step 6: Commit**

```bash
git add src/app/manage/clients src/app/manage/layout.tsx
git commit -m "feat(admin): clients CRUD"
```

---

## Task 10: Admin — works CRUD

**Files:**
- Create: `src/app/manage/work/page.tsx`, `actions.ts`, `WorkForm.tsx`, `new/page.tsx`, `[id]/page.tsx`
- Modify: `src/app/manage/layout.tsx` (nav)

**Interfaces:**
- Consumes: `listAllWorks`, `getWorkById`, `slugExists`, `WORKS_TAG`, `listAllClients`, `MediaUploader`, `RepeatableEditor`, `workMediaArraySchema`, `SERVICES`, `INDUSTRIES`, `LOCATIONS`, `DISCIPLINES`
- Produces: `createWork(formData)`, `updateWork(id, formData)`, `deleteWork(id)`, `togglePublishWork(id)`

- [ ] **Step 1: Create the actions with catalog validation**

Create `src/app/manage/work/actions.ts`:

```ts
"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { works } from "@/db/schema";
import { WORKS_TAG, getWorkById, slugExists } from "@/lib/data/works";
import { workMediaArraySchema } from "@/lib/media";
import { requireSession } from "@/app/manage/_lib/session";
import { pingIndexNow } from "@/lib/indexnow";
import { SITE } from "@/lib/site";
import { isDisciplineSlug } from "@/lib/taxonomies/disciplines";
import { getService } from "@/lib/services";
import { getIndustry } from "@/lib/taxonomies/industries";
import { getLocation } from "@/lib/taxonomies/locations";

// Catalog-backed validation. Free-text taxonomy is what silently breaks
// filter chips and related-work matching on the legacy case-studies table.
const jsonArray = (raw: string): string[] => {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

const workSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  locale: z.enum(["en", "bn"]).default("en"),
  title: z.string().min(1),
  tagline: z.string().optional(),
  clientId: z.string().uuid().optional().or(z.literal("")),
  confidentiality: z.enum(["named", "anonymised"]),
  anonLabel: z.string().optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  windowLabel: z.string().optional(),
  industrySlug: z.string().optional(),
  locationSlug: z.string().optional(),
  summary: z.string().min(1),
  context: z.string().optional(),
  approach: z.string().optional(),
  outcome: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  adLibraryUrl: z.string().url().optional().or(z.literal("")),
  testimonialQuote: z.string().optional(),
  testimonialAttribution: z.string().optional(),
  testimonialRole: z.string().optional(),
  caseStudySlug: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

async function parse(formData: FormData, excludeId?: string) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const p = workSchema.parse(raw);

  if (await slugExists(p.slug, p.locale, excludeId)) {
    throw new Error(`Slug "${p.slug}" is already used for locale "${p.locale}". Choose another.`);
  }
  if (p.confidentiality === "anonymised" && !p.anonLabel?.trim()) {
    throw new Error("An anonymised work needs an anonymous label (e.g. \"A Cox's Bazar resort\").");
  }

  const serviceSlugs = jsonArray(raw.serviceSlugs).filter((s) => Boolean(getService(s)));
  const disciplines = jsonArray(raw.disciplines).filter(isDisciplineSlug);
  const deliverables = jsonArray(raw.deliverables);

  let metrics: { label: string; value: string; timeframe?: string; unit?: string }[] = [];
  try {
    const parsedMetrics = JSON.parse(raw.metrics || "[]");
    if (Array.isArray(parsedMetrics)) metrics = parsedMetrics;
  } catch {
    throw new Error("Metrics could not be read. Remove the row and re-add it.");
  }

  const media = workMediaArraySchema.parse(JSON.parse(raw.media || "[]"));

  const isPublished = p.status === "published";
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
    // Keep the boolean in sync with status — status is the source of truth.
    published: isPublished,
    publishedAt: isPublished ? new Date() : null,
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

export async function createWork(formData: FormData) {
  await requireSession();
  const values = await parse(formData);
  await db.insert(works).values(values);
  refreshPublic(values.slug);
  redirect("/manage/work");
}

export async function updateWork(id: string, formData: FormData) {
  await requireSession();
  const values = await parse(formData, id);
  await db.update(works).set(values).where(eq(works.id, id));
  refreshPublic(values.slug);
  redirect("/manage/work");
}

export async function deleteWork(id: string) {
  await requireSession();
  const existing = await getWorkById(id);
  await db.delete(works).where(eq(works.id, id));
  refreshPublic(existing?.slug);
  redirect("/manage/work");
}

export async function togglePublishWork(id: string) {
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
```

- [ ] **Step 2: Create `WorkForm.tsx`**

A single form using: text inputs for slug/title/tagline/summary/context/approach/outcome; a `<select>` of clients from `listAllClients()`; a `<select>` for `confidentiality`; catalog `<select>`s for `industrySlug` and `locationSlug`; multi-checkbox groups for `serviceSlugs` and `disciplines` (each writing a JSON string into a hidden input via a small client component); `<RepeatableEditor name="deliverables" …>`; a metrics editor (label/value/timeframe rows writing JSON into `name="metrics"`); `<MediaUploader name="media" workSlug={slug} initial={initial?.media} />`; and status/featured/displayOrder/SEO fields.

- [ ] **Step 3: Create list / new / edit pages**

Mirror `src/app/manage/case-studies/{page,new/page,[id]/page}.tsx` exactly, substituting the works accessors and actions, and adding a "Publish/Unpublish" `ConfirmButton` wired to `togglePublishWork`.

- [ ] **Step 4: Add the manage-nav entry**

In `src/app/manage/layout.tsx`, add `{ href: "/manage/work", label: "Work" }`.

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run build`
Expected: typecheck exits 0; build green.

- [ ] **Step 6: Commit**

```bash
git add src/app/manage/work src/app/manage/layout.tsx
git commit -m "feat(admin): works CRUD with upload + catalog-backed taxonomy"
```

---

## Task 11: SEO wiring — sitemap, llms.txt, site search, nav

**Files:**
- Modify: `src/app/sitemap.ts`, `src/lib/llms.ts`, `src/lib/site-search.ts`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `getPublishedWorks`

- [ ] **Step 1: Add works to the sitemap**

In `src/app/sitemap.ts`, alongside the existing `getPublishedCaseStudies` block:

```ts
  const publishedWorks = await getPublishedWorks("en");
  const workEntries = publishedWorks.map((w) => ({
    url: absoluteUrl(`/work/${w.slug}`),
    lastModified: w.publishedAt ? new Date(w.publishedAt) : new Date(CATALOG_LASTMOD),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
```

Add `entry("/work", "monthly", 0.8)` to the static list and spread `...workEntries` into the returned array. Match the file's existing `entry()` helper signature.

- [ ] **Step 2: Add a works section to `llms.txt`**

In `src/lib/llms.ts`, add a `## Client work` section listing each published work as `- [<title>](/work/<slug>): <summary>`, and include the works in the full-text builder alongside `casesFull()`.

- [ ] **Step 3: Add works to site search**

In `src/lib/site-search.ts`, add a `kind: "work"` branch mapping published works to `{ title, url: /work/<slug>, excerpt: summary, kind: "work" }`, mirroring the existing `case-study` branch.

- [ ] **Step 4: Add nav entries**

In `src/components/layout/Header.tsx`, the `NAV` array currently maps `/case-studies` to the label `Work`. Change that entry to `{ href: "/work", label: "Work" }` and add `{ href: "/case-studies", label: "Results" }` so both surfaces are reachable and the labels match the editorial rule. In `Footer.tsx`, add a `Work` link to the Studio column above `Work`/`Case studies`.

- [ ] **Step 5: Verify**

Run:
```bash
npm run typecheck && npm run build
npx next start -p 3178 & sleep 8
curl -s http://localhost:3178/sitemap.xml | grep -c "/work"
kill %1
```
Expected: ≥1 (the `/work` index; detail URLs appear once works are published).

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/lib/llms.ts src/lib/site-search.ts src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(work): SEO wiring — sitemap, llms.txt, search, nav"
```

---

## Task 12: Inbound proof rails

**Files:**
- Modify: `src/app/services/[slug]/page.tsx`, `src/app/locations/[city]/page.tsx`, `src/app/industries/[industry]/page.tsx`

**Interfaces:**
- Consumes: `getWorksByService`, `getWorksByLocation`, `getWorksByIndustry`, `WorkCard`

- [ ] **Step 1: Add the rail to the service page**

In `src/app/services/[slug]/page.tsx`, after the existing "Practitioner guides" rail, fetch and render:

```tsx
  const serviceWorks = await getWorksByService(service.slug, 3);
```

```tsx
      {serviceWorks.length > 0 && (
        <Section size="md" className="bg-paper">
          <Container>
            <div className="max-w-3xl border-t border-ink/15 pt-8">
              <p className="text-eyebrow uppercase text-brand-orange">Proof</p>
              <h2 className="mt-4 text-h2 tracking-tight text-ink">
                {service.shortName} work we&rsquo;ve shipped.
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {serviceWorks.map((w) => (
                <li key={w.id}>
                  <WorkCard work={w} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
```

- [ ] **Step 2: Add the equivalent rails to locations and industries**

Same pattern with `getWorksByLocation(loc.slug, 3)` and `getWorksByIndustry(ind.slug, 3)`, each rendered inside the existing `ProgrammaticPage` children and gated on `length > 0`.

- [ ] **Step 3: Verify no SEO regression on the touched templates**

Run:
```bash
npm run build
for f in services/political-pr locations/dhaka industries/e-commerce; do
  H=".next/server/app/$f.html"
  printf "%-26s H1=%s answer=%s ld=%s canon=%s\n" "$f" \
    "$(grep -oc '<h1' $H)" "$(grep -oc 'answer-block' $H)" \
    "$(grep -oc 'application/ld+json' $H)" "$(grep -oc 'rel=\"canonical\"' $H)"
done
```
Expected: `H1=1` on each; answer/ld/canon unchanged from before the task.

- [ ] **Step 4: Commit**

```bash
git add src/app/services src/app/locations src/app/industries
git commit -m "feat(work): inbound proof rails on service/location/industry pages"
```

---

## Task 13: `/case-studies` repairs

**Files:**
- Modify: `src/components/case-studies/CaseStudiesFilter.tsx`, `src/app/case-studies/[slug]/page.tsx`, `src/app/case-studies/page.tsx`, `src/lib/data/case-studies.ts`, `src/app/manage/case-studies/{actions.ts,CaseStudyForm.tsx}`

- [ ] **Step 1: Make the grid SSR-visible**

In `src/app/case-studies/page.tsx`, remove the `<Suspense fallback={null}>` wrapper around `<CaseStudiesFilter />`. In `CaseStudiesFilter.tsx`, replace `useSearchParams()`/`router.replace()` filtering with local `useState` + CSS visibility toggling — the exact pattern used by `WorksFilter` in Task 6. This is what puts real `/case-studies/<slug>` anchors into the built HTML.

- [ ] **Step 2: Fix the ordering and publish-gating inconsistencies**

In `src/lib/data/case-studies.ts`: change `.orderBy(desc(caseStudies.displayOrder), …)` to `.orderBy(asc(caseStudies.displayOrder), desc(caseStudies.publishedAt))` in both `getPublishedCaseStudies` and `getFeaturedCaseStudies`; make `getCaseStudyBySlug` use the same publication predicate as the list accessors so a row cannot be reachable by URL while invisible in the index. **Bump all four cache keys `-v3` → `-v4`.**

- [ ] **Step 3: Convert unknown slugs to a 308**

In `src/app/case-studies/[slug]/page.tsx`, replace `notFound()` with `permanentRedirect("/case-studies")` and import `permanentRedirect` from `next/navigation`.

- [ ] **Step 4: Replace the JSON textareas**

In `src/app/manage/case-studies/CaseStudyForm.tsx`, swap the `metricsJson` and `faqJson` textareas for `<RepeatableEditor>`-style editors (metrics: label/value/timeframe rows; FAQ: q/a rows), each writing JSON into a hidden input so `actions.ts` keeps its current parsing contract.

- [ ] **Step 5: Catalog-back the taxonomy fields and render the logo**

In the same form, replace free-text `industry` / `location` / `servicesCsv` inputs with catalog-backed `<select>`s (`INDUSTRIES`, `LOCATIONS`, `SERVICES`) and add a `clientId` select. On the public detail page, render `client.logoUrl` via `next/image` when present.

- [ ] **Step 6: Verify**

Run:
```bash
npm run typecheck && npm run build
H=.next/server/app/case-studies.html
echo "crawlable detail links: $(grep -oc 'href=\"/case-studies/' $H)"
npx next start -p 3178 & sleep 8
curl -s -o /dev/null -w "unknown: %{http_code}\n" http://localhost:3178/case-studies/zzz-nope
kill %1
```
Expected: crawlable links ≥0 (and ≥1 once rows exist — the empty-state string must now appear in the HTML, which it currently does not); `unknown: 308`.

- [ ] **Step 7: Commit**

```bash
git add src/app/case-studies src/components/case-studies src/lib/data/case-studies.ts src/app/manage/case-studies
git commit -m "fix(case-studies): SSR-visible grid, 308-on-miss, ordering, catalog fields"
```

---

## Task 14: Full regression sweep and deploy

- [ ] **Step 1: Site-wide SSR gate**

```bash
npm run build
total=0; bad=0
while IFS= read -r H; do
  total=$((total+1))
  h1=$(grep -oc "<h1" "$H"); canon=$(grep -oc 'rel="canonical"' "$H")
  rel="${H#.next/server/app/}"
  if [ "$h1" != "1" ] || [ "$canon" = "0" ]; then echo "  ⚠ H1=$h1 canon=$canon $rel"; bad=$((bad+1)); fi
done < <(find .next/server/app -name "*.html" ! -name "404.html" ! -name "500.html" ! -name "_*.html")
echo "scanned $total · anomalies $bad"
```
Expected: the only anomalies are known redirect stubs (`/research`, `/book`, a pruned guide slug).

- [ ] **Step 2: Route matrix**

```bash
npx next start -p 3178 & sleep 8
for p in / /work /case-studies /services /contact /pricing; do
  printf "%-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3178$p)"; done
for p in /work/zzz /case-studies/zzz /services/zzz /group; do
  printf "%-20s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3178$p)"; done
kill %1
```
Expected: content pages `200`; unknown paths `307`/`308`. **Zero 404/500/502.**

- [ ] **Step 3: End-to-end upload check (after deploy)**

Sign in at `/manage/work`, create a work, upload one image, confirm the thumbnail renders in the form, publish, then load `/work/<slug>` and confirm the hero image renders through `next/image` (no console error) and the page reports `H1=1`.

- [ ] **Step 4: Deploy**

```bash
AWS_PROFILE=default bash scripts/deploy.sh production
```
Note: `deploy.sh` prints a benign `❌` post-check because the apex domain is attached and SST returns the apex URL rather than a CloudFront URL. Exit code 0 means success.

- [ ] **Step 5: Live verification**

```bash
BASE=https://publicpulse.com.bd
for p in /work /case-studies /; do printf "%-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $BASE$p)"; done
curl -s -o /dev/null -w "unknown work: %{http_code}\n" $BASE/work/zzz-nope
curl -s $BASE/sitemap.xml | grep -c "/work"
```
Expected: `200` for content pages; `308` for the unknown work; ≥1 `/work` sitemap entry.

- [ ] **Step 6: Record the session**

Append a dated entry to `docs/JOURNEY.md` per the project's session-log rule: what changed, why, verification results, and open items.

- [ ] **Step 7: Commit**

```bash
git add docs/JOURNEY.md
git commit -m "docs(journey): client works (/work) section shipped"
```

---

## Self-Review

**Spec coverage.** §1 data model → Task 1. §2 media pipeline → Task 2. §3 public surface → Tasks 5–7. §4 admin → Tasks 8–10. §5 SEO/AEO → Tasks 4, 11, 12. §6 case-studies repairs → Task 13. §7 verification gates → Tasks 6, 7, 12, 13, 14. Non-goals respected: no site-wide design level-up, no block editor, no `/bn/work`, no video transcoding (embed-only via `MediaFrame`).

**Known adaptations, called out rather than hidden:**
1. **No TDD test runner.** This repo has none; the plan uses `tsx` assertion scripts for pure logic and the project's established build/SSR-grep/curl gates for everything else. Adding vitest would be a scope change the spec did not authorise.
2. **Tasks 9, 10 Steps 2–3 describe forms by field list rather than pasting ~400 lines of JSX.** They point at the exact sibling files to mirror (`src/app/manage/case-studies/*`) because those files are the authoritative pattern and copying them verbatim into the plan would rot the moment they change.
3. **`requireSession` import path** is verified in Task 9 Step 1 before use, since the exact helper location must be confirmed against the codebase.
4. **`reviewSchema` argument names** are verified in Task 7 Step 2 against the real builder rather than assumed.
