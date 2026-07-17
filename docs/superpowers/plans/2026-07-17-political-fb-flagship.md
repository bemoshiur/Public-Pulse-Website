# Political Facebook Advertising Flagship + Prestige Kit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a mega Political-Facebook-Advertising content cluster (flagship pillar + guide + 4 posts + compare + glossary + gated benchmark) built in a new "restrained luxury / campaign dossier" design language, delivered as a reusable prestige component kit.

**Architecture:** A bespoke prestige flagship page at an explicit route, built from a new scoped `pr-*` token set + a `src/components/prestige/` kit (server components). Cluster content extends the existing typed catalogs (glossary/compares/guides/benchmarks) and — for the DB-backed blog — a seed script the user runs. All JSON-LD goes through `src/lib/schema.ts`; AEO surfaces (`llms.ts`, `facts.ts`, `sitemap.ts`) get wired. Compliance-anchored, real-only, evergreen.

**Tech Stack:** Next.js 16 App Router (TS strict), Tailwind v3, `next/font` (Fraunces + DM Sans), Drizzle/Neon (blog), existing schema/seo helpers.

**Reference:** the approved spec `docs/superpowers/specs/2026-07-17-political-fb-flagship-design.md` and the approved visual mockup (restrained-luxury flagship Artifact). Port copy from the mockup verbatim where noted.

## Global Constraints

- **No deploy, no DB writes to prod.** Branch `feat/political-fb-flagship` only.
- **Verification cycle per task (the "tests"):** `npx tsc --noEmit` (must be clean) + targeted `npm run build` where a route changes + SSR grep gate per CLAUDE.md. No unit-test harness exists — do not add one.
- **All JSON-LD via `src/lib/schema.ts`** — never hand-roll. **Every page** uses `buildMetadata` (unique title ≤60, description 140–160, canonical, OG, Twitter).
- **AEO contract:** every long-form page = exactly one `<h1>`, one `.answer-block[data-speakable]` (40–60 words), ≥3 FAQs with `FAQPage`.
- **Compliance guardrail (content policy):** promote ONLY legitimate, Meta-compliant political advertising (authorization, "Paid for by" disclaimer, Special Ad Category, Ad Library transparency, geography/affinity targeting, one candidate per constituency, NDA). NEVER reference or imply fake engagement, bots, undisclosed spend, impersonation, voter suppression, misinformation, or evading ad review.
- **Real-only:** no fabricated performance metrics. BDT figures are labeled *illustrative planning ranges*. Benchmark ships `published:false`.
- **Prestige tokens are scoped + additive** (`pr-*` names) — must not change any existing page.
- **Preserve** tracking IDs + contact details (CLAUDE.md).

---

### Task 1: Prestige design tokens (scoped, additive)

**Files:**
- Modify: `tailwind.config.ts` (extend `theme.colors` with `pr-*` tokens + `fontFamily.mono` if absent)
- Modify: `src/styles/globals.css` (add a `.prestige-reveal` motion layer, reduced-motion guard)

**Interfaces:**
- Produces: Tailwind color classes `bg-pr-paper text-pr-ink text-pr-muted border-pr-hairline text-pr-accent bg-pr-surface bg-pr-briefing text-pr-briefing-ink border-pr-briefing-line`; utility classes `.pr-reveal .pr-reveal.d1..d4`.

- [ ] **Step 1: Add tokens to `tailwind.config.ts`** inside `theme.extend.colors`:

```ts
// Prestige ("restrained luxury") palette — scoped to the political-ad
// flagship + prestige kit. Additive; does NOT touch existing brand tokens.
"pr-paper": "#F3F2EE",
"pr-surface": "#FBFAF7",
"pr-raise": "#FFFFFF",
"pr-ink": "#18191B",
"pr-ink-soft": "#3C3D3F",
"pr-muted": "#6E6B64",
"pr-faint": "#9A968D",
"pr-hairline": "#DAD7CE",
"pr-accent": "#BE451E",
"pr-accent-ink": "#A03A17",
"pr-accent-wash": "#F1E4DB",
"pr-briefing": "#17181C",
"pr-briefing-ink": "#ECEAE4",
"pr-briefing-muted": "#9C9890",
"pr-briefing-line": "#2C2D30",
```

