# /conferences rework — shared brief for creator agents

Read this whole file first. Then read, in order:
1. `new-site/conferences/_v/wireframe.html` — the LOCKED structure and approved copy (v2, 2026-09-10).
2. `.impeccable/benchmarks/conferences-inventory.md` — the information budget the page must keep, and the live-page bugs to not repeat.
3. `.impeccable/benchmarks/apple-product-pages.md` — the design philosophy we are borrowing, and the "translate, don't copy" rules.
4. `DESIGN.md` and `PRODUCT.md` at the repo root — the visual system and product truth. DESIGN.md wins every conflict except the two overrides below.
5. `new-site/ANALYTICS.md` — event taxonomy. `new-site/conferences/index.html` — the live page, for the head block, the speaker manifest rows (lines 587–651), the partner logo markup, and the inline SVG art.
6. `/Users/nelson/.claude/skills/impeccable/reference/craft-floor.md` — the quality floor. Read it immediately before you start writing UI.

## Why this page exists

A friend with strong connections is sending this URL to VIPs: investors, senior operators, officials. It has to look like the most credible longevity event page they have seen this year in the first ten seconds, on a phone or a laptop, without them scrolling. The audience is biotech founders pre-trial or post Phase 1b, deciding whether to buy the $2,500 package. Everything funnels to Luma.

## Decisions already made (do not reopen)

- Price is **$2,500, final**. No "launch price", no "$4,000 after", no escalation line anywhere.
- Primary CTA: **Get the package** → `https://luma.com/an4zotn9?coupon=SFSH&utm_source=conferences-<location>&utm_campaign=summit-hotel-package` with `data-luma-ticket-type="ttype-0BjQv0xV4yY5P0l"`, `data-analytics-action="checkout"`, `data-analytics-location="<location>"`, `target="_blank" rel="noopener"`. Locations: `hero`, `sticky`, `offer`, `closing`.
- Secondary CTA: **Email us** → `mailto:team@miraitech.city?subject=Mirai%20Summits%20package`, `data-analytics-action="alternative_offer"`, `data-analytics-target="email"`. No Telegram, no Calendly on this page.
- Speaker count is **55 confirmed** everywhere. "100+" and "20+ supporting organisations" are gone. Partners are the ten named logos.
- The price appears exactly three times: hero pill, sticky bar button, package block. No CTA pairs between sections.
- The hero eyebrow is the dates line: `Summit I 17–18 Oct · Summit II 24–25 Oct · Finale 26 Oct`. Dates do not repeat under the pill.
- **Override 1:** the package section (screen 09) flips to a light ground (bone `#f4f3f0`, ink `#0a0a0c`). This is an approved experiment against DESIGN.md's "no light mode". Make it feel like the same site under different light, not a different site.
- **Override 2:** the hero is the only display-size type on the page (up to 140px). Every other headline is at heading scale (up to 96px), weight 800. Nothing else may compete with the hero.
- No decorative labels that carry no information (no "In one screen", no "02 · Section" tags). Eyebrows name the topic only when the topic is not obvious from the headline.
- Copy: use the wireframe's copy as the baseline. You may tighten it. You may not add claims, numbers, or names that are not in the inventory. Plain, literal titles; headlines seven words or fewer, ending with a full stop.

## Regulator tone rule (non-negotiable, applies to every sentence)

1. Japan is the actor. Japan built the path, set the standard, opened the zones. Founders arrive to use it, never to improve it.
2. Never write that anyone shapes, proposes, drafts, influences or reforms Japanese regulation. Write that they learn it, are guided through it, or are invited into it.
3. Treat PMDA, METI and MHLW as excellent and forward-looking. Their speed is deliberate design, not a loophole, gap or shortcut.
4. Skip party politics, election results and seat counts. If continuity matters, say "long-term national strategy" or "broad national support".
5. Before finishing, read the page as a PMDA official would. If any line implies foreigners teaching Japan, or Japan needing fixing, rewrite it.

## The locked structure (from the wireframe)

01 Hero → sticky bar → 02 Five reasons (horizontal strip) → 03 Statement + partner ticker → 04a Why Japan: speed (centered photo grammar, 3 stats) → 04b Why Japan: science + market (split headline + numbers wall) → 05 Why now (timeline + three short paragraphs) → 06 Who it's for (three areas as chips) → 07 Speakers (5 portraits + index + Show all 55) → 08 Kobe (headline + 5-photo strip) → 09 Package, light (6 deliverable cards, 3 "not for sale anywhere" cards, struck $48,000 beside $2,500, CTA + email) → 10 Closing (daruma, countdown to Oct 17, JST clock) → 11 Footnotes + footer.

Your radical constraint (in your task prompt) changes HOW each screen is executed. It does not change the order, the information, or the copy rules.

## Assets on disk (all under `new-site/`, reference with absolute paths like `/img/...`)

