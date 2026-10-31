# Pholio: Implementation Tasks

| | |
|---|---|
| **Document status** | Draft v0.1, 2026-10-31 |
| **Owns** | What to implement and in which order: phases, tasks, dependencies, acceptance criteria, status |
| **Related** | [PRD.md](./PRD.md) (requirements), [ARCHITECTURE.md](./ARCHITECTURE.md) (structure), [DESIGN.md](./DESIGN.md) (visuals), [AGENTS.md](./AGENTS.md) (AI rules) |

---

## 1. How to Use This Document

- Work on **one task at a time**, in dependency order. Do not start tasks that were not requested.
- Before starting a task, read the documents it touches (see AGENTS.md, "Development Rules").
- A task is `DONE` only when every acceptance criterion is met **and** the build validation passes for the relevant mode(s).
- Update the task's status here when it changes. If a decision changes, update the owning document too.
- Phase order is a recommendation; **dependencies are authoritative**. A later-phase task may be pulled forward when its dependencies are met (for example, the image pipeline in Phase 8 before real gallery content in Phase 5).

### Status values

| Status | Meaning |
|---|---|
| `TODO` | Not started |
| `IN PROGRESS` | Being worked on |
| `REVIEW` | Implemented, awaiting review or verification |
| `DONE` | Acceptance criteria met and verified |

### Path column

| Path | Meaning |
|---|---|
| **A** | Needed for Portfolio Only |
| **B** | Needed only for Portfolio + Shop |
| **A+B** | Needed by both (shared foundation) |

## 2. Implementation Paths

### Path A: Portfolio Only

Complete all `A` and `A+B` tasks. The result is a finished, deployable portfolio with `shopEnabled: false`. **No Shop, Payhip, or Midtrans work is a prerequisite.** Path A is complete when TASK-10.3 (deployment) and TASK-10.1 (build matrix, Mode A part) are `DONE`.

### Path B: Portfolio + Shop

Continue from a working Path A by completing all `B` tasks (Phases 6 and 7, plus Mode B parts of Phases 8 to 10). Path B adds the product catalog, validated external checkout, and a verified purchase and delivery test. Path B is complete when TASK-10.4 is `DONE`.

**Rule:** Shop work must never block finishing Path A.

### Task format

Each task lists: **ID**, **Objective**, **Implementation scope**, **Dependencies**, **Acceptance criteria**, **Status** (plus **Path**).

---

## Phase 0: Documentation and Project Preparation

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-0.1 | A+B | Create the documentation foundation | Write README, PRD, ARCHITECTURE, DESIGN, TASKS, AGENTS; cross-document consistency review | None | Six files exist in repo root; responsibilities match the document table; both modes described consistently; no implementation performed | REVIEW |
| TASK-0.2 | A+B | Review and approve the documentation | Owner reads all six documents; list and resolve contradictions; confirm scope and positioning | TASK-0.1 | Review notes resolved; documents updated; owner approves | TODO |
| TASK-0.3 | A+B | Prepare development content kit | Placeholder works (several per type), hero, portrait, about text, social links; sample images for pipeline testing | TASK-0.2 | Kit available outside Git or as small samples; covers photo, design, artwork, and video cases | TODO |
| TASK-0.4 | A+B | Decide open design inputs | Confirm fonts, accent color, nav order, demo brand name (PRD A11) | TASK-0.2 | Decisions recorded in DESIGN.md | TODO |
| TASK-0.5 | B | Verify payment provider feasibility (non-blocking) | Check Payhip account eligibility and terms; confirm whether Midtrans, QRIS, and international cards are available for the intended account and market; record findings | None | Written findings in ARCHITECTURE.md section 16 (V1 to V3, V5); unverified items stay marked unverified | TODO |

