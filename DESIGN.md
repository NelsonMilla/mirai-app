---
name: Mirai Tech City
description: Summit-first landing site for a longevity biomedical popup city in Kobe — cinematic, kinetic, precise.
colors:
  void: "#050506"
  bone: "#f4f3f0"
  signal-cyan: "#9be8f0"
  dim: "rgba(244,243,240,.62)"
  faint: "rgba(244,243,240,.48)"
  hairline: "rgba(244,243,240,.14)"
typography:
  display:
    fontFamily: "Switzer, Inter, sans-serif"
    fontSize: "clamp(40px, 9vw, 132px)"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "-.015em"
    textTransform: "uppercase"
  heading:
    fontFamily: "Switzer, Inter, sans-serif"
    fontSize: "clamp(34px, 5.2vw, 76px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-.01em"
    textTransform: "uppercase"
  body:
    fontFamily: "Switzer, Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  eyebrow:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: ".3em"
    textTransform: "uppercase"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "10px"
    fontWeight: 400
    letterSpacing: ".18em"
    textTransform: "uppercase"
rounded:
  button: "3px"
  chip: "2px"
spacing:
  section: "110px 6vw"
  sectionMax: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "#0a0a0c"
    rounded: "{rounded.button}"
    padding: "12px 26px"
    typography: "{typography.label}"
  button-ink:
    backgroundColor: "{colors.bone}"
    textColor: "#0a0a0c"
    rounded: "{rounded.button}"
  button-ghost:
    textColor: "{colors.bone}"
    border: "1px solid rgba(244,243,240,.4)"
    rounded: "{rounded.button}"
  eyebrow:
    textColor: "{colors.signal-cyan}"
    typography: "{typography.eyebrow}"
  tag-chip:
    textColor: "{colors.signal-cyan}"
    border: "1px solid rgba(155,232,240,.3)"
    rounded: "{rounded.chip}"
    padding: "7px 13px"
---

# Design System: Mirai Tech City

## 1. Overview

**Creative North Star: "A film trailer for a real city"**

The site is cut like a trailer: full-viewport moving photographs, one enormous uppercase verb per scene (LIVE. ERADICATE DISEASE. EXTEND THE HEALTHSPAN. AUGMENT THE HUMAN.), a countdown running at the end. The register is cinematic and kinetic, but the instrument panel underneath is precise — hairline-ruled grids, tabular stats, IBM Plex Mono readouts. Japan is present as texture and wit, never as theme-park decoration: a one-eyed daruma who gets his second eye on October 1, kanji that reveal their meaning on tap, residency weeks numbered as episodes (EP.01 壱).

This replaces the previous "Night Arcade Lab" system: the TCG/arcade layer (starter cards, pixel mascots, sakura pink, Fraunces) is retired. There is no light mode; the world is near-black with one cold accent.

**Key characteristics:**
- One-page static HTML; all CSS in one `<style>` block in `new-site/index.html`, in page order
- Void-black ground, bone-white type, a single pale-cyan accent — no second hue anywhere
- Moving-photo video loops (Grok stills → Kling i2v → palindrome/crossfade loops) as the imagery backbone
- Flat, print-like elevation: hairline borders and gradient veils, not shadows or glows
- Restrained easter eggs (daruma wobble, kanji tap-reveal) as the personality valve

## 2. Colors: Signal in the Void

