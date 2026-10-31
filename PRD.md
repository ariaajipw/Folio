# Pholio: Product Requirements Document

| | |
|---|---|
| **Document status** | Draft v0.1, 2026-10-31 |
| **Owns** | What to build and why: requirements, scope, priorities, acceptance criteria |
| **Related** | [ARCHITECTURE.md](./ARCHITECTURE.md) (how), [DESIGN.md](./DESIGN.md) (look and behavior), [TASKS.md](./TASKS.md) (order), [AGENTS.md](./AGENTS.md) (AI rules) |

---

## 1. Product Overview

Pholio is a website template for **visual creators**: photographers, videographers, graphic designers, and visual artists. It delivers a minimalist, editorial, cinematic, visual-first portfolio on a static, backend-free foundation.

Pholio has two usage modes that share one codebase, one design system, and one component library:

- **Mode A: Portfolio Only.** A professional portfolio with no commerce.
- **Mode B: Portfolio + Digital Shop.** The same portfolio plus a catalog of digital products sold through an external checkout.

The mode is selected by `features.shopEnabled` in `content/site.json`.

## 2. Problem Statement

Visual creators need a website that presents their work with quality and restraint. Common options fall short:

- Generic website builders produce interchangeable, text-heavy layouts that undersell visual work.
- Fully custom sites are expensive and slow to deliver.
- Creators who want to sell prints-as-files, presets, or design assets usually need a heavy e-commerce stack, while many creators do not want to sell at all.

Pholio solves this with a focused template that is fast to adapt per client, makes the work the hero, and treats selling as an optional module rather than a requirement.

## 3. Target Users

| Role | Description | Needs |
|---|---|---|
| **Creator (site owner)** | Photographer, videographer, graphic designer, or visual artist | A credible, beautiful site; easy contact; optionally a way to sell digital work without running a store |
| **Implementer** | The developer or agency adapting Pholio for a client | Clear structure, JSON-driven content, predictable build, minimal setup per client |
| **Visitor** | Prospective client, collaborator, art director, or admirer | Fast loading, immersive viewing, clear way to get in touch |
| **Buyer** *(Mode B only)* | Person purchasing a digital file or asset | Clear price, license, preview, and a trustworthy checkout |

## 4. Product Positioning

**Pholio is** a reusable visual portfolio template with an optional, modular digital commerce layer.

**Pholio is not** a universal portfolio template, a marketplace, a SaaS platform, a standalone e-commerce platform, a CMS, or a custom payment processing system.

Pholio must not be extended toward software developers, writers, business consultants, or any profession that needs text-driven case-study structures.

## 5. Product Goals

| ID | Goal |
|---|---|
| G1 | Present visual work with strong hierarchy, generous whitespace, and minimal interface noise |
| G2 | Be fast and accessible on mobile, with static deployment and no runtime backend |
| G3 | Be reusable: an implementer can adapt it for a new client by editing JSON and replacing images |
| G4 | Make the Digital Shop truly optional and removable, with zero residue when disabled |
| G5 | Keep MVP complexity low: no database, CMS, auth, cart, or custom payment logic |

## 6. Usage Modes

| Aspect | Mode A: Portfolio Only | Mode B: Portfolio + Digital Shop |
|---|---|---|
| Config | `shopEnabled: false` | `shopEnabled: true` |
| Success depends on shop? | No | N/A (builds on Mode A) |
| Shop routes, nav, buy UI | None | Present |
| Product data | Not required, not read | Required, validated |
| Payment provider | None | Payhip and Midtrans (selected; integration unverified) |
| Digital delivery | None | Payhip, after payment confirmation |
| Master files | None | Only for sold products; private |

**Rule:** The success of Portfolio Core must never depend on Shop configuration, data, or provider status.

## 7. MVP Scope

### Priority definitions

| Priority | Meaning |
|---|---|
| **P0** | Required for the MVP release of Mode A. Portfolio Core is always P0. |
| **P1** | Required for the Mode B release, or important enhancements that do not block Mode A. |
| **P2** | Post-MVP or nice to have. |

### Scope by priority

