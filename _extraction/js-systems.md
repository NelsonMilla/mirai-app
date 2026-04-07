# JavaScript Systems Documentation - mirai-compact.html

## Overview
All JavaScript is contained in a single `<script>` block (~1800 lines) at the end of the HTML body. The code is organized into self-executing IIFE modules, each handling a specific system. Below is a comprehensive breakdown of every interactive system, event handler, animation loop, and state management mechanism.

---

## 1. GLOBAL STATE OBJECT: `Mirai`

**Lines**: ~3600-3609

```javascript
const Mirai = {
  scroll: 0,        // lerped (smooth) scroll position
  scrollTarget: 0,  // actual scroll position
  scrollProgress: 0, // 0-1 normalized
  velocity: 0,
  isScrolling: false,
  raf: null,
  lerp(a, b, t) { return a + (b - a) * t; },
  clamp(v, min, max) { return Math.min(Math.max(v, min), max); },
};
```

**Purpose**: Central state object for scroll tracking and animation interpolation.

**Key Properties**:
- `scroll` — Smooth interpolated scroll value (used by all scroll-linked effects)
- `scrollTarget` — Actual window.scrollY value
- `scrollProgress` — Normalized 0-1 value (scroll/total scrollable height)
- `velocity` — Difference between current and previous scroll (frame-to-frame)
- `isScrolling` — Boolean indicating if user is actively scrolling
- `raf` — RequestAnimationFrame ID for the scroll loop

**Methods**:
- `lerp(a, b, t)` — Linear interpolation (easing)
- `clamp(v, min, max)` — Constrain value between bounds

**Usage**: All scroll-driven effects (parallax, progress bar, color shifts) read from `Mirai.scroll` instead of raw `window.scrollY` for smooth interpolation.

---

## 2. UNIFIED SCROLL DISPATCH & PROGRESS LOOP

**Lines**: ~3611-3691

### Purpose
Manages all scroll-linked effects in one rAF loop for performance. Native CSS scroll-snap handles section snapping; JS just tracks position.

### `updateScrollSystems()` Function
Called 60 fps via requestAnimationFrame.

#### 1. Scroll Progress Bar (`#progressFill`)
```javascript
if (pf) pf.style.width = (Mirai.scrollProgress * 100) + '%';
```
- Updates width of progress bar to reflect scroll progress (0-100%)

#### 2. Parallax Hero Kanji (`#heroKanji`)
```javascript
if (hk && Mirai.scroll < window.innerHeight * 1.5) {
  hk.style.transform = `translate(-50%, calc(-55% + ${Mirai.scroll * 0.2}px))`;
}
```
- Moves kanji down as user scrolls (multiplier 0.2 creates parallax depth)
- Stops updating after 1.5x viewport height to save performance

#### 3. Scroll-Driven Timeline Weeks
```javascript
if (timelineEl) {
  const rect = timelineEl.getBoundingClientRect();
  const viewH = window.innerHeight;
  const progress = Mirai.clamp(1 - (rect.top / (viewH * 0.65)), 0, 1);
  const activeCount = Math.ceil(progress * tlWeeks.length);
  tlWeeks.forEach((w, i) => {
    w.classList.toggle('tl-active', i < activeCount);
  });
  if (timelineProgress) {
    timelineProgress.style.width = (progress * 100) + '%';
  }
}
```
- Calculates when timeline enters viewport
- Progressively activates weeks (adds `.tl-active` class)
- Fills progress bar width

#### 4. Runway Block Parallax
```javascript
if (runwayBlock) {
  const rect = runwayBlock.getBoundingClientRect();
  const viewH = window.innerHeight;
  if (rect.top < viewH && rect.bottom > 0) {
    const parallax = ((rect.top / viewH) - 0.5) * 30;
    runwayBlock.style.transform = `translateY(${parallax}px)`;
  }
}
```
- Subtle 30px vertical parallax on runway block as it passes through viewport

#### 5. Velocity-Based Skew
```javascript
if (Math.abs(Mirai.velocity) > 1) {
  document.body.style.setProperty('--scroll-skew', (Mirai.velocity * 0.015) + 'deg');
}
```
- Sets CSS custom property for scroll-velocity-based skew effect (unused in CSS, available for enhancement)

### Scroll Loop Initialization (IIFE)
**Lines**: ~3670-3691

```javascript
(function initScrollLoop() {
  const VELOCITY_THRESHOLD = 0.5;
  Mirai.scroll = window.scrollY;
  Mirai.scrollTarget = window.scrollY;

  function tick() {
    const prev = Mirai.scroll;
    Mirai.scroll = window.scrollY; // track current position
    Mirai.velocity = Mirai.scroll - prev;
    Mirai.isScrolling = Math.abs(Mirai.velocity) > VELOCITY_THRESHOLD;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    Mirai.scrollProgress = h > 0 ? Mirai.clamp(Mirai.scroll / h, 0, 1) : 0;
    updateScrollSystems();
    Mirai.raf = requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
```

**Flow**:
1. Initialize Mirai scroll state
2. Every frame (60fps):
   - Calculate velocity (delta scroll per frame)
   - Determine if actively scrolling (velocity > 0.5)
   - Normalize scroll to 0-1 progress
   - Call `updateScrollSystems()` to update all scroll-linked visuals

---

## 3. SCROLL REVEAL & INTERSECTION OBSERVERS

**Lines**: ~3693-3697

### Basic Reveal for Sections
```javascript
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .reveal-clip, .reveal-scale').forEach(el => io.observe(el));
```

**Purpose**: Fade-in sections as they scroll into view.

**Config**:
- `threshold: 0.1` — Triggers when 10% of element is visible
- `rootMargin: '0px 0px -80px 0px'` — Triggers 80px before element fully enters
- Adds `.in` class and unobserves (one-time effect)

---

## 4. TERMINAL: LINE-BY-LINE REVEAL

