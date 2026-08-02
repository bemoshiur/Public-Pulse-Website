# Public Pulse — Growth Engine: SEO · AEO · GEO · Traffic (Master Analysis)

> **What this document is.** A deep, code-grounded audit of every discoverability and traffic-generation system built into publicpulse.com.bd. Every claim below maps to a real file and value in this repo. It is the "how the machine actually works" companion to the strategy playbook in [SEO-AEO-GEO.md](SEO-AEO-GEO.md).
>
> **Site:** https://publicpulse.com.bd · Next.js 15/16 App Router · SST/OpenNext on CloudFront+Lambda+S3 · Neon Postgres · **136 prerendered pages** live.
> **Last synced to code:** 2026-07-18 (post Dataplace restyle + Search-Console crawl-fix deploy).

---

## 0. The core thesis

Three audiences consume the **same HTML output**, so we optimise once and win three channels:

| Layer | Audience | What it wants | Our answer |
|---|---|---|---|
| **SEO** | Googlebot, Bingbot ranking by classic signals | Crawlable, canonical, fast, structured | Per-route metadata + 25 JSON-LD builders + hreflang sitemap + zero-404 crawl hygiene |
| **AEO** *(Answer Engine Optimization)* | Google AI Overviews, Bing Copilot, voice | A short, liftable, factual answer + FAQ schema | `<AnswerBlock>` (40–60w, `data-speakable`) + `FAQPage`/`QAPage` on every content page |
| **GEO** *(Generative Engine Optimization)* | ChatGPT, Claude, Perplexity, Gemini browsing | Machine-ingestible ground truth + permission to cite | `llms.txt` + `llms-full.txt` + `facts.json` + explicit AI-crawler allow + CC-BY citation grant |

**The unifying rule:** *render the answer, in plain HTML, at the top of the page, with explicit schema, and let all three audiences read it.*

---

## 1. Traditional SEO layer

### 1.1 Per-route metadata — `src/lib/seo.ts` (`buildMetadata`)

Every page exports `generateMetadata` (or a static `metadata`) built through **one helper**, so nothing ships without the full set:

- **`title`** (≤60 char guard, dev-warns if longer) · **`description`** — **auto-clamped to ≤160 chars at a word boundary** (`clampDescription`) so Google never truncates mid-word; full copy stays on-page.
- **`alternates.canonical`** — absolute, self-referencing, on every page.
- **`alternates.languages`** — `en` + `x-default` on every page; `bn-BD` merged in where a Bangla twin exists (`alternateLanguages`).
- **`openGraph`** (type/url/title/description/siteName/locale/image 1200×630) + **`twitter`** (`summary_large_image`, `@publicpulse_bd`).
- **Per-page OG images** via the dynamic `/og?title=&eyebrow=` factory (`useDynamicOg`) — each service/blog/glossary page gets a distinct card instead of a shared placeholder.
- **Geo meta** (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) + app hints + `theme-color`.
- **`robots`** — index/follow with `max-image-preview:large`, `max-snippet:-1`; flips to `noindex,nofollow` when `noIndex` is passed (admin/utility).

### 1.2 One `<h1>` per page — enforced in SSR

Every page renders **exactly one `<h1>`** in the server HTML (verified in `.next/server/app/*.html`, not post-hydration). Section headings are `<h2>`/`<h3>`. The regression sweep flags any page with `H1 != 1`; the only pages that legitimately have zero are **redirect stubs** (`/research`, `/book`, pruned slugs).

### 1.3 Sitemap — `src/app/sitemap.ts`

- **App-Router native**, `dynamic = "force-static"`, `revalidate = 3600`.
- **Stable `CATALOG_LASTMOD` constant** for static/programmatic URLs (avoids the "every rebuild re-stamps `Date.now()`" lastmod-inflation antipattern); real `publishedAt` for DB content.
- Enumerates: core pages · 9 services · 11 locations · 12 industries · 28 glossary terms · 5 guides · 5 compares · the pruned service×city / service×industry matrix · **121 published blog posts (EN + BN)**.
- **`xhtml:link` hreflang alternates** (`en` / `x-default`, `bn-BD` when a BN twin exists) per entry.
- Image sitemap entries carried on blog/service URLs.

### 1.4 `robots.txt` — `src/app/robots.ts` (the AI-visibility policy)

**~45 named user-agents.** AI assistants are **explicitly allowed** — visibility to them is the strategy, not a risk:

```
Allowed AI/answer crawlers: GPTBot · OAI-SearchBot · ChatGPT-User · ClaudeBot ·
anthropic-ai · Claude-Web · PerplexityBot · Perplexity-User · Google-Extended ·
Googlebot-Extended · Applebot-Extended · Meta-ExternalAgent · Meta-ExternalFetcher ·
Amazonbot · Bytespider · CCBot · Cohere-AI · DuckAssistBot · Diffbot · YouBot · PetalBot
Classic: Googlebot(+Image/News) · Bingbot · Slurp · DuckDuckBot · YandexBot · Baiduspider · Applebot
Social unfurlers: facebookexternalhit · Twitterbot · LinkedInBot · WhatsApp · Slackbot · Discordbot · TelegramBot · Pinterest · redditbot
Disallow (all agents): /manage · /manage/ · /api/auth · /api/newsletter
Host + Sitemap declared.
```

> **Standing policy:** never drop the AI-crawler allow rules. If the policy ever changes, it must be documented in [JOURNEY.md](JOURNEY.md).

### 1.5 Internal-link graph

- **Breadcrumbs** on every deep page (visible `<nav aria-label="Breadcrumb">` + `BreadcrumbList` JSON-LD).
- **Contextual rails:** service pages surface a "Practitioner guides on X" rail (blog posts whose grounding cites the service slug, via `getPostsBySourceRef`); locations link their aligned services; the programmatic template emits a "Related" rail.
- **Body auto-linking:** blog `PostBody` auto-links any glossary term (EN + BN alias) to `/glossary/<slug>` — a deterministic, zero-effort internal-link web.
- **Footer + header** carry the full section map (services, pricing, guides, glossary, compare, locations, industries, search, legal) — site-wide link equity distribution.

### 1.6 Crawl hygiene — zero 404s, zero 5xx for removed URLs

This is a **hard standing rule**: no crawlable URL may return a raw 404 or 502. The system that enforces it:

- **`next.config.ts` — 17 permanent (301) redirects** for old WordPress URLs with a modern equivalent (`/our-services`→`/services`, `/our-team`→`/about`, `/group`→`/about`, retired `/bn/*`→English, specific ghost blog slugs, etc.).
- **`src/middleware.ts` — 410 GONE** for ~23 legacy WordPress/theme-demo path patterns (`/wp-*`, `/product`, `/tf-*`, `/checkout-2`, `/sample-page`, `/home-XX`, `*.php`…) — tells Google to **deindex** cleanly (vs. a 404 it re-checks for months). Also 308s `/case-studies/seed-*` → hub.
- **Dynamic `[slug]` routes: `dynamicParams = true` + redirect-on-miss.** *(This fixed a real production bug — see §9.)* Unknown service/glossary/guide/compare/location/industry slugs `permanentRedirect` (308) to their hub; `/research/*` 307s to `/guides` while gated. **Result: every removed/unknown URL resolves to a live, relevant page.**
- **Matrix prune 308s:** the 119 pruned service×city/industry combos 308-redirect to their parent.

### 1.7 Performance / Core Web Vitals — `next.config.ts` + caching

- **Images:** AVIF→WebP, tuned `deviceSizes`/`imageSizes`, **30-day `minimumCacheTTL`**, `next/image` everywhere, `fetchpriority=high` on LCP, width/height on all (CLS budget = 0).
- **Bundle:** `optimizePackageImports: ["lucide-react"]` — each page bundles only the icons it uses.
- **Rendering:** SSG/ISR by default. `revalidate` ladder across routes — `0` (dynamic/admin), `300` (blog posts), `3600` (blog/case-study indexes, sitemap), `86400` (per-post OG). Public visitor GETs make **zero DB calls** (data layer wrapped in `unstable_cache` + tag invalidation; CloudFront `s-maxage` + `stale-while-revalidate`).
- **Motion:** transform/opacity only; a single fade-up preset; `prefers-reduced-motion` + `pointer:coarse` fully disable it — no INP/CLS cost.
- **Security headers** (HSTS preload, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) applied site-wide — a Best-Practices/Lighthouse signal.

---

## 2. Structured data — the knowledge graph (`src/lib/schema.ts`)

**25 typed JSON-LD builders emitting ~48 distinct `@type`s.** Never hand-rolled — the typed builders enforce required fields and stable `@id` cross-links so the entities form one graph, not scattered blobs.

### 2.1 Builders (function → primary `@type`)

