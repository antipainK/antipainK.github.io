// Claude Code PostToolUse hook: run `eslint --fix` on just the file that was edited or written.
// Wired up in .claude/settings.json (see docs/FINDINGS.md). Reads the hook payload (JSON) from
// stdin. Plain Node on purpose, so the same command works in bash, PowerShell and on macOS.
//
// Exit codes follow the hook contract: 0 = nothing to report, 2 = ESLint output is sent back to
// Claude as feedback (problems `--fix` could not fix, or ESLint itself failing). Situations where
// linting is simply not possible (no payload, no `pnpm install` yet) exit 0 so they never block.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const ESLINT_BIN = path.join(REPO_ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js');
const LINTABLE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

async function readStdin() {
  let data = '';
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
}

function parsePayload(rawPayload) {
  try {
    return JSON.parse(rawPayload);
  } catch {
    return undefined;
  }
}

async function main() {
  const payload = parsePayload(await readStdin());
  const filePath = payload?.tool_input?.file_path ?? payload?.tool_response?.filePath;
  if (typeof filePath !== 'string' || !LINTABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return;
  }
  if (!existsSync(ESLINT_BIN)) {
    console.error('lintFixEditedFile: node_modules is missing, run `pnpm install`. Skipping.');
    return;
  }

  // Absolute path after `--`, so a path that looks like a flag is never read as one.
  const result = spawnSync(
    process.execPath,
    [ESLINT_BIN, '--fix', '--no-warn-ignored', '--', path.resolve(filePath)],
    // Shorter than the hook's own timeout, so ESLint is stopped here instead of being orphaned.
    { cwd: REPO_ROOT, stdio: ['ignore', process.stderr.fd, process.stderr.fd], timeout: 25_000 },
  );
  if (result.error) {
    console.error(`lintFixEditedFile: could not run ESLint: ${result.error.message}`);
  }
  if (result.status !== 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 2;
});
