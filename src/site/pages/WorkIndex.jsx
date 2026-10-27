import { projects } from '../../data/site';
import FitLine from '../components/FitLine';
import Poster from '../components/Poster';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';
import { useState } from 'react';

const CATS = ['All', 'Development', 'Design', 'Music'];

export default function WorkIndex() {
  const [cat, setCat] = useState('All');
  useReveal();
  const list = projects.filter((p) => cat === 'All' || p.category === cat);
  return (
    <div className="page">
      <FitLine hero rows={[['Selected', 'work']]} />
      <div className="filters" role="tablist">
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <ul className="grid">
        {list.map((p, i) => (
          <li key={p.id} className="gcard" data-reveal style={{ '--d': `${(i % 2) * 0.1}s` }}>
            <TLink to={`/work/${p.id}`}>
              <div className="gcard__media"><Poster p={p} index={projects.indexOf(p)} /></div>
              <div className="gcard__meta">
                <h3>{p.title}</h3>
                <span>{[p.category, ...p.tags.slice(0, 2)].join(' / ')}</span>
              </div>
              <p>{p.summary}</p>
            </TLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