Confirm `theme.extend.fontFamily` includes a `mono` entry; if not, add:
```ts
mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
```
(Fraunces `font-serif` + DM Sans `font-sans` already exist per BRAND.md — reuse them.)

- [ ] **Step 2: Add the motion layer to `src/styles/globals.css`** (near the existing motion rules):

```css
/* Prestige flagship — single signature load motion. transform+opacity only. */
.pr-reveal { opacity: 0; transform: translateY(14px); animation: pr-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.pr-reveal.d1 { animation-delay: 0.06s; }
.pr-reveal.d2 { animation-delay: 0.14s; }
.pr-reveal.d3 { animation-delay: 0.22s; }
.pr-reveal.d4 { animation-delay: 0.32s; }
@keyframes pr-rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .pr-reveal { animation: none; opacity: 1; transform: none; } }
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit` (clean) and `npm run build` (green; no regressions). Commit:
```bash
git add tailwind.config.ts src/styles/globals.css
git commit -m "feat(prestige): scoped pr-* tokens + signature reveal motion"
```

---

### Task 2: Prestige component kit

**Files:**
- Create: `src/components/prestige/Primitives.tsx` (`Seal`, `MonoTag`, `SectionHead`)
- Create: `src/components/prestige/PrestigeHero.tsx`
- Create: `src/components/prestige/Framework.tsx`
- Create: `src/components/prestige/Clauses.tsx`
- Create: `src/components/prestige/CardGrid.tsx`
- Create: `src/components/prestige/BudgetTable.tsx`
- Create: `src/components/prestige/PrestigeFaq.tsx`
- Create: `src/components/prestige/index.ts` (barrel)

**Interfaces (Produces — exact signatures the flagship consumes):**
```ts
// Primitives.tsx
export function Seal(): JSX.Element;
export function MonoTag({ children, tone }: { children: React.ReactNode; tone?: "muted" | "accent" }): JSX.Element;
export function SectionHead({ index, title, sub, dark }: { index: string; title: React.ReactNode; sub?: string; dark?: boolean }): JSX.Element;
// PrestigeHero.tsx
export function PrestigeHero({ eyebrow, title, lede, ctaPrimary, ctaSecondary, aside }:
  { eyebrow: string; title: React.ReactNode; lede: string; ctaPrimary: { href: string; label: string }; ctaSecondary?: { href: string; label: string }; aside: React.ReactNode }): JSX.Element;
// Framework.tsx
export type FrameworkStep = { code: string; name: string; body: string };
export function Framework({ steps }: { steps: FrameworkStep[] }): JSX.Element;
// Clauses.tsx
export type Clause = { ref: string; heading: string; body: string };
export function Clauses({ clauses }: { clauses: Clause[] }): JSX.Element;
// CardGrid.tsx
export type PrestigeCard = { num: string; heading: string; body: string };
export function CardGrid({ cards }: { cards: PrestigeCard[] }): JSX.Element;
// BudgetTable.tsx
export type BudgetRow = { tier: string; bestFor: string; fee: string; media: string };
export function BudgetTable({ rows, note }: { rows: BudgetRow[]; note: string }): JSX.Element;
// PrestigeFaq.tsx  (uses <details> — no client JS)
export function PrestigeFaq({ faqs }: { faqs: { q: string; a: string }[] }): JSX.Element;
```

- [ ] **Step 1: Create `Primitives.tsx`** — port the mockup's `.seal`, `.tag-mono`, and two-column `.sec-head` into Tailwind using `pr-*` tokens. `Seal` = `<span className="inline-block h-[3px] w-[26px] bg-pr-accent" />`. `SectionHead` renders a `grid md:grid-cols-[220px_1fr]` with a mono `§`-index label + a `font-serif` H2 + optional `sub`; `dark` variant swaps to `text-pr-briefing-muted`.

