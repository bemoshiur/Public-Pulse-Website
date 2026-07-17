# Design Spec — Political Facebook Advertising Flagship + "Restrained Luxury" Design System

**Date:** 2026-07-17
**Branch:** `feat/political-fb-flagship` (off `feat/super-aeo`)
**Status:** Approved design + approved visual mockup → ready for implementation planning
**Mockup:** restrained-luxury flagship (published as an Artifact during brainstorming)

---

## 1. Goal

Establish Public Pulse as the single most authoritative, most-cited source for **political Facebook advertising in Bangladesh**, and convert serious political clients (candidates, party strategists, campaign managers) into briefing calls — via:

1. A **flagship pillar page** + a **full topical-authority content cluster** (mega SEO / AEO / GEO).
2. A new **"restrained luxury / institutional prestige"** design language, debuting on the flagship, delivered as a reusable component kit for later site-wide rollout.

Both are framed around **legitimate, Meta-compliant** political advertising. Compliance is the credibility wedge, not a footnote.

## 2. Scope

**In scope (this project):**
- Bespoke flagship page at `/political-facebook-ads-bangladesh` in the new prestige language.
- A reusable **prestige component kit** + refined design tokens (the design system the flagship is built from).
- Content cluster: deepen the existing FB guide, 4 new blog posts, 1 compare page, 5 glossary terms, 1 gated benchmark.
- All schema / AEO / GEO surfaces for the above.
- `llms.txt` / `llms-full.txt` / `facts.json` / sitemap wiring for the new pages.

