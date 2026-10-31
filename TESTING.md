# Testing

```bash
npm test          # Vitest + Testing Library (jsdom), tests/unit
npm run test:e2e  # Playwright, tests/e2e, builds and serves on port 7110
```

- `tests/unit/Landing.test.jsx`: positioning headline, download links, the three cards and sections (agents, request assistance, pack context, packs), unreleased work labelled Beta with no "Coming soon" on the landing page, copying the agent prompt, no em dashes in copy, old routes redirect home.
- `tests/unit/Download.test.jsx`: no dead DMG link before the release is filled in, DMG link and SHA-256 once it is, Windows and iOS shown as coming soon (the only "Coming soon" on the site).
- `tests/e2e/smoke.spec.js`: home renders with every section and no "Coming soon", Download for Mac reaches `/download`, `/download` loads directly, the agent prompt reaches the clipboard, no horizontal scroll at 375px.
