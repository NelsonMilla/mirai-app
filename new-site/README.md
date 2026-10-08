# Mirai Tech City — new static site (prototype → production candidate)

Live preview: https://mirai-tech-city.vercel.app
Hero-only prototype (frozen): https://mirai-live-lyart.vercel.app

Single static `index.html` — no framework, no build step. Deploys anywhere
(currently Vercel; `vercel deploy --prod` from this folder reproduces it).

- Hero: one stable conversion offer over a high-priority poster. Desktop adds a
  muted loop only after the poster renders and the browser is idle; mobile,
  reduced-motion, data-saver, and slow connections stay poster-only.
- Summit I Oct 17–18 · Summit II Oct 24–25 · Fashion Show Oct 26 (Monday).
- The landing-page agenda rail (`#agendaRail`) is rendered by `agenda.js` from a
  public Google Sheet, one row per session; the sheet's CSV export URL is set in
  `agenda-data.js`. The snapshot rows in `agenda-data.js` paint first and stay on
  the page if the fetch fails or times out. `npm run agenda:snapshot` refreshes
  the snapshot from the sheet. The agenda owner's guide (columns, making the
  sheet public) is `AGENDA.md`.
- Speakers come from the same sheet's `Speakers` tab, one row per speaker, row
  order = display order. `speakers.js` (on top of the shared CSV helper
  `sheet.js`) builds the model; the landing page, `/conferences/`,
  `/experience/`, `/startups/` and `/jp/` each render their cards, lists and
  `data-speakers-count` numbers from it, picking photo cards by the `Show on`
  column. Photos are `img/speakers/first_last.jpeg` (name lowercased, accents
  dropped, other characters → `_`); a `Photo` cell overrides the path, `none`
  shows an initials tile, and a missing file falls back to the tile. The
  snapshot rows in `speakers-data.js` paint first and stay if the fetch fails;
  `npm run speakers:snapshot` refreshes them. `speakers-photos.js` lists the portraits present
  in `img/speakers/` (regenerate with `npm run photos:manifest`; `scripts/photos-thumbs.py` makes the
  256px copies in `img/speakers/thumb/` that the /program/ wall uses); a blank Photo cell only derives
  a file that is listed, so no page requests a missing portrait. Runbook: `AGENDA.md`.
- `/program/` opens on a wall of every speaker's portrait, then renders the agenda, day by day, from the same sheet's
  `Program` tab (one row per slot, plus the Demo Day pitch rows) and the speaker
  roster from the `Speakers` tab. `program.js` builds the agenda model; speaker
  names in a slot that match a Speakers row open the talk-and-bio panel, which is
  shared with `/conferences/` through `speaker-panel.js`. The snapshot rows in
  `program-data.js` paint first and stay if the fetch fails;
  `npm run program:snapshot` refreshes them. Runbook: `AGENDA.md` (Program).
- Ticket CTAs go to Stripe Payment Links (cutover Sep 22 2026). Generic "Get
  Tickets" buttons and the nav CTA go to `/pricing/`, where each ticket has its
  own link; summit cards, the PopUp/"Everything" buttons and `/conferences/`
  link straight to the ticket. **The links on the site are LIVE** (Frontier
  Humans account, created Oct 7 2026; the Sep 22 test-mode links are retired).
  Live objects: Summit I `prod_VOgb1Pgj6XqYFL` / `price_1UNtEaRb1gm4eopX2Jg3A3T8`
  → `buy.stripe.com/dRmdRb1Kc9bn7Dx80C3Nm05`, Summit II `prod_VOgbHpJfsMu4C8` /
  `price_1UNtEbRb1gm4eopXCxxrmQZg` → `buy.stripe.com/00wcN774wbjv8HBdkW3Nm06`,
  Everything `prod_VOgbq13iwrj2Ko` / `price_1UNtEcRb1gm4eopXF6hssNBV` →
  `book.stripe.com/bJe9AVewY4V7cXR80C3Nm07` (manual capture: the card is
  authorised, Stripe's Uncaptured list is the review queue, Capture approves,
  Cancel releases; holds expire after 7 days). Promo code `MIRAI20` (20% off,
  ticket products only, 50 uses). To change a link, swap the URL everywhere
  (`grep -rn "stripe.com/" new-site --exclude-dir=_v` lists every spot). Every link redirects to
  `/stay/?session_id={CHECKOUT_SESSION_ID}&pass=<sku>`; Luma tickets are issued
  by hand from the Stripe payments list until the webhook is wired up.
