import { motion } from 'framer-motion';

const offsets = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -80 },
  right: { x: 80 },
  scale: { scale: 0.85 },
  none: {},
};

/** Fades/slides its children in the first time they scroll into view. */
export default function Reveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className,
  ...rest
}) {
  const Comp = motion[as] ?? motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
