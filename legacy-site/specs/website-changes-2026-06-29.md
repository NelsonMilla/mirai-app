# Requirements: Website changes (cofounder doc, 29 June 2026)

Source: "Website changes 29 june 2026.pdf" (ops cofounder). This spec translates that document
into implementable requirements, assessed against our OKRs: **excite sponsors, excite
participants, excite speakers.** Items are grouped by disposition. Each item lists current
state (verified against the codebase) so implementation agents don't rediscover it.

Site: Next.js 16 app in `mirai-app/`. All copy hardcoded — `src/lib/constants.ts` (tracks,
chapters, FAQ, lifestyle cards, partners), `src/data/fighters.ts` (speaker roster). Forms →
Notion via server actions (`src/app/apply/actions.ts`), email via Resend, payments via Stripe
(`/api/checkout` + token whitelist), mailing list via MailerLite, analytics via PostHog.
**Read `node_modules/next/dist/docs/` before writing Next.js code (per AGENTS.md — this Next
version has breaking changes).**

---

## A. Implement as requested

### A1. Update speaker roster (PDF "Confirmed Speakers")
**OKR:** Speakers + participants. Aubrey de Grey is a marquee longevity name; this is the
single highest-leverage credibility change in the doc.
**Current:** `src/data/fighters.ts` has 5 confirmed (Rodney Kelly, Rob Claar, Juliette Humer,
Masa Nakatsu, Zoe) + 2 mystery slots. Counter renders "7/24 Fighters confirmed"
(`fighters.filter(f => !f.mystery).length + 2` — revisit the +2 offset when adding).
**Add (people):** Jose Cordeiro (PDF: "Cordeiros" — verify spelling; likely José Luis
Cordeiro), Aubrey de Grey (LEV Foundation), Cassox (Symbiont Labs), Devinder Sodhi,
Pedro Henrich, Adam Gries, Natalie Coles, Keita Masui (Asagi Labs Ventures), Sumit Jamuar,
Cremeaux, Nelson Milla.
**Not people:** "Kobe Uni" and "KBIC" are institutions → they belong in the communities/
partners wall (A2), not the fighter grid, unless a named speaker is provided.
**Blocked on:** titles + photos for new names (see D). Roster UI supports photo-less entries;
ship with tag `Speaker` and stats, upgrade photos as they arrive.

