# Testing

Last reviewed: 2026-10-23

## Unit and component tests

- Tests sit beside the code as `X.test.ts` / `X.test.tsx`. Project decision.
- Unit and component tests need no network and no real browser; they run in jsdom through Vitest. Only `e2e/` and the browser scripts in `scripts/` (prerender, screenshots) need Chromium. Project decision.
- Query by role, label or text first; use a test id only when nothing else fits. Source: https://testing-library.com/docs/queries/about/
- Structure each test with explicit `// given`, `// when`, `// then` comments. Project decision.
- Name a test as a behaviour sentence ("reports the contributing entries for a language on hover"). Project decision.
- A bug fix comes with a test that fails without the fix. Project decision.
- Computing an expected value from the real clock is fine in unit tests. Project decision.

## Visual regression

- `pnpm test:visual` pixel-diffs the homepage against a committed baseline in `e2e/visual.spec.ts-snapshots/`. Baselines are per OS (`-darwin`, `-win32`). Why: font rendering differs per platform, and Playwright names snapshots with the platform. Source: https://playwright.dev/docs/test-snapshots
- The first run on a new OS writes its baseline and fails once; commit the new file. Project decision.
- The visual test freezes the page clock (`FROZEN_CLOCK` in `e2e/visual.spec.ts`); the site and the README screenshots do not. If that date changes, regenerate every baseline. Project decision.
- Regenerate baselines only after an intended UI change, with `pnpm screenshots:update`. Review the changed PNG in the diff before committing, and commit only your own OS's file. Project decision.
- The visual test is not a CI gate yet; see `.claude/plans/PLAN-pixel-diff-visual-test-ci_2026-09-02.md`. Project decision.

## Which gate to run

- Always run `pnpm lint`, `pnpm typecheck` and `pnpm test:ci` before calling work done. Project decision.
- Also run `pnpm build` when the change touches `vite.config.ts`, `tsconfig*`, dependencies or assets. Project decision.
- Also run `pnpm build && pnpm prerender` when the change touches routing or `src/pages/`, and check `dist/<route>/index.html`. Project decision.
- Also run `pnpm build && pnpm test:visual` when the change touches rendered UI. Project decision.
- `pnpm prerender` and `pnpm test:visual` need a real browser and a bindable local port, and fail in sandboxes without them; that failure is expected there, not a bug. One-time per machine: `pnpm exec playwright install chromium`. Project decision.
