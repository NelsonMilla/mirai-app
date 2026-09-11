# Design-it-twice round: the hero price CTA

## Problem

In `new-site/conferences/_v/final/index.html` the hero's conversion element is `.pricepill`: a 40px-radius pill containing "$2,500 · both summits · 12 nights · the finale" in 12.5px mono and a cyan "Get the package" button. Nelson: "This CTA looks horrible." Diagnosis: it is the one element on the page with a rounded pill silhouette (every other corner is 2–3px, every other container a hairline), its text is small mono at low contrast, and the price, which is the point, has no weight. The pill also appears as a smaller echo in the fixed bar; this round is about the hero element only.

## Requirements

The element must, in one glance from a senior reader over a dark photograph:
1. State the price **$2,500** with weight. Once.
2. Say what it covers: **both summits · 12 nights · the finale** (these three, this order, this wording).
3. Offer one primary action: **Get the package**, the Luma link with its existing attributes (`href` with coupon and `utm_source=conferences-hero`, `data-luma-ticket-type="ttype-0BjQv0xV4yY5P0l"`, `data-analytics-action="checkout"`, `data-analytics-location="hero"`, `data-analytics-target="summit_package"`, `target="_blank" rel="noopener"`).
4. Optionally a secondary action **Email us** (`mailto:team@miraitech.city?subject=Mirai%20Summits%20package`, `data-analytics-action="alternative_offer"`, `data-analytics-target="email"`). Not required.
5. Sit inside the hero's left column under the lead paragraph, above the proof line, and hold at 1440 and 375 with the hero still fitting the fold at 1440×900 (the current hero is at its height budget; do not grow it by more than 20px).
6. Obey DESIGN.md: 3px button radius, 2px chip radius, hairlines, Switzer for anything heavy, IBM Plex Mono for labels at 12px or less, cyan as the only accent, no shadows or glows at rest, no pills. It must look like it was born on this page, next to the hairline proof rule beneath it.
7. Contrast 4.5:1 for every piece of text over the hero veil. Touch target 44px. Keyboard focus visible.
8. Copy is final: no new words beyond those above and the button labels.

## Deliverable per design

A standalone page at the path in your task prompt that renders the hero ONLY (copy the hero section, its backdrop image, veils and CSS from the final page, and the `<head>`), with your CTA replacing `.pricepill`. Self-contained. Verify at 1440×900 and 375×812 with Playwright: screenshot the hero, crop the CTA region at 2× for a close look, measure the hero height against the current 1006px, check contrast of every text run, check focus ring. Scratch dir in your task prompt.

## Report back

1. **The interface**: what the eye reads first, second, third, in one sentence.
2. **Usage**: the click path, and what a keyboard user experiences.
3. **What it hides**: anything demoted to small type and why that is safe.
4. **Trade-offs**: what it gives up, hero height delta, and how it degrades at 375.
5. Paths (HTML, hero screenshot, CTA crop), and anything unverified.