- [ ] **Step 2: Create the remaining kit files**, porting each mockup section 1:1:
  - `PrestigeHero`: `grid md:grid-cols-[1.55fr_1fr]`; left = kicker(Seal+eyebrow) + `font-serif` H1 (`text-[clamp(37px,6vw,72px)]`, accent italic via a child `<em class="text-pr-accent-ink italic">`) + lede + CTA row; right = `aside` slot (the dossier card). Wrap hero children in `.pr-reveal .d1..d3` classes.
  - `Framework`: hairline-separated rows, each `grid md:grid-cols-[64px_200px_1fr]` — mono `code` (`text-pr-accent`), `font-serif` `name`, `body`.
  - `Clauses`: dark section (`bg-pr-briefing text-pr-briefing-ink`), a `grid md:grid-cols-2` of clause cards (mono ref + H3 + body).
  - `CardGrid`: `grid md:grid-cols-2` of bordered `pr-surface` cards (mono `num` + H3 + body).
  - `BudgetTable`: `overflow-x-auto` container + `<table>` with mono `tabular-nums` amount cells; render `note` in mono below.
  - `PrestigeFaq`: `<details>` list, hairline dividers, `font-serif` summary + rotating `+` mono marker (CSS `details[open]` rotate), `.a` answer body.
  - `index.ts` re-exports all.
  Use ONLY `pr-*` tokens + `font-serif`/`font-sans`/`font-mono`. No motion primitives, no client hooks.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean. Commit:
```bash
git add src/components/prestige
git commit -m "feat(prestige): restrained-luxury component kit (hero, framework, clauses, cards, budget, faq)"
```

---

### Task 3: `specializedServiceSchema` builder

**Files:**
- Modify: `src/lib/schema.ts` (add builder near `serviceSchema`)

**Interfaces:**
- Produces:
```ts
export type SpecializedServiceInput = { slug: string; name: string; description: string; serviceType: string; relatedServiceSlugs?: string[]; minPriceBdt?: number };
export function specializedServiceSchema(input: SpecializedServiceInput): object;
```

- [ ] **Step 1: Add the builder** — a `Service` with `@id = absoluteUrl('/'+slug)#service`, `provider: { "@id": ORG_ID }`, `areaServed: { "@type": "Country", name: "Bangladesh" }`, `serviceType`, `isRelatedTo: relatedServiceSlugs.map(s => ({ "@id": absoluteUrl('/services/'+s)+'#service' }))`, and an `offers` Offer with `priceCurrency: "BDT"` + optional `priceSpecification.minPrice` (mirror the pattern already in `serviceSchema`). Reuse `ORG_ID`, `absoluteUrl`.

- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean. Commit:
```bash
git add src/lib/schema.ts
git commit -m "feat(schema): specializedServiceSchema for the political-ad flagship"
```

---

### Task 4: Flagship page

**Files:**
- Create: `src/app/political-facebook-ads-bangladesh/page.tsx`

**Interfaces:**
- Consumes: the prestige kit (Task 2), `specializedServiceSchema` (Task 3), existing `AnswerBlock`, `JsonLd`, `Breadcrumbs`, `Container`, `buildMetadata`, `faqPageSchema`, `breadcrumbSchema`, `webPageSchema`, `qaPageSchema`, `bookingUrl`.

