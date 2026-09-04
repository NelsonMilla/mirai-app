# Mirai — Tech PopUp City

Website for **Mirai**, a 4-week longevity-biotech popup city on Kobe Port Island, Japan — October 1–31, 2026.

This repository holds **two separate sites**. Only one is deployed.

| Folder | What it is | Status |
|---|---|---|
| [`new-site/`](new-site/) | Static HTML site — no framework, no build step | **Live** at https://mirai-tech-city.vercel.app (Vercel) |
| [`legacy-site/`](legacy-site/) | The previous Next.js 16 / React 19 app | **Not deployed.** Reference only |

`new-site/` is fully self-contained: every image, script and video it uses lives inside that folder, and Vercel deploys that folder alone. Nothing in it may reference `legacy-site/` or the repo root.

## Working on the live site (`new-site/`)

There is nothing to install. Serve the folder and open it:

```bash
python3 -m http.server 4321 -d new-site
```

Conventions (page structure, analytics attributes, sitemap entries) are in [new-site/README.md](new-site/README.md) and [new-site/ANALYTICS.md](new-site/ANALYTICS.md). Brand and design context: [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md).

The end-to-end analytics check for `new-site/` runs from the legacy folder's Playwright setup:

```bash
cd legacy-site && npm install && npm run smoke
```

## The legacy app (`legacy-site/`)

Kept for reference; do not add pages or routes to it. Everything about it — setup, scripts, conventions, dormant checkout/console routes — is documented in [legacy-site/README.md](legacy-site/README.md) and [legacy-site/AGENTS.md](legacy-site/AGENTS.md).

## Other folders

- `retreat/` — a "Full Program" section removed from `new-site/index.html`, stashed outside the deploy folder so it is not served.
- `.claude/`, `.impeccable/` — agent and design-review tooling config.

## Contributing

See [legacy-site/CONTRIBUTING.md](legacy-site/CONTRIBUTING.md) for the ground rules; they apply to both folders (surgical diffs, frozen copy and numbers, one concern per PR).

## License

The code in this repository is licensed under the [MIT License](LICENSE).

**Brand assets are excluded from the MIT License.** The Mirai™ name and wordmark, logos, mascot and pixel art, photography, and event copy ("Brand Assets") are proprietary — all rights reserved. They are included here so the site builds and renders, not for reuse: forks and derivative projects must replace them and may not use the Brand Assets in a way that suggests affiliation with or endorsement by Mirai. Ownership of the Brand Assets will be assigned to the Mirai nonprofit organization upon its formation, which will then administer permissions.

Partner and supporter logos shown on the site remain the property of their respective owners.
