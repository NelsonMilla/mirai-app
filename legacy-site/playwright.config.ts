import { defineConfig } from '@playwright/test';

// Both specs drive the live static site in ../new-site on port 4321. The Next
// app in this folder is not deployed, so it is no longer started for tests.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4321 -d ../new-site',
    url: 'http://localhost:4321/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
