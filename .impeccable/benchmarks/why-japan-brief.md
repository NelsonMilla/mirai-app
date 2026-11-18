# Designer brief: /why-japan section variants (Nov 18 2026)

You are one of nine designers building radically different versions of one section of the
`/why-japan` page, in parallel. Build ONE variant, live, as a clickable page.

## Project
- **App:** `/Users/nelson/Downloads/Mirai/mirai-app/.claude/worktrees/last-year/site-2027`. It
  is Next.js 16 App Router with TypeScript, React 19 and CSS Modules. No Tailwind.
- **Dev server:** already running with hot reload at http://localhost:4351.
  - Do NOT start another server.
  - Do NOT run `npm run build`, `next build`, git commands or `npm install`. Other designers
    share the folder.
  - You may run `npx tsc --noEmit -p .` to typecheck.
- **Read first:**
  - `components/residency/README.md`: the design system and tone rules. It is binding.
  - `app/globals.css`: the tokens on `:root`, plus `.masthead`, `.eyebrow`, `.mono`,
    `.kanjiMark`, `.grade`, `.grain` and the button classes.
  - `components/WhyJapan.tsx` + `WhyJapan.module.css`: the current page. Its sections are the
    exports `WjHero`, `WjReasons`, `WjNow` and `WjNotes`, plus the `Fn` footnote marker.
  - `content/why-japan.ts`: all the copy.
  - `../.impeccable/benchmarks/why-japan-gauntlet.md`: the four reviewers who will grade you.
    Design to pass them.
- **The rest of the site:**
  - Look at the homepage at http://localhost:4351/. It opens with the giant word JAPAN behind
    Fuji, gold Mincho kanji chapter marks, and graded real photos.
  - Components are in `components/residency/`. Your section must feel like the same site.

## Copy
- Render the copy from `content/why-japan.ts`. Import it; do not retype it.
- Do not change, add or remove words. The owner approved this copy.
- You may add one tiny plain label if your layout needs it. Keep it literal, with no new facts
  or numbers, and put it in your component with a comment.
- Footnote markers must keep the `#fnN` / `#fnrefN` ids, so the links into the notes section
  work in both directions. Use the exported `Fn`.

## Photos
- **Already in the app:**
  - `public/img/why-japan/`: the 2026 Why Japan photos, all stock.
  - `public/img/2026/`: real Mirai 2026 event photos. Their manifest, with captions and focal
    points, is `content/photos-2026.json`. Never use `lab-kobe-university-01.webp`.
  - `public/img/fuji/fuji-dawn.webp`
  - `public/img/kobe/`
  - `public/img/life/`
  - `public/media/` holds the video loops.
- **More stock photos:** in `../new-site/img/`, for example:
  - `kansai-kyoto-autumn-1280.webp`, `kansai-nara-autumn-1280.webp`
  - `kobe-venus-bridge-twilight.webp`, `kobe-rokko-island-night.webp`
  - `future-city-1440.webp`
  - `why-strategy-900.webp`, `why-strategy2-900.webp`
  - `pillar-exoskeleton-hal.webp`, `arima-steam.jpg`

  To use one, copy it into `public/img/why-japan/<variant-id>/`. Never reference `../new-site`
  at runtime.
- **Treatment:** every photo gets `.grade`; wrap it in `.grain` where it fits. Use `next/image`
  with honest `sizes`. No type over faces.

## Hard rules
- Follow the README design system:
  - **Palette:** night ground, cream type, ONE accent (dawn gold).
  - **Type:** Switzer for display and body, IBM Plex Mono for labels, Shippori Mincho only for
    Japanese glyphs.
  - **Lines:** hairlines, not shadows.
  - **Motion:** one gesture at most, using transforms and opacity only.
  - **Reduced motion and no JS:** with `prefers-reduced-motion` or JavaScript disabled, the
    finished state shows.
- No horizontal page scroll from 320 to 1920 wide.
- Accessibility:
  - sensible heading levels: the hero owns the only h1, and the sections use h2
  - real alt text
  - keyboard access for anything interactive
- Server components by default. Use `'use client'` only for a small piece that truly needs it.
  Any scroll handler must be passive, run through rAF, and clean up on unmount.

## Files you create (only these; touch nothing else)
- `components/lab/<Component>.tsx` + `components/lab/<Component>.module.css`.
  `<Component>` is given in your task, for example `WjHeroA`.
- `app/(en)/lab/<route>/page.tsx`. It renders the WHOLE page with only your section swapped,
  so the seams can be judged:

```tsx
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjHeroA } from '@/components/lab/WjHeroA';
export const metadata: Metadata = { title: 'Lab · Why Japan · Hero A' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan hero={<WjHeroA />} /><NotifyStrip /></main><SiteFooter /></>);
}
```

  The slot names are `hero`, `reasons`, `now` and `notes`.
- If you need a new asset, put it in `public/img/why-japan/<route>/`.

## Verify, then screenshot for the reviewers
- **Screenshots:** use Playwright, imported from
  `/Users/nelson/Downloads/Mirai/mirai-app/legacy-site/node_modules/playwright/index.mjs`.
  Put your script and outputs under
  `/private/tmp/claude-503/-Users-nelson--claude-spares-spare-f2sk30/a1a2aa27-315e-45bc-b1e3-0946f06d138f/scratchpad/wj/`.
  Save these three PNGs, at deviceScaleFactor 1, in that folder:
  - `<route>-fold.png`: what a visitor sees when your section's top reaches the viewport top
    at 1440×900. For the hero, that is the page on arrival.
  - `<route>-desktop.png`: your whole section at 1440 wide (a clip of the section element).
  - `<route>-phone.png`: your whole section at 390 wide.

  Wait for any entrance motion to finish before you shoot.
- **Checks:**
  - no horizontal overflow at 320, 390, 1440 and 1920
  - no page errors
  - with `reducedMotion: 'reduce'` and with `javaScriptEnabled: false`, all content is visible
  - `npx tsc --noEmit -p .` passes

## Report back (under 250 words)
- The route URL.
- Your one idea, in one sentence.
- The files you created.
- The three screenshot paths.
- Anything you could not resolve.
- Any copy or label you added.
