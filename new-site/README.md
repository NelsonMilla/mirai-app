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
- `/jp/` sells the Japan-resident ticket on Peatix (https://miraitechcity2026.peatix.com/);
  that price is for residents of Japan only. The landing page links to `/jp/` from
  the nav (日本語), the hero, the summits bar, the apply fine print (with the
  English residents-only disclaimer), and the footer.
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
- `/experience/` is the attendee-facing "what a month here is like" page
  (daily rhythm, week-by-week arc, joinable programs, people, apply path),
  built from the Mirai Tech Source of Truth spreadsheet. Self-contained
  `experience/index.html`, no build step. `experience/experience.js` is the
  retired field-guide content registry — kept on disk, no longer loaded
  (the old field-guide page lives in git history).
- `/citizens/` is the venue map for accepted citizens: a full-viewport Leaflet 1.9.4
  map (unpkg, SRI-pinned) drawing OpenFreeMap vector tiles through MapLibre GL 5 +
  maplibre-gl-leaflet with an inline dark style (only city/island names and train
  stations are labelled, in English; OSM raster tiles are the no-WebGL fallback) with a HUD: the
  five venues (MIC, Integrated Research Center, Portopia Hotel, the cowork space, Orbis
  Hall) with dates, addresses, and Google Maps links, a Dates drawer, and a "you" panel
  (name kept in localStorage, live daruma pin via browser geolocation, no server). Zoom
  and panning are locked to the Kobe–Kyoto area. Standalone page sent to ticket holders:
  no shared nav, `noindex`, not in the sitemap. `/citizens/quests/` is the quest
  screen: three stamp-rally sheets (one on screen at a time, tabs + swipe) rendered
  from `citizens/data/quests.json`; progress in localStorage `mtc_quests`; code-word
  quests store only SHA-256 hashes of the uppercase word. `/citizens/links/` is the
  links screen: physical-object cards (ticket stubs, IC cards, envelopes, a red
  emergency card) rendered from `citizens/data/links.json`; groups collapse
  (`mtc_links_closed`), any link can be pinned into "My links" (`mtc_pins`); phone
  numbers are shown, never dialled. Every citizens screen loads the shared header
  `/citizens/nav.css` + `/citizens/nav.js` (`<script src="/citizens/nav.js" data-screen="…"
  data-title="…">` at the top of `<body>`): a title row and five fixed tab buttons (Map,
  Quests, Links, Today, Directory; the last two "Soon"), keys 1–5 jump and [ ] cycle; a cyan
  iris grows out of the pressed tab and shrinks back into it on the next screen (≤240ms each way); it
  hides while `#big`/`#dates` are open and offsets the map HUD via `--mtc-nav-h`.
  `citizens/_v/`, `citizens/quests/_v/`, `citizens/links/_v/` and `citizens/_nav/` hold
  the design-round variants — delete before deploying.
- Fonts: Switzer (Fontshare) + IBM Plex Mono. Speaker photos + Kobe stills
  copied into `img/` from `legacy-site/public/images` (comic-style avatars intentionally not used).
- Nav: the top bar on the site pages (`/`, `/experience/`, `/conferences/`, `/pricing/`,
  `/startups/`, plus a 日本語 link to `/jp/`) is one shared component — `/nav.js` inserts the markup where the
  `<script src="/nav.js">` tag sits at the top of `<body>`, `/nav.css` styles it. Edit
  the links in `nav.js` once and every page follows. A page may swap the CTA with
  `data-cta-label` / `data-cta-href` / `data-cta-target` on the script tag (see
  `startups/`). `/summit-bundle/`, `/jp/` and `/fashion-show/` keep their own headers
  (offer page with Luma embed checkout, Japanese page, co-branded event page).
- Analytics: every page loads `/posthog.js` (PostHog: autocapture, heatmaps,
  session replay, funnels) then `/analytics.js` (the shared event taxonomy,
  dispatched to both PostHog and Vercel Web Analytics). Section reach and
  checkout CTAs are marked up with `data-track-section` / `data-analytics-*`
  attributes; see `ANALYTICS.md`.
- Passed a 3-critic review panel (copy 97 · UX 96 · code/design 98, bar 95).
- Open TODOs: Telegram/Discord/sponsor URLs (buttons flash "Opening soon"),
  daruma gets his second eye Oct 1. (Hero A/B page live-candidates.html
  retired from the deploy; recover from git history if needed.)
