// Renders the Polish pangram in both faces and every loaded weight, then
// screenshots it, so a `latin-ext` regression is visible rather than inferred.
//
// The phrase carries all nine Polish diacritics (ł ą ę ś ż ź ć ń plus ó). If a
// weight is imported as `latin` only, its diacritics fall back to a system face
// and the affected glyphs jump in width or shape mid-word. `ó` is in basic
// latin, so it keeps rendering correctly either way -- which is exactly what
// makes the bug easy to miss by eye on ordinary copy.
//
// Run after `pnpm build`:  node scripts/screenshotDiacritics.mjs
// Needs a real browser and a bindable local port, same as `pnpm prerender`.
import { chromium } from 'playwright';
import { preview } from 'vite';

const PHRASE = 'Zażółć gęślą jaźń — Wojciech Kosztyła';
const OUT = 'diacritics.png';
const PORT = 4174;

// Exactly the weights main.tsx imports. Adding one that is not loaded would
// render a synthesised face and send a reader chasing a bug that isn't there.
const SPECIMENS = [
  { face: 'var(--font-ui)', label: 'IBM Plex Sans 400', weight: 400 },
  { face: 'var(--font-ui)', label: 'IBM Plex Sans 500', weight: 500 },
  { face: 'var(--font-display)', label: 'IBM Plex Serif 600', weight: 600 },
];

async function main() {
  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) {
    throw new Error('Vite preview server did not resolve a local URL.');
  }

  const browser = await chromium.launch();
  const requests = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
    page.on('request', (request) => requests.push(request.url()));

    // Load the real page first so the built CSS, tokens and @font-face rules apply.
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *');

    await page.evaluate(({ phrase, specimens }) => {
      document.body.innerHTML = specimens.map(({ face, label, weight }) => `
        <p style="margin:0 0 4px;font:13px var(--font-ui);color:var(--ink-faint)">${label}</p>
        <p style="margin:0 0 28px;font-family:${face};font-weight:${weight};font-size:34px;color:var(--ink)">${phrase}</p>
      `).join('');
      document.body.style.padding = '32px';
    }, { phrase: PHRASE, specimens: SPECIMENS });

    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: OUT, fullPage: true });

    const thirdParty = [...new Set(requests)]
      .filter((url) => !url.startsWith(baseUrl))
      .filter((url) => !url.startsWith('data:'));

    console.log(`wrote ${OUT}`);
    console.log(thirdParty.length === 0
      ? 'no third-party requests — nothing left the origin'
      : `THIRD-PARTY REQUESTS:\n${thirdParty.join('\n')}`);
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
