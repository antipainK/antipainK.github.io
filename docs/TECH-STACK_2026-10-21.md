# Tech stack — as of 2026-10-21

Versions as declared in `package.json` at this date. Update this file, and rename
it to the new date, when the stack changes in a way that matters. Rules and conventions live in
`CLAUDE.md`; surprises live in `FINDINGS.md`.

## Runtime and tooling

| Area | Choice | Notes |
| --- | --- | --- |
| Language | TypeScript `~5.9.3`, strict | Pinned because typescript-eslint supports `< 6.1`; TypeScript 7 waits for typescript-eslint support |
| UI | React `^19.3.1`, react-router `^8.4.0` | Routes: `/`, `/cv`, `/projects/:slug` |
| Build | Vite `^8.3.4` | `base: '/'` (user-site repo) |
| Styling | CSS Modules, design tokens in `src/tokens.css` | Light theme only |
| i18n | i18next `^26.4.7`, react-i18next `^17.0.20` | `en` and `pl`; typed keys derived from `en` |
| Fonts | `@fontsource/ibm-plex-sans` and `-serif`, self-hosted | Every weight as `latin-` and `latin-ext-` |
| Unit tests | Vitest `^5.0.5`, React Testing Library, jsdom `^30.1.3` | |
| Lint and format | ESLint `^10.13.0` flat config, `@stylistic` | No Prettier |
| Browser automation | Playwright `^1.64.1` (dev-only) | Build-time prerender, screenshots, visual test |
| Package manager | pnpm `11.25.0` (pinned in `packageManager`) | Standalone install, no Corepack |
| Node | 24 (`.nvmrc`), managed with fnm | |
| Hosting | GitHub Pages via GitHub Actions | Deploys on push to `master` and weekly (Mondays 05:00 UTC) |

## Test and verification setup

- **Unit and integration:** `pnpm test:ci` (114 tests across 26 files at this date).
- **Visual regression:** `pnpm test:visual`, one baseline per OS under
  `e2e/visual.spec.ts-snapshots/`; the clock is frozen in the test only.
- **Prerender:** `pnpm build && pnpm prerender` writes `dist/<route>/index.html`.
- **Local only (no CI gate):** the visual test. See
  `.claude/plans/PLAN-pixel-diff-visual-test-ci_2026-09-02.md`.
