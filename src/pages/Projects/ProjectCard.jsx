import { forwardRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** A project tile that gently tilts toward the cursor. */
const ProjectCard = forwardRef(function ProjectCard({ project, index, onOpen }, ref) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      ref={ref}
      layout
      className="project"
      initial={{ opacity: 0, x: index % 2 ? 110 : -110, y: 40, rotate: index % 2 ? 4 : -4, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-70px' }}
      exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        className="project__tilt px-box"
        style={{ rotateX, rotateY, transformPerspective: 900, '--accent': project.accent }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={onOpen}
        aria-label={`Open project: ${project.title}`}
      >
        <motion.span
          className="project__cover"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.8, delay: 0.25 + (index % 3) * 0.09, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="project__cat">{project.category}</span>
          <span className="project__no">{String(index + 1).padStart(2, '0')}</span>
          <span className="project__initial" aria-hidden="true">
            {project.title.charAt(0)}
          </span>
        </motion.span>
        <span className="project__body">
          <span className="project__title">{project.title}</span>
          <span className="project__summary">{project.summary}</span>
          <span className="project__more">View details →</span>
        </span>
      </motion.button>
    </motion.article>
  );
});

export default ProjectCard;
