import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import Chapter from './Chapter';
import PixelSprite from '../../components/ui/PixelSprite';
import { LEGS_A, LEGS_B, PLAYER_BODY } from '../../lib/sprites';
import { chapters } from '../../data/site';

/**
 * The story as a walk. The section pins to the screen and scrolling slides the chapters
 * sideways, while a little pixel character walks along the path underneath and lights up
 * each stop it reaches. On small screens it simply stacks.
 */
export default function Walk() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [shift, setShift] = useState(0);
  const [step, setStep] = useState(false);
  const [reached, setReached] = useState(0);
  const n = chapters.length;
  const panels = useMemo(
    () =>
      chapters.map((c, i) => (
        <div key={c.id} className="walk__panel">
          <Chapter chapter={c} index={i} total={chapters.length} />
        </div>
      )),
    [],
  );

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (t) setShift(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const walker = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setStep(Math.floor(p * 60) % 2 === 0);
    setReached(Math.min(n - 1, Math.round(p * (n - 1))));
  });

  return (
    <section ref={ref} className="walk" style={{ '--n': n }} aria-label="The story in five chapters">
      <div className="walk__sticky">
        <motion.div ref={trackRef} className="walk__track" style={{ x }}>
          {panels}
        </motion.div>

        <div className="walk__path container" aria-hidden="true">
          <span className="walk__line" />
          {chapters.map((c, i) => (
            <span
              key={c.id}
              className={`walk__stop ${i <= reached ? 'is-on' : ''}`}
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            >
              <i />
              <b>{c.role.replace('The ', '')}</b>
            </span>
          ))}
          <motion.span className="walk__walker" style={{ left: walker }}>
            <PixelSprite rows={PLAYER_BODY} legs={step ? LEGS_A : LEGS_B} accent="var(--coral)" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}