| Priority | Item | Mode |
|---|---|---|
| P0 | Homepage with creator identity and visual hero | A, B |
| P0 | Gallery with categories, category filter, featured works | A, B |
| P0 | Work detail (photo, design, artwork) | A, B |
| P0 | Video showcase via external embed (YouTube, Vimeo) on work detail | A, B |
| P0 | Image lightbox | A, B |
| P0 | About, Contact (email and social links), social links | A, B |
| P0 | Responsive design, mobile-first | A, B |
| P0 | Image optimization pipeline (resize, WebP, compression) | A, B |
| P0 | SEO basics (metadata, sitemap, robots, canonical) | A, B |
| P0 | JSON content with TypeScript types and build-time validation | A, B |
| P0 | `shopEnabled` toggle that affects routing, rendering, navigation, and validation | A, B |
| P0 | Static export deployment to Cloudflare Pages | A, B |
| P0 | Accessibility baseline (keyboard, focus, contrast, alt text) | A, B |
| P1 | Shop listing and product detail | B |
| P1 | Price and license display | B |
| P1 | External checkout button to Payhip | B |
| P1 | Gallery-to-product link via optional `productId` | B |
| P1 | Optional watermark in image pipeline | A, B |
| P1 | Hosted video URL (externally hosted file) support | A, B |
| P1 | Video click-to-load facade (privacy and performance) | A, B |
| P1 | Structured data (Person, ImageObject; Product when shop enabled) | A, B |
| P1 | Verified end-to-end purchase and delivery test | B |
| P2 | Dark theme variant | A, B |
| P2 | Uniform-grid gallery layout option | A, B |
| P2 | External contact form provider | A, B |
| P2 | Privacy-friendly analytics | A, B |
| P2 | Featured works slideshow in hero | A, B |
| P2 | Low-quality image placeholders (blur-up) | A, B |
| P2 | M2 motion: scroll-led animations with GSAP, ScrollTrigger, Lenis; respects `prefers-reduced-motion` | A, B |

## 8. Out of Scope

The following are not part of the MVP. They may be considered later as separate efforts.

- Universal portfolio for unrelated professions
- Marketplace, multi-vendor support
- Supabase, PostgreSQL, or any database
- CMS, admin dashboard
- Customer authentication, customer member area
- Shopping cart
- Custom payment gateway, payment webhooks
- Order management, real-time stock management
- Live booking
- Custom digital delivery backend
- Custom video hosting, video upload or processing
- Multi-currency automatic pricing
- Multi-language (i18n): MVP assumes one language per site

## 9. User Journeys

### J1. Visitor explores the portfolio (both modes, P0)

1. Visitor lands on the homepage and sees the hero and creator identity.
2. Scrolls through featured works.
3. Opens the gallery and filters by category.
4. Opens a work detail page; views images in the lightbox or watches an embedded video.
5. Reads About and reaches out via Contact or a social link.

### J2. Visitor on mobile (both modes, P0)

1. Opens the site on a phone over a mobile connection.
2. Navigates via the mobile menu.
3. Browses a single-column gallery, opens the lightbox, and swipes between images.
4. Taps the email or social link to contact the creator.

### J3. Buyer purchases a digital work (Mode B, P1)

1. Opens `/shop` or a work that shows an "available as download" link.
2. Opens the product detail; reviews the preview, price, and license.
3. Selects **Buy** and is redirected to the Payhip checkout.
4. Completes payment with an available method.
5. Receives an email and download access from Payhip, and downloads the unwatermarked master.

The website does not handle the transaction, orders, or file delivery.

### J4. Implementer launches a Mode A site (P0)

1. Copies the template and edits `site.json` with `shopEnabled: false`.
2. Adds source images, runs image processing, edits `gallery.json`.
3. Builds, verifies, and deploys to Cloudflare Pages. No Payhip or Midtrans setup is needed.

### J5. Implementer enables the shop later (Mode B, P1)

1. Sets `shopEnabled: true`, adds `products.json`, prepares master files privately, and creates products in Payhip.
2. Builds; validation checks product data and checkout URLs.
3. Runs a real purchase test before announcing the shop.
4. Can switch back to Mode A at any time by setting the flag to `false` and rebuilding.