| Builder | Emits | Where used |
|---|---|---|
| `organizationSchema()` | **Organization** (knowledge-panel candidate) | site-wide (`layout.tsx`) |
| `websiteSchema()` | **WebSite** + **SearchAction** | site-wide |
| `localBusinessSchema()` | **LocalBusiness** (geo, opening hours, city-overridable) | site-wide + `/locations/[city]` |
| `professionalServiceSchema()` | **ProfessionalService** + real `Offer→Service` `OfferCatalog` | site-wide |
| `serviceSchema()` / `specializedServiceSchema()` | **Service** (+ `isRelatedTo`) | `/services/[slug]`, flagship |
| `articleSchema()` | **Article** (Org author, `speakable`) | blog posts, compares |
| `faqPageSchema()` | **FAQPage** (+ `speakable`) | every content page with ≥3 FAQs |
| `qaPageSchema()` | **QAPage** (`answerCount`) | flagship, Q&A surfaces |
| `howToSchema()` | **HowTo** (`totalTime`, `tool[]`, `HowToStep`) | `/guides/[slug]` |
| `definedTermSchema()` / `definedTermSetSchema()` | **DefinedTerm** / **DefinedTermSet** | glossary term + index |
| `datasetSchema()` | **Dataset** | `/research/[slug]` benchmarks |
| `reviewSchema()` / `aggregateRatingSchema()` | **Review** / **AggregateRating** | case studies (real testimonials only) |
| `breadcrumbSchema()` | **BreadcrumbList** | every deep page |
| `itemListSchema()` / `collectionPageSchema()` | **ItemList** / **CollectionPage** | index pages |
| `webPageSchema()` | **WebPage** (+ `speakable`) | pricing, press |
| `aboutPageSchema()` / `contactPageSchema()` | **AboutPage** / **ContactPage** | /about, /contact |
| `siteNavigationSchema()` | **SiteNavigationElement** | header nav |
| `industrySchema()` | Industry service context | `/industries/[industry]` |
| `pricingSchema()` | **OfferCatalog** of real BDT tiers | /pricing |

Supporting `@type`s woven in: `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification`, `ContactPoint`, `Offer`, `PriceSpecification`, `UnitPriceSpecification`, `MonetaryAmount`, `QuantitativeValue`, `PropertyValue`, `ImageObject`, `SpeakableSpecification`, `EntryPoint`, `ReadAction`, `Place`/`City`/`Country`/`AdministrativeArea`, `Person`.

### 2.2 The entity graph (why the `@id`s matter)

```
Organization  @id …/#organization
  ├─ parentOrganization → Organization (Pulse Group)  ← deliberate AEO brand-family signal
  ├─ knowsAbout: [9 service types + AEO/GEO/PR]        ← entity disambiguation
  ├─ knowsLanguage: [en, bn]
  ├─ contactPoint: [sales, customer-service + WhatsApp]
  ├─ identifier: [BIN, Trade License as PropertyValue] ← "this is a real registered entity"
  ├─ image: square /favicon-192 (logo)
  └─ sameAs: [ …see §4… ]
WebSite  @id …/#website  → publisher = Organization @id, potentialAction = SearchAction
LocalBusiness / ProfessionalService → parentOrganization + provider cross-ref the Org @id
Service / Article / Dataset → provider / publisher → Org @id
```

Every page-level schema references the site Org by **stable `@id`** rather than re-declaring it — so Google/answer-engines resolve one consolidated entity. A shared `SAME_AS` constant feeds Organization + LocalBusiness + ProfessionalService identically (entity consolidation).

**Real-only guardrails baked in:** `reviewSchema` `rating` is optional (case-study Review is quote-only until a real testimonial exists); no fabricated `AggregateRating`; benchmark `Dataset` renders **only** when `published:true`.

---

## 3. AEO layer — being the quoted answer

### 3.1 `<AnswerBlock>` — `src/components/seo/AnswerBlock.tsx`

The single most important AEO surface. On **every** long-form page, at the top, above the fold:

- **40–60 words**, plain prose, subject-verb-object first sentence, brand named once, no list markup, no superlatives.
- Rendered as `<div class="answer-block" data-speakable>` (+ optional `<h2 id="answer-question">`).
- The class `.answer-block` is the **`speakable.cssSelector`** referenced by `articleSchema`/`faqPageSchema`/`webPageSchema`/`collectionPageSchema` → tells voice/answer engines *"this exact block is the liftable answer."*
- `llms.txt` explicitly instructs models: *"When quoting, prefer each page's AnswerBlock."*

