// Captures a fixed 1280x720 screenshot of the homepage's initial viewport
// (no scrolling) for README.md. Unlike scripts/screenshotDiacritics.mjs this
// output is meant to be committed -- it's what a repo visitor sees, not a
// local check -- so it shoots the real homepage, not a synthetic specimen.
//
// Run after `pnpm build`:  node scripts/screenshotReadme.mjs
// Needs a real browser and a bindable local port, same as `pnpm prerender`.
import { chromium } from 'playwright';
import { preview } from 'vite';

const OUT = 'docs/homepage-preview.png';
const PORT = 4176;

async function main() {
  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) {
    throw new Error('Vite preview server did not resolve a local URL.');
  }

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *');
    await page.evaluate(() => document.fonts.ready);

    await page.screenshot({ path: OUT });
    console.log(`wrote ${OUT}`);
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
