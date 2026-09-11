# /conferences synthesis brief

The blind judge scored variants A, B and C screen by screen (full report below). Build the final page at `new-site/conferences/_v/final/index.html` by taking the judge's picks, applying the orchestrator rulings, and obeying `conferences-brief.md` (still binding, including the tone rule and the technical contract).

## Per-screen picks (judge, with orchestrator rulings in bold)

1. **Hero:** B's proof rule (55 confirmed speakers · 370 organisations · 12 nights) under the pill; C's headline size; no superscripts anywhere in the hero; the date eyebrow must never wrap (one line at 1440, two clean lines at 375 with no orphan). **Hero stays the only display-size type on the page, up to 140px.**
2. **Five reasons:** B's five all-visible columns, never a cropped rail. **Ruling: each column is one hairline cell with a small photo plate at the top (4:3, from the asset list), the giant figure (6–12 · 2 · 17 · 55 · 12) and one sentence. All five visible at 1440; 2+2+1 at 768; stacked at 375. No arrows, no scroll-snap.**
3. **Statement:** A's full-bleed Kobe sunset frame carrying the claim, plus B's bordered supporter word-grid beneath it. **Ruling: retire the bitmap logo strip on this page entirely; ten wordmarks in Switzer 800 inside ruled cells, each an outbound tracked link with `rel="noopener"`.**
4. **Why Japan, speed:** A's one-frame composition (headline, paragraph, three stats over the night-road photo), **left-aligned, not centred**; B's two ledger rows (Act → 6–12 months; Conditional Early Approval → ~4 years ahead) as the support layer under the stats.
5. **Science and market:** B's numbers wall and rhythm. **Ruling: one photo is allowed as an inset plate in the split's right column if it improves the screen; otherwise pure type.**
6. **Why now:** A's timeline over the night-train image, set in C's type. Keep the three short paragraphs under one viewport at 1440. Use "backed by long-term national strategy", not "broad national support". Attribute the safety-first line: "MHLW's approach: safety first, then commercialization on the way to efficacy."
7. **Who it's for:** A's three line-art plates (the live page's inline SVGs, translucent) carrying B's "7 / 6 / 7 fields" figure, then the chips as inert facts and one routing line. **No expandable rows, no kanji chips, equal column heights (align the three paragraphs to the same baseline with a grid).**
8. **Speakers:** C, including "The other fifty" as the index label, three balanced columns, nothing overlaid on a face, all 50 rows verbatim, José accented, Online defined, blank sessions as an em dash.
9. **Kobe:** C. Inset strip with gutters and in-frame captions; two-column grid at 375.
10. **Package:** B's invoice on bone. **Ruling: the third not-for-sale line is C's wording, "Time with the agencies", and no agency is named on the same line as a price. Keep the six priced items, the three not-for-sale lines with their market anchors, the struck $48,000, the large $2,500. Primary button on bone is void fill with cyan text (C's solution).**
11. **Closing and footnotes:** C for both, with A's one-line countdown instead of a four-cell timer. Harbour photo, daruma to spec, one CTA row.

## Cross-cutting rules (judge, with rulings)

- **Type:** hero up to 140px/900; every other headline clamp(36px, 5.6vw, 88px)/800, line-height 0.94, uppercase, left-aligned, two lines maximum at 1440. One mono label style (11px, .18em) for every eyebrow, caption and stat label. Body 16 to 17px / 1.55, 62ch measure. **No centred headlines anywhere.**
- **Spacing:** 120px section top padding, 64px between headline block and content, 24px gutters, single 1200px content column. No section taller than 1.2 viewports except the package. Every section has `scroll-margin-top` equal to the fixed chrome height.
- **Imagery lane:** photographs are inset in the 1200px column, except two full-bleed moments: the hero and the statement. Nothing else full-bleed.
- **Chrome is one bar.** After the hero, exactly one fixed 56px bar exists: wordmark link home on the left, section anchors in the centre (hidden below 760px), the `$2,500 · Get the package` button on the right. **Ruling: hide the shared nav pill (`.topbar`) with a class toggled on `<html>` once the hero has scrolled past, and show the product bar in its place; reverse when scrolling back into the hero. The bar has a solid void ground at 92% so it reads on the bone section too. The shared nav script still loads for its markup and analytics.**
- **Motion is additive.** The CSS default state is the final, visible state; entrance animations are applied only when JS adds a class and `prefers-reduced-motion` is not set. A full-page screenshot, a print, or a reduced-motion visitor must see the complete page. Never animate a whole section's opacity. The Playwright full-page capture of the final page must show every screen populated.
- **Footnotes: no "source TBD" is ever printed.** A superscript exists only where the note can name a real instrument, standard or programme (the Act on the Safety of Regenerative Medicine; ICH E6(R3); ICH E6(R3) Annex 2 and its EMA effective date; AMED matching-fund programme; MHLW health-expenditure figures; PMDA Conditional Early Approval). Do not invent URLs. Internal figures (10×, 100×, +61%, $48,000 anchors) carry no superscript; list them in your report under "needs a source before launch".
- **Copy:** the tone rule in `conferences-brief.md` applies to every line. The judge's flagged phrases are fixed above.
- **Mobile at 375:** one 56px bar, never two; no headline may sit under the bar at any section boundary; Kobe strip becomes a 2-column grid; five-reasons stacks; speakers 2-up; invoice rows keep item left and price right.

## Verify (bounded)

Capture the final page with the shoot script at 1440 and a 375×812 pass. Every tile must show a populated screen (this is the additive-motion test). Check: console clean except the Vercel insights 404, no horizontal overflow, `$2,500` exactly three times, no "TBD", no "100+", no "Launch price", all Luma links with coupon + UTM + ticket type + noopener, `data-track-section` ids in order, one `h1`, headings in order, details toggle works, countdown and clock static without JS, bar swap works both directions. Fix once, capture once more, stop.

## Report back

Path; one paragraph on how the assembled page reads as one design; per-screen one line on which variant's execution you took and what you changed; the "needs a source before launch" list; anything unverified.

---

# Judge's full report (verbatim)

I captured all three variants at 1440 and 375, read every tile, and verified two suspicious cases in a second viewport-by-viewport pass before scoring.

One capture note before scores. In the standard tiled fullPage capture, variant C rendered four screens blank: statement, science/market, why-now, and the entire light package section came back black/empty. A and B rendered fully. I re-shot C viewport-by-viewport and it renders correctly to a human who scrolls, so I scored C on the honest pass. But the defect is real and should be fixed whoever wins: C's section reveals are not additive, so anything that screenshots the page (press kit, link preview, print, reduced-motion) gets empty screens.

1. Hero: A 4/3, B 5/4, C 4/4. A: claim lands; date eyebrow wraps with an orphan, murkiest photo, no proof. B: date rule, claim, pill, and a 55 / 370 / 12 proof rule; you know what, when, how much and how big without scrolling. C: largest and best-set headline; superscripts in the hero add friction. Winner B.
2. Five reasons: A 3/3, B 5/4, C 4/4. A: seductive photo cards but the fifth is cropped off with no affordance. B: five columns, five numbers, countable in a glance; image-free. C: explicit headline, arrows, still only 2.5 cards visible. Winner B.
3. Statement: A 5/3, B 4/5, C 4/3. A: full-bleed Kobe sunset under the claim, the one screen that would make someone stop; supporter strip ragged, three logos invisible, one text link among bitmaps. B: supporters as a bordered word-grid, the best craft decision in the set; no image, fourth consecutive black screen. C: same ragged strip as A without A's photo. Winner: A's frame, B's supporters.
4. Why Japan speed: A 5/4, B 3/3, C 4/4. A: headline, paragraph, three stats in one viewport over the night road; stats float on a very dark ground. B: the ledger rows are the clearest statement of the two routes; three alignments on one screen, 1.4 screens long. C: nice inset plate; more than one idea over 1.5 screens. Winner A.
5. Science and market: A 4/4, B 4/4, C 4/3. A: stats read instantly; purple microscope image looks like stock filler. B: best vertical rhythm; nothing to look at. C: tightest type; two stacked sticky bars slice the row. Winner B.
6. Why now: A 4/4, B 3/3, C 4/4. A: timeline with "You are in Kobe" at Oct 2026 is the best information device in any variant, shinkansen blur sells "now"; paragraphs push past one viewport. B: paragraphs orphan across the fold, no image. C: cleanest type, inert. Winner A, in C's type.
7. Who it's for: A 4/3, B 4/3, C 3/3. A: three line-art plates give identity; unequal chip blocks, ghost video bleeding. B: "7 / 6 / 7 fields" turns a list into an answer; decorative kanji chips as ornament, ragged bottoms. C: beautiful chips but every field expandable turns the screen into homework, columns differ by 150px. Winner: B's framing inside A's plates.
8. Speakers: A 3/2, B 4/4, C 4/4. A: bold band but headline over faces, crops on a mouth and a forehead, bad break. B: clean 5-up; right list column ends early. C: better plates, "The other fifty" is the right label; sticky bars clip the row. Winner C.
9. Kobe: A 4/2, B 4/3, C 4/4. A: best line on the page but the paragraph collides with the strip. B: no collision; captions jammed at the bottom edge. C: inset strip with gutters and in-frame captions, the only composed version; bars cover the headline's second line. Winner C.
10. Package: A 3/3, B 5/5, C 4/4. A: two card grids before the number, mottled ghost photo behind cream. B: an invoice, one idea perfectly executed, best-crafted screen in the set. C: most human headline, reuses the card pattern, price block orphaned. Winner B.
11. Closing and footnotes: A 4/2, B 3/3, C 5/4. A: dead band under CTAs, sources set over a photo, barely readable. B: flat black, daruma half hidden behind the nav. C: harbour at night, daruma, one CTA, two clean columns of sources with back links and a Kobe clock. Winner C.

Most memorable: A the sunset statement; B the invoice; C the closing harbour frame.
Longest or repetitive: A's middle third (three dark photo screens with the same pattern) and 1.7-screen package; B's six all-type screens in a row; C's two list screens back to back and 1.7-screen offer.
Light section: B unambiguously the same site (the ledger inverted). C yes. A mostly, the ghost photo makes it feel like a different template. All three: the white wordmark in the fixed header is illegible on cream.
Copy risks: "The regulators themselves, sessions with PMDA, METI, policy retainer equivalent $20,000" reads as selling access to officials; C's "Time with the agencies" is safe. B's decorative kanji badges are a costume risk on a foreign-run event page; drop them. B's "with broad national support" edges political; A's "backed by long-term national strategy" is neutral. "Japan's answer is safety first..." should be attributed to MHLW.
Honesty flags: "source TBD" printed 8 to 10 times per variant is worse than no footnotes. The $48,000 anchor is assembled from three "equivalent" figures a senior buyer cannot verify. 10× / 100× / +61% are internal analysis. "55 confirmed speakers" against 15 named on the page. The hero's "only developed country where a therapy can sell on Phase 1 safety data" needs a citation to the Act.
Mobile at 375: no horizontal overflow anywhere. The failure is shared: stacked fixed chrome (two or three bars) eats 75 to 110px and slices a headline at nearly every boundary. A breaks worst, B holds best, C has the worst chrome and the best content (Kobe 2-column grid, carousel with arrows, offer holds).
Cross-cutting rules: one type scale and one alignment (no centred headlines); one spacing rhythm and imagery picks a lane, scroll-margin-top on every section; motion additive, chrome collapses to a single 56px bar, never animate a whole section's opacity.