**Lines**: ~3699-3756

### Purpose
Typewriter effect for regulatory timeline terminal (Japan vs US deployment paths).

### IIFE: `initTerminal()`

**Key Elements**:
- `#termWindow` — Terminal container
- `.term-line` — Each line of terminal text
- `.term-sep` — Separator line between JP and US blocks
- `.term-err` — Error line (^C KeyboardInterrupt)

**Timing Logic**:
```javascript
let delay = 0;
const sepIndex = Array.from(lines).findIndex(l => l.querySelector('.term-sep'));
const errIndex = Array.from(lines).findIndex(l => l.querySelector('.term-err'));

lines.forEach((line, i) => {
  // JP block: fast (90ms apart, or 40ms for blank lines)
  if (i < sepIndex) {
    delay += (line.classList.contains('tl-blank')) ? 40 : 90;
  }
  // Separator: dramatic pause (500ms)
  else if (i === sepIndex) {
    delay += 500;
  }
  // US block: slower (160ms apart, or 60ms for blank lines)
  else if (i < errIndex) {
    delay += (line.classList.contains('tl-blank')) ? 60 : 160;
  }
  // ^C and comment: dramatic pause
  else {
    delay += (i === errIndex) ? 800 : 400;
  }

  const d = delay;
  setTimeout(() => {
    line.classList.add('tl-vis');
    // Move cursor to this line
    lines.forEach(l => l.classList.remove('term-cursor'));
    line.classList.add('term-cursor');
  }, d);
});
```

**Effect**:
- JP lines appear fast (building up solution)
- Pause at separator
- US lines appear slow (building dread about timeline)
- Error and comment appear with dramatic delays
- Blinking cursor follows visible lines

**Trigger**:
- IntersectionObserver on `#termWindow` (threshold 0.3)
- Fires once, unobserves
- Cursor removed 2s after all lines visible

---

## 5. ISOMETRIC MAP SYSTEM

**Lines**: ~3758-4052

### IIFE: `initIsometricMap()`

**Scope**: Interactive map with draggable canvas, clickable buildings, parallax layers, and momentum scrolling.

### State Variables
```javascript
let currentCard = null;           // Currently open info card
let isDragging = false;           // Mouse/touch drag state
let hasDragged = false;           // Flag to distinguish click vs drag
let dragStartX = 0, dragStartY = 0; // Initial cursor position
let offsetX = 0, offsetY = 0;     // Current pan offset
let velocityX = 0, velocityY = 0; // Drag velocity for momentum
```

### Core Functions

#### `updateCanvasTransform()`
```javascript
function updateCanvasTransform() {
  canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}
```
Updates the `#isoMapCanvas` position (translate-based panning).

#### `openBuilding(building)`
**Lines**: ~3797-3867

Creates and positions an inline info card for clicked building.

**Steps**:
1. Close any existing card
2. Read building data from `dataset` (title, category, stats)
3. Create `.iso-info-card` DOM element dynamically:
   - Header (title + category + close button)
   - Text description
   - 3 stat rows (value + label)
4. Set CSS variables for color theming based on category
5. Append to wrapper
6. Trigger rAF to add `.active` class (fade-in)
7. Position card relative to building (with bounds checking)
8. Add scan line animation (removed after 1.2s)
9. Add click handler to close button
10. Add `.active` to building element

**Position Logic**:
```javascript
let left = rect.left - wrapperRect.left + rect.width / 2 - 160;
let top = rect.top - wrapperRect.top - card.offsetHeight - 20;

if (left < 10) left = 10;
if (left + 320 > wrapperRect.width - 10) left = wrapperRect.width - 330;
if (top < 10) top = rect.top - wrapperRect.top + rect.height + 20;
```
Centers card above building, with fallback below if no space.

#### `closeCard()`
**Lines**: ~3869-3877

Removes active state and waits 300ms for animation before removing from DOM.

### Mouse Interaction

#### Building Click Handler
```javascript
buildings.forEach(building => {
  building.addEventListener('click', e => {
    if (hasDragged) return; // Ignore if user dragged
    e.stopPropagation();
    openBuilding(building);
  });
});
```

#### Drag Start (mousedown)
```javascript
wrapper.addEventListener('mousedown', e => {
  if (e.target.closest('.iso-info-card')) return; // Ignore card clicks
  isDragging = true;
  hasDragged = false;
  dragStartX = e.clientX - offsetX;
  dragStartY = e.clientY - offsetY;
  velocityX = 0;
  velocityY = 0;
  wrapper.style.cursor = 'grabbing';
});
```

#### Drag Move (mousemove on document)
```javascript
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX - offsetX;
  const dy = e.clientY - dragStartY - offsetY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
  offsetX = e.clientX - dragStartX;
  offsetY = e.clientY - dragStartY;
  velocityX = e.movementX;
  velocityY = e.movementY;
  updateCanvasTransform();
});
```

#### Drag End (mouseup)
```javascript
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  wrapper.style.cursor = '';
  // Momentum
  function applyMomentum() {
    if (Math.abs(velocityX) < 0.3 && Math.abs(velocityY) < 0.3) return;
    offsetX += velocityX;
    offsetY += velocityY;
    velocityX *= 0.92;  // Friction
    velocityY *= 0.92;
    updateCanvasTransform();
    requestAnimationFrame(applyMomentum);
  }
  applyMomentum();
});
```

**Momentum Algorithm**:
- Captures velocity at drag end
- Applies velocity each frame with 0.92 friction (decelerates over ~30 frames)
- Continues until velocity < 0.3

### Touch Support
**Lines**: ~3929-3971

Parallel implementation for touch events with nearly identical logic:
- `touchstart` — Set drag state + capture initial touch position
- `touchmove` — Update offset based on finger position + velocity
- `touchend` — Apply momentum

