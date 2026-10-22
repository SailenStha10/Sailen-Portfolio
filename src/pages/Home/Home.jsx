import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Terminal from '../../components/terminal/Terminal';
import Art, { ART_FOR } from '../../components/ui/Art';
import Icon from '../../components/ui/Icon';
import Reveal from '../../components/ui/Reveal';
import Mask from '../../components/ui/Mask';
import SkillLogo from '../../components/ui/SkillLogo';
import { characters, experience, profile, projects, skillGroups } from '../../data/site';
import './Home.css';

const ALL_SKILLS = skillGroups.flatMap((g) => g.skills);
const HALF = Math.ceil(ALL_SKILLS.length / 2);
const SKILL_COUNT = skillGroups.reduce((n, g) => n + g.skills.length, 0);

const DO = [
  { word: 'Code', tone: 'blue', art: 'laptop', line: 'Full-stack apps that feel fast and friendly.', list: characters[0].checkpoints.map((c) => c.skill) },
  { word: 'Design', tone: 'coral', art: 'palette', line: 'Interfaces, posters and brands with taste.', list: characters[1].checkpoints.map((c) => c.skill) },
  { word: 'Sing', tone: 'mint', art: 'mic', line: 'Live vocals, covers and songwriting.', list: characters[2].checkpoints.map((c) => c.skill) },
];

const STATS = [
  { n: experience.length, label: 'Roles held', note: 'leading & building', art: 'crown', tone: 'coral' },
  { n: projects.length, label: 'Projects made', note: 'code, design & music', art: 'laptop', tone: 'blue' },
  { n: SKILL_COUNT, label: 'Skills & tools', note: 'and still collecting', art: 'palette', tone: 'sand' },
  { n: 3, label: 'Passions', note: 'one person', art: 'mic', tone: 'sage' },
];

/** Counts up once when scrolled into view. */
function Count({ to }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return undefined;
    const c = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to]);
  return <span ref={ref}>{n}</span>;
}

