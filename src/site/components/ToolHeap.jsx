import { useEffect, useMemo, useRef, useState } from 'react';
import { skillGroups } from '../../data/site';
import { Logo } from './ToolCloud';

const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const GOLDEN = 2.399963;

/**
 * Every tool in one loose heap. Tiles are laid out on a spiral inside an ellipse (so they gather in a
 * dense blob) and tilted at random. When the heap scrolls into view every tile flies up from below the
 * screen, one after another, and slowly settles into place.
 */
export default function ToolHeap() {
  const box = useRef(null);
  const items = useMemo(() => {
    const all = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, color: g.color.includes('coral') ? 'var(--accent)' : g.color })));
    return all
      .map((s, i) => ({ s, k: rand(i, 9) }))
      .sort((a, b) => a.k - b.k)
      .map(({ s }, i, arr) => {
        const r = Math.sqrt((i + 0.6) / arr.length);
        const a = i * GOLDEN;
        return {
          ...s,
          x: 50 + Math.cos(a) * r * 46 + (rand(i, 6) - 0.5) * 3,
          y: 50 + Math.sin(a) * r * 44 + (rand(i, 7) - 0.5) * 3,
          tilt: (rand(i, 5) - 0.5) * 30,
          big: rand(i, 8) > 0.72,
        };
      });
  }, []);

  const [seen, setSeen] = useState(false);
  useEffect(() => {
    // plays whenever the section scrolls into view, and resets once it is fully out of view
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio >= 0.3) setSeen(true); else if (!e.isIntersecting) setSeen(false); }, { threshold: [0, 0.3] });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`heap ${seen ? 'is-in' : ''}`} ref={box}>
      <div className="heap__count" aria-hidden="true">
        <b>{items.length}</b>
        <span>tools and skills</span>
      </div>
      <ul>
        {items.map((s, i) => (
          <li key={s.name} className={`heap__tile ${s.big ? 'is-big' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%`, '--c': s.color, '--i': i, '--fx': ((rand(i, 1) - 0.5) * 60).toFixed(1), '--fy': (70 + rand(i, 2) * 50).toFixed(1), '--tilt': s.tilt.toFixed(1), '--sr': ((rand(i, 4) - 0.5) * 220).toFixed(0) }}>
            <span className="heap__in">
              <Logo skill={s} color={s.color} size={s.big ? 46 : 36} />
              <span>{s.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