### Keyboard & Click Close
```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && currentCard) closeCard();
});

wrapper.addEventListener('click', e => {
  if (!hasDragged && (e.target === wrapper || e.target === canvas || e.target.closest('.kobe-layer')) && currentCard) closeCard();
});
```

### Parallax Depth (Mouse-Based)
**Lines**: ~3983-4018

**Purpose**: Each SVG layer moves differently based on mouse position (depth parallax).

**State**:
```javascript
let pTgtX = 0, pTgtY = 0, pCurX = 0, pCurY = 0;
```

**Mouse Tracking**:
```javascript
wrapper.addEventListener('mousemove', e => {
  if (isDragging) return;
  const rect = wrapper.getBoundingClientRect();
  pTgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  pTgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
});
wrapper.addEventListener('mouseleave', () => { pTgtX = 0; pTgtY = 0; });
```
Converts mouse position to -1 to +1 range (horizontal and vertical).

**Parallax Tick** (rAF loop):
```javascript
function parallaxTick() {
  if (parallaxEnabled && !document.hidden && !isDragging) {
    pCurX += (pTgtX - pCurX) * 0.04; // Smooth lerp
    pCurY += (pTgtY - pCurY) * 0.04;
    if (layers.water) layers.water.style.transform = `translate(${pCurX * -3}px, ${pCurY * -2}px)`;
    if (layers.mainland) layers.mainland.style.transform = `translate(${pCurX * -5}px, ${pCurY * -3}px)`;
    if (layers.island) layers.island.style.transform = `translate(${pCurX * -2}px, ${pCurY * -1}px)`;
    if (layers.glow) layers.glow.style.transform = `translate(${pCurX * -2}px, ${pCurY * -1}px)`;
  }
  requestAnimationFrame(parallaxTick);
}
```

**Parallax Amounts** (each layer moves differently):
- Water: -3px x, -2px y (furthest/background)
- Mainland: -5px x, -3px y (middle)
- Island: -2px x, -1px y (foreground)
- Glow: -2px x, -1px y (same as island)

### Entrance Animation
**Lines**: ~4020-4051

When isometric map scrolls into view, stagger reveals layers and buildings:

```javascript
const layerDelays = [
  ['.kobe-layer-water', 0],
  ['.kobe-layer-mainland', 200],
  ['.kobe-layer-island', 400],
  ['.kobe-layer-grid', 500],
  ['.kobe-layer-buildings', 600],
  ['.kobe-layer-glow', 700]
];
layerDelays.forEach(([sel, delay]) => {
  const el = canvas.querySelector(sel);
  if (el) { el.style.transitionDelay = delay + 'ms'; }
});
// Stagger ambient buildings
canvas.querySelectorAll('.iso-ambient').forEach((b, i) => {
  b.style.transitionDelay = (800 + i * 20) + 'ms';
});
// Stagger interactive buildings
buildings.forEach((b, i) => {
  b.style.transitionDelay = (1200 + i * 120) + 'ms';
});
```

---

## 6. STARTER CARDS: CLICK TO SELECT / REVEAL

**Lines**: ~4054-4167

### Purpose
Three track cards that reveal stats on click, propagate selection downstream (banner, companion, evolution showcase).

### State Variables
```javascript
const tracksGrid = document.getElementById('tracksGrid');
const trackBanner = document.getElementById('trackBanner');
const trackChosenName = document.getElementById('trackChosenName');
const applyIndicator = document.getElementById('applyTrackIndicator');
const scrollCompanion = document.getElementById('scrollCompanion');

const mascotNames = {
  'Devices Residency': 'Volt',
  'Therapies Residency': 'Helix',
  'Builder Pass': 'Ember'
};
```

### Click Handler
**Lines**: ~4064-4147

```javascript
document.querySelectorAll('.track').forEach(track => {
  track.addEventListener('click', () => {
    const wasSelected = track.classList.contains('selected');

    // Deselect all first
    document.querySelectorAll('.track').forEach(t => t.classList.remove('selected'));

    if (wasSelected) {
      // Deselection branch
      tracksGrid.classList.remove('has-selection');
      trackChosenName.textContent = '';
      trackChosenName.style.color = '';
      if (applyIndicator) {
        applyIndicator.classList.remove('visible');
        applyIndicator.querySelector('.ati-name').textContent = '';
      }
      scrollCompanion.classList.remove('active');
      scrollCompanion.innerHTML = '';
      // Reset evolution showcase
      const evoEl = document.getElementById('evoShowcase');
      if (evoEl) {
        evoEl.classList.remove('has-selection');
        evoEl.querySelectorAll('.evo-line').forEach(l => {
          l.classList.remove('active');
          l.querySelectorAll('.evo-stage').forEach(s => s.classList.remove('visible'));
          l.querySelectorAll('.evo-arrow').forEach(a => a.classList.remove('visible'));
        });
      }
    } else {
      // Selection branch
      track.classList.add('selected');
      tracksGrid.classList.add('has-selection');

      const name = track.dataset.track;
      const color = track.dataset.color;

      // 1. Update banner
      trackChosenName.textContent = name;
      trackChosenName.style.color = color;

      // 2. Update apply indicator
      if (applyIndicator) {
        applyIndicator.classList.add('visible');
        applyIndicator.style.borderColor = color;
        applyIndicator.style.color = color;
        applyIndicator.querySelector('.ati-dot').style.background = color;
        applyIndicator.querySelector('.ati-name').textContent = name;
      }

      // 3. Activate scroll companion
      const mascotSvg = track.querySelector('.track-mascot svg');
      if (mascotSvg && scrollCompanion) {
        scrollCompanion.innerHTML = mascotSvg.outerHTML;
        scrollCompanion.style.setProperty('--tk-rgb', getComputedStyle(track).getPropertyValue('--tk-rgb').trim());
        scrollCompanion.style.color = color;
        scrollCompanion.dataset.name = mascotNames[name] || name;
        requestAnimationFrame(() => {
          scrollCompanion.classList.add('active');
        });
      }

      // 4. Show matching evolution line, hide others
      const evoEl = document.getElementById('evoShowcase');
      if (evoEl) {
        evoEl.classList.add('has-selection');
        evoEl.querySelectorAll('.evo-line').forEach(l => {
          l.classList.remove('active');
          l.querySelectorAll('.evo-stage').forEach(s => s.classList.remove('visible'));
          l.querySelectorAll('.evo-arrow').forEach(a => a.classList.remove('visible'));
        });
        const matchLine = evoEl.querySelector(`.evo-line[data-evo-track="${name}"]`);
        if (matchLine) {
          matchLine.classList.add('active');
          // Stagger reveal
          const stages = matchLine.querySelectorAll('.evo-stage');
          const arrows = matchLine.querySelectorAll('.evo-arrow');
          stages.forEach((s, i) => setTimeout(() => s.classList.add('visible'), i * 500));
          arrows.forEach((a, i) => setTimeout(() => a.classList.add('visible'), (i + 1) * 500 - 200));
        }
      }
    }
  });
});
```

