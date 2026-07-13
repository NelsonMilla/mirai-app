/**
 * Cross-viewport smoke test for the landing page.
 *
 * Exists because these exact classes of bug shipped before:
 * - sections deadlocked invisible behind reveal animations
 * - grid rows collapsing to 0px (roster fighters unreachable)
 * - horizontal overflow at intermediate widths
 * - a bare element selector restyling unrelated components
 *
 * For each viewport: load, scroll through the whole page, assert every
 * reveal-gated section actually reveals, nothing widens the page, and the
 * console stays clean. At 1280 it also exercises the main interactions.
 */
import { test, expect, Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

/** Console errors + the next/image sizing warning are both failures. */
function collectConsoleFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(`[error] ${msg.text()}`);
    if (msg.type() === 'warning' && /has "fill"/.test(msg.text())) {
      failures.push(`[warn] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => failures.push(`[pageerror] ${err.message}`));
  return failures;
}

async function waitForLoaderGone(page: Page) {
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('loading'),
    undefined,
    { timeout: 15_000 },
  );
}

/** Instant-scroll through the page in steps so IntersectionObservers fire. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y <= H; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 150));
    }
  });
}

/** Reveal-gated sections are discovered from the DOM, not hardcoded. */
async function revealSectionIds(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('section[id]')]
      .filter((s) =>
        ['reveal', 'reveal-track', 'reveal-scale'].some((c) => s.classList.contains(c)),
      )
      .map((s) => s.id),
  );
}

for (const vp of VIEWPORTS) {
  test(`landing page smoke @ ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/');
    await waitForLoaderGone(page);

    // Off-canvas entrance states must not widen the page even before any
    // reveal fires (regression: chapter cards parked at +300% translateX
    // kept the document ~1300px wide — horizontal panning on iOS).
    const preScroll = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }));
    expect(preScroll.scrollW, 'no horizontal overflow on load').toBeLessThanOrEqual(preScroll.vw);

    const ids = await revealSectionIds(page);
    expect(ids.length, 'expected reveal-gated sections on the page').toBeGreaterThanOrEqual(8);

    // Every section must reveal when scrolled to.
    for (const id of ids) {
      await page.evaluate((sectionId) => {
        document
          .getElementById(sectionId)!
          .scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
      }, id);
      await expect(page.locator(`#${id}`), `#${id} should reveal`).toHaveClass(/\bin\b/, {
        timeout: 10_000,
      });
      // Belt and braces: it must also *paint* — opacity above zero.
      await expect
        .poll(
          () =>
            page.evaluate(
              (sectionId) => +getComputedStyle(document.getElementById(sectionId)!).opacity,
              id,
            ),
          { message: `#${id} should be visible (opacity > 0.5)` },
        )
        .toBeGreaterThan(0.5);
    }

    // Full pass, then: nothing may widen the page.
    await scrollThrough(page);
    await page.waitForTimeout(1200); // let entrance transitions settle
    const { scrollW, vw } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }));
    expect(scrollW, 'no horizontal overflow after full scroll-through').toBeLessThanOrEqual(vw);

    // Every lifestyle card must actually deal in (regression: on phones
    // cards 3-4 started fully off-viewport, so their per-card observer
    // never fired and they stayed invisible).
    const cardOpacities = await page.evaluate(() =>
      [...document.querySelectorAll('.life-card')].map(
        (c) => +getComputedStyle(c).opacity,
      ),
    );
    expect(cardOpacities.length).toBeGreaterThan(0);
    expect(
      Math.min(...cardOpacities),
      'every lifestyle card must deal in',
    ).toBeGreaterThan(0.5);

    // Roster: every fighter slot must have real height (regression: rows
    // past the 8th collapsed to 0px on desktop).
    const slotHeights = await page.evaluate(() =>
      [...document.querySelectorAll('.roster-slot')].map((s) =>
        Math.round(s.getBoundingClientRect().height),
      ),
    );
    expect(slotHeights.length).toBeGreaterThan(0);
    expect(
      Math.min(...slotHeights),
      'every roster slot must be tappable-height',
    ).toBeGreaterThan(40);

    expect(consoleFailures, 'console must be clean').toEqual([]);
  });
}

test('interactions @ 1280x800', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const consoleFailures = collectConsoleFailures(page);

  await page.goto('/');
  await waitForLoaderGone(page);

  // Track selection themes the page.
  await page.evaluate(() =>
    document.getElementById('tracks')!.scrollIntoView({ behavior: 'instant' as ScrollBehavior }),
  );
  await expect(page.locator('#tracks')).toHaveClass(/\bin\b/);
  await page.locator('.track.devices').click();
  await expect(page.locator('html')).toHaveAttribute('data-track', 'devices');
  await expect(page.locator('.track-chosen-banner')).toContainText(/devices/i);

  // With a track selected, sections must still reveal (mask-wipe regression).
  for (const id of ['runway', 'kobe', 'apply']) {
    await page.evaluate((sectionId) => {
      document
        .getElementById(sectionId)!
        .scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
    }, id);
    await expect(page.locator(`#${id}`), `#${id} reveals under devices track`).toHaveClass(
      /\bin\b/,
      { timeout: 10_000 },
    );
  }

  // Lifestyle card flips in place; Escape flips it back.
  await page.evaluate(() =>
    document
      .querySelector('.life-card')!
      .scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' }),
  );
  await page.locator('.life-card').first().click();
  await expect(page.locator('.life-card').first()).toHaveClass(/flipped/, { timeout: 10_000 });
  await page.keyboard.press('Escape');
  await expect(page.locator('.life-card').first()).not.toHaveClass(/flipped/);

  // FAQ accordion.
  await page.evaluate(() =>
    document.getElementById('faq')!.scrollIntoView({ behavior: 'instant' as ScrollBehavior }),
  );
  await page.locator('.faq-item .faq-q').first().click();
  await expect(page.locator('.faq-item').first()).toHaveClass(/open/);

  expect(consoleFailures, 'console must be clean').toEqual([]);
});
