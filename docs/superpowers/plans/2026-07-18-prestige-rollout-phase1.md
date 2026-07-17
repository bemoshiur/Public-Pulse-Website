# Prestige Rollout Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline) or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Convert the whole site to the restrained-luxury language via a base-token retheme, then rebuild the Header, Footer, and Homepage in the prestige style.

**Architecture:** Retheme existing Tailwind tokens (so every page inherits the new palette), make Fraunces the heading face via one global CSS rule, remove the CursorGlow motion, then rebuild the three highest-visibility surfaces using the prestige kit (`src/components/prestige/`) + prestige discipline.

**Tech Stack:** Next.js 16 App Router, Tailwind v3, Fraunces + Inter (`next/font`), existing components.

**Reference:** spec `docs/superpowers/specs/2026-07-18-prestige-rollout-phase1-design.md`.

## Global Constraints
- Branch `feat/prestige-rollout`. No deploy, no DB.
- **Verification per task:** `npx tsc --noEmit` clean + `npm run build` green + (for visual tasks) a Playwright screenshot review. No unit-test harness — don't add one.
- Retheme changes token VALUES only (class names unchanged) so no page needs per-color edits.
- Real-only copy; preserve tracking IDs + contact details; one H1 on the homepage; AnswerBlock/schema intact.
- The political-FB flagship uses independent `pr-*` tokens — must not regress.

---

### Task 1: Foundation retheme (palette + type + motion)

**Files:** Modify `tailwind.config.ts`, `src/styles/globals.css`, `src/app/layout.tsx`.

- [ ] **Step 1 — retheme base color tokens** in `tailwind.config.ts` (`theme.extend.colors`), replacing the VALUES:

```ts
"ink": "#18191B",
"ink-soft": "#3C3D3F",
"ink-mute": "#6E6B64",
"paper": "#F3F2EE",
"paper-alt": "#ECEAE4",
"paper-tint": "#DEDBD3",
"graphite": "#4C4C4C",           // unchanged
"brand-orange": "#BE451E",
"brand-orange-soft": "#CF5A2E",
"brand-orange-deep": "#A03A17",
```
Also update the legacy aliases that mirror these so they stay in sync: `brand-navy`→`#18191B`, `brand-navy-soft`→`#3C3D3F`, `brand-teal`/`brand-red`→`#BE451E`, `brand-teal-soft`→`#CF5A2E`, `brand-teal-deep`→`#A03A17`, `surface-alt`→`#ECEAE4`, `surface-tint`→`#DEDBD3`. Leave `cat-*` and `whatsapp` untouched.

- [ ] **Step 2 — Fraunces headings** — append to `src/styles/globals.css`:

```css
/* Prestige rollout: serif headings site-wide (Fraunces already loaded). */
h1, h2, h3 { font-family: var(--font-fraunces), "Charter", Georgia, serif; letter-spacing: -0.015em; }
/* opt-out for headings that must stay sans (mono/UI labels rendered as h*) */
h1.font-sans, h2.font-sans, h3.font-sans { font-family: var(--font-inter), system-ui, sans-serif; }
```

- [ ] **Step 3 — quiet motion** in `src/app/layout.tsx`: remove the `<CursorGlow />` mount (line ~123) and its import; keep `<ScrollProgress />`. (ScrollProgress restyle to a thinner/low-contrast bar is optional and can stay default — it already reads as subtle with the new palette.)

- [ ] **Step 4 — verify (visual regression, since color changed site-wide):** `npx tsc --noEmit` (clean) + `npm run build` (green). Then `npm start` and screenshot with Playwright at 1440px: `/`, `/services/political-pr`, `/blog`, `/political-pr/dhaka` (matrix), `/glossary/aeo`, `/political-facebook-ads-bangladesh`. Confirm: warm palette + serif headings read correctly, nothing illegible, cards separate from the warm ground (add a hairline where one disappears), flagship unaffected, 0 console errors on `/`. Fix any regression inline. Commit:
```bash
git add tailwind.config.ts src/styles/globals.css src/app/layout.tsx
git commit -m "feat(prestige): foundation retheme — warm palette, Fraunces headings, remove CursorGlow"
```

---

### Task 2: Header

**Files:** Modify `src/components/layout/Header.tsx` (read it first).

