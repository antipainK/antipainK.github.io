# Architecture

Last reviewed: 2026-10-23

Status: new code follows the layout below from now on, in `src/features/`. Existing code still lives in role folders (`src/components`, `src/lib`, `src/hooks`, `src/data`); moving it is a separate change. The `@features` alias is not defined yet in `vite.config.ts` and `tsconfig.app.json`, so the import-boundary rule cannot match until it is.

## Structure

- Group code by feature in `src/features/<feature>/`. A feature folder holds its components, helpers, hooks, data and tests. Project decision.
- Code used by more than one feature goes in `src/shared/`. Project decision.
- A feature does not import from another feature. Pages and `Layout` compose features. Project decision.
- Import a feature only through its `index.ts`. Enforced by: `no-restricted-imports` in `eslint.config.js`.
- Nothing under `src/` imports from `scripts/` or `e2e/`. Enforced by: `no-restricted-imports` in `eslint.config.js`.
- Files in `src/pages/` only compose features and set the document head; no data shaping or logic. Project decision.

## Where new code goes

- A new component goes in `src/features/<feature>/<Component>/` with `<Component>.tsx`, `<Component>.module.css` and `<Component>.test.tsx`. The props type lives in the `.tsx`. Project decision.
- A new page goes in `src/pages/<Name>Page/<Name>Page.tsx` with its test, and is registered in `AppRoutes` (`src/App.tsx`). Every page except `HomePage` calls `useDocumentHead` (`src/hooks/useDocumentHead.ts`) to set its own title and description. Project decision.
- A helper or hook goes in the feature that owns it, with its `.test.ts` beside it. Project decision.
- Build and tooling code goes in `scripts/`; browser tests go in `e2e/`. Project decision.

## Facts and copy

- Language-invariant facts (dates, company names, technology tags, links, ids) live in `src/data/portfolio.ts`. Prose lives in `src/locales/<lng>.ts`, keyed by entry id. Details: `.ai/i18n.md`. Project decision.
- Every technology named in an entry's `technologyPeriods` must exist in `skillsCatalog`. Enforced by: the `KnownTechnology` type in `src/data/portfolio.ts` and `src/data/portfolio.test.ts`.
- A new `SkillCategory` is added to `CATEGORY_ORDER` in `SkillsSection.tsx`. Why: otherwise its skills render nowhere. Enforced by: `SkillsSection.test.tsx` ("renders every catalog skill").
- `KNOWN_UNPROVEN` in `src/data/portfolio.test.ts` may shrink, never grow. Project decision.

## Routing and prerendering

- Routes are declared in `AppRoutes`. Unknown URLs hit the `*` route (`NotFoundPage`), and `emitNotFoundShell` in `vite.config.ts` copies the shell to `dist/404.html`. Project decision.
- `scripts/prerender.mjs` renders every route from `scripts/deriveRoutes.ts` (derived from `src/data/projects.ts`) to `dist/<route>/index.html`. Add project pages through `src/data/projects.ts`, not by hand. Rationale and mechanics: `docs/routing-and-prerendering.md`. Project decision.

## Build and deploy boundaries

- Only `src/` and `public/` ship to the site. `e2e/`, `scripts/` and the baseline PNGs never do. Project decision.
- `scripts/*.ts` and `e2e/*.ts` run directly under Node and use plain relative imports, never `@` aliases. Why: Node does not know the path remapping that Vite and `tsconfig` apply. Project decision.
- `vite.config.ts` sets `base: '/'` because this is a user-site repo. Project decision.
- `src/vite-env.d.ts` carries the CSS Module and `import.meta.env` types; do not delete it. Project decision.