**Out of scope (explicit follow-up projects):**
- **Site-wide UI rollout** of the prestige language (restyling `ProgrammaticPage`, `GradientHero`, homepage, service pages, blog templates). This project produces the *kit*; propagating it is a separate spec.
- Real benchmark numbers, real case studies, real client proof (user-provided; content is built REAL-ONLY and gated).
- Any deploy (user's manual `scripts/deploy.sh production`).

## 3. Design direction — "the confidential campaign dossier"

Restrained-luxury / institutional prestige. The page reads like a political advisory firm's strategy brief: precise, documentary, calm, expensive. Precision carries it — not motion or decoration.

### 3.1 Tokens (new `prestige` layer)
Introduced as CSS variables + Tailwind tokens, coexisting with the current bold system (which stays until the site-wide rollout). Values from the approved mockup:

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#F3F2EE` (warm stone) | `#131417` | page ground |
| `surface` | `#FBFAF7` | `#191B1F` | insets / cards |
| `ink` | `#18191B` | `#ECEAE4` | primary text |
| `ink-soft` | `#3C3D3F` | `#C7C5BE` | body on paper |
| `muted` | `#6E6B64` (warm grey) | `#9A968D` | metadata |
| `hairline` | `#DAD7CE` | `#2A2C30` | dividers |
| `accent` | `#BE451E` (deep burnt orange) | `#E86A3C` | seal / CTA / key figures |
| `briefing` | `#17181C` (cool near-black) | `#0C0D0F` | dark "briefing room" sections |

- Accent is a **deepened, desaturated** relative of brand `#FF5C00` — refined, used sparingly (seal bar, CTAs, key numerals, one accent rule per section). Never as decoration or gradient.
- Warm paper vs. cool near-black briefing sections = deliberate warm/cool contrast.

### 3.2 Type
- **Display / headings:** the project's **Fraunces** (already loaded via `next/font`, `--font-fraunces`) — serif gravitas. Italic reserved for accent words in headlines.
- **Body / UI:** **DM Sans** (`--font-dm-sans`).
- **Mono "field-dossier" layer:** a monospace stack (`ui-monospace, "SF Mono", Menlo, …`) for clause refs (`§ 03`), account/brief codes (`PP/FB-01`), constituency codes, and all budget figures (`tabular-nums`). This documentary texture is the distinctive, subject-grounded device.
- Reading measure ≤ 68ch; headings `text-wrap: balance`; uppercase eyebrows tracked `0.22em`.

### 3.3 Motion (minimal)
- One signature moment: a quiet staggered fade-up on load (`translateY(14px)` + opacity, 0.8s, `cubic-bezier(.16,1,.3,1)`, delays d1–d4).
- **No aurora, no cursor-glow, no tilt** on prestige pages. Subtle hover states only (link underlines, button color, arrow nudge).
- Full `prefers-reduced-motion: reduce` short-circuit. CLS budget 0 (transform/opacity only).

### 3.4 Layout principles
Strict editorial grid; generous margins; a two-column `sec-head` (mono index label `§ NN — Label` | serif H2 + sub); hairline section dividers; numbered strategic framework; asymmetric hero (1.55fr copy / 1fr dossier card). Radii 3–4px (not `rounded-lg`). Sharp, precise, quiet.

## 4. Information architecture & URLs

| URL | Type | Role |
|---|---|---|
| `/political-facebook-ads-bangladesh` | **Pillar** (bespoke prestige page) | The flagship. Targets "political facebook ads / boost / campaign bangladesh." |
| `/guides/facebook-campaign-bd-election` | Existing HowTo — **deepen** | Add authorization/compliance steps; cross-link pillar. Do NOT duplicate. |
| `/blog/meta-political-ad-authorization-bangladesh` | New post | Step-by-step Meta authorization + "Paid for by" in BD. |
| `/blog/political-facebook-boost-cost-bangladesh` | New post | What it costs to boost political posts in BDT (planning ranges, evergreen). |
| `/blog/facebook-constituency-targeting-bangladesh` | New post | Targeting a BD constituency within Special Ad Category limits. |
| `/blog/boosting-vs-ads-manager-political-campaigns` | New post | When to boost vs run Ads Manager (informational twin of the compare). |
| `/compare/boosting-vs-ads-manager-political` | New compare | Decision matrix (commercial-intent twin). |
| `/glossary/{5 terms}` | New DefinedTerms | boosted-post, ad-authorization, paid-for-by-disclaimer, special-ad-category, constituency-targeting. |
| `/research/political-facebook-cpm-bangladesh` | New benchmark | Gated (`published:false`) until real numbers. |

Cluster interlinks: pillar ↔ guide ↔ posts ↔ compare ↔ glossary, plus links to `/election`, `/services/political-pr`, `/services/paid-ads`.

## 5. Flagship page structure

Bespoke page (NOT `ProgrammaticPage`) at `src/app/political-facebook-ads-bangladesh/page.tsx`, built from the new prestige kit. Sections (matching the approved mockup).

> **Routing note:** this explicit route shadows the `(matrix)/[slug]` catch-all — Next.js resolves the literal folder `political-facebook-ads-bangladesh/` before the dynamic `[slug]`, so no conflict. Verify in the build (`● /political-facebook-ads-bangladesh` prerendered, not caught by the matrix).

1. **Hero** — eyebrow + seal, Fraunces H1 (italic accent), lede, primary CTA ("Request a campaign briefing"), + a **dossier card** carrying the `AnswerBlock` (quotable definition, `data-speakable`) and a 3-row credibility strip (entity / process / terms).
2. **§01 Scope** — "not boost-and-hope" positioning prose.
3. **§02 Method** — 4-step numbered `Framework` (Authorize → Audience → Message → Measure) with mono step codes.
4. **§03 Compliance** — dark "briefing room" section: 4 clause cards (authorization, "Paid for by", Special Ad Category, Ad Library). **This is the proof.**
5. **§04 Terrain** — 4 Bangladesh-reality cards (Bangla-first, mobile/data-light, constituency geography, taka efficiency).
6. **§05 Budget** — mono BDT planning table (Boost desk / Constituency campaign / Multi-seat), labeled *illustrative planning ranges*, fee separate from media. Pulled from `pricing.ts` where possible; no fabricated performance figures.
7. **§06 Standing** — "method is the proof" + honest `[ BENCHMARK · FORTHCOMING ]` note.
8. **§07 FAQ** — 5 deep, question-shaped `<details>`.
9. **Closing CTA** — dark, booking + phone.

### Schema emitted on the pillar
`serviceSchema` (extended for a specialization — see §7), `faqPageSchema`, `breadcrumbSchema`, `webPageSchema` (speakable → `.answer-block`), `qaPageSchema` (the AnswerBlock question). Metadata via `buildMetadata` (unique title ≤60, desc 140–160, canonical, dynamic OG, `ProfessionalService` inherited from layout).

## 6. New / updated components (the prestige kit)

New folder `src/components/prestige/` (server components, no JS unless noted):

| Component | Purpose |
|---|---|
| `PrestigeHero` | Asymmetric hero: kicker+seal, Fraunces H1, lede, CTAs, dossier slot. |
| `Framework` | Numbered strategic sequence (code / name / body rows on hairlines). |
| `Clauses` | Dark briefing-room clause grid (ref / heading / body). |
| `SectionHead` | Two-column `§ NN — Label` + H2 + sub. |
| `HairlineList` / `CardGrid` | Reality cards / bullet facts. |
| `BudgetTable` | Mono `tabular-nums` BDT table with scroll container. |
| `PrestigeFaq` | `<details>` accordion in the dossier style. |
| `Seal` / `MonoTag` | Small primitives (accent seal bar, mono metadata tags). |

Shared: reuse existing `AnswerBlock`, `JsonLd`, `Breadcrumbs`, `KeyTakeaways`, `Container`. Prestige tokens added to `tailwind.config.ts` + `globals.css` under a clearly-scoped block; the motion primitives are NOT mounted on this page.

Fonts: no CSP/CDN issue in-app — Fraunces + DM Sans already load via `next/font`. (The mockup's system fonts were an artifact-only limitation.)

## 7. Schema builder changes (`src/lib/schema.ts`)

- Add a thin **`specializedServiceSchema`** wrapper to `schema.ts` (does not change the existing `serviceSchema` signature) so the flagship emits a `Service` with `serviceType: "Political Advertising"`, `provider: Org @id`, `areaServed: Bangladesh`, `isRelatedTo` the `political-pr` + `paid-ads` Service `@id`s, and its own `@id`. Keeps the single-source-of-truth rule (no hand-rolled JSON-LD).
- Benchmark reuses existing `datasetSchema` (from `feat/super-aeo`).
- Compare/guide/glossary reuse existing builders (`articleSchema`, `howToSchema`, `definedTermSchema`).

## 8. Content cluster (REAL-ONLY, evergreen, compliance-anchored)

- **Guide** (`src/lib/content/guides.ts`): extend the existing FB-election guide's steps with authorization + disclaimer + Special Ad Category + measurement; set `image`/`tools` accordingly.
- **Blog posts** (4): the blog is DB-backed (Neon), and I cannot write to prod Neon. So the 4 posts are authored as a **seed script** — `scripts/seed-political-fb-cluster.ts` — that inserts them (idempotent, `status:'review'` so nothing auto-publishes) which **the user runs** with `DATABASE_URL`. Each post: `answerFirst` (40–60w), question-shaped H2s, ≥3 FAQs, `sourceRefs`, evergreen BDT planning ranges (never fabricated performance), compliance framing. (Follows the existing `src/db/seed-topics.ts` pattern.) Until the user runs it + publishes, the posts don't exist publicly — the pillar/guide/compare/glossary carry the cluster on their own.
- **Compare** (`src/lib/content/compares.ts`): add the boosting-vs-Ads-Manager entry (`ready:true`).
- **Glossary** (`src/lib/taxonomies/glossary.ts`): add 5 terms with EN + BN name, definition, body, `see` cross-refs.
- **Benchmark** (`src/lib/content/benchmarks.ts`): add `political-facebook-cpm-bangladesh`, `published:false` (renders nowhere until real numbers).

## 9. AEO / GEO / discovery wiring

- `AnswerBlock` + question-H2s + `KeyTakeaways` on the pillar; `FAQPage` density across cluster.
- `llms.ts`: pillar + cluster surface in `buildLlmsIndex` (a new "Political advertising" grouping) and `buildLlmsFull` (full pillar text). Citation licence already present.
- `facts.ts`: add a "specializations" entry for political Facebook advertising (canonical facts: compliant, authorized, BD-registered).
- `sitemap.ts`: add the pillar + cluster URLs (compare/glossary/guide via existing catalog loops; pillar as an explicit core entry; benchmark auto-includes when published).
- Internal links from `/election`, `/services/political-pr`, `/services/paid-ads` into the pillar (contextual, descriptive anchors).

## 10. Compliance guardrail (content policy — applies to every piece)

Promote only **legitimate, Meta-compliant** political advertising: ad authorization, "Paid for by" disclaimers, Special Ad Category, public Ad Library transparency, geography/affinity targeting (never protected traits), one candidate per constituency, NDA terms. **Never** reference or imply fake engagement, bots, sockpuppets, undisclosed spend, impersonation, voter suppression, misinformation, or evading ad review. This is both the ethical line and the SEO/AEO authority wedge.

## 11. Real-asset dependencies (user, post-build)

1. Run `scripts/seed-political-fb-cluster.ts` (with `DATABASE_URL`) to insert the 4 blog posts, then bulk-publish them via `/manage/blog` (they seed as `review`).
2. Real political-ad benchmark numbers (CPM/reach) → publish the gated benchmark.
3. Any NDA-anonymized proof/screenshots if the credibility section should feature results later.
4. Confirm the political-PR pricing figures reconcile with `/pricing` (existing open item).

## 12. Verification / success criteria

- `npx tsc --noEmit` clean · `npm run build` green.
- SSR gate on the pillar: exactly 1 `<h1>`, `.answer-block[data-speakable]` present, canonical, `Service`+`FAQPage`+`BreadcrumbList`+`WebPage` JSON-LD, ≥5 FAQs.
- Cluster pages build + appear in sitemap; benchmark absent (gated); nonsense-free.
- `prefers-reduced-motion` disables the load animation; no aurora/cursor-glow on the pillar.
- Prestige tokens don't regress existing pages (scoped, additive).

## 13. Branch & rollout

- All work on `feat/political-fb-flagship` (off `feat/super-aeo`). Not merged/deployed until the user asks.
- Phase 2 (separate spec): apply the prestige kit site-wide (homepage, services, `ProgrammaticPage`, blog, `/election`).

## 14. Open questions

None. (Pricing-reconciliation is a known user action, not a blocker; election-timing is intentionally evergreen; proof is method-first by decision.)
