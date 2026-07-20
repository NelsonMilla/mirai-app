---
name: Mirai Tech PopUp City
description: Landing site for a 4-week biotech popup city in Kobe — playful, precise, alive.
colors:
  sakura-neon: "#F5A0B5"
  sakura-bright: "#FF6B92"
  sakura-dusk: "#D4708A"
  harbor-ink: "#141420"
  midnight-water: "#1C1C2A"
  pier-charcoal: "#262638"
  fog-slate: "#8585A8"
  signal-white: "#FFFFFF"
  lantern-pink: "#FFB8CC"
  port-light-blue: "#B8E3FF"
  onsen-steam-violet: "#D4B8FF"
  starter-blue: "#6DB5F5"
  starter-yellow: "#F5D34E"
  starter-red: "#F56B6B"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.05
    fontVariation: "'SOFT' 80, 'WONK' 1, 'opsz' 144"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  secondary:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.06em"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.22em"
  kanji:
    fontFamily: "Noto Serif JP, Georgia, serif"
    fontWeight: 900
rounded:
  mark: "6px"
  chip: "10px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.sakura-neon}"
    textColor: "{colors.harbor-ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
  button-outline:
    textColor: "{colors.sakura-neon}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
  section-label:
    textColor: "{colors.sakura-neon}"
    typography: "{typography.label}"
  qa-card:
    textColor: "{colors.signal-white}"
    rounded: "{rounded.card}"
    padding: "1.5rem 1.25rem 1.25rem"
---

# Design System: Mirai Tech PopUp City

## 1. Overview

**Creative North Star: "The Night Arcade Lab"**

A biotech lab at night, lit like a Japanese arcade. The surface is serious instrumentation — dark harbor-ink layers, hairline borders, monospace stat readouts — but every light source is playful: iridescent foil gradients, sakura-pink CTAs, pixel-art mascots, kanji watermarks glowing behind content. The system holds those two registers in tension on purpose: the game layer (starter tracks, TCG lifestyle cards, evolution mascots) is executed with the precision of lab equipment, which is what keeps "playful" from collapsing into "cute". This carries PRODUCT.md's personality — *playful, precise, alive* — into pixels.

The system explicitly rejects biotech corporate (navy-and-white, stock lab photos, compliance-speak) and the generic SaaS landing look (hero-metric templates, feature grids, testimonial carousels). It is a night world: there is no light mode, and warmth comes from neon against ink, not from beige.

Motion is part of the build, not an afterthought: everything eases out on exponential curves (`cubic-bezier(0.16, 1, 0.3, 1)` for reveals, `cubic-bezier(0.23, 1, 0.32, 1)` for micro-interactions), sections reveal with staggered children, and the chosen starter track re-themes reveals site-wide (scan-line wipe for Devices, blur dissolve for Therapies, flash-scale for Builder). A page-wide `prefers-reduced-motion` kill switch collapses every animation to an instant frame and forces reveal states visible.

**Key Characteristics:**
- Dark-only tonal world: three ink layers, never a light surface
- One neon accent (sakura pink) that the chosen track can re-tint site-wide via `--accent`
- Serif display with personality (Fraunces SOFT/WONK) against utilitarian Inter body and JetBrains Mono readouts
- Kanji as texture: Noto Serif JP watermarks and icon marks, never decorative clip-art
- Game-piece tactility: cards tilt, lift, flip; buttons rise; the cursor itself is a playful dot

## 2. Colors: Kobe at Night

A night-harbor palette: deep ink water, neon signage, iridescent reflections.

