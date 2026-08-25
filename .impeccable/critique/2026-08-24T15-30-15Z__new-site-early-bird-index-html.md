---
target: new-site/early-bird/index.html
total_score: 15
max_score: 32
na_heuristics: 7,10
p0_count: 3
p1_count: 2
timestamp: 2026-08-24T15-30-15Z
slug: new-site-early-bird-index-html
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Offer dies in 7 days; no clock. The `.ebc` countdown for this exact SKU already ticks on the parent (`index.html:807`). |
| 2 | Match System / Real World | 3 | Plain language mostly lands; docked for "Everything means everything" and "world-class". |
| 3 | User Control and Freedom | 1 | No link back to the site exists. Logo (`:435`) and footer mark (`:597`) are `<span>`s with 44px tap sizing. |
| 4 | Consistency and Standards | 1 | `$900` = "one week" here, `$900` = one Summit weekend on the parent (`index.html:625`). Same SKU named "Early Bird" here, "Builder Pass" there. |
| 5 | Error Prevention | 3 | Refund terms and exclusions are honest and well-placed. Docked for the untested A/B headline length and an unpriced `/summit-bundle/` link. |
| 6 | Recognition Rather Than Recall | 2 | "$501 less" (`:500`) requires holding four table numbers in working memory. |
| 7 | Flexibility and Efficiency | n/a | Single-decision Persuade surface; no repeat/expert path. |
| 8 | Aesthetic and Minimalist Design | 1 | The same offer is restated five times; 3 of 4 "proof" stats are the calendar. |
| 9 | Error Recovery | 2 | The post-deadline self-heal swaps 4 strings and leaves 6 instances of `$399` and 4 of "August 31" standing. |
| 10 | Help and Documentation | n/a | Objections block covers the need; no docs surface expected. |
| **Total** | | **15/32** | **Poor — significant work needed** |

## Design Specificity Verdict

**Category-interchangeable.** The page inherits the parent's tokens and none of its authorship.

**LLM assessment.** Substitution test: swap "Mirai Tech City"→"[Conference]", "Kobe"→"[City]", "October"→"[Month]", `$399`→`$X`. Every line survives. Absent: the video hero, the daruma, the kanji reveals, the episode numbering, the 43 named speakers, the 15-logo ecosystem wall, the track-record ladder, the `hr.rule` divider. Present instead: a darkened still at `brightness(.63)`, decorative `01 02 03` indices, and an AI concept image whose own caption admits it ("October, imagined · Concept visual", `:539`). The h1 is a price, not a verb — the Verb Rule violated in the first fold.

**Deterministic scan.** `detect.mjs` exit 2, **68 findings / 3 rules**. After triage, roughly **6 are real**: 4 font sizes outside any documented step (138px hero ceiling `:108`, 46px `:414`, 23px `:420`, 20px `:403`), 2 genuine prose em-dashes (`:547`, `:553`). **62 are false positives** — the detector reads only DESIGN.md's frontmatter (5 sizes) and cannot read the prose section that explicitly sanctions 14–15px body, 17–38px sub-heads, and 9px as "the absolute floor".

The in-page overlay found more that survives triage: **26 undersized-UI-text** (9–10px functional labels), **13 all-caps body runs** of 31–86 characters, and 1 marketing buzzword ("World-class speakers", `:470`). Overlay `ai-color-palette` ×45 is a **false positive** — it flags cyan-on-dark generically, but the measured evidence shows total discipline.

**Browser measurements.** Zero horizontal overflow at 1280 and 375. Zero off-hue colors — every chromatic value is `#9be8f0` at some alpha. Zero shadows at rest. Exactly two font families. Heading outline clean (h1×1, h2×5, h3×2, no skips). One console error (`/_vercel/insights` 404 — local-only, not a defect). **The system compliance is real; the authorship is what's missing.**

## Overall Impression

This is not sloppy code. Palette, elevation, type families, semantics, and responsive behavior are all disciplined — cleaner than most production pages. The slop is at the level of *editorial judgment*: the page says the same four facts five times, dresses the calendar up as proof, opens on a coupon instead of a claim, shows zero human faces while asking a stranger for $399, and — with seven days left on the deadline — has no clock, while the countdown for this exact SKU already runs one directory up.

Biggest opportunity: **stop writing and start borrowing.** Nearly everything this page needs already exists in `new-site/index.html`.

## What's Working

1. **`Sep 30` as display type** (`:241–246`). The refund date is set at `clamp(66px,7vw,104px)` — larger than the price in its own band. Inverting "price big, terms small" turns risk-reversal into the message. The best decision in the file.
2. **The price ladder is a real table** (`:490–499`) — `<caption>`, `scope="row"`, `<colgroup>`, `tabular-nums`, visually-hidden `<thead>`. Comparative pricing as semantic tabular data rather than three pricing cards. This is the "instrument panel underneath" the design system asks for.
3. **Honesty committed in code.** The post-deadline self-heal (`:601–607`) and "travel and accommodation not included" placed next to *both* CTAs rather than buried. The instinct is right and rare, even though the implementation is incomplete.

