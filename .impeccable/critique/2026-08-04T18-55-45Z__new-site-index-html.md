---
target: new-site/index.html
total_score: 26
max_score: 36
na_heuristics: 7
p0_count: 2
p1_count: 2
timestamp: 2026-08-04T18-55-45Z
slug: new-site-index-html
---
Method: dual-agent (A: design-review subagent · B: detector-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Pause toggle, active-word underline, countdown, aria-live all present; no auto-advance progress cue; `.dates .cell` links have zero at-rest affordance |
| 2 | Match System / Real World | 3 | Nav "Sponsors" anchors to `#apply` where no sponsor section exists; "0 / 9 presenters · 鎧脳義感…" is cryptic without knowing to tap |
| 3 | User Control and Freedom | 2 | ≤760px nav hides all section links (no hamburger) on a ~12,700px page; carousel auto-advances with only a 24px-wide ⏸ glyph to stop it |
| 4 | Consistency and Standards | 3 | Kanji spans violate the site's own chip affordance (DESIGN.md specifies bordered chips; implementation has no border/padding); "Apply Now" lands on a tickets-first block |
| 5 | Error Prevention | 3 | "Opening soon" flash on dead links is excellent; residual "did I click the right thing?" risk since Get Tickets and Apply open the identical Luma URL |
| 6 | Recognition Rather Than Recall | 3 | Dates re-anchored per section; daruma story lives only in `title` tooltips (nonexistent on touch); kanji reveal undiscoverable |
| 7 | Flexibility and Efficiency | n/a | Single-scroll Persuade page; desktop anchor nav suffices |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely excellent: one accent held page-wide, hairline grids, veils not scrims; only excess is 4 redundant apply doors stacked in `#residency` |
| 9 | Error Recovery | 3 | Only error state is the placeholder flash; handled well with `#srStatus` announcement |
| 10 | Help and Documentation | 2 | Zero practical info for a month-long international commitment: no pricing signal, housing, visa note, FAQ, or contact anywhere |
| **Total** | | **26/36** | **Good (72%)** |

## Design Specificity Verdict

**Authored, not template — with three generic soft spots.** The signature devices could not survive transplant to another event site: verbs-as-slide-dots hero nav (LIVE / ERADICATE / EXTEND / AUGMENT), episode-numbered residency weeks (EP.01 壱), the timestamped Kobe evening strip ending in "Live here a month →", kanji tap-reveals, the live JST clock + countdown, the PMDA/AMED/KBIC stat band, the one-eyed daruma. The summit-first strategy and wow → real → for me ladder are legible in the page structure itself.

Where it slides category-generic: (1) the ecosystem section — the "community is the face" proof point — is a dim 12px mono text list indistinguishable from any partners row; (2) summit topic chips read conference-generic ("Capital", "Regulation"); (3) the apply headline "The future is built here." is the one interchangeable line on a page of owned verbs. Coherence tension: the glossy cartoon daruma PNG is the page's only true second hue (red) and sits closer to the retired arcade register than "restrained Japanese wit."

**Deterministic scan**: 33 CLI findings, 121 runtime findings (87 flagged elements) — but the majority fire on patterns DESIGN.md explicitly sanctions: 47 "ai-color-palette" hits are the documented single cyan accent; most of 33 "undersized-ui-text" hits are the documented 10–11px mono label layer; the one bounce-easing hit is the sanctioned Fashion Show punchline; all-caps/kicker/chip rules fire on the named eyebrow system. Genuine detector catches the review confirms: 5 line-length violations (`.alsoline` runs ~120ch vs the 76ch cap), 2 skipped heading levels (h2→h4 in `#residency` and `.past`), 15–20 em-dashes in body copy (an AI-tell in the voice), and mid-scale font sizes (14/16/17px) that sit outside the documented type ramp.

**Visual overlays**: in-page injection succeeded and the overlay evidence was captured (yellow badges on the nav logo, "SCROLL ↓", and the hero verb toggles), but the evidence server and tab were cleaned up afterward per the flow — no live overlay tab remains open.

## Overall Impression

This is a strong, genuinely authored page — 26/36 with an honest 4 on aesthetics is rare. The system holds its one-accent film-trailer discipline everywhere, and the conversion architecture (three doors, honest placeholders, countdown peak-end) is deliberate. But the page currently persuades best on a 27" display: on phones the strategic line renders at 10.5px, the hero controls collide at small widths, and all section navigation disappears. The single biggest opportunity: the mobile experience of the exact line and controls the whole strategy hangs on.

## What's Working

1. **Verbs-as-carousel-nav** (`#heroDots`): the belief ladder is literally the navigation chrome — LIVE / ERADICATE / EXTEND / AUGMENT as slide dots. Signature-level; no other event site has this.
2. **The honest-placeholder system**: dead links flash "Opening soon" with an aria-live announcement instead of navigating nowhere; same DNA as "15/38 revealed." Pre-launch honesty as a brand device that builds trust rather than eroding it.
3. **The Kobe strip narrative CTA**: five timestamped photos (17:58 → 23:41) ending with "Live here a month →" inside the final figcaption — lifestyle wonder converted into the residency ask exactly where the visitor feels it.

## Priority Issues

- **[P0] Mobile type inversion of the conversion line.** `.slide .lead` (clamp min 10.5px + `white-space:nowrap`) and both `.resline`s hit 10.5px on all phones ≤~650px, with the hero lead running flush to the right viewport edge at 375px. The line PRODUCT.md calls "the line a visitor remembers" is the least legible text on mobile. **Fix**: under 760px, drop the nowrap and set real sizes (lead ≥15px wrapping to two lines; resline ≥20px). **Suggested command**: /impeccable adapt
- **[P0] Hero controls collide at small widths.** At 320–344px, `.heroDots` overlaps slide 1's CTA buttons by ~34px (measured: dots top 672px vs buttons bottom 706px) — "THE RESIDENCY →" renders through the verb dots and taps can switch slides instead of navigating. At 375px clearance is 3px. **Fix**: raise `.slide .content` bottom on mobile or move the dots into flow below the content; verify at 320px. **Suggested command**: /impeccable adapt
- **[P1] No section navigation on mobile.** `nav .links a:not(.btn){display:none}` under 760px leaves "Apply Now" as the only nav on a ~12,700px page — the Fashion Show and Residency are unreachable without scrolling everything. **Fix**: a compact mono anchor row or minimal hamburger. **Suggested command**: /impeccable adapt
- **[P1] Interactive affordance and tap targets.** The kanji presenter row — the most Mirai-specific interaction on the page — is 13×14px unmarked text (DESIGN.md itself specifies bordered chips); footer doors, "Add to calendar," and "Meet the speakers" are 13–14px tall; the pause control is a 24px glyph. **Fix**: give the kanji the existing `.tags span` chip treatment (solves affordance and target size at once); pad mono links to ≥24px boxes. **Suggested command**: /impeccable polish
- **[P2] The credibility layer under-delivers at the commitment moment.** "Adam — Announcement Soon" holds one of four marquee headliner slots; "0 / 9 presenters revealed" lands at the emotional peak reading as "nothing is ready"; the ecosystem wall (the community-is-the-face proof) is dim fine print; and at the high-stakes click there is no pricing signal, housing line, or human contact — the sponsor value prop is one 10px line behind an "Opening soon" button. **Fix**: swap the placeholder slot for a revealed speaker, reframe as "9 presenter slots · reveals begin September," brighten the eco wall with a count, add one reassurance line + contact under the apply row. **Suggested command**: /impeccable clarify

## Persona Red Flags

**Jordan (first-timer)**: Nav "Sponsors" jumps to `#apply` with no visible sponsor content — reads broken. "Get Tickets" and "Apply for the Residency" open the identical Luma page, creating did-it-work doubt. No prices anywhere. The kanji row is noise to him.

**Casey (distracted mobile, 3G)**: Preload discipline is actually good (~5.8MB up front of 20.2MB total video; later slides poster-backed `preload="none"`). Her real problems are the 10.5px lead, no section nav, 13px tap targets, and text touching the screen edge. 680KB of unused images (`falling_a/b.jpg`) ship regardless.

**Riley (stress tester)**: Rapid dot-clicking is robust (timer cleanup verified); placeholder and kanji re-entry guarded; JS-off degrades correctly via noscript. He'd find: mis-taps from the 320px overlap, no `:focus-visible` styles anywhere, no skip link.

**Dr. Sato (biotech founder / sponsor lens)**: "Direct PMDA connection for conditional approval" is a load-bearing claim with no mechanism sentence (who brokers it?). Two of four marquee slots are a mononym and a placeholder. Zero contact route anywhere is a trust gap for wiring sponsorship money — community-run positioning explains no org block, not no contact at all.

## Minor Observations

- `--faint` (48% alpha on void) ≈ 4.6:1 — passes AA but strained at 10px tracked mono; inactive hero dots and `.scrollTag` sit at ~2.5–3:1 over the bright healthspan slide despite the veil.
- `.alsoline` runs ~120ch (cap is 76ch); h2→h4 heading skips in `#residency` and `.past`; 15–20 em-dashes in body copy read as an AI voice tell.
- Mid-scale font sizes (14/16/17px) sit outside the documented ramp — a spec-drift issue more than a visual one.
- The daruma story exists only in `title` tooltips (invisible on touch); `daruma.png` is 157KB for a 24px render.
- The Fashion Show section is the only one without `.rv` reveals; `live-candidates.html` (debug) ships in the deploy folder; countdown script uses implicit id globals (`cd`, `jst`) — fragile but working.
- No console errors; zero horizontal overflow at 320–1280px; reduced-motion guards present on every animation checked.

## Questions to Consider

1. If the residency line is "the line a visitor remembers after 10 seconds," why is it the smallest text on a phone? Should mobile swap the hierarchy and let the lead be the fold's second headline?
2. Three doors, one identical Luma URL: when the ticket buyer, the device founder, and the sponsor all land on the same event page, who bounces? Would per-door Luma sub-events keep the "three doors" promise through the click?
3. The kanji presenter row is the most Mirai-specific device on the page and currently invisible. What if the nine kanji were the Fashion Show's hero element — nine bordered chips that flip to presenter names as they're announced — turning "0/9" from an empty stat into a countdown mechanic?
