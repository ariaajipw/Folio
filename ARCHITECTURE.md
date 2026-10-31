# Pholio: Architecture

| | |
|---|---|
| **Document status** | Draft v0.1, 2026-10-31 |
| **Owns** | How the system is structured: stack, routing, data, build, images, shop module, security, deployment |
| **Related** | [PRD.md](./PRD.md) (requirements), [DESIGN.md](./DESIGN.md) (visuals), [TASKS.md](./TASKS.md) (order), [AGENTS.md](./AGENTS.md) (AI rules) |

> Everything here is a **design**. No code exists yet. Items marked **Verify** must be confirmed during implementation and must not be treated as facts until then.

---

## 1. Architecture Principles

1. **Static first.** Pholio compiles to static files. There is no backend runtime of any kind.
2. **Portfolio Core is independent.** It never imports, configures, or waits on Shop code, Payhip, or Midtrans.
3. **Shop is a removable module.** When disabled, shop routes, UI, data, and configuration are absent, not hidden.
4. **Content is data.** All content lives in typed, validated local JSON.
5. **Fail at build time.** Invalid content, broken references, and unsafe URLs stop the build, not the visitor.
6. **Private stays private.** Master files and secrets never reach `public/`, Git, or the browser.
7. **Smallest thing that works.** No dependency, abstraction, or service without a clear MVP need.
8. **Single source of truth per decision.** This document owns technical decisions; others reference it.

## 2. Technology Stack

| Component | Technology | Notes |
|---|---|---|
| Framework | Next.js, App Router | Version pinned at TASK-1.1 (stable, compatible release) |
| Language | TypeScript | Strict mode |
| UI | React | Server Components by default |
| Styling | Tailwind CSS v4 | CSS-first configuration with design tokens |
| Rendering | Static generation, `output: 'export'` | No SSR |
| Content | Local JSON | `content/*.json` |
| Images | Sharp via Node.js scripts | Local pre-commit step |
| Commerce *(optional)* | Payhip | External checkout and delivery |
| Payments *(optional)* | Midtrans through Payhip, QRIS | **Verify** (see section 16) |
| Hosting | Cloudflare Pages | Static output `out/` |
| VCS | Git | |

Do not invent version numbers or use deprecated APIs. Read the official documentation of the pinned versions at initialization.

## 3. Next.js App Router and Static Export

`next.config` sets `output: 'export'`. Consequences:

| Capability | Status in Pholio |
|---|---|
| React Server Components | Used by default for pages and layout |
| Client Components | Only where interactivity is needed (mobile menu, category filter, lightbox, video facade) |
| Server Actions | **Not used** |
| Runtime Route Handlers / API routes | **Not used** |
| Middleware needing a server | **Not used** |
| Dynamic SSR | **Not used** |
| Next.js default image optimizer | **Unavailable** (requires a server); images are pre-processed with Sharp and rendered with a plain responsive `<img>` or `next/image` with `unoptimized` (decide in TASK-2.4) |
| `next/font` | Allowed; fonts are self-hosted at build |
| Metadata API | Used; evaluated at build time |
| `sitemap` and `robots` metadata files | Allowed because they are evaluated at build time and emitted as static files (mark as force-static). They are not runtime handlers. |
| Dynamic routes | Must be fully enumerated with `generateStaticParams` and must not allow unknown params (`dynamicParams = false`) |

## 4. Rendering Strategy

- Every route is pre-rendered at build time into `out/`.
- Data is read from JSON by server code during the build; the browser receives only what the page needs.
- Client-side JavaScript is limited to progressive enhancement (menu, filter, lightbox, video facade).
- Content changes require a rebuild and redeploy.

## 5. Suggested Directory Structure

