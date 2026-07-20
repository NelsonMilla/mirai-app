# Product

## Register

brand

## Platform

web

## Users

Primary: participants — biotech builders, founders, and operators deciding whether to buy a Builder Pass or apply for a Devices/Therapies residency. When a design decision forces a trade-off, their reaction wins. Sponsors and speakers are the secondary lenses; they are convinced by seeing a page that excites participants.

The site is presented as a community-run event, not a company product. "Frontier Humans" (the operating company) is de-emphasized everywhere except the Fashion Show's name; the "who's behind this?" question is answered with community proof — residents, partner communities, volunteers, track record — never org-brand attribution blocks.

## Product Purpose

The landing page for Mirai Tech PopUp City: a 4-week biotech popup city on Kobe's Port Island, October 1–31, 2026. Success is a visitor clicking through to Luma to buy a Builder Pass or apply for a residency. Every content change is evaluated against three OKRs: get participants excited, get sponsors excited, get speakers excited.

## Positioning

A month living and building inside KBIC, Japan's biomedical cluster — labs, housing, and community on the same few blocks. The live-in biotech cluster is the claim every section reinforces.

The line a visitor remembers after 10 seconds: **spend October 2026 building the future of health in Kobe, Japan.**

## Conversion & proof

- Primary CTA: the Luma event link (`LUMA_EVENT_URL` in `src/lib/constants.ts`). Secondary CTA: none, on purpose — Luma is the only door; everything funnels there, no consolation actions.
- Belief ladder: **wow → real → for me.** 1) This is unlike anything I've seen. 2) And it's actually real — labs, regulators, dates, place. 3) And there's a track that fits me specifically.
- Proof on hand: roster headliners (featured on the landing page, full roster at tcg.miraitech.city), the partner-community logo wall (set is growing), and past-event track record (some image assets still owed — see `public/images/fs/`).

## Brand Personality

Playful, precise, alive. Game mechanics done with craft — the TCG/Pokémon layer (starter tracks, lifestyle cards, mascots) is executed seriously; everything moves, nothing is sloppy. A visitor should feel playful wonder, FOMO/urgency, credibility, and belonging — the wonder pulls them in, the credibility makes it safe to commit, the belonging makes it theirs.

## Anti-references

- Biotech corporate: Genentech/pharma-style sites — navy and white, stock lab photos, compliance-speak.
- Generic SaaS landing: hero-metric templates, feature grids, testimonial carousels — the AI-generated landing page look.

## Design Principles

1. **Wow before why.** The belief ladder starts at spectacle; every section earns attention before it explains.
2. **Play with craft.** Playfulness never at the expense of polish — the game layer is a precision instrument, not decoration.
3. **Ground the wonder.** Real dates, real labs, real regulators (PMDA, KBIC) anchor every fantastical element.
4. **Community is the face.** Proof is people — residents, partners, volunteers — never the operating company.
5. **One door.** Everything funnels to Luma; no competing CTAs, and compact UI beats added copy (text bloat is a standing risk).

## Accessibility & Inclusion

Pragmatic baseline, no formal WCAG target: reduced-motion support, readable contrast, keyboard-usable nav and FAQ. The Playwright smoke test (`npm run smoke`) guards section reveal, horizontal overflow, and console cleanliness across viewports.