### A2. Communities / partners logo wall
**OKR:** Sponsors (ecosystem gravity) + participants (who's in the room).
**Current:** `ProofSection.tsx` exists but is **not imported in `page.tsx`** (dead). Partner
data in `constants.ts` is 4 text-only cards.
**Requirement:** One "Communities" section on the landing page: logo grid, each linking out.
Roster from PDF: Viva City (viva.city), KBIC (fbri-kobe.org/kbic/english), Learning Layer
Labs (learninglayer.ai), Biopunk (haus.fund), Aevitas (aevitashouse.bio), CHANGE
(ch-ange.de), Broken Symmetry Capital (brokensymmetry.capital), Vibe Coding Nights
(vibecodingnights.com), LEV Foundation (levf.org), Asagi Labs Ventures (alv.vc), ZuCity
Japan (zucity.org/en/market-homes), HekaBio (heka.bio).
**Approach:** Revive/replace ProofSection; put logos in `public/images/partners/`. The Google
Drive logo folder needs the user to download it (no Drive access from CLI) — see D.
Monochrome/dimmed treatment on hover-color keeps it classy and consistent with the design
system.

### A3. Past events section ("Other events we have supported")
**OKR:** Sponsors — this is the strongest sponsor-facing proof we have.
**Current:** Only a small "community lineage" block on `/fashion-show`. Nothing on landing.
**Requirement:** Landing-page section modeled on Viva City's "Other events we have supported":
compact event cards (name, year/location, one stat line) + photo strip. Events: Vitalia City
Pop-Ups (2 popups, multiple conferences — 500+ builders, regulatory sandboxing, converted to
permanent hub), Viva City Frontier Tower Popup (SF, 400+ ppl, 6-week vertical village,
Demo Day; Peter Diamandis, Aubrey de Grey, Emmett Shear, Putri Friedman), Meet the Drapers
(2 finals with Tim & Adam Draper, thousands of applicants, 40M+ TV viewers, Muse.Bio won $1M
finale), Human Augmentation Summit (MIT Media Lab, ~300 ppl, Stephen Wolfram, Life
Biosciences, MIT, Harvard).
**Blocked on:** photo assets (see D). Cards can ship first; photos slot in after.

### A4. New agenda structure (Open Weeks → Summits → Fashion Show)
**OKR:** All three — the summit is the anchor for speakers and sponsors; the agenda is the #1
participant question.
**Current:** `chapters[]` in constants.ts = EP.01 Arrival (Oct 1–7), EP.02 Longevity Biotech
(8–14), EP.03 Human Enhancement (15–21), EP.04 Fashion Show & Close (22–31). This no longer
matches the real program.
**New structure (from PDF):**
- **Open Weeks / Community Integration — Oct 1–16.** Arrivals & tours (Oct 1–3), Welcome Day
  Oct 4 (do NOT publish "Byron's Bday"), KBIC lab tours, JETRO soft-landing, residency begins,
  Japan exploration.
- **Longevity Biomedical Summit I — Oct 17–18: "The Science & Tech Augmenting Life."**
  Detail: Japan's Longevity Imperative; KBIC as a global laboratory for longevity;
  Bioengineering · MedTech · Biostasis · Replacement & Augmentation; Women's Health: The Next
  Trillion-Dollar Market; AI×Longevity Bio.
- **Longevity Biomedical Summit II — Oct 24–25: "From East to West: Bridging the Longevity
  Gap."** Detail: longevity trends, supercentenarians, impact & bottlenecks; stakeholders
  (investment, R&D, entrepreneurship, founders, regulation as acceleration); Japan's model:
  conditional approval generating real-world evidence; Visions for the Future.
- **Enhanced Fashion Show & Demo Day — date CONFLICT, see D1.** Companies present; live demo
  day reimagined as runway; device residents showcase prototypes where "science becomes
  couture." Prototype polish, PMDA regulatory submissions, press day & media preview.
**Approach:** Rewrite `chapters[]` content; keep the existing 4-chapter expandable-card UI —
it already implements the PDF's "WHEN IT OPENS (click)" behavior. 4 chapters map cleanly:
Open Weeks / Summit I / Summit II / Fashion Show & Close.
**Summit topic tags:** render the four themes **Biomedical · Policy · Community · AI** as
content tags inside the summit chapters (see C2 — they are NOT replacing application tracks).

### A5. Company showcase pipeline (PDF item 1)
**OKR:** Sponsors — directly creates the sponsor/demo-day funnel and a go-to-market
assessment list.
**Requirement:** Ticket-holding companies can apply to be showcased (Demo Day / Fashion Show).
Collect enough to assess go-to-market candidacy: company, contact, role, what they'd showcase,
stage, regulatory status, link.
**Approach:** Reuse the existing form→Notion pattern (`submitApplication()` in
`src/app/apply/actions.ts`, Resend confirmation, PostHog capture) with a new Notion DB or a
"Showcase" tag. Entry points: (1) checkout success page (`/checkout/success` is currently a
placeholder — the natural "after they buy a ticket" hook), (2) a "Showcase your company" card
in the Fashion Show section/page. Keep it one short form, not a new multi-step wizard.

### A6. Partner path (縁) → email
**OKR:** Sponsors.
**Current:** Apply section offers 3 track pills + Apply CTA (Luma). `/fashion-show` already
routes sponsors to pedro@frontierhumans.com.
**Requirement:** Add a "Partner" path alongside the apply options — mailto CTA (confirm
address, see D). Small change to `ApplySection.tsx` / `QuickActions`.

---

## B. Implement, but reshaped to avoid text bloat

### B1. Hero/description points (PDF items 2–3)
**Proposed title "Build the NEXT GEN of Biotech?"** — the live hero is already "Build the
**future** of biotech — in 4 weeks", which says the same thing with more specificity and no
question mark. **Recommend keeping the current headline** (see C1) and instead weaving the
four description points into existing copy slots, which is what the cofounder actually needs:
- (a) "One-month co-building in Kobe & KBIC, Japan's most advanced Biomedical National
  Strategic Special Zone" → hero subheadline + Kobe section lead. "National Strategic Special
  Zone" is a real, checkable credential — sponsors care; use it verbatim once.
- (b) "Sharpest minds… curing and preventing age-related disease and enhancing life" → hero
  sub or manifesto block.
- (c) "Japan — where it matters most and is achievable — advanced regulations and
  infrastructure" → already the thesis of the Kobe section ("What takes years elsewhere takes
  months here") — tighten, don't duplicate.
- (d) "We are not a conference. Not an accelerator…" — **already live** in the manifesto
  (the PDF screenshots our own site). Add the "from 'working on it' to 'in patients'" line
  where missing. The alternative "un-conference/summit/showcase" phrasing can inform the
  agenda chapter synopses.
Each point gets exactly one home. No new paragraph-stack section.

### B2. Logistics & community info (Notion, hotel, housing, calendar)
**OKR:** Participants — reduces friction/anxiety; but a raw link list would read as a wiki
dump and dilute the sales page.
**Requirement:** One compact "Practical" strip (or extension of the Kobe section / FAQ):
- **Stay:** Partner hotel Portopia (booking link — verify params, see D) + hacker-house
  options: The Sanctuary, Biopunk House, Aevitas, ZuCity. One line each, external links.
- **Community guide:** one link to the Notion (guidelines + resources). The
  global-biolab-atlas.netlify.app "(add to notion)" note is an internal Notion task, not
  website content — pass back to ops.
- Add 1–2 FAQ items ("Where do I stay?", "What is a popup city?" — the Zo Village
  "compound" framing from the PDF preamble is a good model for the latter).
Details beyond this belong in the post-acceptance email/Notion, not the public page.

### B3. Community calendar / side events
**OKR:** Participants (agency: "I can host something") + sponsors (activation surface).
**Requirement:** A "Side Events" card in the practical strip: link to the community calendar
(Luma), plus a "Propose an event" link with one line noting events are screened/approved
(IVS model — protects the brand if something goes wrong). **Do not build calendar
infrastructure** — Luma already does approval-gated submissions. Copy can borrow IVS's
framing; keep to ~2 sentences.

### B4. "THE MONTH in DETAIL" 5-week grid
The PDF's full week-by-week table repeats the same 6 items (Vibe Coding Nights, The
Residency, Learning Layer Labs, Biohackers Workshops, Social, Me-Time by Change) across ~30
cells. **Shipping it as a table would be pure bloat.** Reshape as a "Every week on Port
Island" recurring-programming strip (6 items, one line each) inside/next to the month
section, with the summits and fashion show as the standout dates. Same information, ~90%
less surface. Detailed daily schedule → community calendar link (B3).