**Flow**:
1. **Click same card again** → Deselect everything (clear banner, companion, evolution)
2. **Click different card** → Select it and:
   - Add `.selected` class to card
   - Add `.has-selection` to grid (dims other cards to 45% opacity)
   - Update banner text and color
   - Update apply indicator (shows at bottom of page)
   - Clone SVG mascot to scroll companion
   - Set CSS `--tk-rgb` and color on companion
   - Match evolution line by `data-evo-track`
   - Trigger staggered pop animations (500ms between stages)

### Scroll Companion Click
**Lines**: ~4149-4155

```javascript
if (scrollCompanion) {
  scrollCompanion.addEventListener('click', () => {
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
```

### Staggered Entrance
**Lines**: ~4157-4166

```javascript
const starterIO = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('card-visible'), i * 120);
      starterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.track').forEach(t => starterIO.observe(t));
```

Cards pop in with 120ms stagger when scrolled into view.

---

## 7. EVOLUTION SHOWCASE: RE-TRIGGER ON SCROLL

**Lines**: ~4168-4183

### Purpose
Stagger pop animations for evolution sprites when scrolled into view (if not already triggered by track selection).

```javascript
const evoIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const line = entry.target;
      // Only animate if active and stages not yet visible
      if (line.classList.contains('active') && !line.querySelector('.evo-stage.visible')) {
        const stages = line.querySelectorAll('.evo-stage');
        const arrows = line.querySelectorAll('.evo-arrow');
        stages.forEach((s, i) => setTimeout(() => s.classList.add('visible'), i * 500));
        arrows.forEach((a, i) => setTimeout(() => a.classList.add('visible'), (i + 1) * 500 - 200));
      }
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.evo-line').forEach(line => evoIO.observe(line));
```

**Logic**:
- Observer threshold 0.3 (30% visible)
- Only triggers if line has `.active` class AND no stages are `.visible` yet
- Allows animations to play if user scrolls to evolution section without selecting track
- Prevents re-triggering if already animated

---

## 8. FAQ ACCORDION

**Lines**: ~4185-4192

```javascript
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const open = item.classList.contains('open');
    // Close all items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Open this one if it wasn't already open
    if (!open) item.classList.add('open');
  });
});
```

**Behavior**:
- Single-open accordion (only one item expanded at a time)
- Click open item again to close it
- Click another item to switch

---

## 9. CUSTOM CURSOR WITH PARTICLE TRAILS

**Lines**: ~4194-4204

### Basic Cursor Follow
```javascript
const cur = document.getElementById('cursor');
let mouseX = 0, mouseY = 0, currentSection = 'hero';
window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cur) cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
});
```

### Hover State
```javascript
document.querySelectorAll('a, button, .track, .faq-item, .rd, .roster-slot, .roster-partner, .life-card, .map-node, .scroll-companion, .sound-toggle').forEach(el => {
  el.addEventListener('mouseenter', () => cur && cur.classList.add('hover'));
  el.addEventListener('mouseleave', () => cur && cur.classList.remove('hover'));
});
```

---

## 10. PAGE LOADER

**Lines**: ~4208-4229

```javascript
(function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  const dismiss = () => {
    loader.classList.add('done');
    document.body.classList.remove('loading');
    // Trigger hero animations after loader
    setTimeout(() => {
      document.querySelectorAll('.hero .line-inner').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }, 300);
  };
  // Wait for fonts + a minimum dramatic pause
  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(r => setTimeout(r, 2200))
  ]).then(dismiss);
  // Safety timeout
  setTimeout(dismiss, 4000);
})();
```

**Flow**:
1. Wait for fonts to load (document.fonts.ready)
2. Wait minimum 2.2s dramatic pause
3. Remove `loading` from body, add `done` to loader
4. After 300ms, trigger hero headline animations (unpause)
5. Safety timeout at 4s maximum

---

## 11. ANIMATED GRAIN CANVAS

**Lines**: ~4238-4276

### Purpose
Animated noise texture overlay (optimized for performance).

**Optimizations**:
- Renders at 1/4 resolution (divide viewport by 4)
- Throttled to ~12fps (update every 5 frames)
- Pauses when tab is hidden
- Uses pre-allocated Uint32Array for direct pixel writing

```javascript
(function initGrain() {
  const canvas = document.getElementById('grainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
  let w, h, imgData, buf32;
  let grainRunning = true;

  function resize() {
    w = canvas.width = Math.ceil(window.innerWidth / 4);
    h = canvas.height = Math.ceil(window.innerHeight / 4);
    imgData = ctx.createImageData(w, h);
    buf32 = new Uint32Array(imgData.data.buffer);
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', () => {
    grainRunning = !document.hidden;
  });

  let frame = 0;
  function render() {
    if (!grainRunning) { requestAnimationFrame(render); return; }
    frame++;
    if (frame % 5 !== 0) { requestAnimationFrame(render); return; }

    // Write directly to Uint32 buffer (ABGR on little-endian)
    const len = buf32.length;
    for (let i = 0; i < len; i++) {
      const v = (Math.random() * 255) | 0;
      buf32[i] = 0xFF000000 | (v << 16) | (v << 8) | v; // opaque gray
    }
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(render);
  }
  render();
})();
```

