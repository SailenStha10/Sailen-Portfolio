import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import Art, { ART_FOR } from '../../components/ui/Art';
import Icon from '../../components/ui/Icon';
import Mask from '../../components/ui/Mask';
import { projectCategories, projects } from '../../data/site';
import ProjectModal from './ProjectModal';
import './Projects.css';

const toneOf = (accent) =>
  accent.includes('orange') ? 'coral' : accent.includes('cyan') ? 'blue' : accent.includes('mint') ? 'mint' : 'sand';

/**
 * One full-screen case study. As it scrolls into view its coloured panel opens up from a rounded
 * window to full width, the picture drifts and turns, and the giant number slides sideways.
 */
function Case({ project, index, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const inset = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [14, 0, 0, 10]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 0.6}% round ${v * 3}px)`);
  const artY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const artR = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const numX = useTransform(scrollYProgress, [0, 1], [index % 2 ? 140 : -140, index % 2 ? -140 : 140]);
  const flip = index % 2 === 1;

  return (
    <section ref={ref} className={`case case--${toneOf(project.accent)} ${flip ? 'is-flip' : ''}`}>
      <motion.div className="case__panel" style={{ clipPath: clip }}>
        <motion.span className="case__num" style={{ x: numX }} aria-hidden="true">
          {String(projects.indexOf(project) + 1).padStart(2, '0')}
        </motion.span>

        <div className="container case__grid">
          <motion.div className="case__pic" style={{ y: artY, rotate: artR }}>
            <span className="case__disc" />
            <Art name={ART_FOR[project.category]} />
          </motion.div>

          <div className="case__text">
            <motion.span
              className="case__cat"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20%' }}
            >
              {project.category}
            </motion.span>
            <h2 className="case__title">
              <Mask>{project.title}</Mask>
            </h2>
            <motion.p
              className="case__sum hl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              {project.summary}
            </motion.p>
            <motion.ul
              className="case__tags"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              {project.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </motion.ul>
            <motion.button
              type="button"
              className="case__btn"
              onClick={onOpen}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              View details <Icon name="arrow" size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function Projects() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible = category === 'All' ? projects : projects.filter((p) => p.category === category);
  const countOf = (c) => (c === 'All' ? projects.length : projects.filter((p) => p.category === c).length);

  useEffect(() => {
    if (!selected) return undefined;
    document.body.classList.add('no-scroll');
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  return (
    <main className="page projects">
      <PageHeader
        eyebrow="Projects"
        title={
          <>
            Things I <span className="hl">made.</span>
          </>
        }
      />

      <div className="container">
        <div className="filters" role="group" aria-label="Filter projects">
          {projectCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filters__btn ${c === category ? 'is-active' : ''}`}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
              <span>{countOf(c)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cases" key={category}>
        {visible.map((p, i) => (
          <Case key={p.id} project={p} index={i} onOpen={() => setSelected(p)} />
        ))}
      </div>

      <AnimatePresence>{selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </main>
  );
}
