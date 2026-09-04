# Mirai — two sites in one repo

- `new-site/` — **the live site.** Plain static HTML (no framework, no build), deployed to Vercel at https://mirai-tech-city.vercel.app. All new pages and changes go here. Conventions: `new-site/README.md`, analytics taxonomy: `new-site/ANALYTICS.md`.
- `legacy-site/` — the old Next.js app. **Not deployed.** Kept for reference and because its Playwright harness (`legacy-site/e2e/analytics.spec.ts`) drives the new-site funnel checks. Do not add routes or pages here. Its own rules live in `legacy-site/AGENTS.md`.
- `PRODUCT.md` / `DESIGN.md` — brand, positioning and visual system. Apply to `new-site/`.
- `retreat/` — a section stashed from `new-site/index.html`, kept outside the deploy folder so it is not served.

`new-site/` must stay self-contained: never reference `../legacy-site` or root files from its HTML/JS/CSS (Vercel deploys that folder alone).

Preview: `new-site` launch config (port 4321). Legacy app: `legacy-next-dev` launch config, or `cd legacy-site && npm run dev`.
