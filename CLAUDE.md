# CLAUDE.md — agent rules for this repo

## Testing (web suite)

- `localStorage` / `sessionStorage` are **stubbed per test file** by
  `src/test-utils/setup-storage.ts` (wired in `vitest.config.ts` setupFiles).
  Every test file starts with fresh in-memory storage; nothing persists across
  files. Do not add tests that depend on cross-file storage state.
- To simulate storage failure (quota, write errors), use the helper in
  `src/test-utils/localStorage.ts` (`failLocalStorageWrites()`), which swaps
  the global binding via `vi.stubGlobal`.
- **Never** `vi.spyOn(localStorage, "setItem")`: on native `Storage` instances
  (happy-dom + recent Node) that spy silently no-ops, so failure paths never
  run and tests lie — either failing mysteriously or passing vacuously.
- Run tests plain: `npm test` / `npm run check:web`. No `NODE_OPTIONS`
  `--localstorage-file` flag is needed (the setup stub replaced it; the flag
  was the root cause of parallel-worker races).
- Host suite has its own config (`host/vitest.config.ts`); it launches real
  processes and manages its own parallelism — don't copy web-suite setup into it.
