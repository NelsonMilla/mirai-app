# /conferences — component inventory (source of truth for the rework)

Captured 2026-09-10 from `new-site/conferences/index.html` (781 lines, 58 KB). Measured at 1024×768: 9,327 px ≈ 12.1 viewport-heights with the speaker accordion collapsed. Companion to `apple-product-pages.md`.

## Page order and weight

| # | Section | Lines | `data-track-section` | Height | Media | CTAs |
|---|---|---|---|---|---|---|
| 1 | Nav (injected by `/nav.js`) | 298 | — | fixed pill | — | Get Tickets → Luma |
| 2 | Hero `header.hero` | 300–318 | hero | 1.17 vh | harbor-golden-hour.webp | pair |
| 3 | Partner wall `.logos` | 320–334 | partners | 0.30 vh | 9 logos + LEV text | 10 outbound |
| 4 | Statement band | 336–340 | statement | 0.55 vh | none | none |
| 5 | Why Japan | 342–379 | why_japan | 1.58 vh | none | none |
| 6 | Why now | 381–415 | why_now | 1.57 vh | none | pair |
| 7 | Kobe photo strip `.strip` | 417–423 | kobe_strip | 0.36 vh | 5 photos | none |
| 8 | Who is this for + speakers | 425–658 | who_for | 2.69 vh | 3 inline SVGs, 5 portraits | pair |
| 9 | Offer `#apply` | 660–749 | offer | 2.97 vh | none | pair |
| 10 | Closing | 751–762 | closing | 0.83 vh | future-city-1440.webp, daruma.png | pair |
| 11 | Footer | 764–768 | — | 92 px | none | miraitech.city |

"pair" = `Get my package — $2,500` → `https://luma.com/an4zotn9` (same tab) + `Talk to us first` → `https://t.me/+ZMuhGH9YEcxiNWU8`.

## Copy per section (verbatim headlines, summarised bodies)

**Hero.** Eyebrow "For biotech founders · Kobe Biomedical Innovation Cluster". H1 "Japan is the best global ecosystem for frontier biotech". Dateline "Summit I · 17–18 Oct · Summit II · 24–25 Oct · Finale · 26 Oct 2026". Lead: fast-track to market in as little as six months, data into FDA/EMA years earlier, private companies shape regulation through special zones. Proof row: 4 summit days · 100+ speakers · 370+ biomedical organisations on Port Island · 20+ supporting organisations.

**Partners.** "With support of": KBIC, Kobe University, MedTech Innovation Center, HekaBio, Asagi Labs Ventures, Broken Symmetry Capital, Vitalist Bay, LEV Foundation (text only, no logo file), Augmentation Lab, Biopunk. Files in `/img/partners/`, all exist. `.logo-flat` / `.logo-flat-light` use `mix-blend-mode: screen` hacks that were not visually verified.

**Statement.** "Mirai Tech City is connecting US, EU and Japanese companies, scientists, investors and legislators to accelerate frontier biotech."

**Why Japan (kanji 壱).** Sub: "Cell and gene therapy, AI-designed drugs, N-of-1 medicine, brain-computer interfaces. Trillions of dollars, and the definition of human biology itself."
- 01 Commercialization in as little as a year: Act on the Safety of Regenerative Medicine, self-pay sale on Phase 1 safety data, six to twelve months; Conditional Early Approval for small molecules, biologics, devices, ~four years ahead of the FDA.
- 02 Nobel-grade science, FDA-bound data: Nobel researchers at Kyoto and Osaka, RIKEN, purpose-built clinical clusters, iPS cells invented here and first therapies to market in 2026, every patient followed for life in one national database, FDA and EMA accept the data.
- 03 Propose your own regulation: sandboxes, ten National Strategic Special Zones, two Super Cities, private entities propose regulation, test openly, spread nationally.
- 04 One of the world's most attractive markets: third-largest pharma market and R&D spender, $146 billion/yr (¥23.8 trillion), 3.7% of GDP, biotech R&D up 32% last year, AMED matches registered VC 2:1 in non-dilutive grants, national insurance pays 70–90% with a monthly patient cap.
- Outcome strip: 10× faster to first revenue · 100× cheaper than the Phase 3 route · +61% more commercial value from the same patent.

**Why now (kanji 弐).** Sub: "The machinery exists, the government has the votes, and the data finally travels."
- 01 A supermajority that has made biotech a priority: LDP two-thirds supermajority February 2026; two-thirds of US/EU-approved drugs of the past decade never began development in Japan; ageing population; biotech and startups among seventeen strategic sectors.
- 02 Japan data, straight into FDA and EMA: ICH E6(R3) global standard 2025; Annex 2 adopted June 2026, effective in Europe January 2027; Japan data usable directly in FDA/EMA filings.
- 03 Demand does not wait for approval: GLP-1 precedent; compounded copies and unregulated clinics; Japan's doctrine is safety first, commercialization on the way to efficacy.
- 04 Biotech is the next AI race: N-of-1 therapies cannot run thousand-patient trials; no brain implant for paralysis holds full market approval anywhere; sandboxes, special zones, conditional approval covering devices.

