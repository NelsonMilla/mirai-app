# Design-it-twice round: Why Japan as one header and one horizontal reel

## Problem

In `new-site/conferences/_v/final/index.html`, Why Japan is two sections (`#why_japan` lines 966–999, `#why_japan_market` lines 1000–1027), followed by Why now and Who it's for, all built as headline, block, three columns. Nelson: "the first sections feel unique and joyful but then you get into that repetitive structure, it drags." He wants the two Why Japan sections merged into ONE section: a fixed header, then a horizontally scrollable reel of cards the way Apple's iPhone page does it, with mixed card widths (the most important cards about 50vw, the lesser ones about 33vw and stacked toward the end), leading with visuals. He also thinks the Nobel science content is the strongest on the page and wants something wonderful made of it.

## The header (copy is final, verbatim, including the footnote marks)

Eyebrow: **Why Japan**
Headline: **A year to market, not a decade.**
Paragraph: "Under the Act on the Safety of Regenerative Medicine<sup>1</sup>, a cell or gene therapy can be sold on a self-pay basis once it has Phase 1 safety data, in six to twelve months. For small molecules, biologics and devices, Conditional Early Approval<sup>2</sup> does the same nationally, around four years ahead of the FDA. Japan designed both routes deliberately, and founders arrive to learn them."
Keep the page's existing footnote markup (`<sup class="fn"><a href="#fn1" id="fnref1">1</a></sup>` etc.) and the bold-phrase pattern the paragraph uses today.

## The card content (all of it must appear; wording verbatim where quoted; you choose order, grouping and widths, but the two Nobel/iPS cards are the most important and get the wide format)

From the science section:
- "**Nobel-winning researchers** at Kyoto and Osaka, RIKEN's labs, purpose-built clinical clusters."
- "Japan invented iPS cells, and the **first therapies reached market here in 2026**."
- "Every patient is followed for life in **one national database**, to a standard **the FDA and EMA accept**."
From the numbers wall (keep the footnote marks 5, 6, 7 on the three figures as today):
- **$146B** · Health market, per year · "¥23.8 trillion. 3.7% of GDP, the third-largest pharmaceutical market and R&D spender on earth. Biotech R&D up 32% last year."
- **2:1** · AMED grants match registered VC · "Non-dilutive. Raise a round and the state matches it twice over."
- **70–90%** · National insurance covers · "Of what a patient pays, with a monthly cap. Demand does not wait on reimbursement fights."
From the speed section's stats:
- **10×** · To first revenue · faster
- **100×** · Than the Phase 3 route · cheaper
- **+61%** · From the same patent · commercial value
The two route rows (the Act → 6–12 months; Conditional Early Approval → ~4 years ahead of the FDA) are already carried by the header paragraph and do not need their own card unless your design wants them.

## Requirements

- One section replacing both. Use `id="why_japan"`, `data-track-section="why_japan"`, `data-track-position="4"`. (The orchestrator will renumber the later sections' positions.)
- The reel is native horizontal scrolling: an `overflow-x: auto` track with `scroll-snap-type: x mandatory` (or proximity) and `scroll-snap-align: start` on cards, so trackpad, touch and shift-wheel all work with no JavaScript. Add prev/next controls and a progress indicator for mouse users, keyboard support (Left/Right, Home/End on the track or controls), and hide the native scrollbar only if a visible progress indicator replaces it. No scroll hijacking: vertical wheel never gets converted to horizontal.
- The track starts at the page column's left edge and bleeds off the right edge of the viewport (Apple's alignment), so the visitor sees a partial next card as the cue to scroll. Card widths mixed: about 50vw for the two most important, about 33vw for the rest, capped so they never exceed 720px and 480px on very wide screens. At 375 every card is about 84vw.
- Visuals lead: each card is mostly image, with its text on the lower third over a veil or below the image on void; number cards may be typographic (the number is the visual) but should still carry an image or a strong typographic object. Establish ONE visual language across the stock photos so they read as one set, for example a consistent crop ratio, a consistent desaturation and cool grade, a consistent veil, a consistent caption position. Available photos, all under `new-site/img/`: `summit-lab.webp`, `pillar-lab-robot.webp`, `summit-pathologist.jpg`, `why-fasttrack-900.webp`, `why-strategy-900.webp`, `why-strategy2-900.webp`, `pillar-portisland-aerial.webp`, `pillar-portliner.webp`, `pillar-exoskeleton-hal.webp`, `summit-runway.webp`, `summit-runway-exoskeleton.webp`, `kobe-venus-bridge-twilight.webp`, `kobe-rokko-island-night.webp`, `future-city-1440.webp`, `sprint-night-train-1920.webp`, `kansai-kyoto-autumn-1280.webp`, `kansai-osaka-night-1280.webp`, `kansai-nara-autumn-1280.webp`, `early-bird-bridge-821.webp`, `early-bird-month-1280.webp`, `arima-steam.jpg`. Nelson will supply better photos later, so make the treatment robust to swaps. Do not use the speaker portraits here.
- DESIGN.md material: void, bone, cyan only; hairlines; Switzer 800 for figures and card titles; IBM Plex Mono labels at 12px or less; 3px radius at most on cards (0 preferred); no shadows at rest. Section headline at the page's heading scale, left-aligned, uppercase. The section's resting height, header plus reel, must fit about 1.15 viewports at 1440×900.
- Motion: cards may have a single entrance (stagger on first view) and a hover state; the reel's own movement is the visitor's scroll. Reduced motion: no entrance. No-JS: the reel scrolls natively and all content is visible; controls are hidden without JS.
- Copy: nothing beyond the content above, and the regulator tone rule from `conferences-brief.md` applies to every word.

## Deliverable per design

A standalone page at the path in your task prompt rendering ONLY this merged section, with the final page's `<head>`, tokens and shared `.btn`/`.lbl`/`.fig`/`.fn` rules copied in, and 120px of void above and below. Self-contained: one `<style>`, one `<script>`. Verify at 1440×900 and 375×812 with Playwright: screenshot the resting section, scroll the reel to the end with `scrollLeft` in steps and screenshot mid-reel and end, test the controls and keys, confirm no vertical-to-horizontal capture, confirm no horizontal overflow of the page itself (only the track scrolls). Record the reel being scrolled with Playwright `recordVideo` at 1440×900 and convert to GIF (`ffmpeg -y -i in.webm -vf "fps=12,scale=720:-1" out.gif`).

## Report back

1. **The interface**: what the visitor sees at rest in one sentence, and the card order with widths.
2. **Usage**: the scroll experience on trackpad, mouse, touch and keyboard.
3. **The visual language**: what treatment unifies the photos and how a swapped photo inherits it.
4. **Trade-offs**: what it gives up, section height, what no-JS and reduced motion get.
5. Paths (HTML, resting screenshot, mid-reel screenshot, GIF), and anything unverified.