## 10. Functional Requirements

### 10.1 Portfolio Core (always P0 unless noted)

| ID | Requirement | Priority |
|---|---|---|
| FR-P1 | Homepage shows creator name, discipline, and a visual-first hero | P0 |
| FR-P2 | Homepage shows featured works (works flagged `featured`) | P0 |
| FR-P3 | Gallery lists all works; each work has a type: `photo`, `design`, `artwork`, or `video` | P0 |
| FR-P4 | Works belong to a category; the gallery supports client-side category filtering | P0 |
| FR-P5 | Each work has a statically generated detail page at `/gallery/[slug]` | P0 |
| FR-P6 | Image works open in a lightbox with keyboard, touch, and screen-reader support | P0 |
| FR-P7 | Work details display type-appropriate metadata (for example camera or lens for photos, tools and role for design, medium for artwork, duration and role for video) | P0 |
| FR-P8 | About page presents the creator's story, services or disciplines, and portrait | P0 |
| FR-P9 | Contact page provides email, optional availability note, and social links (no backend form in MVP) | P0 |
| FR-P10 | Social links appear in the footer and on the Contact page | P0 |
| FR-P11 | Navigation lists Work, About, Contact | P0 |
| FR-P12 | Not every work is for sale; works without `productId` never show purchase UI | P0 |

### 10.2 Media

| ID | Requirement | Priority |
|---|---|---|
| FR-M1 | Video works render via YouTube or Vimeo embed from provider and ID in JSON (no raw HTML embeds in JSON) | P0 |
| FR-M2 | Video works may use an externally hosted video file URL | P1 |
| FR-M3 | Video embeds load on user interaction with a poster facade | P1 |
| FR-M4 | The image pipeline produces responsive WebP variants and an image manifest | P0 |
| FR-M5 | The image pipeline supports configurable widths, quality, and output naming | P0 |
| FR-M6 | The image pipeline supports an optional watermark | P1 |
| FR-M7 | Public previews are web-sized; masters never appear in `public/` or Git | P0 |

### 10.3 Content and Data

| ID | Requirement | Priority |
|---|---|---|
| FR-D1 | Content lives in `site.json`, `gallery.json`, and (Mode B) `products.json` | P0 |
| FR-D2 | Gallery and product data are separate; relation uses optional `productId` | P0 |
| FR-D3 | IDs and slugs are unique; data has consistent TypeScript-typed structure | P0 |
| FR-D4 | JSON is validated at build time; invalid content fails the build with a clear message | P0 |
| FR-D5 | Every non-decorative image requires alt text; missing alt fails validation | P0 |
| FR-D6 | No secrets, API keys, or payment credentials in any JSON file | P0 |
| FR-D7 | Content changes require JSON edits and a rebuild and redeploy | P0 |

### 10.4 Feature Toggle and Optional Shop

| ID | Requirement | Priority |
|---|---|---|
| FR-S1 | `features.shopEnabled` controls routing, rendering, navigation, and build validation, not just CSS visibility | P0 |
| FR-S2 | With `shopEnabled: false`: no `/shop` or product routes, no Shop nav, no Buy or Checkout UI, no `products.json` dependency, no payment configuration needed | P0 |
| FR-S3 | With `shopEnabled: false`, the build does not fail if `products.json` is missing, empty, or malformed | P0 |
| FR-S4 | With `shopEnabled: true`: `/shop` and `/shop/[slug]` are generated for each valid product | P1 |
| FR-S5 | Product pages show preview, price, license summary, and file information | P1 |
| FR-S6 | Buy buttons link to an external checkout URL that passed build-time validation (HTTPS, allowlisted host) | P1 |
| FR-S7 | A work with a valid `productId` shows a link to its product (Mode B only) | P1 |
| FR-S8 | Build fails on duplicate product IDs, dangling `productId`, or invalid checkout URL (Mode B only) | P1 |
| FR-S9 | Payment and delivery are handled entirely by the external provider; the site stores no payment data | P1 |

### 10.5 Platform and SEO