## Phase 1: Next.js Initialization

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-1.1 | A+B | Initialize the project | Create Next.js App Router + TypeScript project with Tailwind CSS v4; set `output: 'export'`; pin stable, compatible versions; confirm Node and package-manager requirements; update README prerequisites | TASK-0.2 | `dev` and `build` run; `out/` produced; versions recorded in README; no unused dependencies | TODO |
| TASK-1.2 | A+B | Repository hygiene | `.gitignore` including `private/`; lint and typecheck scripts; editor settings; create empty `content/`, `scripts/`, `private/` structure | TASK-1.1 | `private/` ignored (verified with a dummy file); `lint` and `typecheck` pass | TODO |
| TASK-1.3 | A+B | Content types and loaders | TypeScript types for site, gallery, manifest; loaders; `isShopEnabled()` in `src/lib/features.ts`; seed `site.json` with `shopEnabled: false`, minimal `gallery.json`, and a hand-written sample `image-manifest.json` with matching sample images in `public/images/` (replaced in TASK-8.2) | TASK-1.1, TASK-0.3 | Typed content loads in a page; in application code only `isShopEnabled()` reads the flag; sample manifest resolves every image key in the seed gallery; products loader not yet required | TODO |
| TASK-1.4 | A+B | Build-time content validation | `scripts/validate-content.mjs` and `prebuild` hook; create `scripts/lib/read-mode.mjs` (ARCHITECTURE section 6.1); implement Mode A checks from ARCHITECTURE section 14.1; decide validation approach (hand-written preferred) | TASK-1.3 | Tooling reads the flag only through `read-mode.mjs`; invalid JSON, duplicate IDs, bad category refs, missing alt, and missing images fail the build with file, ID, and message; valid content passes; `products.json` absent does not fail | TODO |
| TASK-1.5 | A+B | Baseline static export smoke test | Build, serve `out/` with a static file server, click through routes | TASK-1.1 | Static output works with no runtime; no Server Actions, route handlers, or middleware present | TODO |
| TASK-1.6 | A+B | Build audit (Mode A baseline) | `scripts/verify-build.mjs` and `postbuild` hook: check `out/shop` absent, no `data-shop`, no `payhip` string (the allowlisted-host check is added in TASK-7.1), preview size cap, no private files in `out/` | TASK-1.5 | Audit passes on a clean Mode A build; fails when a test file is planted in `public/` that violates a rule | TODO |

