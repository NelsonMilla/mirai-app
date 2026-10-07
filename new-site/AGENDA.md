# Agenda sheet — how to edit the landing-page agenda

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