/** Four big numbers as full-width rows. Hover one: it floods with colour and its picture slides in. */
function Metrics() {
  return (
    <section className="metrics container" aria-label="At a glance">
      <ul className="metrics__list">
        {STATS.map((s, i) => (
          <motion.li
            key={s.label}
            className={`metric metric--${s.tone}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            tabIndex={0}
          >
            <span className="metric__fill" aria-hidden="true" />
            <span className="metric__pic" aria-hidden="true">
              <Art name={s.art} />
            </span>
            <span className="metric__no">{String(i + 1).padStart(2, '0')}</span>
            <strong className="metric__n">
              <Count to={s.n} />
              <span className="metric__plus" aria-hidden="true">+</span>
            </strong>
            <span className="metric__text">
              <b>{s.label}</b>
              <em className="hl">{s.note}</em>
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/** "Three hats": an accordion of tall panels. The one you point at opens up; the rest fold back. */
function Hats() {
  const [open, setOpen] = useState(0);
  return (
    <section className="what container" aria-labelledby="what-title">
      <p className="eyebrow">What I do</p>
      <h2 id="what-title" className="sec-title">
        <Mask>
          Three hats, <span className="hl">one</span> head.
        </Mask>
      </h2>
      <div className="hats">
        {DO.map((d, i) => (
          <motion.article
            key={d.word}
            className={`hat hat--${d.tone} ${open === i ? 'is-open' : ''}`}
            tabIndex={0}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 90 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hat__no">0{i + 1}</span>
            <h3 className="hat__word">{d.word}</h3>
            <div className="hat__art" aria-hidden="true">
              <Art name={d.art} />
            </div>
            <div className="hat__more">
              <p className="hl">{d.line}</p>
              <ul>
                {d.list.map((l, k) => (
                  <li key={l} style={{ transitionDelay: open === i ? `${0.15 + k * 0.05}s` : '0s' }}>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/** Logos flowing past in opposite directions; hover to pause. */
function Flow({ items, reverse, speed = 46 }) {
  const row = (hidden) => (
    <ul className="flow__row" aria-hidden={hidden || undefined}>
      {items.map((s) => (
        <li key={s.name} className="flow__tile">
          <SkillLogo skill={s} size={46} />
          <span>{s.name}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`flow ${reverse ? 'flow--reverse' : ''}`} style={{ '--speed': `${speed}s` }}>
      <div className="flow__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/*
 * "Things I made": three cards in one frame. Scrolling is wired straight to the cards, so the
 * motion is continuous: the front card slides out to the left while the ones behind glide forward.
 * t = how far a card is from the front (0 = front, 1 = next, 2 = after that, -1 = just left).
 */
const POSE = {
  t: [3, 2, 1, 0, -1],
  x: [96, 68, 34, 0, -760],
  y: [-84, -60, -30, 0, 36],
  scale: [0.8, 0.88, 0.94, 1, 0.96],
  rotate: [7, 4.4, 2.2, 0, -9],
  opacity: [0, 1, 1, 1, 1],
};

function StackCard({ project, i, n, progress }) {
  const at = POSE.t.map((t) => (i - t) / (n - 1));
  const x = useTransform(progress, at, POSE.x);
  const y = useTransform(progress, at, POSE.y);
  const scale = useTransform(progress, at, POSE.scale);
  const rotate = useTransform(progress, at, POSE.rotate);
  const opacity = useTransform(progress, at, POSE.opacity);

  return (
    <motion.div className="scard" style={{ '--accent': project.accent, x, y, scale, rotate, opacity, zIndex: n - i }}>
      <Link to="/projects" className="scard__link" aria-label={`Open ${project.title}`}>
        <span className="scard__cover">
          <span className="scard__no">{String(i + 1).padStart(2, '0')}</span>
          <Art name={ART_FOR[project.category]} />
        </span>
        <span className="scard__body">
          <span className="chip">{project.category}</span>
          <strong>{project.title}</strong>
        </span>
      </Link>
    </motion.div>
  );
}

function WorkStack() {
  const ref = useRef(null);
  const n = projects.length;
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))));

  const go = (i) => {
    const el = ref.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (i / (n - 1)) * total, behavior: 'smooth' });
  };
  const now = projects[active];

  return (
    <section ref={ref} className="stack" style={{ height: `${n * 70 + 30}vh` }} aria-labelledby="work-title">
      <div className="stack__sticky">
        <div className="container stack__grid">
          <div className="stack__text">
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="sec-title">
              <Mask>
                Things I <span className="hl">made.</span>
              </Mask>
            </h2>

            <div className="stack__now" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={now.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="stack__cat">{now.category}</span>
                  <p className="hl">{now.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="stack__bar" aria-hidden="true">
              <motion.i style={{ scaleX: scrollYProgress }} />
            </div>
            <div className="stack__nav">
              <p className="stack__count">
                <b>{String(active + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}
              </p>
              <button type="button" className="icon-btn" onClick={() => go(Math.max(0, active - 1))} aria-label="Previous project">
                <Icon name="back" size={18} />
              </button>
              <button type="button" className="icon-btn" onClick={() => go(Math.min(n - 1, active + 1))} aria-label="Next project">
                <Icon name="arrow" size={18} />
              </button>
              <Link to="/projects" className="btn">
                All projects <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>

          <div className="stack__frame">
            <div className="stack__stage">
              {projects.map((p, i) => (
                <StackCard key={p.id} project={p} i={i} n={n} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ID_BARS = [...`${profile.name}${profile.fullName}2026`].map((c, i) => 1 + ((c.charCodeAt(0) + i) % 3));

/** The hero: a staff-style ID card that swings down on a lanyard when the site opens. Drag it around. */
function HeroCard() {
  let x = 0;
  return (
    <div className="hero__side" aria-label={`${profile.fullName}, portfolio ID card`}>
      <motion.div
        className="lanyard"
        initial={{ y: -620 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 10, mass: 1.1, delay: 0.25 }}
      >
        <span className="lanyard__strap" aria-hidden="true" />
        <span className="lanyard__clip" aria-hidden="true" />
        <div className="lanyard__swing">
          <motion.article
            className="idc"
            drag
            dragSnapToOrigin
            dragElastic={0.35}
            whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
          >
            <span className="idc__slot" aria-hidden="true" />
            <header className="idc__head">
              <span>Portfolio pass</span>
              <span>No. 0001</span>
            </header>

            <div className="idc__photo">
              {profile.photo ? <img src={profile.photo} alt="" draggable="false" /> : <span>{profile.initial}</span>}
            </div>

            <h2 className="idc__name">
              <span className="hl">{profile.name}</span> <span className="hl idc__last">{profile.fullName.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="idc__role">Developer · Designer · Singer</p>

            <dl className="idc__fields">
              <div>
                <dt>Class</dt>
                <dd>BSc CSIT</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>All areas</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="idc__open">Open to work</dd>
              </div>
            </dl>

            <svg className="idc__bars" viewBox={`0 0 ${ID_BARS.reduce((n, w) => n + w + 1.5, 0)} 20`} preserveAspectRatio="none" aria-hidden="true">
              {ID_BARS.map((w, i) => {
                const rect = <rect key={i} x={x} y="0" width={w} height="20" />;
                x += w + 1.5;
                return rect;
              })}
            </svg>
          </motion.article>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="home">
      {/* ---------- Hero ---------- */}
      <section className="hero container">
        <div className="hero__text">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Hi, I’m <span className="mark">{profile.name}</span> · BSc CSIT
          </motion.p>
          <h1 className="hero__title">
            {['I build.', 'I design.'].map((line, i) => (
              <motion.span
                key={line}
                className="hero__line"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              className="hero__line"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              I <span className="hl hero__sing">sing.</span>
            </motion.span>
          </h1>
          <p className="hero__lead">{profile.tagline}</p>
          <div className="hero__cta">
            <Link to="/projects" className="btn btn--violet btn--lg">
              See my work <Icon name="arrow" size={18} />
            </Link>
            <Link to="/contact" className="btn btn--ghost btn--lg">
              Say hello
            </Link>
          </div>
        </div>

        <HeroCard />
      </section>

      <Metrics />

      <Hats />

      {/* ---------- Featured work ---------- */}
      <WorkStack />

      {/* ---------- Experience ---------- */}
      <section className="xp container" aria-labelledby="xp-title">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 id="xp-title" className="sec-title">
            <Mask>
              Where I’ve <span className="hl">led</span> &amp; built.
            </Mask>
          </h2>
        </Reveal>
        <ol className="xp__list">
          {experience.map((x, i) => (
            <Reveal key={x.id} as="li" delay={i * 0.06}>
              <Link to="/experience" className="xp__row" style={{ '--tone': x.color }}>
                <span className="xp__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="xp__role">{x.role}</span>
                <span className="xp__org hl">{x.org}</span>
                <Icon name="arrow" size={22} className="xp__go" />
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- Skills logos ---------- */}
      <section className="skillstrip" aria-label="Tools I use">
        <div className="container skillstrip__head">
          <Reveal>
            <p className="eyebrow">Toolbox</p>
            <h2 className="sec-title">
              <Mask>
                Built with <span className="hl">these.</span>
              </Mask>
            </h2>
          </Reveal>
          <Link to="/skills" className="btn btn--ghost">
            All skills <Icon name="arrow" size={18} />
          </Link>
        </div>
        <Flow items={ALL_SKILLS.slice(0, HALF)} />
        <Flow items={ALL_SKILLS.slice(HALF)} reverse speed={54} />
      </section>

      {/* ---------- Terminal ---------- */}
      <section className="typing container" aria-labelledby="typing-title">
        <Reveal className="typing__text">
          <p className="eyebrow">For the curious</p>
          <h2 id="typing-title" className="sec-title">
            <Mask>
              Prefer <span className="hl">typing?</span>
            </Mask>
          </h2>
          <p>
            Everything on this site works from the command line too. Try <code>ls</code>, <code>cd skills</code>,{' '}
            <code>fortune</code> — or poke around for hidden badges.
          </p>
        </Reveal>
        <Terminal />
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="cta band band--ink">
        <div className="container cta__inner">
          <Reveal>
            <h2>
              <Mask>
                Let’s build <span className="hl">something.</span>
              </Mask>
            </h2>
            <div className="cta__row">
              <Link to="/contact" className="btn btn--lg">
                Start a conversation <Icon name="arrow" size={18} />
              </Link>
              <a className="cta__mail" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
