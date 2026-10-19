import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { navLinks } from '../../data/site';

const ease = [0.76, 0, 0.24, 1];
const COLUMNS = 6;

const column = {
  initial: { scaleY: 1 },
  animate: (i) => ({ scaleY: 0, transition: { duration: 0.6, delay: 0.25 + i * 0.05, ease } }),
  exit: (i) => ({ scaleY: 1, transition: { duration: 0.5, delay: i * 0.05, ease } }),
};

/**
 * Scene change: black bars with a cyan leading edge sweep down, a title card flashes
 * the next scene's name, then the bars lift to reveal the page.
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const label = navLinks.find((l) => l.to === pathname)?.label ?? 'Signal lost';

  return (
    <>
      <div className="curtain" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <motion.div
            key={i}
            className="curtain__col"
            custom={i}
            variants={column}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        ))}
        <motion.p
          className="curtain__label"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
          exit={{ opacity: 1, transition: { delay: 0.25, duration: 0.15 } }}
        >
          <span>▶ SCENE CHANGE</span>
          {label.toUpperCase()}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.2 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.05 } }}
      >
        {children}
      </motion.div>
    </>
  );
}
