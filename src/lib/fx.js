import { createStore } from './store';

/** Full-screen visual effects triggered from anywhere (terminal, key combos...). */
export const fxStore = createStore({ matrix: false });

let timer;
export function runMatrix(ms = 2000) {
  clearTimeout(timer);
  fxStore.set({ matrix: true });
  timer = setTimeout(() => fxStore.set({ matrix: false }), ms);
}
