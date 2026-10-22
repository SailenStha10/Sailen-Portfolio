import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { chapters } from '../../data/site';

const LINES = chapters.flatMap((c) => c.points.map((p) => ({ text: p, role: c.role.replace('The ', '') })));

function Line({ item, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 1', 'start 0.72'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.li ref={ref} className="pt__line" style={{ opacity, x, scale }}>
      <span className="pt__no">{String(i + 1).padStart(2, '0')}</span>
      <span className="pt__text">{item.text}</span>
      <span className="pt__role hl">{item.role}</span>
    </motion.li>
  );
}

/** Every little trait from the five chapters, one big line each, sliding in as you pass them. */
export default function Points() {
  return (
    <section className="pt container" aria-label="In short">
      <div className="pt__head">
        <p className="eyebrow">In short</p>
        <h2>
          The <span className="hl">details.</span>
        </h2>
      </div>
      <ul className="pt__list">
        {LINES.map((l, i) => (
          <Line key={l.text} item={l} i={i} />
        ))}
      </ul>
    </section>
  );
}
