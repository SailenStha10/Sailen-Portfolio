import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { experience, projects } from '../../data/site';
import Poster from '../components/Poster';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

/** Splits a long role into two balanced rows so the whole title shows in the big heading. */
function titleRows(role) {
  const words = role.split(' ');
  if (role.length <= 14 || words.length < 2) return [words];
  let best = 1;
  let gap = Infinity;
  for (let k = 1; k < words.length; k++) {
    const d = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length);
    if (d < gap) { gap = d; best = k; }
  }
  return [words.slice(0, best), words.slice(best)];
}

export default function RoleCase() {
  const { id } = useParams();
  const i = experience.findIndex((e) => e.id === id);
  const [open, setOpen] = useState(null);
  useReveal();
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);
  if (i < 0) return <Navigate to="/experience" replace />;
  const e = experience[i];
  const next = experience[(i + 1) % experience.length];
  return (
    <div className="page role" style={{ '--c': e.color }}>
      <TLink className="back" to="/experience">← All experience</TLink>
      <FitLine hero rows={titleRows(e.role)} />
      <dl className="case__meta">
        <div><dt>Role</dt><dd>{e.role}</dd></div>
        <div><dt>Where</dt><dd>{e.org}</dd></div>
        <div><dt>Kind</dt><dd>{e.kind}</dd></div>
      </dl>

      <div className="role__grid">
        <section data-reveal>
          <h2 className="role__h">About the role</h2>
          <p className="role__desc">{e.description}</p>
        </section>
        <section data-reveal style={{ '--d': '.1s' }}>
          <h2 className="role__h">Work done</h2>
          <ol className="role__work">{e.work.map((w, n) => <li key={w}><b>{String(n + 1).padStart(2, '0')}</b>{w}</li>)}</ol>
        </section>
      </div>

      {(e.projects || e.designs) && (
        <>
          <h2 className="role__h role__h--proj" data-reveal>Work</h2>
          {e.projects && (
            <>
              {e.designs && <p className="role__sub" data-reveal>Development</p>}
              <ul className={`rproj ${e.projects.length === 1 && !e.designs ? 'rproj--solo' : ''}`}>
                {e.projects.map((id) => projects.find((p) => p.id === id)).filter(Boolean).map((p, n) => (
                  <li key={p.id} className="rproj__card" data-reveal style={{ '--d': `${n * 0.1}s` }}>
                    <a className="rproj__media" href={p.live} target="_blank" rel="noreferrer noopener" aria-label={`Open ${p.title}`}>
                      <Poster p={p} index={projects.indexOf(p)} />
                    </a>
                    <div className="rproj__body">
                      <h3>{p.title}</h3>
                      <p>{p.summary}</p>
                      <div className="rproj__links">
                        <a className="btn" href={p.live} target="_blank" rel="noreferrer noopener">Visit the project ↗</a>
                        <TLink className="rproj__more" to={`/work/${p.id}`}>Project page →</TLink>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {e.designs && (
            <>
              <p className="role__sub role__sub--gap" data-reveal>Design</p>
              <ul className="rdes">
                {e.designs.map((g, n) => (
                  <li key={g.caption} data-reveal style={{ '--d': `${n * 0.1}s` }}>
                    <button type="button" className="rdes__tile" onClick={() => setOpen(g)} aria-label={g.caption}>
                      <img src={g.src} alt="" loading="lazy" draggable="false" />
                    </button>
                    <span className="rdes__cap">{g.caption}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {e.gallery && (
        <>
          <h2 className="role__h role__h--gal" data-reveal>Gallery</h2>
          <ul className="rgal">
            {e.gallery.map((g, n) => (
              <li key={g.caption} className={`rgal__item rgal__item--${n % 6}`} data-reveal style={{ '--d': `${n * 0.08}s` }}>
                <button type="button" onClick={() => g.src && setOpen(g)} aria-label={g.caption}>
                  {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
                  <b>{g.caption}</b>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <TLink className="next" to={`/experience/${next.id}`}>
        <span>Next role</span>
        <b>{next.role} →</b>
      </TLink>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <figure><img src={open.src} alt={open.caption} /><figcaption>{open.caption}</figcaption></figure>
        </div>
      )}
    </div>
  );
}
