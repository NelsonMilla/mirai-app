# Product

## Register

brand

## Platform

web

## Users

Primary: participants — biotech builders, founders, operators, and longevity-curious professionals deciding whether to buy Summit or Fashion Show tickets, or to apply for a Devices/Therapies residency or Builder Pass. When a design decision forces a trade-off, their reaction wins. Sponsors and speakers are the secondary lenses; they are convinced by seeing a page that excites participants.

The site is presented as a community-run event, not a company product. The "who's behind this?" question is answered with community proof — the ecosystem wall, speakers, residents, track record — never org-brand attribution blocks. "Frontier Humans" appears only in the Fashion Show's name.

## Product Purpose

The landing site for Mirai Tech City: a month-long longevity biomedical popup city on Kobe's Port Island, October 1–31 2026, anchored by two summits (Oct 17–18, Oct 24–25) and the Frontier Human Fashion Show (Oct 26). The site is a single static `new-site/index.html` — no framework, no build step, deployed on Vercel. Success is a visitor clicking through to Luma to buy tickets or apply for the residency. Every content change is evaluated against three OKRs: get participants excited, get sponsors excited, get speakers excited.

## Positioning

Japan's premier longevity biomedical popup city. Summit-first: the two summit weekends and the Fashion Show are the marquee events a visitor anchors on; the month-long residency wraps around them as the deeper commitment. The Kobe advantage grounds it all — "what takes years elsewhere takes months here" (PMDA pathways, AMED subsidies, KBIC's 370 member organisations).

The line a visitor remembers after 10 seconds: **Join us all of October for the Residency. Live the future now.**

## Conversion & proof

- Primary CTA: Get Tickets (Summits and Fashion Show) → the Luma event (`https://luma.com/an4zotn9`). Secondary: Apply for the Residency — same Luma destination, applications reviewed rolling. Tertiary: Sponsor the City (URL pending; placeholder links honestly flash "Opening soon"). One platform, three doors — everything still funnels to Luma.
- Belief ladder: **wow → real → for me.** 1) The cinematic hero — this is unlike anything I've seen. 2) It's real — hard dates, named speakers, KBIC/PMDA/AMED numbers, four past events at scale. 3) There's a door that fits me — a ticket, a residency track, a sponsorship.
- Proof on hand: 38 confirmed speakers (15 revealed, headliners Aubrey de Grey and José Cordeiro; photos in `new-site/img/`), the 15-community ecosystem wall, and the track record ladder — 500+ builders at Vitalia (Roatán), 400+ residents at Viva Frontier Tower (SF), 40M+ Meet the Drapers viewers, the MIT Human Augmentation Summit.

## Brand Personality

Cinematic, kinetic, precise. A film-trailer register: enormous quiet type over moving photography, one verb per fold (Live. Eradicate. Extend. Augment.), a countdown running to opening day. Playfulness survives but is restrained and Japanese — the one-eyed daruma waiting for October 1, kanji tap-reveals, episode numbering (壱 弐 参 肆) — small touches, not game mechanics. A visitor should feel awe, urgency, credibility, and belonging, in that order.

## Anti-references

- Biotech corporate: Genentech/pharma-style sites — navy and white, stock lab photos, compliance-speak.
- Generic SaaS landing: hero-metric templates, feature grids, testimonial carousels — the AI-generated landing page look.
- The site's own previous register: the arcade/TCG layer (starter cards, pixel mascots, evolution lines) is retired. Play now lives in small cultural touches, never in game mechanics.

## Design Principles

1. **Wow before why.** The belief ladder starts at spectacle; the moving-photo hero earns attention before anything explains.
2. **One verb per fold.** Every major section leads with a single short claim in display type; supporting detail stays subordinate.
3. **Ground the wonder.** Real dates, real speakers, real regulators (PMDA, AMED, KBIC) anchor every cinematic move.
4. **Community is the face.** Proof is people and communities — never the operating company.
5. **Honest doors.** Everything funnels to Luma; unfinished links say "Opening soon" instead of navigating nowhere, and reveal counts are stated plainly (15/38 speakers, 0/9 presenters).

## Accessibility & Inclusion

Pragmatic baseline, no formal WCAG target: `prefers-reduced-motion` collapses the hero carousel, reveals, and daruma wobble; off-screen slides are `inert`; an `aria-live` status region announces placeholder-link flashes; kanji reveals are keyboard-operable; imagery carries alt text. Videos are `muted`/`playsinline` with poster fallbacks and pause off-screen.
