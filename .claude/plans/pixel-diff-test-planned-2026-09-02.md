# Pixel-diff visual test — deferred CI work

Added 2026-09-02: `playwright.config.ts` + `e2e/visual.spec.ts`, using
`@playwright/test`'s `toHaveScreenshot()` to pixel-diff the homepage against a
committed baseline PNG (`e2e/visual.spec.ts-snapshots/homepage-chromium-darwin.png`).
Run via `pnpm test:visual` (check) / `pnpm test:visual:update` (regenerate the
baseline after an intentional UI change, then commit the new PNG). See
`CLAUDE.md` for the full command/convention writeup.

## What was deliberately deferred

**No CI wiring yet.** The test is local-only: you run it yourself before
opening a PR, and the committed PNG is what reviewers see diffed in the PR's
file view (GitHub renders PNG diffs natively). `.github/workflows/deploy.yml`
is untouched — it still only triggers on `push: master` / `workflow_dispatch`;
this repo has no pull_request-triggered CI at all today, and adding one felt
like a bigger decision than "add a test."

**No cross-platform baseline strategy.** Playwright screenshots differ
subtly across OS (font hinting/antialiasing, subpixel rendering). A baseline
generated locally on macOS will very likely mismatch if the test is later run
on a Linux CI runner — even with zero real UI change. If/when this gets wired
into CI, decide one of:
- Generate baselines via Playwright's official Docker image (matching
  whatever OS the CI runner uses) instead of running natively on macOS, so the
  committed PNG actually matches what CI would render.
- Or run the visual test only where it's generated (i.e., never in a
  different-OS CI runner) and accept that constraint.

## Revisit when

Once a real CI/CD workflow exists for this repo (i.e., PRs get any automated
checks at all), come back to this file and decide:
1. Whether `test:visual` should gate PRs, and how (new workflow triggered on
   `pull_request`, run alongside or after lint/typecheck/test:ci/build).
2. How baselines get generated/updated so local and CI agree (Docker, or
   CI-only generation with the result committed back).