- [ ] **Step 1: Build the page** — `export const metadata = buildMetadata({ title: "Political Facebook Ads in Bangladesh | Public Pulse", description: "Compliant Facebook & Instagram advertising for Bangladeshi candidates and parties — Meta ad authorization, 'Paid for by' disclaimers, constituency targeting, BDT budgets. Run from Dhaka.", path: "/political-facebook-ads-bangladesh", useDynamicOg: true, ogTitle: "Political Facebook Advertising · Bangladesh", ogEyebrow: "POLITICAL DIGITAL OPS · DHAKA" })`. Render (top→bottom) the mockup sections using the kit: `PrestigeHero` (aside = a dossier card wrapping `<AnswerBlock question="What is political Facebook advertising in Bangladesh?">` with the mockup's definition + a 3-row credibility strip) → §01 Scope prose → `Framework` (§02, the 4 steps from the mockup) → `Clauses` (§03, the 4 compliance clauses) → `CardGrid` (§04, the 4 Bangladesh-reality cards) → `BudgetTable` (§05, the 3 tiers + note) → §06 Standing prose + the `[ BENCHMARK · FORTHCOMING ]` line → `PrestigeFaq` (§07, the 5 FAQs) → closing CTA (booking + phone). **Port all copy verbatim from the approved mockup.** Wrap page in `bg-pr-paper text-pr-ink font-sans`.

- [ ] **Step 2: Emit JSON-LD** via `<JsonLd data={[ specializedServiceSchema({ slug: "political-facebook-ads-bangladesh", name: "Political Facebook Advertising", description: "...", serviceType: "Political Advertising", relatedServiceSlugs: ["political-pr","paid-ads"], minPriceBdt: 40000 }), faqPageSchema(FAQS), breadcrumbSchema(crumbs), webPageSchema({ path, name, description }), qaPageSchema(ANSWER_Q, ANSWER_TEXT) ]} />`. `crumbs = [{name:"Home",path:"/"},{name:"Political Facebook Ads",path:"/political-facebook-ads-bangladesh"}]`. FAQS = the 5 from the mockup.

- [ ] **Step 3: Verify** — `npm run build`; confirm the pillar prerenders as its own route (NOT swallowed by the matrix):
```bash
npm run build 2>&1 | grep -E 'political-facebook-ads-bangladesh'   # expect the route listed (○/●)
SP=$(find .next/server/app -path '*political-facebook-ads-bangladesh.html' | head -1)
echo "h1: $(grep -oE '<h1' "$SP" | wc -l | tr -d ' ')  (=1)"
grep -oc 'answer-block' "$SP"; grep -oc 'rel="canonical"' "$SP"
grep -oE '"@type":"(Service|FAQPage|BreadcrumbList|WebPage|QAPage)"' "$SP" | sort -u
```
Expected: h1=1, answer-block present, canonical present, all five @types. Commit:
```bash
git add src/app/political-facebook-ads-bangladesh
git commit -m "feat(political-fb): flagship pillar page in the prestige language"
```

---

### Task 5: Glossary terms (5)

**Files:**
- Modify: `src/lib/taxonomies/glossary.ts` (append 5 entries matching the existing `GlossaryTerm` shape: `slug, name, nameBn?, area, definition, body, see?`)

- [ ] **Step 1: Append entries** (compliance-anchored definitions; BN names; `see` cross-refs to each other + `answer-block`/`aeo` where relevant). The five slugs + one-line definitions:
  - `boosted-post` — "Promoting an existing Facebook/Instagram post with paid reach; the simplest Meta ad, but for political content it still requires ad authorization and a disclaimer."
  - `ad-authorization` — "Meta's identity- and location-verification a political advertiser must complete before running ads about elections, social issues, or politics."
  - `paid-for-by-disclaimer` — "The mandatory label on every political ad naming who paid for it; registered once on an authorized account."
  - `special-ad-category` — "Meta's restricted category for political/social-issue ads that limits targeting (no age/gender/detailed-trait narrowing)."
  - `constituency-targeting` — "Focusing paid reach on a specific electoral seat using Meta's geography and affinity layers within Special Ad Category limits."
  Each `body` = one BD-specific paragraph. Follow the exact object shape of existing entries (open the file first).

- [ ] **Step 2: Verify** — `npm run build`; `curl`-free check: confirm 5 new `/glossary/<slug>` pages prerender (`.next/server/app/glossary/<slug>.html` exist) and `/glossary` index count grew by 5. `npx tsc --noEmit` clean. Commit:
```bash
git add src/lib/taxonomies/glossary.ts
git commit -m "feat(glossary): 5 political-Facebook-ad terms"
```

---

### Task 6: Compare page (boosting vs Ads Manager)

**Files:**
- Modify: `src/lib/content/compares.ts` (append one entry matching the existing `Compare` shape: `slug, title, answer, leftLabel, rightLabel, points[{dimension,left,right}], recommendation, ready:true`)

- [ ] **Step 1: Append the entry** — `slug: "boosting-vs-ads-manager-political"`, `title: "Boosting vs Ads Manager for political campaigns in Bangladesh"`, `answer` = a 40–60w direct answer (Ads Manager is the engine, boosting rides a moment; both compliant only from an authorized account). `leftLabel: "Boosting"`, `rightLabel: "Ads Manager"`, `points` = 5–6 dimensions (control, targeting, message testing, frequency, cost efficiency, compliance) each with a `left`/`right` cell. `recommendation` = when to use each. Follow the exact object shape of existing COMPARES entries.

- [ ] **Step 2: Verify** — `npm run build`; confirm `/compare/boosting-vs-ads-manager-political` prerenders + is in the sitemap. Commit:
```bash
git add src/lib/content/compares.ts
git commit -m "feat(compare): boosting vs Ads Manager for political campaigns"
```

---

### Task 7: Deepen the existing FB election guide

**Files:**
- Modify: `src/lib/content/guides.ts` (the `facebook-campaign-bd-election` entry)

- [ ] **Step 1: Extend the guide's `steps`** to lead with an **Authorize** step (identity + location + "Paid for by") and add a **Compliance check** step (Special Ad Category + Ad Library), keeping existing audience/creative/measurement steps. Update `answer` + `description` to foreground compliance. Add a cross-reference sentence pointing to `/political-facebook-ads-bangladesh` and the new glossary terms. Keep `ready:true`, `totalTime`, `tools`. Do not duplicate the flagship — the guide is the *how-to*, the flagship is the *offer*.

- [ ] **Step 2: Verify** — `npm run build`; confirm `/guides/facebook-campaign-bd-election` still renders + emits `HowTo` with the new steps. `npx tsc --noEmit` clean. Commit:
```bash
git add src/lib/content/guides.ts
git commit -m "feat(guides): deepen FB election guide with authorization + compliance steps"
```

---

### Task 8: Gated benchmark

**Files:**
- Modify: `src/lib/content/benchmarks.ts` (append one `Benchmark`, `published:false`)

- [ ] **Step 1: Append** `slug: "political-facebook-cpm-bangladesh"`, `category: "political-pr"`, `title: "Political Facebook Ad CPM in Bangladesh (2026)"`, `metric: "Political Facebook Ads CPM"`, `value: "TODO ৳___"`, `unit: "BDT per 1,000 impressions"`, `context: "Bangladesh, Meta political ads, 2026"`, `methodology: "TODO — first-party: CPM across Public Pulse-managed political ad accounts; state sample."`, `collectedDate: "2026-01-01"`, `temporalCoverage: "2026"`, `answer: "TODO — lead with the number..."`, `keywords`, `variableMeasured: ["Political Facebook Ads CPM (BDT)"]`, `published: false`. Follow the exact `Benchmark` shape.

- [ ] **Step 2: Verify** — `npm run build`; confirm `/research` still 404s (nothing published) and no `/research/political-facebook-cpm-bangladesh` page prerenders. `npx tsc --noEmit` clean. Commit:
```bash
git add src/lib/content/benchmarks.ts
git commit -m "feat(benchmark): gated political Facebook CPM benchmark (real-only)"
```

---

### Task 9: Blog cluster seed script (4 posts)

**Files:**
- Create: `scripts/seed-political-fb-cluster.ts` (idempotent insert into `blogPosts`, `status:'review'`, `locale:'en'`)

**Interfaces:**
- Consumes: `db`, `blogPosts` (schema), dotenv (mirror `scripts/seed-topics.ts` env-loading + `@/` alias).

- [ ] **Step 1: Author the 4 posts as typed data** inside the script, each object = a `NewBlogPost` with: `slug`, `locale:'en'`, `title`, `excerpt`, `categorySlug:'political-pr'` (confirm the category exists in the DB seed; else `'paid-media'`), `tags`, `answerFirst` (40–60w, compliance-first), `bodyMdx` (600–900w, `##` question-shaped H2s, evergreen BDT planning ranges, compliance framing, cross-links to the flagship + glossary), `faqJson` (≥3), `sourceRefs: ['political-pr','paid-ads']`, `readingTime`, `seoTitle`, `seoDescription`, `answerFirst`, `status:'review'`. The four:
  1. `meta-political-ad-authorization-bangladesh` — "Meta political ad authorization in Bangladesh: the exact steps"
  2. `political-facebook-boost-cost-bangladesh` — "What it costs to boost political posts in Bangladesh (BDT)"
  3. `facebook-constituency-targeting-bangladesh` — "Targeting a Bangladesh constituency on Facebook (within the rules)"
  4. `boosting-vs-ads-manager-political-campaigns` — "Boosting vs Ads Manager for a political campaign" (informational twin of the compare page; canonical-distinct — informational intent, cross-link the compare)

- [ ] **Step 2: Insert idempotently** — for each, `insert ... onConflictDoNothing` on `(slug, locale)` (mirror the pattern in `src/db/seed-topics.ts`). Log inserted/skipped counts. Wrap in try/catch; exit 0 on DB-unreachable with a clear message (this is a user-run script).

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; `npx tsx scripts/seed-political-fb-cluster.ts` runs without a DB and prints the "DB unreachable — nothing seeded" path cleanly (cannot insert locally; the user runs it with `DATABASE_URL`). Commit:
```bash
git add scripts/seed-political-fb-cluster.ts
git commit -m "feat(blog): seed script for the 4 political-FB cluster posts (review-first)"
```

---

### Task 10: AEO / discovery wiring

**Files:**
- Modify: `src/lib/llms.ts` (index + full: a "Political advertising" grouping listing the pillar + guide + compare + glossary terms)
- Modify: `src/lib/facts.ts` (add a `specializations` array with the political-Facebook-advertising canonical facts)
- Modify: `src/app/sitemap.ts` (add the pillar as an explicit core entry; compare/glossary/guide flow through existing catalog loops already)

- [ ] **Step 1: `llms.ts`** — add a `politicalAdvertisingSection()` (index) listing `/political-facebook-ads-bangladesh` + the FB guide + the compare + the 5 glossary slugs, and include the pillar's answer text in `buildLlmsFull`. Insert into `buildLlmsIndex` after `factsSection()`.
- [ ] **Step 2: `facts.ts`** — add `specializations: [{ name: "Political Facebook Advertising", url: SITE.url+"/political-facebook-ads-bangladesh", compliant: true, notes: "Meta-authorized, 'Paid for by' disclaimer, Special Ad Category, one candidate per constituency" }]` to the returned object.
- [ ] **Step 3: `sitemap.ts`** — add `entry("/political-facebook-ads-bangladesh", "monthly", 0.9)` to the `core` array.
- [ ] **Step 4: Verify** — `npx tsx scripts/generate-llms.ts` then `grep -c political-facebook-ads-bangladesh public/llms.txt public/facts.json` (≥1 each); `npm run build` green; sitemap includes the pillar. Commit:
```bash
git add src/lib/llms.ts src/lib/facts.ts src/app/sitemap.ts public/llms.txt public/llms-full.txt public/facts.json
git commit -m "feat(aeo): surface the political-ad flagship in llms.txt, facts.json, sitemap"
```

---

### Task 11: Internal links + final verification + JOURNEY

**Files:**
- Modify: `src/app/election/page.tsx`, `src/content/services/political-pr.ts` (or the political-pr service page's related rail), `src/content/services/paid-ads.ts` — add ONE contextual, descriptive-anchor link each into `/political-facebook-ads-bangladesh`.
- Modify: `docs/JOURNEY.md` (STEP 22 entry)

- [ ] **Step 1: Add the 3 internal links** (descriptive anchors like "political Facebook advertising in Bangladesh"), placed in existing related/prose sections — do not disrupt layout.
- [ ] **Step 2: Full verification:**
```bash
npx tsc --noEmit                       # clean
npm run build                          # green
# SSR gate on the flagship (Task 4 Step 3 checks), plus:
grep -c 'political-facebook-ads-bangladesh' public/llms.txt public/facts.json
curl -s http://localhost:3000 >/dev/null 2>&1 || true   # (build-only; no server needed)
```
Confirm: flagship prerenders, 1 H1, answer-block, all schema types; glossary +5; compare +1; benchmark gated (no page); llms/facts/sitemap updated; no existing page regressed (spot-build homepage + a service page).
- [ ] **Step 3: JOURNEY entry** — append STEP 22 (what changed, why, next: user runs the blog seed script + fills benchmark). Commit:
```bash
git add -A
git commit -m "feat(political-fb): internal links + JOURNEY (STEP 22)"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** §3 tokens→T1; §6 kit→T2; §7 schema→T3; §5 flagship→T4; §8 glossary/compare/guide/benchmark→T5–T8; §8 blog→T9; §9 AEO wiring→T10; §9 internal links + §12 verification→T11. All spec sections mapped.
- **Placeholder scan:** benchmark `value:"TODO"` is intentional real-only gating (documented). No unresolved plan-TODOs.
- **Type consistency:** kit interfaces in T2 match consumption in T4; `specializedServiceSchema` signature (T3) matches its call (T4 Step 2); `Benchmark`/`Compare`/`GlossaryTerm`/`NewBlogPost` shapes reference the actual catalogs (executor opens each file first).
- **Verification adapted** to tsc/build/SSR-grep (no test harness), per Global Constraints.

## Execution note
Tasks 5–9 (glossary, compare, guide, benchmark, blog seed) are largely independent and parallelizable; Tasks 1→2→3→4 are sequential (kit + schema before flagship); Task 10–11 come last. The flagship (T4) is the critical path.