## Phase 2: Tailwind and Design Foundation

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-2.1 | A+B | Design tokens | Define color, spacing, radius, and breakpoint tokens with Tailwind v4 theme variables per DESIGN sections 4, 6, 8; light theme default, dark tokens defined but unused | TASK-1.1, TASK-0.4 | Tokens used by components (no raw hex in components); contrast of text and UI tokens measured and recorded as ≥ AA | TODO |
| TASK-2.2 | A+B | Typography | Load display and body fonts with `next/font`; define type scale per DESIGN section 5 | TASK-2.1 | Fonts self-hosted at build; fallbacks defined; scale applied; no layout shift from font loading | TODO |
| TASK-2.3 | A+B | UI primitives | `Container`, `Section`, `Button`, `Link`, `Chip`, visually-hidden helper | TASK-2.1, TASK-2.2 | All interaction states from DESIGN section 17 implemented; focus-visible works | TODO |
| TASK-2.4 | A+B | Responsive image component | Component that reads the manifest and outputs `srcset`, `sizes`, `width`, `height`, `alt`, loading hints; decide `<img>` vs `next/image` with `unoptimized`; use the sample manifest seeded in TASK-1.3 until Phase 8 | TASK-1.3 | Images render responsively with no layout shift; missing manifest key fails at build | TODO |
| TASK-2.5 | A+B | Motion and focus foundation | Reduced-motion handling, transition utilities, fade-in image behavior | TASK-2.3 | Animations respect `prefers-reduced-motion`; no animation library added | TODO |
| TASK-2.6 | A+B | GSAP core setup | Install GSAP; create `src/lib/gsap.ts` singleton with version pin; register plugins; ensure tree-shaking works with static export | TASK-2.1, TASK-2.5 | GSAP imports in a test component; no build errors; bundle size impact measured | TODO |
| TASK-2.7 | A+B | ScrollTrigger integration | Install ScrollTrigger; create scroll-based animation utilities (`fadeInUp`, `staggerReveal`, `pinSection`); register in GSAP singleton | TASK-2.6 | Scroll-triggered animations work on a test page; `prefers-reduced-motion` disables all ScrollTrigger animations | TODO |
| TASK-2.8 | A+B | Lenis smooth scroll | Install Lenis; initialize in a client component mounted in root layout; expose `lenis` instance for ScrollTrigger synchronization; configure `wheelMultiplier`, `touchMultiplier`, `lerp` per DESIGN | TASK-2.6 | Smooth scroll works; ScrollTrigger `scroller` synced with Lenis; no layout shift; respects `prefers-reduced-motion` (disabled) | TODO |
| TASK-2.9 | A+B | Reduced-motion implementation | Central `useReducedMotion` hook; disable GSAP/ScrollTrigger/Lenis when `prefers-reduced-motion: reduce`; ensure instant state for all animated elements | TASK-2.6, TASK-2.7, TASK-2.8 | All motion opt-in only; instant snap to final state when reduced motion; no JS errors | TODO |
| TASK-2.10 | A+B | GSAP/ScrollTrigger/Lenis lifecycle cleanup | `useEffect` cleanup for every GSAP context, ScrollTrigger instance, and Lenis `destroy()`; prevent memory leaks on route changes in Next.js App Router | TASK-2.6, TASK-2.7, TASK-2.8 | No memory leaks in a 10-route navigation test; no stale ScrollTrigger instances; Lenis destroyed on unmount | TODO |
| TASK-2.11 | A+B | Mobile performance budget for motion | Measure and document: main-thread blocking time, interaction-to-next-paint (INP), bundle size impact of GSAP+ScrollTrigger+Lenis; set budget (e.g., < 50 KB gzipped for motion bundle); implement code-splitting if needed | TASK-2.6, TASK-2.7, TASK-2.8, TASK-2.9, TASK-2.10 | Motion bundle within budget; INP < 200 ms on mobile test device; no jank on 320 px viewport | TODO |

## Phase 3: Core Layout and Navigation

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-3.1 | A+B | Root layout | `layout.tsx` with `lang`, metadata defaults, skip link, landmarks | TASK-2.3 | Skip link first in tab order; landmarks present | TODO |
| TASK-3.2 | A+B | Navigation model and header | `getNavItems()` in `src/lib/navigation.ts` (Work, About, Contact; Shop inserted between About and Contact only when enabled); `SiteHeader` consuming it | TASK-3.1, TASK-1.3 | Header shows 3 items in Mode A; no hard-coded Shop link anywhere; layout has no gaps | TODO |
| TASK-3.3 | A+B | Mobile menu | `MobileMenu` full-screen overlay | TASK-3.2 | Focus trapped, Esc closes, focus returns, tap targets ≥ 44 px, usable at 320 px | TODO |
| TASK-3.4 | A+B | Footer | `SiteFooter` with name, copyright, social links, nav via `getNavItems()` | TASK-3.2 | Renders identically structured in both modes except the Shop link; no empty columns | TODO |
| TASK-3.5 | A+B | 404 page | `not-found.tsx` styled to the design | TASK-3.1 | `404.html` produced in `out/`; links back to home | TODO |

