import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sound } from '../../lib/sound';

const AUTO_MS = 6500;
const ease = [0.22, 1, 0.36, 1];

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 160 : -160, opacity: 0, scale: 0.92, rotate: dir > 0 ? 2 : -2, filter: 'blur(10px)' }),
  center: { x: 0, opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease } },
  exit: (dir) => ({
    x: dir > 0 ? -160 : 160,
    opacity: 0,
    scale: 0.92,
    rotate: dir > 0 ? -2 : 2,
    filter: 'blur(10px)',
    transition: { duration: 0.5, ease },
  }),
};

const stagger = (i) => ({
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.25 + i * 0.08, duration: 0.5, ease },
});

/** Spotlight carousel: slides left/right, auto-advances, draggable, keyboard friendly. */
export default function FeaturedSlider({ items, onOpen, paused: externalPause }) {
  const [[index, dir], setPage] = useState([0, 1]);
  const [hovered, setHovered] = useState(false);
  const first = useRef(true);
  const count = items.length;
  const project = items[index];
  const calm = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const paused = hovered || externalPause || calm;

  const go = useCallback((d) => setPage(([i]) => [(i + d + count) % count, d]), [count]);
  const jump = (to) => setPage(([i]) => [to, to > i ? 1 : -1]);

  // auto-advance
  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => go(1), AUTO_MS);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  // little blip on every change (not on first render)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    sound.play('select');
  }, [index]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  return (
    <section
      className="feat px-box"
      style={{ '--accent': project.accent }}
      aria-roledescription="carousel"
      aria-label="Featured projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="feat__top">
        <span className="feat__kicker">★ SPOTLIGHT</span>
        <span className="feat__count">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <span className="feat__arrows">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project">
            ◀
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next project">
            ▶
          </button>
        </span>
      </div>

      <div className="feat__viewport">
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.article
            key={project.id}
            className="feat__slide"
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -450) go(1);
              else if (info.offset.x > 80 || info.velocity.x > 450) go(-1);
            }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${project.title}`}
          >
            <div className="feat__cover">
              <span className="feat__cat">{project.category}</span>
              <span className="feat__initial" aria-hidden="true">
                {project.title.charAt(0)}
              </span>
              <span className="feat__scan" aria-hidden="true" />
            </div>
            <div className="feat__body">
              <motion.h2 {...stagger(0)}>{project.title}</motion.h2>
              <motion.p className="feat__summary" {...stagger(1)}>
                {project.summary}
              </motion.p>
              <motion.ul className="feat__tags" {...stagger(2)}>
                {project.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </motion.ul>
              <motion.div className="feat__actions" {...stagger(3)}>
                <button type="button" className="btn" onClick={() => onOpen(project)}>
                  Open project ▶
                </button>
              </motion.div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="feat__nav">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`feat__thumb ${i === index ? 'is-active' : ''}`}
            onClick={() => jump(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === index}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {i === index && !calm && (
              <i
                key={`${index}-${paused}`}
                className="feat__timer"
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