### 3.2 FAQ / QAPage everywhere

- Every service/location/industry/glossary/guide/compare/about/contact/pricing page renders **≥3 FAQs** as semantic `<dl>/<dt>/<dd>` (or `<details>`) → mirrored by `FAQPage` schema. The ≥3 count is a hard quality-gate.
- The political-FB flagship adds `QAPage` with `answerCount`.

### 3.3 `<KeyTakeaways>` — labelled extractable facts

`src/components/seo/KeyTakeaways.tsx` renders a labelled facts box (used on `/research`) — a second liftable surface engines can pull as a bullet answer.

---

## 4. GEO layer — feeding the generative engines

### 4.1 `llms.txt` — the curated model index (`src/lib/llms.ts`)

Generated **from the live DB at deploy** (not a frozen file). Live count: **121 `/blog/` entries**. Sections:

`## Canonical facts (safe to cite verbatim)` · `## Pricing (starting points, BDT)` · `## Research — first-party benchmarks (cite these)` · `## Specialization — Political Facebook advertising` · `## Services` · `## Guides (HowTo)` · `## Comparisons` · `## Locations covered` · `## Industries served` · `## Glossary (canonical BD definitions)` · `## Blog (N published guides)` · `## How to cite us`.

### 4.2 `llms-full.txt` — the full-text ingestion corpus

Concatenated verbatim depth: every service (deliverables, 5-step process), locations, industries, glossary, guides, compares, case studies, and **all published blog-post bodies** — plus the citation grant. Grows automatically as content is published.

### 4.3 `facts.json` — machine-readable ground truth (`src/lib/facts.ts`)

A structured endpoint of unambiguous facts for engines that prefer JSON over prose: **NAP**, legal IDs (`bin`, `tradeLicense`), `services[]` (name+url), `coverage`, `pricing[]` (BDT starting points), `sameAs[]`, `specializations[]` (named offerings at explicit routes), and **`statistics[]`** — populated **only** from `published:true` benchmarks (zero fabrication).

> **Serving constraint solved:** OpenNext/CloudFront routes `.txt`/`.json` paths to the S3 origin, so a *dynamic* `.txt`/`.json` route 403s. All three are written as **physical files** in `public/` by `scripts/generate-llms.ts` — wired as npm `prebuild` **and** into `scripts/deploy.sh` before `sst deploy` (OpenNext runs `next build`, not `npm run build`). An extensionless `/llms-full` Lambda route gives an always-fresh companion between deploys. *(This resolved the STEP-21 `/llms-full.txt` 403 that had been dead all along.)*

### 4.4 Explicit citation licence

`CITATION_LICENSE` (CC-BY-style, attribution to Public Pulse Agency) is embedded in `llms.txt`/`llms-full.txt`/`facts.json` — an explicit *permission + preference* signal telling models they may quote us and how to attribute.

### 4.5 AI-referral measurement — proving GEO works (`AiReferralTracker.tsx`)

Fires an **`ai_referral`** GA4/dataLayer event when a visit's `document.referrer` is an answer engine — **ChatGPT, Perplexity, Gemini, Copilot, Claude** (+ variants). This is on-site **proof that AEO/GEO is converting into traffic**: a visit from `chatgpt.com` means a model cited us and a human clicked through. Referrer-only, fires once, zero network cost. *(Create an "AI answer engines" custom channel group in GA4 to report on it.)*

---

## 5. The content moat (why there's anything to rank/cite)

Discoverability is worthless without indexable substance. The moat is **typed, grounded, real-only** content:

| Surface | Count | Schema | Notes |
|---|---|---|---|
| **Services** | 9 | Service + FAQ + Breadcrumb | Each with distinct deliverables / 5-step process / why-us / FAQ |
| **Locations** | 11 | LocalBusiness + FAQ | Real BD cities, lat/lng, characterised-by, aligned industries |
| **Industries** | 12 | Industry + FAQ | BD verticals, priorities, aligned services |
| **Glossary** | 28 | DefinedTerm(Set) + FAQ | EN + BN, cross-linked, BD-specific bodies (BDT/bKash/Foodpanda…) |
| **Guides (HowTo)** | 5 | HowTo + FAQ | `totalTime`, tools, step-by-step |
| **Compares** | 5 | Article + FAQ | Decision matrices |
| **Research benchmarks** | 9 (**2 published**) | **Dataset** | First-party "data moat"; gated — renders **nowhere** until real numbers + `published:true` |
| **Blog** | **121 published** (EN + BN) | Article/BlogPosting + FAQ | DB-backed, `speakable`, per-post OG, auto-glossary-linked |
| **Programmatic matrix** | **52 coherent combos** (from 171) | Service + LocalBusiness + FAQ | see below |

