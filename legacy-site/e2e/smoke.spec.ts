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

const PAGES = ['/', '/experience/', '/startups/', '/pricing/', '/conferences/', '/jp/'];

/** Every page at phone and desktop; the landing page also at tablet and MacBook widths. */
const RUNS = [
  ...PAGES.flatMap((path) => [
    { path, width: 375, height: 812 },
    { path, width: 1280, height: 800 },
  ]),
  { path: '/', width: 768, height: 1024 },
  { path: '/', width: 1440, height: 900 },
];

/** Console errors and uncaught exceptions are both failures. */
function collectConsoleFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(`[error] ${msg.text()}`);
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
 */
async function unrevealedBlocks(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const blocks = [...document.querySelectorAll<HTMLElement>('.rv')]
      .filter((el) => el.getClientRects().length > 0);
    const failures: string[] = [];
    for (const [index, el] of blocks.entries()) {
      el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
      const deadline = Date.now() + 3000;
      while (
        Date.now() < deadline &&
        !(el.classList.contains('in') && +getComputedStyle(el).opacity > 0.5)
      ) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (!el.classList.contains('in') || +getComputedStyle(el).opacity <= 0.5) {
        const label = el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}.rv[${index}]`;
        failures.push(`${label} (in=${el.classList.contains('in')}, opacity=${getComputedStyle(el).opacity})`);
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

    await page.goto(run.path);
    await expect(page.locator('h1').first()).toBeVisible();

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
