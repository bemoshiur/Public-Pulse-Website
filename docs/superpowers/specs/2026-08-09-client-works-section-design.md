# Client Works (`/work`) — design spec

**Date:** 2026-08-09
**Status:** Approved (brainstorm complete) — implementation plan to follow
**Branch base:** `feat/dataplace-restyle` (Dataplace restyle is live in production)

---

## Goal

Build a dedicated, dynamic, detail-rich **client-works showcase at `/work`**, backed by a real media pipeline so it can actually be filled — and repair the existing `/case-studies` system so the two work as a complementary pair rather than duplicates.

## Why this exists (findings that drove the design)

A codebase audit established that the current `/case-studies` system **cannot become a portfolio without new plumbing**:

1. **No upload pipeline anywhere** — no S3 presign, no `/api/upload`, no file input. Images are paste-a-URL text fields only.
2. **`next.config.ts` has no `images.remotePatterns`** (only `localPatterns` for `/og`) — so a pasted remote URL **hard-errors `next/image`** at runtime. The field is a trap that yields a broken page, not a validation error.
3. **One image column** (`hero_image_url`). No gallery, no video, no per-asset alt/caption/dimensions.
4. **`logo_url` is a dead column** — written by the admin form, stored, and read by *nothing*. No logo wall exists.
5. **The card grid is not in the SSR HTML.** `<Suspense fallback={null}>` + `useSearchParams()` makes Next skip prerendering the filter+grid subtree — verified live: **zero `/case-studies/<slug>` anchors in the crawlable HTML**. An SEO hole in the one section meant to prove credibility.
6. **Metrics and FAQs are raw JSON textareas** — a missing comma throws an unstyled server exception and loses the form.
7. **`industry` / `location` / `services` are free text**, not slugs from the typed catalogs — typos silently create duplicate filter facets and break `getRelatedCaseStudies` (exact `eq(industry)` match).
8. **Nothing links in.** No `getCaseStudiesByService()`, so `/services/*`, `/locations/*`, `/industries/*` never surface proof.
9. **Live state: completely empty** — 0 published works, 0 sitemap entries, homepage "Selected results" hidden.

Reusable and explicitly kept: the `unstable_cache` + tag + resilience data-layer shape, the admin auth/CRUD/`refreshPublic()` invalidation recipe, `Container`/`Section`/`GreyPanel`/`ScrollReveal`/`CountUp`/`ArrowCircle`, `buildMetadata` + the `/og` factory, `parseMetric()`, and every real-only guardrail (`isSeedSlug`, rating-free `reviewSchema`, gated testimonial/FAQ sections).

## Locked decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | Design direction | **Level up the existing Dataplace language** — do not replace it | It shipped hours ago and works; the deferred piece was original artwork, and real client work *is* that artwork |
| 2 | Content reality | **Mixed** — some clients allow full visuals, others are NDA-bound to numbers | Makes graceful degradation a feature, not a fallback |
| 3 | URL strategy | **Keep both** `/work` and `/case-studies`, with a crisp editorial rule | Two content types fit mixed client permissions better than one merged type |
| 4 | Scope | **Foundation-first (A)** — media pipeline → data model → admin → public → SEO, plus the `/case-studies` repairs | The section is empty *because* it isn't fillable; fix that first |
| 5 | Site-wide design level-up | **Separate follow-up spec** | `/work` is where the leveled-up language gets invented; propagate afterwards |

### The editorial rule (what makes "keep both" work)

This table describes **editorial emphasis — which surface a piece of content belongs on**. It is *not* a database constraint; see §1, where every media field is nullable.

| | `/work` | `/case-studies` |
|---|---|---|
| Question answered | *"Are they any good? Show me."* | *"Does it work? Prove it."* |
| Led by | Visuals — creative, screens, reels | Numbers — metrics, method, outcome |
| Client allows visuals | ✅ goes here | optional |
| NDA / numbers only | — | ✅ goes here |
| Metrics | supporting | the point |
| Media | leads the page **when present**; a media-less work renders typographically | supporting |

