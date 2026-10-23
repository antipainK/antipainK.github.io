# Tech stack

Last reviewed: 2026-10-23

Versions are those declared in `package.json`; check it for the current number.

## Chosen stack

| Area | Choice |
| --- | --- |
| Language | TypeScript `~5.9`, strict |
| UI | React, react-router |
| Build | Vite (`base: '/'`) |
| Styling | CSS Modules |
| i18n | i18next, react-i18next; `en` and `pl` |
| Fonts | `@fontsource/ibm-plex-sans` and `-serif`, self-hosted |
| Unit tests | Vitest, React Testing Library, jsdom |
| Lint and format | ESLint flat config, `@stylistic`; no Prettier |
| Browser automation | Playwright (dev-only): prerender, screenshots, visual test |
| Package manager | pnpm, pinned in `packageManager` |
| Node | 24 (`.nvmrc`), managed with fnm |
| Hosting | GitHub Pages via GitHub Actions |

## Rules

- Use plain `pnpm`, never npm, yarn or Corepack. Bump pnpm with `pnpm self-update` and check that `packageManager` changed. Project decision.
- Keep TypeScript below 6.1 until `typescript-eslint` supports newer versions, and leave `typescript` out of blanket `pnpm up --latest`. Why: ESLint hard-crashes on an unsupported TypeScript. Project decision.
- Ask before adding a dependency, and justify it in the commit message. Project decision.
- Dependencies are bumped by hand today; automation is planned. Project decision.
- After a dependency bump, run `pnpm lint`, `pnpm typecheck`, `pnpm test:ci`, `pnpm build` and `pnpm audit`. Project decision.
- After a Playwright bump, run `pnpm exec playwright install chromium` on each machine. Why: Playwright's Chromium is versioned with the package. Project decision.
- When the Node major changes, change `.nvmrc` and the `engines.node` lower bound in `package.json` together; CI reads `.nvmrc`. Project decision.
