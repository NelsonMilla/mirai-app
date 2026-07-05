import React from 'react';

/**
 * PixelAvatar — a deterministic pixel-art identicon for confirmed fighters
 * whose real photo hasn't arrived yet. On-theme with the site's Gen-3-Pokémon
 * pixel sprites (inline SVG, crispEdges, grid of rects, pixelated scale-up).
 *
 * Design
 * ------
 *  - Deterministic from `seed` (the fighter's fullName) via an FNV-1a hash.
 *    NO Math.random / Date — same name always yields the same creature, so
 *    server and client render identically (no SSR hydration mismatch).
 *  - A 10x10 grid, left half generated then mirrored to the right. That
 *    vertical symmetry is what makes an identicon read as a face/creature
 *    rather than noise.
 *  - Three shades derived from the fighter's tag color (`color` prop): a dark
 *    outline, the base color, and a bright highlight — so the sprite feels
 *    ALIVE and modelled, versus the mystery slots' flat "?".
 */

const GRID = 10;
const HALF = GRID / 2; // 5 generated columns, mirrored to 10

interface PixelAvatarProps {
  /** Deterministic seed — pass the fighter's fullName. */
  seed: string;
  /** Base color (from RosterSection.tagColor). */
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

/** FNV-1a 32-bit string hash. Deterministic, good avalanche for short names. */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // h *= 16777619, kept in 32-bit unsigned range
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** #rrggbb -> {r,g,b}. Falls back to a neutral slate on malformed input. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return { r: 133, g: 133, b: 168 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

function shade({ r, g, b }: { r: number; g: number; b: number }, f: number): string {
  // f < 1 darkens toward black, f > 1 lightens toward white.
  const mix = (c: number) =>
    f <= 1 ? clamp(c * f) : clamp(c + (255 - c) * (f - 1));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

export function PixelAvatar({ seed, color, className, style }: PixelAvatarProps) {
  const base = hexToRgb(color);
  const outline = shade(base, 0.4);
  const mid = shade(base, 1); // the tag color itself
  const highlight = shade(base, 1.5);

  // Grow a fresh PRNG stream from the seed so cell fills and shade picks use
  // independent byte ranges (avoids near-duplicate sprites across names).
  const h = fnv1a(seed);
  // A second, decorrelated hash for the shade/detail stream.
  const h2 = fnv1a(`${seed}~shade`);

  // Build the left half column-by-column, deterministically.
  // filled[col][row]: 0 = empty, 1 = mid, 2 = highlight, 3 = outline accent
  const filled: number[][] = [];
  let acc = h;
  let acc2 = h2;

  const nextBit = () => {
    // xorshift-ish stepping over the 32-bit accumulator — deterministic.
    acc ^= acc << 13; acc >>>= 0;
    acc ^= acc >> 17;
    acc ^= acc << 5; acc >>>= 0;
    return acc;
  };
  const nextShade = () => {
    acc2 ^= acc2 << 13; acc2 >>>= 0;
    acc2 ^= acc2 >> 17;
    acc2 ^= acc2 << 5; acc2 >>>= 0;
    return acc2;
  };

  for (let col = 0; col < HALF; col++) {
    filled[col] = [];
    for (let row = 0; row < GRID; row++) {
      const bit = nextBit();
      // Bias fill probability: denser toward the vertical center-line (col near
      // HALF-1) and the vertical middle rows, so a creature "body" forms rather
      // than scattered edge dust.
      const centerCol = col / (HALF - 1);          // 0 at edge, 1 at center seam
      const centerRow = 1 - Math.abs(row - (GRID - 1) / 2) / ((GRID - 1) / 2);
      const density = 0.28 + 0.42 * centerCol + 0.18 * centerRow;
      const on = (bit & 0xff) / 255 < density;
      if (!on) {
        filled[col][row] = 0;
        continue;
      }
      // Pick a shade for this cell from the decorrelated stream.
      const s = nextShade() & 0xff;
      filled[col][row] = s < 40 ? 3 : s < 120 ? 2 : 1; // outline / highlight / mid
    }
  }

  // Assemble rects for all four fill kinds across the mirrored grid.
  const rects: Record<number, React.ReactElement[]> = { 1: [], 2: [], 3: [] };
  for (let col = 0; col < HALF; col++) {
    for (let row = 0; row < GRID; row++) {
      const kind = filled[col][row];
      if (kind === 0) continue;
      const rightCol = GRID - 1 - col;
      rects[kind].push(
        <rect key={`l${col}-${row}`} x={col} y={row} width={1} height={1} />
      );
      if (rightCol !== col) {
        rects[kind].push(
          <rect key={`r${col}-${row}`} x={rightCol} y={row} width={1} height={1} />
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <g fill={mid}>{rects[1]}</g>
      <g fill={highlight}>{rects[2]}</g>
      <g fill={outline}>{rects[3]}</g>
    </svg>
  );
}
