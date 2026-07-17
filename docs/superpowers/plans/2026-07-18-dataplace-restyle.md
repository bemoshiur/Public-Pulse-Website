# Dataplace-direction restyle — implementation plan

> **For agentic workers:** this is a **visual restyle**, not TDD feature work. "Verify" each task = (1) `tsc` clean, (2) `next build` green, (3) the SSR regression gate (below), (4) a Playwright screenshot. Steps use `- [ ]`.

**Goal:** Reskin publicpulse.com.bd to the Dataplace aesthetic (white + warm-grey inset panels, vivid `#FE4A0F`, 200px pills, Fraunces kept, one fade-up motion) with zero SEO/content/URL changes.

**Architecture:** Token retheme (done) → shared primitives → ~10 typed section components → recompose each page from blocks → original artwork → motion polish → SEO regression + ship.

**Tech:** Next.js 16 App Router, Tailwind v3, TS strict, existing `ScrollReveal`/`Container`, SST/OpenNext.

## Global constraints (apply to EVERY task)

- **No-touch SEO contract** — see the spec's "Guardrails" section. `.answer-block`+`data-speakable`, one `<h1>`, every `<JsonLd>`, `generateMetadata`, FAQ `<dl>`, `<Breadcrumbs>`, `reveal-ready` gate, reduced-motion/coarse guards, `sitemap.ts`/`robots.ts`/`llms.ts`, STEP-28 redirect fallbacks, real-only guards.
- **Regression gate (per changed template, in built HTML):** `grep -c "<h1"` = 1 · `grep -c "answer-block"` ≥ 1 · `grep -c "application/ld+json"` unchanged vs baseline · `rel="canonical"` present.
- **Motion:** animate `transform`+`opacity` only; every new preset lives inside `html.reveal-ready` and the reduced-motion/coarse guards. One fade-up preset only.
- **Branch-only.** No deploy until Phase 6 + explicit go. Rollback = STEP-27 prestige tip `7ce485b`.

---

## Phase 0 — Token retheme ✅ DONE (`f8524b0`)

Whole-site palette/radius/accent shift. See spec "Token deltas". Verified green + SSR-gate intact.

---

## Phase 1 — Shared primitives

**Files:** `src/components/ui/{Section,GreyPanel,Button,ArrowCircle}.tsx` (new), `src/components/ui/Container.tsx`, `src/components/motion/ScrollReveal.tsx`, `src/components/motion/Stagger.tsx`, `src/styles/globals.css`.

**Interfaces produced:** `<Section size="sm|md|lg" tone?>`, `<GreyPanel radius="20|32" tone>`, `<Button variant="primary|iconGhost|iconSolidSmall|iconPill" href?>`, `<ArrowCircle scheme="onLight|onDark">`.

- [ ] **`<Section>`** — `py` 3/5/7rem (responsive 2/3/4rem steps at 767) + optional `bg-paper-alt`. Replaces the ad-hoc `py-16 md:py-20` scattered in pages.
- [ ] **`<GreyPanel>`** — `bg-paper-alt`/`bg-[--panel]`, `rounded-panel`/`rounded-panel-lg`, `overflow-hidden` — the signature inset container.
- [ ] **`<Button>` + `<ArrowCircle>`** — wrap the `.btn` classes; add the arrow-in-circle SVG (two schemes) as the recurring CTA tell. Renders `<button>` or `<Link href>`.
- [ ] **`<Container>`** — retune to `max-w-[80rem] px-[5%]` (from the current `max-w-container` 1280 + gutters).
- [ ] **Retune ScrollReveal** — `globals.css .reveal` (186-197): drop `scale(1.05)`, start `translateY(100px)`, `1000ms cubic-bezier(.25,1,.5,1)`; `.reveal-v2` default distance 24→100px. `motion/ScrollReveal.tsx` L38 `distance 24→100`; `motion/Stagger.tsx` L21 `step 80→100, distance 24→100`. Keep all `reveal-ready` + reduced-motion guards.
- [ ] **Verify** — build green; a page using an old `.reveal` still fades in (now 100px/1s); reduced-motion still zeroes it.

## Phase 2 — Section-grammar components

**Files:** `src/components/sections/{InsetHero,Manifesto,LogoStrip,FeatureRow,TestimonialTabs,SplitHeader,ThreeCardGrid,IconBand,ClosingCTA}.tsx` (new), `src/components/layout/{Header,Footer}.tsx`.

Typed components with content props; exact values from the R&D artifact (T1–T10). Each composes `<Section>`/`<GreyPanel>`/`<Button>`.

- [ ] **InsetHero** — rounded grey panel, centered Fraunces H1 (accepts `<em>` accent), artwork slot (next/image layer), pill CTA. **Must accept the AnswerBlock as a child slot** (homepage/service heroes render it).
- [ ] **FeatureRow** (`reverse?`) — `grid lg:grid-cols-2`, `border-t-[1.4px] border-hairline mt-32 first:mt-0`, media slot + Fraunces H3 + checklist (`<ul>` + check SVG) + pill CTA.
- [ ] **TestimonialTabs** — asymmetric quote card (`rounded-[18px_0_80px_18px]`), stat column, logo tab bar (headless React tab state). Keep the corner scoop.
- [ ] **Manifesto · SplitHeader · ThreeCardGrid · IconBand · ClosingCTA · LogoStrip** — the remaining patterns.
- [ ] **Header reskin** — token accent auto-updates; apply pill CTA; hairline. Keep the NAV/SECONDARY href arrays verbatim (internal-link graph).
- [ ] **Footer reskin** — keep dark `bg-ink` for contrast; visible hairline divider; pill "Start a project". Keep all link columns + NAP/BIN/Trade-License entity data verbatim.
- [ ] **Verify** — Storybook-free: drop each into a scratch route or the homepage; screenshot; build green.

