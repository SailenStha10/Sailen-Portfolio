import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Slides its text up out of a clipped line when it scrolls into view. Wrap heading content in it.
 * The "is it on screen?" check watches the clipping wrapper, not the moving text: text that is
 * hidden by its own clip can never report as visible, which used to leave headings blank.
 */
export default function Mask({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -6% 0px' });

  return (
    <span ref={ref} className={`mask ${className}`}>
      <motion.span
        className="mask__in"
        initial={{ y: '108%' }}
        animate={{ y: seen ? 0 : '108%' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
