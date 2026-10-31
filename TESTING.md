# Testing

```bash
npm test          # Vitest + Testing Library (jsdom), tests/unit
npm run test:e2e  # Playwright, tests/e2e, builds and serves on port 7110
```

- `tests/unit/Landing.test.jsx`: the short page shape (name, one-line h1, Download for Mac and Connect your agent, then exactly three rows: Work together, Delegate with guardrails (Beta), Works with your agent, and the closing line), nav order, the 20-tool strip (CC0 mark or wordmark), the connect prompt copies and setup.md is not linked before it ships, no Request assistance / every-app / expert cards on the main page, no em dashes or "enterprise" on any page, unknown routes go home; `/new` lists Request assistance (eight sample experts once `EXPERT_PORTRAITS_READY`) then every-app, `/releases` redirects there.
- `tests/unit/Download.test.jsx`: no dead DMG link before the release is filled in, DMG link and SHA-256 once it is, Windows and iOS shown as coming soon (the only "Coming soon" on the site).
- `tests/e2e/smoke.spec.js` (`E2E_PORT=7131 npx playwright test` to avoid clashes): hero film plays with Play with sound, the three rows and the Row 1 clip, films/posters/portraits served with the right types, setup.md served when present (skipped until then), Connect your agent fills the clipboard, What's new from the nav with loaded portraits, Download for Mac, direct loads of /download and /new, no horizontal scroll at 375px.
