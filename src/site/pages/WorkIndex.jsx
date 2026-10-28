import { useEffect, useRef, useState } from 'react';
import { experience, projects } from '../../data/site';
import FitLine from '../components/FitLine';
import Poster from '../components/Poster';
import SelectedWork from '../components/SelectedWork';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';
import { DESIGNS, GALLERY, SING } from '../content';

const clamp = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => 1 - Math.pow(1 - t, 3);
const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

/** Centered popup. Closes on Escape, the backdrop or the close button. */
function Modal({ onClose, label, children }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', esc); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="pop" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div className="pop__card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pop__x" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}

/**
 * Scroll-driven doorway. A small window sits in the middle of the screen; as you scroll it grows until
 * you are inside it and the next chapter fills the screen. `from` is the colour of what you are leaving.
 * `onScroll(progress, scrollLength)` lets the content inside react to the same scroll.
 */
function Portal({ tone, from, label, onScroll, children }) {
  const outer = useRef(null);
  const win = useRef(null);
  const inner = useRef(null);
  const cap = useRef(null);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = outer.current.getBoundingClientRect();
      const total = r.height - innerHeight;
      const prog = clamp(-r.top / total);
      const open = still ? 1 : ease(clamp(-r.top / (total * 0.4)));
      const narrow = innerWidth < 720;
      const iy = lerp(narrow ? 30 : 26, 0, open);
      const ix = lerp(narrow ? 14 : 33, 0, open);
      win.current.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${lerp(28, 0, open)}px)`;
      inner.current.style.transform = `scale(${lerp(1.3, 1, open)})`;
      cap.current.style.opacity = String(clamp(1 - open * 2.2));
      onScroll?.(prog, total);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [onScroll]);

  return (
    <div className={`portal portal--${tone}`} ref={outer} style={{ '--from': from }}>
      <div className="portal__stick">
        <p className="portal__cap" ref={cap}><b>{label}</b></p>
        <div className="portal__win" ref={win}>
          <div className="portal__in" ref={inner}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Development: the same pinned-title scroll as the home page; a card opens its popup ---------- */

function ProjectPop({ p, onClose }) {
  return (
    <Modal onClose={onClose} label={p.title}>
      <div className="pop__cover" style={{ '--c': p.accent }}><Poster p={p} index={projects.indexOf(p)} /></div>
      <div className="pop__body">
        <span className="pop__kicker">{p.category}</span>
        <h3>{p.title}</h3>
        <p>{p.summary} {p.description}</p>
        <ul className="pop__tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        <div className="pop__links">
          <a className="btn" href={p.live} target="_blank" rel="noreferrer noopener">Live project ↗</a>
          {p.code && p.code !== '#' && <a className="btn btn--ghost" href={p.code} target="_blank" rel="noreferrer noopener">Source code</a>}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Design: columns that ride the scroll; tiles tilt and open ---------- */

function Tile({ d, onOpen }) {
  const ref = useRef(null);
  const tilt = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.05)`;
  };
  const rest = () => { ref.current.style.transform = ''; };
  return (
    <button type="button" className="dtile" ref={ref} style={{ '--ar': d.ar }} onMouseMove={tilt} onMouseLeave={rest} onClick={() => onOpen(d)} aria-label={`Open ${d.title}`}>
      <Poster p={{ accent: d.color, category: d.cat, title: d.title, image: d.image, fit: true }} index={DESIGNS.indexOf(d)} />
      <span className="dtile__hint" aria-hidden="true">Open</span>
    </button>
  );
}

const SPEED = [0.85, 1.25, 1.05];

function DesignColumns({ tracks, onOpen }) {
  const cols = [0, 1, 2].map((c) => DESIGNS.filter((_, i) => i % 3 === c));
  return (
    <div className="dcols">
      {cols.map((items, c) => (
        <div key={c} className="dcol">
          <div className="dcol__track" ref={(el) => { tracks.current[c] = el; }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].flatMap((rep) => items.map((d) => <Tile key={`${d.title}-${rep}`} d={d} onOpen={onOpen} />))}
          </div>
        </div>
      ))}
      <h2 className="dcols__title" aria-hidden="true"><span>Design</span></h2>
    </div>
  );
}

