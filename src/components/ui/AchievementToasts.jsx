import { AnimatePresence, motion } from 'framer-motion';
import { ACHIEVEMENTS, ACHIEVEMENT_COUNT, achievementStore, toastStore } from '../../lib/achievements';
import { useStore } from '../../lib/store';

/** Pop-up badges, top-right, whenever something is unlocked. */
export function AchievementToasts() {
  const toasts = useStore(toastStore);

  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map(({ key, id }) => (
          <motion.div
            key={key}
            className="toast px-box"
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <span className="toast__star" aria-hidden="true">
              ★
            </span>
            <span>
              <b>BADGE UNLOCKED</b>
              <strong>{ACHIEVEMENTS[id].title}</strong>
              <em>{ACHIEVEMENTS[id].text}</em>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Small "★ 3/9" counter for the nav. */
export function BadgeCounter() {
  const have = useStore(achievementStore);
  return (
    <span className="badge-counter" title={`${have.length} of ${ACHIEVEMENT_COUNT} badges unlocked`}>
      <span aria-hidden="true">★</span> {have.length}/{ACHIEVEMENT_COUNT}
      <span className="sr-only"> badges unlocked</span>
    </span>
  );
}
