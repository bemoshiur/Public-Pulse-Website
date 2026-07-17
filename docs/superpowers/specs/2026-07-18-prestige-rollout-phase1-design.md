# Design Spec — Prestige Rollout Phase 1: Foundation + Chrome + Homepage

**Date:** 2026-07-18
**Branch:** `feat/prestige-rollout` (off `feat/political-fb-flagship`)
**Status:** Approach + phase plan approved → ready for design review
**Precedent:** the restrained-luxury language + prestige kit shipped with the political-FB flagship (STEP 22).

---

## 1. Goal

Begin the **full-site conversion** to the "restrained luxury / institutional prestige" language (approved direction). Phase 1 flips the whole site's **palette + type + motion** at once via a base-token retheme, then rebuilds the three highest-visibility surfaces — **Header, Footer, Homepage** — fully in the prestige language. After Phase 1 the entire site reads as a restrained-luxury agency; later phases refine each page's *layout*.

## 2. Scope

**In scope (Phase 1):**
- **Foundation retheme** — base Tailwind tokens (paper/ink/orange), heading typography (Fraunces), and global motion posture (remove CursorGlow).
- **Header** rebuilt in prestige.
- **Footer** rebuilt in prestige.
- **Homepage** ([src/app/page.tsx](../../src/app/page.tsx) + [src/components/home/HeroPanel.tsx](../../src/components/home/HeroPanel.tsx)) rebuilt in prestige — new restrained hero + prestige treatment of every section.

**Out of scope (later phases, separate specs):**
- **Phase 2** — `GradientHero`, `ProgrammaticPage` (~60 location/industry/matrix/glossary/guide/compare pages), service index + detail.
- **Phase 3** — blog index + detail, about, contact, pricing, election, case-studies, `AuroraGradient` usages, category-color system.
- No deploy; no DB.

## 3. Foundation retheme (converts the whole site at once)

### 3.1 Base color tokens ([tailwind.config.ts](../../tailwind.config.ts))
Retheme the existing token *values* (class names unchanged, so every page inherits the new palette):

| Token | Now | Phase 1 | Note |
|---|---|---|---|
| `paper` | `#FFFFFF` | `#F3F2EE` | warm stone ground |
| `paper-alt` | `#F5F5F5` | `#ECEAE4` | warm alt sections |
| `paper-tint` | `#E3E3E3` | `#DEDBD3` | warm tint / dividers |
| `ink` | `#111111` | `#18191B` | prestige ink (near-identical) |
| `ink-soft` | `#222222` | `#3C3D3F` | body-on-paper |
| `ink-mute` | `#5D5D5D` | `#6E6B64` | warm muted |
| `brand-orange` | `#FF5911` | `#BE451E` | deepened burnt orange (disciplined) |
| `brand-orange-soft` | `#FF7A3D` | `#CF5A2E` | |
| `brand-orange-deep` | `#E84A00` | `#A03A17` | |

Legacy aliases (`brand-navy/teal/red`) already point at these — they follow automatically. The 9 `cat-*` category colors are **left as-is** (Phase 3 decides their fate; they only appear on service/blog cards).

**Risk + mitigation:** warming every white surface can expose elements that assumed pure white (e.g. images, un-bordered cards). Mitigation: verify each major page type visually after the retheme (build + screenshot homepage, a service page, blog, a matrix page); fix any card that needs a hairline to separate from the warm ground. The deepened orange is intended and low-risk.

### 3.2 Typography — Fraunces headings ([globals.css](../../src/styles/globals.css))
Headings become the serif. Add a scoped global rule so all `h1/h2/h3` use Fraunces **without** editing every component:
```css
h1, h2, h3 { font-family: var(--font-fraunces), "Charter", Georgia, serif; letter-spacing: -0.015em; }
```
The existing `text-display/h1/h2` size tokens carry very tight negative tracking tuned for Inter (avoora −8px); Fraunces needs looser tracking, so the rule resets it. Components that must stay sans (rare — e.g. a mono/UI label rendered as an `h3`) opt out with `font-sans`. Body stays Inter. Fraunces is already loaded (from STEP 22).

