> **LEGACY — not deployed.** The live site is the static `../new-site/` folder (see the repo-root README). This Next.js app is kept for reference and for the Playwright harness; do not add new pages here.

# Mirai — Tech PopUp City

Landing site for **Mirai**, a 4-week longevity-biotech popup city on Kobe Port Island, Japan — October 1–31, 2026. Built with Next.js (App Router), React 19, and hand-rolled CSS.

**Live site:** the `/` landing page is the product. Apply/fashion-show pages are secondary routes; checkout/console/invite are dormant (see below).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **No environment variables are needed for landing-page work** — analytics and the dormant routes degrade gracefully without them. If you're touching those, copy `.env.example` to `.env.local` and fill in what you need.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (must pass before merging) |
| `npm run lint` | ESLint |
| `npm run smoke` | Playwright cross-viewport smoke test — first run needs `npx playwright install chromium` |

## Before you open a PR

All three must pass:

```bash
npx tsc --noEmit
npm run build
npm run smoke
```

The smoke test ([e2e/smoke.spec.ts](e2e/smoke.spec.ts)) scrolls the landing page at multiple viewports and asserts every section reveals, nothing overflows horizontally, and the console is clean. It exists because these exact bugs shipped before — please don't skip it.

## Project layout

```
src/
├── app/            # Routes. page.tsx is the landing page.
│   ├── apply/      #   Application flow
│   ├── fashion-show/
│   └── checkout|console|invite/   # DORMANT — kept intentionally, don't refactor
├── components/     # One folder per landing-page section (hero, tracks, kobe, …)
├── data/           # Content data (speakers, cards) — colors live next to data
├── styles/         # base.css (tokens/reset) + one CSS file per route
├── lib/            # constants.ts (SECTIONS list, copy), integrations
└── hooks/          # useActiveSection, scroll state
```

## Conventions (the short version)

The full rules live in [AGENTS.md](AGENTS.md) — **read it before writing code**, whether you're a human or an agent. Highlights:

- **Styles go in the route CSS files** (`src/styles/`), in page order, prefix-disciplined. No new component `<style>` blocks or styled-jsx; no bare element selectors in shared CSS.
- **Design tokens** come from `:root` in [base.css](src/styles/base.css). Don't hardcode hex values in JSX.
- **The section list lives in one place**: `SECTIONS` in [constants.ts](src/lib/constants.ts). Nav, progress rail, and scroll tracking all derive from it.
- **Copy and numbers are frozen.** Figures in `src/lib/constants.ts` and `src/data/` were audited against the event deck. Don't "fix" them without an explicit request.
- **Dormant code is intentional.** `checkout`, `console`, `invite`, and their supporting libs are kept on purpose (see [src/app/checkout/README.md](src/app/checkout/README.md)). Leave them out of cleanup passes.

Design context, if you're proposing visual or copy changes: [PRODUCT.md](../PRODUCT.md) (positioning, audience, brand personality) and [DESIGN.md](../DESIGN.md) (palette, type, elevation doctrine).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: open an issue or small PR, run the three checks, keep diffs surgical.

## License

The code in this repository is licensed under the [MIT License](../LICENSE).

**Brand assets are excluded from the MIT License.** The Mirai™ name and wordmark, logos, mascot and pixel art, photography, and event copy ("Brand Assets") are proprietary — all rights reserved. They are included here so the site builds and renders, not for reuse: forks and derivative projects must replace them and may not use the Brand Assets in a way that suggests affiliation with or endorsement by Mirai. Ownership of the Brand Assets will be assigned to the Mirai nonprofit organization upon its formation, which will then administer permissions.

Partner and supporter logos shown on the site remain the property of their respective owners.
