# Gauntlet: /why-japan (site-2027), Nov 18 2026

The 2027 site (`site-2027/`, Next.js) is the landing site for the **Mirai Tech City Residency,
March 2027**: three weeks of deep work at Mount Fuji, one week of meetings inside the Kobe
Biomedical Innovation Cluster, then a Demo Day with investors including Tim Draper. It is for
early-stage startups in regenerative medicine or a field that supports it.

`/why-japan` is a new subpage carrying the Japan thesis from the 2026 site's /conferences page:
"Japan is the best global ecosystem for frontier biotech." It has four parts:
1. **Hero**: eyebrow, the claim as h1, a one-sentence lead, a photo.
2. **Reasons**: "A year to market, not a decade." + a paragraph with footnotes 1–2, then seven
   reasons (Nobel researchers, iPS cells, one national database, $146B market, AMED 2:1,
   insurance 70–90%, and a ledger of 10× / 100× / +61%).
3. **Why now**: a dated timeline from 2025 to January 2027.
4. **Sources and notes**: footnotes 1–7.
After it come the site's NotifyStrip and footer.

Copy lives in `site-2027/content/why-japan.ts`. The owner approved this copy in September 2026.
It is not being rewritten in this round.

History every reviewer gets:
- The owner (Nelson) rejected the 2026 version of these sections as "repetitive structure, it
  drags" (headline, block, three columns over and over). That's why the 2026 page turned the
  reasons into an Apple-style horizontal reel.
- His taste, observed in four earlier rounds:
  - He picks the boldest editorial-typography option ("not even close").
  - He picks people and photos over structure, even when the judge scored structure higher.
  - The failure he names most often is a bland first screen.
- The 2027 brief's mantra: "Cool is better than brandbook. This website needs to evoke an
  emotional reaction."

Every reviewer returns, per variant:
- **Verdict**: PASS or FAIL. The bar is in your section below.
- **Score**: 1–10.
- **Keep**: the one thing that must survive any revision.
- **Fix**: up to three concrete changes (what, where, at which width), most important first.

A variant ships only when all four reviewers PASS it. There are at most two revision rounds. If
nothing passes, the orchestrator ships the closest variant and reports what still blocks it.

## 1. The founder
You run an early-stage regenerative-medicine company: cell therapy, two years in, raising a
seed round, never been to Japan. A friend sent you this page.
- In the first five seconds, what do you feel? Name it in one word.
- Do you believe it? What makes it feel real, and what makes it feel like marketing?
- Which line, number or image would you remember tomorrow?
- After this, would you look at the residency, or would you close the tab?

**PASS** only if it changes what you think about Japan and you would remember something
specific tomorrow.

## 2. The art director
You art-direct sites for studios like NOT A HOTEL, monopo, Unseen and Apple's product pages.
- Is there one idea, executed with conviction, or a pile of tasteful defaults?
- Name any template tells you see:
  - a centred stat over a glow
  - gradient text
  - decorative blobs
  - three ruled columns of text
  - identical cards in a grid
  - the "AI landing page" look
- Does it belong to the same site as the homepage? Look at http://localhost:4351/: the giant
  word JAPAN behind Fuji, gold kanji chapter marks, graded real photos.
- Does it sit well between the sections around it?

**PASS** only if it would hold up next to the homepage's opening and next to an Apple product
page.

## 3. Craft and calm
You guard the design system (`site-2027/components/residency/README.md`) and the reader's
comfort.
- **Layout:** no horizontal page scroll at 320, 390, 768, 1024, 1440 or 1920. Clean seams with
  the sections above and below.
- **Contrast:** dim text must reach AA (4.5:1 for body text, 3:1 for large text).
- **Motion:**
  - one gesture per section at most, using transforms and opacity only
  - it must stop once it has played
  - with `prefers-reduced-motion` or JavaScript disabled, the finished state shows and all
    content is visible
- **Footnotes:** the links still work in both directions.
- **Images:** `next/image` with honest `sizes`.
- **Scroll handlers:** passive, run through rAF, cleaned up on unmount.
- **Keyboard:** anything that scrolls horizontally can be reached and used with the keyboard.

**PASS** if nothing blocks shipping.

## 4. Truth and tone
You read every line and image the way a PMDA official and a sceptical investor would.
- **Copy:** the text matches `content/why-japan.ts` word for word. Nothing is added except
  tiny plain labels, and no claim is made stronger.
- **No invented data:** no new numbers, and no visual that implies data (a progress bar, a
  count, a chart with made-up values).
- **Dates:** today is Nov 18 2026. Anything marked "now" or "today" must be true.
- **Japan is the actor.** Japan built these routes, and founders learn and use them.
  - Never write that anyone shapes, proposes, drafts, influences or reforms Japanese
    regulation.
  - Never use "loophole" or "shortcut".
  - "Four years ahead of the FDA" exists in the approved copy. Do not let a design shout it
    louder than the copy does.
- **Photos:**
  - real or licensed photos only, with `.grade`
  - never `lab-kobe-university-01` (logo approval)
  - no type over faces
  - never two wide selfies side by side
- **Speakers:** Joe Betts-LaCroix is never beside Aubrey de Grey or Natalie Coles de Grey.
- **Partners:** LEV Foundation and Vitalist Bay are never shown as sponsors, hosts or
  supporters. KBIC is never called a host.

**PASS** if nothing violates these.