| ID | Requirement | Priority |
|---|---|---|
| FR-X1 | Site is produced as a static export and deployed to Cloudflare Pages | P0 |
| FR-X2 | Per-page metadata, canonical URL, Open Graph, and Twitter tags | P0 |
| FR-X3 | `sitemap.xml` and `robots.txt` generated at build time; Shop URLs only in Mode B | P0 |
| FR-X4 | Custom 404 page | P0 |
| FR-X5 | Structured data (Person, ImageObject; Product in Mode B) | P1 |

## 11. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-1 | **No backend runtime:** no Server Actions, runtime Route Handlers, server-requiring middleware, dynamic SSR, or runtime database | P0 |
| NFR-2 | **Accessibility:** target WCAG 2.2 AA; keyboard-operable everywhere; visible focus; respects `prefers-reduced-motion` | P0 |
| NFR-3 | **Responsive:** mobile-first; usable from 320 px wide up to large desktop | P0 |
| NFR-4 | **Security:** no secrets in the frontend or repo; masters never public; external links use `rel="noopener noreferrer"` | P0 |
| NFR-5 | **Maintainability:** shop code is isolated so it can be removed or disabled without touching Portfolio Core | P0 |
| NFR-6 | **Simplicity:** add dependencies only with a clear need; avoid abstractions beyond MVP needs | P0 |
| NFR-7 | **Browser support:** current evergreen browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile | P0 |
| NFR-8 | **Documentation consistency:** documents are updated together when decisions change | P0 |
| NFR-9 | **Motion (MVP):** M2 scroll-led animations with GSAP, ScrollTrigger, Lenis; `prefers-reduced-motion` respected; performant on mobile and lower-powered devices | P0 |

## 12. Performance Targets

Measured with Lighthouse on a production build served statically (mobile emulation for mobile score).

| Metric | Target | Gate |
|---|---|---|
| Lighthouse Performance, mobile | ≥ 75 | Required |
| Lighthouse Performance, desktop | ≥ 80 | Required |
| Lighthouse Accessibility | ≥ 90 | Required |
| Largest Contentful Paint | ≤ 2.5 s | Guideline |
| Cumulative Layout Shift | ≤ 0.1 | Guideline |
| Interaction to Next Paint | ≤ 200 ms | Guideline |

Targets apply to Mode A and Mode B. Enabling the shop must not push Portfolio Core pages below the gates.

## 13. Acceptance Criteria

### Mode A: Portfolio Only

- [ ] With `shopEnabled: false` and no `products.json`, `npm run build` succeeds.
- [ ] Output contains no `/shop` route, no product pages, and no `payhip` references.
- [ ] No HTML file contains any element marked `data-shop` (all shop UI carries this marker).
- [ ] Navigation, footer, homepage, and work details show no shop or purchase UI, even if a work has a `productId`.
- [ ] All P0 Portfolio Core features in section 7 work.
- [ ] Every image has alt text (or is explicitly marked decorative); the build enforces it.
- [ ] The lightbox is operable by keyboard (open, close with Esc, previous and next) and returns focus on close.
- [ ] Lighthouse targets in section 12 are met.
- [ ] Deployed to Cloudflare Pages without any provider account other than Cloudflare.

### Mode B: Portfolio + Digital Shop

- [ ] With `shopEnabled: true` and valid `products.json`, `/shop` and `/shop/[slug]` exist for every product.
- [ ] Sitemap includes shop URLs.
- [ ] Every Buy button points to an HTTPS URL on an allowlisted checkout host.
- [ ] Build fails on duplicate product IDs, a dangling `productId`, or an invalid checkout URL.
- [ ] No master image or file is present in `out/` or in Git history.
- [ ] A real or sandbox purchase confirms: checkout opens, a payment method works, Payhip sends confirmation, the buyer downloads the unwatermarked master.
- [ ] Payment methods shown or promised on the site match what was verified in testing.
- [ ] Portfolio Core pages still meet the Lighthouse targets.

### Both modes

- [ ] Switching the flag and rebuilding produces the correct output for each mode without code changes.
- [ ] `npm run verify` (build audit) passes for the configured mode.

## 14. Constraints

