# CLAUDE.md — antipaink.github.io

Personal portfolio SPA. Public GitHub user-site: `https://antipaink.github.io/`.

> **Keep this file current** — if something below is outdated or wrong (a
> version, a convention, a command), update it as part of your change (editing `CLAUDE.md` is
> pre-approved). It describes the project's *current* baseline, not a freeze.

## Owner preferences (apply to all work here)
- **Simplest solution that satisfies the request.** No abstractions, helpers, validation, or
  refactors that weren't asked for. Ask before generalizing a one-off into a reusable pattern.
- **Plan before multi-file or structural changes** — list the exact files and the minimal change
  per file, and wait for approval before editing.
- **Verify for real.** Confirm a diagnosis against the actual code before fixing. Never call
  something done without running the relevant checks (lint / typecheck / test / build) and showing
  the output. If a fix fails twice, stop and explain the problem instead of guessing again.
- **Be honest.** Don't invent APIs, config, or facts; state what's unknown. Don't carry a value
  (version, path, threshold) into a new context without re-checking it there.
- **Don't rubber-stamp** a suggestion (mine or a reviewer's) — check it against the actual code first.

## Stack (current baseline — update freely when warranted)
Vite + React + TypeScript (strict) · CSS Modules · react-i18next (3 locales) · Vitest + RTL ·
ESLint flat config (`@stylistic` formatting, **no Prettier**) · pnpm (Corepack) · Node 24 LTS ·
GitHub Actions → Pages.

## Commands
- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build`
- `pnpm lint` / `pnpm lint:fix`
- `pnpm typecheck` — `tsc -b`
- `pnpm test` (watch) / `pnpm test:ci` (once)

## Workflow rules
- **Never `git commit` or `git push`.** Stage changes and suggest a commit message; the owner
  commits and pushes personally (pushing to `master` auto-deploys to production). Gated in
  `.claude/settings.json`.
- **After code changes, run `pnpm lint && pnpm typecheck && pnpm test:ci`** before calling work
  done. Add `pnpm build` when the change touches bundling/config (`vite.config.ts`, `tsconfig*`,
  deps, assets).
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `ci:`, `docs:`).

## Conventions
- **Colocated components:** each in its own folder with `Foo.tsx`, `Foo.module.css`, `Foo.test.tsx`
  under `src/components/{layout,sections}/`.
- **CSS Modules only** for component styles; global tokens/reset in `src/index.css` (CSS custom
  properties, light/dark via `prefers-color-scheme`).
- **i18n — facts vs copy:**
  - Language-invariant facts (dates, company names, tech tags, links, ids) → `src/data/portfolio.ts`.
  - Translatable prose → `src/locales/<lng>.ts`, keyed by entry id; components read facts from
    data and copy via `t()`.
  - Single i18next namespace (`translation`); `common`/`home`/`experience`/`education` are just
    nested key groups within it, not separate i18next namespaces — namespaces are overkill at this
    project's size. Type-safe keys are derived from `en`'s shape via `src/i18n/keys.ts` +
    `src/i18n/types.ts` (no `src/i18next.d.ts`).
  - **New/changed user-facing text:** fill **`en` + `pl`** now; leave `zh-CN` keys empty (they fall
    back to `en`) and flag them as TODO. Register any new locale in `src/i18n/config.ts` and
    `src/i18n/resources.ts`.

## Version policy
Keep dependencies and tooling reasonably current — **you may bump Node, deps, and tooling to newer
versions when it's warranted** (e.g. Node 24 → 26). Versions named in this file / `.nvmrc` / CI are
the current baseline, not a rule to defend; when you bump one, update `.nvmrc`, the CI workflow, and
this file to match, and re-run the gates.

**One real constraint:** TypeScript must stay at a version `typescript-eslint` supports (currently
`< 6.1`, so the `~5.9` pin). Do **not** move to TypeScript 7 (the native compiler) until
`typescript-eslint` supports it, or ESLint hard-crashes. Exclude `typescript` from blanket
`pnpm up --latest`. Revisit when that support lands.

## Other gotchas (don't "fix" without reason)
- **pnpm is Corepack-pinned** via `package.json` `packageManager`; change it with
  `corepack use pnpm@<v>`, not a hand edit.
- **`vite.config.ts`** types the `test` block via `vitest/node`'s `InlineConfig` on purpose (avoids
  a Vite-version type clash).
- **`src/vite-env.d.ts`** is load-bearing (CSS Module + `import.meta.env` types); don't delete.
- **`base: '/'`** because it's the user-site repo; deploy is on push to `master`.