---

## C. Push back (with reasoning for the cofounder)

### C1. Replacing the hero title with "Build the NEXT GEN of Biotech?"
The current headline already communicates this, is more concrete ("in 4 weeks"), and the
interrogative form weakens a landing page whose job is conviction. The event-pack deck may
need its own language; the website shouldn't regress to match a slide. **Counter-proposal:**
keep headline, adopt the description points per B1. If the cofounder feels strongly, A/B
copy is cheap to revisit — but default is no change.

### C2. "Tracks: Biomedical - Policy - Community - AI"
These cannot replace the application tracks (Devices/Therapies/Builder) without breaking the
product: track selection drives the mascot/evolution system, apply flow, Stripe/whitelist
routing, and the three tracks map to real offerings (lab access, PMDA pathway, community
pass). Reading the PDF's agenda, these four are **summit content themes** (AI×BIO, policy/
regulation, community all appear as summit topics). **Counter-proposal:** render them as
theme tags on the Summit chapters (A4). Needs cofounder confirmation (D4).

### C3. "塾 Residency" as a single path (implied merge of Devices + Therapies)
The PDF's "Paths" line lists Residency / Builder / Partner. Collapsing Devices+Therapies
into one "Residency" is a product decision with real cost (distinct value props, distinct
Stripe/application routing, the entire track-selection UX) and unclear benefit. Devices and
Therapies genuinely differ (lab access vs. PMDA pathway). **Counter-proposal:** keep both
residencies; present the path hierarchy as "Residency (Devices | Therapies) / Builder /
Partner" and add the Partner path (A6). Confirm intent (D4).

