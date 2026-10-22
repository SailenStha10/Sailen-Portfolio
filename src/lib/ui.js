import { createStore } from './store';

/** Whether the command palette (the small terminal on inner pages) is open. */
export const paletteStore = createStore(false);
export const setPalette = (open) => paletteStore.set(open);
