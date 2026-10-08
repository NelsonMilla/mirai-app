import { defineConfig } from '@playwright/test';

// Both specs drive the live static site in ../new-site on port 4321. The Next
// app in this folder is not deployed, so it is no longer started for tests.
// NEW_SITE_PORT moves the server (e.g. a worktree's own copy); unset means 4321.
const port = Number(process.env.NEW_SITE_PORT || 4321);

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `python3 -m http.server ${port} -d ../new-site`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
