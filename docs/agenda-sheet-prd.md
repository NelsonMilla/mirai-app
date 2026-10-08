# Agenda from a public Google Sheet

Branch: `feat/agenda-sheet`. Written 2026-10-07. Status of each ticket is tracked in the
commit log of this branch (one commit per ticket, prefixed `T<n>:`).

## Problem Statement

The landing-page agenda ("Nine sessions and a runway", Summit I Oct 17–18, Summit II
Oct 24–25, Finale Oct 26) is hard-coded: ten session titles live as string keys in the
copy registry and are poured into ten fixed HTML slots. Changing a title means editing
JavaScript and redeploying; adding or removing a session means editing HTML too. The
event starts in ten days and the agenda will change daily. The coworker who owns the
agenda cannot edit the site and should not have to wait for an engineer or a deploy.

## Solution

The agenda becomes a public Google Sheet (anyone with the link can view) with one row per
session. The landing page fetches that sheet as CSV when it loads and renders the day rail
from it. The coworker edits the spreadsheet; the site reflects the change on the next page
load, with no deploy. A snapshot of the agenda ships inside the site so the rail paints
instantly and still shows an agenda when the sheet is unreachable.

## User Stories

1. As the agenda owner, I want to change a session title in a spreadsheet, so that the site updates without asking an engineer.
2. As the agenda owner, I want to add a session to Summit II by adding a row, so that the rail grows without an HTML change.
3. As the agenda owner, I want to remove a session by deleting its row or marking it unpublished, so that cancelled sessions disappear.
4. As the agenda owner, I want to draft a session with Publish = FALSE, so that I can prepare rows before announcing them.
5. As the agenda owner, I want to reorder sessions by reordering rows, so that the running order on the site matches the plan.
6. As the agenda owner, I want to give each session an optional one-line subtitle, so that the site keeps its current two-line session style.
7. As the agenda owner, I want to give a session an optional link, so that the finale can still point at the fashion-show section.
8. As the agenda owner, I want a short written guide with the column meanings, so that I do not need to ask what each column does.
9. As the agenda owner, I want to type dates and block titles once per block, so that I do not repeat them on every row.
10. As the agenda owner, I want typos in the header casing or stray spaces to be tolerated, so that a small slip does not blank the agenda.
11. As a visitor, I want the agenda to appear immediately on page load, so that I never see an empty section while a fetch runs.
12. As a visitor, I want the agenda to show even when Google Sheets is slow or blocked, so that the page never looks broken.
13. As a visitor, I want the three-column rail, the finale card, and the mobile stacked layout to look exactly as today, so that the redesign is invisible.
14. As a visitor, I want a session title that contains an ampersand or an angle bracket to render as text, so that the page is never defaced by cell contents.
15. As a visitor, I want the Get Tickets call to action under the agenda to keep working, so that the funnel is unchanged.
16. As the site owner, I want text from the sheet never inserted as HTML, so that a public spreadsheet cannot inject script into the site.
17. As the site owner, I want only same-site or https links accepted from the Link column, so that `javascript:` links are impossible.
18. As the site owner, I want the Section Viewed analytics event for the agenda to keep firing, so that the funnel reporting stays intact.
19. As the site owner, I want a one-command way to refresh the shipped snapshot from the sheet, so that the fallback does not drift far from reality.
20. As the site owner, I want unit tests for parsing and grouping, so that a malformed sheet fails in CI and not on the live page.
21. As the site owner, I want a smoke test that proves the rail renders from a sheet and from the snapshot, so that this visual never regresses silently.
22. As the site owner, I want the sheet URL in one obvious place, so that swapping the spreadsheet is a one-line change.
23. As the site owner, I want the fetch to time out quickly, so that a hanging request cannot delay anything else on the page.
24. As the site owner, I want the deploy folder to stay self-contained with no new dependencies, so that the static deploy keeps working unchanged.
25. As an engineer, I want the parsing and grouping logic separated from DOM rendering, so that it is testable in Node without a browser.
26. As an engineer, I want the README to describe the new mechanism in one bullet, so that the next person finds it.

## Implementation Decisions

### Sheet contract