```text
.
├── README.md  PRD.md  ARCHITECTURE.md  DESIGN.md  TASKS.md  AGENTS.md
├── next.config.(ts|mjs)
├── content/
│   ├── site.json                 # identity, site info, features
│   ├── gallery.json              # categories + works
│   ├── products.json             # Mode B only (never read in Mode A)
│   └── generated/
│       └── image-manifest.json   # produced by scripts/process-images
├── public/
│   ├── images/                   # web previews only (WebP variants)
│   ├── _headers                  # Cloudflare Pages headers (planned)
│   └── favicon, og images, etc.
├── private/                      # GIT-IGNORED
│   ├── source/                   # original images (pipeline input)
│   └── masters/                  # sold files, full-res, no watermark
├── scripts/
│   ├── process-images.mjs        # Sharp pipeline
│   ├── image-pipeline.config.json
│   ├── lib/read-mode.mjs         # shared shop-mode reader for tooling (section 6.1)
│   ├── validate-content.mjs      # build-time validation (prebuild)
│   └── verify-build.mjs          # post-build mode audit (postbuild)
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                      # Home
    │   ├── gallery/page.tsx              # Gallery
    │   ├── gallery/[slug]/page.tsx       # Work detail
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── shop/[[...slug]]/page.tsx     # Mode B only (see section 7)
    │   ├── sitemap.ts   robots.ts   not-found.tsx
    ├── components/
    │   ├── ui/            # primitives
    │   ├── layout/        # SiteHeader, SiteFooter, MobileMenu
    │   ├── portfolio/     # Hero, WorkGrid, WorkCard, CategoryFilter, Lightbox, VideoEmbed
    │   └── shop/          # ProductCard, ProductDetail, CheckoutCTA, LicenseSummary (shop-only)
    └── lib/
        ├── features.ts    # isShopEnabled()
        ├── navigation.ts  # getNavItems()
        ├── content/       # site.ts, gallery.ts, products.ts loaders
        └── types/         # TypeScript types
```

**Boundary rule:** nothing in `src/components/portfolio`, `src/components/ui`, or `src/components/layout` may import from `src/components/shop` or `products` loaders directly. Shop is reached only through gated composition points (section 8).

## 6. Feature Configuration (`shopEnabled`)

### 6.1 Source of truth

```json
{
  "features": {
    "shopEnabled": false
  }
}
```

- Lives only in `content/site.json`. There is no environment-variable override.
- Application code reads it only through a single accessor, `isShopEnabled()` in `src/lib/features.ts`.
- Build tooling that runs outside the app (`scripts/validate-content.mjs`, `scripts/verify-build.mjs`, and the fallback route strategy in `next.config`, section 7.2) must also know the mode. It reads the flag only through one shared helper, `scripts/lib/read-mode.mjs`. These two readers are the only places that touch the raw value, and both apply the same rule: absent or non-boolean fails.
- Evaluated at build time. Absent or non-boolean values fail validation.
- New feature flags must be justified; the MVP has exactly one.

### 6.2 Behavior matrix

| Layer | `shopEnabled: false` (Mode A) | `shopEnabled: true` (Mode B) |
|---|---|---|
| Config | `isShopEnabled()` returns `false` | Returns `true` |
| Content loading | `products.json` is **not read**; may be missing, empty, or malformed | `products.json` is loaded and validated |
| Build validation | Skips product, checkout URL, and master-reference checks. Gallery `productId` values are ignored (the build prints a one-line notice) | Runs full validation (section 14) |
| Routing | `/shop` and `/shop/[slug]` are **not emitted** | Emitted for the listing and every valid product |
| Navigation | `getNavItems()` returns Work, About, Contact | `getNavItems()` returns Work, About, Contact |
| Footer | No shop link | No shop link (shop may have contextual entry point elsewhere) |
| Homepage | No shop teaser section; no leftover spacing | Optional featured-products section |
| Work detail | No purchase link even if `productId` exists | Link to product when `productId` resolves to an available product |
| Metadata | Sitemap excludes shop URLs; no Product structured data | Included |
| JS bundle | Shop components are unreachable from any rendered page | Included where used |
| Build output audit | `out/shop` absent, no `data-shop` marker, no `payhip` string | `out/shop/index.html` present; checkout URLs pass allowlist |
| Secrets | None needed | None needed (secrets never belong in this project) |