function DesignPop({ d, onClose }) {
  return (
    <Modal onClose={onClose} label={d.title}>
      <div className="pop__cover pop__cover--img"><img src={d.image} alt={d.title} draggable="false" /></div>
      <div className="pop__body">
        <span className="pop__kicker">{d.cat}</span>
        <h3>{d.title}</h3>
        <p>{d.text}</p>
        {d.id && <div className="pop__links"><TLink className="btn" to={`/work/${d.id}`}>See the project →</TLink></div>}
      </div>
    </Modal>
  );
}

/* ---------- Singing ---------- */

function SingHero() {
  return (
    <div className="sing__hero">
      <h2>Sing<em>ing</em></h2>
      <svg className="sing__wave" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="sing__wave--a" d={wave(34, 0)} />
      </svg>
    </div>
  );
}
function wave(amp, k) {
  let d = `M0 60 `;
  for (let x = 0; x < 2400; x += 150) d += `Q ${x + 75} ${60 + (((x / 150 + k) % 2) ? amp : -amp)} ${x + 150} 60 `;
  return d;
}

function Video({ v, style }) {
  const [on, setOn] = useState(false);
  const vid = useRef(null);
  const start = () => { setOn(true); vid.current?.play().catch(() => {}); };
  const stop = () => { setOn(false); if (vid.current) { vid.current.pause(); vid.current.currentTime = 0; } };
  const body = (
    <>
      {v.src && <video ref={vid} src={v.src} muted loop playsInline preload="metadata" />}
      {on && v.yt && !v.src && <iframe src={`https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.yt}`} title={v.title} allow="autoplay; encrypted-media" />}
      <span className="vid__disc" aria-hidden="true"><i /></span>
      <span className="vid__play" aria-hidden="true"><i /></span>
      <span className="vid__eq" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
      <span className="vid__cap"><b>{v.title}</b><small>{v.note}</small></span>
    </>
  );
  return (
    <li className="mess mess--vid" data-playing={on || undefined} style={style} data-reveal onMouseEnter={start} onMouseLeave={stop} onFocus={start} onBlur={stop}>
      <a className="vid" href={v.href} target="_blank" rel="noreferrer noopener" aria-label={`Watch ${v.title}`}>{body}</a>
    </li>
  );
}

/* position of each piece in the pile: left / top / width in %, tilt in degrees */
const PILE = [
  { l: 2, t: 2, w: 40, r: -3 },
  { l: 47, t: 0, w: 22, r: 4 },
  { l: 58, t: 21, w: 38, r: 2.5 },
  { l: 6, t: 35, w: 24, r: -5 },
  { l: 24, t: 60, w: 40, r: -1.5 },
  { l: 69, t: 57, w: 24, r: 5 },
];

