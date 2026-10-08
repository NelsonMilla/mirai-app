# The program page, from the Google Sheet

Branch: `feat/agenda-sheet` (third ticket group; follows `agenda-sheet-prd.md` and
`speakers-sheet-prd.md`). Written 2026-10-07. One commit per ticket, prefixed `P<n>:`.

## Problem Statement

The team wrote a full programme booklet as a standalone artifact: 67 confirmed speakers
with bios and session chips, 8 Demo Day startups, and a 98-slot timetable across the five
summit days with venues and map links. None of it is on the site. The landing page shows a
nine-session rail and /conferences/ shows names with S1/S2/F marks, but nobody can see what
happens at 11:35 on 17 October, who is on which panel, or where to go. The booklet also
carries newer speaker data than the site: bios the site has never had, affiliations that
changed, 17 people the site does not list, and small photos for 55 of them.

## Solution

A new subpage, `/program/`, in the site's own design system, that renders the whole
timetable day by day from a new `Program` tab in the Mirai Agenda spreadsheet and the
speaker roster from the existing `Speakers` tab. Clicking a speaker's name anywhere on the
page opens the same talk-and-bio panel as /conferences/. The artifact's data becomes the
seed for both tabs: the Speakers seed is merged (bios, sessions, affiliations and new
people from the artifact; nothing dropped), the 55 photos are saved under the site's photo
naming rule, and the Program seed holds every slot plus the Demo Day pitches. Snapshot
first, sheet second, as on every other page.

## User Stories

1. As a visitor, I want to see the full timetable for each summit day, so that I can plan which sessions to attend.
2. As a visitor, I want the venue and a map link per day, so that I know where to go.
3. As a visitor, I want to click a speaker's name in the timetable and read their bio and talk, so that I know who is speaking.
4. As a visitor, I want breaks, keynotes, panels and openings to look different from talks, so that I can scan the day.
5. As a visitor, I want sessions whose title is not yet confirmed to look provisional, so that I am not misled.
6. As a visitor on a phone, I want one day at a time with easy switching, so that the timetable is readable at 375 wide.
7. As a visitor, I want the Demo Day pitches listed with a line on each startup, so that I know who is pitching.
8. As a visitor, I want the roster of speakers with photos on the same page, so that I do not have to go elsewhere.
9. As a visitor, I want the page to appear instantly and work when Google is slow, so that it never looks broken.
10. As the agenda owner, I want to edit a slot's time, title or speakers in a spreadsheet, so that the page updates without an engineer.
11. As the agenda owner, I want to add or remove a slot by adding or deleting a row, so that the day re-flows by itself.
12. As the agenda owner, I want to type a day's venue once, so that I do not repeat it on every row.
13. As the agenda owner, I want speaker names in a slot to link to the speaker automatically, so that I only type the name.
14. As the agenda owner, I want a Publish flag on slots, so that I can draft a day before announcing it.
15. As the agenda owner, I want the bios and sessions from the booklet already in the Speakers tab, so that I do not retype 60 bios.
16. As the agenda owner, I want a written guide to the Program columns, so that I can edit without asking.
17. As Nelson, I want nothing from the current roster dropped without my say, so that I decide who is out.
18. As Nelson, I want the page's claims (prizes, partners) to be the booklet's own words and flagged for review, so that nothing unearned ships silently.
19. As the site owner, I want the speaker count on the page computed, so that it matches the roster.
20. As the site owner, I want the page in the sitemap, llms.txt and site.yml, and linked from the landing agenda and /conferences/, so that people and crawlers find it.
21. As the site owner, I want sheet text never inserted as HTML and only https map links accepted, so that the public sheet cannot inject anything.
22. As the site owner, I want unit tests for the program model and a smoke test for the page, so that regressions are caught.
23. As an engineer, I want the speaker panel in one shared script used by /conferences/ and /program/, so that a fix lands once.

## Implementation Decisions

### Program tab (new, same spreadsheet, named exactly `Program`)

Columns, header matched case-insensitively with whitespace removed:

- `Day` (required): the day label as shown, e.g. `Saturday 17 October`. Days appear in order of first appearance. A label of the form `<Weekday> <number> <Month>` also yields a short form `Sat 17 Oct` for the day switcher.
- `Venue`, `Venue link`: taken from the first non-empty value within the day. A link is kept only if it starts with `https://`.
- `Start`, `End`: `HH:MM` text, shown as typed. Empty allowed (pitch rows).
- `Kind`: `open`, `keynote`, `panel`, `break`, `pitch`, or blank meaning an ordinary talk.
- `Block`: the running-order label (e.g. `Keynote`, `Japan: The Global Laboratory`).
- `Title`: the session title. Empty or containing "to be confirmed" renders as provisional.
- `Speakers`: entries separated by `;`, each `Name (Affiliation)` with the parentheses optional. Each name is resolved against the Speakers tab by a lenient key (honorifics and punctuation stripped, first name plus final surname token); a resolved name is clickable and opens the panel, an unresolved one renders as plain text with its affiliation.
- `Notes`: optional one line under the title (used for the Demo Day pitch descriptions).
- `Publish`: same rule as the other tabs.

Seed: `program-template.csv`, 98 timetable rows from the artifact plus 8 `pitch` rows under Monday 26 October (Block `Demo Day pitches`, Title = startup, Notes = its line). URL: the spreadsheet's CSV export with `sheet=Program`. Until the tab exists the page shows the snapshot.

### Speakers seed merge (already applied in P0)

- 55 current rows kept; 17 people from the artifact added (Display name from the artifact, first/last split, `Show on` empty, `Group` guessed from the affiliation and flagged for review).
- For matched rows the artifact's affiliation, bio and session chips win (`Summit I`→S1, `Summit II`→S2, `Longevity Lifestyle & Demo Day` and `Demo Day jury`→F, `Online`→Online). `Talk` is the title of the first non-break, non-opening slot the person appears in, preferring slots where they speak alone. Seed display names, first/last, `Show on`, `Group` and photo overrides are kept.
- Five current speakers are not in the artifact and stay published, flagged: Ada Cyborg, Yuri Deigin, Sebastian Brunemeier, Sandeep Casi, Sumit Jamuar.
- Photos: the artifact's 55 JPEGs (260 to 320 px square) are saved as `img/speakers/<first_last>.jpeg` under the site's rule; rows with an existing larger photo keep their override.

### Modules

1. **Program core** (pure, testable). `window.MiraiProgram = { buildModel(rows, speakersModel), load }`. `buildModel` returns `{ days: [{ id, label, short, venue, venueLink, slots: [{ start, end, kind, block, title, tbc, notes, speakers: [{ name, affiliation, id }] }] }], count, speakerCount }`, published rows only, in order, with `id` the slug of the label. `kind` normalised to one of `talk | open | keynote | panel | break | pitch`. `speakers[].id` is the matching speaker's id from the speakers model or `null`. `load({ url, snapshot, speakersModel, render })` follows the established pattern (`[program]` warn prefix).
2. **Program snapshot data** `program-data.js` (generated in P0): `window.MIRAI_PROGRAM_SHEET_CSV` and `window.MIRAI_PROGRAM_SNAPSHOT`.
3. **Shared speaker panel** `speaker-panel.js`: the panel built for /conferences/ moves into one classic script exposing `window.MiraiSpeakerPanel = { attach({ root, panel, speakersById }) → { open(id, openerEl), close(), refresh(speakersById) } }` with the same markup, a11y and keyboard behaviour; /conferences/ switches to it with no visible change; /program/ uses it with one panel near the timetable (opened from speaker names) and reuses it for the roster grid.
4. **The page** `/program/index.html`, self-contained like the other subpages (own `<style>`, `/nav.js`, `/nav.css`, analytics scripts, data-track-section on each section, Switzer + IBM Plex Mono, dark theme per DESIGN.md). Sections:
   - Masthead: eyebrow `The program · Oct 17–26 · Kobe`, h1 `The program.`, lead sentence with the computed speaker count: "<N> speakers across Summit I (17–18 October), Summit II (24–25 October) and the Demo Day (26 October). All times JST." Plain words, no metaphors.
   - Day switcher: one button per day (short label), sticky under the fixed nav, keyboard operable (arrow keys), the active day in the URL hash so a reload keeps it; all days are in the DOM, only the active one shown; with JS the first day is active by default.
   - Day: full label, venue with "Map ↗" link (https only, `rel="noopener"`), then the timetable as a ruled list: time column in mono (`11:00–11:10`), block label in mono caps, title, speakers (name buttons with affiliation after), notes line. Kinds: `break` muted, `keynote` with the cyan accent mark, `panel` and `open` labelled by their block text, `pitch` rows rendered as a separate "Demo Day pitches" list after the timetable (name + notes). Provisional titles faint with "to be confirmed".
   - Demo Day awards: the artifact's awards copy under Monday 26 October (static, in the page), flagged in the report for Nelson's claims review.
   - Roster: every published speaker as a card (photo or initials, name, affiliation, session marks), in sheet order, click opens the panel.
   - Footer and nav as the other subpages.
   - Sheet text via text nodes only. No new colours, no new fonts, no dependencies.