- One tab, one header row, one row per session. Header names are matched case-insensitively with surrounding whitespace trimmed.
- Columns: `Block` (required; e.g. Summit I, Summit II, Finale), `Date` (e.g. Oct 17–18), `Block title` (the block's headline, e.g. The Science & Tech Augmenting Life), `Title` (required; session title), `Subtitle` (optional), `Link` (optional URL), `Publish` (optional; blank, TRUE, yes, or 1 means shown; FALSE, no, 0, or hidden means hidden).
- Blocks appear in order of first appearance. `Date` and `Block title` are taken from the first non-empty value within a block, so they need only be typed once.
- A block named `Finale` (case-insensitive) renders with the finale card treatment and uses its first published session's title and subtitle. All other blocks render as session lists.
- Rows with an empty `Title` are skipped. Rows with no `Block` are skipped.
- Stop codes `STN·01`, `STN·02`, … are generated from block order.
- The site fetches the sheet via Google's CSV export for a viewable sheet (`/gviz/tq?tqx=out:csv&sheet=<tab>`), which sends CORS headers; a "Publish to the web" CSV URL also works. The URL lives in one place in the deploy folder.

### Modules

1. **Agenda core** (deep module, pure, no DOM). Interface: `parseCsv(text) → string[][]`, `rowsFromCsv(text) → row objects keyed by normalised header`, `buildModel(rows) → { stops: [{ code, date, tag, title, finale, sessions: [{ num, title, subtitle, link }] }] }`. Handles quoted fields, embedded commas and newlines, CRLF, and a UTF-8 BOM. Rejects links that are not `/…`, `#…`, or `https://…`.
2. **Agenda renderer** (thin, DOM). `render(model, railElement)` empties the rail and rebuilds it using the existing class names (`ag-stop`, `ag-date`, `ag-code`, `ag-tag`, `ag-title`, `ag-sessions`, `ag-num`, `ag-t`, `ag-sub`, `ag-stop--finale`, `ag-finale`, `ag-finale-title`, `ag-finale-sub`, plus `rv` for the reveal animation and `mono` where the current markup uses it). All text goes in via text nodes, never innerHTML. A link renders as an anchor with the site's navigation analytics attributes.
3. **Agenda loader**. `load({ url, snapshot, rail })`: renders the snapshot synchronously, then if `url` is non-empty fetches it with a 6-second abort, `cache: 'no-store'`; on a 2xx response with at least one published session it re-renders; on any failure it leaves the snapshot in place and logs one console warning. Exposed on `window.MiraiAgenda` as a classic script (the page uses plain scripts, no modules).
4. **Snapshot data file**. A generated classic script that sets the sheet CSV URL and an array of row objects matching the sheet contract. Initial content is today's ten sessions. Regenerated by the snapshot script.
5. **Snapshot script** (Node, no dependencies). Reads the URL from the data file, fetches the CSV, rewrites the data file. Wired as an npm script in the deploy folder's package.json.
6. **Landing page integration**. The ten fixed slots inside the rail are removed; the rail becomes an empty container. The eyebrow, headline, CTA note and CTA stay in the copy registry; the ten session keys, three stop labels, three tags and two block titles are removed from it. The two new scripts load after the section, before the existing `applyCopy()` call or alongside it.
7. **Runbook** for the agenda owner: how to make the sheet public, the columns, the URL to paste, how to preview, what happens when a cell is wrong.

### Behaviour decisions

- Snapshot first, sheet second: the rail is never empty, and a sheet that differs from the snapshot swaps in after the fetch. Keeping the snapshot fresh is the owner's job via the npm script.
- The fashion-show flag: today the finale subtitle links to `#fashion` only when the flag is on. With the sheet, the link is a plain cell; the page hides the anchor when the flag is off (existing `fashion-hidden` class on the root).
- No new runtime dependencies, no build step, no changes outside the deploy folder except the smoke test in the legacy harness.
- All work on one branch, one commit per ticket, agents never commit; the integrator commits.

## Testing Decisions

A good test exercises the public interface with realistic input and asserts on what a user or the next module would observe, never on internals. Prior art: the Node unit tests for the Stripe webhook in the deploy folder's test directory (`node --test`, `node:assert/strict`), and the Playwright specs in the legacy harness that drive the static server on port 4321.

- **Agenda core**: unit tests in Node. Quoted commas and newlines, CRLF, BOM, header case and spacing, block order, once-per-block date and title, publish filtering, finale detection, link allow-list, empty title rows skipped, an empty sheet yields zero stops. The classic script is evaluated in a `vm` context with a stub `window`.
- **Renderer + loader**: a Playwright smoke test. Intercept the sheet URL with a fixture CSV and assert the rail shows the fixture's blocks and session count; abort the request and assert the snapshot's three stops and ten sessions still render; assert the Section Viewed analytics event for `agenda` still fires (existing test covers this).
- **Snapshot script**: not unit tested; it is a 30-line fetch-and-write run by hand.

## Out of Scope

- The speaker manifest and its S1/S2/F tags on `/conferences/`, the week-by-week arc on `/experience/`, and the Japanese page. Only the landing-page rail reads the sheet.
- Speaker names, times of day, rooms, or any column beyond the seven listed.
- Creating the Google Sheet itself (the runbook explains it; a template CSV is provided).
- Editing UI, authentication, or a hosted CMS.
- Automatic snapshot refresh on deploy (there is no build step to hook).

## Further Notes

- Google's CSV export of a view-only sheet is cached by Google for a short time; edits typically appear within a minute or two.
- The sheet is public by design. Nothing confidential may ever be typed into it, including draft rows, because `Publish = FALSE` hides a row from the page but not from the CSV.
- If the Vercel project is not linked to GitHub, this branch still needs a manual `vercel deploy --prod` once, after which no deploys are needed for agenda edits.

## Tickets

| # | Ticket | Owner | Definition of Done |
|---|--------|-------|--------------------|
| T1 | Agenda core + loader + snapshot data (`agenda.js`, `agenda-data.js`) | Agent A | `npm test` in the deploy folder passes new unit tests covering every item in Testing Decisions; `window.MiraiAgenda.load` renders the snapshot with no network. |
| T2 | Landing page integration (`index.html`, `copy.js`, README bullet) | Agent B | Rail markup is an empty container; the ten session keys are gone from the copy registry; no `[copy] missing key` warnings; page renders identically to before at 1280 and 375 wide. |
| T3 | Runbook, template CSV, snapshot script, smoke test | Agent C | `AGENDA.md` explains the columns and the public-sheet steps; `agenda-template.csv` imports cleanly; `npm run agenda:snapshot` regenerates the data file; the Playwright smoke test passes against the static server. |
| T4 | Integration, browser verification, commits | Integrator | Unit + smoke tests green; screenshots at desktop and mobile match the pre-change rail; one commit per ticket on `feat/agenda-sheet`. |
