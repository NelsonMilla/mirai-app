# Residency 2027 homepage — section system

The homepage is the landing page for the **Mirai Tech City Residency, March 2027**
(brief: `site-2027/brief.md`). Its look comes from the opening round's winner
(`/lab/a`, "Monument": giant FUJI behind the real summit). Every section follows
these rules so the page reads as one piece.

## Content
- All copy and facts: `content/residency.ts`. Components only render it. If a
  section needs a new small label, keep it plain and literal and add it to
  `residency.ts`, never hard-code facts.
- Real photos: `content/photos-2026.json` (src, w, h, orientation, category, alt,
  caption, focal, score) → files in `public/img/2026/`. Do NOT use
  `lab-kobe-university-01.webp` (shows Kobe University/MIC logos; logo approval
  ends Dec 15 2026). Several people shots are wide selfies by the same person:
  never put two of them next to each other, never lead a section with one.
- Video: `public/media/cohort0-loop.mp4` (1080p, 4.3 MB), `cohort0-loop-720.mp4`
  (phones), `cohort0-loop-poster.jpg`. Muted, loops, real Demo Day 2026 footage.
- Fuji: `public/img/fuji/fuji-dawn.webp` (1600×1063, CC BY 2.0 hogeasdf; credit in
  `residency.credits`).
- 2026 speakers: `content/speakers-2026.json` (id, name, affiliation, photo).
  Joe Betts-LaCroix (`joe_betts_lacroix`) is never placed next to Aubrey de Grey
  or Natalie Coles de Grey (LEV Foundation).

## Tone rules (non-negotiable)
- Plain, literal copy. No metaphors or clever lines. Big type and imagery carry
  the drama.
- Japan is the actor. Japan built the path (ASRM); founders learn it, are guided
  through it, use it. Never write that anyone shapes, proposes, drafts,
  influences or reforms Japanese regulation; never "loophole", "shortcut",
  "faster than the FDA". Read every line as a PMDA official would.
- KBIC (Kobe Biomedical Innovation Cluster) is never called a host.
- Never invent dates, prices, cohort sizes, venues, names or outcomes.

## Design system (tokens live on `:root` in `app/globals.css`)
1. **Palette:** ground `--night` (indigo-black), cream type `--ink`, `--dim`,
   `--faint`, hairlines `--line`. ONE accent: `--accent` dawn gold (CTAs, kanji
   marks, active states). `--indigo` and `--dawn` only inside gradients/glows.
   `--vermilion` only for the hanko seal.
2. **Type:** display = Switzer 800–900, uppercase or sentence case, very large and
   tight (letter-spacing −.02em, line-height ≤ 1). Body = Switzer 400–500,
   15–18px, line-height 1.6. Labels/meta/captions = IBM Plex Mono (`--mono`),
   10–11px, uppercase, tracked .2–.3em. The only serif is Japanese:
   `--mincho` (Shippori Mincho).
3. **Motion:** one scroll-linked gesture per section at most. Transforms and
   opacity only. Entrances 0.9–1.4 s with `var(--ease)`, staggers ≤ 700 ms
   total. No cursor followers. `prefers-reduced-motion: reduce` = finished state,
   no movement. Content must be visible without JS (no permanently hidden
   elements waiting for an observer).
4. **Photos:** every real photo gets `.grade` (warm dawn grade); wrap in `.grain`
   for film grain. Either full-bleed, or framed prints with a mono caption under
   them (use the manifest `caption`; only state place/date if the manifest says
   so). Never set type over faces; use edge-only dark gradients behind text.
   Use `next/image` with honest `sizes`; use the manifest `focal` as
   `object-position`.
5. **Depth mask** (type behind the mountain) is used by the opening; at most one
   more use on the whole page (reserved for the month section).
6. **Kanji chapter marks:** one per section, `.kanjiMark` = gold Mincho glyph +
   mono romanization, e.g. `<p className="kanjiMark"><b>富士</b><span>Fuji</span></p>`.
   Program 未来 (mirai, future) · Month 富士 (Fuji) · Kobe 舞台 (butai, the stage) · Cohort 0 実績
   (jisseki, track record) · Life 暮らし (kurashi, daily life) · Apply 応募
   (ōbo, apply).
7. **Layout:** sections are full-width with an inner max-width of 1440px and
   6vw side padding; generous vertical rhythm (120–160px desktop, 80–96px
   phone). Hairline rules and ruled grids, not cards with shadows. Works from
   375px to 1920px with no horizontal scroll.
8. **CTA:** ONE primary button style everywhere (homepage, header, blog): the
   dawn-gold pill — background `var(--accent)`, near-black text, border-radius
   999px, mono 11–12px uppercase tracked label (`residency.apply` →
   `residency.applyHref`, `target="_blank" rel="noopener"`). Secondary is a text
   link (`residency.talk`). The page offers the primary button in the opening,
   once mid-page (after Cohort 0's companies) and in the final call.
9. **Repetition budget:** the Fuji photo appears in the opening and (differently
   cropped) in the month section only. 不死 appears in the opening only (seal +
   legend). The final call ends on people, not the mountain.
10. **Length:** about 14 screens on a 1440×900 desktop. Section seams fade into
   `--night`; no glow is centred on a section's top edge.

## Files
One section per file pair: `components/residency/<Name>.tsx` +
`<Name>.module.css` (CSS Modules; no edits to shared files). The homepage
(`app/page.tsx`) composes them in this order: Opening → Program → Month →
Kobe (week 4 + Demo Day at the UFO building) → Cohort0 → Life → Apply, with `SiteHeader` on top and `SiteFooter` at the end.
