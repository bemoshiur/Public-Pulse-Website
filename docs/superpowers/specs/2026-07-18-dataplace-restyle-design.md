# Dataplace-direction restyle — design spec

**Date:** 2026-07-18
**Branch:** `feat/dataplace-restyle`
**Companion:** the R&D teardown artifact (Dataplace anatomy + token reference) + `docs/superpowers/plans/2026-07-18-dataplace-restyle.md`

## Goal

Restyle publicpulse.com.bd (redesign #3) toward the **Dataplace Webflow aesthetic** — white ground, warm-grey **inset rounded panels** (20–32px radius), one **vivid orange** accent, **200px pill** buttons, and a single calm fade-up motion — while **keeping Fraunces** as the display serif and leaving the entire SEO/AEO/GEO layer untouched. This is a **visual reskin only**: token retheme + ~10 reusable section components + page recomposition. No content, schema, metadata, or URL changes.

## Locked decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | Display serif | **Keep Fraunces** | Already live + distinctive; ~90% of the feel without re-flowing every heading; keeps us one step off a clone. |
| 2 | Accent | **Vivid `#FE4A0F`** | Dataplace-exact; ~= the site's original avoora orange, so it reads as a homecoming. |
| 3 | Fidelity | **Inspired evolution** | Adopt the panel system + palette + motion; keep our own voice/content. Protects brand + SEO continuity. |
| 4 | Motion | **Retune existing ScrollReveal** (CSS + IntersectionObserver) | Matches Dataplace's zero-library ethos; no new dependency. |
| 5 | Signature artwork | **Original renders + our own product UI** | Dataplace's renders are licensed; we generate abstract art + compose floating cards from our own /manage dashboards. |

## Token deltas (Phase 0 — DONE, committed `f8524b0`)

Reconciled the two token sources (`tailwind.config.ts` colors + `globals.css :root` vars), which had diverged (prestige warm-stone in Tailwind vs stale avoora values in CSS).

| Token | Was | Now |
|---|---|---|
| `paper` | `#F3F2EE` warm stone | `#FFFFFF` white |
| `paper-alt` / `paper-tint` | `#ECEAE4` / `#DEDBD3` | `#F6F6F6` / `#F3F4F5` |
| `--panel` (new) | — | `#F6F7F7` (inset-panel grey) |
| `brand-orange` (+ soft/deep + legacy aliases) | `#BE451E` burnt | `#FE4A0F` vivid (`#FF6A37` / `#D63D0B`) |
| body ink | `#111` | `#212833` (heading ink `#16181C`) |
| `borderRadius.btn` | `6px` | `9999px` pill |
| `borderRadius.card` / `panel` | `8px` / `12px` | `14px` / `20px` (+ `panel-lg 32px`) |
| `.card` | brutalist: black border + `8px 8px 0` hard offset shadow | soft inset: grey fill, light `#E4E4E4` border, soft diffuse shadow |
| `.answer-block` | `#f5f5f5` bg, 8px radius | `--panel` bg, 14px radius (**class + `data-speakable` unchanged**) |
| `.scroll-progress` | rainbow orange/blue/teal | solid `#FE4A0F` |

Verified: `tsc` clean, `next build` green, SSR gate intact (1 H1 / `.answer-block` / JSON-LD / canonical on home + service + location), Playwright screenshots show the coherent shift.

**Phase 0 caveat (honest intermediate state):** this is the Dataplace *palette* on the *existing* layout. The dark full-bleed drama sections (homepage "One accountable team", CTA bands) and the avoora section grammar remain until Phase 2–3 convert them to inset-panel templates.

## Target section grammar (Phase 2)

Ten reusable typed components mirror Dataplace's economy (exact values in the R&D artifact):

`InsetHero` · `Manifesto` · `LogoStrip` · `FeatureRow` (alternating, hairline-top, checklist, pill CTA) · `TestimonialTabs` (asymmetric quote card + stat) · `SplitHeader` · `ThreeCardGrid` · `IconBand` · `ClosingCTA` · `Footer` (reskin). Shared primitives: `<Section size>` (3/5/7rem), `<Container>` (`max-w-[80rem] px-[5%]`), `<GreyPanel tone radius>`, `<Button variant>` (+ `<ArrowCircle>`), retuned `<ScrollReveal>` (fade-up 1000ms `cubic-bezier(.25,1,.5,1)`, `translateY(100px)`, stagger 0/100/200/300/400).

## Guardrails — the no-touch contract (from the codebase map)

These MUST survive verbatim through every phase. A careless visual refactor breaks each as noted:

- **`.answer-block` class name + `data-speakable`** — referenced by `speakable.cssSelector` in Article/QAPage/FAQPage schema. Recolor only; never rename/drop. Keep the 40–60 word answer prose.
- **`<h2 id="answer-question">`** inside AnswerBlock — keep as an H2 (recolor OK; do not convert to div/p).
- **One `<h1>` per page** in SSR HTML — never add a second or demote it; section headings stay `<h2>`.
- **Every `<JsonLd>` mount** in every page's JSX + all `src/lib/schema.ts` builders — pure data, do not touch. Site-wide Organization/WebSite/LocalBusiness emit from `layout.tsx`.
- **`generateMetadata`/`buildMetadata`** (canonical, hreflang, OG, Twitter, robots) on every page — leave verbatim.
- **FAQ `<dl>/<dt>/<dd>`** (or `<details>`) semantics + ≥3 count — `faqPageSchema` mirrors it; don't flatten to div/span.
- **`<Breadcrumbs>` structure** (`<nav aria-label>`, `<ol>/<li>`, `aria-current`) — emits BreadcrumbList; restyle classes only.
- **`html.reveal-ready` gate + 2.5s kill-switch + no-JS fallbacks** — the crawler-visibility contract; keep the mechanism, retune values only.
- **`prefers-reduced-motion` + `pointer:coarse` guard blocks** — must keep forcing final states over any new easing/duration.
- **`sitemap.ts` / `robots.ts` / `llms.ts` / `facts.json`** — non-visual; zero edits (do not bump `CATALOG_LASTMOD` for a reskin; keep the full AI-crawler allow roster).
- **Crawl-error fixes from STEP 28** — `dynamicParams=true` + `permanentRedirect` fallbacks on the [slug] routes, the `/case-studies/seed-*` + `/group` redirects, and the `getIndustry()` link filter — preserve; they are Search-Console fixes, not decoration.
- **Real-only content rules** — the `caseStudies.length > 0` hide-when-empty guard, the audit-approved 9/9/10/2 coverage stats (no reverting to 50+/300% vanity numbers), anonymous testimonial stays until a real attribution lands.

## Regression gate (every phase, before "done")

Per changed template: exactly `1` `<h1>`, `.answer-block[data-speakable]` present, `application/ld+json` count unchanged, `rel="canonical"` present, FAQ `<dl>` intact — checked in the built HTML (`.next/server/app/...`). Plus: `tsc` clean, `next build` green, a Playwright screenshot, and (before any deploy) the STEP 28 curl matrix confirming no route regressed to 404/502.
