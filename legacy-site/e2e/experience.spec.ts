import { expect, test, type Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

function collectConsoleFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`[error] ${message.text()}`);
  });
  page.on('pageerror', (error) => failures.push(`[pageerror] ${error.message}`));
  return failures;
}

for (const viewport of VIEWPORTS) {
  test(`experience guide @ ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const consoleFailures = collectConsoleFailures(page);

    await page.goto('/experience');
    await expect(page.locator('h1')).toHaveText('Live the region.');

    const dimensions = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.pageWidth, 'experience page must not overflow horizontally').toBeLessThanOrEqual(
      dimensions.viewportWidth,
    );

    for (const id of ['island', 'kobe', 'eat-restore', 'kansai', 'live', 'plan']) {
      await expect(page.locator(`#${id}`), `#${id} is present`).toHaveCount(1);
    }

    await page.locator('#experience-search-input').fill('rainy day');
    await expect(page.locator('.experience-entry')).toHaveCount(2);
    await expect(page.locator('#animal-kingdom')).toBeVisible();
    await expect(page.locator('#science-museum')).toBeVisible();

    expect(consoleFailures, 'experience console must stay clean').toEqual([]);
  });
}

