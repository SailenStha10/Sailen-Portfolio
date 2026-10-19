import { useSyncExternalStore } from 'react';
import { sound } from '../lib/sound';

/** Re-renders when sound is switched on or off. */
export function useSoundEnabled() {
  return useSyncExternalStore(sound.subscribe, () => sound.enabled, () => false);
}