---

## 12. HERO BIOLUMINESCENT PARTICLES

**Lines**: ~4284-4382

### Purpose
Glowing particles in hero section that respond to mouse movement.

**Optimizations**:
- Pauses when hero is scrolled past
- Reduced particle count on mobile (30 on mobile, 60 on desktop)
- Pauses when tab hidden

**Key State**:
```javascript
const particles = []; // Array of particle objects
const isMobile = window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 30 : 60;
let heroVisible = true;
```

**Particle Properties**:
```javascript
{
  x, y,                    // Position
  vx, vy,                  // Velocity
  r,                       // Radius
  color: { r, g, b, a },  // RGBA
  pulse,                   // Animation phase
  pulseSpeed              // Oscillation speed
}
```

**Particle Update Loop**:
1. For each particle:
   - Update pulse (sine wave for glow intensity)
   - Calculate distance to mouse
   - If within 150px, apply repulsion force
   - Apply friction (0.98)
   - Update position
   - Wrap around edges
   - Draw with radial gradient glow + core circle

**Mouse Repulsion**:
```javascript
const dx = p.x - heroMX;
const dy = p.y - heroMY;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < 150) {
  const force = (150 - dist) / 150 * 0.5;
  p.vx += (dx / dist) * force;
  p.vy += (dy / dist) * force;
}
```

---

## 13. KINETIC TYPOGRAPHY (SPLIT-TEXT)

**Lines**: ~4387-4460

### Purpose
Animate text character-by-character with staggered delays.

**Targets**: `.month-h2, .runway-title, .kobe-h2, .life-h3, .apply-h2`

**Process**:
1. Find each target heading
2. Walk DOM tree and wrap text characters in `<span class="split-char">`
3. Preserve HTML tags like `<em>` (gradient text)
4. Treat multi-line `<em>` blocks specially (split by `<br>`)
5. Set `transitionDelay` on each character based on index
6. Mark element with `data-kinetic="true"`

**Reveal Trigger**:
```javascript
const ktIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.split-char').forEach(c => {
        c.classList.add('char-visible');
      });
      ktIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
```

**Timing**: 0.03s (30ms) stagger between characters.

---

## 14. SCROLL COLOR TEMPERATURE SHIFT

**Lines**: ~4466-4499

### Purpose
Change background atmosphere gradient based on scroll progress.

**Zones** (6 different color zones):
```javascript
const zones = [
  { start: 0, color: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(184,227,255,0.04) 0%, transparent 70%)' },
  { start: 0.15, color: '...' }, // Blue→Pink
  { start: 0.35, color: '...' }, // Pink
  { start: 0.55, color: '...' }, // Golden
  { start: 0.75, color: '...' }, // Purple
  { start: 0.9, color: '...' },  // Pink glow
];
```

**Update Logic**:
- Hooked into `updateScrollSystems()` (piggybacked onto scroll loop)
- Finds current zone based on `Mirai.scrollProgress`
- Only updates when zone changes (no unnecessary DOM writes)

---

## 15. CONTEXT-AWARE CURSOR PARTICLES

**Lines**: ~4510-4597

### Purpose
Small trailing particles spawned at cursor, section-aware colors.

**Optimizations**:
- Skips on touch devices
- DOM element pool (30 recycled elements)
- Spawns every 4 frames (not every frame)
- Pauses when tab hidden

**Section Colors**:
```javascript
const sectionColors = {
  hero:   [{ r: 255, g: 184, b: 204 }, { r: 184, g: 227, b: 255 }, { r: 212, g: 184, b: 255 }],
  tracks: [{ r: 109, g: 181, b: 245 }, { r: 245, g: 211, b: 78 }, { r: 245, g: 107, b: 107 }],
  month:  [{ r: 245, g: 160, b: 181 }, { r: 212, g: 184, b: 255 }],
  kobe:   [{ r: 232, g: 201, b: 125 }, { r: 255, g: 160, b: 100 }],
  default: [{ r: 245, g: 160, b: 181 }],
};
```

**Pool Management**:
```javascript
const MAX_POOL = 30;
const pool = [];
for (let i = 0; i < MAX_POOL; i++) {
  const el = document.createElement('div');
  el.className = 'cursor-particle';
  el.style.display = 'none';
  pool.push(el);
}
document.body.append(...pool);

function getPoolEl() {
  const el = pool[poolIdx % MAX_POOL];
  poolIdx++;
  el.style.display = '';
  return el;
}
```

**Particle Update**:
```javascript
for (let i = particles.length - 1; i >= 0; i--) {
  const p = particles[i];
  p.life -= p.decay;
  p.x += p.vx; p.y += p.vy;
  p.vy += 0.02; // gravity

  if (p.life <= 0) {
    if (p.el) p.el.style.display = 'none';
    particles.splice(i, 1);
    continue;
  }

  const s = p.size * p.life;
  p.el.style.cssText = `
    left:${p.x}px; top:${p.y}px;
    width:${s}px; height:${s}px;
    opacity:${p.life * 0.6};
    background:rgba(${p.color.r},${p.color.g},${p.color.b},0.8);
    box-shadow:0 0 ${s*2}px rgba(${p.color.r},${p.color.g},${p.color.b},0.4);
    transform:translate(-50%,-50%);
  `;
}
```

---

## 16. COMPREHENSIVE SOUND DESIGN SYSTEM

**Lines**: ~4609-5211