- [ ] **Step 1 — rebuild as a quiet editorial masthead:** warm-paper translucent sticky (`bg-paper/85 backdrop-blur`), **hairline bottom border** (`border-b border-paper-tint`) not a shadow; wordmark in `font-serif` ("Public " + `text-brand-orange` "Pulse"), restrained size; nav links `text-sm text-ink-mute tracking-wide hover:text-ink` with an orange underline on the active route; ONE compact CTA (small solid `bg-brand-orange` button or a hairline-bordered button). Preserve the existing mobile drawer behavior + all nav destinations. Keep it accessible (focus states, aria on the menu toggle).

- [ ] **Step 2 — verify:** `npx tsc --noEmit` clean; `npm run build` green; screenshot `/` top — header reads restrained + legible. Commit:
```bash
git add src/components/layout/Header.tsx
git commit -m "feat(prestige): editorial header — hairline, serif wordmark, single accent CTA"
```

---

### Task 3: Footer

**Files:** Modify `src/components/layout/Footer.tsx` (read it first).

- [ ] **Step 1 — rebuild as a refined close:** replace the "Let's make noise" mega-CTA with a dignified band — `font-serif` "Let's talk." + one `bg-brand-orange` button. Keep the column grid (brand / platform / company / sister concerns / contact) but restyle in prestige type + `border-paper-tint`/dark hairlines, links in a muted tone. Add a **mono metadata line** at the bottom (BIN, Trade License, Dhaka address, `info@publicpulse.com.bd`, phone) using `font-mono text-xs`. Dark ground stays (`bg-ink`) with disciplined orange only on the CTA + hovers. Preserve all links + the sister-concerns data.

- [ ] **Step 2 — verify:** `npx tsc --noEmit` clean; `npm run build` green; screenshot the footer. Commit:
```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(prestige): refined footer — quiet CTA + mono metadata line"
```

---

### Task 4: Homepage

**Files:** Modify `src/app/page.tsx` + `src/components/home/HeroPanel.tsx` (read both first).

- [ ] **Step 1 — replace the hero:** retire the avoora gradient-cloud `HeroPanel` (gradient panel, avatar pile, founder card). New restrained editorial hero: an eyebrow + `font-serif` display headline (one italic `text-brand-orange` accent word), a lede, a primary CTA (book/contact) + a quiet secondary, and a small **credibility strip of REAL operational facts** (Founded 2024 · Dhaka; 9 services in-house; BDT-billed from a registered BD entity; EN + Bangla) — NOT the `50+/300%` vanity stats. Use the prestige kit's `PrestigeHero` if it maps, else author inline with the same tokens. One H1.

- [ ] **Step 2 — restyle the sections** (services, stats/proof, process, selected results, testimonial, final CTA) to prestige: hairline dividers between sections, mono `§`-style section labels via `SectionHead`, `font-serif` headings, disciplined spacing + orange. Remove the marquee (default) or reduce to a single quiet ticker. Keep real content: `getFeaturedCaseStudies` data, real SERVICES. Do not introduce/worsen the placeholder stats (leave the existing `TODO(user)` as-is or swap to operational facts).

- [ ] **Step 3 — verify:** `npx tsc --noEmit` clean; `npm run build` green (homepage still `○` static, one H1); `npm start` + full-page screenshot of `/` at 1440 + 390px; 0 console errors; AnswerBlock/JSON-LD still present on `/`. Commit:
```bash
git add src/app/page.tsx src/components/home
git commit -m "feat(prestige): homepage — restrained editorial hero + prestige sections"
```

---

### Task 5: Final verification + JOURNEY

- [ ] **Step 1 — whole-site pass:** `npx tsc --noEmit` + `npm run build`; screenshot the 6 pages from Task 1 Step 4 again to confirm the finished Phase-1 state is cohesive (chrome + homepage fully prestige; inner pages palette-converted). Note any page that looks broken by the retheme for Phase 2/3.
- [ ] **Step 2 — JOURNEY** STEP 23 entry: Phase 1 done (foundation + chrome + homepage); next = Phase 2 (GradientHero/ProgrammaticPage/services). Commit:
```bash
git add docs/JOURNEY.md
git commit -m "feat(prestige): Phase 1 verification + JOURNEY STEP 23"
```

## Self-Review (plan author)
- **Spec coverage:** §3 foundation→T1; §4 Header→T2; §5 Footer→T3; §6 Homepage→T4; §7 verification→every task + T5. Covered.
- **Risk:** the retheme (T1) is the highest-risk step and carries the explicit visual-regression gate before any component rebuild.
- **Verification** adapted to tsc/build/screenshot (no test harness).
- **Type consistency:** reuses existing tokens (values changed only) + the shipped prestige kit; no new interfaces.