function Singing() {
  const photos = SING.photos.map((id) => GALLERY.find((g) => g.id === id)).filter(Boolean);
  const order = [SING.videos[0], photos[0], SING.videos[1], photos[1], SING.videos[2], photos[2]];
  return (
    <section className="sing">
            <ul className="pile">
        {order.map((it, i) => {
          const P = PILE[i];
          const style = { '--l': `${P.l}%`, '--t': `${P.t}%`, '--w': `${P.w}%`, '--r': `${P.r}deg`, '--z': i % 2 ? 2 : 1, '--bob': `${5 + (i % 3)}s`, '--d': `${i * 0.12}s` };
          if (it.title && it.href) return <Video key={it.title} v={it} style={style} />;
          return (
            <li key={it.id} className="mess mess--photo" style={{ ...style, '--c': it.color }} data-reveal>
              {it.src ? <img src={it.src} alt={it.caption} loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
              <b>{it.caption}</b>
            </li>
          );
        })}
      </ul>
      <div className="sing__links-wrap">
        <p className="sing__label" data-reveal>Find the music</p>
        <ul className="sing__links">
          {SING.links.map((l, i) => (
            <li key={l.label} data-reveal style={{ '--d': `${i * 0.07}s` }}>
              <a href={l.href} target="_blank" rel="noreferrer noopener">
                <span className="sing__no">{String(i + 1).padStart(2, '0')}</span>
                <b>{l.label}</b>
                <span className="sing__note">{l.note}</span>
                <i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Leadership & community: one row per role, an arrow carrying its photos to the right ---------- */

const ROWS = [
  { id: 'leo', kicker: 'Leading' },
  { id: 'rotaract', kicker: 'Organising' },
  { id: 'csit', kicker: 'Connecting' },
];

/** One role: its title above, then every photo from its gallery travelling along an arrow. Scrolls sideways when there are many. */
function LeadRow({ row, n }) {
  const ref = useRef(null);
  const scroller = useRef(null);
  const [seen, setSeen] = useState(false);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(ref.current);
    const check = () => setMore(scroller.current.scrollWidth > scroller.current.clientWidth + 4);
    check();
    addEventListener('resize', check);
    return () => { io.disconnect(); removeEventListener('resize', check); };
  }, []);
  const e = experience.find((x) => x.id === row.id);
  const nudge = (dir) => scroller.current.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <li className={`lrow ${row.id === 'leo' ? 'lrow--dark' : ''} ${row.id === 'rotaract' ? 'lrow--tint' : ''} ${seen ? 'is-in' : ''}`} ref={ref} style={{ '--c': e.color }}>
      <header className="lrow__head">
        <div>
          <span className="lrow__no">{String(n + 1).padStart(2, '0')} · {row.kicker}</span>
          <h3>{e.role}</h3>
          <p>{e.org}</p>
        </div>
        <div className="lrow__tools">
          {more && (
            <>
              <button type="button" className="icon-btn" onClick={() => nudge(-1)} aria-label="Scroll left">←</button>
              <button type="button" className="icon-btn" onClick={() => nudge(1)} aria-label="Scroll right">→</button>
            </>
          )}
          <TLink className="lrow__go" to={`/experience/${e.id}`}>See the work →</TLink>
        </div>
      </header>
      <div className="lrow__body">
      <div className="lrow__scroll" ref={scroller}>
        <ul className="lrow__shots">
          {e.gallery.map((g, k) => (
            <li key={g.caption} style={{ '--k': k, '--m': e.gallery.length, '--r': `${k % 2 ? 1.8 : -1.8}deg` }}>
              <TLink className="lrow__photo" to={`/experience/${e.id}`} aria-label={`${e.role}: ${g.caption}`}>
                {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
                <span className="lrow__idx">{String(k + 1).padStart(2, '0')}</span>
                <span className="lrow__cap">{g.caption}</span>
              </TLink>
            </li>
          ))}
        </ul>
      </div>
      {e.figure && <img className="lrow__fig" src={e.figure} alt="" draggable="false" />}
      </div>
    </li>
  );
}

function Leadership() {
  return (
    <section className="lead">
      <p className="lead__no" data-reveal>04</p>
      <FitLine rows={[['Leadership', '& community']]} />
      <ol className="lrows">
        {ROWS.map((r, n) => <LeadRow key={r.id} row={r} n={n} />)}
      </ol>
    </section>
  );
}

export default function WorkIndex() {
  useReveal();
  const [proj, setProj] = useState(null);
  const [design, setDesign] = useState(null);
  const tracks = useRef([]);
  const dev = projects.filter((p) => p.category === 'Development');

  // the design columns ride the page scroll: scroll down and they move up
  const ride = useRef((prog, total) => {
    tracks.current.forEach((el, c) => { if (el) el.style.transform = `translate3d(0, ${(-prog * total * SPEED[c]).toFixed(1)}px, 0)`; });
  }).current;

  return (
    <div className="page work-page">
            <SelectedWork items={dev} title="" word="Development" onOpen={setProj} />

      <Portal tone="design" from="var(--bg)" label="02 · Design" onScroll={ride}>
        <DesignColumns tracks={tracks} onOpen={setDesign} />
      </Portal>

      <Portal tone="sing" from="var(--ink)" label="03 · Singing">
        <SingHero />
      </Portal>
      <Singing />
      <Leadership />

      <section className="xcta xcta--work">
        <FitLine rows={[['See the', 'experience']]} />
        <div className="xcta__row">
          <p data-reveal>The clubs I have led and the teams I have built with, role by role, with the work behind each one.</p>
          <div className="xcta__btns" data-reveal style={{ '--d': '.12s' }}>
            <TLink className="btn btn--lg" to="/experience">See the experience →</TLink>
            <TLink className="btn btn--ghost btn--lg" to="/contact">Get in touch</TLink>
          </div>
        </div>
      </section>

      {proj && <ProjectPop p={proj} onClose={() => setProj(null)} />}
      {design && <DesignPop d={design} onClose={() => setDesign(null)} />}
    </div>
  );
}