## Phase 4: Homepage

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-4.1 | A+B | Hero | `Hero` per DESIGN section 11 using `site.json` hero and creator data | TASK-2.4, TASK-3.1 | Full-bleed responsive image, priority loaded, Display type, no layout shift | TODO |
| TASK-4.2 | A+B | Featured works | Section listing works with `featured: true` | TASK-4.1, TASK-1.3 | Correct works in `order`; links to detail routes; handles zero featured works gracefully | TODO |
| TASK-4.3 | A+B | About teaser and contact CTA | Teaser section and contact call to action | TASK-4.1 | Links work; spacing matches the rhythm in DESIGN section 6 | TODO |
| TASK-4.4 | A+B | Homepage composition and Mode A check | Compose sections; Shop teaser slot is a gated composition point that renders nothing in Mode A | TASK-4.2, TASK-4.3, TASK-1.6 | Homepage in Mode A has no shop UI or leftover spacing; audit passes | TODO |

## Phase 5: Gallery and Project Detail

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-5.1 | A+B | Gallery page | `/gallery` with `WorkGrid` and `WorkCard` (CSS masonry, aspect ratios preserved) | TASK-2.4, TASK-1.3 | 1, 2, and 3 columns at base, `md`, `lg`; lazy loading below the fold; no layout shift | TODO |
| TASK-5.2 | A+B | Category filter | Client-side `CategoryFilter` with "All" | TASK-5.1 | Filters without reload; `aria-pressed` states; result count announced; works without breaking static export | TODO |
| TASK-5.3 | A+B | Work detail route | `/gallery/[slug]` via `generateStaticParams`, `dynamicParams = false`; layouts for photo, design, artwork; type-aware `details`; previous and next links | TASK-5.1 | One page per work; layout varies by type; unknown slugs yield 404 | TODO |
| TASK-5.4 | A+B | Lightbox | `Lightbox` per DESIGN section 13 | TASK-5.3 | Keyboard (Esc, arrows, Tab trap), swipe, focus return, scroll lock, position indicator, alt text exposed | TODO |
| TASK-5.5 | A+B | Video work detail | `VideoEmbed` for `youtube` and `vimeo` with provider and ID; poster required | TASK-5.3 | Embed URL built in code; iframe has `title`; no raw HTML accepted; works on mobile | TODO |
| TASK-5.6 | A+B | About page | `/about` | TASK-3.1, TASK-2.4 | Content from `site.json`; one `h1`; responsive | TODO |
| TASK-5.7 | A+B | Contact page | `/contact` with email, availability, social links | TASK-3.1 | Links work (`mailto:` and social with `rel="noopener noreferrer"`); no form backend | TODO |

## Phase 6: Optional Digital Shop

*Path B only. Must not block Path A. Item 6.1 may be run earlier as a spike once TASK-1.5 is done.*

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-6.1 | B | Spike: conditional route generation | Test the primary strategy (`shop/[[...slug]]` with empty `generateStaticParams` when disabled) in the pinned Next.js version; if it fails, test the fallback; record result in ARCHITECTURE.md section 7 | TASK-1.5 | With `shopEnabled: false`, `out/shop` absent and build succeeds without `products.json`; with `true`, listing and a sample detail route emitted; V6 resolved | TODO |
| TASK-6.2 | B | Product data layer | Product types; `products.ts` loader that does not touch the file system when disabled; Mode B validation rules from ARCHITECTURE section 14.1 | TASK-6.1, TASK-1.4 | Valid data loads; duplicate IDs, dangling `productId`, and missing fields fail the build in Mode B; no effect in Mode A | TODO |
| TASK-6.3 | B | Shop listing | `/shop` with `ProductCard` | TASK-6.2, TASK-2.4 | Lists all products; every shop element has `data-shop`; styled per DESIGN section 14 | TODO |
| TASK-6.4 | B | Product detail | `/shop/[slug]` with `ProductDetail` and `LicenseSummary` | TASK-6.3 | Preview, price, license, file info shown; unavailable products handled | TODO |
| TASK-6.5 | B | Gated composition points | Homepage shop teaser and work-detail product link, rendered only inside `isShopEnabled()` guards | TASK-6.3, TASK-4.4, TASK-5.3 | Work with a valid `productId` links to its product in Mode B; identical page in Mode A has no trace | TODO |
| TASK-6.6 | B | Conditional navigation and metadata wiring | Shop appears in header, mobile menu, footer, and sitemap only in Mode B | TASK-6.3, TASK-3.2, TASK-9.2 | Mode A and Mode B output differ exactly as the behavior matrix in ARCHITECTURE section 6.2 | TODO |
| TASK-6.7 | B | Mode B audit and removability test | Extend `verify-build` for Mode B checks (section 14.2); confirm Portfolio Core builds after deleting the shop module in a scratch copy | TASK-6.6, TASK-1.6 | Audit passes in both modes; scratch copy without shop builds in Mode A unchanged | TODO |