### Primary
- **Void** (#050506): The body background and the darkness inside every veil gradient. Not pure black — a breath of blue.
- **Bone** (#f4f3f0): Primary type and the default (non-accent) button fill. A warm off-white that keeps huge display type from glaring.
- **Signal Cyan** (#9be8f0): The only hue. Eyebrows, dates, tag chips, links, the accent button, the countdown date, `::selection`. Reads as bioluminescence against the void.

### Neutral steps
- **Dim** `rgba(244,243,240,.62)`: Body prose and descriptions.
- **Faint** `rgba(244,243,240,.48)`: Fine print, section numbers, captions.
- **Hairline** `rgba(244,243,240,.14)`: Every border and rule.

### Named Rules
**The One Accent Rule.** Signal cyan is the entire color budget. No second hue, no gradients between hues, no per-section color worlds. Emphasis beyond cyan is done with weight, size, or white.

**The Veil Rule.** Type never sits on raw imagery. Every video or photo carries a `veil` gradient (void-black, directional) tuned so overlaid text keeps contrast; the veil is part of the composition, not a censor bar.

## 3. Typography

**Display/Body Font:** Switzer (Fontshare; Inter fallback) — one family, 400–900
**Mono Font:** IBM Plex Mono — labels, eyebrows, buttons, captions, stats context

**Character:** One sans family doing everything through weight contrast: 900 uppercase display verbs at up to 132px against 400 prose at 15px. The mono layer is the subtitle track — small, tracked, uppercase, always quiet.

### Hierarchy
- **Display** (900, clamp 40–132px, 0.94, uppercase, −.015em): Hero verbs and the Apply headline only.
- **Heading** (800, clamp 34–76px, 0.98, uppercase, −.01em): Section headlines (`h2.big`).
- **Sub-heads** (700–800, 17–38px): Card titles, episode names, stat values (800, tabular where numeric).
- **Body** (400, 14–15px, 1.6–1.7, dim): Prose capped near 76ch.
- **Eyebrow** (mono, 11px, .3em, uppercase, cyan): The section opener.
- **Label** (mono, 10–11px, .14–.26em, uppercase): Buttons, chips, captions, nav links. 9px is the absolute floor (photo-strip captions).

### Named Rules
**The Verb Rule.** Display type is a short claim — a verb phrase, seven words or fewer, uppercase, line-height under 1. If a headline needs a subordinate clause, the clause moves to body copy.

**The Cyan Eyebrow Rule.** The mono cyan eyebrow opening each section is the one sanctioned kicker system — the trailer's title card. Do not invent second kicker styles or use it mid-section.

**The One Family Rule.** Switzer carries everything except the mono layer. No serif, no second sans, no decorative display font.

## 4. Elevation

**Flat, ruled, veiled.** The page has almost no z-depth: surfaces are separated by hairline borders (`--line`) and full-width `hr.rule` dividers, like a printed program. Depth appears only two ways:

- **Veils**: directional void-black gradients over video/photo backdrops (hero, fashion show, apply). Imagery recedes; type advances.
- **Button lift** (`translateY(-1px)` + `0 8px 32px rgba(244,243,240,.22)`): The one shadow in the system, on button hover.

Cards are hairline-bordered boxes, flat at rest; hover responds with a faint cyan tint (`rgba(155,232,240,.04–.05)`) or border brightening, never a shadow. No glassmorphism, no glows at rest.

## 5. Components

### Buttons
- **Shape:** Near-square (3px radius), mono 11px uppercase .2em, 12px × 26px padding
- **Accent** (cyan fill, near-black text): The conversion CTA — Get Tickets, Apply
- **Ink** (bone fill, near-black text): Secondary actions
- **Ghost** (transparent, 40%-alpha bone border): Tertiary — sponsor, internal jumps
- **Hover:** −1px lift + soft bone shadow; ghost brightens its border

### Ruled grids
The structural signature: bordered cells sharing hairline internal rules, collapsing to stacked rows on mobile. Used for the dates band (3-up), Kobe stats (5-up), and summit cards (2-up with a faint cyan wash). Episode and track-record lists are baseline-aligned grid rows between horizontal rules.

### Media sections
Full-bleed sections (`max-width: none; padding: 0`) with a positioned video/image, a veil, and a re-centered 1440px content block. The hero is one stable offer over a high-priority poster; its desktop video progressively replaces the poster only after the poster renders and the main thread is idle.

### Signature components
- **Hero proof line:** Aubrey de Grey, KBIC/Port Island, and the 300-resident scale sit below the two conversion doors as quiet mono proof.
- **Daruma:** 24px in the nav, 46px in the footer; click triggers the `okiagari` self-righting wobble. He has one eye until October 1.
- **Kanji tap-reveals:** Cyan-bordered kanji chips that swap to their English meaning for 1.5s on tap/Enter; keyboard-operable.
- **Tag chips:** Mono 10px uppercase, cyan text, 30%-alpha cyan border, 2px radius — topics, tech categories, weekly rhythm.
- **Speaker cards:** 4:5 portraits at 28% grayscale, warming to full color + 1.025 scale on hover; name/org on a bottom veil.
- **Countdown + JST clock:** Tabular-numeral countdown to Oct 1 and a live Kobe clock in the footer — the trailer's release date.
- **Mobile menu:** Below 760px the nav collapses to logo + Apply + a mono "Menu" button that opens a full-screen void overlay — uppercase 800 links (clamp 28–40px) with mono cyan date suffixes, ✕/Escape/link-tap dismiss, scroll-locked while open, instant under reduced motion. On phones the hero lead and reslines drop their desktop nowrap and set fixed legible sizes (15px / 19px min).

### Honest placeholders
Dead links (`href="#"`) never navigate: they flash "Opening soon" for 1.4s and announce it via the `aria-live` region. New pending URLs must use this pattern.

## 6. Motion

Kinetic but scheduled — motion is the trailer's editing, not ambient decoration.

- **Hero media:** The poster is the only eager hero media. Desktop may fade in one muted loop after the poster renders and the browser is idle; mobile, reduced-motion, data-saver, and 2G-class connections remain poster-only.
- **Scroll reveals:** `.rv` elements rise 22px over 0.8s via IntersectionObserver; content is visible-by-default under `<noscript>` and reduced motion.
- **Performance etiquette:** Videos have no eager source beyond the hero poster; sources attach only when the media is eligible to play, and playback pauses off-screen.
- **Reduced motion:** `prefers-reduced-motion` keeps the hero poster static and disables smooth scroll, reveals, and the daruma wobble. Every animation added must carry its reduce guard.

## 7. Do's and Don'ts

### Do:
- **Do** keep signal cyan as the only hue (The One Accent Rule) and put every gradient in service of a veil, never a fill.
- **Do** lead sections with the cyan eyebrow + an uppercase verb-claim headline (The Verb Rule).
- **Do** keep all CSS in the single `<style>` block of `new-site/index.html`, in page order; it's a zero-build static file and stays that way.
- **Do** give every video a poster, `muted playsinline`, off-screen pausing, and every animation a reduced-motion guard.
- **Do** route every CTA to the Luma URL and every pending URL through the "Opening soon" placeholder pattern.

### Don't:
- **Don't** reintroduce the retired arcade/TCG register — sakura pink, pixel mascots, card mechanics, Fraunces — or any second accent hue.
- **Don't** ship biotech-corporate (navy/white, stock labs) or generic-SaaS moves (hero metrics, feature grids, testimonial carousels).
- **Don't** add shadows, glows, or glass to resting surfaces; depth is hairlines and veils only.
- **Don't** set display type below 800 weight or above line-height 1, and don't let mono labels grow past 12px — the subtitle track stays quiet.
- **Don't** add bounce easing beyond the one hero punchline, or reveal patterns that hide content when JavaScript or motion is unavailable.