### 5.1 Programmatic matrix — pruned for intent (`src/lib/taxonomies/matrix.ts`)

The naive service×city (81) + service×industry (90) = **171** would be thin doorway pages. Pruned to **52 coherent combos**:

- **Service×city** kept for `MATRIX_PRIMARY_CITIES` (dhaka, chattogram) + curated `MATRIX_CITY_EXTRAS` (e.g. hospitality→cox's-bazar/sylhet).
- **Service×industry** kept only where `service ∈ industry.alignedServices` (top 3) — kills nonsense like `political-pr-for-e-commerce`; a self-pair guard kills `hospitality-for-hospitality`.
- Both templates `dynamicParams=true`; **pruned combos 308-redirect** to the parent → zero thin pages, zero 404s, one allow-list drives sitemap + prerender + redirect together.

### 5.2 Bilingual / local / geo

- **EN + বাংলা** throughout — glossary, blog (45 BN posts), `/bn/*` case studies — **hand-authored, never machine-translated**; hreflang pairs them.
- Site-wide **LocalBusiness** (Dhaka, geo coords, opening hours) + per-city override on location/matrix pages; NAP consistency from a single `src/lib/site.ts` source.

---

## 6. Traffic capture & conversion (turning crawls into leads)

Discoverability drives visits; these systems convert them.

### 6.1 Site-wide lead capture — `src/components/lead-capture/`

`StickyBar` (desktop slim bar, 4s delay, zero-CLS) · `ExitIntent` (desktop modal, top-edge mouseleave, focus-trapped) · `InlineBlock` (server-rendered, 5+ placements) · `CaptureForm` (email/WhatsApp tabs, honeypot). **Guardrails:** EN+BN copy, per-browser frequency cap (subscribe = 1yr quiet, dismiss = 30d/7d) via `state.ts`, **no mobile interstitials** (Google intrusive-interstitial-safe), a11y (focus trap, ARIA), honeypot on both endpoints.

### 6.2 Newsletter engine — double opt-in → digest

Double opt-in (`/api/newsletter`→confirm email→welcome), bi-weekly digest cron (EventBridge, 1st+15th ≈ Dhaka prime inbox) drafted from real posts, **RFC 8058 one-click unsubscribe** (`List-Unsubscribe` header + POST) + in-body link + physical address in every footer. Compliance-clean.

### 6.3 Conversion tracking — Pixel + CAPI + GTM + GA4

- **Preserved IDs:** GTM `GTM-TNK2J29K` · GA4 `G-WVF3TSEL3Q` · Meta Pixel `938966755334049` (cookie-consent gated).
- **Meta Conversions API** (`src/lib/meta-capi.ts`) — server-side events: **Lead, Contact, Subscribe, ViewContent, Schedule, CompleteRegistration** (pixel + CAPI dual-path, dedup) — recovers signal lost to iOS ATT / ad-blockers.
- **First-party analytics events:** `cta_click`, `form_submitted`, `form_error`, `search_used`, `service_matcher_completed`, `audit_tool_completed`, `ai_referral`.

### 6.4 Interactive lead magnets

**Service Matcher** (3-question quiz → ranks top-3 services → deep-links `/book`) and a **free SEO Audit tool** (`/tools/seo-audit`) — both fire completion events and route to conversion.

### 6.5 IndexNow — instant indexing (`src/lib/indexnow.ts`)

Every `/manage` publish/update `pingIndexNow()`s the changed URL to `api.indexnow.org` → Bing/Yandex re-crawl in minutes, not days. Key file at `/c8e3a47b9d2f4e6a8b1c5d7e9f0a2b4c.txt`.

---

## 7. The Search-Console crawl-error remediation (worked example)

When GSC reported 177 "Not found (404)", the root cause was bigger than the report: **seven dynamic `[slug]` routes shipped `dynamicParams=false`**, which on OpenNext/Lambda returns **HTTP 502** (a *server error* — worse than 404) for any unknown slug. Fix (deployed + live-verified):

- All 7 routes → `dynamicParams=true` + redirect-on-miss (308 to hub for stable catalogs; 307 to `/guides` for gated `/research`).
- `/group` (removed page) → 301 `/about`; `/case-studies/seed-*` → 308 hub.
- **Verified live:** every content page 200; every removed/pruned/unknown URL 307/308; **zero 404/500/502**; crawler files 200.

> The standing rule this enforces: **"treat the 404 as something Search Console should never detect"** — every dead/unknown URL redirects to a live, topically-relevant page.

---

## 8. Verification gates (how we keep it honest)

Before any route is "done", checked **in the built SSR HTML** (`.next/server/app/*.html`), never post-hydration:

```
grep -c "<h1"                     == 1      (single H1)
grep -c "answer-block"            >= 1      (AEO surface present)
grep -c "application/ld+json"     == baseline (schema intact)
grep -c 'rel="canonical"'         == 1
grep -c "<dl"                     >= 1      (FAQ where expected)
```

Plus site-level: `curl -I` returns 200 for indexed URLs / 3xx for removed (never 404/502); Rich Results Test shows expected `@type`s, 0 errors; `validator.schema.org` passes; Lighthouse mobile SEO 100. The full-build regression sweep runs this across all 136 prerendered pages.

---

## 9. Honest gaps & highest-leverage next actions

The system is strong; these are the open levers (mostly needing **your** input/data, not more code):

1. **Entity `sameAs` is thin.** Live: `facebook`, `instagram`, `x`. **Blank TODOs:** `linkedin`, `youtube`, `tiktok`, `wikidata`, `crunchbase` (in `src/lib/site.ts`). **A Wikidata item is the single highest-leverage entity node** — it's how knowledge panels and LLMs anchor "who is Public Pulse." Paste real profile URLs → they auto-flow into `sameAs` + `facts.json`.
2. **First-party data moat is 2/9 published.** `/research` benchmarks are gated real-only; filling `value`/`sampleSize`/`methodology` and flipping `published:true` lights up `Dataset` schema + `facts.statistics` + `/research` pages — **unique, citable data is the strongest GEO magnet** (nobody else has Bangladesh CPM/ROAS numbers).
3. **Case studies / testimonials empty.** Homepage "Selected results" + Review schema stay hidden (real-only guard) until entered via `/manage`. Real logos + attributed testimonials are the biggest conversion + E-E-A-T lift.
4. **GSC long tail.** The systematic 404/502 causes are fixed; the remaining unknown 404s need the GSC **"Not found" URL export** to build a precise 301 map.
5. **GA4 reporting.** Create an "AI answer engines" custom channel group on the `ai_referral` event to quantify GEO ROI.
6. **Sitemap index split.** Single flat sitemap is fine at ~250 URLs; split into an index (`sitemap-pages/-services/-blog…`) before it scales to thousands.

---

## 10. File-path index (where everything lives)

| Concern | File(s) |
|---|---|
| Metadata builder | `src/lib/seo.ts` |
| JSON-LD builders (25) | `src/lib/schema.ts` |
| Site constants / NAP / tracking IDs / sameAs | `src/lib/site.ts` |
| Robots (AI allowlist) | `src/app/robots.ts` |
| Sitemap (hreflang) | `src/app/sitemap.ts` |
| AEO surfaces | `src/components/seo/{AnswerBlock,KeyTakeaways,Breadcrumbs,JsonLd}.tsx` |
| GEO surfaces | `src/lib/llms.ts`, `src/lib/facts.ts`, `scripts/generate-llms.ts`, `public/{llms.txt,llms-full.txt,facts.json}` |
| AI-referral proof | `src/components/analytics/AiReferralTracker.tsx` |
| Programmatic templates | `src/components/seo/{GradientHero,ProgrammaticPage}.tsx` |
| Matrix prune | `src/lib/taxonomies/matrix.ts` |
| Taxonomies / content | `src/lib/taxonomies/*`, `src/lib/content/{guides,compares,benchmarks}.ts` |
| Crawl hygiene | `next.config.ts` (redirects), `src/middleware.ts` (410) |
| Conversion | `src/lib/meta-capi.ts`, `src/components/analytics/*`, `src/components/lead-capture/*`, `src/lib/indexnow.ts` |
| Playbook (strategy) | `docs/SEO-AEO-GEO.md` |
| Session history | `docs/JOURNEY.md` |

---

*Generated 2026-07-18 from a direct read of the codebase. Every number and file path above reflects the deployed state of publicpulse.com.bd.*