Hiding shop UI with CSS is **never** acceptable. The difference must exist in routes, rendering, data, and validation.

### 6.3 Switching modes

**A to B:** set the flag to `true`, add and validate `products.json`, prepare masters privately, create products in Payhip, copy checkout URLs, build, run `verify`, run a test purchase.

**B to A:** set the flag to `false`, rebuild, run `verify`. `products.json` may remain on disk; it is ignored. Master files stay private and untouched.

## 7. Conditional Routing

### 7.1 Portfolio routes (always generated)

| Route | Source |
|---|---|
| `/` | `site.json`, featured works |
| `/gallery` | `gallery.json` |
| `/gallery/[slug]` | `generateStaticParams` over works |
| `/about`, `/contact` | `site.json` |
| `/404` | `not-found.tsx` |
| `/sitemap.xml`, `/robots.txt` | build-time metadata files |

### 7.2 Shop routes (Mode B only)

**Primary strategy (recommended, Verify in TASK-6.1):** a single optional catch-all route `src/app/shop/[[...slug]]/page.tsx` handling both the listing (`/shop`) and detail (`/shop/<slug>`).

- `generateStaticParams` returns `[]` when `isShopEnabled()` is `false`.
- When `true`, it returns the listing (empty slug) plus one entry per valid product.
- `dynamicParams = false`.
- In Mode A nothing is emitted for `/shop`.

**Fallback strategy (Verify in TASK-6.1):** if the pinned Next.js version rejects or mishandles an empty parameter list under `output: 'export'`, exclude shop route files from the build when the flag is `false` (for example by configuring recognized page extensions from `site.json` at build configuration time, so shop route files are not treated as pages).

**Acceptance for either strategy:** with `shopEnabled: false`, `out/shop` does not exist and the build succeeds without `products.json`. `verify-build.mjs` enforces this on every build.

Do not use a `notFound()` call inside a shop page as the "disabled" mechanism; that still emits a route artifact.

## 8. Conditional Navigation and Composition

- `getNavItems()` in `src/lib/navigation.ts` is the only producer of navigation items. It builds the core list: **Work, About, Contact**. The primary navigation never includes Shop.
- Header, mobile menu, and footer all consume `getNavItems()`; none hard-code a Shop link.
- Shop (when enabled) may have a contextual entry point elsewhere (e.g., a "Shop" link in the homepage hero or a "Available as download" link on work detail pages), but not in the primary navigation.
- Homepage composition and work-detail composition call shop sections only inside an `isShopEnabled()` guard, using shop component modules loaded only in that branch.
- All shop-rendered elements carry a `data-shop` attribute so the build audit can prove absence in Mode A.
- Layout must not reserve space for shop elements; removing them leaves no gaps (see DESIGN.md).

## 9. JSON Data Architecture

### 9.1 Files

| File | Purpose | Mode A | Mode B |
|---|---|---|---|
| `content/site.json` | Identity, contact, social, SEO defaults, features | Required | Required |
| `content/gallery.json` | Categories and works | Required | Required |
| `content/products.json` | Products | Not read | Required |
| `content/generated/image-manifest.json` | Generated by the image pipeline | Required | Required |

### 9.2 `site.json` (illustrative shape)

```json
{
  "site": {
    "name": "Studio Name",
    "url": "https://example.com",
    "language": "en",
    "description": "Short site description for SEO."
  },
  "creator": {
    "name": "Creator Name",
    "disciplines": ["photography", "videography"],
    "tagline": "One line that frames the work.",
    "bio": "Longer about text.",
    "location": "City, Country",
    "portrait": { "src": "about/portrait", "alt": "Portrait of the creator" }
  },
  "hero": {
    "image": { "src": "home/hero", "alt": "Descriptive alt text" }
  },
  "contact": {
    "email": "hello@example.com",
    "availability": "Available for commissions from March."
  },
  "social": [
    { "platform": "instagram", "url": "https://instagram.com/handle" }
  ],
  "features": {
    "shopEnabled": false
  }
}
```

### 9.3 `gallery.json` (illustrative shape)

