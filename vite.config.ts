import { copyFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';

/**
 * GitHub Pages serves `404.html` for any path it has no file for, so unknown
 * paths need the app shell in order to boot and let the router render its
 * catch-all route. This copies the shell *this build* just wrote, on purpose:
 * a hand-written `public/404.html` would be copied verbatim (public assets are
 * never transformed) and keep the dev-only `/src/main.tsx` script tag, while a
 * copy taken after `pnpm prerender` would be the homepage snapshot instead of
 * an empty shell. `dist` is hardcoded to match `scripts/prerender.mjs`.
 */
function emitNotFoundShell(): Plugin {
  return {
    name: 'emit-not-found-shell',
    apply: 'build',
    closeBundle: async () => {
      await copyFile('dist/index.html', 'dist/404.html');
    },
  };
}

/**
 * Fonts the homepage needs for its first paint: the rail name and the hero
 * statement are display serif, everything else in the rail is sans 400.
 * `latin-ext` is in the list because "Kosztyła" is above the fold — without it
 * the ł arrives a beat late in a fallback face, mid-surname.
 *
 * Injected at build time only: in dev these files are served straight from
 * node_modules under different URLs, so a static tag would just 404.
 */
const PRELOADED_FONTS = [
  'ibm-plex-serif-latin-600-normal.woff2',
  'ibm-plex-serif-latin-ext-600-normal.woff2',
  'ibm-plex-sans-latin-400-normal.woff2',
];

function injectFontPreloads(): Plugin {
  return {
    name: 'inject-font-preloads',
    apply: 'build',
    transformIndexHtml: () => PRELOADED_FONTS.map((file) => ({
      tag: 'link',
      attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/assets/fonts/${file}`, crossorigin: '' },
      injectTo: 'head-prepend' as const,
    })),
  };
}

// `test` is typed via Vitest while `defineConfig`/`react()` stay on Vite's own
// types, avoiding the dual Vite-version type clash from `vitest/config`.
const config: UserConfig & { test: InlineConfig } = {
  base: '/',
  plugins: [react(), emitNotFoundShell(), injectFontPreloads()],
  build: {
    rollupOptions: {
      output: {
        // Fonts keep stable, unhashed names so the preload tags above can
        // address them. They are versioned by the package, not by content.
        assetFileNames: (asset) => (/\.woff2?$/.test(asset.names?.[0] ?? '')
          ? 'assets/fonts/[name][extname]'
          : 'assets/[name]-[hash][extname]'),
      },
    },
  },
  resolve: {
    alias: {
      '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    // Vitest's default include glob matches *.spec.ts anywhere in the repo,
    // which would otherwise also pick up e2e/*.spec.ts -- those are
    // @playwright/test files, not Vitest ones, and crash if Vitest runs them.
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
};

export default defineConfig(config);
