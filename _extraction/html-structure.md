# HTML Structure Documentation - mirai-compact.html

## Overview
The page is organized as 7 sequential full-viewport "Moments" (sections) plus additional sections for the Playground (Isometric Map) and Post-Credits. Each section is marked with both CSS comment blocks and HTML comments.

---

## HTML Structure Breakdown

### Body Root
- **Classes**: `loading` (added on page start, removed when page loader completes)
- **Key child structure**:
  - Page loader
  - Color atmosphere layer
  - Scroll progress bar
  - Grain canvas
  - Custom cursor
  - Navigation
  - 7 main moments
  - Playground/Map section
  - Post-credits section

---

## MOMENT 1: HERO
**ID**: `hero`
**Class**: `section hero`
**Data Attribute**: `data-section="hero"`

### Elements:
- `.hero-bg` — Full-screen background
- `.hero-kanji-wrapper` — Contains animated kanji
  - `#heroKanji` — Parallax-driven 未 (mirai/future) character
- `.hero-content` — Text overlay
  - `.hero-headline` — Main headline with animated split text
    - Contains `<em>` tags for gradient text (iridescent animation)
    - Structure: "Building the future / of biotech — / in 4 weeks"
  - `.hero-subheading` — Descriptive text
  - `.hero-cta` — Call-to-action button
- `.hero-particles` — Canvas for bioluminescent particle effects
  - `#heroParticles` (canvas element)

### Key Features:
- Parallax effect on kanji (transforms based on scroll)
- Animated split text on hero headline
- Particle canvas for dynamic glow effects
- Scroll progress bar at top

---

## MOMENT 2: CHOOSE YOUR STARTER
**ID**: `tracks`
**Class**: `section reveal`
**Data Attribute**: `data-section="tracks"`

### Structure:
- `.section-label` — "Choose Your Starter"
- `.tracks-heading` — Main heading
- `#tracksGrid` — Grid container for 3 track cards
  - **3x `.track` cards** (one per track)
    - **Data attributes**:
      - `data-track` — Track name (e.g., "Devices Residency")
      - `data-color` — Hex color for track (e.g., "#6DB5F5" for blue)
    - **Structure (each)**:
      - `.track-face-down` — Initial face-down state
        - `.track-mascot` — Inline SVG sprite (32×32 pixel art)
      - `.track-face-up` — Revealed state (hidden by default)
        - `.track-name` — Track name text
        - `.track-description` — Descriptive text
        - `.track-stats` — Stat bars container
          - 3x `.track-stat` (each has `.track-stat-label` and `.track-stat-bar`)
- `.track-banner` — Banner that appears after selection
  - `#trackBanner` — Container
  - `#trackChosenName` — Text that displays selected track name
- `#scrollCompanion` — Fixed bottom-right mascot (bobbing mascot)

### Key Classes:
- `.track.selected` — Active/selected state (shows face-up, fills stat bars)
- `.tracks-grid.has-selection` — Grid state when a track is selected (fades non-selected cards)
- `.card-visible` — Applied via IntersectionObserver for staggered entrance animation

### Colors (CSS custom properties):
- `--tk` — Primary track color (border, name text)
- `--tk-rgb` — RGB version for use in canvas/filters
- `--tk-dark` — Darker variant for depth

---

## MOMENT 3: THE MONTH
**ID**: `month`
**Class**: `section reveal`
**Data Attribute**: `data-section="month"`

### Structure:
- `.section-label` — "The Month"
- `.month-heading` — Main heading (animated kinetic typography)
- `#timeline` — Timeline container
  - `.tl-weeks` — Container for week items
    - **4x `.tl-week`** (one per week)
      - `.tl-num` — Week number (1, 2, 3, 4)
      - `.tl-label` — Week title/theme
  - `#timelineProgress` — Progress bar that fills as user scrolls into section
- `.runway-block` — Frontier Human Fashion Show callout (parallax movement)

### Key Features:
- Scroll-driven timeline progress (IntersectionObserver + scroll math)
- Parallax on runway block (transforms based on section position in viewport)
- Animated progress bar fill

---

## MOMENT 4: THE RUNWAY
**ID**: `runway`
**Class**: `section reveal`

### Structure:
- `.section-label` — "The Runway"
- `.runway-title` — Main heading (animated split-text)
- `.runway-content` — Description and highlights
  - `.runway-highlight` — Key point callout (e.g., "Live Fashion Show")
  - Text describing the fashion show event

---

## MOMENT 5A: KOBE & PORT ISLAND
**ID**: `kobe`
**Class**: `section reveal`
**Data Attribute**: `data-section="kobe"`

