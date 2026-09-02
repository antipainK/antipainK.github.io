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
Vite + React + TypeScript (strict) · react-router · CSS Modules · react-i18next (2 locales) ·
Vitest + RTL · ESLint flat config (`@stylistic` formatting, **no Prettier**) · pnpm (Corepack) ·
Node 24 LTS · Playwright (dev-only, build-time prerendering) · GitHub Actions → Pages ·
`@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-serif` (self-hosted webfonts, no Google Fonts).

## Commands
- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build`
- `pnpm prerender` — build-time prerender (`node scripts/prerender.mjs`); run after `pnpm build`.
  One-time per machine: `pnpm exec playwright install chromium`.
- `pnpm lint` / `pnpm lint:fix`
- `pnpm typecheck` — `tsc -b`
- `pnpm test` (watch) / `pnpm test:ci` (once)
- `pnpm screenshot:diacritics` — renders the Polish pangram in every loaded face and weight and
  writes `diacritics.png` (gitignored); also prints any request that left the origin. Same
  requirements as `pnpm prerender`.

> **`pnpm` itself is not on `PATH`** — it is Corepack-managed with no shim, so a non-interactive
> shell gets `command not found`. **`corepack pnpm <script>` works with no setup**; `corepack` and
> `node` are both already on `PATH`. Don't go hunting for a Node install or export a `PATH` prefix.

## Workflow rules
- **Never `git commit` or `git push`.** Stage changes and suggest a commit message; the owner
  commits and pushes personally (pushing to `master` auto-deploys to production). Gated in
  `.claude/settings.json`.
- **After code changes, run `pnpm lint && pnpm typecheck && pnpm test:ci`** before calling work
  done. Add `pnpm build` when the change touches bundling/config (`vite.config.ts`, `tsconfig*`,
  deps, assets). Add `pnpm build && pnpm prerender` when the change touches routing/`src/pages/`,
  and check the output under `dist/<route>/index.html` — this can't be verified by an agent in a
  network-restricted sandbox (needs a real browser + a bindable local port), so a human needs to
  run it.
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `ci:`, `docs:`).

## Conventions
- **Colocated components:** each in its own folder with `Foo.tsx`, `Foo.module.css`, `Foo.test.tsx`
  under `src/components/{layout,sections}/`.
- **Design tokens live in `src/tokens.css`**, imported by `src/index.css` (which holds only the
  reset and element defaults). `tokens.css` is the single source of truth for colour, type and
  spacing: **a raw hex, rgb() or named colour in a component file is a defect.** If a value is
  missing, add it to `tokens.css` rather than inlining it at the call site.
- **CSS Modules only** for component styles.
- **Light theme only.** There is no dark mode, no toggle and no `prefers-color-scheme` handling.
  `:root` pins `color-scheme: light` on purpose — without it a visitor whose OS is in dark mode
  gets dark scrollbars and dark native form controls against a light page. Re-adding dark must
  stay a one-block change in `tokens.css` (a `[data-theme="dark"]` block overriding the same token
  names), which is only true while components read tokens and never inline a colour.
- **Control borders use `--border-control`, never `--rule`.** Chip and button boundaries need 3:1
  contrast against their background (WCAG 1.4.11); `--rule` sits around 1.2:1 and disappears for
  low-vision readers.
- **Never de-emphasise text with `opacity`** — it fails contrast. Use `--ink-muted` / `--ink-faint`.
- **Fonts are self-hosted via `@fontsource`, imported in `src/main.tsx`.** No Google Fonts link:
  loading from `fonts.gstatic.com` sends visitor IPs to Google, a GDPR exposure this site has no
  reason to take on. **Every weight must be imported as both `latin-` and `latin-ext-`** — Polish
  diacritics (ł ą ę ś ż ź ć ń) live in `latin-ext`, so a latin-only weight renders them from a
  fallback face mid-word. `ó` is in basic latin, which is what makes this easy to miss. Guarded by
  `src/fonts.test.ts`; check it visually with `pnpm screenshot:diacritics` (needs a real browser).
  Font assets build to stable unhashed names under `dist/assets/fonts/` so `vite.config.ts` can
  preload the three above-the-fold files.
- **Records vs. cards is deliberate.** Experience and education are *records*: hairline rules, no
  surface, title and org on one line with dates right-aligned. Cards (a raised surface) are
  reserved for project work. Don't unify them.
- **i18n — facts vs copy:**
  - Language-invariant facts (dates, company names, tech tags, links, ids) → `src/data/portfolio.ts`.
  - Translatable prose → `src/locales/<lng>.ts`, keyed by entry id; components read facts from
    data and copy via `t()`.
  - Single i18next namespace (`translation`); `common`/`home`/`experience`/`education` are just
    nested key groups within it, not separate i18next namespaces — namespaces are overkill at this
    project's size. Type-safe keys are derived from `en`'s shape via `src/i18n/keys.ts` +
    `src/i18n/types.ts` (no `src/i18next.d.ts`).
  - **Arrays are leaves, not branches.** An entry's `highlights` bullet list is one addressable
    key; read it with `tList()` from `@i18n/useTranslation`, not `t()`. `TranslationKey` and
    `TranslationListKey` are separate unions, so `t(listKey)` and `tList(stringKey)` are both
    compile errors rather than a blank bullet or `[object Object]` on the page.
  - **Any string that interpolates a count needs Polish plural forms.** Polish has three cardinal
    categories (`1 rok`, `2 lata`, `5 lat`) where English has one invariant form, so `en` declares
    the key once and `pl` adds `_one` / `_few` / `_many`; `PartialTranslations` admits those
    suffixes even though `en` lacks them. **The call site must pass `count`** — without it i18next
    never selects a form and Polish silently renders one fixed (usually wrong) case. Abbreviations
    like `mies.` do not inflect and need no forms. See `src/lib/duration.i18n.test.ts`.
  - **New/changed user-facing text:** fill **both `en` and `pl`** — a locale ships complete or not
    at all. A half-translated locale (Chinese chrome around an English CV) is a worse signal than
    English-only, which is why `zh-CN` was dropped. Register any new locale in `src/i18n/config.ts`
    and `src/i18n/resources.ts`.
- **`skillsCatalog` is the provable inventory:** every technology named in an entry's
  `technologyPeriods` must exist in the catalog — enforced at compile time by `KnownTechnology`, not
  just by a test. The reverse holds too: every catalog skill should be backed by an entry (or an
  explicit `additionalPeriods` window), with `KNOWN_UNPROVEN` in `src/data/portfolio.test.ts` as the
  temporary debt list for entries not yet written — it may shrink, never grow. Choosing which skills
  to *display* (hiding brief exposures, top-N) is a display concern; don't solve it by leaving data
  out. A new `SkillCategory` must also be added to `CATEGORY_ORDER` in `SkillsSection.tsx`, or its
  skills silently render nowhere. Categories need more than one member to be worth having — the
  one-item `hardwareProtocols` group was folded into `infrastructure` because a category holding a
  single chip reads as a mistake.
- **Derived data: sample the clock once, and derive outside the render.** Every helper in
  `@lib/skills` defaults `now` to `new Date()`, which is a **default argument evaluated per call** —
  deriving a list by calling them per item samples a different instant for each one. That shipped
  as a real bug: two languages both still in use resolved `lastUsed` a millisecond apart, so the
  recency tiebreak reordered the skill bars on every render. `orderLanguages(now)` in
  `@lib/skillFilter` takes one instant and threads it through, which makes equal things compare
  equal so `Array#sort`'s stability falls back to catalog order. It is called **once at module
  load**, not per render. Pass `now` explicitly in tests.
  - `@lib/skills` stays data-agnostic (entries in, numbers out) and is unit-tested with fixtures;
    `@lib/skillFilter` is the same logic **bound to the real catalog and timeline**, so components
    and `Layout` can share it without importing each other. Keep that seam.
