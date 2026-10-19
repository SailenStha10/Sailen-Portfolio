import { createStore } from './store';

/**
 * Login state lives in memory only: reloading the page always starts a fresh session,
 * so every visitor signs in at the terminal first.
 */
export const sessionStore = createStore(false);
/** The name the visitor typed at "login as:". */
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
