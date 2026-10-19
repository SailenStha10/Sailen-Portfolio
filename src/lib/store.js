import { useSyncExternalStore } from 'react';

/** Minimal observable store usable from plain JS and from React via useStore(). */
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set(next) {
      const value = typeof next === 'function' ? next(state) : next;
      if (Object.is(value, state)) return;
      state = value;
      listeners.forEach((l) => l());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** localStorage/sessionStorage helpers that never throw. */
export const safeStorage = (kind = 'local') => ({
  get(key) {
    try {
      return window[`${kind}Storage`].getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window[`${kind}Storage`].setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
});
