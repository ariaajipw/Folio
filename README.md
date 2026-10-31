# Pholio

> A minimalist, editorial, visual-first portfolio template for photographers, videographers, graphic designers, and visual artists, with an optional, fully modular digital shop.

| | |
|---|---|
| **Document status** | Draft v0.1, 2026-10-30 |
| **Project phase** | Phase 0: Documentation and Project Preparation |
| **Implementation status** | No application code exists yet |

> **Read this first.** Everything below that describes commands, directories, or configuration is **planned** unless it is explicitly marked as available. Do not assume a command works until the task that creates it is `DONE` in [TASKS.md](./TASKS.md).

---

## 1. Project Overview

Pholio is a reusable website template for **visual creators**. It is built to present photography, graphic design, visual artwork, and video showcases with a clean, cinematic, editorial look in which the work, not the interface, is the focus.

A single codebase serves two usage modes, controlled by one configuration flag.

## 2. Product Positioning

**Pholio is:** a reusable visual portfolio template with an optional, modular digital commerce layer.

**Pholio is not:**

- A universal portfolio template for every profession (no developer, writer, or consultant case-study layouts).
- A marketplace or multi-vendor platform.
- A SaaS platform.
- A standalone e-commerce platform.
- A CMS.
- A custom payment processing system.

## 3. Usage Modes

| | Mode A: Portfolio Only | Mode B: Portfolio + Digital Shop |
|---|---|---|
| **Purpose** | Professional showcase of work, identity, and contact info | Showcase plus a storefront for selling selected works or digital assets |
| **Config** | `features.shopEnabled: false` | `features.shopEnabled: true` |
| **Shop pages and nav** | Not generated, not shown | Generated and shown |
| **Buy / Checkout UI** | None | External checkout buttons on products |
| **`products.json`** | Not required, never read | Required and validated at build time |
| **Payhip / Midtrans** | No dependency, no account needed | Required (see verification notes in [ARCHITECTURE.md](./ARCHITECTURE.md)) |
| **Master (full-resolution) files** | Not needed | Needed only for products that are sold; stored privately |
| **Watermark** | Optional | Optional (recommended for sold works) |
| **Backend / database** | None | None (checkout and delivery are handled by the external provider) |

Both modes share the same application foundation, design system, and components. The shop is a removable module: when it is disabled, no shop route, menu item, button, data dependency, or payment configuration remains.

## 4. Features

**Always included (Portfolio Core):**

- Homepage with creator identity and a visual-first hero
- Gallery with categories and category filter
- Featured works
- Work detail pages (photo, design, artwork, video showcase)
- Image lightbox
- About and Contact pages, social links
- SEO basics, responsive design, image optimization
- Static deployment

**Optional (Digital Shop, only when `shopEnabled: true`):**

- Shop listing and product detail pages
- Price and license information
- External checkout via Payhip (Midtrans/QRIS support to be verified)
- Digital delivery handled entirely by Payhip

Full requirements: [PRD.md](./PRD.md).

## 5. Technology Stack

| Component | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI library | React |
| Styling | Tailwind CSS v4 |
| Rendering | Static generation with static export (`output: 'export'`) |
| Content | Local JSON files |
| Image processing | Sharp (Node.js scripts) |
| Digital commerce *(optional)* | Payhip |
| Payment gateway *(optional)* | Midtrans, via Payhip's supported integration (**unverified**) |
| Hosting | Cloudflare Pages |
| Version control | Git |

Exact dependency versions are pinned when the project is initialized (TASK-1.1). Versions are intentionally not listed here.

## 6. Prerequisites

*(Planned. Confirm during TASK-1.1.)*

- Node.js LTS release that satisfies the engine requirement of the Next.js version chosen at initialization
- npm (default package manager assumption; confirm at initialization)
- Git
- A Cloudflare account (for deployment)
- **Mode B only:** a Payhip account, and verified payment-method support for the intended market (see [ARCHITECTURE.md](./ARCHITECTURE.md), "Items requiring verification")

## 7. Installation

*(Planned. Not yet available.)*

```bash
git clone <your-pholio-based-repository-url>
cd <repository-folder>
npm install
```

## 8. Development Commands

*(Planned. Each command becomes available when its task in TASKS.md is `DONE`.)*

