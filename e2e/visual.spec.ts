import { expect, test } from '@playwright/test';

// The page derives durations ("2 yr 6 mo") from the current date, so an unfrozen
// clock fails this test every month. Baselines were taken on this date.
const FROZEN_CLOCK = new Date('2026-09-02T12:00:00Z');

test('homepage matches the committed baseline screenshot', async ({ page }) => {
  await page.clock.setFixedTime(FROZEN_CLOCK);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#root > *');
  // A string, not a function, so this doesn't need `dom` in tsconfig's `lib`.
  await page.waitForFunction('document.fonts.status === "loaded"');

  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
});
