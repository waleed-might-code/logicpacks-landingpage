# Variants & alternate output modes

Two experiments live in the codebase for comparing presentations without
forking pages. Both are additive — the defaults are untouched.

---

## 1. Web — A/B hero test (`?variant=b`)

The marketplace landing hero (the default view at `/`) has an alternate
version selectable via a query param.

| | Variant A (default) | Variant B (`?variant=b`) |
|---|---|---|
| Headline | "Add any feature. One click." | "Ship the feature. Skip the build." |
| Framing | Capability / simplicity | Outcome / cost-of-rebuild |
| Layout | Left-aligned copy block | Centered, search-first |
| Hero element | — | Faux search box + suggestion chips |
| Primary CTA | "Browse Marketplace" (white) | "Start free — install a pack" (green) |
| Secondary CTA | "How It Works" | "Talk to us" |

**Try it**

```
/?view=marketplace            # variant A (default)
/?view=marketplace&variant=b  # variant B
```

Any other `variant` value (or none) falls through to A.

**How it's wired**

- `src/components/HeroVariantB.jsx` — the entire B hero, self-contained.
  It renders its own centered `HeroScene` and its own GSAP reveal timeline
  (`.hb-reveal`) so it never collides with A's `.mp-hero-reveal` selectors.
- `src/pages/HomeMarketplace.jsx` — reads `searchParams.get('variant')` and
  swaps the hero block. This is the only edit to a shared file (a few lines);
  everything below the hero is shared between both variants.

To measure, tag your analytics event with the `variant` param and split by it.

---

## 2. CLI/TUI — output modes + second terminal theme

The CLI page (`/cli`) has an interactive **Output Modes** section showing the
same `lpc list` data rendered three ways, plus a light/dark terminal theme.

**Modes** (mirrors real CLI flags):

- `verbose` — rich, aligned, human-readable (default)
- `plain` (`--plain`) — compact, tab-separated, greppable
- `json` (`--json`) — machine-readable, pretty-printed for pipelines/CI

**Theme toggle** — switches the terminal between the default dark palette and
a light (GitHub-style) palette.

**How it's wired**

- `src/components/CommandOutputModes.jsx` — new, self-contained section.
  One `useState` for the mode, one for the theme; the pack data is defined
  locally.
- `src/components/Terminal.jsx` — gained an optional `theme` prop
  (`'dark'` default | `'light'`). Fully backward compatible: every existing
  caller omits it and keeps the dark look.
- `src/index.css` —
  - `.terminal--light …` a second selectable terminal palette.
  - `.term-pre .terminal-body code { white-space: pre-wrap }` so the JSON/plain
    output keeps its formatting (scoped to this demo via the `term-pre` class;
    the default terminals are unaffected).
- `src/pages/CLI.jsx` — one import + one `<CommandOutputModes />` mount between
  the Quickstart and Commands sections.

**Try it**: open `/cli`, scroll to "Built for humans and pipelines", and toggle
`verbose / plain / json` and the theme button.
