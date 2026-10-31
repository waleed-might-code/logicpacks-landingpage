# LogicPacks landing

Source for [logicpacks.io](https://logicpacks.io): the landing page and the `/download` page for LogicPacks, the best place for agents and humans to work together.

Vite, React and Tailwind. Black, white and greys only.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5180
npm test           # Vitest unit and component tests
npm run test:e2e   # Playwright smoke tests against a production build
```

## Where things live

- `src/site.js`: every outbound link, the release files for `/download` (DMG url, SHA-256, version) and the "Install with your agent" prompt. The ship step fills the `DOWNLOADS.mac` fields; while they are `null` the page shows the build as on the way instead of a dead link.
- `public/launch.jpg` / `launch.webp`: the hero screenshot. Drop `public/launch.mp4` in and it plays over the screenshot.
- `public/every-app.mp4`: demo footage for the coming-soon section. Until it exists the slot shows a placeholder.
- `public/shots/`: real app screenshots used in the sections.

## Deploy

logicpacks.io is served by the Cloudflare Pages project `logicpacks-landingpage` (logicpacks-landingpage.pages.dev serves the same build hashes). Build command `npm run build`, output `dist`. `public/_redirects` sends every path to `index.html` so `/download` works on a hard load.