## Phase 3 — Page recomposition (SEO frozen)

Recompose each page from Phase-2 blocks. **Only the visual wrapper changes.** Order = highest traffic first.

- [ ] **`ProgrammaticPage.tsx` + `GradientHero.tsx`** (cascades to ~60 pages: services/locations/industries/glossary/guides/compare/matrix) — restyle FAQ (L81), Related rail (L102), closing dark CTA (L136) to inset panels; `DefaultSalesPanel` (L106-131) to a Dataplace card. **Preserve** the single `<h1>` (GradientHero L69), AnswerBlock, `<Breadcrumbs>`, FAQ `<dl>`.
- [ ] **`src/app/page.tsx`** (homepage) — HERO→InsetHero (keep the one `<h1>` + `<em>` accents + AnswerBlock at L90); SERVICES dark grid → light FeatureRows/ThreeCardGrid; STATS→light metric row (keep 9/9/10/2 values); PROCESS→cards (already softened via `.card`); RESULTS→remove the triple-radial rainbow (`caseStudyGradient` L409) → single-hue, keep `caseStudies.length>0` guard; TESTIMONIAL→TestimonialTabs (keep anonymous label until real attribution); FINAL CTA→ClosingCTA.
- [ ] **`src/app/services/[slug]/page.tsx`** — dark PROCESS (L139-161) + dark CTA (L305-322) → inset panels; deliverable/why-us/faq cards → Dataplace panels. Keep Service/FAQ/Breadcrumb schema + one H1.
- [ ] **`src/app/blog/page.tsx` + `[slug]`** — featured-post treatment (first card larger) + card grid + pill filters; PostBody restyle **keeping** heading anchor ids, ArticleTOC, glossary cross-links, Sources block, Article schema.
- [ ] **`src/app/pricing/page.tsx`** — Dataplace pill-tab billing toggle + tint one featured plan card + check-row styling. Keep pricing schema + FAQ `<dl>`.
- [ ] **`src/app/about/page.tsx`** — split-header hero; reduce Parallax/TiltCard/Magnetic → single fade-up; ProofTile/CredentialTile → inset panels. Keep AboutPage + FAQ schema + one H1.
- [ ] **`src/app/contact/page.tsx`** — replace the 4 hardcoded `#17181C` panels (L82/135/166/197) with token cards; "Pick your path" → form-panel pattern. Keep ContactPage schema + form (honeypot/rate-limit wiring untouched).
- [ ] **`src/app/case-studies/page.tsx` + `CaseStudiesFilter.tsx`** — metric card grid, drop TiltCard for fade-up, active pill → new orange. Keep real-only data path + schema.
- [ ] **Per page: run the regression gate** before moving on.

## Phase 4 — Signature artwork

**Files:** `public/art/*` (new), the media slots in InsetHero/FeatureRow, `next.config.ts` images.

- [ ] **Original abstract renders** — generate silk-ribbon hero art (Spline/Blender/gen-AI). **Do not use Dataplace's PNGs** (licensed).
- [ ] **Floating UI cards** — compose from our own /manage dashboards, reports, real metrics, as real DOM (next/image layers), retina-crisp.
- [ ] **Image pipeline** — AVIF/WebP, correct `sizes` for the big panels, `width`/`height` for CLS=0.

## Phase 5 — Motion + a11y polish

- [ ] Apply the fade-up cadence site-wide (section 200 / card 100 stagger); color-only button hover (drop the translateY lift for Dataplace flatness — optional).
- [ ] FAQ accordions → 400ms grid-rows + chevron rotate (keep `<details>`/`<dl>` semantics).
- [ ] Retire/neutralize leftover rainbow decoratives (`gradient-text` on /about, `aurora` usages) toward single-orange or remove. Confirm reduced-motion + coarse guards cover every new preset.

## Phase 6 — SEO regression + ship

- [ ] **Full regression sweep** — run the STEP-28 curl matrix (every route class 200/301/308, never new 404/502) + the per-template SSR gate across all 130+ prerendered pages (script it: grep each `.next/server/app/*.html` for 1 H1 / answer-block / json-ld count / canonical).
- [ ] **Schema unchanged** — diff `application/ld+json` blocks on a sample of each page type vs the pre-restyle baseline (should be byte-identical — restyle touches no schema).
- [ ] **Lighthouse** — SEO 100, a11y ≥95 (`#FE4A0F` on white contrast, focus states on 60px serif), Best Practices ≥95.
- [ ] **Deploy** — `AWS_PROFILE=default bash scripts/deploy.sh production`; live-verify (curl matrix + one Rich-Results check); JOURNEY entry; ping IndexNow.

## Self-review notes

- Every phase is independently shippable and reversible (branch, no deploy until Phase 6).
- Phase 3 is the bulk; `ProgrammaticPage`+`GradientHero` first gives the biggest surface for the least code.
- Rough total ~8–11 working days; Phase 0 (done) already shifted the whole palette.
