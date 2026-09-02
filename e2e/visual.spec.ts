import { expect, test } from '@playwright/test';

test('homepage matches the committed baseline screenshot', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#root > *');
  // A string, not a function, so this doesn't need `dom` in tsconfig's `lib`.
  await page.waitForFunction('document.fonts.status === "loaded"');

  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
});
