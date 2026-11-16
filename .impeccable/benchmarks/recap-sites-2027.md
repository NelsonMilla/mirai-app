# Benchmark: between-editions sites (for site-2027)

Researched 2026-11-04. Question: how do events use their site after the event and
before the next one, and how well does `site-2027/` sell the fantasy of coming in 2027?

Sources were read live, except where marked *(snippet)*. Pages were read through a
summarising fetch, so quotes are short fragments.

## The 15 sites, one line each

| Site | What they lead with between editions | Best move to steal |
|---|---|---|
| **Edge City / Edge Esmeralda** (popup village) | "has come to a close" + month-in-review post; next villages with dates | **Month in Review** post: numbers, what got built, daily rituals (sauna, river floats, hikes), ends on the next village. Price step $2,400 → $3,000 |
| **Network School** (residency) | "Apply" + campus, meals, gym, riding photos | **Residents narrate**: index of first-person "I spent a month…" posts. Hero sells calories and remote work, not talks |
| **Devconnect** (world's fair) | Past-tense hero: "hosted… 14,000 attendees from 130+ countries" | **Recap as the homepage**: headline stat → "Catch the vibe" photo grid → recordings |
| **Devcon** | Next city + dates in hero, past-vibe gallery | Next place + date + "Add to calendar" beside old photos |
| **Zuzalu** | App shell, no story | Nothing; the original popup city kept no public narrative |
| **Vitalia / Infinita** (longevity peer) | Pivoted to a B2B clinic pitch | Nothing; our closest peer has **no recap page at all** |
| **SXSW** | Dated archive photos: "Kendrick 2013, Obama 2016"; 2027 badges on sale | **Iconic moments, dated**: history as a promise. Price-increase countdown |
| **Slush** | Stats + logo walls of who was in the room; "Sold out" tiers | **Density + scarcity**: 12,000 attendees, 25,000 meetings, sold-out labels |
| **Web Summit** | Video loop, logo groups "came as small startups / as investors", press quotes | **"Who you'd meet" logo groups** + press mythology |
| **Figma Config** | 2027 dates + venue locked a year out; session clips | **Certainty**: date and venue fixed; talk clips as the trailer |
| **Stripe Sessions** | Past talks by Jony Ive, Zuckerberg, Jensen Huang; early bird $599 vs $999 | **Talk archive led by names** + early-bird anchor with a dated deadline |
| **TED** | Next two events with dates and cities; "Apply now" | **Apply, don't buy**: exclusivity without a price |
| **Tomorrowland** *(snippet)* | 22-minute aftermovie; pre-registration is mandatory before any sale | **Aftermovie + pre-registration as the gate**: the film sells it, the list is the line |
| **Longevity Summit Dublin** | "That's a Wrap" + "Register interest for 2027" in nav and footer | Interest link everywhere. Otherwise text and logos only |
| **ARDD / RAADfest** | Deep per-year talk archives; RAADfest still shows the past event | Archive proves it lasts. Neither sells the feeling or names 2027 |

## What the set tells us

1. **Nobody sells the lifestyle well, so the opening is ours.** The conferences sell talks and
   numbers. Only Edge City and Network School show what living there feels like, and
   both do it with rituals (sauna, river, meals, gym) and residents' own words.
   No longevity event does it at all.
2. **The best recap is a past-tense homepage**: headline number → vibe photos → film or
   recordings → next date → signup (Devconnect, Edge Esmeralda).
3. **Certainty beats teasing.** Config, Stripe, SXSW, TED and Devcon all put the next
   date and place in the hero. "Coming soon" with no date (Dublin) gives people nothing to imagine.
4. **One always-visible way to raise your hand**: register interest, apply, or
   pre-register (Dublin, TED, Tomorrowland). A mailto link doesn't count.
5. **Urgency comes from price steps and sold-out labels, not countdowns.**
   Examples: Edge City's $2,400 → $3,000, Stripe's early bird, Slush's sold-out tiers.
   SXSW's countdown read zeros, which damages trust.
6. **"What got built here" by name** turns a month into an outcome (Edge City
   projects, Network School alumni startups). For us, that's the Demo Day companies.

## Scorecard: site-2027 today

| Pattern | Peers doing it well | site-2027 now | Gap |
|---|---|---|---|
| Our own film / aftermovie | Tomorrowland, Config clips | Hero is stock Pexels Kobe harbour footage, not our event | **High** |
| Vibe photo wall | Devconnect, Edge City | 8 empty slots (waiting on photos) | High, content pending |
| Headline numbers | Devconnect, Slush, Edge City | 31 days · 2 summits · 72 speakers; attendees and countries missing | Medium |
| Lifestyle and rituals (onsen, food, Kansai trips) | Edge City, Network School | None. Moments are the schedule (opening, summits, demo day) | **High** |
| Residents' own words | Network School, Web Summit, ARDD | None | **High** |
| What got built here | Edge City, Network School | None (Demo Day named but no companies) | High; the blog is the vehicle |
| Speaker roll | Slush, Stripe | 72 cards, alphabetical, all the same size | Strength; lead with names people recognise |
| Talk recordings | Stripe, ARDD, Devconnect | None | Medium, if footage exists |
| Next date and place | Config, SXSW, TED, Devcon | "Returns in 2027", no date, no city | **High** (your decision) |
| Interest capture | Dublin, TED, Tomorrowland | mailto to team@ | **High** |
| Urgency (founding price, alumni first) | Edge City, Stripe, Slush | None | Later, once 2027 pricing exists |
| Logo groups / press quotes | Web Summit, Slush | None (partner rules + Kobe permit to Dec 15) | Medium |

## Recommendations, ranked

**Build now (no new content needed):**
1. **Real pre-registration form** in place of the mailto: name, email, "I'd come as
   scientist / founder / investor / partner". Store it in the existing Supabase project.
   Put it in the hero, nav and footer, and present it as pre-registering for the 2027 line,
   not a newsletter.
2. **"A month in Kobe" lifestyle section**: 4–6 rituals with a photo each (onsen, izakaya
   nights, Kyoto/Nara day trips, morning runs on Port Island, the cowork). Pull wording
   from `new-site/experience/` (daily rhythm). This is the gap no peer fills.
3. **Voices block** with 3–6 short quotes, name and role, ideally a resident, a founder
   and a scientist. Link each to a long-form "my month in Kobe" blog post.
4. **"Built in Kobe" roll**: Demo Day companies by name, each linking to its blog post.
5. **"From the blog" strip** on the home page with the latest 3 posts.
6. **Speaker roll: headliners first.** 6–10 large cards, then the rest as a compact list.
   Keep the Betts-LaCroix / de Grey spacing rule.

**Needs your materials:**
7. **Our own film**: a 60–90s cut from event footage replacing the stock hero loop, plus
   the full version in a "Watch the month" section.
8. **Photo wall**, 8–16 images, captioned with date and place (SXSW-style dated moments).
9. **Final numbers**: attendees, countries, Demo Day companies, side events.
10. **Month-in-review post** (Edge City model) as the first blog post: numbers, what
    was built, rituals, ending on 2027.

**Needs a decision:**
11. **2027 dates and city in the hero**, even approximate ("Kobe · October 2027").
12. **Founding-resident offer** for pre-registrants or 2026 alumni (first access or an
    early price with a dated deadline). Avoid countdowns.
13. **Talk recordings** if the summits were filmed (Stripe/ARDD archive model).
