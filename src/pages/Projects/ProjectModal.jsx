import { motion } from 'framer-motion';

export default function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal__card px-box"
        style={{ '--accent': project.accent }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ y: 80, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__cover">
          <span className="project__cat">{project.category}</span>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            [X] CLOSE
          </button>
        </div>
        <div className="modal__body">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <ul className="modal__tags">
            {project.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="modal__actions">
            <a className="btn" href={project.live} target="_blank" rel="noreferrer noopener">
              Live preview ↗
            </a>
            <a className="btn btn--ghost" href={project.code} target="_blank" rel="noreferrer noopener">
              Source / details
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
