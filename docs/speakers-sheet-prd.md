# Speakers from the Google Sheet

Branch: `feat/agenda-sheet` (continues the agenda work in `agenda-sheet-prd.md`). Written
2026-10-07. One commit per ticket, prefixed `S<n>:`.

## Problem Statement

Speakers are typed by hand into five pages, and the five disagree. The landing page says
Motoshi Hayano is at Asagi Labs, /conferences/ and /startups/ say Keio University. Yuki
Hanyu is "Cellular Agriculture", "IntegriCulture" and "Shojinmeat Project" depending on the
page. José Cordeiro is "International Longevity Summit" in two places and "The Millennium
Project" in Japanese. The count "55" is typed in four places. Nobody can see a speaker's
talk or bio anywhere, because no page has room for either. Adding a speaker means editing
up to five HTML files and redeploying.

## Solution

A second tab, `Speakers`, in the same public "Mirai Agenda" spreadsheet, one row per
speaker, with name, affiliation, talk, bio, session tags, group, which pages show their
photo card, an optional photo override, Japanese name and role for the Japanese page, and a
publish flag. Every page that lists speakers renders its list from that tab, snapshot first
and sheet second, exactly like the agenda. Counts are computed. On /conferences/, clicking a
speaker opens a panel with their talk and bio. Photos live in the repo as
`img/speakers/first_last.jpeg`; the page derives the filename from the name, a `Photo`
cell overrides it, and a missing file shows an initials tile.

## User Stories

1. As the agenda owner, I want to fix a speaker's affiliation once, so that all five pages agree.
2. As the agenda owner, I want to add a speaker by adding a row, so that no HTML changes.
3. As the agenda owner, I want to write a speaker's talk title and bio in the sheet, so that visitors can read them on /conferences/.
4. As the agenda owner, I want to tag a speaker S1, S2, F or Online, so that the session marks on /conferences/ follow the sheet.
5. As the agenda owner, I want to say which pages show a speaker's photo card, so that the landing page, /experience/, /startups/ and /jp/ can each feature a different handful.
6. As the agenda owner, I want row order to be display order, so that I control who stands next to whom (Joe Betts-LaCroix is never placed beside Aubrey de Grey or LEV people).
7. As the agenda owner, I want a speaker with no photo to look intentional, so that Marian Goodell, who has asked for no photo, still appears in lists without a broken image.
8. As the agenda owner, I want to keep a row unpublished while a speaker is unconfirmed, so that I can prepare it.
9. As the agenda owner, I want the Japanese page to show the Japanese name and role when I provide them, so that /jp/ stays native.
10. As the agenda owner, I want the written guide to list the columns and the photo filename rule, so that I can upload a photo without asking.
11. As Nelson, I want to drop `first_last.jpeg` into one folder and have the right card pick it up, so that photos need no code change.
12. As a visitor to /conferences/, I want to click a name and read the talk and bio, so that I know why that person is worth hearing.
13. As a visitor, I want every speaker list to appear immediately and survive Google being down, so that the pages never look broken.
14. As a visitor, I want a speaker's bio with an ampersand or angle bracket to render as text, so that a public sheet cannot deface the page.
15. As a visitor, I want the headline count to match the number of speakers listed, so that the page is honest.
16. As a visitor on /jp/, I want the four speaker cards to keep their Japanese typography and layout, so that nothing looks translated by machine.
17. As the site owner, I want sheet text never inserted as HTML, and photo paths restricted to same-site paths, so that a public sheet cannot inject anything.
18. As the site owner, I want the Section Viewed and link-click analytics to keep working on every changed page, so that the funnel reporting is intact.
19. As the site owner, I want one CSV parser shared by the agenda and the speakers, so that a parsing fix lands in one place.
20. As the site owner, I want unit tests for the speakers model and smoke tests for each page, so that a malformed sheet or a broken render is caught before it ships.
21. As the site owner, I want the snapshot script to refresh both tabs, so that the fallback stays close to the sheet.
22. As the site owner, I want the deploy folder to stay self-contained with no new dependencies, so that the static deploy keeps working unchanged.
23. As an engineer, I want the model logic separated from DOM rendering, so that it is testable in Node.
24. As an engineer, I want the README to describe the mechanism in one bullet per data source, so that the next person finds it.

