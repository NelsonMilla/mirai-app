# Mirai Compact HTML — Extraction Documentation

This folder contains comprehensive extracted documentation from `mirai-compact.html` for use in the Next.js/React migration.

## Files

### 1. `html-structure.md`
Complete HTML structure documentation covering:
- Body root and layout
- All 7 main "Moments" (sections) with detailed element breakdown
- Hero section (parallax kanji, particle canvas, split text)
- Starter cards (track selection, state propagation)
- Timeline section (scroll-driven progress)
- Kobe/Port Island section (lifestyle cards, isometric map)
- Apply section (evolution showcase, FAQ accordion)
- Additional sections (loader, nav, post-credits)
- Key IDs and CSS classes reference
- Interactive elements and click handlers
- Data attributes used throughout

**Use for**: Building React components with accurate HTML hierarchy, understanding section flow, mapping state management requirements.

### 2. `js-systems.md`
Complete JavaScript systems documentation covering:
- Global state object (`Mirai`) with scroll tracking
- Unified scroll dispatch loop (60fps rAF)
- IntersectionObserver patterns (scroll reveal, staggered entrance)
- Terminal typewriter effect (line-by-line reveal timing)
- Isometric map system (dragging, momentum, parallax, info cards)
- Starter card selection (propagating to banner, companion, evolution)
- Evolution showcase (staggered sprite animation)
- FAQ accordion (single-open state)
- Custom cursor with particle trails
- Page loader (fonts + dramatic pause)
- Canvas grain (optimized noise texture)
- Hero bioluminescent particles (mouse-responsive)
- Kinetic typography (split text animation)
- Scroll-reactive color atmosphere
- Cursor particle system (section-aware colors, DOM pooling)
- **Comprehensive sound design system** (6-layer Hans Zimmer-inspired ambient)
  - Heartbeat sub-pulse, pad drones, rising fifth motif, time ticks, shimmer, breath noise
  - UI sounds (ping, thud, select, flip, hover)
  - Scroll-reactive mixing and intensity
  - Auto-start on user gesture, toggle control
- Fighter/roster interaction (selector, count-up, detail panel)
- Post-credits easter egg (countdown timer, stars, mascot)

**Use for**: Understanding event handlers, animation loops, state management patterns, audio architecture, IntersectionObserver patterns. Maps directly to React hooks and custom hooks.

### 3. `inline-svgs.md`
Complete inline SVG documentation covering:
- **12 mascot sprites** (32×32 pixel art)
  - Volt / Voltaic / Voltron (Devices track, blue)
  - Helix / Helion / Helios (Therapies track, yellow)
  - Ember / Kindling / Inferno (Builder track, red)
  - Detailed description of each form (design philosophy, colors, anatomy)
- **6 map layers** (SVGs for isometric Kobe/Port Island)
  - Water, mainland, island, grid, buildings, coastline glow
  - Animated port shuttle with dual-dot parallax effect
- **Interactive building elements** (clickable info cards)
  - Data structure for building info (title, category, stats)
  - Color categories (Venue, Stay, Transit, Lifestyle, Food, Active)
- **Isometric cube rendering** (both ambient and interactive)
- **Evolution arrows** (stage connectors)
- Color palette reference (track colors, category colors, pixel art palette)
- Technical notes for React migration (sprite sheets, lazy-loading, performance optimization)
- Animation states for all SVG elements

**Use for**: Building SVG components, understanding sprite design language, creating responsive map visualizations, optimization strategies.

## File Locations in mirai-compact.html

### CSS
- Lines 1–~2600: All styling (1200+ lines)
- Structure: Color tokens, typography, component styles, animations, responsive breakpoints

### HTML Body
- Lines ~2600–3595: Page structure (7 moments, sections, interactive elements)
- Contains 3 inline mascot sprites (face-down/face-up pairs)
- Contains 6 map layer SVGs
- Contains 10+ interactive building SVG elements
- Embedded base64 images for lifestyle TCG cards

### JavaScript
- Lines ~3595–5418: All interactivity (1800+ lines)
- 18+ distinct systems (scroll, particles, sound, map, etc.)
- No external dependencies (pure vanilla JS)

## Key Statistics

### Moments (Sections)
| # | Name | Purpose |
|---|------|---------|
| 1 | Hero | Full-screen title with parallax kanji |
| 2 | Starter Cards | 3-way track selection |
| 3 | Timeline | 4-week program overview |
| 4 | Runway | Fashion show callout |
| 5A | Kobe Info | Port Island info + lifestyle cards |
| 5B | Playground | Interactive isometric map |
| 6 | Proof | Speaker roster + count-up |
| 7 | Apply | Evolution showcase + FAQ + CTA |
| + | Post-Credits | Countdown to Oct 1, 2026 |

### Interactive Systems
- Track selection (3-way radio button with state propagation)
- Isometric map (draggable, clickable buildings, parallax layers)
- Lifestyle card overlay (full-screen 3D flip + info panel)
- Terminal typewriter (line-by-line reveal with timing)
- Roster fighter selector (grid + detail panel + count-up animation)
- FAQ accordion (single-open state)
- Evolution showcase (staggered sprite reveal)
- Sound design (6 ambient layers + 5 UI sound effects + scroll-reactive mixing)