### Purpose
Hans Zimmer-inspired generative ambient soundtrack with scroll-reactive mixing, UI sounds, and reverb.

### Architecture Overview

**Audio Context Init**:
```javascript
let ctx = null;
let soundEnabled = true; // on by default
let audioStarted = false;
let masterGain, ambientGain, uiGain, reverbSend;
```

**Bus Structure**:
```
Master Gain
├── Ambient Bus
│   ├── Heartbeat (sub-pulse)
│   ├── Pad Drones (detuned Dm chord)
│   ├── Rising Fifth Motif (slow swell)
│   ├── Time-Tick (metallic clicks)
│   ├── Harmonic Shimmer (overtones)
│   └── Breath Noise (filtered white noise)
└── UI Bus
    ├── Reverb Return (4-tap feedback delay)
    └── [UI sounds sent here]
```

### Layer 1: Heartbeat Sub-Pulse
**Lines**: ~4685-4730

```javascript
heartbeatOsc = ctx.createOscillator();
heartbeatOsc.type = 'sine';
heartbeatOsc.frequency.value = 42; // sub-bass fundamental

const hbOsc2 = ctx.createOscillator();
hbOsc2.type = 'sine';
hbOsc2.frequency.value = 84; // octave above

// Amplitude LFO — the "heartbeat" rhythm (~30 BPM = 0.5Hz)
heartbeatLfo = ctx.createOscillator();
heartbeatLfo.type = 'sine';
heartbeatLfo.frequency.value = 0.5; // one throb every 2 seconds
const hbLfoGain = ctx.createGain();
hbLfoGain.gain.value = 0.18; // modulation depth
```

**Effect**: Low-frequency sine wave (42Hz) modulated by 0.5Hz LFO → rhythmic "heartbeat" throb.

### Layer 2: Evolving Pad Drones
**Lines**: ~4732-4784

D minor chord (D2, A2, D3, F3) with:
- Triangle + sine doubled oscillators per voice (creates beating/shimmer)
- Detuned by 3-6 cents for slow beating
- Individual slow LFO on each voice (0.03–0.075 Hz) for "breathing"
- Lowpass filter (300Hz, opens with scroll) for tonal control

```javascript
const padNotes = [73.42, 110.0, 146.83, 174.61]; // D2, A2, D3, F3
const detuneAmounts = [-4, 3, -6, 5]; // cents

padNotes.forEach((freq, i) => {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  osc.detune.value = detuneAmounts[i];

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq;
  osc2.detune.value = detuneAmounts[i] + (Math.random() * 4 - 2);

  // Slow individual LFO for each voice
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.03 + i * 0.012;
  // ... connect via voiceGain.gain
});
```

### Layer 3: Rising Fifth Motif
**Lines**: ~4786-4850

Every 18-32 seconds, a slow D→A (or similar) swell:
```javascript
function scheduleRisingFifth() {
  const delay = 18 + Math.random() * 14; // 18-32 seconds
  setTimeout(() => {
    // Root: D2 (73.42 Hz), ramps 0→0.06 over 3s → 0 over 7s
    // Fifth: A2 (110 Hz), starts 1.5s later, ramps 0→0.05 over 4s → 0 over 7.5s
    // Shimmer: D4 (293.66 Hz), starts 2s later, barely there (0.015)
    // Filter: opens from 200Hz→(500+scrollProgress*300)Hz over 5s
  }, delay * 1000);
}
```

**Effect**: Slow cinematic swell that responds to scroll progress.

### Layer 4: Time-Tick Texture
**Lines**: ~4852-4889

Irregular metallic clicks in upper register (Dunkirk-clock urgency):
```javascript
function scheduleTick() {
  const delay = 0.8 + Math.random() * 2.7; // 0.8-3.5s between ticks
  setTimeout(() => {
    const baseFreq = 3200 + Math.random() * 1200;
    // Sine oscillator that pitches down over 40ms
    // Bandpass filter centered on frequency (Q=20 for narrowness)
    // Exponential gain ramp: 0.025 → 0.0001 over 60ms
  }, delay * 1000);
}
```

**Effect**: Sparse, urgent metallic pings (fades in as scroll progresses).

### Layer 5: Harmonic Shimmer
**Lines**: ~4891-4926

Sparse ethereal overtones from harmonic series of D:
```javascript
function scheduleShimmer() {
  const delay = 5 + Math.random() * 10;
  setTimeout(() => {
    const harmonics = [3, 4, 5, 6, 8, 10, 12];
    const freq = 73.42 * harmonics[Math.floor(Math.random() * harmonics.length)];
    // Sine at random harmonic
    // Bandpass filter (Q=15)
    // Linear gain ramp: 0→0.03 over 2s → 0 over 5s
  }, delay * 1000);
}
```

### Layer 6: Breath Noise Texture
**Lines**: ~4929-4973

Subtle filtered white noise with breathing LFO:
```javascript
// Generate Brownian noise (using Paulstretch-like algorithm)
const bufferSize = ctx.sampleRate * 4;
const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const noiseData = noiseBuffer.getChannelData(0);
let b0=0, b1=0, ..., b6=0;
for (let i = 0; i < bufferSize; i++) {
  const white = Math.random() * 2 - 1;
  // Feedback filter coefficients (Paul Kellett's Butterworth pink noise)
  b0 = 0.99886*b0 + white*0.0555179;
  b1 = 0.99332*b1 + white*0.0750759;
  // ... (multiple stages)
  noiseData[i] = (b0+b1+...+white*0.5362) * 0.04;
}

// Bandpass (180Hz, Q=0.4) with LFO modulation
const noiseLfo = ctx.createOscillator();
noiseLfo.type = 'sine';
noiseLfo.frequency.value = 0.07; // slow breathing
```

**Effect**: Warm, subtle "air" in the room with subtle frequency modulation.

### UI Sounds (4 functions)

