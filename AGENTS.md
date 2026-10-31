# AGENTS.md: Rules for AI Coding Agents

| | |
|---|---|
| **Document status** | Draft v0.1, 2026-10-31 |
| **Owns** | Permanent rules for AI-assisted development of Pholio |
| **Related** | [README.md](./README.md), [PRD.md](./PRD.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN.md](./DESIGN.md), [TASKS.md](./TASKS.md) |

This file does not restate product, architecture, or design decisions. It tells you **which document to follow** and **what you must never do**. When in doubt, the owning document wins; if it is silent or contradictory, stop and ask.

---

## 1. Project Context

Pholio is a **reusable visual portfolio template** for photographers, videographers, graphic designers, and visual artists, with an **optional, modular digital shop**.

- **Mode A: Portfolio Only** (`features.shopEnabled: false`). Standalone portfolio, no commerce.
- **Mode B: Portfolio + Digital Shop** (`features.shopEnabled: true`). Adds a catalog and external checkout (Payhip by default).

Both modes use one foundation. Portfolio Core is always the priority and never depends on the Shop.

Pholio is **not** a universal portfolio template, marketplace, SaaS, standalone e-commerce platform, CMS, or custom payment system.

## 2. Tech Stack Rules

| Area | Rule |
|---|---|
| Framework | Next.js **App Router** |
| Language | **TypeScript** (strict) |
| UI | **React**; Server Components by default; Client Components only where interactivity requires |
| Styling | **Tailwind CSS v4** with design tokens (see DESIGN.md) |
| Rendering | **Static export** (`output: 'export'`); no runtime backend |
| Content | **Local JSON** in `content/` |
| Images | **Sharp** via Node.js scripts, run locally |
| Hosting | **Cloudflare Pages** |
| Motion (M2) | **GSAP**, **ScrollTrigger**, **Lenis** — permitted only for M2 motion tasks (TASK-2.6 through TASK-2.11). Do not add other animation libraries. |

Before using any framework API, check the official documentation for the **pinned version**. Do not invent version numbers, options, or APIs, and do not use deprecated APIs.

**Framework lock-in:** Pholio uses **Next.js only**. Do not introduce Astro, Vite, or any other framework. All routing, rendering, and build configuration must remain in Next.js.

## 3. Architecture Rules

- Follow [ARCHITECTURE.md](./ARCHITECTURE.md).
- Do **not** expand Pholio into a universal portfolio template.
- Do **not** add a database, ORM, or any persistent runtime store.
- Do **not** add a backend runtime: no Server Actions, no runtime Route Handlers or API routes, no middleware requiring a server, no dynamic SSR.
- Do **not** implement a custom payment system, payment webhooks, order management, cart, auth, or custom digital-delivery backend.
- **Portfolio Core must stay independent of the Shop.** Core code never imports from `src/components/shop` or product loaders. Shop is reached only through gated composition points.
- In application code, read the shop flag **only** through `isShopEnabled()`. Build tooling (`scripts/`, `next.config`) reads it **only** through the shared helper defined in ARCHITECTURE.md section 6.1. Never read the raw value from JSON anywhere else, and never add an environment-variable override.
- Do not add a dependency unless the task requires it. State the reason and alternatives considered before adding one.
- Do not use the Next.js default image optimizer (unavailable in static export). Use the Sharp pipeline and manifest.
- **Three.js is deferred and prohibited in MVP.** Do not install, import, or reference Three.js, `@react-three/fiber`, `@react-three/drei`, or any WebGL/3D library. Any 3D/immersive feature requires a separate owner decision and a new task phase.

## 4. Design Rules

- Follow [DESIGN.md](./DESIGN.md).
- Keep the **visual-first** identity: the work is the hero; interface stays quiet.
- Build **reusable components**; use design tokens, not raw color or spacing values.
- Do not generalize the UI for other professions at the expense of visual creators.
- Do not copy the reference sites (perappelgren.de, gogokofoto.com). Use their principles only.
- **Shop must be truly modular.** Shop UI, routes, and styles must be removable without leaving gaps, empty menus, or dead spacing in Portfolio Core.
- **Motion follows M2 architecture (GSAP + ScrollTrigger + Lenis).** All scroll and interaction animations use these libraries. Respect `prefers-reduced-motion` at the system level (TASK-2.9).

## 5. Feature Toggle Rules

### When `shopEnabled: false`