### Structure:
- `.section-label` — "Kobe"
- `.kobe-heading` — Main heading
- `.kobe-beat-1` — Two-column layout (left: info, right: lifestyle cards)
  - **Left column**:
    - `.kobe-info` — Text about Kobe/Port Island
      - `.kobe-stat` — Statistics (e.g., "Oct 1–31 2026")
  - **Right column**:
    - `.life-cards-grid` — Grid of 4 lifestyle TCG cards
      - **4x `.life-card`** (Onsen, Food, Fitness, Explore)
        - **Data attributes**:
          - `data-card-name` — Name of card
        - **Front side** (default visible):
          - `.life-front-content` — Gradient background + kanji watermark
          - `.life-front-hover-text` — Hover reveal text
        - **Back side** (in overlay):
          - `.life-back-art` — Base64-encoded card image
          - `.life-back-content` — Stats and info
        - **3D tilt effect**: Perspective transforms on hover

### Key Features:
- **3D tilt on hover**: rotateX/Y based on cursor position
- **Shimmer effect**: Moving radial gradient overlay
- **Click opens full-screen overlay**: `#cardOverlay` with flip animation
- **Color per card**: Custom CSS variables for accent colors
  - Onsen: Teal/cyan (`--card-rgb: 130,220,190`)
  - Food: Amber/gold (`--card-rgb: 232,201,125`)
  - Fitness: Slate (`--card-rgb: 168,168,180`)
  - Explore: Violet (`--card-rgb: 200,150,220`)

---

## MOMENT 5B: PLAYGROUND (ISOMETRIC MAP)
**ID**: `playground`
**Class**: `section reveal`
**Data Attribute**: `data-section="playground"`

### Structure:
- `.section-label` — "Port Island"
- `.kobe-heading` — "Meet the playground"
- `#kobeVisual` — Visual container
  - `#isoMapWrapper` — Interactive map wrapper
    - `#isoMapCanvas` — Map canvas (translatable on drag)
      - **6 SVG layers** (each in `.kobe-layer`):
        1. `.kobe-layer-water` — Background water layer
        2. `.kobe-layer-mainland` — Kobe mainland silhouette
        3. `.kobe-layer-island` — Port Island isometric shape
        4. `.kobe-layer-grid` — Street grid overlay
        5. `.kobe-layer-buildings` — Ambient buildings (non-interactive)
        6. `.kobe-layer-glow` — Animated coastline glow
      - **Ambient buildings** (non-interactive isometric cubes):
        - `.iso-ambient` — Positioned as divs with `--h` (height) custom property
          - Child elements: `.iso-building-top`, `.iso-building-front`, `.iso-building-left`
      - **Interactive buildings** (clickable info cards):
        - `.iso-building` — Each has data attributes for info
          - `data-title` — Building name
          - `data-cat` — Category (Venue, Stay, Transit, Lifestyle, Food, Active)
          - `data-text` — Description
          - `data-s1v`, `data-s1l` — Stat 1 value and label
          - `data-s2v`, `data-s2l` — Stat 2 value and label
          - `data-s3v`, `data-s3l` — Stat 3 value and label
        - When clicked, opens inline info card (`.iso-info-card`)
          - **Info card structure**:
            - `.iso-card-header` — Title + category + close button
            - `.iso-card-text` — Description
            - `.iso-card-stats` — 3x `.iso-card-stat` with value + label
            - `.iso-card-scan` — Scan line animation
    - `#cardOverlay` — Overlay for full-screen card view (empty on init)

### Key Features:
- **Draggable/scrollable canvas**: Mouse drag or touch swipe to pan
- **Momentum scrolling**: Velocity-based inertia on drag release
- **Parallax depth**: Mouse move triggers parallax on each layer
- **Interactive buildings**: Click to open info card inline
- **Staggered entrance**: Buildings reveal in sequence via IntersectionObserver

---

## MOMENT 6: PROOF
**ID**: `proof`
**Class**: `section reveal`
**Data Attribute**: `data-section="proof"`

### Structure:
- `.section-label` — "Proof"
- `.proof-heading` — Main heading
- `.proof-content` — Two-column layout
  - **Left column**:
    - `.roster-section` — Speakers/roster grid
      - `#rosterGrid` — Grid of avatar slots
        - **8x `.roster-slot`** (6 confirmed + 2 mystery)
          - `data-fighter` — Index in fighters array
          - `.roster-avatar` — Avatar image (small)
      - `.roster-count` — "8 Confirmed" with count-up animation
        - `#rosterConfirmed` — Number that animates to 8
  - **Right column**:
    - `#fighterPanel` — Detail panel for selected fighter
      - `#fighterPortrait` — Large portrait image (flash animation on select)
      - `.fighter-info` — Text info
        - `#fighterName` — Full name
        - `#fighterTitle` — Title/affiliation
        - `#fighterBio` — Biography text