- The Luma listing link in the footers (`luma.com/an4zotn9`) stays as the event
  page; the retired `/fashion-show/` still points at its own Luma event.
- `/jp/` sells the Japan-resident ticket on Peatix (https://miraitechcity2026.peatix.com/);
  that price is for residents of Japan only. The landing page links to `/jp/` from
  the nav (日本語), the hero, the summits bar, the apply fine print (with the
  English residents-only disclaimer), and the footer.
- The $2,500 Summit Weekends + Hotel package (`/summit-bundle/`, the landing-page
  card, the `/conferences/` offer, Luma ticket type `ttype-…` with coupon `SFSH`) was
  retired on Sep 18 2026. `vercel.json` 301s `/summit-bundle/` to `/pricing/`; the
  analytics spec fails if any deployed file mentions it again.
- `/stay/` is the post-purchase page: Stripe Payment Links redirect here after a
  ticket is bought (`?session_id=…&pass=<sku>`; `pass=everything` switches the
  status line to "Booking in review", since that payment is authorised, not
  charged, until approved). The page is one question, "Where will you sleep in
  October?", with four rows (Portopia, a community house, a place you book
  yourself, decide later) that open their details in place; the pick lives in
  the URL hash so a reload keeps it. Accommodation is never sold or paid here.
  Public, `noindex`, not in the sitemap. Getting-there notes and the calendar
  file sit below the question.
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
  `startups/`). `/jp/` and `/fashion-show/` keep their own headers
  (Japanese page, co-branded event page).
- Ticket issuance: `api/stripe-webhook.js` is the one Vercel function in this
  folder (`package.json` exists for its `stripe` dependency; there is still no
  build step, the HTML deploys as-is). Stripe sends `payment_intent.succeeded`
  there; the handler (`lib/webhook.js`, pure mapping in `lib/fulfil.js`) finds
  the Checkout Session, maps its price ids to Luma ticket types and calls Luma
  Add Guests, so Luma stays the attendee list and QR scanner. A Luma failure
  returns 500 and Stripe retries for three days. Payments with no Mirai price
  (the sponsor pricing table shares the account) pass through untouched. Env
  vars are listed in `.env.example`; set them in Vercel per environment (test
  keys on Preview, live on Production) and register the webhook endpoint for
  `payment_intent.succeeded` on each. Locally: `npm test` (node:test, no keys
  needed) and the `new-site-vercel` launch config (`vercel dev` on port 4330,
  the python server on 4321 cannot run functions) with `stripe listen
  --forward-to localhost:4330/api/stripe-webhook`.
- Analytics: every page loads `/posthog.js` (PostHog: autocapture, heatmaps,
  session replay, funnels) then `/analytics.js` (the shared event taxonomy,
  dispatched to both PostHog and Vercel Web Analytics). Section reach and
  checkout CTAs are marked up with `data-track-section` / `data-analytics-*`
  attributes; see `ANALYTICS.md`.
- Passed a 3-critic review panel (copy 97 · UX 96 · code/design 98, bar 95).
- Open TODOs: Telegram/Discord/sponsor URLs (buttons flash "Opening soon"),
  daruma gets his second eye Oct 1. (Hero A/B page live-candidates.html
  retired from the deploy; recover from git history if needed.)