### Animation Systems
- Scroll reveal (IntersectionObserver + CSS transitions)
- Parallax (hero kanji, runway block, map layers, particles)
- Staggered entrance (cards, buildings, evolution sprites, roster)
- Kinetic typography (character-by-character reveal with delay)
- Particle effects (hero bioluminescence, cursor trails)
- Canvas grain (optimized to 1/4 resolution, 12fps)
- Color atmosphere (6 scroll-reactive zones)

### Canvas Elements
- Hero particles (mouse-responsive bioluminescent effect)
- Grain texture (noise overlay)
- Potential for particle effect optimization

## Migration Strategy

### Phase 1: Structure (React Components)
1. Create components for each Moment section
2. Build reusable component patterns (cards, buttons, inputs)
3. Map data structures (track info, fighters, buildings)
4. Implement basic layout and responsive grid

### Phase 2: Interactivity (React Hooks)
1. Convert scroll listener to custom `useScroll()` hook
2. Build state management for track selection, fighter selection
3. Implement IntersectionObserver patterns via `useIntersectionObserver()` hook
4. Convert click handlers to event props

### Phase 3: Animation (Framer Motion / CSS)
1. Replace CSS transitions with Framer Motion variants
2. Convert rAF loops to `useAnimationFrame()` custom hook
3. Stagger animations via `staggerContainer` + `item` pattern
4. Optimize canvas elements (consider Three.js for complex effects)

### Phase 4: Sound Design
1. Extract audio code to custom `useSound()` hook
2. Create AudioContext wrapper component
3. Implement scroll-reactive audio mixing
4. Add UI sound effect triggers

### Phase 5: SVGs & Images
1. Extract mascot sprites to separate SVG files
2. Create responsive SVG components with `<svg>` or `<Image>`
3. Consider sprite sheet optimization
4. Handle base64 image conversion/optimization

## Key Patterns for React

### State Management
- **Track Selection**: Use React Context or Zustand
- **Scroll Progress**: Custom hook with rAF + resize listener
- **Sound Enabled**: Toggle state, persisted to localStorage
- **Fighter Selected**: Simple useState per component
- **Map Interaction**: Local state for drag/pan/card visibility

### Custom Hooks
```javascript
useScroll() // Returns normalized 0-1 scroll progress
useIntersectionObserver(element, options) // Trigger animations on scroll
useAnimationFrame(callback) // rAF loop with cleanup
useSound() // Audio context wrapper
useDragGesture() // Map drag + momentum
useKeyPress(key) // Escape key handling
```

### Component Structure
```
<MiraiApp>
  <PageLoader />
  <Navigation />
  <SectionHero />
  <SectionTracks />
  <SectionMonth />
  <SectionRunway />
  <SectionKobe />
    <LifecycleCardOverlay />
    <IsometricMap>
      <MapBuilding /> (multiple)
      <BuildingInfoCard />
    </IsometricMap>
  <SectionProof />
    <RosterGrid />
    <FighterPanel />
  <SectionApply />
    <EvolutionShowcase />
    <FaqAccordion />
  <PostCredits />
  <ColorAtmosphere />
  <GrainCanvas />
  <CustomCursor />
</MiraiApp>
```

## Performance Notes

### Current Optimizations
- Grain canvas: 1/4 resolution, 12fps throttle
- Hero particles: Reduced count on mobile, paused when off-screen
- Cursor particles: DOM pooling (30 reusable elements), every 4 frames
- Sound audio: Throttled to 10Hz for parameter updates
- All pauses when tab is hidden

### Potential Improvements
- Lazy-load sections below fold
- Use intersection observers to pause animations off-screen
- Consider canvas or WebGL for complex particle systems
- Optimize image sizes (base64 lifecycle cards)
- Use CSS containment for performant scrolling

## Responsive Design

### Breakpoints (Current CSS)
- **980px**: Track grid single-column, timeline vertical, lifestyle 2 columns
- **640px**: Nav links hidden, reduced padding, lifestyle 3:4 aspect

### Considerations for React
- Use CSS media queries or Tailwind responsive classes
- Consider mobile-specific components (simplify complex sections)
- Test performance on low-end mobile devices
- Reduce animation complexity on mobile (respect prefers-reduced-motion)

## Files Ready for React Components

Based on this extraction, the following can be directly converted to React components:

1. **SVG Sprites** → `<MascotSprite />` components with stage/track props
2. **Map Layers** → `<MapLayer />` components (water, mainland, island, etc.)
3. **Track Cards** → `<TrackCard />` component with selection handler
4. **Lifestyle Cards** → `<LifestyleCard />` with overlay modal
5. **Building Info Card** → `<BuildingInfoCard />` modal
6. **Evolution Line** → `<EvolutionLine />` with staggered animation
7. **FAQ Item** → `<FaqItem />` accordion pattern
8. **Roster Slot** → `<RosterSlot />` clickable selector
9. **Fighter Panel** → `<FighterPanel />` detail view

## Next Steps

1. Copy this extraction folder into your Next.js project
2. Use `html-structure.md` as reference while building components
3. Use `js-systems.md` to understand state and event flow
4. Use `inline-svgs.md` to guide SVG asset creation
5. Build a component library incrementally (bottom-up or top-down)
6. Integrate scroll/animation systems via custom hooks
7. Test interactions and animations against original

---

**Created**: April 2026  
**Source**: mirai-compact.html (~370KB, ~5418 lines)  
**Extraction Scope**: Complete HTML structure, all JS systems, all inline SVGs