| Command | Purpose | Status |
|---|---|---|
| `npm run dev` | Start the local development server | Planned (Phase 1) |
| `npm run validate` | Validate content JSON and cross-references | Planned (Phase 1) |
| `npm run images` | Process source images into web previews and a manifest | Planned (Phase 8) |
| `npm run lint` | Lint the codebase | Planned (Phase 1) |
| `npm run typecheck` | Run the TypeScript compiler without emitting | Planned (Phase 1) |

## 9. Build Commands

*(Planned.)*

| Command | Purpose | Status |
|---|---|---|
| `npm run build` | Validate content, then produce the static export in `out/` | Planned (Phase 1) |
| `npm run verify` | Audit `out/` against the configured mode (also runs after build) | Planned (Phase 1, extended in Phase 6) |

Because the site is a static export, `next start` does not apply. Preview `out/` with any static file server (tool to be chosen in Phase 1).

## 10. Project Structure

*(Planned. Authoritative version: [ARCHITECTURE.md](./ARCHITECTURE.md).)*

```text
.
├── README.md, PRD.md, ARCHITECTURE.md, DESIGN.md, TASKS.md, AGENTS.md
├── content/
│   ├── site.json            # Identity, site info, feature flags
│   ├── gallery.json         # Categories and works
│   ├── products.json        # Digital products (read only when shop is enabled)
│   └── generated/           # Image manifest produced by the pipeline
├── public/
│   └── images/              # Web-optimized previews only
├── private/                 # Git-ignored: source images and master files
│   ├── source/
│   └── masters/
├── scripts/                 # Image pipeline, content validation, build audit
└── src/
    ├── app/                 # App Router routes
    ├── components/
    └── lib/
```

## 11. Feature Configuration

The shop is controlled by **one** setting in `content/site.json`:

```json
{
  "features": {
    "shopEnabled": false
  }
}
```

- `false`: Mode A. Shop routes are not generated, navigation has no Shop item, no purchase UI renders, `products.json` is not read, and no payment provider is involved.
- `true`: Mode B. Shop routes, product data validation, price and license display, and external checkout links are enabled.

The flag is evaluated **at build time**. Changing it requires a rebuild and redeploy. There is no environment-variable override; `site.json` is the single source of truth. Details: [ARCHITECTURE.md](./ARCHITECTURE.md).

## 12. Content Management

Content is edited as local JSON and deployed with a rebuild. There is no CMS or admin dashboard.

| File | Contains | Required in Mode A | Required in Mode B |
|---|---|---|---|
| `content/site.json` | Creator identity, site info, social links, feature flags | Yes | Yes |
| `content/gallery.json` | Categories and visual works | Yes | Yes |
| `content/products.json` | Digital products with price, license, checkout URL | No | Yes |

Not every work needs to be for sale. A work links to a product through an optional `productId`. Never put secrets, API keys, or payment credentials in any JSON file. Schemas: [ARCHITECTURE.md](./ARCHITECTURE.md).

## 13. Image Optimization

*(Planned, Phase 8.)* Image processing is a **local step** run before committing, not part of the Cloudflare build.

1. Place original images in `private/source/` (Git-ignored).
2. Run `npm run images` to produce responsive WebP previews in `public/images/` and update the image manifest.
3. Commit the generated previews and manifest.

For works that are sold (Mode B), keep the full-resolution, unwatermarked master in `private/masters/` (Git-ignored), and upload it to Payhip manually. Masters never go in `public/` and never enter Git. Watermarking is an optional pipeline setting and is **not** absolute protection.

## 14. Deployment

*(Planned, Phase 10.)* Target: Cloudflare Pages, deployed from Git.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `out` |
| Runtime / backend | None |

Both modes deploy the same way. Verify Node version settings and Pages limits at setup time.

## 15. Documentation Map

| Document | Responsibility |
|---|---|
| [README.md](./README.md) | Project introduction and getting started |
| [PRD.md](./PRD.md) | What and why to build |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | How the system is structured |
| [DESIGN.md](./DESIGN.md) | How the product looks and behaves |
| [TASKS.md](./TASKS.md) | What to implement and in which order |
| [AGENTS.md](./AGENTS.md) | Rules for AI-assisted development |

If documents disagree, resolve it in the document that owns the topic and update the others to match.

## 16. Visual References

Used as inspiration for principles and patterns only. Do not copy layouts, text, identity, or assets.

- https://perappelgren.de/
- https://gogokofoto.com/