**Kobe strip.** 01 Harbor (harbor-golden-hour, reused from hero) · 02 Izakaya · 03 Lanterns · 04 Port Tower · 05 Rokko. 640w + full srcsets, all exist. Mobile hides 05.

**Who is this program for?** Sub: "For biotech startups preparing for clinical trials, or post Phase 1b, aiming to reach patients 10× faster at a fraction of the cost".
- i Bio (7 items): regenerative medicine (iPS, stem cells, tissue engineering), gene therapy and editing, cell therapy and immunotherapy, biologics/antibodies/RNA, small molecules incl. senolytics, epigenetic and partial reprogramming, organ and tissue replacement. Note: first three via the Act, rest via Conditional Early Approval.
- ii Human-machine interfaces (6): BCIs, neurotech and neuromodulation, bionics/prosthetics/exoskeletons, surgical and care robotics, implantable sensors and diagnostics, sensory augmentation. Note: no paralysis BCI holds full approval anywhere; Japan's conditional route covers devices.
- iii AI & digital twins (7): AI drug/protein design, in-silico trials and synthetic control arms, patient digital twins, N-of-1 and personalized therapies, continuous preventive medicine, biological foundation models, data sovereignty and AI agent rights. Note: one-patient therapies, national lifetime database, FDA/EMA accept.
- Art: three hand-authored inline SVGs (helix over lattice, profile into nodes, mirrored figure over grid), cyan-only.
- Featured speakers (1:1, grayscale → colour on hover): 01 Aubrey de Grey (LEV Foundation) · 02 Brian Kennedy (NUS Centre for Healthy Longevity) · 03 Motoshi Hayano (Keio University) · 04 Yuki Hanyu (IntegriCulture) · 05 Adam Gries (Vitalist Bay). Files aubrey/kennedy/hayano/yuki/adam.webp exist. Mobile hides 05.
- Manifest "Confirmed speakers — 55", legend S1 Oct 17–18 · S2 Oct 24–25 · F Finale Oct 26. Rows 06–14 visible, 15–55 behind a native `<details>` ("Show all 55 confirmed speakers" ⇄ "Show fewer", summary sticky at bottom when open). Full roster with affiliations and session tags is in the page source lines 587–651. Tally: S2 ×21, S1 ×18, F ×3, combos ×5, blank ×3 (rows 49–51, Eighteen Six).

**Offer `#apply`.** H2 "Join us this October at the Kobe Biomedical Innovation Cluster".
- 01 Workshops: a go-to-market plan measured in months, built against both approval routes, with people who have taken products through both.
- 02 Network: AMED-registered funds, Port Island institutions, licensing partners.
- 03 Regulatory drafting: sit in the Special Zone proposal drafting sessions.
- Lede: "The package, and what the same things cost if you buy them separately."
- Value stack: Summit I Oct 17–18 "The Science & Tech Augmenting Life" $900 · Summit II Oct 24–25 "From East to West: Bridging the Longevity Gap" $900 · Hotel in Sannomiya 12 nights Oct 16–28 (rooms $120–135/night) $1,500 · Finale Oct 26, Frontier Human Fashion Show & Demo Day at Orbis Hall $300 · Co-working and lab access $600 · Social program (breakfast at MedTech Innovation Center, cluster tours, dinners, izakaya, onsens, Rokko, side events) $800 · Japan go-to-market and regulatory plan (consultancy $15,000–25,000, $300–500/hr) $15,000 · Access to capital and partners (partnering passes $2,000–3,000, BD retainer $2,500–5,000/mo) $8,000 · A hand in drafting the Special Zone proposal (policy consultancies $5,000–15,000/mo boutique, $15,000–30,000/mo mid-size, one-year minimums) $20,000 · Total, at market $48,000 (sums exactly).
- `.ask` box: struck "instead of $48,000 · two weekends alone are $1,800"; $2,500; "Launch price. $4,000 after."; right column "Launch price / Both weekends · 12 nights · the finale / Morning breakfast included".
- Closer: the drafting room is the one line you cannot buy anywhere; it is what this October is.

**Closing.** H2 "Go to market in six months". "Both summit weekends, the week between them, and a room in Sannomiya for the whole run. Kobe, Japan." Backdrop future-city-1440.webp with radial veil, static daruma.png at 68 px.

**Footer.** "Mirai Tech City · Kobe Biomedical Innovation Cluster, Port Island" → miraitech.city.

## Pricing occurrences

$2,500 appears six times as the offer price: five CTA labels (hero, why_now, who_for, offer, closing) and the `.ask` hero number. All other figures live in the single value stack. No tier table, no per-item purchase path.

## Information budget (89 items, the redesign must keep all)