```json
{
  "categories": [
    { "id": "landscape", "label": "Landscape" }
  ],
  "works": [
    {
      "id": "work-001",
      "slug": "morning-fog",
      "title": "Morning Fog",
      "type": "photo",
      "category": "landscape",
      "year": 2026,
      "featured": true,
      "order": 1,
      "cover": { "src": "gallery/morning-fog/01", "alt": "Fog over a ridge at sunrise" },
      "images": [
        { "src": "gallery/morning-fog/01", "alt": "Fog over a ridge at sunrise" }
      ],
      "description": "Short description.",
      "details": [
        { "label": "Camera", "value": "Model name" },
        { "label": "Location", "value": "Place" }
      ],
      "productId": "prod-001"
    },
    {
      "id": "work-002",
      "slug": "city-reel",
      "title": "City Reel",
      "type": "video",
      "category": "motion",
      "year": 2026,
      "cover": { "src": "gallery/city-reel/poster", "alt": "Still frame from the reel" },
      "video": { "provider": "vimeo", "id": "123456789" }
    }
  ]
}
```

Rules:

- `type`: `photo`, `design`, `artwork`, or `video`. Type decides layout and which fields are expected (images for photo, design, artwork; `video` for video).
- `details` is a generic label and value list, rendered according to type.
- `src` values are image **base keys** resolved through the image manifest (section 10). Authors do not write variant paths or pixel sizes.
- `productId` is optional, and meaningful only in Mode B.
- `video.provider`: `youtube`, `vimeo`, or `file`. For `youtube` and `vimeo` the author provides an ID; for `file` an HTTPS URL to an externally hosted file. Raw embed HTML is never accepted.

### 9.4 `products.json` (illustrative shape, Mode B only)

```json
{
  "products": [
    {
      "id": "prod-001",
      "slug": "morning-fog-digital",
      "title": "Morning Fog: Digital Download",
      "description": "What the buyer receives.",
      "preview": { "src": "shop/morning-fog/preview", "alt": "Watermarked preview" },
      "price": { "amount": 150000, "currency": "IDR" },
      "license": {
        "label": "Personal use",
        "summary": "Plain-language summary of permitted use."
      },
      "file": { "format": "JPEG", "resolution": "6000x4000" },
      "checkoutUrl": "https://payhip.com/b/EXAMPLE",
      "status": "available"
    }
  ]
}
```

- `status`: `available` or `unavailable`. Unavailable products render without a Buy link.
- `checkoutUrl` is provider-agnostic in shape; Payhip is the default, and any other provider must be added to the allowlist deliberately.
- Products may exist without a related work (for example a standalone asset).
- No secrets, API keys, tokens, or private file paths in this file.

### 9.5 Gallery to product relationship

```text
gallery.work.productId  ──►  products.product.id   (optional, many works to one product allowed)
```

- The reference is one-directional (work to product). Products never reference works.
- Mode B: a dangling `productId` fails the build.
- Mode A: `productId` is ignored; nothing is rendered or validated.
- Not every work needs a product.

### 9.6 TypeScript types

Types for site, gallery, work, product, and manifest live in `src/lib/types/`. Loaders in `src/lib/content/` parse and return typed data. The products loader returns an empty result **without touching the file system** when the shop is disabled. Validation (section 14) and types must stay aligned; lightweight hand-written validation is preferred, and a schema library is added only if justified in TASK-1.4.

## 10. Image Pipeline

### 10.1 Overview

Sharp-based Node.js script, run **locally** (not in the Cloudflare build):

```text
private/source/*  ──►  scripts/process-images.mjs  ──►  public/images/**  (WebP variants)
                                                   └──►  content/generated/image-manifest.json
```

Generated previews and the manifest are committed. Cloudflare builds do not have access to originals.

### 10.2 Capabilities (MVP)

| Capability | Priority |
|---|---|
| Resize to configured widths | P0 |
| Convert to WebP | P0 |
| Compress with configurable quality | P0 |
| Output naming configuration | P0 |
| Write manifest (variants, intrinsic width and height) | P0 |
| Optional watermark | P1 |
| Low-quality placeholder | P2 |

