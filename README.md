# antipaink.github.io

Personal portfolio of **Wojciech Kosztyła** — Software Engineer.
Built with React, TypeScript, and Vite, with first-class internationalization.

🔗 Live: https://antipaink.github.io/

## Tech stack

- **Vite** + **React** + **TypeScript** (strict)
- **CSS Modules** for scoped, zero-runtime styling
- **react-i18next** — three languages (English, Polski, 简体中文); typed keys derived from `en`
- **Vitest** + **React Testing Library**
- **ESLint** flat config (`@stylistic` for formatting — no Prettier)
- **GitHub Actions** → **GitHub Pages**

## Prerequisites & setup

Requires **Node 24** (latest LTS) and **pnpm** (provisioned via Corepack).

### macOS (Homebrew)

```sh
brew install node@24        # or use nvm to honor .nvmrc
corepack enable             # provisions the pnpm version pinned in package.json
```

### Windows

```powershell
winget install OpenJS.NodeJS.LTS   # or nvm-windows / fnm to honor .nvmrc
corepack enable                    # run in an elevated (admin) terminal
```

Both paths converge on `corepack enable`, which activates the exact pnpm version
pinned in `package.json` (`packageManager`). No global pnpm install needed.

## Install & run

```sh
pnpm install     # install dependencies
pnpm dev         # start the dev server (http://localhost:5173)
pnpm build       # type-check and build to dist/
pnpm preview     # serve the production build locally
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check (`tsc -b`) and build for production |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with `--fix` |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:ci` | Run Vitest once (CI mode) |
| `pnpm typecheck` | Type-check without emitting |

## Project structure

```
src/
  data/portfolio.ts        # typed, language-invariant facts (experience, education)
  i18n/
    config.ts              # SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_LABELS
    resources.ts           # assembles i18next resources from the locale files
    keys.ts                # TRANSLATION_KEYS + TranslationKey (derived from en)
    useTranslation.ts      # typed t() wrapper
  locales/
    en.ts                  # canonical translations (source of truth)
    pl.ts, zh-CN.ts        # PartialTranslations — missing keys fall back to en
  components/
    layout/                # Layout, Navbar, Footer, LanguageSwitcher
    sections/              # Hero, ExperienceTimeline, EducationList
  lib/                     # small utilities (date formatting)
```

Facts (dates, company names, tech tags, links) live in `data/portfolio.ts`; the
translatable prose lives in the typed `locales/*.ts` objects. Components reference
keys via `TRANSLATION_KEYS.common.nav.experience` and never touch a language — the
i18n layer resolves the current locale (falling back to `en`). Imports use path
aliases: `@i18n`, `@components`, `@data`, `@lib`, `@locales`.

## Adding a language

1. Add `src/locales/<lng>.ts` exporting a const `satisfies PartialTranslations<Translations>`
   (it may be partial — missing keys fall back to `en`).
2. Register the locale in `src/i18n/config.ts` (`SUPPORTED_LOCALES`, `LOCALE_LABELS`).
3. Add it to `resources` in `src/i18n/resources.ts`.

## Deployment

Every push to `master` runs lint, type-check, tests, and build, then deploys to
GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Enable it once
under **Settings → Pages → Source: GitHub Actions**.
