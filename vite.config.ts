import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';

// `test` is typed via Vitest while `defineConfig`/`react()` stay on Vite's own
// types, avoiding the dual Vite-version type clash from `vitest/config`.
const config: UserConfig & { test: InlineConfig } = {
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
  },
};

export default defineConfig(config);
