import { AnimatePresence, motion } from 'framer-motion';
import { ACHIEVEMENTS, ACHIEVEMENT_COUNT, achievementStore, toastStore } from '../../lib/achievements';
import { useStore } from '../../lib/store';
import Icon from './Icon';

/** Pop-up badges, top-right, whenever something is unlocked. */
export function AchievementToasts() {
  const toasts = useStore(toastStore);

  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map(({ key, id }) => (
          <motion.div
            key={key}
            className="toast"
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <span className="toast__star" aria-hidden="true">
              <Icon name="star" size={22} />
            </span>
            <span>
              <small>Badge unlocked</small>
              <strong>{ACHIEVEMENTS[id].title}</strong>
              <em>{ACHIEVEMENTS[id].text}</em>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Small "★ 3/9" counter for the top bar. */
export function BadgeCounter() {
  const have = useStore(achievementStore);
  return (
    <span className="badge-counter" title={`${have.length} of ${ACHIEVEMENT_COUNT} badges unlocked`}>
      <Icon name="star" size={14} /> {have.length}/{ACHIEVEMENT_COUNT}
      <span className="sr-only"> badges unlocked</span>
    </span>
  );
}
