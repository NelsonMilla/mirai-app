# Design-it-twice round: the Five Reasons section, with motion

## Problem

Section `#highlights` in `new-site/conferences/_v/final/index.html` (lines 695–743) is five static hairline cells: a 4:3 photo plate, a giant figure, a cyan mono label, one sentence. It is correct and flat. Nelson wants to see it with a better animation and with the reasons **highlighted one by one, the way Apple does** (the "Get the highlights" carousel with its progress pill, the sticky feature steppers where one item lights up as you scroll, the expandable card rows). This round redesigns only this section; the copy is approved and must not change.

## The five reasons (copy is final, verbatim)

Headline: **Five reasons to be in Kobe.**
1. **6–12** · Months to first revenue · "A cell or gene therapy can be sold on a self-pay basis once it has Phase 1 safety data." · photo `/img/summit-lab.webp` or `/img/pillar-lab-robot.webp`
2. **2** · Agencies, one dataset · "Data generated in Japan files straight into the FDA and the EMA." · photo `/img/summit-pathologist.jpg`
3. **17** · National strategic sectors · "Japan named biotech one of them. Learn the route from the institutions that built it." · photo `/img/pillar-portisland-aerial.webp`
4. **55** · Confirmed speakers · "Two summit weekends and a finale, all inside the cluster on Port Island." · photo `/img/summit-runway.webp` or the five portraits `/img/aubrey.webp` `/img/kennedy.webp` `/img/hayano.webp` `/img/yuki.webp` `/img/adam.webp`
5. **12** · Nights in Sannomiya · "A room from October 16 to 28, breakfast included, and the week between the weekends to work." · photo `/img/izakaya-counter.webp`

Use the photos the current section uses unless your constraint needs another from the list above. Check the current markup for the exact files.

## Requirements

- All five must be countable in the ten-second scan at 1440 (the visitor can see there are five and read all five figures without interacting). Highlighting one at a time is on top of that, never instead of it.
- Motion is scheduled, not ambient. No scroll hijacking, no autoplay that cannot be paused, no parallax. `prefers-reduced-motion` gets the complete static section. Without JS the complete static section is the CSS default (additive motion: a full-page screenshot must show all five populated).
- The section stays within about 1.2 viewports at 1440 in its resting state; a sticky design may use more scroll length but the visible frame stays one viewport.
- Keyboard: anything clickable is focusable and operable with Enter/Space and arrow keys where a sequence exists; focus visible.
- Touch: hover-only reveals need a tap equivalent. 375px must work with no horizontal overflow.
- DESIGN.md material: void ground, hairlines, Switzer 800 figures, IBM Plex Mono labels, cyan as the only accent, no rounded cards, no shadows or glows at rest. The section headline stays at the page's heading scale, left-aligned, uppercase.
- Video loops are not available for this section; photos only.
- Keep `id="highlights"`, `data-track-section="highlights"`, `data-track-position="2"`.

## Deliverable per design

A standalone page at the path in your task prompt rendering ONLY this section, using the final page's `<head>` (fonts, tokens) and 120px of void above and below. Copy the current section as your starting material. Self-contained: one `<style>`, one `<script>`. Verify with the shoot script at 1440 (`OUT=<dir> node /Users/nelson/Downloads/Mirai/mirai-app/.impeccable/benchmarks/shoot.mjs '[["r","http://localhost:4322/conferences/_v/reasons/<n>.html"]]'`) and a 375 pass, and test the interaction with Playwright clicks and keys. Also record the motion: use Playwright's `recordVideo` at 1440×900 while the section enters and the highlight sequence runs (scroll it into view, wait, interact), save the webm in your scratch dir and convert it with `ffmpeg -y -i in.webm -vf "fps=12,scale=720:-1" out.gif`. Report the GIF path.

## Report back

1. **The interface**: what the visitor sees in the first second, and what the highlight sequence is, in two sentences.
2. **Usage**: the ten-second experience step by step, including what happens if they do nothing, and what happens if they hover, tap, scroll or press keys.
3. **What it hides**: what is only visible in the highlighted state, and why that is safe.
4. **Trade-offs**: what this design gives up, including performance cost and what reduced-motion and no-JS visitors get.
5. Paths (HTML and GIF), and anything unverified.
