import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // Base: JS + TypeScript recommended, with a few opinionated core rules.
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      'curly': 'error',
      'eqeqeq': ['error', 'smart'],
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-restricted-exports': ['error', { restrictDefaultExports: { direct: true } }],
      'no-unneeded-ternary': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-template': 'error',
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    },
  },

  // Tool config files must use a default export.
  {
    files: ['*.config.{js,ts}'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },

  // App code: import features through their index.ts, use aliases instead of `../`, and never
  // reach into dev-only folders.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@features/*/*'], message: 'Import a feature only through its index.ts.' },
          { group: ['../*'], message: 'Use an alias or a ./ sibling import.' },
          { group: ['**/scripts/**', '**/e2e/**'], message: 'src/ must not import dev-only code.' },
        ],
      }],
    },
  },

  // Formatting (replaces Prettier).
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
    commaDangle: 'always-multiline',
    arrowParens: true,
    braceStyle: '1tbs',
  }),

  // Node-side build scripts (CLI tooling). Adds Node globals on top of the
  // base block's browser globals (flat config merges `languageOptions.globals`
  // across matching blocks, it doesn't replace them) -- harmless here since
  // scripts never reference DOM globals.
  {
    files: ['scripts/**/*.{ts,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // React: accessibility, hooks, and fast-refresh.
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]);
