import { profile } from '../../data/site';
import FitLine from '../components/FitLine';
import IdCard from '../components/IdCard';
import ReadingText from '../components/ReadingText';
import Socials from '../components/Socials';
import { TLink } from '../components/nav';
import OffClock from '../components/OffClock';
import ToolHeap from '../components/ToolHeap';
import useReveal from '../components/useReveal';
import { NOW, OFF_CLOCK, STORY, STORY_LEAD } from '../content';

export default function About() {
  useReveal();
  return (
    <div className="page">
      <FitLine hero rows={[['About', profile.name]]} />
      <div className="about__grid">
        <IdCard />
        <div>
          <ReadingText className="reading--lg" text={`${profile.tagline} I like the point where logic meets taste: a clean API, a tight layout, a song that lands.`} />
          <dl className="facts" data-reveal>
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Studying</dt><dd>BSc CSIT</dd></div>
            <div><dt>Roles</dt><dd>{profile.roles.join(', ')}</dd></div>
            <div><dt>Elsewhere</dt><dd><Socials variant="pill" /></dd></div>
          </dl>
          <div className="now" data-reveal>
            <p className="label">Right now</p>
            <ul>
              {NOW.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}
            </ul>
          </div>
        </div>
      </div>

      <section className="tale">
        <p className="label" data-reveal>My story</p>
        <div className="tale__grid">
          <ReadingText className="reading--md tale__lead" text={STORY_LEAD} />
          <div className="tale__body">
            {STORY.map((t, i) => <p key={i} data-reveal style={{ '--d': `${i * 0.08}s` }}>{t}</p>)}
          </div>
        </div>
      </section>

      <div className="bighead"><FitLine rows={[['Off the', 'clock']]} /></div>
      <OffClock items={OFF_CLOCK} />

      <div className="bighead"><FitLine rows={[['The', 'toolbox']]} /></div>
      <ToolHeap />


      <section className="xcta">
        <FitLine rows={[['See my', 'experience']]} />
        <div className="xcta__row">
          <p data-reveal>Clubs I have led, teams I have worked with and the products I have helped build. The full list of roles is on one page.</p>
          <div className="xcta__btns" data-reveal style={{ '--d': '.12s' }}>
            <TLink className="btn btn--lg" to="/experience">See my experience →</TLink>
            <TLink className="btn btn--ghost btn--lg" to="/contact">Get in touch</TLink>
          </div>
        </div>
      </section>
    </div>
  );
}
