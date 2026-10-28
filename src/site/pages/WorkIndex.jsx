import { useEffect, useRef, useState } from 'react';
import { experience, projects } from '../../data/site';
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
          <a className="btn btn--ghost" href={p.code} target="_blank" rel="noreferrer noopener">Source code</a>
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
      <Poster p={{ accent: d.color, category: d.cat, title: d.title }} index={DESIGNS.indexOf(d)} />
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
      <div className="pop__cover" style={{ '--ar': '4 / 3' }}><Poster p={{ accent: d.color, category: d.cat, title: d.title }} index={DESIGNS.indexOf(d)} /></div>
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

/* ---------- Leadership & community: photos stacked as a pyramid, the leader at the top ---------- */

const PYRAMID = [
  [['leo', 0]],
  [['rotaract', 0], ['csit', 0]],
  [['leo', 1], ['rotaract', 1], ['csit', 1]],
];

function Leadership() {
  const last = PYRAMID.length - 1;
  return (
    <section className="lead">
      <header className="chap">
        <span className="chap__no">04</span>
        <h2>Leadership &amp; community</h2>
      </header>
      <div className="pyr">
        {PYRAMID.map((row, r) => (
          <ul key={r} className={`pyr__row pyr__row--${r}`}>
            {row.map(([id, n], k) => {
              const e = experience.find((x) => x.id === id);
              const g = e.gallery[n];
              return (
                <li key={id + n} data-reveal style={{ '--d': `${(last - r) * 0.18 + k * 0.08}s`, '--c': e.color, '--r': `${(k - (row.length - 1) / 2) * 2.4}deg` }}>
                  <TLink className="pyr__photo" to={`/experience/${e.id}`} aria-label={`${e.role}, ${e.org}`}>
                    {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
                    <span className="pyr__cap"><b>{r === 0 ? e.role : e.org}</b><small>{r === 0 ? e.org : g.caption}</small></span>
                  </TLink>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </section>
  );
}

export default function WorkIndex() {
  useReveal();
  const [proj, setProj] = useState(null);
  const [design, setDesign] = useState(null);
  const tracks = useRef([]);
  const dev = projects.filter((p) => p.category === 'Development').slice(0, 4);

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

      {proj && <ProjectPop p={proj} onClose={() => setProj(null)} />}
      {design && <DesignPop d={design} onClose={() => setDesign(null)} />}
    </div>
  );
}