## Implementation Decisions

### Sheet contract (tab `Speakers`, same spreadsheet)

Header names matched case-insensitively with whitespace removed. Columns:

- `Display name` (optional): shown as typed when present, for honorifics such as "Prof. Stuart Reid" or "Louise Hecker, PhD". Otherwise the name is `First name` + space + `Last name`.
- `First name` (required), `Last name` (optional, for single names such as "Florian").
- `Affiliation` (free text, shown under the name everywhere).
- `Talk` (optional) and `Bio` (optional): shown only in the /conferences/ panel.
- `Sessions`: tokens S1, S2, F, Online separated by anything non-alphanumeric. Rendered as `S1 · S2`. Empty renders as the existing em-dash placeholder.
- `Group`: a value starting with "sci" (any case) is the scientists group; anything else is the founders group. Decides which of the two /conferences/ sections lists the person.
- `Show on`: comma-separated page tokens `landing`, `conferences`, `experience`, `startups`, `jp`. A speaker is a photo card on each listed page. On /conferences/, "conferences" means a face card at the top of their group; everyone else in the group is a numbered row.
- `Photo`: empty means derive `/img/speakers/<slug>.jpeg` where slug is the full name lowercased, diacritics folded, runs of non-alphanumerics replaced by one underscore ("José Cordeiro" → `jose_cordeiro`, "Aubrey de Grey" → `aubrey_de_grey`). A value starting with `/` is used as given. The literal `none` means no photo: the card shows an initials tile. Any other value is treated as `none`.
- `Name JP`, `Role JP`, `Focus JP`: used by /jp/ cards. Role renders as `<Role JP>｜<Affiliation>`; a missing Name JP falls back to the Latin name.
- `Publish`: blank, TRUE, yes or 1 shown; FALSE, no, 0 or hidden hidden.

The published row order is the display order on every surface. The seed is `speakers-template.csv`, built from the 55 names on /conferences/ in their current order with the current photos as `Photo` overrides. Three names that appear only in the landing paragraph (Cremieux, Pedro Henrich, Nelson Milla) are not on /conferences/ and are left out of the seed; Nelson adds them as rows if he wants them back.

The sheet URL is `https://docs.google.com/spreadsheets/d/1KVHJxp5W5VirLNMh6UQftPhF4iE9F247pQq5EZ8q-fI/gviz/tq?tqx=out:csv&sheet=Speakers`. It addresses the tab by name, so the tab must be called exactly `Speakers`. Until the tab exists the pages show the snapshot.

### Modules

1. **Sheet helper** (new, shared). `window.MiraiSheet = { parseCsv, rowsFromCsv, fetchCsv(url, { timeout }) }`. The parser moves here from the agenda script; `fetchCsv` wraps fetch with `cache: 'no-store'`, an abort timeout (default 6000 ms), rejects on non-2xx, resolves to row objects. The agenda script keeps its public API and delegates to this helper.
2. **Speakers core** (deep module, pure). `window.MiraiSpeakers`:
   - `buildModel(rows) → { speakers, count }` with published rows only, in order. Each speaker: `{ id (slug), name, first, last, affiliation, talk, bio, sessions (array), sessionsLabel, group ('scientists' | 'founders'), showOn (array of lowercase tokens), photo (string or ''), initials, nameJp, roleJp, focusJp }`.
   - `featured(model, page) → speakers whose showOn includes page`; `others(model, page) → the rest`.
   - `groups(model) → { scientists: [...], founders: [...] }`.
   - `numberWords(n)` for 0–99 ("eighteen", "twenty-eight"), used for "The other eighteen".
   - `load({ url, snapshot, render })`: calls `render(buildModel(snapshot))` synchronously inside try/catch, then if `url` is non-empty fetches through the sheet helper and calls `render` again when the result has at least one speaker; one `console.warn('[speakers] …')` on failure; resolves `'sheet'` or `'snapshot'`; never throws.
   - A `fillCounts(model, root)` helper: every element with `data-speakers-count` inside `root` gets `textContent = String(model.count)`.
   - A `photoEl(speaker, { alt })` helper used by all renderers: returns an `<img>` for a photo (with `loading="lazy" decoding="async"`, an `onerror` that swaps the image for the initials tile) or a `<div class="spk-initials">` tile when photo is `''`.
