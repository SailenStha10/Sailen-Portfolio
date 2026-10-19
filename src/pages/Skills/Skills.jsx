import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Marquee from '../../components/ui/Marquee';
import { skillGroups, tools } from '../../data/site';
import { sound } from '../../lib/sound';
import './Skills.css';

const GLYPHS = { dev: '</>', design: '◆', music: '♪' };
const RANKS = [
  [85, 'Master'],
  [70, 'Expert'],
  [50, 'Adept'],
  [0, 'Apprentice'],
];
const rankOf = (level) => RANKS.find(([min]) => level >= min)[1];
const shortName = (name) => name.split(/[ (&/]/)[0];

/** Counts up from 0 when it mounts. */
function CountUp({ to, delay = 0, duration = 1.2 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, { duration, delay, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [to, delay, duration]);
  return <>{n}</>;
}

/** Spider-web chart: one axis per skill, the polygon grows out of the centre. */
function Radar({ skills, color }) {
  const size = 340;
  const c = size / 2;
  const R = 112;
  const n = skills.length;
  const point = (i, r) => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };
  const poly = (f) => skills.map((_, i) => point(i, R * f).join(',')).join(' ');
  const zero = skills.map(() => `${c},${c}`).join(' ');
  const full = skills.map((s, i) => point(i, (R * s.level) / 100).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar" role="img" aria-label="Skill radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={poly(f)} className="radar__ring" />
      ))}
      {skills.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} className="radar__axis" />;
      })}
      <motion.polygon
        points={zero}
        animate={{ points: full }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="radar__shape"
        style={{ fill: `color-mix(in srgb, ${color} 24%, transparent)`, stroke: color }}
      />
      {skills.map((s, i) => {
        const [x, y] = point(i, (R * s.level) / 100);
        const [lx, ly] = point(i, R + 26);
        const anchor = Math.abs(lx - c) < 8 ? 'middle' : lx > c ? 'start' : 'end';
        return (
          <g key={s.name}>
            <motion.circle
              r="5"
              fill={color}
              initial={{ cx: c, cy: c }}
              animate={{ cx: x, cy: y }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <text x={lx} y={ly + 4} textAnchor={anchor} className="radar__label">
              {shortName(s.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const listVariants = { show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 46, rotateX: -28, scale: 0.9 },
  show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function SkillCard({ skill, color, index }) {
  const circumference = 2 * Math.PI * 34;
  return (
    <motion.li className="sk px-box" variants={cardVariants} style={{ '--accent': color }}>
      <div className="sk__dial" aria-hidden="true">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" className="sk__track" />
          <motion.circle
            cx="40"
            cy="40"
            r="34"
            className="sk__arc"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - skill.level / 100) }}
            transition={{ duration: 1.1, delay: 0.25 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="sk__num">
          <CountUp to={skill.level} delay={0.25 + index * 0.09} />
        </span>
      </div>
      <div className="sk__info">
        <h3>{skill.name}</h3>
        <span className="sk__rank">{rankOf(skill.level)}</span>
        <span className="sk__pips" aria-label={`${skill.level} out of 100`}>
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} className={i < Math.round(skill.level / 10) ? 'is-on' : ''} style={{ transitionDelay: `${0.4 + i * 0.04}s` }} />
          ))}
        </span>
      </div>
    </motion.li>
  );
}

export default function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === activeId) ?? skillGroups[0];

  const power = useMemo(
    () => skillGroups.flatMap((g) => g.skills).reduce((sum, s) => sum + s.level, 0) * 10,
    [],
  );
  const main = useMemo(() => {
    const avg = (g) => g.skills.reduce((s, k) => s + k.level, 0) / g.skills.length;
    return [...skillGroups].sort((a, b) => avg(b) - avg(a))[0];
  }, []);

  const choose = (id) => {
    if (id === activeId) return;
    sound.play('select');
    setActiveId(id);
  };

  return (
    <main className="page skills">
      <PageHeader
        scene="Stage 04"
        eyebrow="Skills"
        title="Your loadout."
        lead="Three skill trees. Pick one to see how it stacks up."
      />

      <section className="container skills__top">
        <div className="tabs" role="tablist" aria-label="Skill categories">
          {skillGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={g.id === activeId}
              aria-controls="skills-panel"
              className={`tabs__btn ${g.id === activeId ? 'is-active' : ''}`}
              onClick={() => choose(g.id)}
            >
              {g.id === activeId && (
                <motion.span
                  layoutId="tab-bg"
                  className="tabs__bg"
                  style={{ background: g.color }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="tabs__glyph" aria-hidden="true">
                {GLYPHS[g.id]}
              </span>
              <span className="tabs__label">{g.label}</span>
              <span className="tabs__count">{g.skills.length}</span>
            </button>
          ))}
        </div>

        <Reveal direction="left" className="power px-box">
          <span className="power__label">POWER LEVEL</span>
          <strong className="power__value">
            <CountUp to={power} duration={1.8} />
          </strong>
          <span className="power__main">
            MAIN CLASS · <b>{main.label.toUpperCase()}</b>
          </span>
        </Reveal>
      </section>

      <section className="container">
        <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              className="skills__stage"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="radar-wrap px-box" style={{ '--accent': group.color }}>
                <p className="radar-wrap__title">
                  <span>{GLYPHS[group.id]}</span> {group.label.toUpperCase()}
                </p>
                <Radar skills={group.skills} color={group.color} />
              </div>

              <motion.ul className="sk-grid" variants={listVariants} initial="hidden" animate="show">
                {group.skills.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} color={group.color} index={i} />
                ))}
              </motion.ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="toolbelt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Inventory</span>
            <h2 className="toolbelt__title">The toolbelt</h2>
          </Reveal>
          <ul className="slots">
            {tools.map((tool, i) => (
              <motion.li
                key={tool}
                className="slot px-box"
                initial={{ opacity: 0, scale: 0.5, rotate: i % 2 ? 12 : -12, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 8) * 0.05, type: 'spring', stiffness: 260, damping: 16 }}
                whileHover={{ y: -6, rotate: i % 2 ? 3 : -3 }}
              >
                {tool}
              </motion.li>
            ))}
          </ul>
        </div>
        <Marquee items={tools} />
      </section>
    </main>
  );
}