Photos: `img/harbor-golden-hour.webp` (hero, 1024w) · `img/kobe-venus-bridge-twilight.webp` · `img/kobe-rokko-island-night.webp` · `img/pillar-portisland-aerial.webp` · `img/pillar-portliner.webp` · `img/pillar-lab-robot.webp` · `img/pillar-exoskeleton-hal.webp` · `img/pillar-harborland-wheel.webp` · `img/pillar-nankinmachi-night.webp` · `img/summit-lab.webp` · `img/summit-pathologist.jpg` · `img/summit-runway.webp` · `img/summit-runway-exoskeleton.webp` · `img/why-fasttrack-900.webp` · `img/why-strategy-900.webp` · `img/why-strategy2-900.webp` · `img/why-pitch-900.webp` · `img/future-city-1440.webp` (+960, +1792) · `img/izakaya-counter.webp` (+640) · `img/lanterns.webp` (+640) · `img/port-tower-night.webp` (+640) · `img/rokko-night.webp` (+640) · `img/arima-steam.jpg` · `img/prog-onsen-steam.webp` · `img/prog-lunch-teishoku.webp` · `img/prog-market.webp` · `img/sprint-night-train-1920.webp` (+960) · `img/early-bird-portliner-851.webp` · `img/early-bird-bridge-821.webp` · `img/early-bird-month-1280.webp`.
Speakers: `img/aubrey.webp`, `img/kennedy.webp`, `img/hayano.webp`, `img/yuki.webp`, `img/adam.webp`, `img/jose.webp`.
Video loops (each has `_poster.jpg`): `kobe_harbor_night.mp4`, `live_city.mp4`, `healthspan.mp4`, `disease.mp4`, `augment.mp4`. Use at most two. Poster first, `muted playsinline loop preload="none"`, attach the source only on desktop after load and idle, pause off-screen, never under reduced motion or data saver.
Partners: `img/partners/kbic.svg`, `kobe-university-90.webp`, `mic-kobe-university-90.webp`, `hekabio.avif`, `asagi-labs.jpg`, `broken-symmetry.jpg`, `vitalist-bay.png`, `augmentation-lab.png`, `biopunk.png`. LEV Foundation has no logo file; set it as a wordmark that matches the others in weight.
Mascot: `img/daruma.png` (122×128).
Inline SVG art for the three areas: copy from the live page (lines 435–561).

## Technical contract

- Output: ONE self-contained file at the path in your task prompt. All CSS in one `<style>` block in page order, all JS in one `<script>` block at the end. No frameworks, no build, no external CSS/JS except the shared files below and the fonts.
- Keep the live page's `<head>` (meta, og, canonical, favicon, fonts with the print-swap pattern, metric-matched fallback font, preload of the hero image). Update `<title>` to include the finale: `Mirai Tech City Summits · 17–18 & 24–25 October, Finale 26 October 2026 · Kobe`.
- Include `/nav.css` in head and the nav script as the first child of body, with the CTA override so the shared nav sells the package instead of generic tickets: `<script src="/nav.js" data-cta-label="Get the package" data-cta-href="https://luma.com/an4zotn9?coupon=SFSH&utm_source=conferences-nav&utm_campaign=summit-hotel-package" data-cta-target="package"></script>`. Include `/posthog.js` and `/analytics.js` deferred. Keep `data-analytics-offer="summit_hotel_2500"` on body.
- Every top-level section carries `data-track-section="<id>"` in page order: hero, highlights, statement, why_japan, why_japan_market, why_now, who_for, speakers, kobe, offer, closing.
- Fonts: Switzer 400/700/800/900 and IBM Plex Mono 400/500, same links as the live page. Display type never below weight 800, line-height under 1. Mono labels never above 12px.
- Colour budget: void, bone, cyan, the three alpha steps, plus the light-section pair. No other hue.
- Speaker manifest: all 50 rows from the live page, verbatim names and affiliations. Fix "Jose" → "José". Define "Online" in the legend. The three rows with no session stay blank but must not render as broken cells. Keep the native `<details>` pattern or something equally keyboard-accessible; add `data-track-faq="speakers"` on it so analytics picks up the open.
- Footnotes: superscripts on every hard number (10×, 100×, +61%, $146B, 3.7%, +32%, 2:1, 70–90%, four years ahead, 2026 iPS, Feb 2026 sectors, E6(R3), Annex 2). Footnote text can say "source TBD" where the inventory has none; do not invent sources.
- Countdown targets 2026-10-17T09:00:00+09:00; JST clock live. Both degrade to static text without JS.
- `prefers-reduced-motion`: no reveals, no loops, no wobble. `<noscript>`: everything visible.
- Responsive: 375, 768, 1024, 1440. No horizontal overflow at any width. Touch targets ≥ 44px. The sticky bar collapses to price + button on phones.
- Accessibility: alt text on every meaningful image (`alt=""` on decorative), one `h1`, headings in order, focus visible, colour contrast ≥ 4.5:1 for body text on both grounds.
- Performance: no image above 250 KB, `loading="lazy"` below the fold, `decoding="async"`, width/height on every `<img>`.

## Verify before you report (bounded: one full round, one fix round, stop)

1. Serve: a static server is already on `http://localhost:4322/` rooted at `new-site/`. If it is down, start one: `python3 -m http.server 4322 --directory /Users/nelson/Downloads/Mirai/mirai-app/new-site &`.
2. Capture: `OUT=<your scratch dir> node /Users/nelson/Downloads/Mirai/mirai-app/.impeccable/benchmarks/shoot.mjs '[["v","http://localhost:4322/conferences/_v/<x>/"]]'` gives you 720px-wide tiles and a per-section metrics JSON. Read every tile. For mobile, run a second Playwright pass at 375×812 (copy the script and change the viewport and deviceScaleFactor to 1).
3. Check the browser console is clean, no 404s, no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), the sticky bar works, the details toggle works, links carry the right attributes.
4. Fix everything the round showed, capture once more, stop polishing.

## Report back (this is all the orchestrator will read)

- The file path.
- One paragraph: the concept and the single most memorable moment.
- Section-by-section: one line each on what you did differently from the wireframe and why.
- Known gaps or anything you could not verify.
- Do not paste code or screenshots into the report.
