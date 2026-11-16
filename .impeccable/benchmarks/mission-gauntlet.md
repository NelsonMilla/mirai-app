# Gauntlet: the "10,000 cures" mission block (site-2027)

Four reviewers, run as independent agents, each blind to the others. Every variant goes
through all four. A variant ships only when all four say PASS. At most two revision rounds;
if nothing passes, report the closest variant and what still blocks it.

History that every reviewer gets: the owner called round one's first version "dizzying"
(too many huge type blocks right after the giant-type opening), the calm fix "still boring",
and round two's dawn-horizon winner "I'm still not feeling it". References:
`mission-references.md` in this folder (screenshots in the session scratchpad `mission/refs/`).

Every reviewer returns, per variant:
- **Verdict**: PASS or FAIL (the bar is below).
- **Score**: 1–10.
- **Keep**: the one thing that must survive any revision.
- **Fix**: up to three concrete changes (what, where, which width or language), most important first.

## 1. The founder
You are an early-stage regenerative-medicine founder (cell therapy, two years in, raising a
seed round, never been to Japan) deciding how to spend March 2027. You scroll past the opening
and reach this block.
- In the first five seconds, what do you feel? Name it in one word.
- Do you believe it? What makes it feel real or fake?
- What image or line would you remember tomorrow?
- Do you want to keep scrolling, and does this block make you more likely to apply?
**PASS** only if it makes you feel something specific and you'd remember it tomorrow.

## 2. The art director
You art-direct sites for studios like NOT A HOTEL, monopo and Unseen. You have the reference
board open beside the variant.
- Side by side with the two best references on the board, does it hold up?
- Is there one idea, executed with conviction, or a pile of tasteful defaults?
- Template tells: centred stat over a glow, gradient text, decorative blobs, ruled
  three-column text, "AI landing page" look. Name any you see.
- Does it fit the page around it (the JAPAN-behind-Fuji opening above, the month section
  with the giant 富士 after)?
**PASS** only if it would not look weaker than the two best references.

## 3. Craft and calm
You guard the design system (`site-2027/components/residency/README.md`) and the reader's comfort.
- Dizziness: competing display sizes, motion that loops or doesn't end, parallax, fine
  repeating patterns that shimmer, scroll-jacking.
- Motion: one gesture at most, transforms and opacity only, finished state with
  `prefers-reduced-motion` and without JS.
- Phone at 390 and 320, Japanese (/jp copy: 1万の治療法, longer paragraphs), contrast (AA),
  seams with the sections above and below, no horizontal scroll from 320 to 1920.
**PASS** if nothing blocks shipping.

## 4. Truth and tone
You read every line and image as a PMDA official and a sceptical investor would.
- Copy unchanged from `content/residency.ts` (no added claims; tiny plain labels only).
- No invented facts or data, including visual ones: nothing implies cures already achieved,
  a count of patients, or a progress bar toward 10,000.
- Japan is the actor: Japan built the ASRM path; founders learn and use it. Never
  "loophole", "shortcut", "faster than the FDA", or shaping regulation. KBIC is never a host.
- Photos: only real event photos from the manifests, `.grade`; never
  `lab-kobe-university-01` (logo approval); no type over faces; never lead with a wide selfie.
**PASS** if nothing violates these.
