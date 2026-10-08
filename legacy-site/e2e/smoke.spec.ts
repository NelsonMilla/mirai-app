/**
 * Cross-viewport smoke test for the live static site (new-site/, port 4321).
 *
 * The Next app in legacy-site/ is not deployed; this spec covers the pages
 * Vercel actually serves. It exists because these classes of bug shipped
 * before and were re-reported by screenshot:
 * - sections deadlocked invisible behind reveal animations
 * - horizontal overflow at intermediate widths
 * - a bare element selector restyling unrelated components
 *
 * For each page and viewport: load, assert nothing widens the page, scroll
 * every reveal-gated block into view and assert it reveals and paints, scroll
 * the whole page, assert nothing widened it, and assert a clean console.
 *
 * Never-twice rule: when a visual bug is fixed on new-site, add the assertion
 * that would have caught it here, in the same PR as the fix.
 */
import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/experience/', '/startups/', '/pricing/', '/conferences/', '/jp/', '/stay/', '/program/'];

/** Every page at phone and desktop; the landing page also at tablet and MacBook widths. */
const RUNS = [
  ...PAGES.flatMap((path) => [
    { path, width: 375, height: 812 },
    { path, width: 1280, height: 800 },
  ]),
  { path: '/', width: 768, height: 1024 },
  { path: '/', width: 1440, height: 900 },
];

/**
 * Console errors and uncaught exceptions are both failures, except a resource
 * that failed to load from a third-party host (fonts, embeds): that is the
 * network on the test machine, not the page, and it made the suite red on
 * a slow connection in Sep 2026.
 */
function collectConsoleFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const thirdParty = /^Failed to load resource/.test(msg.text())
      && !/^https?:\/\/localhost/.test(msg.location().url ?? '');
    if (!thirdParty) failures.push(`[error] ${msg.text()}`);
  });
  page.on('pageerror', (err) => failures.push(`[pageerror] ${err.message}`));
  return failures;
}

/**
 * The static server has no Vercel runtime, so the insights script 404s and
 * would fail the clean-console assertion for a reason that never happens in
 * production. PostHog is already skipped by posthog.js on localhost.
 */
async function stubHostingOnlyScripts(page: Page) {
  await page.route('**/_vercel/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
  }));
}

/** Instant-scroll through the page in steps so IntersectionObservers fire. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y <= H; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 120));
    }
  });
}

/**
 * Scroll each rendered `.rv` block into view and report the ones that never
 * got the `in` class or never painted. Blocks that are `display: none` at this
 * width (the other viewport's layout variant) cannot intersect and are skipped.
 * Pages without `.rv` (pricing, conferences, jp) report an empty list.
 *
 * The agenda and speaker lists repaint when the live sheet answers, replacing
 * their `.rv` elements mid-check. A replaced element is skipped and the page is
 * re-scanned, so the replacements are checked instead.
 */