- Do **not** render Shop navigation, footer links, or homepage shop sections.
- Do **not** generate Shop routes (`/shop`, `/shop/[slug]`).
- Do **not** render purchase CTAs, even for works that have a `productId`.
- Do **not** require, read, or validate `products.json`; its absence, emptiness, or malformation must not break the build.
- Do **not** require any payment configuration.
- Do **not** run or reference Payhip or Midtrans integrations.
- Hiding with CSS does not count. The difference must exist in routing, rendering, data loading, and validation.

### When `shopEnabled: true`

- Enable Shop components and pages.
- Validate product data (unique IDs, required fields, `productId` references).
- Validate every `checkoutUrl` (HTTPS, allowlisted host).
- Show price and license information.
- Use only external checkout links that have been verified.
- Do not state or imply payment-method support (Midtrans, QRIS, international cards) until it has been verified by a test and recorded (see ARCHITECTURE.md section 16).

### Always

- Mark every shop-rendered element with `data-shop`.
- After any change that touches the toggle, navigation, routing, content loading, or validation, **verify both modes** (section 8).

## 6. Security Rules

- **Never expose master images.** They live only in `private/masters/`, never in `public/`, `src/`, `content/`, or Git.
- **Never put secrets in the frontend, repo, or JSON** (API keys, tokens, payment credentials, private URLs).
- **Never store sensitive data in public JSON.**
- Treat watermarking as a deterrent, **not** absolute protection. Never describe it as secure.
- Do not implement right-click or drag blocking as protection.
- Do not accept raw HTML from content files (for example, video embeds). Build embed URLs in code from provider and ID.
- External links use `rel="noopener noreferrer"`.
- Do not disable, weaken, or bypass build validation or the build audit to make a build pass.

## 7. Development Rules

- **Read the documentation before working.** At minimum, read the sections of PRD, ARCHITECTURE, and DESIGN relevant to your task.
- **Work from [TASKS.md](./TASKS.md).** Identify the task ID and its dependencies before starting. Respect dependency order.
- **Do not do tasks that were not requested.** No bonus features, opportunistic cleanups, or speculative abstractions.
- **No large refactors outside the task's scope.** If you believe one is needed, propose it instead of doing it.
- Keep changes small and reviewable. Match existing conventions.
- Do not mark a task `DONE` unless every acceptance criterion is met and verified. Use `REVIEW` when awaiting confirmation.
- Never claim a command, feature, or integration works unless you ran it or the task is `DONE`. State plainly what you did not verify.
- **Run build validation** (`validate`, `build`, and `verify` when available) before declaring work complete.
- **Check both configuration modes** whenever you change the feature toggle, shared layout, navigation, routing, content loaders, or validation.
- Add only the content fields that the architecture defines; do not invent new schema fields without updating ARCHITECTURE.md.

## 8. Definition of Done Checklist

Before reporting a task complete:

- [ ] Task ID identified; dependencies satisfied
- [ ] All acceptance criteria in TASKS.md met
- [ ] Relevant sections of PRD, ARCHITECTURE, and DESIGN followed
- [ ] `lint` and `typecheck` pass (when available)
- [ ] `build` passes with `shopEnabled: false` and `products.json` absent
- [ ] If Shop is affected: `build` passes with `shopEnabled: true` and valid products
- [ ] `verify` (build audit) passes for each mode tested
- [ ] No secrets, masters, or private paths added
- [ ] No new dependency, or its necessity is explained
- [ ] Accessibility basics checked for any UI change (keyboard, focus, alt text, contrast, reduced motion)
- [ ] Task status updated in TASKS.md; other documents updated if a decision changed

## 9. Ask Before Doing

Stop and ask the owner when:

- A requirement is ambiguous or two documents conflict.
- A change would add a dependency, a runtime feature, a service, or a new config flag.
- A change would touch scope listed as "Out of Scope" in PRD.md.
- A change needs a decision on an item marked "Verify" or "Unverified".
- A change affects Portfolio Core's independence from the Shop.

## 10. Documentation Rules

- **Update the relevant document** whenever an architecture, design, scope, or priority decision changes.
- **Keep all six documents consistent.** One topic has one owning document; others link to it.

| Document | Owns |
|---|---|
| README.md | Project introduction and getting started |
| PRD.md | What and why to build |
| ARCHITECTURE.md | How the system is structured |
| DESIGN.md | How the product looks and behaves |
| TASKS.md | What to implement and implementation order |
| AGENTS.md | Rules for AI-assisted development |

- Write documentation in clear technical English with consistent terminology.
- Mark anything unconfirmed explicitly as an **assumption**, **dependency**, or **item requiring verification**.
- Do not create additional documentation files unless the owner requests them.
- Do not describe planned commands or features as available. Mark them **Planned** until implemented.