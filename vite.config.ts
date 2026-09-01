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

// `test` is typed via Vitest while `defineConfig`/`react()` stay on Vite's own
// types, avoiding the dual Vite-version type clash from `vitest/config`.
const config: UserConfig & { test: InlineConfig } = {
  base: '/',
  plugins: [react(), emitNotFoundShell()],
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
  },
};

export default defineConfig(config);