Identity: summits in Kobe · KBIC on Port Island · audience = biotech startups pre-trial or post Phase 1b · "best global ecosystem" claim · US/EU/Japan connecting mission · Sannomiya lodging · Orbis Hall finale · MedTech Innovation Center breakfast.
Dates: Summit I 17–18 Oct · Summit II 24–25 Oct · Finale 26 Oct · hotel Oct 16–28, 12 nights · 4 summit days · the week between · Summit I theme · Summit II theme · finale = Fashion Show & Demo Day.
Scale: 100+ speakers (hero) · 55 confirmed (manifest) · 370+ organisations · 20+ supporters · 10 named partners.
Regulatory argument: items 23–42 above (Act, six to twelve months, Conditional Early Approval, Kyoto/Osaka, RIKEN, clusters, iPS 2026, national database, FDA/EMA acceptance, sandboxes, ten zones, two Super Cities, private proposals, 3rd market, 3rd R&D, $146bn/¥23.8T, 3.7% GDP, +32%, AMED 2:1, 70–90% insurance).
Timing argument: items 43–55 (LDP supermajority Feb 2026, two-thirds of drugs never developed here, ageing, seventeen sectors, ICH E6(R3) 2025, Annex 2 June 2026 / Jan 2027, GLP-1, compounded copies, safety-first doctrine, N-of-1, paralysis BCI).
Outcomes: 10× faster · 100× cheaper · +61% · six months.
Areas: Bio 7 + routing note · HMI 6 + note · AI 7 + note.
People: 5 headliners · 50 named speakers · per-speaker session tag · legend.
What you get: workshops · network · regulatory drafting · co-working/lab · social program · 12 nights · finale access.
Price: $2,500 · $4,000 after · $48,000 · nine line items · seven external anchors · $1,800 · breakfast included · the non-purchasable argument.
Place: five Kobe photos. Funnel: Luma · Telegram · ten partner sites · sibling pages · miraitech.city · daruma.

## Redundancies to collapse

- Identical CTA pair ×5, plus nav Get Tickets to the same URL.
- Paralysis-BCI sentence verbatim at L406 and L522. N-of-1 sentence at L406 and L574. National-database sentence at L358 and L574. FDA/EMA acceptance ×4.
- Sandboxes / ten zones / two Super Cities near-verbatim at L363 and L679.
- Act on the Safety of Regenerative Medicine ×3, Conditional Early Approval ×5.
- Hero lead restates Why-Japan 01–03. Date triple on six surfaces. KBIC spelled out ×5. "10× faster" ×2. "$48,000" ×2. "Launch price" twice in one box. Package contents restated three times (stack, `.ask-r`, closing). harbor-golden-hour image ×3. "six months" ×4.

## Shared dependencies

`/nav.css`, `/nav.js` (injects nav, `aria-current` on Summits, does not use `data-cta-label` override here), `/posthog.js`, `/analytics.js` (Section Viewed on 9 tracked sections, Checkout Opened on `data-analytics-action="checkout"`, Alternative Offer Clicked on Telegram links, Purchase Completed via Luma postMessage; the `<details>` speaker expander is uninstrumented), Vercel insights, Fontshare Switzer, Google IBM Plex Mono. `/copy.js` is NOT loaded; all copy is inline.

## Broken, placeholder, or off-spec

Factual: 100+ speakers vs 55 confirmed in one scroll · 20+ supporters vs 10 logos · rows 49–51 blank session · placeholder roster entries (Florian — Antler; Felix Oen — Co-founder & CEO; Sandeep Casi — Investor; Jordan Lasker — Researcher / writer) · "S2·Online" undefined in legend · "Jose" without accent · `<title>` omits Oct 26.
Funnel: price escalation stated three ways across the repo (this page "$4,000 after" with no trigger; /pricing and /summit-bundle "once the 10 are gone"; README "after August 20", already past) · all CTAs hit bare Luma URL with no coupon, ticket preselection or UTM while /summit-bundle uses `?coupon=SFSH&utm_source=summit-bundle&utm_campaign=summit-hotel-package` and `data-luma-ticket-type` · CTAs same-tab, nav CTA new-tab · nav says Get Tickets beside Get my package · Telegram as secondary door (memory says retired) · speaker expander untracked.
DESIGN.md: cyan eyebrow only on hero; Why Japan/Why now use decorative kanji; three sections have no kicker · kanji series stops at 弐 · kanji are static, not tap-reveal chips, no `lang="ja"` · daruma off-spec (68 px, static) · no video anywhere · no countdown or JST clock · Verb Rule broken on three H2s · global `h1,h2,h3{font-weight:850}` · `.ask` box is an undocumented component.
Rendering: `<s>` at L730 strikes through the whole line including "two weekends alone are $1,800" · mobile hides card 5 in both the speaker grid and photo strip, leaving numbering gaps · partner links lack `rel="noopener"` and analytics · no Event JSON-LD · unsourced hard claims (+61%, 100×, 10×, 3.7% GDP, +32%, AMED 2:1, iPS 2026, LDP Feb 2026, the H1 superlative).
Verified fine: $48,000 sums exactly; 5 + 50 = 55; all 26 media files exist and serve 200.
