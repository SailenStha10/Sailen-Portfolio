import { experience, profile, skillGroups } from '../../data/site';
import FitLine from '../components/FitLine';
import ReadingText from '../components/ReadingText';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';
import { VALUES } from '../content';

export default function About() {
  useReveal();
  return (
    <div className="page">
      <FitLine hero rows={[['About', profile.name]]} />
      <div className="about__grid">
        <div className="about__portrait" data-reveal>
          {profile.photo ? <img src={profile.photo} alt={profile.fullName} /> : <span>{profile.initial}</span>}
        </div>
        <div>
          <ReadingText className="reading--lg" text={`${profile.tagline} I like the point where logic meets taste: a clean API, a tight layout, a song that lands.`} />
          <dl className="facts" data-reveal>
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Studying</dt><dd>BSc CSIT</dd></div>
            <div><dt>Roles</dt><dd>{profile.roles.join(', ')}</dd></div>
            <div><dt>Elsewhere</dt><dd>{profile.socials.map((s, i) => <span key={s.label}>{i > 0 && ', '}<a href={s.href}>{s.label}</a></span>)}</dd></div>
          </dl>
        </div>
      </div>

      <h2 className="h2" data-reveal>Toolbox</h2>
      <div className="tools">
        {skillGroups.map((g, i) => (
          <div key={g.id} className="tools__group" data-reveal style={{ '--d': `${i * 0.1}s` }}>
            <h3>{g.word}</h3>
            <div className="chips">{g.skills.map((s) => <span key={s.name}>{s.name}</span>)}</div>
          </div>
        ))}
      </div>

      <h2 className="h2" data-reveal>Experience</h2>
      <ol className="rows">
        {experience.map((e, i) => (
          <li key={e.id} className="row" data-reveal style={{ '--d': `${i * 0.06}s` }}>
            <span className="row__no">{String(i + 1).padStart(2, '0')}</span>
            <div><h3>{e.role}</h3><p>{e.org}</p></div>
            <span className="row__aside">{e.kind}</span>
          </li>
        ))}
      </ol>

      <h2 className="h2" data-reveal>Working together</h2>
      <ul className="values">
        {VALUES.map((v, i) => (
          <li key={v.title} data-reveal style={{ '--d': `${i * 0.1}s` }}>
            <h3>{v.title}</h3><p>{v.text}</p>
          </li>
        ))}
      </ul>
      <TLink className="textlink" to="/contact">Let’s work together →</TLink>
    </div>
  );
}
