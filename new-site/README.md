# Mirai Tech City — new static site (prototype → production candidate)

Live preview: https://mirai-tech-city.vercel.app
Hero-only prototype (frozen): https://mirai-live-lyart.vercel.app

Single static `index.html` — no framework, no build step. Deploys anywhere
(currently Vercel; `vercel deploy --prod` from this folder reproduces it).

- Hero: one stable conversion offer over a high-priority poster. Desktop adds a
  muted loop only after the poster renders and the browser is idle; mobile,
  reduced-motion, data-saver, and slow connections stay poster-only.
- Summit I Oct 17–18 · Summit II Oct 24–25 · Fashion Show Oct 26 (Monday).
- All ticket/residency CTAs → https://luma.com/an4zotn9
- `/summit-bundle/` is the dedicated $2,500 Summit Weekends + Hotel offer page,
  increasing to $4,000 after August 20.
- The public landing-page placement is controlled by
  `window.MIRAI_FLAGS.showSummitPackage` near the top of `index.html`. It is
  intentionally `false` until the hotel agreement is confirmed; the dedicated
  `/summit-bundle/` route remains available for internal review.
  The landing page carries a compact version after the dates section. Both use
  a full-size Luma checkout in a new tab with the hotel ticket preselected
  (`ttype-0BjQv0xV4yY5P0l`) and access coupon `SFSH`. The site moves to standard
  pricing after Aug 20 JST.
- `/experience/` is the attendee-facing Kobe + Kansai field guide. Like the
  summit bundle, it is deployment-ready static code: `experience/index.html`
  owns the presentation and filtering, while `experience/experience.js` is the
  canonical content registry. No build step is required after guide edits.
- Fonts: Switzer (Fontshare) + IBM Plex Mono. Speaker photos + Kobe stills
  from this repo's `public/images` (comic-style avatars intentionally not used).
- Analytics: every page loads `/posthog.js` (PostHog: autocapture, heatmaps,
  session replay, funnels) then `/analytics.js` (the shared event taxonomy,
  dispatched to both PostHog and Vercel Web Analytics). Section reach and
  checkout CTAs are marked up with `data-track-section` / `data-analytics-*`
  attributes; see `ANALYTICS.md`.
- Passed a 3-critic review panel (copy 97 · UX 96 · code/design 98, bar 95).
- Open TODOs: Telegram/Discord/sponsor URLs (buttons flash "Opening soon"),
  daruma gets his second eye Oct 1. (Hero A/B page live-candidates.html
  retired from the deploy; recover from git history if needed.)