#### `playPing(freq, vol=0.07)`
**Purpose**: Resonant bell-like tone for interaction feedback.

- Main sine oscillator (pitches down slightly over 120ms)
- Harmonic overtone (2x detuned, shorter decay)
- Bandpass filter for resonance (Q=6)
- Sent to reverb for cathedral tail

#### `playThud(vol=0.06)`
**Purpose**: Physical thud for form interaction.

- Sine that pitches down from 140Hz→35Hz over 120ms
- Exponential envelope (0.2s decay)
- Deep impact character
- Sent to reverb

#### `playSelect()`
**Purpose**: Ascending D minor chord (D4, F4, A4, D5) for track selection.

- 4-note chord with staggered attack (80ms apart)
- Mix of triangle (warm) and sine (clear) waves
- Each note has bandpass filter
- 1.3s decay via reverb tail
- Hopeful, wide character

#### `playFlip()`
**Purpose**: Cinematic whoosh with pitch sweep for card flip.

- Noise burst swept through bandpass (600Hz→2400Hz→300Hz over 180ms)
- Accompanying "womp" tonal swoop (300Hz→80Hz)
- High-pass for shimmer
- Sent to reverb

#### `playHover()`
**Purpose**: Glass-edge high shimmer for button hover.

- High sine (2000–2600Hz, randomized)
- Brief 100ms decay
- Subtle, non-intrusive

### Fade In/Out & Auto-Start
**Lines**: ~5099-5147

```javascript
function fadeIn() {
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  // Master: 5-second cinematic fade-in to 0.22
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0.22, t + 5);
  // UI: faster fade-in to 1.0
  uiGain.gain.setValueAtTime(uiGain.gain.value, t);
  uiGain.gain.linearRampToValueAtTime(1, t + 0.5);
}

// Auto-start on first user gesture
['click', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach(evt =>
  document.addEventListener(evt, autoStart, { capture: true, once: false, passive: true })
);

toggle.addEventListener('click', () => {
  if (!ctx) initAudio();
  if (!audioStarted) {
    audioStarted = true;
    soundEnabled = false;
    toggle.classList.remove('active');
    fadeOut();
    return;
  }
  soundEnabled = !soundEnabled;
  toggle.classList.toggle('active', soundEnabled);
  if (soundEnabled) { fadeIn(); } else { fadeOut(); }
});
```

### Scroll-Reactive Intensity
**Lines**: ~4160-4191 (in updateScrollSystems hook)**

```javascript
// Throttled to ~10Hz to avoid AudioParam scheduling spam
let lastSoundUpdate = 0;
const _prevSoundUpdate = updateScrollSystems;
updateScrollSystems = function() {
  _prevSoundUpdate();
  const now = performance.now();
  if (now - lastSoundUpdate < 100) return; // ~10Hz throttle
  lastSoundUpdate = now;
  if (!soundEnabled || !ctx) return;
  scrollProgress = Mirai.scrollProgress;
  const t = ctx.currentTime;

  // 1. Pad lowpass opens with scroll (300 + scroll*600 Hz)
  if (padFilter) {
    padFilter.frequency.setValueAtTime(padFilter.frequency.value, t);
    padFilter.frequency.linearRampToValueAtTime(300 + scrollProgress * 600, t + 2);
  }

  // 2. Pad gain increases (0.14 + scroll*0.08)
  if (padGain) {
    padGain.gain.setValueAtTime(padGain.gain.value, t);
    padGain.gain.linearRampToValueAtTime(0.14 + scrollProgress * 0.08, t + 2);
  }

  // 3. Heartbeat LFO speeds up (0.5 + scroll*0.25 Hz)
  if (heartbeatLfo) {
    heartbeatLfo.frequency.setValueAtTime(heartbeatLfo.frequency.value, t);
    heartbeatLfo.frequency.linearRampToValueAtTime(0.5 + scrollProgress * 0.25, t + 3);
  }

  // 4. Tick volume fades in after 40% scroll
  if (tickGain) {
    const tickVol = scrollProgress > 0.4 ? (scrollProgress - 0.4) / 0.6 * 0.06 : 0;
    tickGain.gain.setValueAtTime(tickGain.gain.value, t);
    tickGain.gain.linearRampToValueAtTime(tickVol, t + 2);
  }

  // 5. Shimmer increases
  if (shimmerGain) {
    shimmerGain.gain.setValueAtTime(shimmerGain.gain.value, t);
    shimmerGain.gain.linearRampToValueAtTime(0.08 + scrollProgress * 0.06, t + 2);
  }

  // 6. Heartbeat oscillator frequency rises (42 + scroll*6 Hz)
  if (heartbeatOsc) {
    heartbeatOsc.frequency.setValueAtTime(heartbeatOsc.frequency.value, t);
    heartbeatOsc.frequency.linearRampToValueAtTime(42 + scrollProgress * 6, t + 2);
  }
};
```

**Effect**: As user scrolls, the mix "opens up" and builds in intensity (darker→brighter, slower→faster).

---

## 17. FIGHTER/ROSTER INTERACTION

**Lines**: ~5214-5343

### Purpose
"Fighter Select" interface for roster of biotech founders/speakers.

### Fighters Data Array
```javascript
const fighters = [
  { name: 'Rodney', fullName: 'Rodney Kelly', title: 'European Ambassador · Mediso', bio: '...', photo: 'Images/speakers/rodney.png' },
  { name: 'Rob', fullName: 'Rob Claar', title: 'Founder · HekaBio', bio: '...', photo: 'Images/speakers/rob.png' },
  // ... 6 more confirmed
  { name: '???', fullName: 'Challenger Approaching', title: 'Track TBA', bio: 'Identity classified...', mystery: true },
  { name: '???', fullName: 'Challenger Approaching', title: 'Track TBA', bio: 'Identity classified...', mystery: true }
];
```

