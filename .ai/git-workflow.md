# Git workflow

Last reviewed: 2026-10-23

## Commits and pushes

- Do not commit or push unless asked. Pushing to `master` deploys to production. Project decision.
- Before pushing, run `pnpm lint && pnpm typecheck && pnpm test:ci`, plus `pnpm build` when config or bundling changed. Project decision.
- Write commit subjects as `<type>[optional scope]: <description>`. Source: https://www.conventionalcommits.org/en/v1.0.0/
- Use the types `feat`, `fix`, `chore`, `test`, `ci` and `docs`. Project decision.

## Deploy

- `.github/workflows/deploy.yml` runs install with a frozen lockfile, lint, typecheck, `test:ci`, build and prerender before it uploads and deploys. A red gate blocks the deploy. The visual test is not part of it. Project decision.
- The workflow also runs every Monday at 05:00 UTC. Why: durations and the footer year are computed at build time and prerendered, so they go stale without a rebuild. Project decision.

## Files

- Files use LF line endings; do not convert them by hand. Enforced by: `.gitattributes` (`* text=auto eol=lf`) and `.editorconfig` (`end_of_line = lf`).
- Commit the visual baselines (`e2e/**/*-snapshots/`) and `docs/homepage-preview.png`. Project decision.
- Never commit `dist/`, `test-results/` or `diacritics.png`. Enforced by: `.gitignore`.
