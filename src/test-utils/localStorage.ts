import { vi } from "vitest";

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
