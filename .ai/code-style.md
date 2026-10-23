# Code style

Last reviewed: 2026-10-23

## Formatting

- Format with 2 spaces, single quotes, semicolons and trailing commas; there is no Prettier. Run `pnpm lint:fix`. Enforced by: `@stylistic` in `eslint.config.js`.

## Naming and files

- Component files and symbols are PascalCase (`Foo.tsx`); other modules are camelCase (`skillFilter.ts`); hooks are `useX.ts`. Project decision.
- Tests are `X.test.ts` / `X.test.tsx` beside the file. Styles are `X.module.css`. Project decision.
- A CSS Module is imported as `styles`. Project decision.
- Define components as plain functions. The only class is the root error boundary, because React has no function-component equivalent. Source: https://react.dev/reference/react/Component
- Name a component's props type `<Component>Props` and do not use `React.FC`. Project decision.

## Imports

- Use inline `type` when a module import also has values: `import { Layout, type LayoutProps } from '...'`. Use `import type { A, B }` when nothing imported is a value. Why: with `verbatimModuleSyntax`, `import { type A } from 'x'` compiles to a leftover side-effect import (https://typescript-eslint.io/rules/no-import-type-side-effects/). Enforced by: `@typescript-eslint/consistent-type-imports` (inline fix style) and `@typescript-eslint/no-import-type-side-effects`.
- Sort named imports inside the braces, case-insensitively. Enforced by: `sort-imports` (`ignoreDeclarationSort`).
- Use an alias across folders and `./` within a folder; never `../`. Enforced by: `no-restricted-imports`.
- Aliases are defined in both `vite.config.ts` and `tsconfig.app.json`; change both together. Project decision.

## Types and exports

- Use named exports only; tool config files (`*.config.{js,ts}`) are the exception. Enforced by: `no-restricted-exports` (`restrictDefaultExports.direct`).
- Use `interface` for object shapes and `type` for unions and aliases. Enforced by: `@typescript-eslint/consistent-type-definitions`.
- Exported functions have explicit return types. Enforced by: `@typescript-eslint/explicit-module-boundary-types`.
- Model closed sets as an `as const` object or array plus a derived union; do not use enums. Why: Node's type stripping does not support enums, and `scripts/*.ts` import `src/` data. Source: https://nodejs.org/api/typescript.html

## Errors

- Throw on a broken invariant, as `main.tsx` does for a missing `#root`. Project decision.
- Wrap the app in one root error boundary, written as a class with no extra dependency, that shows fallback UI instead of a blank page. It does not exist yet. Project decision.

## Comments and constants

- A comment explains why, never what. Do not leave commented-out code. TODOs are allowed without an issue link. Project decision.
- A literal used in more than one place becomes a named constant in the file that owns the concept. Project decision.
