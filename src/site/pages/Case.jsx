import { Navigate, useParams } from 'react-router-dom';
import { projects } from '../../data/site';
import FitLine from '../components/FitLine';
import Poster from '../components/Poster';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

export default function Case() {
  const { id } = useParams();
  const i = projects.findIndex((p) => p.id === id);
  useReveal();
  if (i < 0) return <Navigate to="/work" replace />;
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const rows = [
    ['Brief', p.summary],
    ['What I did', p.description],
    ['Built with', p.tags.join(', ')],
  ];
  return (
    <div className="page case">
      <TLink className="back" to="/work">← All work</TLink>
      <FitLine hero rows={[p.title.split(' ').length > 1 ? [p.title.split(' ')[0], p.title.split(' ').slice(1).join(' ')] : [p.title]]} />
      <dl className="case__meta">
        <div><dt>Type</dt><dd>{p.category}</dd></div>
        <div><dt>Role</dt><dd>Design + development</dd></div>
        <div><dt>Project</dt><dd>{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</dd></div>
      </dl>
      <div className="case__hero" data-reveal><Poster p={p} index={i} /></div>
      <div className="case__rows">
        {rows.map(([k, v], n) => (
          <div key={k} className="case__row" data-reveal style={{ '--d': `${n * 0.08}s` }}>
            <h2>{k}</h2>
            <p>{v}</p>
          </div>
        ))}
      </div>
      <div className="case__links" data-reveal>
        <a className="btn" href={p.live}>Live site ↗</a>
        <a className="btn btn--ghost" href={p.code}>Source ↗</a>
      </div>
      <TLink className="next" to={`/work/${next.id}`}>
        <span>Next project</span>
        <b>{next.title} →</b>
      </TLink>
    </div>
  );
}
