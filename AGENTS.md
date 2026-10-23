# antipaink.github.io

Last reviewed: 2026-10-23

Personal portfolio single-page app for Wojciech Kosztyła, published as the GitHub user site at https://antipaink.github.io/. Vite, React, TypeScript, CSS Modules, react-i18next (`en`, `pl`), Vitest, ESLint, pnpm and Node 24 via fnm, deployed to GitHub Pages by GitHub Actions.

## Commands

- `pnpm install`: install dependencies.
- `pnpm dev`: start the dev server (http://localhost:5173).
- `pnpm build`: type-check and build to `dist/`.
- `pnpm preview`: serve the built `dist/`.
- `pnpm lint` / `pnpm lint:fix`: run ESLint, with or without fixes.
- `pnpm typecheck`: `tsc -b`.
- `pnpm test` (watch) / `pnpm test:ci` (once): run Vitest.
- `pnpm prerender`: build-time prerender; run after `pnpm build`.
- `pnpm test:visual`: pixel-diff the homepage against the baseline for your OS.
- `pnpm screenshots:update`: regenerate every screenshot output and the visual baseline for your OS.
- `pnpm exec playwright install chromium`: one-time per machine before `prerender` or `test:visual`.

## Workflow

- Do only what was asked. Propose anything else and wait for approval.
- Before a change that touches several files or the structure, list the exact files and the minimal change per file, and wait for approval.
- Before calling work done, run `pnpm lint`, `pnpm typecheck` and `pnpm test:ci`, and the extra gates named in `.ai/testing.md`.
- Use plain `pnpm`. Never use npm, yarn or Corepack.
- Scripts and configs must work on macOS and Windows: no shell-specific syntax in `package.json`, no `node_modules/.bin/...` paths in commands.
- Do not commit or push unless asked. Pushing to `master` deploys to production.
- Do not change the rules in `AGENTS.md` or `.ai/` without asking; they are listed under `ask` in `.claude/settings.json`.

## Rules

Detailed rules live in `.ai/`. Read the matching file before working in that area:

- Before changing structure, adding modules or moving code: `.ai/architecture.md`
- Before writing or reviewing code: `.ai/code-style.md`
- Before adding, removing or upgrading a dependency, or changing the Node or pnpm version: `.ai/tech-stack.md`
- Before writing or changing tests, or touching the visual baselines: `.ai/testing.md`
- Before adding or changing user-facing text or a locale: `.ai/i18n.md`
- Before committing, pushing or changing the deploy workflow: `.ai/git-workflow.md`

## Docs

Design docs, plans and decisions for humans and AI are in `docs/`. Files with a date in the name are snapshots and may be outdated.

- Before changing routing or prerendering: `docs/routing-and-prerendering.md`.
- Before debugging a failure in pnpm, Playwright, the prerender or the visual test: check `docs/findings.md`, a log of past surprises.
- Before planning visual-test CI work: `.claude/plans/PLAN-pixel-diff-visual-test-ci_2026-09-02.md`.
