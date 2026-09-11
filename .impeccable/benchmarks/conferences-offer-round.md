# Design-it-twice round: the package section (the buying surface)

## Problem

The package section in `new-site/conferences/_v/final/index.html` (section `#offer`, the light "invoice on bone") runs 1.9 viewport-heights at 1440 and reads as a bill. Nelson's verdict: "too long, not inviting me to buy." Everything else on the page is settled. This round redesigns only this section.

## Requirements (what the interface must do)

Caller: a senior founder, investor or operator who has scrolled through the page and is deciding whether $2,500 for October in Kobe is a serious, easy yes. They give the section ten seconds. Success is a click on Get the package.

Must convey, in this priority order:
1. The price: **$2,500**, final, one price for everything. Appears once in this section.
2. What it buys, as one thought: both summit weekends, the finale, twelve nights in Sannomiya with breakfast, co-working and lab access, the social programme.
3. The three things you cannot buy anywhere else: a Japan go-to-market plan (workshops), capital and partners (matching-fund investors, Port Island institutions, licensing partners), time with the agencies (sessions on how Japan's approval routes work, explained by the institutions that designed them).
4. The dates: Summit I 17–18 Oct (The Science & Tech Augmenting Life), Summit II 24–25 Oct (From East to West: Bridging the Longevity Gap), Finale 26 Oct (Frontier Human Fashion Show & Demo Day, Orbis Hall), hotel 16–28 Oct.
5. The comparison, subordinate: bought separately at market these run to $48,000 (summits $900 each, finale $300, hotel $1,500, co-working $600, social $800, go-to-market plan $15,000, capital and partners $8,000, agency time $20,000). It may be a footnote, a disclosure, or one line. It must not be the visual centre.
6. Two actions: **Get the package** (primary, Luma link with the existing attributes) and **Email us** (secondary, mailto).

Hard constraints:
- **Fits in one viewport at 1440×900** in its default state (progressive disclosure may extend it on demand). At 375 it may run to two screens.
- Light ground for this section (bone `#f4f3f0`, ink `#0a0a0c`) is approved. Same site under different light: hairlines, Switzer 800 uppercase headings, IBM Plex Mono labels, no rounded cards, no shadows, no second hue beyond cyan used sparingly. Primary button on bone is void fill with cyan text.
- Headline seven words or fewer, uppercase, up to 88px, left-aligned.
- Tone rule: never name an agency on the same line as a price; Japan is the actor; no politics.
- Copy is plain and literal. No claims or numbers outside the list above.
- Keep the analytics and link attributes from the current section verbatim (`data-track-section="offer"`, checkout link with coupon, UTM, ticket type, `target="_blank" rel="noopener"`, the alternative_offer email link).

## Deliverable per design

A standalone page at the path in your task prompt that renders ONLY this section, using the final page's `<head>` (fonts, tokens) and 120px of void above and below so it can be judged in context. Copy the current section from the final page as your starting material, then replace it with your design. Self-contained: one `<style>`, one `<script>` if needed. Verify with the shoot script at 1440 and a 375 pass; the section must be complete in one 1440 tile.

Report back with:
1. **The interface**: what the visitor sees in the first second, in one sentence (the headline and the one visual object).
2. **Usage**: how the ten-second scan goes, step by step (what the eye reads first, second, third).
3. **What it hides**: which of the required information lives behind a disclosure, in a footnote, or in small type, and why that is safe.
4. **Trade-offs**: what this design gives up.
5. Path, and anything unverified.
