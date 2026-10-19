import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';

/**
 * Old-film countdown leader (5…1) driven by scroll. When not pinned (small screens /
 * reduced motion) it collapses into a simple title card.
 */
export default function Countdown({ pinned }) {
  const ref = useRef(null);
  const last = useRef(5);
  const [n, setN] = useState(5);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const ring = useTransform(scrollYProgress, [0, 0.92], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const numberOpacity = useTransform(scrollYProgress, [0.8, 0.92], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.max(1, 5 - Math.floor(Math.min(p, 0.999) * 5));
    if (next !== last.current) {
      last.current = next;
      setN(next);
      sound.play('tick');
    }
  });

  return (
    <section ref={ref} className={`leader ${pinned ? 'leader--pinned' : ''}`} aria-label="Opening title">
      <div className="leader__sticky">
        <p className="leader__studio">{profile.name.toUpperCase()} PICTURES PRESENTS</p>

        {pinned && (
          <motion.div className="leader__dial" style={{ opacity: numberOpacity }} aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" className="leader__ring-bg" />
              <motion.circle cx="100" cy="100" r="92" className="leader__ring" style={{ pathLength: ring }} />
              <path d="M100 0v200M0 100h200" className="leader__cross" />
            </svg>
            <span className="leader__n" key={n}>
              {n}
            </span>
          </motion.div>
        )}

        <motion.div className="leader__title" style={pinned ? { opacity: titleOpacity } : undefined}>
          <span>A STORY IN FIVE CHARACTERS</span>
          <h2>A Colourful Life</h2>
        </motion.div>

        {pinned && <p className="leader__hint">▼ SCROLL TO ROLL FILM</p>}
      </div>
    </section>
  );
}