## Priority Issues

### [P0] The page is a proof-free dead end
**What:** No link back to the site exists anywhere. `.early-page__logo` (`:435`) and `.early-page__footer-mark` (`:597`) are non-interactive `<span>`s given 44px tap-target sizing — they look like links and do nothing. The skip link "Skip to the offer" (`:432`) targets `#offer`, which *is* the hero. And there is not one human face on the page: no speakers, no partners, no venue, no track record.
**Why it matters:** The belief ladder's "real" rung — named speakers, KBIC/PMDA/AMED, four past events at scale — is entirely missing from the only page that asks for money. A reader who thinks "who is running this?" has no path to the answer.
**Fix:** Make the logo an `<a href="/">`. Replace the fake stat band (`:469–474`) — it occupies exactly the slot proof belongs in — with the four headliner portraits already on disk (`img/aubrey.jpg`, `jose.jpg`, `yuki.jpg`, `adam.jpg`), the line `43 confirmed · Aubrey de Grey, José Cordeiro + 41 more`, and `Meet the speakers →` linking `/#speakers`.
**Command:** `/impeccable harden`

### [P0] Register collapse — the trailer becomes a coupon
**What:** The h1 is a price (`:453`). The hero's dominant object is a bordered offer card. The imagery is a darkened still plus an admitted AI concept visual. And there is **no countdown on a page whose entire argument is a 7-day deadline**, despite `.ebc` being written, tested, and ticking on the parent for this SKU (`index.html:807`, `:1068`) — which also shows `$399 <s>$1500</s>` and "140 passes remaining", both dropped here.
**Why it matters:** The site gets visibly smaller when you click through to buy. That is backwards, and it forfeits the one urgency device the offer actually earns.
**Fix:** Port the `.ebc` countdown into the hero eyebrow. Restore the `<s>$1500</s>` anchor and the passes-remaining counter. Give the hero a Verb-Rule headline and demote `$399` into the offer card, where it already appears twice. Cut the concept visual (`:534–540`) for real Kobe photography already in `/img/`.
**Command:** `/impeccable bolder`

### [P0] `$900` means two different things across the two pages
**What:** Early-bird: `$900 — One week — choose the week that works for you` (`:495`). Parent: `$900 Summit Pass · Oct 17–18` and `$900 Summit Pass · Oct 24–25` (`index.html:625`, `:636`) — one weekend each. The page's headline value claim, "$501 less than a one-week pass" (`:500`), is computed off the contradicted number.
**Why it matters:** A visitor comparing the two pages finds the price architecture incoherent, at the exact moment they are deciding whether this is a real, well-run event. This is a factual defect, not a design one.
**Fix:** Reconcile the ladder against the deck and pick one meaning for `$900`. Pricing is frozen audited data — **this needs your decision, not my edit.**
**Command:** `/impeccable clarify`

### [P1] Five restatements of one offer
**What:** The same three facts appear in the hero list (`:458–460`), the decision section (`:480`, `:486`), the access list (`:524–529`), the objections `<dl>` (`:563–568`), and the close (`:578`). "Refundable through September 30" appears 6 times; "travel and accommodation not included" 3 times.
**Why it matters:** This is the loudest slop signal on the page — a document that has forgotten what it already said. Arriving as four defensive Q&As immediately before the ask, it signals *we expect you not to believe us*. Cognitive load: **6 of 8 checklist items fail**, and this drives three of them.
**Fix:** Delete the objections section (`:558–569`) — all four answers exist verbatim upstream. Delete the duplicate checkout note (`:580`). Delete or give meaning to the `01/02/03` indices (`:458–460`).
**Command:** `/impeccable distill`

### [P1] The emotional peak is addressed to the wrong reader
**What:** `:545–547` — "You helped make this real. / When Mirai was still a dream, you backed it." This sits at ~60% depth, is the only genuinely felt writing on the page, and assumes a relationship most visitors do not have.
**Why it matters:** A founder arriving from a tweet did not back it. At the page's warmest moment, the majority reader is handed someone else's mail and concludes the page is a repurposed mailing-list email.
**Fix:** Re-target forward — the price *is* the thank-you. Or gate the backer framing behind a `?ref=` param and serve the cold-traffic version by default.
**Command:** `/impeccable clarify`

### [P2] Mobile hero imagery is a 2× upscale
**What:** At 375px the hero renders the **960×540** source into a `375×1079` portrait box — `object-fit: cover` scales it to 1920×1080, a **2.0× upscale showing ~20% of the frame**. The city reads as an unidentifiable blur. `early-bird-month` has the same problem at 1.58×. Caused by `sizes="100vw"` on a box that is far taller than it is wide.
**Why it matters:** The first thing a phone visitor sees on a page selling a place is a blurry smear of that place.
**Fix:** Correct `sizes` to account for the portrait crop, or add a taller/portrait source to the `srcset`.
**Command:** `/impeccable adapt`

