# Findings

Things that were unexpected, that went wrong, or that were only learned by hitting them. Newest
first. Add an entry when something surprising happens; don't rewrite old ones — add a follow-up.
Standing rules belong in `CLAUDE.md`, not here.

## 2026-10-21 — Two pnpms on one Windows machine

`Get-Command pnpm -All` showed Corepack shims (inside each fnm Node install) ahead of a standalone
pnpm in `%LOCALAPPDATA%\pnpm\bin`. Which one runs depends on the active Node version. The
standalone one honors `packageManager` itself (checked: it ran 10.18.0 against a `pnpm@10.18.0`
pin), so Corepack is unnecessary. `corepack disable` per Node version removes the shims; this was
not verified to remove the `fnm_multishells` ones.

The Git Bash tool can't see the standalone `pnpm.ps1` shim at all, which is why earlier docs said
`corepack pnpm`. Run `pnpm` through PowerShell.

## 2026-10-18 — 96 files "modified" but only line endings

The working tree had CRLF where the repo stores LF, so `git status` showed 96 changed files with
identical content (`git diff --ignore-cr-at-eol` was empty). `core.autocrlf` was `false` on that
machine. Fixed by committing `.gitattributes` (`* text=auto eol=lf`, `*.png binary`). The writer of
the CRLF files was never identified.

## 2026-10-18 — Visual test could not start on Windows

`playwright.config.ts` ran `node_modules/.bin/vite preview ...`, which `cmd.exe` rejects because
of the forward-slash path. Now `node node_modules/vite/bin/vite.js preview ...`, which works in
every shell.

## 2026-10-18 — Prerender hung if Chromium was missing

`chromium.launch()` sat outside the `try/finally` in `scripts/prerender.mjs` and the two screenshot
scripts, so a failed launch left the Vite preview server open and the process never exited. The
launch is now inside the `try`. The hang fix itself was not exercised with a forced launch failure.

## 2026-10-18 — Visual test failed monthly and across OSes

- Durations ("2 yr 6 mo") are computed from the current date, so the screenshot changed every
  month. The test now freezes the clock (`FROZEN_CLOCK`, 2026-09-02). Only the test does this.
- Font rasterisation differs per OS (about 2% of pixels differed between the macOS and Windows
  renders), so baselines are per OS. The darwin baseline has not been checked on a Mac since the
  clock freeze was added.
- Playwright's Chromium is versioned with Playwright: after a Playwright bump run
  `pnpm exec playwright install chromium` once on each machine.

## 2026-10-18 — Weekly deploy: things not verified

- GitHub may disable scheduled workflows after 60 days without repository activity; scheduled
  runs probably don't count as activity. Not re-checked against GitHub's docs.
- Push, manual and weekly runs share one concurrency group with `cancel-in-progress: true`, so a
  run can cancel another mid-flight. Both build the same `master`, so the end state is the same.

## 2026-10-18 — Dependency audit

`pnpm audit` reported 18 advisories (8 high), all transitive under dev-only tooling (jsdom, vitest,
eslint). Cleared by the bump to latest (`7e8312e`) — `pnpm audit` then reported none.

## 2026-10-18 — Chip hover border is below the control-border contrast bar

`.chip:hover` and `.chip:focus-visible` use `--rule-strong` (1.87:1), under the 3:1 that
`--border-control` gives. A stricter version removed the hover border and was reverted because it
looked wrong. The rest-state border is `--border-control`, and the global `:focus-visible` outline
still marks focus. Accepted trade-off, owner's call.
