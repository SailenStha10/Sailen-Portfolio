import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { sound } from '../../lib/sound';

/** A film clapperboard whose clapper snaps shut when it scrolls into view. */
export default function Clapperboard({ scene, take = 1, title }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const snapped = useRef(false);

  useEffect(() => {
    if (inView && !snapped.current) {
      snapped.current = true;
      setTimeout(() => sound.play('clap'), 420);
    }
    if (!inView) snapped.current = false;
  }, [inView]);

  return (
    <div className="clap" ref={ref} aria-hidden="true">
      <motion.div
        className="clap__stick"
        initial={{ rotate: -28 }}
        animate={{ rotate: inView ? 0 : -28 }}
        transition={{ delay: inView ? 0.25 : 0, duration: 0.18, ease: 'easeIn' }}
      />
      <div className="clap__board">
        <div className="clap__row">
          <span>SCENE</span>
          <b>{String(scene).padStart(2, '0')}</b>
          <span>TAKE</span>
          <b>{take}</b>
        </div>
        <div className="clap__title">{title}</div>
      </div>
    </div>
  );
}