- **Colour tokens carry their measured contrast ratio in a comment.** They are measured against
  `--paper`, not copied from a design file — the ratios in the source mockup were optimistic by up
  to 0.8 and `--ink-faint` was briefly below 4.5:1 because of it. Every one of these carries text
  at 13px, so the bar is WCAG 1.4.3 AA at **4.5:1**, with no large-text exemption. Re-measure and
  update the comment when you change a value.
- **Layout:** a sticky `Header` (site chrome: CV link, language `<select>`, active-filter status)
  above a three-child `.shell` grid — `Rail` (`identity`), `SkillsSection` (`skills`) and `<main>`.
  Three grid children rather than a nested rail so the skills panel can be reordered independently
  at ≤860px, where it drops **below** `<main>`: burying the hero under ~25 filter chips is the
  wrong first impression on a phone. Don't reach for `display: contents` to do this — it has a
  history of dropping the banner landmark from the a11y tree.
  - The rail holds name, role, location, portrait and contact links. Its name is the page's `<h1>`
    **only on the homepage** — every other route has a real `<h1>` and the rail must not shadow it.
  - The rail is `<header>` (the `banner`); the top bar is a plain `<div>` on purpose, because a
    second `<header>` at that level would announce a duplicate banner landmark.
  - **The rail is `position: static` by default**, sticky only above `min-height: 1100px`. With the
    skills panel beside it the left column runs to ~1000px, and a sticky element taller than the
    viewport pins at `top` and leaves its lower half permanently unreachable. The height query is
    deliberate — it beats picking one behaviour for every screen, and avoids an internal scrollbar.
