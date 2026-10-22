import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navLinks } from '../../data/site';

/** Title block at the top of every inner page, with a "step x of y" marker. */
export default function PageHeader({ eyebrow, title, lead }) {
  const { pathname } = useLocation();
  const step = navLinks.findIndex((l) => l.to === pathname);
  const total = navLinks.length - 1;

  return (
    <motion.header
      className="phead container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0 }}
    >
      <p className="phead__step">
        {step > 0 && (
          <span className="phead__dots" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={i < step ? 'is-on' : ''} />
            ))}
          </span>
        )}
        <span className="eyebrow">{step > 0 ? `Step ${step} of ${total} · ${eyebrow}` : eyebrow}</span>
      </p>
      <h1 className="phead__title">
        <span className="phead__mask">
          <motion.span
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.span>
        </span>
      </h1>
      {lead && <p className="phead__lead">{lead}</p>}
    </motion.header>
  );
}
