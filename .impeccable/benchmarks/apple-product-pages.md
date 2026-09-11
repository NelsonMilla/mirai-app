# Benchmark: how Apple product pages persuade

Captured 2026-09-10 at 1440px from apple.com/iphone-18-pro, apple.com/iphone, apple.com/macbook-pro.
Screenshots and per-section metrics live in the session scratchpad (`bench/*.png`, `bench/*.json`).
Purpose: a reference for the `/conferences` rework. Apply through DESIGN.md, never over it.

## Measured shape

| | iPhone 18 Pro page | Mirai /conferences today |
|---|---|---|
| Page length | 36 viewport-heights | 10.7 viewport-heights |
| Top-level sections | 20 | 6 |
| Media per section | 7 to 98 (every section) | 0 in 4 of 6 sections |
| Words per section | 45 to 450, but one paragraph + captions | 250 to 480, all as 4-up text cards |
| Ideas per viewport | one | four to six |
| Price mentions | 3 (hero pill, compare card, footnotes) | 9 (5 CTA repeats + ledger + total + big number) |
| Headline style | 48 to 56px, weight 600, sentence case, two lines | 75px, weight 800, uppercase, one to three lines |

The lesson is not "make it longer". It is "one idea per viewport, and the object carries the idea".

## The twelve moves

1. **Hero = name, one tagline, price pill.** Small product name, a two-to-four-word tagline in display type, and directly under it a rounded grey pill: "From $1199 or $49.95/mo." in 12px grey with a blue "View pricing" button. Price is present in the first viewport but visually quiet. Dates ("Pre-order 9.12, available 9.18") sit beneath in 10px grey.

2. **Sticky product nav after the hero.** A slim bar with the product name on the left and "Explore" + "View pricing/Buy" on the right. The purchase action never leaves the screen, so the body never has to shout it. Body CTAs almost disappear as a result.

3. **"Get the highlights." carousel.** The second viewport is a horizontal strip of four or five full-bleed cards, each one sentence over a video or macro photo (Camera, Battery, Colors, Chip, Siri). It is the whole page in one screen for the visitor who will not scroll. Pills below name each card.

4. **Section grammar is fixed.** Tiny grey eyebrow naming the topic ("Design", "Pro camera system", "Battery life", "Performance"). One two-line witty headline ("Eye-opening control.", "Greatest of hour time.", "Welcome to the mother chip."). One hero image of the feature filling the viewport. One centered paragraph of about 60 words. Then two or three stat callouts. Every section reads the same way, so the visitor learns the rhythm once.

5. **The object is the illustration.** The aperture blades, the chip inside the vapor chamber, the phone lying flat with the screen playing. Features are shown by photographing the thing that does them, macro, lit, on black. Copy never describes what the picture already shows. There are no icons standing in for the product, and no stock people except inside camera samples.

6. **Grey prose, white bold.** Body text is mid-grey with the four or five key phrases in bold white. A reader who only reads the bold still gets the section. This is how Apple keeps 400 words in a section without it reading as 400 words.

7. **Stat callouts: label, number, unit.** "Up to" in 10px grey, "22 more hours" in 32px white, "video playback" in 10px grey. Two or three per section, separated by hairlines, never more. The number is the headline and the unit is the caption.

8. **Cards are one claim each.** Rounded 28px, `#1d1d1f` on `#000`. A 2x3 grid ("Worth the upgrade? You bet.") where each card is one image or one icon plus one line. Feature lists become carousels of captioned image cards (photo, bold lead, grey sentence), never bullet lists.

9. **Progressive disclosure via pills.** The product viewer lists seven features as small pill buttons ("Colors", "Two sizes", "Durability", "Action button"). Detail opens on demand. The seven facts are visible; the 700 words behind them are not.

10. **Ground shifts mark the change of intent.** Sections alternate `#000` and `#1d1d1f` with no rules between them. When the page turns from desire to transaction ("Why Apple is the best place to shop", compare, trade-in, environment) the ground flips to light `#f5f5f7`. Dark is the dream, light is the paperwork.

11. **Pricing is stated once per product, as a decision aid, never as a ledger.** The lineup page gives each model a card: image, name, one-line descriptor, "From $X or $Y/mo.", two links. The product page's compare block puts two models side by side with icon-per-row specs. Nowhere is there an itemised sum of components. Reasons-to-buy-here (lease, trade-in, financing, setup, delivery) live in their own light section, separated from reasons-to-buy-the-product.

12. **Footnotes quarantine the fine print.** Every claim carries a superscript, and 4,000 words of conditions sit in one grey block at the very bottom. Credibility is on the page; clutter is not.

## Typography and space, measured

- Display headline 56px/600, section headline 48px/600 with line-height 1.08, sentence case, always two lines with a full stop.
- Body 17 to 19px, line-height 1.47, grey `#86868b`, max-width about 700px, centered under centered headlines, left-aligned in two-column blocks.
- Captions and eyebrows 12 to 14px grey. Nothing on the page is tracked-out uppercase.
- Vertical padding between sections 150 to 200px. Prose column ~980px, media column ~1440px full-bleed.
- One accent (blue) for links and the buy button only. Feature colors (green battery, orange environment, cyan packaging) appear as single inline highlights, never as section themes.
- Motion is scroll-triggered reveals, autoplaying muted loops inside cards, and hotspot pills. No parallax, no scroll-jacking.

## Translating to Mirai (DESIGN.md wins on conflicts)

Keep from Apple:
- One idea per viewport, fixed section grammar, the object as illustration, grey-prose-white-bold, label-number-unit stats, highlights strip, sticky nav with the CTA, price once as a pill in the hero and once as a decision block, footnotes.

Translate, do not copy:
- Apple's rounded `#1d1d1f` cards become Mirai's hairline-ruled cells on void. Same "one claim per cell" rule, different material.
- Apple's ground flip to light for the transaction tail conflicts with "no light mode". The equivalent inside DESIGN.md is a ground shift from void to the ruled-grid register, or a full-bleed veiled photo behind the pricing block. Decide this explicitly.
- Apple's sentence-case 600-weight headlines conflict with Mirai's uppercase 800 to 900 verbs. Keep Mirai's display voice, but adopt Apple's two-line ceiling and the full stop.
- Apple photographs the product. Mirai's "product" is Kobe, KBIC, the people and the regulatory machinery. The illustration budget should go to real photography of Port Island, the cluster, the labs, the speakers, and to typographic treatment of the numbers (six months, 370, ¥23.8T), not to line icons.

Retire on /conferences:
- Five repeats of "GET MY PACKAGE — $2,500". One hero pill plus one sticky nav action plus one decision block.
- The nine-line ledger comparing $48,000 to $2,500. Replace with an Apple-style compare block: what the package contains, one row per item with an icon or photo, and the comparison as a single line.
- 4-up text card grids with 60-word paragraphs. Each becomes one viewport with a headline, one image, one paragraph with bold phrases, and stats.
