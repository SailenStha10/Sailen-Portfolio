import { AnimatePresence, motion } from 'framer-motion';
import { travelStore } from '../../lib/travel';
import { useStore } from '../../lib/store';

const RAYS = Array.from({ length: 56 }, (_, i) => ({
  angle: (i * 360) / 56 + ((i * 7) % 5),
  delay: ((i * 37) % 10) / 40,
  length: 28 + ((i * 53) % 40),
}));

/** Full-screen "hyperspace" overlay shown while travelling between pages. */
export default function Warp() {
  const { active, to } = useStore(travelStore);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="warp"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.25 }}
        >
          <div className="warp__rays" aria-hidden="true">
            {RAYS.map((r, i) => (
              <i
                key={i}
                style={{
                  '--a': `${r.angle}deg`,
                  '--len': `${r.length}vmax`,
                  animationDelay: `${r.delay}s`,
                }}
              />
            ))}
          </div>
          <p className="warp__label">
            <span>TRAVELLING TO</span>
            {to === '/' ? '~' : to}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
