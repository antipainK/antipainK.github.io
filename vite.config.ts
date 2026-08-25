import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';

// `test` is typed via Vitest while `defineConfig`/`react()` stay on Vite's own
// types, avoiding the dual Vite-version type clash from `vitest/config`.
const config: UserConfig & { test: InlineConfig } = {
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
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
