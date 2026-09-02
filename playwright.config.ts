// Visual-regression config. Separate from the plain `playwright` driver used
// by scripts/prerender.mjs and scripts/screenshotDiacritics.mjs -- this one
// drives the @playwright/test runner and its toHaveScreenshot() baselines.
//
// Run after `pnpm build`: pnpm test:visual / pnpm test:visual:update
// Needs a real browser and a bindable local port, same as `pnpm prerender`.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4175;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // Not `pnpm exec vite ...`: webServer spawns via a raw shell that has no
    // knowledge of Corepack, so `pnpm` itself is "command not found" here.
    command: `node_modules/.bin/vite preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: true,
  },
});
