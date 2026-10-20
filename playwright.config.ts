// Visual-regression config. Separate from the plain `playwright` driver used
// by scripts/prerender.mjs and scripts/screenshotDiacritics.mjs -- this one
// drives the @playwright/test runner and its toHaveScreenshot() baselines.
//
// Run after `pnpm build`: pnpm test:visual (pnpm screenshots:update regenerates baselines)
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
    // knowledge of the shell's pnpm shim, so `pnpm` can be "command not found" here. Not
    // `node_modules/.bin/vite` either: cmd.exe rejects that forward-slash path on
    // Windows. Invoking Vite's JS entry through node works in every shell.
    command: `node node_modules/vite/bin/vite.js preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: true,
  },
});