## Phase 7: Conditional Payhip Integration

*Path B only. No payment capability is claimed until TASK-7.5 is `DONE`.*

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-7.1 | B | Checkout URL validation | Allowlist constant shared with `validate-content.mjs`; HTTPS enforcement; confirm Payhip's host and link format (V5); extend `verify-build.mjs` so Mode A output is also checked for any allowlisted host | TASK-6.2, TASK-0.5 | Invalid host, non-HTTPS, or empty URL fails the build in Mode B; skipped in Mode A | TODO |
| TASK-7.2 | B | `CheckoutCTA` | External Buy button, helper text, unavailable state, `rel="noopener noreferrer"` | TASK-6.4, TASK-7.1 | Opens checkout externally; unavailable products show no link; no payment-method claims | TODO |
| TASK-7.3 | B | Payhip product setup runbook | Write the steps to create a product, upload the master, and copy the checkout URL into README and ARCHITECTURE; no secrets documented | TASK-0.5 | A new implementer can follow the steps; no credentials in any file | TODO |
| TASK-7.4 | B | End-to-end purchase test | Real or sandbox purchase of a low-value product: checkout, payment, confirmation email, download of the unwatermarked master (V4) | TASK-7.2, TASK-7.3 | Buyer receives email and download; file is the full-resolution master; results recorded | TODO |
| TASK-7.5 | B | Verification record and copy alignment | Record which payment methods were actually verified (V1 to V3); update docs and UI copy to match exactly | TASK-7.4 | Docs and UI claim only verified methods; unverified items remain labeled unverified | TODO |

## Phase 8: Image and Media Optimization

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-8.1 | A+B | Sharp pipeline core | `scripts/process-images.mjs`: resize to configured widths, convert to WebP, compress, write previews to `public/images/` | TASK-1.2, TASK-0.3 | Running `images` on `private/source/` produces variants; originals untouched; preview longest edge capped | TODO |
| TASK-8.2 | A+B | Pipeline configuration and manifest | `image-pipeline.config.json` (widths, quality, naming); write `content/generated/image-manifest.json` with dimensions and variants | TASK-8.1 | Manifest matches ARCHITECTURE section 10.3; validation and image component consume it; replaces the Phase 2 sample manifest | TODO |
| TASK-8.3 | A+B | Optional watermark | Configurable watermark applied to previews when enabled | TASK-8.2 | Off by default; when on, previews carry the watermark; masters never processed with it | TODO |
| TASK-8.4 | B | Master file handling | Document and check the `private/masters/` convention; confirm `.gitignore` guard and build audit cover masters | TASK-1.6, TASK-6.2 | A planted master file in `public/` is caught by the audit; `private/` content never appears in Git status | TODO |
| TASK-8.5 | A+B | Hosted video URL and click-to-load facade (P1) | `file` provider with a native video element; poster facade for embeds | TASK-5.5 | Facade loads iframe only on click; `file` videos play with controls; privacy-enhanced embed domain used where available | TODO |
| TASK-8.6 | A+B | Loading strategy audit | Verify priority and lazy loading, `sizes`, and dimensions across pages | TASK-8.2, TASK-5.1 | Hero is prioritized; below-fold images lazy; no layout shift observed | TODO |