### Selection Handler
```javascript
function selectFighter(slot, skipFlash) {
  const idx = parseInt(slot.dataset.fighter);
  const fighter = fighters[idx];
  if (!fighter) return;

  // Deselect previous
  if (selectedSlot) selectedSlot.classList.remove('selected');
  selectedSlot = slot;
  slot.classList.add('selected');

  // Populate portrait
  portrait.innerHTML = '';
  if (fighter.photo) {
    const img = document.createElement('img');
    img.src = fighter.photo;
    img.alt = fighter.fullName;
    portrait.appendChild(img);
  }

  if (!skipFlash) {
    portrait.classList.remove('flash');
    void portrait.offsetWidth; // force reflow
    portrait.classList.add('flash');
  }

  // Populate info
  document.getElementById('fighterName').textContent = fighter.fullName;
  document.getElementById('fighterTitle').textContent = fighter.title;
  document.getElementById('fighterBio').textContent = fighter.bio;
  panel.classList.add('has-fighter');
}

grid.addEventListener('click', (e) => {
  const slot = e.target.closest('.roster-slot');
  if (!slot) return;
  selectFighter(slot, false);
});

// Auto-select first fighter on load
const firstSlot = grid.querySelector('.roster-slot[data-fighter="0"]');
if (firstSlot) selectFighter(firstSlot, true);
```

### Count-Up Animation
```javascript
const countEl = document.getElementById('rosterConfirmed');
if (countEl) {
  const target = 8;
  let counted = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        let current = 0;
        const step = () => {
          current++;
          countEl.textContent = current;
          if (current < target) setTimeout(step, 80);
        };
        step();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(countEl.closest('.roster-count'));
}
```

Counts up from 0 to 8 with 80ms intervals when section scrolls into view.

---

## 18. POST-CREDITS EASTER EGG

**Lines**: ~5357-5414

### Purpose
Final section with countdown to Oct 1, 2026 and twinkling stars.

### Star Generation
```javascript
const starsContainer = document.getElementById('postStars');
for (let i = 0; i < 50; i++) {
  const star = document.createElement('div');
  star.className = 'post-credits-star';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.animationDelay = (Math.random() * 3) + 's';
  star.style.animationDuration = (2 + Math.random() * 3) + 's';
  star.style.width = star.style.height = (1 + Math.random() * 2) + 'px';
  starsContainer.appendChild(star);
}
```

### Countdown Timer
```javascript
function updateCountdown() {
  const target = new Date('2026-10-01T00:00:00+09:00'); // JST
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    // Event reached, show 00:00:00:00
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cdDays').textContent = String(days).padStart(3, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);
```

### Mascot Copy
```javascript
const mascotEl = document.getElementById('postMascot');
const defaultMascot = document.querySelector('.track.devices .track-mascot svg');
if (defaultMascot) mascotEl.innerHTML = defaultMascot.outerHTML;
```

### Reveal on Scroll
```javascript
const pcIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      section.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
pcIO.observe(section);
```

---

## Summary of All Systems

| System | Lines | Purpose |
|--------|-------|---------|
| Global State (Mirai) | ~3600-3609 | Scroll tracking & interpolation |
| Scroll Dispatch Loop | ~3611-3691 | 60fps rAF loop for scroll effects |
| Scroll Reveal | ~3693-3697 | IntersectionObserver for fade-in |
| Terminal Typewriter | ~3699-3756 | Line-by-line reveal with timing |
| Isometric Map | ~3758-4052 | Draggable map, parallax, info cards |
| Track Selection | ~4054-4167 | Starter cards + evolution propagation |
| Evolution Reveal | ~4168-4183 | Staggered sprite animation on scroll |
| FAQ Accordion | ~4185-4192 | Single-open accordion UI |
| Custom Cursor | ~4194-4204 | Cursor follow + hover states |
| Page Loader | ~4208-4229 | Font wait + dramatic pause |
| Grain Canvas | ~4238-4276 | Optimized noise texture |
| Hero Particles | ~4284-4382 | Mouse-responsive bioluminescence |
| Kinetic Typography | ~4387-4460 | Character-by-character reveal |
| Color Shift | ~4466-4499 | Scroll-reactive background zones |
| Cursor Particles | ~4510-4597 | Trailing particle effects |
| Sound Design | ~4609-5211 | 6-layer Hans Zimmer-inspired ambient |
| Roster Fighter Select | ~5214-5343 | Interactive speaker grid |
| Post-Credits | ~5357-5414 | Countdown + stars + mascot |

---

## Key Patterns

1. **IntersectionObserver** — Triggers animations when elements scroll into view
2. **rAF Loops** — Continuous animations decoupled from scroll events
3. **IIFE Modules** — Each system self-contained, no global pollution
4. **CSS Class Toggling** — State managed via classes, animations in CSS
5. **Event Delegation** — Single listeners on parent elements
6. **Velocity Tracking** — Frame-to-frame deltas for momentum & smoothing
7. **Audio Context Scheduling** — setTimeout-based callbacks for sound patterns
8. **DOM Pooling** — Reuses elements (cursor particles) for performance
9. **Throttling** — Scroll audio updates limited to ~10Hz
10. **Responsive Detection** — Mobile vs desktop particle counts, etc.

---

## Notes for React Migration

- State objects (like fighters array, zone definitions) can become component props
- IIFE modules map naturally to React hooks (useEffect for setup, useRef for persistent state)
- Scroll listeners should use a shared scroll context / provider
- Canvas elements (grain, particles, hero particles) benefit from useRef + useEffect
- Sound system can be encapsulated in a custom hook (useSound)
- DOM element pooling (cursor particles) can be managed via refs
- IntersectionObserver setup should happen in useEffect with cleanup
- CSS custom properties set via .style can become inline styles or Tailwind classes
- Event delegation can use event handler props
- Animation states (visible, active, selected, open) map to component state
