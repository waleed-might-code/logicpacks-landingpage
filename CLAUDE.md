# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Architecture

**Stack:** React 18 + Vite, Tailwind CSS v3, GSAP (animations), Three.js (3D hero), React Router v6, `@iconify/react` (Solar icon set throughout).

### App Shell

`main.jsx` → `BrowserRouter` → `App.jsx`

`App.jsx` wraps every route in two providers:
- `<AccessGate>` — private beta gate. Blocks the entire site with a full-screen code entry screen. The access code is `buildanything` (hardcoded in `AccessGate.jsx`). Access is stored in `sessionStorage` under `lp_access_granted`.
- `<BetaProvider>` (from `BetaModal.jsx`) — global context that exposes `openBeta()` / `openBetaModal()`. Any component can call `useBeta()` to trigger the beta signup modal.

All routes are children of `<Layout>` which renders `<Header>` + `<Outlet>` + `<Footer>` and handles scroll-to-top on route changes and anchor-link scrolling.

### Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomeRouter` | Persona chooser or specific home view |
| `/store` | `Store` | Packs marketplace |
| `/pack/:slug` | `PackDetail` | Detail for a pack from `src/data/packs.js` |
| `/shop` | `Shop` | Physical products |
| `/product/:slug` | `ProductDetail` | Detail for a product from `src/data/products.js` |
| `/cli` | `CLI` | CLI product page |
| `/ventures`, `/founders`, `/investors`, `/ambassadors`, `/courses` | Various | Audience-specific pages |
| `/beta` | `BetaAccess` | Beta application page |
| `/ambassador-apply` | `AmbassadorApply` | Ambassador application |

### HomeRouter & Persona System

`/` renders `HomeRouter`, which reads the `?view=` query param:
- No param → `HomeChooser` (persona selector UI)
- `?view=developer` → `Home`
- `?view=founder` → `HomeFounder`
- `?view=marketplace` → `HomeMarketplace`
- `?view=pakistan` → `HomePakistan` (hidden from chooser)

### Data Layer

All data is static JS modules — no API calls:
- `src/data/packs.js` — exports `PACKS`, `TYPE_LABELS`, `TYPE_COLORS`
- `src/data/products.js` — exports `PRODUCTS`, `PRODUCT_MINI`, `PRODUCT_CATEGORIES`
- `src/data/packDetails.js` — extended pack detail data keyed by slug

### Key Components

- **`HeroScene.jsx`** — Full Three.js scene (icosahedron sphere + wireframe + 5000-particle explosion system). Accepts `centered` prop. The sphere explodes on scroll or click and reassembles on re-click. Uses GSAP for animation orchestration alongside the Three.js render loop.
- **`ScrollReveal.jsx`** — Lightweight IntersectionObserver wrapper. Fades + slides up children when they enter the viewport.
- **`Terminal.jsx`** — Styled terminal UI component for CLI display.

### Design Conventions

- **Background:** `#0a0a0a` everywhere (set in `index.css` body and as Tailwind `bg-[#0a0a0a]`)
- **Primary accent:** green-500 / `#22c55e`
- **Icons:** Always use `<Icon icon="solar:*-linear" />` from `@iconify/react` — the Solar icon set is used exclusively
- **Animations:** `index.css` defines shared keyframes (`fadeInUp`, `marquee`, `glitch`, `wireframe-loop`, typing lines, cube, bar). For complex sequenced animations use GSAP directly.
- **Scroll reveal:** Use `<ScrollReveal>` wrapper for section entrance animations, or GSAP's `gsap.context()` with `containerRef` for page-level sequences.
- **CSS utility classes:** `.pack-card`, `.filter-btn`, `.active-filter`, `.terminal`, `.t-prompt` / `.t-cmd` / `.t-flag` etc. are defined in `index.css` and used across pack/product pages.