- **The skill filter is owned by `Layout`**, not by a page: its three parties live in different
  subtrees (chips in the rail, status and Clear in the header, dimming in the routed page). It
  reaches the page through `Outlet` context (`LayoutOutletContext`). Only a **pinned** chip filters
  — dimming on hover flickers as the pointer crosses chips. Non-matches recede via `--ink-faint`,
  never `opacity`, and the header's `role="status"` region is always in the DOM so assistive tech
  observes it from first paint. A reader must never see a dimmed page with no stated reason.
- **Routing & prerendering:** `react-router` defines `/` (homepage), `/cv`, `/projects/:slug` (see
  `AppRoutes` in `src/App.tsx`). Page components live in `src/pages/` (`@pages` alias); every routed
  page other than the homepage should call `src/hooks/useDocumentHead.ts` (`@hooks` alias) to set a
  real `<title>`/OG tags — pages that set no description fall back to `DEFAULT_DESCRIPTION` rather
  than shipping none. `HomePage` is the one exception, since `index.html`'s static tags already
  describe it exactly and prerendering writes its snapshot to `dist/index.html` directly. GitHub Pages has
  no server-side rewrites, so client routing alone would 404 on a direct hit/refresh to `/cv` — the
  fix is build-time prerendering: `scripts/prerender.mjs` (Playwright + Vite's `preview()`) visits
  every route from `scripts/deriveRoutes.ts` (derived from `src/data/projects.ts`) and writes the
  rendered HTML to `dist/<route>/index.html`. Full rationale/mechanics/known gaps:
  `docs/routing-and-prerendering.md`.

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
- **`scripts/*.ts` run directly under Node** (verified on Node 24 — native TypeScript execution, no
  `tsx`/`ts-node` dependency). They must use plain relative imports only, never the `@data`/`@lib`
  aliases — Node has no knowledge of Vite's/tsconfig's path remapping outside the Vite-driven build.
- **`pnpm prerender` needs a real browser + a bindable local port.** It fails with
  `EPERM: listen ...` / a Playwright launch error in network-restricted or sandboxed environments —
  expected, not a bug. Run it somewhere unrestricted, or let CI run it (`deploy.yml` already does).

