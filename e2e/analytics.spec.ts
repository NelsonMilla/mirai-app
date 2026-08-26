import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = join(process.cwd(), 'new-site');
const analyticsSource = readFileSync(join(siteRoot, 'analytics.js'), 'utf8');

test('every standalone page loads the shared analytics tracker', () => {
  const pages = [
    'index.html',
    'early-bird/index.html',
    'experience/index.html',
    'jp/index.html',
    'summit-bundle/index.html',
  ];

  for (const page of pages) {
    const html = readFileSync(join(siteRoot, page), 'utf8');
    expect(html, page).toContain('<script defer src="/analytics.js"></script>');
  }
});

test('tracks one visit after five visible seconds', async ({ page }) => {
  await page.setContent('<body></body>');
  await page.evaluate(() => {
    const analyticsWindow = window as typeof window & {
      analyticsCalls: unknown[][];
      va: (...args: unknown[]) => number;
    };
    analyticsWindow.analyticsCalls = [];
    analyticsWindow.va = (...args: unknown[]) => analyticsWindow.analyticsCalls.push(args);
  });
  await page.addScriptTag({ content: analyticsSource });

  await expect.poll(async () => page.evaluate(() => {
    const analyticsWindow = window as typeof window & { analyticsCalls: unknown[][] };
    return analyticsWindow.analyticsCalls.filter(([, payload]) => (
      payload as { name?: string }
    )?.name === '5-Second Visit').length;
  }), { timeout: 6500 }).toBe(1);

  await page.waitForTimeout(1000);
  const events = await page.evaluate(() => {
    const analyticsWindow = window as typeof window & { analyticsCalls: unknown[][] };
    return analyticsWindow.analyticsCalls;
  });
  expect(events).toEqual([['event', { name: '5-Second Visit', data: {} }]]);
});

test('every standalone page loads the PostHog bridge before the tracker', () => {
  const pages = [
    'index.html',
    'early-bird/index.html',
    'experience/index.html',
    'jp/index.html',
    'summit-bundle/index.html',
  ];

  for (const page of pages) {
    const html = readFileSync(join(siteRoot, page), 'utf8');
    const posthog = html.indexOf('<script defer src="/posthog.js"></script>');
    const tracker = html.indexOf('<script defer src="/analytics.js"></script>');
    expect(posthog, page).toBeGreaterThan(-1);
    expect(posthog, page).toBeLessThan(tracker);
  }
});

// Every paid conversion on this site starts by leaving for Luma. An unmarked
// Luma link is a hole in the funnel, so the markup itself is the assertion.
test('every Luma link on a landing page is instrumented', () => {
  for (const page of ['index.html', 'early-bird/index.html', 'summit-bundle/index.html', 'experience/index.html']) {
    const html = readFileSync(join(siteRoot, page), 'utf8');
    const unmarked = (html.match(/<a[^>]*luma\.com[^>]*>/g) ?? [])
      .filter((anchor) => !anchor.includes('data-analytics-action'));
    expect(unmarked, page).toEqual([]);
  }
});

/** Records what analytics.js hands to PostHog, without loading the real library. */
async function capturePostHogEvents(page: Page) {
  await page.route('**://*.i.posthog.com/**', (route) => route.abort());
  await page.addInitScript(() => {
    const target = window as typeof window & {
      posthogEvents: [string, Record<string, unknown>][];
      MiraiPostHog?: { capture: (name: string, properties: Record<string, unknown>) => void };
    };
    target.posthogEvents = [];
    let bridge: typeof target.MiraiPostHog;
    Object.defineProperty(window, 'MiraiPostHog', {
      configurable: true,
      get: () => bridge,
      set: (value) => {
        bridge = {
          capture: (name, properties) => {
            target.posthogEvents.push([name, properties]);
            value.capture(name, properties);
          },
        };
      },
    });
  });
}

const posthogEvents = (page: Page) => page.evaluate(() => (
  window as typeof window & { posthogEvents: [string, Record<string, unknown>][] }
).posthogEvents);

test('the early bird funnel reports section reach and checkout intent', async ({ page }) => {
  await capturePostHogEvents(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/early-bird/');

  // No experiment assertion here on purpose: the early bird page ran an
  // `early_bird_hero_framing_v1` A/B that the CXL redesign retired, and the
  // redesigned hero has a single arm. Do not re-add one unless a real test is
  // wired up — summit-bundle is the page that still assigns a variant.
  // `offer` is listed so the loop polls for its Section Viewed event instead of
  // racing the scroll away from it. It registers during page load only
  // sometimes, which made sections_viewed flip between 3 and 4 under load.
  for (const section of ['offer', 'proof', 'pricing', 'program']) {
    await page.locator(`[data-track-section="${section}"]`).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await posthogEvents(page))
      .some(([name, properties]) => name === 'Section Viewed' && properties.section === section))
      .toBe(true);
  }

  await page.locator('[data-analytics-action="checkout"][data-analytics-location="close"]')
    .click({ noWaitAfter: true });

  const checkout = (await posthogEvents(page)).find(([name]) => name === 'Checkout Opened');
  expect(checkout).toBeDefined();
  // Section positions: offer/1, program/2, proof/3, pricing/4, close/5.
  // The loop visits four of them and `pricing` at 4 is the deepest. `close`
  // is not counted: Checkout Opened fires before the click's scroll
  // registers it.
  expect(checkout?.[1]).toMatchObject({
    location: 'close',
    is_first_checkout: true,
    sections_viewed: 4,
    deepest_section: 'pricing',
    deepest_section_position: 4,
  });
  // No variant suffix: this page no longer runs an A/B, so `offer()` returns
  // the bare offer id. summit-bundle is where a variant still gets appended.
  expect(checkout?.[1].offer).toBe('early_bird_399');
});

test('the landing page reports section reach across the whole page', async ({ page }) => {
  await capturePostHogEvents(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/');

  for (const section of ['summits', 'residency', 'apply']) {
    await page.locator(`[data-track-section="${section}"]`).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await posthogEvents(page))
      .some(([name, properties]) => name === 'Section Viewed' && properties.section === section))
      .toBe(true);
  }

  await page.locator('[data-analytics-action="checkout"][data-analytics-location="apply"]')
    .first().click({ noWaitAfter: true });

  const checkout = (await posthogEvents(page)).find(([name]) => name === 'Checkout Opened');
  expect(checkout?.[1]).toMatchObject({
    offer: 'mirai_city',
    location: 'apply',
    checkout_target: 'tickets',
    is_first_checkout: true,
  });
  expect(Number(checkout?.[1].sections_viewed)).toBeGreaterThan(0);
});
