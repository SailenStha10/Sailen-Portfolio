import { experience, skillGroups } from '../../data/site';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

export default function Experience() {
  useReveal();
  const kinds = [...new Set(experience.map((e) => e.kind))];
  return (
    <div className="page">
      <FitLine hero rows={[['My', 'experience']]} />
      <p className="lede" data-reveal>Leading clubs, building products and designing for real people. Every role taught me something the classroom did not.</p>
      <ul className="stats stats--row" data-reveal>
        <li><b>{String(experience.length).padStart(2, '0')}</b><span>Roles held</span></li>
        <li><b>{String(kinds.length).padStart(2, '0')}</b><span>Kinds of work</span></li>
        <li><b>{String(skillGroups.reduce((n, g) => n + g.skills.length, 0))}</b><span>Tools and skills</span></li>
      </ul>
      <ol className="rows">
        {experience.map((e, i) => (
          <li key={e.id} className="row" data-reveal style={{ '--d': `${i * 0.06}s` }}>
            <span className="row__no">{String(i + 1).padStart(2, '0')}</span>
            <div><h3>{e.role}</h3><p>{e.org}</p></div>
            <span className="row__aside">{e.kind}</span>
          </li>
        ))}
      </ol>
      <h2 className="h2" data-reveal>Kinds of work</h2>
      <div className="tools">
        {kinds.map((k, i) => (
          <div key={k} className="tools__group" data-reveal style={{ '--d': `${i * 0.1}s` }}>
            <h3>{k}</h3>
            <ul className="mini">
              {experience.filter((e) => e.kind === k).map((e) => <li key={e.id}><b>{e.role}</b><span>{e.org}</span></li>)}
            </ul>
          </div>
        ))}
      </div>

      <section className="xcta">
        <FitLine rows={[['Work', 'with me']]} />
        <div className="xcta__row">
          <p data-reveal>Leading a club, shipping a feature or designing a poster: I like jobs where I can build and design from the same hands. Tell me what you have in mind and I will reply the same day.</p>
          <div className="xcta__btns" data-reveal style={{ '--d': '.12s' }}>
            <TLink className="btn btn--lg" to="/contact">Start a project →</TLink>
            <TLink className="btn btn--ghost btn--lg" to="/work">See my work</TLink>
          </div>
        </div>
      </section>
    </div>
  );
}