5. **Registration and links**: `sitemap.xml`, `llms.txt`, `site.yml` pages list, `README.md` bullet; the landing agenda rail's note gains a "Full program →" link to `/program/`; the /conferences/ "The programme, in full" table caption or heading links to `/program/`. The nav is unchanged (Summits keeps pointing at /conferences/).
6. **Runbook**: AGENDA.md gains a Program section (tab name, columns, speaker-cell format, kinds, venue-once rule, pitch rows, Notes).

## Testing Decisions

Prior art: `test/speakers.test.js`, the speakers block in `legacy-site/e2e/smoke.spec.ts`.

- **Program core**: day grouping and order, short label derivation (and fallback to the label), venue and link once per day and the https rule, kind normalisation, tbc detection, speaker cell parsing (with and without affiliation, stray spaces, trailing `;`), id resolution against a speakers model including honorifics ("Prof. Takahiro Yasuda" → the Takahiro Yasuda row) and no match, publish filter, the seed snapshot building to 5 days, 106 rows (98 slots + 8 pitches), the Monday day holding the 8 pitches.
- **Speakers tests**: the seed test updates to 72 speakers; the featured sets per page are unchanged; groups 22 + 17 guessed… the exact numbers come from the merged seed and the test asserts them.
- **Smoke**: `/program/` added to the cross-viewport `PAGES` list in `smoke.spec.ts` and to the `PAGES` constant in `analytics.spec.ts` (both lists, per the repo rule); a program test with a fixture Program CSV asserting days, a slot's time/title/speaker, a clickable speaker opening the panel, the pitch list, the day switcher, and the snapshot fallback with the sheet aborted. /conferences/ smoke and speakers tests stay green after the panel extraction.

## Out of Scope

- A light "booklet" look. The page follows DESIGN.md.
- Filtering or search on the roster.
- Per-slot rooms or tracks beyond the day venue.
- Japanese version of the program.
- Changing which speakers are published (Nelson decides on the five not in the artifact and on the 17 new groups).

## Further Notes

- The booklet's prize list for Demo Day names third parties (Vitalist Bay, Meet the Drapers Japan, Antler Japan, GlobalDeal). It ships as the booklet wrote it and is called out in the final report for a claims check.
- The artifact photos are small thumbnails. They are fine for list cards and the panel; the nine existing high-resolution photos keep their overrides.
- The booklet says 67 confirmed speakers. The merged roster has 72 because five current names are kept; the page shows whatever the sheet publishes.

## Tickets

| # | Ticket | Owner | Definition of Done |
|---|--------|-------|--------------------|
| P0 | PRD, Program seed, merged Speakers seed, photos, both snapshots | Integrator | Committed. |
| P1 | Program core + unit tests; speakers tests updated to the merged seed | Agent A | `npm test` green. |
| P2 | Shared speaker panel script; /conferences/ switched to it; `/program/` page | Agent B | Page renders snapshot and sheet at 375 and 1280; /conferences/ unchanged visually; panel works on both. |
| P3 | Smoke + analytics PAGES, program smoke test, runbook, sitemap/llms/site.yml/README, links from landing and /conferences/ | Agent C | Playwright green against the worktree server; registrations complete. |
| P4 | Integration, browser verification, commits | Integrator | All tests green; screenshots; one commit per ticket. |