---

## D. Blocked on input (cannot proceed without answers/assets)

1. **Fashion Show date conflict:** PDF says Oct 26 (a Monday); the live `/fashion-show` page
   says Oct 31, 19:00 JST; PDF week grid also shows weeks continuing to Oct 31. Which is it?
   Everything in A4 needs this.
2. **Assets:** partner/community logos (Google Drive folder — needs manual download to
   `public/images/partners/`; agents can pull from partner websites as fallback) and past-
   event photos for A3 (originals preferred over PDF extraction).
3. **Speaker details (A1):** titles, affiliations, photos for the 11 new names; correct
   spelling of Jose Cordeiro; named speakers (if any) for Kobe Uni / KBIC.
4. **Confirmations:** C2 (summit themes, not app tracks?) and C3 (keep two residencies?);
   partner-path email address (pedro@frontierhumans.com?).
5. **Link hygiene:** Portopia booking URL has checkin 2026/10/31 → checkout 2026/11/01
   (one night, wrong dates?) — get the intended booking link. "Biopunk house" URL in the PDF
   duplicates thesanctuary.to — get the real URL (haus.fund?).
6. **Summit I/II title swap in PDF:** the summary table titles Summit I "The Science & Tech
   Augmenting Life" (17–18) and Summit II "From East to West" (24–25), but the week grid
   labels both weekends inconsistently. A4 assumes the summary table is correct — confirm.

---

## Decisions (cofounder, 5 July 2026)

- **C1 resolved:** Keep existing hero title. No headline change.
- **C2 resolved:** Keep Devices/Therapies/Builder tracks exactly as-is. Note: many site
  features are dead code — the live funnel is landing page → Luma for tickets. Only the
  landing page needs to change; don't invest in dead flows (e.g. checkout success hook).
- **C3 resolved:** Residency / Builder / Partner framing approved.
- **D1:** Fashion Show is **Oct 26** (fix /fashion-show page which says Oct 31).
- **D2:** Logos delivered → `public/images/partners/` (10 files, kebab-case). Missing:
  CHANGE, LEV Foundation → text placeholders.
- **D3:** New speakers ship as name-only placeholders; photos/titles to follow.
- **D4:** Fix Portopia link dates (event month). Biopunk House links to thesanctuary.to
  (they are rebranding — intentional duplicate with The Sanctuary).
- **D5:** Partner path email: pedro@frontierhumans.com.
- **Still open:** public Notion guide URL and community-calendar URL — ship clearly marked
  placeholder links, flag in report.

## Implementation notes (for orchestration)

Suggested work packages, largely independent:
1. **Data/copy package:** constants.ts rewrite (chapters, FAQ additions), hero/Kobe copy
   weave (B1) — one agent, most conflict-prone file, do first.
2. **Roster package:** fighters.ts additions + counter offset (A1).
3. **Communities + past events package:** new/revived sections (A2, A3) — shares visual
   language, one agent.
4. **Practical/logistics package:** stay/notion/side-events strip + FAQ (B2, B3, B4 strip).
5. **Showcase + partner path package:** form + Notion wiring + checkout-success hook (A5, A6).
Verify each in the browser (npm run dev, port 3000); the page is heavily animated — check
reduced-motion and mobile breakpoints for new sections.
