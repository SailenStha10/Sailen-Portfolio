import { createStore, safeStorage } from './store';

const KEY = 'portfolio-theme';
const storage = safeStorage('local');

const initial = () => {
  const saved = storage.get(KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

export const themeStore = createStore(initial());

const apply = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f2ead6' : '#050505');
};

/** Call once on startup. */
export function initTheme() {
  apply(themeStore.get());
  return themeStore.subscribe(() => apply(themeStore.get()));
}

export function setTheme(theme) {
  themeStore.set(theme);
  storage.set(KEY, theme);
}

export const toggleTheme = () => setTheme(themeStore.get() === 'dark' ? 'light' : 'dark');
