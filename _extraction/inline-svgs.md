# Inline SVGs Documentation - mirai-compact.html

## Overview
This document catalogs all inline SVG graphics in mirai-compact.html. SVGs are embedded directly in HTML as `<svg>` elements with `viewBox` attributes. Most are either pixel art mascots (32×32) or map layers. All SVGs use `shape-rendering="crispEdges"` or `image-rendering: pixelated` for pixel-art aesthetics.

---

## MASCOT SPRITES (Pixel Art)

Mascots follow a Gen 3 Pokémon-inspired philosophy: cute → awkward teen → powerful final form.

### DEVICES TRACK (Blue - #6DB5F5)

#### 1. Volt (Stage 1) — Track Card Face-Down
**Location**: Line ~2691 (`.track.devices .track-face-down .track-mascot svg`)
**Dimensions**: 32×32 pixels
**Character**: Tiny round robot
- All head with huge LED eyes
- One bent antenna
- Nub arms
- Round body

**Structure**:
- `<g id="volt-stage1">` container
- Multiple `<g>` groups by color:
  - `<g id="volt-body-1">` — Main body segments (blue #6DB5F5)
  - `<g id="volt-eyes-1">` — LED eyes (yellow/white)
  - `<g id="volt-antenna-1">` — Antenna (gray/blue)
  - `<g id="volt-arms-1">` — Tiny arms (gray)
- Each group contains horizontal-run-length-merged `<rect>` elements
- Attributes: `shape-rendering="crispEdges"`, `fill="#color"`

**Color Palette**:
- Body: #6DB5F5 (bright blue)
- Eyes: #FFFF00 (yellow) / #FFFFFF (white)
- Antenna: #9DAFCC (light gray-blue)
- Arms: #7A7A7A (gray)

#### 2. Volt (Stage 1) — Track Card Face-Up
**Location**: Line ~2708 (`.track.devices .track-face-up .track-mascot svg`)
**Identical to above** (same SVG, used in face-up state)

#### 3. Voltaic (Stage 2)
**Location**: Line ~3489 (`.evo-line.devices .evo-stage[data-stage="2"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Lanky hunched teen robot
- Skeletal/skull-like head with slit eyes
- Wire-frame arms (long and spindly)
- Mismatched antennae (one straight, one bent)
- Crouched posture
- More angular than Volt

**Color Palette**:
- Head: #4A5A7A (dark blue-gray)
- Eyes: #00FF00 (neon green)
- Body: #5A7ABB (medium blue)
- Antennae: #9DAFCC (light gray-blue) + #FF9900 (orange accent)
- Arms: #7A7A7A (gray)

#### 4. Voltron (Stage 3 - Final Form)
**Location**: Line ~3492 (`.evo-line.devices .evo-stage[data-stage="3"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Wide armored powerhouse
- Visor slit (horizontal line across face)
- Swept-back fin/antenna elements
- Digitigrade (beast-like) legs
- Armored torso
- Powerful stance

**Color Palette**:
- Armor: #0066FF (deep blue) + #6DB5F5 (bright blue)
- Visor: #00FF00 (neon green)
- Accent stripes: #FF6B92 (pink) / #FFFF00 (yellow)
- Legs: #4A5A7A (dark gray-blue)

---

### THERAPIES TRACK (Yellow - #F5D34F)

#### 5. Helix (Stage 1) — Track Card Face-Down
**Location**: Line ~2735 (`.track.therapies .track-face-down .track-mascot svg`)
**Dimensions**: 32×32 pixels
**Character**: Derpy blob axolotl
- Mostly head
- Droopy gill nub protrusions
- Jelly-like body
- Wide mouth/grin
- Vacant expression

**Color Palette**:
- Body: #F5D34F (bright yellow)
- Gills: #FFE680 (pale yellow)
- Eyes: #4A4A4A (dark gray) / #FFFFFF (white)
- Mouth: #E6A700 (dark gold)
- Outline/details: #7A6A1A (dark olive)

#### 6. Helix (Stage 1) — Track Card Face-Up
**Location**: Line ~2752 (`.track.therapies .track-face-up .track-mascot svg`)
**Identical to above**

#### 7. Helion (Stage 2)
**Location**: Line ~3500 (`.evo-line.therapies .evo-stage[data-stage="2"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Serpentine eel creature
- Wedge-shaped head (more defined than blob)
- Wild spiny frills (multiple fins)
- Spindly legs (multiple pairs)
- Elongated body
- Menacing but still cute

**Color Palette**:
- Body: #F5D34F (yellow) + #FFE680 (pale yellow)
- Frills: #FF9900 (orange)
- Eyes: #4A4A4A (dark gray) with #FFFFFF (white)
- Legs: #7A6A1A (dark olive)
- Spines: #FF6B92 (pink accent)

#### 8. Helios (Stage 3 - Final Form)
**Location**: Line ~3503 (`.evo-line.therapies .evo-stage[data-stage="3"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Radiant light-bulb sun form
- Dome-shaped head (bulb-like)
- Golden ray crown (radiating spikes)
- Glowing core appearance
- Levitating/ethereal posture
- Benevolent presence

**Color Palette**:
- Core: #FFFF00 (bright yellow)
- Dome: #F5D34F (pale yellow)
- Rays: #FF9900 (orange) + #FFE680 (pale yellow)
- Glow accent: #FFFFFF (white)
- Shadow/detail: #E6A700 (dark gold)

---

### BUILDER TRACK (Red - #F56B6B)

#### 9. Ember (Stage 1) — Track Card Face-Down
**Location**: Line ~2779 (`.track.builder .track-face-down .track-mascot svg`)
**Dimensions**: 32×32 pixels
**Character**: Tiny teardrop flame with face
- Round nervous eyes
- Nub arms (tiny)
- Teardrop/comma-shaped body
- Flickering tail suggestion
- Anxious expression

**Color Palette**:
- Flame: #F56B6B (bright red)
- Core: #FF9900 (orange-red)
- Eyes: #4A4A4A (dark gray) / #FFFFFF (white)
- Highlight: #FFFF00 (yellow)
- Outline: #7A1A1A (dark red)

#### 10. Ember (Stage 1) — Track Card Face-Up
**Location**: Line ~2796 (`.track.builder .track-face-up .track-mascot svg`)
**Identical to above**

#### 11. Kindling (Stage 2)
**Location**: Line ~3509 (`.evo-line.builder .evo-stage[data-stage="2"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Spiky punk flame teen
- Mohawk spikes (multiple points)
- Claw hands (angular)
- One-shoulder cape (rebellious)
- Orbiting sparks (motion lines)
- Aggressive posture

**Color Palette**:
- Flame: #F56B6B (bright red)
- Highlights: #FF9900 (orange) + #FFFF00 (yellow)
- Spikes/Mohawk: #FF6B92 (pink accent)
- Cape: #4A1818 (dark burgundy)
- Sparks: #FFFF00 (yellow)
- Eyes: #4A4A4A (dark gray)

#### 12. Inferno (Stage 3 - Final Form)
**Location**: Line ~3512 (`.evo-line.builder .evo-stage[data-stage="3"] svg`)
**Dimensions**: 32×32 pixels
**Character**: Broad flame king
- Arms crossed (confident)
- Fire crown (elaborate rays)
- Pillar legs (wide base)
- Network/circuit pattern cloak (tech-infused)
- Regal bearing

**Color Palette**:
- Flame: #F56B6B (bright red)
- Core: #FF9900 (orange)
- Crown rays: #FFFF00 (bright yellow) + #FF6B92 (pink)
- Cloak: #2A1818 (very dark red) with #FF6B92 (circuit pattern)
- Eyes: #FFFFFF (white) on dark background
- Shadow/details: #7A1A1A (dark red)

---

## MAP LAYER SVGs

Located in `.iso-map-canvas` (Kobe/Port Island section).

### 13. Water Layer
**Location**: Line ~3107 (`.kobe-layer-water svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Background water with subtle caustic lighting

**Elements**:
- Solid dark background: `<rect width="400" height="540" fill="#080c14"/>`
- Water pattern grid (horizontal lines at 50px intervals, opacity 0.12)
- Elliptical water glows (radial gradients for light caustics)
- Caustic light patterns (ellipses with low opacity)
- Gradient defs: `#waterGlow1` (blue to transparent)

**Visual Effect**: Dark water with subtle ripple suggestions and bioluminescent glow spots.

### 14. Mainland/Kobe Silhouette
**Location**: Line ~3142 (`.kobe-layer-mainland svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Kobe mainland silhouette and Rokko Island outline

**Elements**:
- Main silhouette path (M0,0 L220,0 ... Z) — filled #10111c (dark)
- Stroke outline with low opacity
- Secondary depth path (lighter shade #0c0d16)
- Rokko Island block (rectangle path)
- Minimal detail for abstract aesthetic

**Visual Effect**: Simple silhouette suggesting Kobe cityscape without detail.

### 15. Port Island & Airport Island
**Location**: Line ~3188 (`.kobe-layer-island svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Isometric-style Port Island with glow and grid patterns

**Major Elements**:
- Main island shape path (complex M/L/Z path defining Port Island outline)
  - Filled with `url(#islandGrad)` (linear gradient from #1a1c2e to #201a2c)
  - Stroke with low pink opacity (rgba(245,160,181,0.1))
- Island shadow filter: `<filter id="islandShadow">` (feDropShadow)
- KBIC glow overlay path (matches island outline, filled with `url(#kbicGlow)`)
- Building footprints (small rectangles representing structures)
- Port Liner shuttle animated paths (animateMotion circles)

**Animated Elements**:
- Two `.port-liner-dot` circles (3px radius, #FF6B92 fill)
- First dot: 8s animation cycle, full opacity
- Second dot: 8s animation, starts 4s earlier, 0.5 opacity (ghost trail)
- Path: Curved route from Rokko→Port Island→Airport Island

**Gradient Definitions**:
- `#islandGrad` — Vertical linear gradient (top to bottom, darker→slightly lighter)
- `#kbicGlow` — Radial glow in center (transparent→pink→transparent)

**Visual Effect**: Futuristic isometric representation of Port Island with animated shuttle traffic.

### 16. Street Grid
**Location**: Line ~3265 (`.kobe-layer-grid svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Subtle street/grid overlay

**Elements**:
- 12 `<line>` elements (vertical and horizontal)
- Stroke color: rgba(245,160,181,0.03) to rgba(245,160,181,0.04) (very low opacity pink)
- Stroke width: 0.4 to 0.5px (minimal visibility)
- Suggests urban grid without dominating visual

**Visual Effect**: Barely-perceptible grid overlay for depth.

### 17. Ambient Buildings (Non-Interactive)
**Location**: Line ~3293 (`.kobe-layer-buildings svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Background buildings (non-clickable)

**Elements**:
- ~20 `<rect>` elements (building footprints)
  - Sizes: 14–28px wide, 10–25px tall
  - Fill colors: #1e1e32 (lighter) to #252540 (darker)
  - Opacity: 0.5 to 0.9 (creating depth)
  - rx="1" (subtle corner rounding)
- ~2 `<ellipse>` elements (trees/vegetation)
  - Fill: #142018 (dark green)
  - Low opacity (~0.4) for background

**Visual Effect**: Layered building depths without interactive focus.

### 18. Coastline Glow
**Location**: Line ~3330 (`.kobe-layer-glow svg`)
**Dimensions**: 400×540 (SVG viewBox)
**Purpose**: Animated glowing coastline

**Elements**:
- Single `.coast-glow` path (traces island outline)
- Stroke: `url(#coastGlowGrad)` (linear gradient: pink→blue→purple)
- Stroke width: 2px
- Stroke dasharray: "8 4" (dashed line pattern)
- Opacity: 0.6 (semi-transparent)
- Stroke linecap: "round" (smooth caps)

**Gradient Definition**:
- `#coastGlowGrad` — Linear gradient (multiple stops: #FFB8CC→#B8E3FF→#D4B8FF)

**Visual Effect**: Glowing perimeter around island suggesting energy/boundary.

---

## ISOMETRIC BUILDING ELEMENTS

### Ambient Buildings (Div-Based, Not SVG)
**Location**: Lines ~3368-3430 (`.iso-ambient` divs with isometric cube structure)
**Type**: CSS-based isometric cubes (not inline SVG)
**Dimensions**: Variable (4–10px width, 3–7px height)

**Structure** (repeated for each building):
```html
<div class="iso-ambient amb-cool" style="--h:6px;width:8px;height:5px;top:19.3%;left:34%">
  <div class="iso-building-top"></div>
  <div class="iso-building-front"></div>
  <div class="iso-building-left"></div>
</div>
```

**Notes**:
- `--h` CSS variable sets building height for 3D effect
- 3 div faces: top (roof), front (face), left (side)
- CSS renders isometric projection (transforms + colors)
- Color classes: `amb-cool`, `amb-warm`, `amb-bright` (optional, for tinting)
- Positioned via percentage-based top/left (relative to viewBox 400×540 → 100vw×100vh)

---

## INTERACTIVE BUILDING ELEMENTS

### Interactive Buildings (Clickable Info Cards)
**Location**: Lines ~3432+ (`.iso-building` divs scattered throughout canvas)
**Type**: Div-based isometric cubes with data attributes
**Dimensions**: Similar to ambient (4–10px)

**Structure**:
```html
<div class="iso-building amb-warm" style="..."
     data-title="KBIC Central"
     data-cat="Venue"
     data-text="Innovation hub & coworking nexus."
     data-s1v="1000+" data-s1l="Members"
     data-s2v="250k sqm" data-s2l="Space"
     data-s3v="24/7" data-s3l="Access">
  <div class="iso-building-top"></div>
  <div class="iso-building-front"></div>
  <div class="iso-building-left"></div>
</div>
```

**Data Attributes**:
- `data-title` — Location/building name
- `data-cat` — Category (Venue, Stay, Transit, Lifestyle, Food, Active)
- `data-text` — Description text
- `data-s1v`, `data-s1l` — Stat 1 (value, label)
- `data-s2v`, `data-s2l` — Stat 2
- `data-s3v`, `data-s3l` — Stat 3

**Click Behavior**:
- Triggers `openBuilding()` function (if not dragged)
- Creates inline `.iso-info-card` dynamically
- Positioned relative to building location
- Contains header, description, stats, scan line animation

**Color Categories** (category → RGB + accent color):
- `Venue` — #FF6B92 (pink)
- `Stay` — #D4B8FF (purple)
- `Transit` — #B8E3FF (cyan)
- `Lifestyle` — #E8C97D (gold)
- `Food` — #FF8C69 (orange)
- `Active` — #82DCBE (teal)

---

## EVOLUTION ARROWS

### Stage Connectors
**Location**: Lines between `.evo-stage` elements in `.evo-line`
**Type**: Simple SVG arrows
**Dimensions**: Variable (typically 30–50px wide, 10–20px tall)

**Structure**:
```html
<svg viewBox="0 0 40 20" class="evo-arrow">
  <path d="M0,10 L30,10 M25,5 L30,10 L25,15" stroke="currentColor" fill="none"/>
</svg>
```

**Properties**:
- Stroke color: Inherits from parent `.evo-line` color (via CSS variable or class)
- Animated reveal: `.evo-arrow.visible` (fade-in)
- Staggered with stages (appears after each stage completes pop animation)

---

## NAVIGATION & UI ICONS

### Sound Toggle Button
**Location**: Line ~2625 (`#soundToggle .sound-bars svg`)
**Type**: Three bar indicator (no actual SVG, CSS-based)
**Dimensions**: 12×8px visual

**Note**: The icon is actually CSS divs styled to look like sound bars, not SVG.

---

## SUMMARY TABLE

| # | Name | Location | Type | Size | Purpose |
|-|------|----------|------|------|---------|
| 1-4 | Volt (2x) + Voltaic + Voltron | Lines ~2691, 2708, 3489, 3492 | Mascot sprites | 32×32 | Devices track evolution |
| 5-8 | Helix (2x) + Helion + Helios | Lines ~2735, 2752, 3500, 3503 | Mascot sprites | 32×32 | Therapies track evolution |
| 9-12 | Ember (2x) + Kindling + Inferno | Lines ~2779, 2796, 3509, 3512 | Mascot sprites | 32×32 | Builder track evolution |
| 13 | Water Layer | Line ~3107 | Map layer | 400×540 | Caustic background |
| 14 | Mainland/Kobe | Line ~3142 | Map layer | 400×540 | City silhouette |
| 15 | Port Island | Line ~3188 | Map layer + animated | 400×540 | Interactive island + shuttle |
| 16 | Grid Overlay | Line ~3265 | Map layer | 400×540 | Street grid pattern |
| 17 | Buildings (ambient) | Line ~3293 | Map layer | 400×540 | Background structures |
| 18 | Coastline Glow | Line ~3330 | Map layer | 400×540 | Animated perimeter |
| 19 | Ambient Cubes | Lines ~3368+ | Building elements | Variable | Background isometric buildings |
| 20 | Interactive Cubes | Lines ~3432+ | Building elements | Variable | Clickable info card sources |
| 21 | Evolution Arrows | Between stages | UI element | Variable | Stage connectors |

---

## Color Palette Reference

### Track Colors
- **Devices**: #6DB5F5 (blue)
- **Therapies**: #F5D34F (yellow)
- **Builder**: #F56B6B (red)

### Category Colors (Map)
- **Venue**: #FF6B92 (pink)
- **Stay**: #D4B8FF (purple)
- **Transit**: #B8E3FF (cyan)
- **Lifestyle**: #E8C97D (gold)
- **Food**: #FF8C69 (orange)
- **Active**: #82DCBE (teal)

### Pixel Art Palette
- Bright Yellow: #FFFF00
- Bright Green: #00FF00
- Dark Blue: #0066FF
- Orange: #FF9900
- Pink Accent: #FF6B92
- White: #FFFFFF
- Dark Gray: #4A4A4A / #7A7A7A
- Very Dark: #080c14 / #0c0d16 / #1a1c2e

---

## Technical Notes for React Migration

### Mascot Sprites
- Can be extracted to separate SVG files (one per sprite)
- Props: `stage` (1–3), `track` (devices/therapies/builder)
- Component should render appropriate sprite based on props
- Example: `<MascotSprite track="devices" stage={2} />`

### Map Layers
- Each layer can be a separate component (`<WaterLayer />`, `<IslandLayer />`, etc.)
- SVG viewBox="400 540" should be responsive (aspect ratio preserved)
- Layer parallax handled by CSS transform props

### Interactive Buildings
- Building data can move to a data structure/JSON file
- Map building creation can be data-driven (`.map(building => <InteractiveBuilding {...building} />)`)
- Info card overlay can be a modal component

### Sprite Sheet Optimization
- Consider consolidating 12 mascot sprites into a single sprite sheet
- Use background-position to display individual frames
- Reduces HTTP requests (one file instead of 12 inline SVGs)

### Performance
- Lazy-load SVG content if page is very long
- Consider canvas-based rendering for very large maps
- Use React.memo for static SVG components

---

## Animation States

### Mascot Sprites
- `.card-visible` — Entrance animation (staggered pop)
- `.visible` — Evolution stage reveal (pop animation)

### Map Layers
- Entrance delay: 0–700ms stagger on scroll into view
- Parallax: Mouse-based depth effect (transform per frame)
- Animated shuttle: `animateMotion` (8s cycle, continuous)

### Coastline Glow
- Continuously animated (dashed stroke pattern)
- Considered as a pure CSS animation in new design

### Interactive Building Info Card
- `.active` — Fade-in and position animation (300ms)
- Scan line animation (1.2s duration, auto-removes)
- Close: Fade-out, remove from DOM (300ms delay)

---

## Notes

1. **Pixel Art Rendering**: All mascots use `shape-rendering="crispEdges"` for pixelated appearance
2. **Performance**: SVGs are embedded inline (no external requests), but could be extracted for caching
3. **Accessibility**: SVGs lack `<title>` or `<desc>` tags; consider adding for alt text
4. **Responsiveness**: Map SVGs use viewBox but dimensions are fixed; consider making responsive
5. **Animation**: Some animations handled by SVG `<animate>` elements; others by CSS
6. **Size**: Pixel art sprites are small (32×32) to minimize file size
7. **Colors**: All colors are hardcoded; consider CSS variables for theming
