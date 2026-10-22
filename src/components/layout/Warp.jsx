import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '../../data/site';
import { travelStore } from '../../lib/travel';
import { useStore } from '../../lib/store';

/** Short "heading to…" overlay shown while a terminal command moves you to another page. */
export default function Warp() {
  const { active, to } = useStore(travelStore);
  const label = navLinks.find((l) => l.to === to)?.label ?? to;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="warp"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.p initial={{ y: 12, scale: 0.96 }} animate={{ y: 0, scale: 1 }} className="warp__label">
            <small>Heading to</small>
            {label}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
