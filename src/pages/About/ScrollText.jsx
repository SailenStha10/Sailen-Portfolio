import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className="scrolltext__w">
      {children}
    </motion.span>
  );
}

/** A big statement, pinned to the screen. Its words light up one by one as you scroll through it. */
export default function ScrollText({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = text.split(' ');
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="statement" aria-label="In a few lines">
      <div className="statement__sticky container">
        <p className="eyebrow">In a few lines</p>
        <p className="scrolltext">
          {words.map((w, i) => (
            <Word key={`${w}-${i}`} progress={scrollYProgress} range={[0.03 + (i / words.length) * 0.72, 0.03 + ((i + 1) / words.length) * 0.72]}>
              {w}{' '}
            </Word>
          ))}
        </p>
        <span className="statement__bar" aria-hidden="true">
          <motion.i style={{ scaleX: bar }} />
        </span>
      </div>
    </section>
  );
}
