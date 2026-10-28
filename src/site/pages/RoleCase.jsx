import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { experience } from '../../data/site';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

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
      <FitLine hero rows={[[e.role.length > 22 ? e.role.split(' ')[0] : e.role]]} />
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

      <h2 className="role__h role__h--gal" data-reveal>Gallery</h2>
      <ul className="rgal">
        {e.gallery.map((g, n) => (
          <li key={g.caption} className={`rgal__item rgal__item--${n % 4}`} data-reveal style={{ '--d': `${n * 0.08}s` }}>
            <button type="button" onClick={() => g.src && setOpen(g)} aria-label={g.caption}>
              {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
              <b>{g.caption}</b>
            </button>
          </li>
        ))}
      </ul>

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
