import { useEffect, useRef } from 'react';
import { projects } from '../../data/site';
import FitLine from './FitLine';
import Poster from './Poster';
import { TLink, useGo } from './nav';

/**
 * Work: the title stays pinned in the middle of the screen and the posters scroll over it,
 * staggered left and right, each drifting at its own pace and leaning with the speed of the scroll.
 * The text of whichever poster crosses the reading line shows in a caption pinned to the bottom.
 */
export default function SelectedWork({ items, title = 'Selected', word = 'work', onOpen }) {
  const go = useGo();
  const section = useRef(null);
  const caption = useRef(null);

  useEffect(() => {
    const sec = section.current;
    const list = sec.querySelector('.work__list');
    const cap = caption.current;
    const cards = [...list.querySelectorAll('.work-card')].map((el, n) => ({
      el,
      media: el.querySelector('.work-card__media'),
      set: '',
      p: 0,
      drift: [0.06, -0.1, 0.04, -0.12, 0.08, -0.05][n % 6],
      p6: items[n],
    }));

    // Cursor tag that follows the pointer over a poster
    const cleanups = cards.map(({ el }) => {
      const follow = (e) => {
        const b = el.getBoundingClientRect();
        el.style.setProperty('--tag-x', `${e.clientX - b.left}px`);
        el.style.setProperty('--tag-y', `${e.clientY - b.top}px`);
      };
      const enter = (e) => { if (e.pointerType === 'mouse') { follow(e); el.classList.add('is-hovered'); } };
      const leave = () => el.classList.remove('is-hovered');
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', follow);
      el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', follow); el.removeEventListener('pointerleave', leave); };
    });

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let shown = null, lean = 0, leanV = 0, lastY = scrollY, last = null, raf = 0, onScreen = false;

    const show = (card) => {
      if (card === shown) return;
      const first = shown === null;
      shown = card;
      cap.classList.toggle('is-on', !!card);
      if (!card) return;
      cap.querySelector('.work__caption-name').textContent = card.p6.title;
      cap.querySelector('.work__caption-desc').textContent = card.p6.summary;
      cap.querySelector('.work__caption-tags').textContent = [card.p6.category, ...card.p6.tags].join(' / ');
      cap.querySelector('a').setAttribute('href', `/work/${card.p6.id}`);
      if (first || still) return;
      cap.querySelectorAll('.work__caption-name, .work__caption-desc').forEach((el, n) =>
        el.animate([{ opacity: 0, transform: 'translateY(.4em)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: n * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }),
      );
    };

    const frame = (now) => {
      const dt = last === null ? 0.016 : Math.min(Math.max((now - last) / 1000, 0.001), 0.05);
      last = now;
      const H = innerHeight;
      if (!still) {
        const speed = (scrollY - lastY) / dt / H;
        const target = Math.max(-1, Math.min(1, speed * 0.55));
        leanV += ((target - lean) * 60 - leanV * 12) * dt;
        lean += leanV * dt;
        list.style.setProperty('--v', lean.toFixed(4));
      }
      lastY = scrollY;
      const line = H * 0.42;
      let nearest = null, dist = Infinity;
      const boxes = cards.map((c) => c.media.getBoundingClientRect());
      cards.forEach((c, i) => {
        const b = boxes[i];
        if (b.bottom < -200 || b.top > H + 200) return;
        if (!still) {
          const centre = b.top + b.height / 2 - c.p;
          const next = ((centre - H / 2) * c.drift).toFixed(1);
          if (next !== c.set) { c.el.style.setProperty('--p', next); c.set = next; c.p = parseFloat(next); }
        }
        if (b.top > H * 0.72 || b.bottom < H * 0.18) return;
        const away = Math.abs(b.top + b.height / 2 - line);
        if (away < dist) { dist = away; nearest = c; }
      });
      show(nearest);
      raf = onScreen && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (raf || !onScreen || document.hidden) return;
      last = null; lastY = scrollY;
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; wake(); });
    io.observe(sec);
    document.addEventListener('visibilitychange', wake);

    return () => {
      cleanups.forEach((c) => c());
      io.disconnect();
      document.removeEventListener('visibilitychange', wake);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <section className="work" ref={section}>
      <div className="work__stage">
        <FitLine rows={[[title, word]].map((r) => r.filter(Boolean))} />
        <p className="work__count">({String(items.length).padStart(2, '0')} projects)</p>
      </div>
      <ol className="work__list">
        {items.map((p, i) => (
          <li key={p.id} className="work-card">
            {onOpen ? (
              <button type="button" className="work-card__media" aria-label={p.title} onClick={() => onOpen(p)}>
                <Poster p={p} index={projects.indexOf(p)} />
                <span className="cursor-tag">View</span>
              </button>
            ) : (
              <TLink to={`/work/${p.id}`} className="work-card__media" aria-label={p.title}>
                <Poster p={p} index={i} />
                <span className="cursor-tag">View case</span>
              </TLink>
            )}
            <div className="work-card__caption">
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="work__caption" ref={caption}>
        <div>
          <h3 className="work__caption-name" />
          <p className="work__caption-desc" />
        </div>
        <div className="work__caption-side">
          <span className="work__caption-tags" />
          <a
            className="btn btn--sm"
            href="/work"
            onClick={(e) => {
              e.preventDefault();
              const href = e.currentTarget.getAttribute('href');
              const hit = onOpen && items.find((p) => href === `/work/${p.id}`);
              if (hit) onOpen(hit); else go(href);
            }}
          >
            {onOpen ? 'View project →' : 'View case →'}
          </a>
        </div>
      </div>
    </section>
  );
}