### [P2] Font-weight zoo and all-caps body copy
**What:** Nine font weights — `880` is the *most-used weight on the page* (8 rules), plus `850`×2, `750`×2, `650`×1 — against a system specifying 800/900. Thirteen all-caps runs of 31–86 characters set as body copy (`price-proof` is 86 characters uppercase). 25 rendered elements at 9px, and the `--faint` token measures **4.57:1** contrast — a bare AA pass, used at 9–10px. Date ranges use em-dashes (`Oct 17—18`) where the footer correctly uses en-dashes (`October 1–31`).
**Why it matters:** Individually invisible, collectively this is *why* the page reads as generated. A designer picks 800 or 900; a generator picks 880.
**Fix:** Snap weights to 400/500/700/800/900. Raise 9px functional labels to 10–11px (keep 9px only for photo credits). Sentence-case the long uppercase runs. Normalize date ranges to en-dashes.
**Command:** `/impeccable typeset`

### [P3] The page contradicts itself the day after it expires
**What:** The self-heal (`:601–607`) rewrites `.offer-status` and three CTA labels. Untouched: `$399` at `:463`, `:487`, `:547`, `:577` and in the h1 at `:453`; "August 31" at `:464`, `:484`, `:491`, `:500`.
**Why it matters:** On September 1 the page shows "View Current Passes" beneath a headline reading "All of October. $399." That reads as bait-and-switch — worse than no self-heal.
**Fix:** Tag every `$399` and `August 31` with `.eb-price` / `.eb-deadline` and swap them all, or gate the hero offer card behind the date check.
**Command:** `/impeccable harden`

## Persona Red Flags

**The biotech founder (project-specific — arrives from a tweet, zero context, deciding on $399 to a first-year event abroad):** Asks "is this real?" and gets a Wikimedia photo of a train (`:516`) and an image captioned "October, imagined" (`:539`). Reads "40+ world-class speakers" with two names in 9px and no faces, while 43 named speakers with portraits sit one click away. Hits "When Mirai was still a dream, you backed it" and concludes this is a repurposed email. Wants to compare the hotel option: `/summit-bundle/` is linked with **no price** (`:588`) while the parent quotes $2,500/$4,000.

**Screen-reader user:** The skip link announces "Skip to the offer" and delivers nothing (`:432`→`:443`). `aria-label` on non-interactive `<div>`s at `:482`, `:483`, `:510` is silently dropped by most AT, so "Early Bird, full October access, 399 dollars" never reaches anyone. `:511` splits the access window across two `<time>` elements → announced as "October 1. 31." The self-heal mutates CTA text with no `aria-live` region; the parent has `#srStatus`, this page has none.

**One-handed phone user:** The h1 wraps to four lines at `clamp(54px,18vw,74px)` with `max-width:7.4ch` (`:356`), pushing the primary CTA past one viewport on the page whose only job is that CTA. The rescue is the nav button labelled "$399 Early Bird" — a noun phrase with the verb stripped out. Four photo-credit links measure **11px tall**.

**Keyboard user:** `:focus-visible` is correctly styled (`:69`), but there is no focusable path back to the site, and both brand marks present as 44px targets while being unfocusable `<span>`s.

## Minor Observations

- `data-track-position` runs 1–7 but the page has eight blocks — `.early-page__month-visual` (`:534`) is invisible to analytics.
- `og:image` reuses the parent's generic `future_city.jpg`; the share card for a price-led offer carries no price.
- Desktop: the Port Liner photo card leaves a **~780×330px empty black region** to its right.
- The fixed 71px nav overlaps the 170px stat band whenever the page rests at that offset.
- `"Build · Gather · Augment"` (`:539`) invents a fifth verb; the brand's set is Live / Eradicate / Extend / Augment.
- `"40+"` / "more than 40" undersells the parent's committed `43 confirmed` — and PRODUCT.md still says 38. Three numbers for one fact.
- `.early-page__proof small` is `--ink` while the `span` above it is `--dim` — emphasis inverted inside one cell.
- `"Opening price, then increasing weekly"` (`:497`) is the one place scarcity is genuinely real, rendered as a table-cell footnote.
- `:500` ships an in-sentence dash as `<span aria-hidden="true">—</span>`.
- The A/B script (`:14–41`) is well-built — cookie persistence, `?early_bird_hero=` forcing, crypto-backed randomization — and tests a variable that is not the problem.
- No `hr.rule` anywhere; the parent's structural divider signature is absent.

## Questions to Consider

1. **If you deleted the price, would anything left identify this as Mirai?** Today the honest answer is the favicon.
2. **The offer dies in seven days and the countdown for this SKU is already written and ticking on the parent — what decision produced a self-heal for the state *after* expiry and nothing at all for the seven days *before* it?**
3. **You are asking a stranger for $399 and showing zero human faces.** Which closes that sale — the sixth restatement of the refund policy, or Aubrey de Grey looking at the camera? You already own the photograph.
