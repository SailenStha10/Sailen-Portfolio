import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { projectCategories, projects } from '../../data/site';
import FeaturedSlider from './FeaturedSlider';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import './Projects.css';

export default function Projects() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible = category === 'All' ? projects : projects.filter((p) => p.category === category);

  // Lock scroll and support Escape while the modal is open
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
        scene="Scene 05"
        eyebrow="Projects"
        title="Things I made with love."
        lead="Code, interfaces, artwork and music. Filter by what you’re curious about."
      />

      <section className="container projects__feature">
        <FeaturedSlider items={projects} onOpen={setSelected} paused={Boolean(selected)} />
      </section>

      <section className="container">
        <h2 className="projects__h2">All projects</h2>
        <div className="filters" role="group" aria-label="Filter projects">
          {projectCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filters__btn ${c === category ? 'is-active' : ''}`}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c === category && <motion.span layoutId="filter-bg" className="filters__bg" />}
              <span className="filters__label">{c}</span>
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.div layout className="project-grid">
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={() => setSelected(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </section>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
}
