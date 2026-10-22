import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Art from '../../components/ui/Art';
import { experience } from '../../data/site';

/**
 * The roles as a scroll-driven reel. The left side is pinned: a big illustration, counter and
 * progress dots that change as each role passes the middle of the screen. The right side scrolls;
 * the active role lights up and the others fade back.
 */
export default function Timeline() {
  const [active, setActive] = useState(0);
  const items = useRef([]);
  const n = experience.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = experience[active];

  return (
    <section className="reel container" aria-label="Roles and experience">
      <div className="reel__pin" style={{ '--tone': current.color }} aria-hidden="true">
        <div className="reel__frame">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="reel__art"
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Art name={current.art} />
            </motion.div>
          </AnimatePresence>
          <span className="reel__kind">{current.kind}</span>
        </div>

        <div className="reel__meta">
          <p className="reel__count">
            <b>{String(active + 1).padStart(2, '0')}</b>
            <span>/ {String(n).padStart(2, '0')}</span>
          </p>
          <ul className="reel__dots">
            {experience.map((x, i) => (
              <li key={x.id} className={i === active ? 'is-on' : i < active ? 'is-done' : ''} />
            ))}
          </ul>
        </div>
      </div>

      <ol className="reel__list">
        {experience.map((x, i) => (
          <li
            key={x.id}
            ref={(el) => (items.current[i] = el)}
            data-i={i}
            className={`reel__item ${i === active ? 'is-active' : ''}`}
          >
            <div className="reel__mobileart" style={{ background: x.color }}>
              <Art name={x.art} />
            </div>
            <span className="reel__no">{String(i + 1).padStart(2, '0')}</span>
            <h2>{x.role}</h2>
            <p className="hl">{x.org}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