Where a client permits both, the two records **cross-link** (`work.caseStudySlug` ↔ `caseStudy.workSlug`), converting overlap into internal-link equity.

---

## 1 · Data model

Three tables. `clients` is new and is what makes a logo wall, a "more work for this client" rail, and a client `Organization` schema node possible — while retiring the dead `logo_url` column.

```
clients
  id · slug (unique) · name · logoUrl? · logoDarkUrl? · website?
  createdAt · updatedAt

works
  id · slug + locale (unique together) · title · tagline?
  clientId            → clients.id
  confidentiality     'named' | 'anonymised'
  anonLabel?          e.g. "A Cox's Bazar resort" — rendered instead of client.name
                      when anonymised; client logo suppressed
  year (int) · windowLabel
  industrySlug? · locationSlug? · serviceSlugs[]   ← validated against the typed catalogs
  disciplines[]       ← new typed catalog at src/lib/taxonomies/disciplines.ts
                        (branding, film, campaign, social, paid, web) — same
                        shape as the existing locations/industries catalogs
  summary             card copy + AnswerBlock source
  context? · approach? · outcome?                  narrative
  deliverables[]      "12 reels", "3 landing pages"
  metrics[]           reuses the existing CaseStudyMetric shape
  media[]             MediaAsset[] — see below
  liveUrl? · adLibraryUrl?
  testimonialQuote? · testimonialAttribution? · testimonialRole?
  caseStudySlug?      cross-link
  featured · displayOrder · status · published · publishedAt
  seoTitle? · seoDescription?

case_studies  (existing table)
  + clientId → clients.id
  + workSlug?          the reverse cross-link
```

**`MediaAsset`**

```ts
{ kind: 'image' | 'video'
  url: string
  alt: string
  caption?: string
  width: number          // REQUIRED on images — captured at upload
  height: number         // REQUIRED on images — holds the CLS budget at 0
  role: 'hero' | 'gallery'
  provider?: 's3' | 'youtube' | 'vimeo'
  poster?: string }
```

**Every media field is optional.** A numbers-only work is a valid, complete record that renders as a deliberate typographic piece — not a broken visual one.

### Data-layer conventions (carried over deliberately)

- `unstable_cache` with tag `works`, `revalidate: 60`, versioned cache keys (`works:published-v1`).
- `try/catch → []` resilience so public pages prerender without `DATABASE_URL`.
- `isSeedSlug` guard applied in every public accessor.
- Ordering fix: works sort by `displayOrder ASC, publishedAt DESC` (the existing case-studies table sorts `displayOrder DESC` with a default of 0, so unedited rows sort *last* — that is corrected here and in the repairs).
- Publish gating: a single source of truth (`status === 'published'`), with `published` kept in sync — resolving the current ambiguity where a row can be reachable by URL but invisible in the index.

---

## 2 · Media pipeline

- **SST S3 bucket** linked to the Next app (already on AWS; no new vendor, no new bill).
- **`POST /api/media/presign`** — `requireSession()`-gated, returns a presigned PUT URL + the final public URL. Server-side limits: MIME allowlist `image/jpeg | image/png | image/webp | image/avif`, **max 8 MB per file**, presigned URL TTL **5 minutes**, object keys namespaced `works/<workSlug>/<uuid>.<ext>`.
- **Uploader component** (admin only): drag/drop → presign → PUT → read natural dimensions client-side → persist the `MediaAsset` JSON.
- **`next.config.ts`** — add `images.remotePatterns` for the bucket/CDN host. This also **repairs the existing hero-URL trap** on case studies.
- **CSP** — add `frame-src` for YouTube/Vimeo only when embeds are actually used; `media-src` if self-hosted video lands later.

---

## 3 · Public surface

### `/work` (index)

Inset hero + `AnswerBlock` → optional client logo wall → visual-led grid → CTA.

Cards lead with media where it exists; media-less works render as the typographic metric card that already exists — one coherent rhythm across a mixed grid.

**The filter is rebuilt SSR-safe.** The complete grid ships in the crawlable HTML with real `/work/<slug>` anchors; filtering toggles visibility only. This is a deliberate departure from the `Suspense` + `useSearchParams` pattern that currently makes the case-studies grid invisible to crawlers.