## Phase 9: SEO and Performance

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-9.1 | A+B | Route metadata and social images | Per-route title, description, canonical, Open Graph, Twitter; static OG images from previews | TASK-5.3, TASK-4.4 | Every route has unique metadata; canonical uses `site.url` | TODO |
| TASK-9.2 | A+B | Sitemap and robots | `sitemap` and `robots` as build-time static files; Shop URLs only in Mode B | TASK-5.3 | `sitemap.xml` and `robots.txt` in `out/`; contents match mode | TODO |
| TASK-9.3 | A+B | Structured data (P1) | `Person` and `ImageObject`; `Product` only in Mode B with accurate price and availability | TASK-9.1 | Passes a structured-data validator; no `Product` data in Mode A | TODO |
| TASK-9.4 | A+B | Performance pass | Lighthouse runs on production build; fix findings; evaluate a report-only CSP (V9, P2) | TASK-8.6 | Mobile ≥ 75, desktop ≥ 80 (Performance); results recorded for both modes | TODO |
| TASK-9.5 | A+B | Accessibility audit | Automated scan plus manual keyboard and screen-reader pass | TASK-5.4, TASK-3.3 | Lighthouse Accessibility ≥ 90; lightbox, menu, and filter fully keyboard-operable; no blocking issues | TODO |

## Phase 10: Testing and Deployment

| ID | Path | Objective | Implementation scope | Dependencies | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| TASK-10.1 | A+B | Dual-mode build matrix | Build and audit with `shopEnabled: false` (required) and `true` (Path B); compare outputs to the behavior matrix | TASK-1.6; for Mode B part: TASK-6.7 | Mode A passes with `products.json` absent, empty, and malformed; Mode B passes with valid data; outputs differ only as specified | TODO |
| TASK-10.2 | A+B | Cross-browser and device test | Manual pass on Chrome, Safari, Firefox, Edge; iOS and Android; widths 320 to 1440 px | TASK-9.5 | No functional or layout defects at tested sizes; issues logged and fixed | TODO |
| TASK-10.3 | A+B | Cloudflare Pages deployment | Connect repo; set build command and output directory; set Node version; confirm limits (V7) and URL behavior (V8); add `_headers` | TASK-10.1 | Production URL serves the site; 404 works; headers applied; Mode A deploy needs no provider account | TODO |
| TASK-10.4 | B | Mode B production readiness | Test purchase on the production domain; confirm no masters in output; verify copy matches verified methods | TASK-10.3, TASK-7.5 | Test purchase succeeds end to end; audit passes in production build | TODO |
| TASK-10.5 | A+B | Template handoff checklist | Final documentation review; "new client" checklist (edit `site.json`, add images, run pipeline, choose mode, deploy) | TASK-10.3 | A new implementer can launch a site from the checklist; docs consistent | TODO |

---

## 3. Dependency Overview

```text
Phase 0 ─► Phase 1 ─► Phase 2 (incl. 2.6–2.11 M2 Motion) ─► Phase 3 ─► Phase 4 ─► Phase 5 ─┐
                │                                                          ▲              │
                └──────────────► Phase 8 (8.1, 8.2 may be pulled forward) ┤
                                                                      ▼
                                              Phase 9 ─► Phase 10 (Path A complete at 10.3)
Path B only:  TASK-1.5 ─► 6.1 ─► 6.2 ─► 6.3 ─► 6.4 ─► 6.5 ─► 6.6 ─► 6.7
              TASK-0.5 ─► 7.1 ─► 7.2 ─► 7.4 ─► 7.5 ─► 10.4
              TASK-9.2 ─► 6.6 (sitemap wiring; 6.6 and 6.7 wait for 9.2 even though Phase 9 comes later)
```

## 4. Recommended First Task

**TASK-0.2: Review and approve the documentation.** It confirms scope and resolves contradictions before any code. In parallel, start **TASK-0.5** (payment provider feasibility) because account verification can take time and does not block Path A.

The first implementation task is **TASK-1.1**, after TASK-0.2 is `DONE`.