- Static export only; no server runtime of any kind.
- Content managed as local JSON; no CMS.
- Hosting on Cloudflare Pages (check current file-count and file-size limits during deployment setup).
- Next.js default image optimizer is unavailable in static export, so images are pre-processed with Sharp.
- Video is external only.
- Single language and single currency per product, no automatic multi-currency.
- Solo or small-team implementation; scope must stay MVP-sized.

## 15. Risks

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Payhip and Midtrans/QRIS integration may not work as assumed for the account or market | Mode B payment promise fails | Treat as unverified; verification task (TASK-0.5, TASK-7.5); keep `checkoutUrl` provider-agnostic so another external checkout can replace Payhip |
| R2 | Master files leak via Git or public directory | Loss of paid content value | Git-ignored `private/`; build audit checks previews and `out/` |
| R3 | Watermark is bypassed or removed | Previews reused without payment | State plainly that watermark is not absolute protection; keep previews small |
| R4 | Large galleries slow down pages | Lighthouse targets missed | Responsive WebP, lazy loading, explicit dimensions, avoid heavy libraries |
| R5 | Scope creep toward CMS, cart, universal portfolio | MVP delay and loss of positioning | Out-of-scope list; AGENTS.md guardrails |
| R6 | Static export limits (no optimizer, no middleware, no ISR) | Unexpected rework | Decisions made around these limits in ARCHITECTURE.md |
| R7 | Conditional route generation behaves differently in the pinned Next.js version | Shop routes leak into Mode A output | Spike task (TASK-6.1), build audit (`verify`) |
| R8 | Third-party video embeds add tracking and weight | Privacy and performance cost | Click-to-load facade, privacy-enhanced embed domains |
| R9 | Reference sites' designs copied too closely | Legal and originality problems | Inspiration only; DESIGN.md defines own identity |
| R10 | Incorrect license text sold with a product | Legal exposure for the creator | License summaries are authored by the creator; Pholio only displays them |
| R11 | M2 motion libraries (GSAP, Lenis) impact bundle size or performance on low-end devices | Lighthouse targets missed; poor UX on mobile | Bundle analysis; `prefers-reduced-motion` fallback; conditional loading; test on low-end devices |

## 16. Assumptions and Items Requiring Verification

| ID | Item | Type | Status |
|---|---|---|---|
| A1 | Payhip supports Midtrans as a payment gateway for the creator's account | Verification | **Unverified**; verify before any Mode B promise |
| A2 | QRIS is available to buyers through the Payhip-Midtrans path | Verification | **Unverified** |
| A3 | International cards are accepted for the creator's account and transactions | Verification | **Unverified**; do not advertise until tested |
| A4 | Payhip delivers the uploaded file after confirmed payment, as described | Verification | Verify by test purchase |
| A5 | Payhip fees, terms, and product-type rules suit the creator's use case | Verification | Verify at account setup |
| A6 | `generateStaticParams` and route behavior in the pinned Next.js version produce no shop output in Mode A | Verification | Verify in TASK-6.1 |
| A7 | Cloudflare Pages limits (files per deployment, max file size) fit expected site size | Verification | Verify at TASK-10.3 |
| A8 | Creators or implementers are comfortable editing JSON | Assumption | Accepted for MVP |
| A9 | One language per site is sufficient | Assumption | Accepted for MVP |
| A10 | Email and social links satisfy contact needs without a form backend | Assumption | Accepted for MVP; form provider is P2 |
| A11 | Candidate fonts and accent color are acceptable | Assumption | Confirm in TASK-2.2 |
| A12 | GSAP, ScrollTrigger, and Lenis work correctly in Next.js App Router static export with client components | Verification | Verify in TASK-2.5 |
| A13 | `prefers-reduced-motion` behavior is correctly implemented and tested | Verification | Verify in TASK-2.5 |
| A14 | Motion performance on mobile and low-end devices meets Lighthouse targets | Verification | Verify in TASK-2.5 |

## 17. Open Questions

1. Which npm package manager convention should template users follow? (Default assumption: npm.)
2. Should the template ship with demo content, or placeholders only? (Proposed: placeholder demo content, tracked in TASK-0.3.)
3. Which minimum set of license types should the product schema support? (Proposed: free text summary plus a short type label.)