### `/work/[slug]` (detail)

Full-bleed media hero **or** a typographic hero when there is none → meta strip (client-or-anon-label · year · disciplines · services · location) → **`AnswerBlock`** → context / approach / outcome → gallery + lightbox → metrics (`CountUp`) → deliverables → testimonial *(rendered only when both quote and attribution exist)* → "See the numbers →" cross-link when `caseStudySlug` is set → related work (same client, then same discipline/industry) → CTA.

**Unknown slug → 308 redirect to `/work`.** Never a raw 404 — the project's standing crawl rule. (The current `/case-studies/[slug]` hard-`notFound()`s; that is corrected in §6.)

---

## 4 · Admin — `/manage/work`

Reuses the existing auth gate and the `refreshPublic()` recipe (`updateTag(TAG)` + targeted `revalidatePath`s + `pingIndexNow`) verbatim.

Fixes the three things that make the current form unusable for a non-technical author:

1. **Real upload** — drag/drop to S3, not a URL field that breaks the page.
2. **Repeatable field editors** for metrics, deliverables, and media — replacing raw JSON textareas.
3. **Catalog-backed selects** for industry / location / services / disciplines — replacing free text that silently breaks filters and related-work matching.

Plus: draft preview for unpublished rows, an in-app slug-collision check (instead of a raw Postgres unique-constraint error), and surfaced validation errors via `useActionState`.

---

## 5 · SEO / AEO wiring

- **New `creativeWorkSchema`** in `src/lib/schema.ts` — `CreativeWork` + `ImageObject` / `VideoObject` for media, client emitted as an `Organization` node, `provider` cross-linked to the site Organization `@id`.
- `CollectionPage` + `ItemList` on the index; `BreadcrumbList` on both; `Review` only when a real testimonial exists (rating-free, per the standing real-only rule).
- **`AnswerBlock` on the index and every work detail** — 40–60 words, `data-speakable`.
- Registered in `sitemap.ts` (real `publishedAt` lastmod), `src/lib/llms.ts` (new `## Client work` section), and `src/lib/site-search.ts` (`kind: 'work'`).
- **New `getWorksByService` / `ByIndustry` / `ByLocation` accessors** feeding proof rails on `/services/*`, `/locations/*`, `/industries/*` — closing the "nothing links in" gap.

---

## 6 · `/case-studies` repairs (in scope)

- SSR-visible grid (same fix as `/work`).
- Repeatable editors replacing the JSON textareas.
- Catalog-backed industry / location / services.
- `logoUrl` finally rendered, via the new `clients` relation.
- Reconcile the `published` boolean vs `status` enum into one source of truth.
- Fix `displayOrder` sort direction.
- `remotePatterns` (shared with §2) so hero URLs stop hard-erroring.
- Inbound-link accessors + the reverse `workSlug` cross-link.
- `/case-studies/[slug]` unknown slug → 308 to the hub, matching the six routes converted in STEP 28.

---

## 7 · Verification gates

Per new/changed page, checked **in the built SSR HTML** (`.next/server/app/*.html`):

```
grep -c "<h1"                  == 1
grep -c "answer-block"         >= 1
grep -c "application/ld+json"  >= 1
grep -c 'rel="canonical"'      == 1
grep -c 'href="/work/'         >= 1      # the SSR-visible-grid regression guard
```

Plus: route matrix (`/work` 200, `/work/<unknown>` 308, `/case-studies` 200, zero 404/502 sitewide); upload end-to-end (presign → PUT → render); CLS check on every media block (width/height present); `tsc` clean; `next build` green.

## Non-goals (explicitly out of scope)

- Site-wide design level-up across the other ~30 pages — **separate follow-up spec**.
- A block/rich-text editor for narrative — structured fields only, matching the existing "Write from facts" philosophy.
- Bengali (`bn`) works — the `locale` column exists and is honoured, but no `/bn/work` route ships in this pass (the `bn` case-study routes were previously removed; i18n is a separate concern).
- Self-hosted video transcoding — video is embed-only (YouTube/Vimeo) if used at all.