3. **Snapshot data file** `speakers-data.js`: `window.MIRAI_SPEAKERS_SHEET_CSV = '<url>';` on its own line and `window.MIRAI_SPEAKERS_SNAPSHOT = [...]` rows with the fourteen lowercase keys (`displayname, firstname, lastname, affiliation, talk, bio, sessions, group, showon, photo, namejp, rolejp, focusjp, publish`). Generated from the seed.
4. **Per-page renderers**, inline in each page's own script block, each filling marked containers from the model and reproducing the page's existing markup and classes exactly (text via text nodes, never innerHTML):
   - Landing: `[data-speakers="landing-cards"]` (the `.headliners` div) gets one `.hcard.rv` per featured speaker with photo, `.nm`, `.og`. `[data-speakers="landing-also"]` (the `.alsoline` paragraph) gets the lead-in "Also in the arena: " then bold names of the others, comma-separated. The eyebrow and follow line keep their copy with the number replaced by a `data-speakers-count` span.
   - /experience/: `[data-speakers="experience-cards"]` gets `.hcard`s; the "Also in the city" details row gets `data-speakers-count` in its "55 total" chip, a preview line of the first four other names, and the body paragraph "Also in the city: **Name** (Affiliation), …"; the follow line's "55" is a count span.
   - /startups/: `[data-speakers="startups-cards"]` gets `figure.face` cards.
   - /jp/: `[data-speakers="jp-cards"]` gets `figure.jp-page__face` cards with Japanese name, `Role JP｜Affiliation`, and the focus line when present.
   - /conferences/: for each of the two group sections, `[data-speakers="conferences-scientists"]` and `[data-speakers="conferences-founders"]` wrap the faces grid, the manifest heading ("The other <words>"), the numbered rows (numbering continues after the faces, as today, in two columns of the existing `details.more` collapse: the first nine rows visible, the rest behind "Show all N"), and a new speaker panel.