- `.partners-section` — Partner logos/organizations
  - `.partners-grid` — Grid of partner logos
    - **Multiple `.partner-logo`** elements (images)

### Key Features:
- **Fighter selection**: Click roster slot to populate detail panel
- **Auto-select first fighter** on page load
- **Count-up animation**: Triggered when section scrolls into view
- **Flash effect on selection**: Portrait flashes when fighter selected

---

## MOMENT 7: APPLY
**ID**: `apply`
**Class**: `section reveal`
**Data Attribute**: `data-section="apply"`

### Structure:
- `.section-label` — "Apply"
- `.apply-heading` — Main heading (animated split-text)
- `.apply-content` — Main container
  - `#applyTrackIndicator` — Pill showing selected track (hidden until track selected)
    - `.ati-dot` — Colored dot matching track
    - `.ati-name` — Track name text
  - `#evoShowcase` — Evolution showcase section
    - `#selectPrompt` — Text that appears if no track selected
    - **3x `.evo-line`** (one per track)
      - `data-evo-track` — Track name for matching
      - **3x `.evo-stage`** (Stages 1, 2, 3)
        - `.evo-stage-num` — Stage number
        - `.evo-stage-sprite` — Inline SVG sprite (32×32 pixel art)
      - **2x `.evo-arrow`** (between stages 1-2 and 2-3)
        - SVG arrow with animation
  - `.apply-buttons` — CTA buttons
    - **Multiple buttons** (one per track or generic)
      - Class `btn` with `btn-primary` or `btn-secondary`
  - `.faq-section` — FAQ accordion
    - **Multiple `.faq-item`**
      - `.faq-q` — Question (always visible, clickable)
      - `.faq-a` — Answer (hidden until `.faq-item.open`)

### Key Features:
- **Track-dependent visibility**: `.apply-track-indicator` only visible if track selected
- **Evolution showcase staggered reveal**: Stages pop in with 500ms delays
- **Auto-trigger animation**: Via IntersectionObserver when scrolled into view OR immediately on track selection
- **FAQ accordion**: Single-open accordion (clicking one closes others)
- **Kinetic text animation**: Headlines split into characters with staggered appearance

---

## ADDITIONAL SECTIONS

### Page Loader
**ID**: `pageLoader`
**Class**: `page-loader`

### Structure:
- `.loader-kanji` — Animated kanji display
  - `.loader-pulse` — Pulsing background
  - Two `<span>` elements: "未" and "来"
- `.loader-line` — Animated line beneath

### Key Features:
- Waits for fonts to load + minimum 2.2s pause
- Timeout at 4s maximum
- Removes class `loading` from body and class `done` added to loader
- Triggers hero headline animations after dismissal

### Color Atmosphere
**ID**: `colorAtmosphere`
**Class**: `color-atmosphere`

- Full-page overlay with scroll-reactive gradient backgrounds
- Changes color zone based on scroll progress (0-1 normalized)
- 6 zones with radial gradients at different positions
- Updated via scroll event listener

### Scroll Progress
- `#progressFill` — Width fills based on scroll progress (0-100%)
- Class `scroll-progress` — Container at top

### Canvas Elements
- `#grainCanvas` — Animated grain texture (1/4 resolution, ~12fps)
- `#heroParticles` — Bioluminescent particles in hero section

### Custom Cursor
**ID**: `cursor`
**Class**: `cursor`

- Follows mouse position
- `.hover` class added on interactive elements (track, button, card, etc.)

### Navigation
**Tag**: `<nav>`

### Structure:
- `.nav-logo` — Logo/brand
  - `.nav-mark` — Kanji mark "未"
  - `.nav-name` — "Mirai Tech" text
