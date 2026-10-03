// Per-file deterministic storage, installed for every vitest environment
// (node and happy-dom) via `setupFiles` in vitest.config.ts.
//
// This kills three failure classes at the root:
// 1. Parallel workers sharing one `--localstorage-file` and racing each
//    other's writes (fabricated failures that vanish when run sequentially).
// 2. The `NODE_OPTIONS=--localstorage-file=...` requirement for node-env
//    tests on Node >= 22 — CI runs plain `npm test` with no flag.
// 3. `vi.spyOn(localStorage, "setItem")` silently no-oping on native
//    Storage instances — the global is now a plain object whose methods
//    genuinely intercept.
//
// Each test FILE gets fresh storage; nothing persists across files, and
// nothing should. To simulate write failure use the helper in
// `src/test-utils/localStorage.ts`, never a spy on the global.
import { createMemoryStorage } from "./localStorage";

for (const binding of ["localStorage", "sessionStorage"] as const) {
  Object.defineProperty(globalThis, binding, {
    value: createMemoryStorage(),
    configurable: true,
    writable: true,
  });
}