5. **Speaker panel on /conferences/** (new UI). Clicking a face or a row toggles one panel per group section, placed directly under the grid. It shows the photo or initials tile, name, affiliation, session marks, the talk as a labelled line and the bio as a paragraph; it has a close control; the opener gets `aria-expanded`, the panel `role="region"` with a label. A speaker with neither talk nor bio still opens the panel, showing name, affiliation and sessions, so behaviour is uniform. Styled from the design system (ruled grid, mono labels, cyan accent, no new colours), works at 375 wide, honours reduced motion.
6. **Snapshot script** generalised: reads any `window.MIRAI_<NAME>_SHEET_CSV` line and writes the matching `window.MIRAI_<NAME>_SNAPSHOT`; npm scripts `agenda:snapshot` and `speakers:snapshot` pass the data file.
7. **Runbook**: the agenda runbook grows a Speakers section (or a sibling file) with the columns, the `Show on` tokens, the photo filename rule, the `none` value, the tab-name requirement, and the two standing editorial rules (Betts-LaCroix placement, Goodell no photo).

### Behaviour decisions

- Snapshot first, sheet second, on every page. No page may be empty while the fetch runs.
- Reveal animations: new `.rv` elements created after a page's reveal observer ran must still reveal; renderers reuse the approach from the agenda (own observer, or immediate reveal when the container was already revealed).
- The copy registry on the landing page loses the per-speaker keys (name/org × 4, alsoLine) and keeps eyebrow, headline and follow line with a count placeholder.
- One photo per person. Where pages disagreed today (Cordeiro: cordeiro.webp vs jose.webp) the seed picks the /conferences/ file. Existing image files are not moved or renamed; the `Photo` override points at them until Nelson uploads `first_last.jpeg` files and clears the cell.
- All work on one branch; agents never commit; the integrator commits one ticket at a time.

## Testing Decisions

Good tests exercise the public interface with realistic input and assert what a visitor or the next module observes. Prior art: `test/agenda.test.js` (vm-loaded classic scripts under `node --test`) and the agenda test appended to `legacy-site/e2e/smoke.spec.ts` (route-intercepted sheet, snapshot fallback).

- **Sheet helper + speakers core**: unit tests. Name assembly and display-name override, slug and photo derivation (diacritics, multi-word surnames, `none`, `/path` override, rejected `https://` or `javascript:` values), session token parsing and label, group mapping, showOn parsing, publish filter, order preserved, count, `numberWords`, the seed snapshot building to 55 speakers with the expected featured sets per page (landing 4, experience 5, startups 4, jp 4, conferences faces 5 + 4) and group sizes (23 scientists, 32 founders). The agenda tests keep passing after the parser moves.
- **Pages**: one Playwright test per changed page in the smoke spec, each serving `speakers-data.js` with a test sheet URL and a fixture CSV, asserting the rendered cards and lists and the count, then aborting the sheet and asserting the snapshot renders (55). The /conferences/ test also clicks a row and asserts the panel shows the fixture's talk and bio and closes again. The existing cross-viewport smoke run (reveal, overflow, clean console) must stay green on all five pages.
- Snapshot script: run by hand against a local CSV, not unit tested.

## Out of Scope

- Session-by-speaker scheduling (which talk is in which slot). The agenda tab and the speakers tab stay independent.
- Moving or re-encoding the existing photo files. Nelson uploads new `first_last.jpeg` files when he has them.
- Bios anywhere other than /conferences/.
- Japanese translations of bios or talks.
- The retired /fashion-show/ page and the `_v` design-variant folders.

## Further Notes

- Public sheet: a bio is public anyway, but an unpublished row is still readable in the CSV. Unannounced speakers stay out of the sheet.
- The landing paragraph today lists three people who are not on /conferences/ (Cremieux, Pedro Henrich, Nelson Milla). After this change the paragraph lists everyone published who is not a landing card, so those three disappear unless rows are added.
- The seed carries today's inconsistencies resolved toward /conferences/ (Hayano: Keio University; Hanyu: IntegriCulture; Cordeiro: International Longevity Summit; Gries: Vitalist Bay). Nelson should check those four cells.

## Tickets

| # | Ticket | Owner | Definition of Done |
|---|--------|-------|--------------------|
| S0 | PRD + seed CSV | Integrator | Committed. |
| S1 | Sheet helper, agenda delegating to it, speakers core, snapshot data, unit tests | Agent A | `npm test` green with new tests covering every item above; agenda tests unchanged in intent. |
| S2 | Landing, /experience/, /startups/, /jp/ render from the model; copy.js and README updated | Agent B | Each page serves, renders the snapshot identically to today, no `[copy] missing key` warnings, counts computed. |
| S3 | /conferences/ renders both groups from the model, with the speaker panel | Agent C | Faces, headings, rows and "Show all" behave as today from the snapshot; panel opens with talk and bio, closes, keyboard-operable; 375 and 1280 wide. |
| S4 | Smoke tests for five pages, snapshot script generalised, runbook Speakers section | Agent D | Playwright tests pass against the worktree server; `npm run speakers:snapshot` works against a local CSV; runbook complete. |
| S5 | Integration, browser verification, commits | Integrator | All tests green; screenshots at 375 and 1280 on the five pages; one commit per ticket. |