Configuration lives in `scripts/image-pipeline.config.json` (widths, quality, naming, watermark on or off and its settings). Avoid building anything more complex for the MVP.

### 10.3 Manifest contract

The manifest maps an image base key to its variants:

```json
{
  "gallery/morning-fog/01": {
    "width": 6000,
    "height": 4000,
    "variants": [
      { "w": 480,  "src": "/images/gallery/morning-fog/01-480.webp" },
      { "w": 960,  "src": "/images/gallery/morning-fog/01-960.webp" },
      { "w": 1600, "src": "/images/gallery/morning-fog/01-1600.webp" }
    ]
  }
}
```

A shared responsive image component reads the manifest to produce `srcset`, `sizes`, and explicit `width` and `height` (preventing layout shift). Preview width is capped (for example, longest edge at most 2400 px) so full-resolution files cannot be published by accident.

### 10.4 Master vs preview separation

| | Public preview | Master |
|---|---|---|
| Purpose | Display on the website | Delivered to buyers by Payhip |
| Resolution | Web-sized, capped | Full resolution |
| Watermark | Optional | **Never** |
| Location | `public/images/` | `private/masters/` |
| In Git | Yes | **No** (ignored) |
| Needed in Mode A | Yes | No |
| Uploaded to | Cloudflare Pages (via build) | Payhip, manually, only for sold products |

Backups of `private/` are the owner's responsibility because Git does not hold it.

## 11. Video Embed Strategy

- No custom video hosting, processing, or upload system.
- Embed URLs are **constructed in code** from `provider` and `id`; JSON never carries raw HTML or arbitrary iframe sources.
- Privacy-enhanced domains are used where the provider offers them.
- `youtube` and `vimeo`: iframe with a descriptive `title`, `loading="lazy"`, and (P1) a poster-based facade that loads the iframe only on click.
- `file`: HTTPS URL to an externally hosted file; rendered with a native video element (`controls`, `preload="metadata"`, `poster`). P1.
- A poster image (the work `cover`) is required for every video work.

## 12. M2 Motion Architecture (MVP)

The MVP targets **M2: scroll-led animations** using GSAP, ScrollTrigger, and Lenis. Three.js is deferred and not part of the MVP.

### 12.1 Client-component boundary

- All motion logic lives in **Client Components** (`"use client"`).
- Server Components (pages, layout, portfolio components) render static markup and compose motion-enabled client components where needed.
- Motion initialization runs in `useEffect` (mount) with cleanup in the effect's return function (unmount/route change).
- No motion code runs during server rendering or static generation.

### 12.2 GSAP and ScrollTrigger

- GSAP and ScrollTrigger are loaded only in client components that use them.
- ScrollTrigger instances are created on mount and killed on cleanup (`ScrollTrigger.getAll().forEach(t => t.kill())`).
- Animations are defined as timelines or individual tweens tied to ScrollTrigger triggers.
- Use `markers: false` in production; enable only for debugging.
- Section choreography: each major content section (hero, featured works, gallery, about, contact) may have an entrance animation and/or scroll-linked progression.

### 12.3 Lenis smooth scrolling

- Lenis is initialized once, typically in a root layout client component or a dedicated provider.
- Lenis handles smooth scrolling; ScrollTrigger uses Lenis as its scroller via `ScrollTrigger.scrollerProxy()`.
- Synchronization:
  ```ts
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- Cleanup: `lenis.destroy()` on unmount.

### 12.4 `prefers-reduced-motion`

- A `useReducedMotion` hook reads `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- When reduced motion is preferred:
  - Lenis is not initialized (native scrolling).
  - GSAP animations are skipped or run instantly (`duration: 0`).
  - ScrollTrigger instances are not created.
- The hook provides a boolean that client components use to branch behavior.

### 12.5 Mobile and performance considerations

