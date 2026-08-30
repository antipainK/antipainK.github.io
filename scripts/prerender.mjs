// Build-time prerender: after `vite build`, snapshot each real route in the
// already-built app to a real `dist/<route>/index.html` file, so GitHub Pages
// (a static host with no server-side rewrites) serves genuine content and
// per-route <title>/meta tags instead of 404ing on a direct hit or refresh.
//
// Not a TypeScript file on purpose -- it's run directly by Node (see the
// "prerender" script in package.json), and Node 24 executes plain .ts files
// natively, so the sibling .ts modules below are imported as-is with no
// build step or extra loader dependency.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';
import { projects } from '../src/data/projects.ts';
import { deriveRoutes } from './deriveRoutes.ts';

const DIST_DIR = 'dist';
const PORT = 4173;

async function main() {
  const routes = deriveRoutes(projects);

  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) {
    throw new Error('Vite preview server did not resolve a local URL to prerender against.');
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    for (const route of routes) {
      const url = new URL(route, baseUrl).toString();
      await page.goto(url, { waitUntil: 'networkidle' });
      // Wait for React to have actually rendered something into #root,
      // not just the empty shell from index.html.
      await page.waitForSelector('#root > *');

      const html = await page.content();
      const outDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
      console.log(`prerendered ${route} -> ${path.join(outDir, 'index.html')}`);
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