- `.nav-links` — Navigation menu
  - `<a href="#tracks">Tracks</a>`
  - `<a href="#month">Program</a>`
  - `<a href="#kobe">Kobe</a>`
  - `#soundToggle` — Sound toggle button
    - `.sound-bars` — 3 bar visual
  - `.btn.btn-primary` — "Apply Now" button (links to #apply)

---

## POST-CREDITS SECTION
**ID**: `postCredits`
**Class**: `post-credits`

### Structure:
- `.post-credits-content` — Main content
  - `#postMascot` — Mascot sprite (copies selected companion or default)
  - `.post-message` — Thematic text
  - `.countdown` — Live countdown to Oct 1, 2026 (JST)
    - `#cdDays`, `#cdHours`, `#cdMins`, `#cdSecs` — Time values
  - `.countdown-labels` — Labels ("DAYS", "HOURS", etc.)
  - `#postStars` — Container for 50 randomly positioned stars
    - **50x `.post-credits-star`** — Twinkling star animation

### Key Features:
- Live countdown timer (updates every 1s)
- Stars with randomized animation delays
- Mascot copied from scroll companion or default
- Reveal animation on scroll into view

---

## CSS Classes Summary

### State Classes
- `.selected` — Track is selected
- `.active` — Element is active (scroll companion, builder, etc.)
- `.open` — FAQ item is expanded
- `.has-selection` — Track grid has a selection
- `.has-fighter` — Fighter panel populated
- `.visible` — Used for post-credits reveal
- `.card-visible` — Card has entered viewport (staggered entrance)
- `.in` — Section has entered viewport (reveal animation)
- `.flash` — Portrait flash animation for fighter select

### Animation Classes
- `.char-visible` — Split text character is visible (kinetic typography)
- `.tl-active` — Timeline week is active
- `.tl-vis` — Terminal line is visible (line-by-line reveal)
- `.term-cursor` — Blinking cursor indicator

### Interaction Classes
- `.hover` — Cursor is over interactive element
- `.loading` — Page is still loading
- `.done` — Loader is dismissed

### Reveal Variants
- `.reveal` — Basic scroll reveal
- `.reveal-clip` — Clip-path reveal variant
- `.reveal-scale` — Scale-based reveal variant

---

## Data Attributes Used

### Track Cards
- `data-track` — Track name (e.g., "Devices Residency")
- `data-color` — Hex color code

### Lifestyle Cards
- `data-card-name` — Card name (Onsen, Food, etc.)

### Evolution Lines
- `data-evo-track` — Track name for matching to selection

### Isometric Buildings
- `data-cat` — Category (Venue, Stay, Transit, Lifestyle, Food, Active)
- `data-title` — Building/location name
- `data-text` — Description text
- `data-s1v`, `data-s1l` — Stat 1 value and label
- `data-s2v`, `data-s2l` — Stat 2 value and label
- `data-s3v`, `data-s3l` — Stat 3 value and label

### Roster Slots
- `data-fighter` — Index into fighters array

### Sections
- `data-section` — Section name (hero, tracks, month, kobe, playground, apply)

---

## Interactive Elements

### Clickable Elements
1. `.track` — Select a residency track
2. `#scrollCompanion` — Jump to Apply section
3. `.life-card` — Open lifestyle card overlay
4. `.iso-building` — Open building info card
5. `.roster-slot` — Select a fighter
6. `.faq-item` — Toggle FAQ answer
7. `.btn` — CTA buttons (apply buttons)
8. `#soundToggle` — Toggle ambient sound

### Hover Effects
- Custom cursor enlarges
- Visual feedback on cards, buttons, track cards
- Shimmer effect on lifestyle cards
- Parallax depth on isometric map

---

## Key IDs Reference

| ID | Purpose |
|---|---|
| `hero` | Hero section |
| `tracks` | Track selection |
| `month` | Timeline section |
| `runway` | Fashion show callout |
| `kobe` | Kobe info + lifestyle cards |
| `playground` | Isometric map section |
| `apply` | Apply section with evolution showcase |
| `postCredits` | Post-credits countdown |
| `progressFill` | Scroll progress bar fill |
| `heroKanji` | Parallax hero kanji |
| `heroParticles` | Hero particle canvas |
| `tracksGrid` | Track cards container |
| `trackBanner` | Selected track banner |
| `trackChosenName` | Selected track name |
| `scrollCompanion` | Bobbing mascot sidebar |
| `applyTrackIndicator` | "Applying as" pill |
| `evoShowcase` | Evolution lines container |
| `timeline` | Timeline weeks container |
| `timelineProgress` | Timeline progress bar |
| `isoMapWrapper` | Interactive map wrapper |
| `isoMapCanvas` | Map draggable canvas |
| `cardOverlay` | Full-screen card overlay |
| `rosterGrid` | Fighter roster grid |
| `fighterPanel` | Fighter detail panel |
| `soundToggle` | Sound toggle button |

---

## Summary

This single-file HTML structure contains:
- **7 main moments** (sections) for navigation flow
- **~8 interactive systems** (track selection, map, roster, FAQ, etc.)
- **Multiple canvas elements** for animations and effects
- **Inline SVG layers** for isometric map and pixel art sprites
- **Embedded images** (base64) for lifestyle cards
- **Data-driven content** for buildings, fighters, and stats
- **Responsive grid layouts** with mobile breakpoints at 980px and 640px

All styling and interactivity is scoped to CSS classes and data attributes for easy React component mapping.
