import { vi } from "vitest";

/** A fresh, plain-object `Storage`. Own-method arrows mean `vi.spyOn` (and any
 * monkey-patch) genuinely intercepts — unlike native `Storage` instances, whose
 * methods this environment ignores when patched. Installed globally per test
 * file by `setup-storage.ts`; tests that need failing writes use
 * {@link failLocalStorageWrites}. */
export function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => map.delete(key),
    setItem: (key, value) => map.set(String(key), String(value)),
  };
}

/** Replace `localStorage` with a pass-through whose writes throw, so tests can
 * exercise save-failure paths. `vi.spyOn(localStorage, "setItem")` is not a
 * reliable way to do this: in the happy-dom + Node 26 environment the global
 * storage object ignores patched instance methods, so the spy never fires and
 * writes silently succeed. `vi.stubGlobal` swaps the binding itself, which
 * every `localStorage` reference in app code resolves through.
 *
 * Returns a function that restores normal writes mid-test; afterEach's
 * `vi.unstubAllGlobals()` cleans up the rest. */
export function failLocalStorageWrites(): () => void {
  const real = localStorage;
  const failing: Storage = {
    get length() {
      return real.length;
    },
    clear: () => real.clear(),
    getItem: (key) => real.getItem(key),
    key: (index) => real.key(index),
    removeItem: (key) => real.removeItem(key),
    setItem: () => {
      throw new Error("Storage full");
    },
  };
  vi.stubGlobal("localStorage", failing);
  return () => vi.stubGlobal("localStorage", real);
}
