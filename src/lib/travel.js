import { createStore } from './store';
import { sound } from './sound';

/** true while the warp-speed overlay is covering the screen. */
export const travelStore = createStore({ active: false, to: '' });

const WARP_MS = 1100;
const SETTLE_MS = 450;

/** Play the warp animation + sound, navigate, then lift the overlay. Resolves once underway. */
export function travel(navigate, to) {
  if (travelStore.get().active) return;
  travelStore.set({ active: true, to });
  sound.play('warp');
  setTimeout(() => {
    navigate(to);
    setTimeout(() => travelStore.set({ active: false, to: '' }), SETTLE_MS);
  }, WARP_MS);
}
