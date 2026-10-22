import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { profile } from '../../data/site';

const LETTERS = [...profile.name.toUpperCase()];

/** Loading screen: the name rises in letter by letter while a counter runs to 100, then the curtain lifts. */
export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2.2,
      ease: [0.6, 0.05, 0.3, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => setTimeout(onDone, 350),
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <motion.div
      className="pre"
      role="status"
      aria-label={`Loading ${profile.name}'s portfolio, ${pct} percent`}
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <p className="pre__top">
        <span>Portfolio</span>
        <span>{new Date().getFullYear()}</span>
      </p>

      <h1 className="pre__name" aria-label={profile.name}>
        {LETTERS.map((ch, i) => (
          <span key={`${ch}-${i}`} className="pre__mask" aria-hidden="true">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="pre__foot">
        <span className="pre__role hl">developer · designer · singer</span>
        <span className="pre__count">{String(pct).padStart(3, '0')}</span>
      </div>
      <span className="pre__bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </span>
    </motion.div>
  );
}