### 3.3 Motion posture ([layout.tsx](../../src/app/layout.tsx))
- **Remove `CursorGlow`** (the cursor spotlight — antithetical to restraint).
- **Keep `ScrollProgress`** but as a thin, low-contrast bar (restyle to `bg-brand-orange/60`, 2px).
- `ScrollReveal` fade-ups stay (already subtle). `AuroraGradient` usages are Phase 3.

## 4. Header ([src/components/layout/Header.tsx](../../src/components/layout/Header.tsx))
Rebuild as a quiet, editorial masthead:
- Warm-paper translucent sticky, **hairline bottom border** (not shadow).
- Wordmark in Fraunces ("Public **Pulse**", the "Pulse" in deepened orange) — restrained, not oversized.
- Nav: smaller, letter-spaced, `ink-mute` → `ink` on hover; current-page underline in orange.
- One CTA, small: bordered/hairline "Book a call" or a compact solid burnt-orange button — a single accent, not a loud pill.
- Mobile: refined drawer (keep existing behavior, prestige styling).

## 5. Footer ([src/components/layout/Footer.tsx](../../src/components/layout/Footer.tsx))
From the "Let's make noise" mega-bold CTA to a **refined close**:
- A quiet CTA band ("Let's talk." in Fraunces, one burnt-orange button) — dignified, not shouty.
- Column grid restyled in prestige type + hairlines; the sister-concerns + nav links in `ink-mute`.
- A **mono metadata line** (BIN, Trade License, Dhaka address, contact) — the dossier texture, reused from the flagship footer feel.
- Dark ground stays but shifts to the prestige near-black; disciplined orange only on the one CTA + hovers.

## 6. Homepage ([src/app/page.tsx](../../src/app/page.tsx) + [HeroPanel.tsx](../../src/components/home/HeroPanel.tsx))
The current avoora gradient-cloud hero + marquee is the least restrained thing on the site — **redesign the hero**, refine the rest:
- **Hero:** replace the gradient panel with a restrained editorial hero — Fraunces display headline (italic-accent word), a lede, a single primary CTA + a quiet secondary, and a small credibility strip of **real operational facts** (Founded 2024 · Dhaka; 9 services in-house; BDT-billed from a registered BD entity; EN + Bangla) — NOT the unverified `50+/300%` vanity stats (real-only, per the audit).
- **Marquee:** remove, or reduce to a single quiet client/industry ticker (decide during build; default = remove for restraint).
- **Sections** (services, stats, process, selected results, testimonial, final CTA): keep the structure, restyle to prestige — hairline dividers, `§`-style mono section labels, Fraunces section headings, `pr`-consistent spacing, disciplined orange. Reuse prestige-kit primitives (`SectionHead`, `CardGrid`, `Framework`, `BudgetTable` where a table fits) where they map cleanly; otherwise apply the same token/type discipline inline.
- Keep real content only (existing case-studies data layer, real service data). The placeholder homepage stats (`50+/300%+`) remain a known `TODO(user)` — not introduced or worsened here.

## 7. Verification / success criteria
- `npx tsc --noEmit` clean · `npm run build` green.
- **Visual regression pass** (build + screenshot, since color changes site-wide): homepage, one service page, blog index, a matrix page, a glossary term, the political-FB flagship — confirm the warm palette + Fraunces headings read correctly and nothing is illegible or broken. Zero console errors on the homepage.
- The flagship (`/political-facebook-ads-bangladesh`) still renders correctly (it uses `pr-*` tokens, independent of the base retheme — confirm no clash).
- `prefers-reduced-motion` still disables motion; CursorGlow gone; ScrollProgress subtle.
- One H1 on the homepage; AnswerBlock/schema unaffected.

## 8. Branch & rollout
- `feat/prestige-rollout` off `feat/political-fb-flagship`. Not merged/deployed until the user asks.
- Phases 2–3 are separate specs. Each is independently shippable.

## 9. Open questions
None blocking. (Homepage stats remain a pre-existing user TODO; marquee removal is a build-time judgment defaulting to "remove.")
