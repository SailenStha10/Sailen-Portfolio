import { experience } from '../../data/site';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

const GROUPS = [
  { id: 'community', no: '01', title: 'Community & leadership', blurb: 'Clubs and associations where I lead, organise and represent.' },
  { id: 'technical', no: '02', title: 'Technical experience', blurb: 'Teams where I build and design real products.' },
];

function Role({ e, n, i }) {
  return (
    <li data-reveal style={{ '--d': `${i * 0.08}s`, '--c': e.color }}>
      <TLink className="xrole" to={`/experience/${e.id}`}>
        <span className="xrole__no">{String(n).padStart(2, '0')}</span>
        <span className="xrole__kind">{e.kind}</span>
        <h4>{e.role}</h4>
        <p className="xrole__org">{e.org}</p>
        <p className="xrole__sum">{e.summary}</p>
        <span className="xrole__go">See the work <i aria-hidden="true">→</i></span>
      </TLink>
    </li>
  );
}

export default function Experience() {
  useReveal();
  return (
    <div className="page">
      <FitLine hero rows={[['My', 'experience']]} />
      <p className="lede" data-reveal>Leading clubs, building products and designing for real people. Every role taught me something the classroom did not.</p>
      {GROUPS.map((g) => {
        const roles = experience.filter((e) => e.group === g.id);
        return (
          <section key={g.id} className="xgroup">
            <header className="xgroup__head" data-reveal>
              <span className="xgroup__no">{g.no}</span>
              <h2>{g.title}</h2>
            </header>
            <ul className={`xgroup__grid xgroup__grid--${roles.length}`}>
              {roles.map((e, i) => <Role key={e.id} e={e} i={i} n={experience.indexOf(e) + 1} />)}
            </ul>
          </section>
        );
      })}

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