- Lenis is disabled on touch devices by default (native scrolling is preferred on mobile). Override only if testing confirms a good experience.
- GSAP animations are kept lightweight; prefer `transform` and `opacity` over layout-triggering properties.
- Bundle size: GSAP + ScrollTrigger + Lenis ≈ 60–70 kB gzipped. Monitor in TASK-2.5.
- Lighthouse Performance targets (section 12 of PRD) must be met with motion enabled.

### 12.6 Route transitions and cleanup

- Next.js App Router navigation (client-side) unmounts outgoing page components and mounts incoming ones.
- Effect cleanup in each motion component must kill its ScrollTriggers and stop its Lenis instance (if not using a shared global instance).
- A shared Lenis context/provider is recommended to avoid multiple instances and ensure clean handoff between routes.

---

## 13. Optional Shop Architecture

- Lives in `src/components/shop/`, `src/lib/content/products.ts`, and the `shop` route.
- Components: `ProductCard`, `ProductDetail`, `LicenseSummary`, `CheckoutCTA`.
- Reached only from gated composition points (section 8).
- Reads only `products.json` and the shared image manifest.
- Contains no payment logic. A product page renders data and an external link.
- Removing the shop means deleting the shop directory, the shop route, `products.ts`, and the gated composition branches. Portfolio Core must continue to build unchanged. TASK-6.7 verifies this property.

## 13. Payhip and Midtrans Integration, Checkout Flow, Digital Delivery

### 13.1 Roles

| Provider | Role | Status |
|---|---|---|
| Payhip | Digital product catalog, checkout, payment confirmation, file delivery | **Selected**; account verification required |
| Midtrans | Payment gateway connected via Payhip's supported integration | **Selected**; integration **Unverified** |
| QRIS | Primary payment method for the Indonesian market (via Midtrans) | **Unverified** |
| International cards | Optional, for non-Indonesian buyers (via Midtrans) | **Unverified**; depends on account and transaction type |

### 13.2 Checkout flow

```text
Visitor ─► Product page (preview, price, license)
        ─► Buy ─► external redirect to Payhip checkout
        ─► Pays (available method)
        ─► Payhip confirms payment
        ─► Payhip emails buyer + provides download access
        ─► Buyer downloads unwatermarked master
```

### 13.3 What the website does and does not do

| The website does | The website does not |
|---|---|
| Show product data, price, license, preview | Process payments or handle transactions |
| Link to an allowlisted, validated external checkout URL | Create webhooks or receive provider callbacks |
| State only payment methods that were verified | Store card data, orders, or customer data |
| | Deliver files or implement a delivery backend |
| | Treat provider integration as active before testing |

### 13.4 Rules

- Never claim Payhip-Midtrans, QRIS, or international card support in UI copy or docs until verified by a real test (TASK-7.4, TASK-7.5).
- Checkout host allowlist is defined in one place (`src/lib/` constant shared with `validate-content.mjs`). The initial allowlist contains the Payhip host only. Verify the exact host pattern when creating the first product.
- If Payhip proves unsuitable, `checkoutUrl` allows swapping to another external checkout provider without schema changes; only the allowlist and copy change.

## 14. Build Validation

`npm run build` runs `validate-content.mjs` first (`prebuild`) and `verify-build.mjs` last (`postbuild`). Both are planned (TASK-1.4, TASK-1.6, TASK-6.7).

### 14.1 Pre-build validation

| Check | Mode A | Mode B |
|---|---|---|
| JSON parses; matches expected shape | site, gallery | site, gallery, products |
| `features.shopEnabled` is a boolean | ✔ | ✔ |
| Unique IDs and slugs (works, categories, products) | ✔ | ✔ |
| Each work references an existing category | ✔ | ✔ |
| Image keys exist in the manifest and variant files exist | ✔ | ✔ |
| Alt text present for every non-decorative image | ✔ | ✔ |
| Video entries valid (provider, ID or HTTPS URL, poster) | ✔ | ✔ |
| Heuristic scan for secret-looking strings in content | ✔ | ✔ |
| `products.json` read | **No** | Yes |
| `productId` resolves to a product | Ignored | ✔ (fail if dangling) |
| `checkoutUrl` is HTTPS and on the allowlisted host | Skipped | ✔ |
| Price, currency, and license fields present | Skipped | ✔ |
| Product preview images exist in the manifest | Skipped | ✔ |

