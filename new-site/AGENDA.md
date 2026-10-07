# Agenda and speakers sheet — how to edit the agenda and the speaker lists

The first part of this guide covers the agenda. The speaker lists are further down,
under [Speakers](#speakers).

## What this is

The agenda on the landing page (Summit I, Summit II, Finale) is read from a public
Google Sheet each time someone opens the site. You edit the sheet; the site shows the
change on the next page load. No engineer and no deploy needed. A copy of the agenda
also ships inside the site, so visitors still see an agenda if Google is slow or down.

## The sheet

The sheet is "Mirai Agenda" in Nelson's Google Drive (created Oct 7 2026):
https://docs.google.com/spreadsheets/d/1KVHJxp5W5VirLNMh6UQftPhF4iE9F247pQq5EZ8q-fI/edit

The site reads the first tab, whatever it is called. Its CSV address is already in
`agenda-data.js`.

One step still has to be done by hand in Google Sheets, once: Share → General access →
"Anyone with the link" → Viewer. Until that is set, Google refuses the site's request
and visitors see the built-in copy of the agenda.

### If the sheet is ever replaced

1. Create a new Google Sheet. File → Import → Upload `agenda-template.csv` (in this
   folder), "Replace current sheet". Keep the agenda on the first tab.
2. Share → General access → "Anyone with the link" → Viewer.
3. Copy the spreadsheet ID from the address bar: the long part between `/d/` and `/edit`.
4. The CSV address is
   `https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:csv&gid=0`
5. Send that address to an engineer. They paste it into `agenda-data.js` once.

## The columns

| Column | What it means | Required | Example |
|---|---|---|---|
| Block | Which part of the event the session belongs to | Yes | Summit I |
| Date | The block's dates | No | Oct 17–18 |
| Block title | The block's headline | No | The Science & Tech Augmenting Life |
| Title | The session title | Yes | Women's Health |
| Subtitle | One short line under the title | No | The next trillion-dollar market. |
| Link | Where the session links to | No | #fashion |
| Publish | TRUE shows the row, FALSE hides it | No (blank shows it) | TRUE |

Publish also accepts yes / no, 1 / 0, and hidden.

## Rules

- Blocks appear on the site in the order they first appear in the sheet. Sessions
  appear in row order.
- Date and Block title only need typing once per block, on any row of that block.
  The first filled-in value is used.
- A block named `Finale` is shown as the finale card, using its first published row.
- Publish FALSE hides a row from the site but NOT from the sheet's public CSV. Anyone
  with the link can read every row. Never put anything confidential in the sheet,
  including draft rows.
- Links must start with `/`, `#` or `https://`. Anything else is ignored.
- Cells are shown as plain text. HTML will not work; `&` and `<` show as typed.

## Editing

Change the cells, then reload the site. Google caches the sheet for a minute or two,
so a change can take that long to appear. To add a session, add a row. To remove one,
delete the row or set Publish to FALSE. To reorder, move the rows.

## If something looks wrong

- Check the header row spelling: Block, Date, Block title, Title, Subtitle, Link,
  Publish. Capital letters and extra spaces do not matter; other spelling does.
- A row with an empty Title is skipped. So is a row with an empty Block.
- If the sheet cannot be read (not shared, first tab deleted, Google down), the site
  shows the built-in copy of the agenda instead. If your edits never appear, check the
  sharing setting first, then that the agenda is still on the first tab.

## For engineers

- The sheet address lives in `agenda-data.js` (`window.MIRAI_AGENDA_SHEET_CSV`).
- Refresh the built-in copy: run `npm run agenda:snapshot` from `new-site/`. It fetches
  the sheet and rewrites `agenda-data.js`. Commit and deploy the result.
- Unit tests: `npm test` from `new-site/`.
- Smoke test: `legacy-site/e2e/smoke.spec.ts` (the "agenda rail" test).

---

# Speakers

## What this is

Every page that lists speakers (the landing page, /conferences/, /experience/,
/startups/ and /jp/) reads the list from a tab called `Speakers` in the same "Mirai
Agenda" spreadsheet. Fix a speaker's affiliation once and all five pages agree. Add a
speaker by adding a row. The "55 speakers" numbers on the pages are counted from the
sheet, so they always match the list. Like the agenda, a copy of the list ships inside
the site, so visitors still see speakers if Google is slow or down.

## The tab

The site looks for a tab named exactly `Speakers` (capital S, no spaces). Any other
name and the site shows its built-in copy instead. The tab exists (Oct 7 2026).

If it is ever lost, or the spreadsheet is replaced, recreate it:

1. Open the "Mirai Agenda" spreadsheet (link above).
2. File → Import → Upload `speakers-template.csv` (in this folder) → "Insert new
   sheet(s)". Google adds a new tab next to the agenda.
3. Rename the new tab to `Speakers` (double-click the tab name).
4. Leave the agenda tab where it is.

The sharing setting is the same one the agenda uses: "Anyone with the link" → Viewer.

## The columns

| Column | What it means | Required | Example |
|---|---|---|---|
| Display name | The name exactly as shown, when it needs a title or suffix. Leave empty to use First name + Last name | No | Prof. Stuart Reid |
| First name | First name | Yes | Stuart |
| Last name | Last name. Leave empty for people with one name | No | Reid |
| Affiliation | Shown under the name on every page | No | University of Strathclyde |
| Talk | The talk title. Shown only on /conferences/, when someone clicks the name | No | Why bodies age |
| Bio | A short bio. Shown only on /conferences/, when someone clicks the name | No | Stuart leads… |
| Sessions | Which sessions they speak at: S1, S2, F, Online | No | S1, S2 |
| Group | Scientists or Founders. Decides which half of /conferences/ lists them | Yes | Scientists |
| Show on | Pages where this person gets a photo card | No | landing, conferences |
| Photo | Leave empty to use the standard photo file (see Photos below), or `none` | No | none |
| Name JP | The name in Japanese, for /jp/ | No | オーブリー・デグレイ |
| Role JP | The role in Japanese, for /jp/ | No | プレジデント兼最高科学責任者 |
| Focus JP | One line on their work in Japanese, for /jp/ | No | マウスを用いた若返り研究 |
| Publish | TRUE shows the row, FALSE hides it | No (blank shows it) | TRUE |

Publish also accepts yes / no, 1 / 0, and hidden.

## Rules

- **Row order is display order, everywhere.** Cards, numbered lists and the "Also in…"
  sentences all follow the order of the rows. Move a row to move the person.
- **Show on** takes any of these words, separated by commas:
  - `landing`: a photo card in the Speakers section of the landing page. Everyone else
    who is published is named in the "Also in the arena" sentence under the cards.
  - `conferences`: a photo card at the top of their group on /conferences/. Everyone
    else in the group is a numbered row under the cards.
  - `experience`: a photo card on /experience/. Everyone else is named under "Also in
    the city".
  - `startups`: a photo card on /startups/.
  - `jp`: a photo card on /jp/, using the Japanese columns.

  The layouts were designed for the number of cards each page has today: 4 on the
  landing page, 5 on /experience/, 4 on /startups/, 4 on /jp/, and on /conferences/ 5
  scientists and 4 founders. More or fewer still works, but check the page after.
- **Sessions**: S1 is Summit I, S2 is Summit II, F is the Finale, Online is online.
  Separate them with commas or spaces. They show on /conferences/ as `S1 · S2`. Empty
  shows a dash. Other words are ignored.
- **Group**: anything starting with "sci" (Scientists, science, SCI) puts the person in
  the scientists half of /conferences/. Anything else, including empty, puts them with
  the founders. The "The other eighteen" headings are counted for you.
- **Name JP**: when empty, /jp/ shows the name in Latin letters. Role JP is shown as
  `Role JP｜Affiliation`. Focus JP is shown only when filled in.
- Cells are shown as plain text. HTML will not work; `&` and `<` show as typed.
- Publish FALSE hides a row from the site but NOT from the sheet's public CSV. Keep
  unannounced speakers out of the sheet entirely, not just unpublished.

## Photos

Photos live in the site itself, in the folder `new-site/img/speakers/`. Each file is
named after the person: first name and last name, lowercase, accents removed, every
space or other character replaced by an underscore, ending in `.jpeg`.

| Name in the sheet | File |
|---|---|
| Aubrey de Grey | `aubrey_de_grey.jpeg` |
| José Cordeiro | `jose_cordeiro.jpeg` |
| Stuart Reid (Display name "Prof. Stuart Reid") | `stuart_reid.jpeg` |
| Florian (no last name) | `florian.jpeg` |

The Display name is never used for the file name; only First name and Last name are.

To add or change a photo, put the file in `new-site/img/speakers/` with that name and
deploy, then make sure the person's Photo cell is empty. A new photo needs a deploy; a
sheet edit does not.

The Photo column:

- Empty: use the file named as above.
- A path starting with `/`, such as `/img/aubrey.webp`: use that file from the site.
  Today's photos are set this way, because the existing files have other names. When
  a proper `first_last.jpeg` is uploaded, clear the cell.
- `none`: no photo. The card shows the person's initials instead.
- Anything else (a web link, a Google Drive link) is treated as `none`. Photos must be
  files on the site.

If the file is missing, the card shows the initials instead of a broken image.

## Standing editorial rules

- **Joe Betts-LaCroix is never placed next to Aubrey de Grey or anyone from LEV
  Foundation** (for example Natalie S. Coles de Grey). That means not in adjacent rows
  and not in adjacent cards, on any page. Because row order is display order, check
  the rows above and below his before saving, and check again after moving anyone.
- **Marian Goodell has no photo.** Her Photo cell stays `none`. Never upload a file for
  her.

## Editing

Same as the agenda: change the cells, reload the site, allow a minute or two for
Google's cache. To add a speaker, add a row. To remove one, delete the row or set
Publish to FALSE. To reorder, move the rows.

## If something looks wrong

- Check the header row spelling: Display name, First name, Last name, Affiliation,
  Talk, Bio, Sessions, Group, Show on, Photo, Name JP, Role JP, Focus JP, Publish.
  Capital letters and extra spaces do not matter; other spelling does.
- A row with an empty First name is skipped.
- Edits never appear: check the tab is still named exactly `Speakers`, then the
  sharing setting. If the tab cannot be read, every page shows the built-in copy.
- Someone is missing from a page: check Publish, then the spelling of the page word in
  Show on (`landing`, `conferences`, `experience`, `startups`, `jp`).
- Someone is in the wrong half of /conferences/: check Group starts with "sci" for
  scientists.
- Initials instead of a photo: the Photo cell says `none` or something not starting
  with `/`, or the file name does not match. Check the spelling, the `.jpeg` ending
  (not `.jpg`), that accents were dropped, and that the file was deployed.
- The speaker count looks wrong: it counts every published row. A hidden or deleted
  row is not counted.

## For engineers

- The sheet address lives in `speakers-data.js` (`window.MIRAI_SPEAKERS_SHEET_CSV`).
  It addresses the tab by name (`&sheet=Speakers`).
- Refresh the built-in copy: run `npm run speakers:snapshot` from `new-site/`. It
  fetches the tab and rewrites `speakers-data.js`. Commit and deploy the result.
  `npm run agenda:snapshot` does the same for the agenda; both run
  `scripts/sheet-snapshot.mjs --file <data file>`.
- Unit tests: `npm test` from `new-site/`.
- Smoke tests: `legacy-site/e2e/smoke.spec.ts` (the "speakers" tests, one per page).
  From `legacy-site/`: `npx playwright test e2e/smoke.spec.ts -g speakers`. Set
  `NEW_SITE_PORT` to run against a server on another port (default 4321).
