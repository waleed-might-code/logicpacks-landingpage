# Testing

This project has two test layers, both runnable locally and in CI.

## Unit & component tests (Vitest + Testing Library)

Fast, jsdom-based tests for data integrity, pure helpers, and React components.

```bash
npm test          # run once
npm run test:watch
```

Location: `tests/unit/`

- `catalog.test.js` — pure marketplace/storefront filtering helpers (`src/lib/catalog.js`).
- `data.packs.test.js` — validates the `PACKS` catalog and referential integrity of `PACK_DETAILS` / `PACK_MINI`.
- `data.products.test.js` — validates `PRODUCTS`, categories, and `PRODUCT_MINI`.
- `AccessGate.test.jsx` — the private-beta access gate (unlock flow, wrong-code handling, persisted grant).
- `BetaModal.test.jsx` — the global beta modal provider (open/close, body-scroll lock, CTA links).

## End-to-end smoke tests (Playwright)

Drives a production build served by `vite preview` on port 7110 with headless Chromium.

```bash
npm run test:e2e
```

Location: `tests/e2e/smoke.spec.js` — covers the access gate, persona chooser routing,
marketplace search/filter, and the 404 route. Playwright boots and tears down the
preview server automatically (see `playwright.config.js`).

## Everything

```bash
npm run test:all
```

CI (`.github/workflows/ci.yml`) runs build → unit tests → e2e on every push and PR.
