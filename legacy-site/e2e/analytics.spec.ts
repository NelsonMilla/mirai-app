import { expect, test, type Page } from '@playwright/test';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = join(process.cwd(), '..', 'new-site');
const analyticsSource = readFileSync(join(siteRoot, 'analytics.js'), 'utf8');

/**
 * Every page Vercel serves from new-site/ that carries the shared analytics
 * stack. Keep this list in step with the folders on disk: the guard test below
 * fails with a readable message when a page is retired, instead of the file
 * reads in later tests dying with ENOENT.
 */
const PAGES = [
  'index.html',
  'experience/index.html',
  'jp/index.html',
  'pricing/index.html',
  'conferences/index.html',
  'startups/index.html',
  'fashion-show/index.html',
  'citizens/index.html',
  'stay/index.html',
];

test('every listed page still exists on disk', () => {
  const missing = PAGES.filter((page) => !existsSync(join(siteRoot, page)));
  expect(missing, 'retired pages must be removed from PAGES').toEqual([]);
});

// The Summit + Hotel package was retired on 2026-09-18. Nothing on the live
// site may still sell, link, or describe it: cached deep links must find no
// offer, and copy must not promise hotel nights. Sweeps every text file that
// deploys, skipping the design-round draft folders.
const SKIP_DIRS = new Set(['_v', '_nav', 'img', '.posthog-wizard-cache', 'node_modules']);
// .md is skipped: README and ANALYTICS may narrate the retirement.
const TEXT_EXT = /\.(html|js|txt|xml|yml|json)$/;
function deployedTextFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return SKIP_DIRS.has(name) ? [] : deployedTextFiles(full);
    // vercel.json holds the 301 for the old URL, so it must name it.
    if (name === 'vercel.json') return [];
    return TEXT_EXT.test(name) ? [full] : [];
  });
}

test('no deployed file still mentions the retired summit + hotel package', () => {
  const retired = /summit-bundle|SFSH|ttype-0BjQv0xV4yY5P0l|hotel package|showSummitPackage|packageSpots|summit_hotel|summit-hotel/i;
  const offenders = deployedTextFiles(siteRoot).flatMap((file) => {
    const lines = readFileSync(file, 'utf8').split('\n');
    return lines.flatMap((line, i) => (retired.test(line) ? [`${file.slice(siteRoot.length + 1)}:${i + 1}`] : []));
  });
  expect(offenders).toEqual([]);
});

test('every standalone page loads the shared analytics tracker', () => {
  for (const page of PAGES) {
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
  for (const page of PAGES) {
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
  for (const page of PAGES) {
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

test('the stay page tells summit buyers they are confirmed and pass buyers they are in review', async ({ page }) => {
  await page.route('**/_vercel/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  const html = readFileSync(join(siteRoot, 'stay/index.html'), 'utf8');
  expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
  expect(readFileSync(join(siteRoot, 'sitemap.xml'), 'utf8')).not.toContain('/stay/');

  await page.goto('http://localhost:4321/stay/?session_id=cs_test_summit');
  await expect(page.locator('h1:visible')).toHaveText('Your ticket is confirmed.');

  // The $1,200 pass is authorised, not charged, until the booking is reviewed.
  await page.goto('http://localhost:4321/stay/?session_id=cs_test_pass&pass=everything');
  await expect(page.locator('h1:visible')).toHaveText('Your booking is in review.');
  await expect(page.locator('.lede:visible')).toContainText('held, not charged');
});

test('the landing page reports section reach across the whole page', async ({ page }) => {
  await capturePostHogEvents(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/');

  for (const section of ['summits', 'agenda', 'apply']) {
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

test('the mobile landing hero stays static, direct, and scrollable', async ({ page }) => {
  // The static server has no Vercel runtime; stub the insights script so its
  // 404 cannot masquerade as a page problem.
  await page.route('**/_vercel/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('http://localhost:4321/');

  // Copy changes on every wording pass, so only the revenue links and the
  // structure are asserted here: brand in the shared nav, one ticket CTA in
  // the nav and one in the hero, both pointing at the live checkout.
  await expect(page.locator('nav .nd-logo')).toContainText('Mirai');
  await expect(page.locator('nav .nd-cta')).toHaveAttribute('href', 'https://luma.com/an4zotn9');
  await expect(page.locator('.hero h1')).not.toBeEmpty();
  await expect(page.locator('.heroActions a')).toHaveCount(1);
  await expect(page.locator('[data-analytics-location="hero_primary"]'))
    .toHaveAttribute('href', 'https://luma.com/an4zotn9');

  const mobileState = await page.evaluate(() => ({
    heroVideoSource: (document.querySelector('.heroVideo') as HTMLVideoElement).currentSrc,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    actionHeights: [...document.querySelectorAll('.heroActions a')]
      .map((link) => link.getBoundingClientRect().height),
    heroContentTop: document.querySelector('.heroContent')!.getBoundingClientRect().top,
    heroContentBottom: document.querySelector('.heroContent')!.getBoundingClientRect().bottom,
    heroBottom: document.querySelector('.hero')!.getBoundingClientRect().bottom,
  }));
  expect(mobileState.heroVideoSource).toBe('');
  expect(mobileState.horizontalOverflow).toBe(false);
  expect(Math.min(...mobileState.actionHeights)).toBeGreaterThanOrEqual(44);
  expect(mobileState.heroContentTop).toBeGreaterThanOrEqual(72);
  expect(mobileState.heroContentBottom).toBeLessThan(mobileState.heroBottom);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator('.heroContent')).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 844, height: 390 });
  const landscapeState = await page.evaluate(() => ({
    contentTop: document.querySelector('.heroContent')!.getBoundingClientRect().top,
    contentBottom: document.querySelector('.heroContent')!.getBoundingClientRect().bottom,
    heroBottom: document.querySelector('.hero')!.getBoundingClientRect().bottom,
    continueAnimation: getComputedStyle(document.querySelector('.heroContinue')!).animationName,
  }));
  expect(landscapeState.contentTop).toBeGreaterThanOrEqual(72);
  expect(landscapeState.contentBottom).toBeLessThan(landscapeState.heroBottom);
  expect(landscapeState.continueAnimation).toBe('none');

  await page.setViewportSize({ width: 375, height: 812 });

  await page.locator('.heroContinue').click();
  await expect(page).toHaveURL(/#pillars$/);
  await expect.poll(() => page.evaluate(() => Math.round(
    document.getElementById('pillars')!.getBoundingClientRect().top,
  ))).toBeLessThanOrEqual(80);
});
