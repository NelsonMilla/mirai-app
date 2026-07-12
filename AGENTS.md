<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend conventions

These exist because parallel agent waves produced style drift and real
viewport bugs. Follow them exactly; don't introduce a fifth idiom.

## Where styles live

- `src/styles/base.css` — design tokens, reset, typography, nav, buttons,
  reveal system, shared keyframes. Loaded globally via `layout.tsx`.
- `src/styles/landing.css` — everything on the `/` landing page, in page
  order. Loaded globally (rule order inside this file is load-bearing).
- `src/styles/apply-page.css`, `src/styles/fashion-show.css`,
  `src/styles/dormant.css` — per-route styles, prefix-disciplined
  (`apply-page`/`form-*`, `fs-*`, `console-*`/`invite-*`/`wl-*`).
- New styles for an existing section go in that section's file, in place.
  Do NOT append to the end of a file "to be safe".

## Styling rules

- Prefer the route CSS files above. Component-embedded `<style>` blocks
  (KobeSection, HeroSection, RosterSection) and styled-jsx (RunwaySection,
  ProgressRail) are legacy — don't add new ones; fold them into the route
  CSS when you touch those components.
- CASCADE TRAP: component `<style>` blocks render in `<body>` and beat the
  head stylesheets at equal specificity. A rule in a CSS file that
  contradicts a component block is silently inert. Check both places.
- Never use bare element selectors (`nav`, `section`, `img`) in shared CSS
  — a bare `nav` rule once restyled the ProgressRail and console sidebar.
- Tailwind is installed for its preflight reset and `@theme` token bridge
  only. Trivial layout utilities (`w-full`, `h-full`) are fine; do not
  build new components out of utility classes.
- Colors/typography come from the `:root` tokens in `base.css`. Don't
  hardcode hex values in JSX; put per-item colors next to the data in
  `src/data/`.

## Page structure

- The landing page's section list lives in ONE place: `SECTIONS` in
  `src/lib/constants.ts`. Navbar, ProgressRail, and scroll tracking all
  derive from it. Never hardcode a parallel list of section ids/labels.
- Sections reveal via the `RevealSection` wrapper
  (`src/components/ui/RevealSection.tsx`). Don't hand-roll
  `useIntersection` + reveal classes in new sections.
- Active-section tracking uses the shared `useActiveSection` hook. Don't
  create new IntersectionObservers for nav highlighting.

## Frozen data

- Copy and numbers in `src/lib/constants.ts` and `src/data/*` were audited
  against the event deck (300 residents, Oct 26, $88B, transit times,
  etc.). Do not "fix" or improve them without an explicit request.
- `src/app/checkout|invite|console`, the whitelist API routes, and
  `src/lib/stripe|whitelist|inviteCodes|tokens` are DORMANT but
  intentionally kept (see `src/app/checkout/README.md`). Don't delete or
  refactor them in cleanup passes.

## Before you finish

Run all three; all must pass:

```
npx tsc --noEmit
npm run build
npm run smoke   # Playwright cross-viewport smoke test (see e2e/smoke.spec.ts)
```

The smoke test scrolls the landing page at multiple viewports and asserts
every section reveals, nothing overflows horizontally, and the console is
clean. It exists because these exact bugs shipped before.
