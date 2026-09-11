# Design-it-twice round: Why now

## Problem

Section `#why_now` in `new-site/conferences/_v/final/index.html` (lines 1209–1236): eyebrow, headline, a five-stop timeline inset in a night-train photo frame, then three short paragraphs in three columns. Nelson: "good but not great." It is the third screen in a row that reads headline, block, three columns. The page now has a sticky stepper (Five reasons) and a horizontal reel (Why Japan) above it, so this screen must be a third kind of thing, and it must make the subject, time, felt.

## Copy (final, verbatim, including footnote marks; keep the page's `sup.fn` markup and targets `#fn3`, `#fn4`)

Eyebrow: **Why now**
Headline: **The path, the standard, the demand.**
Timeline stops, in order:
- **2025** · ICH E6(R3)<sup>3</sup> becomes the global clinical-data standard
- **Feb 2026** · Biotech named one of Japan's seventeen national strategic sectors
- **Jun 2026** · Annex 2<sup>4</sup> adopted: real-world data counts as evidence
- **Oct 2026** · You are in Kobe
- **Jan 2027** · Annex 2 in force in Europe; Japanese data files directly into the FDA and the EMA
Three paragraphs:
- **The strategy.** Two-thirds of the drugs approved in the US and Europe over the last decade never began development in Japan. Japan set out to change that, backed by long-term national strategy.
- **The standard.** Data generated here to ICH E6(R3) can be used directly in FDA and EMA filings. Start in Japan and the work counts everywhere.
- **The demand.** GLP-1s reached tens of millions of people in a few years. When approval lags, patients buy unregulated copies. MHLW's approach: safety first, then commercialization on the way to efficacy.

The three paragraphs map to the headline's three words (path = strategy, standard = standard, demand = demand). You may use that mapping structurally.

## Requirements

- Not a sticky section and not a horizontal reel: both already exist on the page directly above. Not headline, block, three equal columns.
- Time must be legible as a shape: a reader should see that October 2026 sits between two things that already happened and one that is about to.
- One authored motion at most, additive: the CSS default is the finished state; the motion only runs when JS adds a class and `prefers-reduced-motion` is not set. A full-page screenshot must show the finished section.
- Resting height at most 1.1 viewports at 1440×900; at 375 it may run to two screens, no horizontal overflow.
- Photos are optional. If used, the only available one that belongs here is `/img/sprint-night-train-960.webp` (and `-1920`); it may be an inset plate or a veiled backdrop, not a third full-bleed moment. Duotone or grayscale grades are fine.
- DESIGN.md: void, bone, cyan only; hairlines; Switzer 800 for headline and any large dates; IBM Plex Mono for labels at 12px or less; 0 to 3px radius; no shadows at rest. Headline at the page's heading scale, left-aligned, uppercase.
- Keyboard and touch: anything interactive is focusable and operable; nothing hover-only.
- Keep `id="why_now"`, `data-track-section="why_now"`, `data-track-position="5"`.
- The regulator tone rule from `conferences-brief.md` applies; the copy above already obeys it, do not add words.

## Deliverable per design

A standalone page at the path in your task prompt rendering ONLY this section, with the final page's `<head>`, tokens and shared `.lbl`, `.fig`, `.fn`, `.btn` rules, and 120px of void above and below. Self-contained: one `<style>`, one `<script>`. Verify at 1440×900 and 375×812 with Playwright: resting screenshot, the motion end state, no-JS and reduced-motion renders, keyboard operation if any. If the design has motion, record it with `recordVideo` at 1440×900 and convert to GIF (`ffmpeg -y -i in.webm -vf "fps=12,scale=720:-1" out.gif`).

## Report back

1. **The interface**: what the visitor sees at rest in one sentence, and how time reads as a shape.
2. **Usage**: what happens if they do nothing, and what any interaction does, including keyboard.
3. **What it hides**: anything not visible at rest, and why that is safe.
4. **Trade-offs**: what it gives up, section height, no-JS and reduced-motion states.
5. Paths (HTML, resting screenshot, GIF if any), and anything unverified.