### Primary
- **Sakura Neon** (#F5A0B5): The brand accent — CTAs, section labels, active nav states, link hovers. Exposed as `--accent`, which track selection can override with a starter color; components must reference `--accent`/`--accent-rgb`, not the pink hex directly.
- **Sakura Bright** (#FF6B92): Hover/emphasis step of the accent; also the fashion-show chapter color.
- **Sakura Dusk** (#D4708A): Darker pink for pressed states and subdued accents.

### Secondary
- **Starter Blue** (#6DB5F5), **Starter Yellow** (#F5D34E), **Starter Red** (#F56B6B): The three track identities (Devices / Therapies / Builder). Each carries its own dark tint (`#0d1520`, `#1a1710`, `#1a1012`) for card backs. Per-track colors live next to the data in `src/data/` and `src/lib/constants.ts`, never hardcoded in JSX.

### Tertiary
- **Lantern Pink** (#FFB8CC), **Port-Light Blue** (#B8E3FF), **Onsen Steam Violet** (#D4B8FF): The iridescent gradient stops — foil shine on the logo mark, headline gradients, `em` emphasis. Always used together as a gradient, never alone as flat fills.

### Neutral
- **Harbor Ink** (#141420): The body background; the darkest water.
- **Midnight Water** (#1C1C2A): First raised layer — panels, card interiors.
- **Pier Charcoal** (#262638): Second raised layer — the lightest a surface gets.
- **Fog Slate** (#8585A8): Secondary text. Body-size prose on ink stays white; fog slate is for descriptions and captions at ≥15px.
- **Signal White** (#FFFFFF): Primary text and headlines. Hairline borders are white at 6% alpha (`rgba(255,255,255,0.06)`).

### Named Rules
**The Accent Relay Rule.** Interactive accents flow through `--accent` / `--accent-rgb` / `--accent-bright`, never the raw pink values. Choosing a starter track re-tints the whole page through these three variables; hardcoding pink breaks the relay.

**The Foil Rule.** The iridescent trio only appears as a moving or multi-stop gradient (logo mark, headline shimmer, `em` text). A flat lavender or baby-blue fill is a palette violation.

## 3. Typography

**Display Font:** Fraunces (with Georgia fallback) — variable, `'SOFT' 80, 'WONK' 1, 'opsz' 144`
**Body Font:** Inter (with system sans fallback)
**Label/Mono Font:** JetBrains Mono
**Kanji Font:** Noto Serif JP (未来 watermarks, card kanji, the nav mark)

**Character:** A wonky, soft-serif voice for moments of wonder, set against utilitarian Inter and terminal-style mono readouts — the arcade marquee versus the lab instrument panel. The nav wordmark is Fraunces italic.

### Hierarchy
- **Display** (500, per-component `clamp()` up to ~5rem, 1.05): Hero and section headlines. Always Fraunces with the variation settings; the `.display` utility class applies them.
- **Body** (400, 17px mobile / 18px desktop, 1.65): Inter prose. Token: `--fs-body`.
- **Secondary** (400, 15px / 16px, 1.5): Descriptions, lesser text, fog slate. Token: `--fs-secondary`.
- **Caption** (500, 13px, 0.06em, uppercase): Nav links and buttons. Token: `--fs-caption`.
- **Label** (500, 11px / 12px, 0.22em, uppercase, JetBrains Mono): Section kickers, badges, stat labels. Token: `--fs-label`. 10px/11px (`--fs-micro`) is the absolute floor for any text.

### Named Rules
**The Mono Kicker Rule.** The uppercase tracked mono `section-label` in sakura is a deliberate, named brand system — the arcade cabinet's instruction strip. It is the one sanctioned eyebrow; do not invent second kicker styles or apply it outside section openings.

**The Wonk Rule.** Fraunces never appears without its variation settings, and never below title size. Body text in a serif is a violation.

## 4. Elevation

**The Glow, Not Shadow Rule.** Depth comes from tonal layering (Harbor Ink → Midnight Water → Pier Charcoal), hairline 6%-white borders, and colored glows in the element's own accent — never neutral gray drop shadows. A surface at rest is flat; light appears as a *response* to interaction. The one sanctioned near-black shadow is the large soft ambient under lifted cards (`0 16px 40px rgba(0,0,0,0.25)`), always paired with an accent-tinted inset ring.

### Shadow Vocabulary
- **Accent glow** (`box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3)`): Primary button hover — the button emits its own light.
- **Card lift** (`box-shadow: 0 16px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(var(--qa-tone), 0.1) inset`): Hovered cards, with the card's own tone ringing the edge.
- **Under-door light** (bottom-edge gradient `rgba(tone, 0.2) → transparent`, rising on hover): The signature card treatment — a warm interior glow leaking from under the card's bottom edge.

## 5. Components

Components feel **tactile like game pieces**: everything lifts, tilts, flips, or bobs in response to the hand. Interaction is part of the play, but responses stay quick and exact — 0.2–0.4s, exponential ease-out, no bounce.

### Buttons
- **Shape:** Full pill (999px radius)
- **Primary:** Accent fill with Harbor Ink text (0.7rem × 1.25rem padding, Inter 700, 13px uppercase, 0.08em tracking)
- **Hover / Focus:** Lifts 2px and emits the accent glow; active presses back to rest
- **Outline:** Transparent with a 40%-alpha accent border and accent text; hover fills with 8%-alpha accent tint and lifts

### Cards / Containers
- **Corner Style:** Gently rounded (16px); small chips and icon tiles at 10px
- **Background:** Near-invisible white gradient (2.5% → 1% alpha) over the ink layers
- **Border:** Hairline `rgba(255,255,255,0.06)`, tinting toward the card's own color on hover
- **Shadow Strategy:** Flat at rest; card lift + under-door light on hover (see Elevation)
- **Internal Padding:** ~1.25–1.5rem

### Navigation
- **Style:** Fixed full-width bar on blurred ink glass (`rgba(20,20,32,0.75)` + `blur(20px) saturate(140%)`), hairline bottom border
- **Logo:** 36px iridescent-gradient mark (6px radius) holding a kanji glyph, next to the Fraunces-italic wordmark
- **Links:** 13px uppercase Inter at 50% white; hover to accent; active state underlined with a 1.5px accent bar
- **Mobile:** Links hidden below 640px, CTA button stays

### Signature Components
- **Section label:** The mono kicker (see The Mono Kicker Rule) opening each landing section.
- **Starter track cards:** Face-down/face-up Pokémon-chooser cards with per-track color worlds and animated stat bars; selection re-tints the site via the Accent Relay.
- **Lifestyle TCG cards:** 3D-tilt trading cards with kanji watermarks, shine layers, HP/ability stat blocks, and rarity codes.
- **Custom cursor:** A 10px accent dot in `mix-blend-mode: difference`, growing to 44px over interactive elements. Desktop pointer only; touch and coarse pointers get the native cursor back.
- **Grain overlay:** Fixed 6%-opacity fractal-noise film over everything — the arcade's CRT texture.

### Inputs / Fields
No public-facing forms ship on the live funnel (the Luma link is the only door). Dormant console/apply routes carry their own prefix-disciplined styles; don't generalize from them.

## 6. Do's and Don'ts

### Do:
- **Do** route every interactive accent through `--accent` / `--accent-rgb` so track selection re-tints the page (The Accent Relay Rule).
- **Do** put new styles in the owning route CSS file (`landing.css` in page order, `base.css` for shared system) — never append to file ends or add new component `<style>` blocks.
- **Do** keep depth as tonal layers + colored glows; the only dark shadow is the sanctioned card-lift pair (The Glow, Not Shadow Rule).
- **Do** guard every animation with the page-wide `prefers-reduced-motion` kill switch pattern, and keep reveals as enhancements of already-visible defaults (a paused wipe must never leave a section blank).
- **Do** keep per-item colors next to the data in `src/data/` / `src/lib/constants.ts`, as "r, g, b" + hex pairs.
- **Do** run `npx tsc --noEmit`, `npm run build`, and `npm run smoke` before finishing any visual change.

### Don't:
- **Don't** ship anything that reads as **biotech corporate** — navy-and-white, stock lab photos, compliance-speak (PRODUCT.md anti-reference).
- **Don't** ship anything that reads as a **generic SaaS landing** — hero-metric templates, feature grids, testimonial carousels, "the AI-generated landing page look" (PRODUCT.md anti-reference).
- **Don't** use bare element selectors (`nav`, `section`, `img`) in shared CSS — a bare `nav` rule once restyled the ProgressRail and console sidebar.
- **Don't** use the iridescent stops as flat fills, gray drop shadows as depth, or Fraunces without its variation settings.
- **Don't** invent a second kicker/eyebrow style, a light mode, or beige "warmth" — warmth here is neon against ink.
- **Don't** hardcode pink hexes in JSX or bypass `--accent`; and don't touch the frozen copy/numbers audited against the event deck.