Errors must name the file, the item ID, and the problem.

### 14.2 Post-build audit (`verify-build.mjs`)

| Check | Mode A | Mode B |
|---|---|---|
| `out/shop` absent | ✔ | n/a |
| No HTML contains `data-shop` | ✔ | n/a |
| No output file references the checkout host | ✔ | n/a |
| `out/shop/index.html` and all product pages exist | n/a | ✔ |
| Every Buy link passes the allowlist | n/a | ✔ |
| No output image exceeds the configured preview size cap | ✔ | ✔ |
| No file from `private/` (by name or hash) appears in `out/` | ✔ | ✔ |
| Sitemap contents match the mode | ✔ | ✔ |

## 15. SEO

- Metadata API per route: title, description, canonical (from `site.url`), Open Graph, Twitter.
- Open Graph images are static files derived from preview images.
- `sitemap.xml` and `robots.txt` generated at build time; shop URLs only in Mode B.
- Structured data (P1): `Person` for the creator, `ImageObject` for works, `Product` only in Mode B and only with accurate price and availability.
- Semantic HTML, a single `h1` per page, `lang` set from `site.language`, required alt text.
- Statically generated pages for crawlability.

## 16. Items Requiring Verification

| ID | Item | Where resolved |
|---|---|---|
| V1 | Payhip supports Midtrans for the creator's account and region | TASK-0.5, TASK-7.5 |
| V2 | QRIS availability through the Payhip path | TASK-7.5 |
| V3 | International card acceptance | TASK-7.5 |
| V4 | Payhip delivers the file as expected after payment | TASK-7.4 |
| V5 | Exact Payhip checkout host and link format (for the allowlist) | TASK-7.1 |
| V6 | Empty `generateStaticParams` behavior under `output: 'export'` in the pinned Next.js version | TASK-6.1 |
| V7 | Cloudflare Pages file-count and file-size limits vs. site size | TASK-10.3 |
| V8 | Pretty-URL and trailing-slash behavior on Cloudflare Pages with the static export | TASK-10.3 |
| V9 | Whether a CSP is compatible with hydration scripts in the static export | TASK-9.4 (P2) |
| V10 | GSAP, ScrollTrigger, and Lenis work correctly in Next.js App Router static export with client components | TASK-2.5 |
| V11 | `prefers-reduced-motion` behavior is correctly implemented and tested | TASK-2.5 |
| V12 | Motion performance on mobile and low-end devices meets Lighthouse targets | TASK-2.5 |

## 17. Cloudflare Pages Deployment

| Setting | Value |
|---|---|
| Source | Git repository |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | Set explicitly to match the pinned Next.js requirement (Verify) |
| Runtime | None (static assets only) |
| Environment variables | None required for either mode |
| Headers | `public/_headers` (planned) |
| 404 | `404.html` from `not-found.tsx` |

The same pipeline deploys both modes; mode is determined by committed `site.json`. Preview deployments follow the same rule.

## 18. Security

| Area | Rule |
|---|---|
| Secrets | Never in JSON, frontend code, or Git. Payhip and Midtrans credentials are managed in those providers' dashboards and never enter this repo. |
| Master files | Only in `private/masters/` (Git-ignored); never in `public/`; build audit checks `out/`. |
| Watermark | A deterrent, not protection. Keep previews small. Do not claim otherwise. |
| External links | `rel="noopener noreferrer"`; checkout URLs validated at build time. |
| Embeds | Provider-controlled URLs built in code; no raw HTML from JSON. |
| Headers | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` via `_headers`. A Content-Security-Policy is **optional and P2**: introduce it report-only first, because inline hydration scripts in a static export can break a strict policy (Verify, V9). |
| Dependencies | Add only when necessary; pin versions; review before adding. |
| Right-click or drag blocking | Not implemented; it is not real protection and harms usability. |
| Data collection | The site collects none in MVP (no forms, no analytics by default). |