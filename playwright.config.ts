import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  // One retry absorbs next-dev cold-compile jank on first page loads.
  retries: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    // The standalone new-site deployment is plain static files; analytics.spec.ts
    // drives the real pages to check the conversion funnel end to end.
    {
      command: 'python3 -m http.server 4321 -d new-site',
      url: 'http://localhost:4321/',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
