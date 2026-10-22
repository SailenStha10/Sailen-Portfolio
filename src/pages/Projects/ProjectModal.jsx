import { motion } from 'framer-motion';
import Icon from '../../components/ui/Icon';
import Art, { ART_FOR } from '../../components/ui/Art';

/** Side drawer with the full project details. Click outside or press Esc to close. */
export default function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="drawer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        className="drawer__panel"
        style={{ '--accent': project.accent }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__cover">
          <span className="project__cat">{project.category}</span>
          <Art name={ART_FOR[project.category]} className="drawer__art" />
          <button type="button" className="drawer__close" onClick={onClose} aria-label="Close details">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="drawer__body">
          <h2>{project.title}</h2>
          <p className="hl">{project.summary}</p>
          <ul className="drawer__tags">
            {project.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="drawer__actions">
            <a className="btn btn--violet" href={project.live} target="_blank" rel="noreferrer noopener">
              Live preview ↗
            </a>
            <a className="btn btn--ghost" href={project.code} target="_blank" rel="noreferrer noopener">
              Source / details
            </a>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
