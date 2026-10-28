import { experience } from '../../data/site';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';

const GROUPS = [
  { id: 'community', no: '01', title: 'Community & leadership', blurb: 'Clubs and associations where I lead, organise and represent.' },
  { id: 'technical', no: '02', title: 'Technical experience', blurb: 'Teams where I build and design real products.' },
];

/** The portrait on a card follows the pointer: it leans toward it while the disc behind slides the other way. */
const look = (ev) => {
  const r = ev.currentTarget.getBoundingClientRect();
  ev.currentTarget.style.setProperty('--fx', (((ev.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  ev.currentTarget.style.setProperty('--fy', (((ev.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
};
const rest = (ev) => { ev.currentTarget.style.setProperty('--fx', 0); ev.currentTarget.style.setProperty('--fy', 0); };

function Role({ e, n, i }) {
  return (
    <li data-reveal style={{ '--d': `${i * 0.08}s`, '--c': e.color, ...(e.hover ? { '--hv': e.hover, '--hvt': '#fff' } : {}), ...(e.figW ? { '--fw': e.figW } : {}) }}>
      <TLink className={`xrole ${e.figure ? 'xrole--fig' : ''} ${e.hover ? 'xrole--hv' : ''} ${e.float ? 'xrole--float' : ''}`} to={`/experience/${e.id}`} {...(e.figure ? { onMouseMove: look, onMouseLeave: rest } : {})}>
        <span className="xrole__no">{String(n).padStart(2, '0')}</span>
        {e.group === 'community' && <span className="xrole__kind">{e.kind}</span>}
        <h4>{e.role}</h4>
        <p className="xrole__org">{e.org}</p>
        <p className="xrole__sum">{e.summary}</p>
        {e.figure && <span className="xrole__fig" aria-hidden="true"><img src={e.figure} alt="" draggable="false" /></span>}
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
            <ul className={`xgroup__grid xgroup__grid--${g.id === 'community' && roles.length === 3 ? 'pyr' : roles.length}`}>
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
