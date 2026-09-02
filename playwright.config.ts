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
  // Default template appends {-projectName}{-platform} (e.g. "-chromium-darwin").
  // This suite runs one project on one machine (local-only, see
  // .claude/plans/pixel-diff-test-planned-2026-09-02.md) so a platform-qualified
  // filename only adds confusion, not safety -- drop both.
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
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
