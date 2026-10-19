import { createStore, safeStorage } from './store';
import { sound } from './sound';

const KEY = 'portfolio-achievements';
const storage = safeStorage('local');

/** Every unlockable badge. Order matters only for display. */
export const ACHIEVEMENTS = {
  login: { title: 'Access Granted', text: 'Signed in to the terminal' },
  secret: { title: 'Secret Agent', text: 'Found the hidden file' },
  traveller: { title: 'Globetrotter', text: 'Visited every stop on the journey' },
  theme: { title: 'Mood Swing', text: 'Switched the screen colours' },
  dev: { title: 'Dev Unlocked', text: 'Finished the Developer run' },
  designer: { title: 'Design Unlocked', text: 'Finished the Designer run' },
  singer: { title: 'Voice Unlocked', text: 'Finished the Singer run' },
  cheat: { title: 'Cheat Code', text: 'You know the classics' },
  hire: { title: 'Recruiter Mode', text: 'Used sudo hire' },
};
export const ACHIEVEMENT_COUNT = Object.keys(ACHIEVEMENTS).length;

const load = () => {
  try {
    const raw = JSON.parse(storage.get(KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((id) => id in ACHIEVEMENTS) : [];
  } catch {
    return [];
  }
};

export const achievementStore = createStore(load());
/** Currently visible toasts: [{ key, id }] */
export const toastStore = createStore([]);

let toastKey = 0;

export function unlock(id) {
  if (!(id in ACHIEVEMENTS)) return;
  const have = achievementStore.get();
  if (have.includes(id)) return;
  const next = [...have, id];
  achievementStore.set(next);
  storage.set(KEY, JSON.stringify(next));
  sound.play('levelup');

  const key = (toastKey += 1);
  toastStore.set((t) => [...t, { key, id }]);
  setTimeout(() => toastStore.set((t) => t.filter((x) => x.key !== key)), 4200);
}

// ---- page visits (for the "Globetrotter" badge) ----
const VISIT_KEY = 'portfolio-visits';
const session = safeStorage('session');
const ALL_STOPS = ['/', '/about', '/experience', '/skills', '/projects', '/contact'];

export const visitStore = createStore(
  (() => {
    try {
      return JSON.parse(session.get(VISIT_KEY) ?? '[]');
    } catch {
      return [];
    }
  })(),
);

export function recordVisit(pathname) {
  if (!ALL_STOPS.includes(pathname)) return;
  const seen = visitStore.get();
  if (seen.includes(pathname)) return;
  const next = [...seen, pathname];
  visitStore.set(next);
  session.set(VISIT_KEY, JSON.stringify(next));
  if (ALL_STOPS.every((p) => next.includes(p))) unlock('traveller');
}

// ---- game progress (completed runs + best scores) ----
const GAME_KEY = 'portfolio-game';

const loadGame = () => {
  try {
    return JSON.parse(storage.get(GAME_KEY) ?? '{}') || {};
  } catch {
    return {};
  }
};
export const gameStore = createStore(loadGame());

export function recordRun(characterId, score) {
  const all = gameStore.get();
  const prev = all[characterId] ?? { best: 0, done: false };
  const next = { ...all, [characterId]: { best: Math.max(prev.best, score), done: true } };
  gameStore.set(next);
  storage.set(GAME_KEY, JSON.stringify(next));
}
