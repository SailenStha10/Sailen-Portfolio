import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/** Word-by-word masked text reveal. Use `inView` to trigger on scroll instead of on mount. */
export default function SplitText({
  text,
  as: Tag = 'span',
  id,
  className = '',
  delay = 0,
  inView = false,
}) {
  const trigger = inView
    ? { whileInView: { y: 0 }, viewport: { once: true, margin: '-60px' } }
    : { animate: { y: 0 } };

  return (
    <Tag id={id} className={`split ${className}`} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span className="split__mask" key={`${word}-${i}`} aria-hidden="true">
          <motion.span
            className="split__word"
            initial={{ y: '115%' }}
            transition={{ duration: 0.8, delay: delay + i * 0.07, ease }}
            {...trigger}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
