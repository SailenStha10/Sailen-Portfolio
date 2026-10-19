import { motion } from 'framer-motion';
import SplitText from './SplitText';
import Reveal from './Reveal';

/** Scene title card shown at the top of every inner page. */
export default function PageHeader({ eyebrow, title, lead, scene }) {
  return (
    <header className="page-header container">
      <Reveal direction="none">
        <span className="scene-tag">{scene ?? 'Scene'}</span>
        <br />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <SplitText as="h1" className="section-title" text={title} delay={0.6} />
      {lead && (
        <Reveal delay={0.8}>
          <p className="section-lead">{lead}</p>
        </Reveal>
      )}
      <motion.div
        className="page-header__rule"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </header>
  );
}
