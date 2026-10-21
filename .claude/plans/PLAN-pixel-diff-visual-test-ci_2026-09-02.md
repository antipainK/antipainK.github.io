# Pixel-diff visual test — deferred CI work

Added 2026-09-02: `playwright.config.ts` + `e2e/visual.spec.ts`, using
`@playwright/test`'s `toHaveScreenshot()` to pixel-diff the homepage against a
committed baseline PNG per OS (`e2e/visual.spec.ts-snapshots/homepage-chromium-darwin.png`,
`homepage-chromium-win32.png`). Run via `pnpm test:visual` (check) /
`pnpm screenshots:update` (regenerate baselines after an intentional UI change,
then commit the changed PNGs). See `CLAUDE.md` for the full command/convention
writeup.

Updated 2026-10-18: baselines are now per-platform (Playwright's default
`{-projectName}{-platform}` suffix is back), and the test freezes the page clock
so computed durations don't change the screenshot month to month.

## What was deliberately deferred

**No CI wiring yet.** The test is local-only: run it yourself before pushing,
and the committed PNGs are what shows up in the commit diff (GitHub renders PNG
diffs natively). `.github/workflows/deploy.yml` triggers on `push: master`,
`workflow_dispatch` and a weekly schedule; there is no `pull_request` CI at all,
and adding one is a bigger decision than "add a test."

**No Linux baseline.** CI runs on `ubuntu-latest`, so a CI run would look for
`homepage-chromium-linux.png`, which does not exist. Either generate it with
Playwright's official Docker image (so it matches what the runner renders), or
keep the visual test local-only. Don't copy a macOS or Windows baseline to
`-linux`: font rasterisation differs and it would fail with no real UI change.

## Revisit when

Once a real CI/CD workflow exists for this repo (i.e., PRs get any automated
checks at all), decide:
1. Whether `test:visual` should gate PRs, and how (new workflow triggered on
   `pull_request`, run alongside or after lint/typecheck/test:ci/build).
2. How the Linux baseline gets generated and updated so local and CI agree.