async function unrevealedBlocks(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const seen = new Set<Element>();
    const failures: string[] = [];
    for (let pass = 0; pass < 3; pass++) {
      const all = [...document.querySelectorAll<HTMLElement>('.rv')];
      const blocks = all.filter((el) => !seen.has(el) && el.getClientRects().length > 0);
      if (!blocks.length) break;
      for (const el of blocks) {
        seen.add(el);
        el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
        const deadline = Date.now() + 3000;
        while (
          el.isConnected &&
          Date.now() < deadline &&
          !(el.classList.contains('in') && +getComputedStyle(el).opacity > 0.5)
        ) {
          await new Promise((r) => setTimeout(r, 50));
        }
        if (!el.isConnected) continue;
        if (!el.classList.contains('in') || +getComputedStyle(el).opacity <= 0.5) {
          const label = el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}.rv[${all.indexOf(el)}]`;
          failures.push(`${label} (in=${el.classList.contains('in')}, opacity=${getComputedStyle(el).opacity})`);
        }
      }
    }
    return failures;
  });
}

for (const run of RUNS) {
  test(`${run.path} smoke @ ${run.width}x${run.height}`, async ({ page }) => {
    await page.setViewportSize({ width: run.width, height: run.height });
    await stubHostingOnlyScripts(page);
    const consoleFailures = collectConsoleFailures(page);

    // DOM ready is enough: waiting for `load` lets a slow font or embed host
    // time the test out.
    await page.goto(run.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();

    // The shared nav is position:fixed. A page that does not pad for it
    // renders its eyebrow and heading underneath the bar (shipped on /stay/
    // and /pricing/ at phone width, Sep 2026). Pages with their own header
    // have no .topbar and skip this.
    const navClearance = await page.evaluate(() => {
      const bar = document.querySelector('.topbar');
      const first = [...document.querySelectorAll('.eyebrow, h1')]
        .find((el) => el.getClientRects().length > 0);
      if (!bar || !first) return null;
      return { barBottom: bar.getBoundingClientRect().bottom, firstTop: first.getBoundingClientRect().top };
    });
    if (navClearance) {
      expect(navClearance.firstTop, 'first heading must clear the fixed nav')
        .toBeGreaterThanOrEqual(navClearance.barBottom);
    }

    const onLoad = await horizontalOverflow(page);
    expect(onLoad.scrollW, 'no horizontal overflow on load').toBeLessThanOrEqual(onLoad.vw);

    expect(await unrevealedBlocks(page), 'every .rv block reveals and paints').toEqual([]);

    await scrollThrough(page);
    await page.waitForTimeout(900); // let entrance transitions settle
    const afterScroll = await horizontalOverflow(page);
    expect(afterScroll.scrollW, 'no horizontal overflow after full scroll-through')
      .toBeLessThanOrEqual(afterScroll.vw);

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });
}

/**
 * The landing agenda rail is built at load from a public Google Sheet, with a
 * snapshot in agenda-data.js painted first and kept when the sheet fails.
 * agenda-data.js is served with a test sheet URL (the real one may be empty)
 * and the sheet itself is a fixture, so this never touches Google.
 */
const AGENDA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/test/gviz/tq?tqx=out:csv&sheet=Agenda';
const AGENDA_FIXTURE = [
  'Block,Date,Block title,Title,Subtitle,Link,Publish',
  'Summit I,Oct 17–18,"Fixture block, one",Fixture session A & B,Fixture subtitle,,TRUE',
  'Summit I,,,Fixture draft session,,,FALSE',
  'Summit I,,,Fixture session C,,,',
  'Finale,Oct 26,,Fixture finale title,Fixture finale subtitle,#fashion,TRUE',
].join('\r\n');

test('the landing agenda rail renders from the sheet and falls back to the snapshot', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await stubHostingOnlyScripts(page);
  const consoleFailures = collectConsoleFailures(page);

  await page.route('**/agenda-data.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /window\.MIRAI_AGENDA_SHEET_CSV = '[^']*';/,
      `window.MIRAI_AGENDA_SHEET_CSV = '${AGENDA_SHEET_URL}';`,
    );
    await route.fulfill({ response, body });
  });
  let sheetUp = true;
  await page.route('**/docs.google.com/spreadsheets/**', (route) =>
    sheetUp
      ? route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          headers: { 'access-control-allow-origin': '*' },
          body: AGENDA_FIXTURE,
        })
      : route.abort(),
  );

  // (a) The sheet replaces the snapshot: two blocks, the draft row hidden.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const rail = page.locator('#agendaRail');
  await expect(rail.locator('.ag-stop')).toHaveCount(2);
  await expect(rail.locator('.ag-sessions li')).toHaveCount(2);
  await expect(rail.locator('.ag-stop').nth(1)).toHaveClass(/(^|\s)ag-stop--finale(\s|$)/);
  await expect(rail.locator('.ag-stop--finale .ag-finale-title')).toHaveText('Fixture finale title');
  await expect(rail).toContainText('Fixture session A & B');
  await expect(page.locator('body')).not.toContainText('Fixture draft session');

  // Stops added after load still reveal when scrolled into view.
  const stops = rail.locator('.ag-stop');
  for (let i = 0; i < 2; i++) {
    await stops.nth(i).scrollIntoViewIfNeeded();
    await expect(stops.nth(i)).toHaveClass(/(^|\s)in(\s|$)/);
    await expect(stops.nth(i)).toHaveCSS('opacity', '1');
  }

  // (b) The sheet is unreachable: the snapshot stays (3 stops, 9 sessions, finale).
  // The loader's one console.warn is expected; wait for it so the counts are
  // read after the failed fetch, not before it.
  sheetUp = false;
  const warned = page.waitForEvent('console', (msg) => msg.type() === 'warning' && msg.text().includes('[agenda]'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await warned;
  await expect(rail.locator('.ag-stop')).toHaveCount(3);
  await expect(rail.locator('.ag-sessions li')).toHaveCount(9);
  await expect(rail.locator('.ag-stop--finale')).toHaveCount(1);
  for (let i = 0; i < 3; i++) {
    await stops.nth(i).scrollIntoViewIfNeeded();
    await expect(stops.nth(i)).toHaveClass(/(^|\s)in(\s|$)/);
    await expect(stops.nth(i)).toHaveCSS('opacity', '1');
  }

  expect(consoleFailures, 'console must be clean').toEqual([]);
});

/**
 * Every speaker list (landing, /experience/, /startups/, /jp/, /conferences/)
 * is built from the Speakers tab of the same public sheet, with a snapshot in
 * speakers-data.js painted first and kept when the sheet fails. As with the
 * agenda, speakers-data.js is served with a test sheet URL and the tab is a
 * fixture; any other sheet request (the landing agenda) is aborted, which the
 * agenda loader handles with a console.warn. Photos are `none` or an existing
 * file so no request 404s.
 */
const SPEAKERS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/test/gviz/tq?tqx=out:csv&sheet=Speakers';
const SPEAKERS_FIXTURE = [
  'Display name,First name,Last name,Affiliation,Talk,Bio,Sessions,Group,Show on,Photo,Name JP,Role JP,Focus JP,Publish',
  ',Alpha,Fixturesci,Fixture Lab One,,,,Scientists,"landing, conferences, experience, startups, jp",/img/aubrey.webp,アルファ・フィクスチャ,主任研究員,フィクスチャ研究,TRUE',
  ',Beta,Fixturesci,Fixture Lab Two,,,,Scientists,conferences,none,,,,TRUE',
  ',Gamma,Rowsci,Fixture Institute,,,S1,Scientists,,none,,,,TRUE',
  ',Delta,Rowsci,Fixture University,,,"S2, F",Scientists,,none,,,,',
  ',Epsilon,Founderface,Fixture Startup,,,,Founders,"landing, conferences, experience, startups, jp",none,,,,TRUE',
  'Dr. Zeta Founderrow,Zeta,Founderrow,Fixture Ventures,Fixture talk on <tags> & more,"Fixture bio, with a comma & an <b>angle</b> bracket.",Online,Founders,,none,,,,yes',
  ',Eta,Hiddenrow,Fixture Secret Lab,,,S1,Scientists,"landing, conferences, experience, startups, jp",none,,,,FALSE',
].join('\r\n');
const SPEAKERS_PUBLISHED = 6;
const SPEAKERS_SNAPSHOT_COUNT = 72;

/** Serves the fixture tab (or fails it) and aborts every other sheet request. */
async function routeSpeakersSheet(page: Page) {
  const sheet = { up: true };
  await stubHostingOnlyScripts(page);
  await page.route('**/speakers-data.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /window\.MIRAI_SPEAKERS_SHEET_CSV = '[^']*';/,
      `window.MIRAI_SPEAKERS_SHEET_CSV = '${SPEAKERS_SHEET_URL}';`,
    );
    await route.fulfill({ response, body });
  });
  await page.route('**/docs.google.com/spreadsheets/**', (route) =>
    sheet.up && route.request().url().includes('sheet=Speakers')
      ? route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          headers: { 'access-control-allow-origin': '*' },
          body: SPEAKERS_FIXTURE,
        })
      : route.abort(),
  );
  return sheet;
}

test.describe('speakers', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('landing speakers render from the sheet and fall back to the snapshot', async ({ page }) => {
    const sheet = await routeSpeakersSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('[data-speakers="landing-cards"] .hcard');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).locator('.nm')).toHaveText('Alpha Fixturesci');
    await expect(cards.nth(0).locator('.og')).toHaveText('Fixture Lab One');
    await expect(cards.nth(1).locator('.nm')).toHaveText('Epsilon Founderface');
    await expect(cards.nth(1).locator('.spk-initials')).toHaveText('EF');

    const also = page.locator('[data-speakers="landing-also"]');
    await expect(also).toContainText('Also in the arena');
    await expect(also.locator('b')).toHaveText([
      'Beta Fixturesci', 'Gamma Rowsci', 'Delta Rowsci', 'Dr. Zeta Founderrow',
    ]);
    await expect(page.locator('body')).not.toContainText('Hiddenrow');
    const counts = page.locator('[data-speakers-count]');
    expect(await counts.count()).toBeGreaterThan(0);
    for (const text of await counts.allTextContents()) expect(text).toBe(String(SPEAKERS_PUBLISHED));

    // Cards added after load still reveal when scrolled into view.
    for (let i = 0; i < 2; i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
      await expect(cards.nth(i)).toHaveClass(/(^|\s)in(\s|$)/);
      await expect(cards.nth(i)).toHaveCSS('opacity', '1');
    }

    // The sheet is unreachable: the snapshot stays (4 cards, 72 speakers).
    sheet.up = false;
    const warned = page.waitForEvent('console', (msg) => msg.type() === 'warning' && msg.text().includes('[speakers]'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await warned;
    await expect(cards).toHaveCount(4);
    for (const text of await counts.allTextContents()) expect(text).toBe(String(SPEAKERS_SNAPSHOT_COUNT));
    await expect(page.locator('body')).not.toContainText('Fixturesci');

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });

  test('/experience/ speakers render from the sheet', async ({ page }) => {
    await routeSpeakersSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/experience/', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('[data-speakers="experience-cards"] .hcard');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).locator('.nm')).toHaveText('Alpha Fixturesci');
    await expect(cards.nth(1).locator('.nm')).toHaveText('Epsilon Founderface');

    await expect(page.locator('[data-speakers="experience-also-preview"]'))
      .toHaveText('Beta Fixturesci, Gamma Rowsci, Delta Rowsci, Dr. Zeta Founderrow…');
    const also = page.locator('[data-speakers="experience-also"]');
    await expect(also).toContainText('Also in the city');
    for (const [name, org] of [
      ['Beta Fixturesci', 'Fixture Lab Two'],
      ['Gamma Rowsci', 'Fixture Institute'],
      ['Delta Rowsci', 'Fixture University'],
      ['Dr. Zeta Founderrow', 'Fixture Ventures'],
    ]) await expect(also).toContainText(`${name} (${org})`);
    await expect(page.locator('body')).not.toContainText('Hiddenrow');
    for (const text of await page.locator('[data-speakers-count]').allTextContents()) {
      expect(text).toBe(String(SPEAKERS_PUBLISHED));
    }

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });

  test('/startups/ speaker faces render from the sheet', async ({ page }) => {
    await routeSpeakersSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/startups/', { waitUntil: 'domcontentloaded' });
    const faces = page.locator('[data-speakers="startups-cards"] figure.face');
    await expect(faces).toHaveCount(2);
    await expect(faces.nth(0)).toContainText('Alpha Fixturesci');
    await expect(faces.nth(0)).toContainText('Fixture Lab One');
    await expect(faces.nth(1)).toContainText('Epsilon Founderface');
    await expect(page.locator('body')).not.toContainText('Hiddenrow');

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });

  test('/jp/ speaker cards show the Japanese name and role from the sheet', async ({ page }) => {
    await routeSpeakersSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/jp/', { waitUntil: 'domcontentloaded' });
    const faces = page.locator('[data-speakers="jp-cards"] figure.jp-page__face');
    await expect(faces).toHaveCount(2);
    await expect(faces.nth(0)).toContainText('アルファ・フィクスチャ');
    await expect(faces.nth(0)).toContainText('主任研究員｜Fixture Lab One');
    await expect(faces.nth(0)).toContainText('フィクスチャ研究');
    // No Name JP: the Latin name stands in.
    await expect(faces.nth(1)).toContainText('Epsilon Founderface');
    await expect(page.locator('body')).not.toContainText('Hiddenrow');

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });

  test('/conferences/ speakers render by group and open a panel with talk and bio', async ({ page }) => {
    await routeSpeakersSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/conferences/', { waitUntil: 'domcontentloaded' });
    const sci = page.locator('[data-speakers="conferences-scientists"]');
    const fnd = page.locator('[data-speakers="conferences-founders"]');

    await expect(sci.locator('.faces figure')).toHaveCount(2);
    await expect(sci.locator('.faces figure').nth(0)).toContainText('Alpha Fixturesci');
    await expect(sci.locator('.faces figure').nth(1)).toContainText('Beta Fixturesci');
    await expect(sci).toContainText('The other two');
    const sciRows = sci.locator('.mrow');
    await expect(sciRows).toHaveCount(2);
    await expect(sciRows.nth(0).locator('.i')).toHaveText('03');
    await expect(sciRows.nth(0).locator('.n')).toContainText('Gamma Rowsci');
    await expect(sciRows.nth(0).locator('.s')).toHaveText('S1');
    await expect(sciRows.nth(1).locator('.n')).toContainText('Delta Rowsci');
    await expect(sciRows.nth(1).locator('.s')).toHaveText('S2 · F');

    await expect(fnd.locator('.faces figure')).toHaveCount(1);
    await expect(fnd.locator('.faces figure').nth(0)).toContainText('Epsilon Founderface');
    await expect(fnd).toContainText('The other one');
    const zeta = fnd.locator('.mrow');
    await expect(zeta).toHaveCount(1);
    await expect(zeta.locator('.i')).toHaveText('02');
    await expect(zeta.locator('.n')).toContainText('Dr. Zeta Founderrow');
    await expect(zeta.locator('.s')).toHaveText('Online');
    await expect(page.locator('body')).not.toContainText('Hiddenrow');

    // Clicking the row opens the group's panel with the talk and the bio as text.
    const panel = fnd.locator('[role="region"]');
    await zeta.click();
    await expect(zeta).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Dr. Zeta Founderrow');
    await expect(panel).toContainText('Fixture talk on <tags> & more');
    await expect(panel).toContainText('Fixture bio, with a comma & an <b>angle</b> bracket.');

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(zeta).toHaveAttribute('aria-expanded', 'false');

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });
});

/**
 * /program/ builds the timetable from the Program tab and resolves speaker
 * names against the Speakers tab, with program-data.js and speakers-data.js
 * painted first and kept when the sheet fails. Both data files are served
 * with test sheet URLs; the Program tab is a fixture layered over the
 * speakers routing above (anything that is not sheet=Program falls through
 * to it, so the speakers fixture is served and the agenda is aborted).
 * The day-two Venue link is not https and must not become a map link.
 */
const PROGRAM_SHEET_URL = 'https://docs.google.com/spreadsheets/d/test/gviz/tq?tqx=out:csv&sheet=Program';
const PROGRAM_FIXTURE = [
  'Day,Venue,Venue link,Start,End,Kind,Block,Title,Speakers,Notes,Publish',
  'Friday 1 January,Fixture Hall,https://example.com/fixture-map,09:00,09:10,open,Opening,Fixture welcome,,,TRUE',
  'Friday 1 January,,,09:10,09:40,keynote,Keynote,Fixture keynote on <tags> & more,Alpha Fixturesci (Fixture Lab One),,TRUE',
  'Friday 1 January,,,09:40,10:00,break,Coffee,Fixture coffee break,,,',
  'Friday 1 January,,,10:00,10:30,,Fixture talks,,Gamma Rowsci (Fixture Institute),,TRUE',
  'Friday 1 January,,,10:30,11:00,panel,Fixture panel block,Fixture panel title,"Dr. Zeta Founderrow (Fixture Ventures); Unknown Fixtureperson (Nowhere Institute);",,TRUE',
  'Friday 1 January,,,11:00,11:20,,Fixture talks,Fixture draft slot,,,FALSE',
  'Saturday 2 January,Fixture Venue Two,javascript:alert(1),14:00,14:30,,Fixture talks,Fixture day two talk,Beta Fixturesci,,TRUE',
  'Saturday 2 January,,,,,pitch,Demo Day pitches,Fixture Startup Co,,Fixture pitch line,TRUE',
].join('\r\n');
const PROGRAM_SNAPSHOT_DAYS = 5;
const PROGRAM_SNAPSHOT_SAT17_SLOTS = 22;

async function routeProgramSheet(page: Page) {
  const sheet = await routeSpeakersSheet(page);
  await page.route('**/program-data.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /window\.MIRAI_PROGRAM_SHEET_CSV = '[^']*';/,
      `window.MIRAI_PROGRAM_SHEET_CSV = '${PROGRAM_SHEET_URL}';`,
    );
    await route.fulfill({ response, body });
  });
  await page.route('**/docs.google.com/spreadsheets/**', (route) =>
    sheet.up && route.request().url().includes('sheet=Program')
      ? route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          headers: { 'access-control-allow-origin': '*' },
          body: PROGRAM_FIXTURE,
        })
      : route.fallback(),
  );
  return sheet;
}

test.describe('program', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('/program/ renders days, slots and speakers from the sheet', async ({ page }) => {
    await routeProgramSheet(page);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/program/', { waitUntil: 'domcontentloaded' });
    const dayButtons = page.locator('[data-program="days"] button');
    const days = page.locator('[data-program="day"]');
    await expect(dayButtons).toHaveCount(2);
    await expect(days).toHaveCount(2);
    await expect(days.nth(0)).toHaveAttribute('id', /friday_1_january/);
    await expect(days.nth(0)).toBeVisible();
    await expect(days.nth(1)).toBeHidden();
    await expect(dayButtons.nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expect(days.nth(0)).toContainText('Fixture Hall');
    await expect(days.nth(0).locator('a[href="https://example.com/fixture-map"]')).toHaveCount(1);

    const day1 = days.nth(0);
    const slots = day1.locator('.pg-slot');
    await expect(slots).toHaveCount(5);
    await expect(page.locator('body')).not.toContainText('Fixture draft slot');

    const keynote = slots.filter({ hasText: 'Fixture keynote' });
    await expect(keynote).toContainText('09:10');
    await expect(keynote).toContainText('09:40');
    await expect(keynote).toContainText('Fixture keynote on <tags> & more');

    const tbc = slots.filter({ hasText: 'Gamma Rowsci' });
    await expect(tbc).toContainText(/to be confirmed/i);

    // Two speakers: the one in the Speakers tab is a button, the other plain text.
    const panelSlot = slots.filter({ hasText: 'Fixture panel title' });
    const zeta = panelSlot.locator('button[data-speaker]', { hasText: 'Zeta Founderrow' });
    await expect(zeta).toHaveCount(1);
    await expect(panelSlot).toContainText('Unknown Fixtureperson');
    await expect(panelSlot).toContainText('Nowhere Institute');
    await expect(panelSlot.locator('button', { hasText: 'Unknown Fixtureperson' })).toHaveCount(0);

    const panel = page.locator('.spk-panel[role="region"]');
    await zeta.click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Dr. Zeta Founderrow');
    await expect(panel).toContainText('Fixture bio, with a comma & an <b>angle</b> bracket.');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();

    // The day switcher shows day two, keeps it in the hash, and lists its pitch.
    await dayButtons.nth(1).click();
    await expect(days.nth(1)).toBeVisible();
    await expect(days.nth(0)).toBeHidden();
    await expect(dayButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/#.*saturday_2_january/);
    await expect(days.nth(1)).toContainText('Fixture day two talk');
    await expect(days.nth(1).getByRole('link', { name: /map/i })).toHaveCount(0);
    const pitches = page.locator('[data-program="pitches"]');
    await expect(pitches).toBeVisible();
    await expect(pitches).toContainText('Fixture Startup Co');
    await expect(pitches).toContainText('Fixture pitch line');

    // The roster and the count come from the Speakers tab.
    await expect(page.locator('[data-program="roster"] [data-speaker]')).toHaveCount(SPEAKERS_PUBLISHED);
    await expect(page.locator('body')).not.toContainText('Hiddenrow');
    for (const text of await page.locator('[data-speakers-count]').allTextContents()) {
      expect(text).toBe(String(SPEAKERS_PUBLISHED));
    }

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });

  test('/program/ keeps the snapshot when the sheet is unreachable', async ({ page }) => {
    const sheet = await routeProgramSheet(page);
    sheet.up = false;
    const consoleFailures = collectConsoleFailures(page);

    const warned = page.waitForEvent('console', (msg) => msg.type() === 'warning' && msg.text().includes('[program]'));
    await page.goto('/program/', { waitUntil: 'domcontentloaded' });
    await warned;
    await expect(page.locator('[data-program="days"] button')).toHaveCount(PROGRAM_SNAPSHOT_DAYS);
    const sat17 = page.locator('[data-program="day"]').first();
    await expect(sat17).toHaveAttribute('id', /saturday_17_october/);
    await expect(sat17.locator('.pg-slot')).toHaveCount(PROGRAM_SNAPSHOT_SAT17_SLOTS);
    await expect(page.locator('[data-program="roster"] [data-speaker]')).toHaveCount(SPEAKERS_SNAPSHOT_COUNT);
    const counts = page.locator('[data-speakers-count]');
    expect(await counts.count()).toBeGreaterThan(0);
    for (const text of await counts.allTextContents()) expect(text).toBe(String(SPEAKERS_SNAPSHOT_COUNT));
    await expect(page.locator('body')).not.toContainText('Fixture');

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });
});
