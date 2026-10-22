import { motion } from 'framer-motion';

/** Quick fade-and-rise between pages. Short on purpose — nobody wants to wait. */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {children}
    </motion.div>
  );
}
