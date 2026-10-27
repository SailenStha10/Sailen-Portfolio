import { useEffect, useRef, useState } from 'react';

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
        <ol className="oc__lines">
          {items.map((it, i) => (
            <li key={it.title} className={`oc__line ${i < unlocked ? 'is-on' : ''}`}>
              <span className="oc__no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
