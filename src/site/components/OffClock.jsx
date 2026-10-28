import { useEffect, useRef, useState } from 'react';
import { projects } from '../../data/site';
import { GALLERY } from '../content';
import Poster from './Poster';

/** Floating preview of the projects and photos behind one line. It trails the pointer. */
function Peek({ item, at }) {
  const box = useRef(null);
  useEffect(() => {
    if (box.current && at) {
      const flip = at.x > innerWidth - 480;
      const y = Math.min(Math.max(at.y - 170, 80), innerHeight - 360);
      box.current.style.transform = `translate3d(${flip ? at.x - 440 : at.x + 28}px, ${y}px, 0)`;
    }
  }, [at]);
  const cards = (item?.show || []).map(([k, id], i) => {
    if (k === 'p') {
      const idx = projects.findIndex((p) => p.id === id);
      return idx < 0 ? null : <div key={id} className="peek__card peek__card--p" style={{ '--n': i }}><Poster p={projects[idx]} index={idx} /></div>;
    }
    const g = GALLERY.find((x) => x.id === id);
    return g ? (
      <div key={id} className="peek__card peek__card--g" style={{ '--n': i, '--c': g.color }}>
        {g.src ? <img src={g.src} alt="" draggable="false" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
        <b>{g.caption}</b>
      </div>
    ) : null;
  });
  return (
    <div className={`peek ${item ? 'is-on' : ''}`} ref={box} aria-hidden="true">
      <div className="peek__stack" key={item?.title}>{cards}</div>
    </div>
  );
}

/**
 * A loading bar with a little Sailen running along it. As you scroll through the section the bar fills,
 * checkpoints light up and the big outlined words fill in one by one with their description.
 */
export default function OffClock({ items }) {
  const box = useRef(null);
  const stage = useRef(null);
  const fill = useRef(null);
  const runner = useRef(null);
  const pct = useRef(null);
  const [unlocked, setUnlocked] = useState(0);
  const last = useRef(-1);
  const [peek, setPeek] = useState({ i: -1, x: 0, y: 0 });

  useEffect(() => {
    const el = box.current;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // wide screens pin the stage and use the scroll length of the section; narrow ones just follow the page
      const pinned = innerWidth > 720;
      const len = pinned ? r.height - stage.current.offsetHeight : r.height * 0.8;
      const p = still ? 1 : Math.max(0, Math.min(1, ((pinned ? 76 : innerHeight * 0.8) - r.top) / len));
      fill.current.style.transform = `scaleX(${p})`;
      runner.current.style.left = `${p * 100}%`;
      runner.current.classList.toggle('is-run', p > 0 && p < 1);
      pct.current.textContent = `${Math.round(p * 100)}%`;
      const n = Math.min(items.length, Math.floor(p * (items.length + 0.35)));
      if (n !== last.current) { last.current = n; setUnlocked(n); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [items.length]);

  const done = unlocked === items.length;
  const at = (i) => Math.min(100, ((i + 1) / (items.length + 0.35)) * 100);
  return (
    <div className="oc" ref={box}>
      <div className="oc__stage" ref={stage}>
        <div className="oc__bar">
          <span className="oc__label">{done ? 'All unlocked' : 'Loading'} <b ref={pct}>0%</b></span>
          <div className="oc__track">
            <i className="oc__fill" ref={fill} />
            {items.map((it, i) => (
              <span key={it.title} className={`oc__stop ${i < unlocked ? 'is-on' : ''}`} style={{ left: `${at(i)}%` }}>
                <i />
                <em>{String(i + 1).padStart(2, '0')}</em>
              </span>
            ))}
            <span className="oc__runner" ref={runner}>
              <img src="/hero-front.webp" alt="" draggable="false" />
            </span>
          </div>
          <span className="oc__count">{unlocked} / {items.length}</span>
        </div>
        <ol className="oc__lines" onMouseLeave={() => setPeek((p) => ({ ...p, i: -1 }))}>
          {items.map((it, i) => (
            <li
              key={it.title}
              className={`oc__line ${i < unlocked ? 'is-on' : ''} ${peek.i === i ? 'is-peek' : ''}`}
              onMouseMove={(e) => setPeek({ i: i < unlocked ? i : -1, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setPeek((p) => ({ ...p, i: -1 }))}
            >
              <span className="oc__no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <Peek item={peek.i >= 0 ? items[peek.i] : null} at={peek} />
    </div>
  );
}
