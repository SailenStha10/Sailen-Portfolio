import { createStore } from './store';

/** There is no sign-in any more; the shell still reads this flag, so it stays `true`. */
export const sessionStore = createStore(true);
export const visitorStore = createStore('');

export function login() {
  sessionStore.set(true);
}

export function logout() {
  sessionStore.set(false);
  visitorStore.set('');
}

export function setVisitor(name) {
  visitorStore.set(name);
}

/** Letters, numbers, spaces, _ and - only; collapsed and trimmed; max 16 chars. */
export function cleanName(raw) {
  return raw
    .replace(/[^\p{L}\p{N}_\- ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);
}

/** Shell-friendly version of a name: "Neo Smith" → "neo-smith". */
export const slug = (name) => (name || 'guest').toLowerCase().replace(/\s+/g, '-');
