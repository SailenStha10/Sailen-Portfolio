import { useEffect, useMemo, useRef, useState } from 'react';
import { skillGroups } from '../../data/site';

const SRC = (n) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${n}/${n}-original.svg`;
const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

/** Marks that are not in the devicon set are drawn here. */
const MARKS = {
  neon: () => (
    <>
      <rect x="1.500" y="1.500" width="21" height="21" rx="6" fill="#00e599" />
      <path d="M7.500 17.500V6.500h2.200l5 6.200V6.500h2.200v11h-2.200l-5-6.200v6.200z" fill="#0b0b0b" />
    </>
  ),
  cursor: () => (
    <>
      <rect x="1.500" y="1.500" width="21" height="21" rx="6" fill="#14140f" />
      <path d="M7.200 5.800l10.600 6.200-4.400 1.300-2.200 4.200z" fill="#f6f3ec" />
    </>
  ),
  bandlab: () => (
    <>
      <circle cx="12" cy="12" r="11" fill="#f12c18" />
      <g fill="#fff">
        <rect x="5.200" y="10" width="2" height="4" rx="1" />
        <rect x="8.600" y="7" width="2" height="10" rx="1" />
        <rect x="12" y="4.500" width="2" height="15" rx="1" />
        <rect x="15.400" y="8" width="2" height="8" rx="1" />
      </g>
    </>
  ),
  capcut: () => (
    <>
      <rect x="1.500" y="1.500" width="21" height="21" rx="6" fill="#0b0b0b" />
      <path d="M5.800 8.300l5.200 3.700-5.200 3.700v-2.600l2.200-1.100L5.800 10.900z" fill="#fff" />
      <path d="M12.300 6.800h2.400l3.500 10.400h-2.400z" fill="#fff" />
    </>
  ),
  vn: () => (
    <>
      <rect x="1.500" y="1.500" width="21" height="21" rx="6" fill="#0b0b0b" />
      <text x="12" y="15.800" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="10.500" fill="#fff">VN</text>
    </>
  ),
  guitar: (color) => (
    <>
      <circle cx="12" cy="12" r="11" fill={color} />
      <g fill="none" stroke="#fff" strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9.200" cy="15" r="3.300" />
        <circle cx="11.700" cy="12.500" r="1.700" />
        <path d="M12.900 11.300L18.200 6" />
        <path d="M17 5.200l1.800 1.800" />
      </g>
    </>
  ),
};

function Mark({ name, size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{MARKS[name](color)}</svg>;
}

export function Logo({ skill, color, size = 26 }) {
  const [failed, setFailed] = useState(skill.glyph);
  if (MARKS[skill.icon]) return <Mark name={skill.icon} size={size} color={color} />;
  return failed
    ? <span className="tool__letter" style={{ background: color, width: size, height: size, fontSize: size * 0.5 }}>{skill.name.charAt(0)}</span>
    : <img src={SRC(skill.icon)} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} />;
}

/**
 * When the cloud scrolls into view the tools fly up from below the screen, one after another,
 * and slowly settle into a loose pile under the heading.
 */
export default function ToolCloud() {
  const box = useRef(null);
  const [cols, setCols] = useState(6);
  const items = useMemo(() => {
    const all = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, color: g.color.includes('coral') ? 'var(--accent)' : g.color, group: g.word })));
    // shuffle so the groups mix, then give each a loose spot and a tilt
    return all
      .map((s, i) => ({ s, k: rand(i, 9) }))
      .sort((a, b) => a.k - b.k)
      .map(({ s }, i) => ({ ...s, tilt: (rand(i, 5) - 0.5) * 34 }));
  }, []);
  const rows = Math.ceil(items.length / cols);

  useEffect(() => {
    const fit = () => setCols(innerWidth < 640 ? 3 : innerWidth < 1000 ? 4 : 6);
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  const [seen, setSeen] = useState(false);
  useEffect(() => {
    // plays whenever the section scrolls into view, and resets once it is fully out of view
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio >= 0.25) setSeen(true); else if (!e.isIntersecting) setSeen(false); }, { threshold: [0, 0.25] });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <ul className={`cloud ${seen ? 'is-in' : ''}`} ref={box} style={{ '--rows': rows }}>
      {items.map((s, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = ((col + 0.5 + (rand(i, 6) - 0.5) * 0.7 + (row % 2 ? 0.25 : -0.25)) / cols) * 100;
        const y = ((row + 0.5 + (rand(i, 7) - 0.5) * 0.7) / rows) * 100;
        return (
          <li key={s.name} className="tool" style={{ '--c': s.color, '--i': i, '--fx': ((rand(i, 1) - 0.5) * 60).toFixed(1), '--fy': (70 + rand(i, 2) * 50).toFixed(1), '--tilt': s.tilt.toFixed(1), '--sr': ((rand(i, 4) - 0.5) * 220).toFixed(0), left: `${Math.min(92, Math.max(8, x))}%`, top: `${y}%` }} title={s.group}>
            <Logo skill={s} color={s.color} />
            <span>{s.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
