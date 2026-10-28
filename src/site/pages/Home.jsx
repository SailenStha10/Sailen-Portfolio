import { useEffect, useRef } from 'react';
import { experience, profile, projects, skillGroups } from '../../data/site';
import FitLine from '../components/FitLine';
import Badges from '../components/Badges';
import ToolHeap from '../components/ToolHeap';
import HeroPortrait from '../components/HeroPortrait';
import SelectedWork from '../components/SelectedWork';
import ReadingText from '../components/ReadingText';
import { TLink } from '../components/nav';
import Socials from '../components/Socials';
import ValueList from '../components/ValueList';
import useReveal from '../components/useReveal';
import { VALUES } from '../content';

const HERO_ROLES = ['Full Stack Developer', 'UI/UX Designer', 'Graphic Designer', 'Singer'];

function Hero() {
  return (
    <section className="hero">
      <p className="hero__eyebrow rise" style={{ '--d': '0.2s' }}>
        <i className="dot" /> Available for new projects · {profile.location}
      </p>
      <div className="hero__stage">
        <FitLine hero className="hero__name" as="h1" rows={[[profile.name]]} />
        <div className="hero__grid">
          <p className="hero__tag rise" style={{ '--d': '0.9s' }}>
            Developer and designer for sites with <em>personality</em>.
          </p>
          <HeroPortrait />
          <div className="hero__side rise" style={{ '--d': '1s' }}>
            <ul className="hero__roles">{HERO_ROLES.map((r) => <li key={r}>{r}</li>)}</ul>
            <div className="hero__cta">
              <TLink className="btn" to="/contact">
                <span className="avatar">{profile.initial}</span> Let’s work together
              </TLink>
              <TLink className="btn btn--ghost" to="/work">See my work</TLink>
            </div>
          </div>
        </div>
        <Badges />
      </div>
      <div className="marquee rise" style={{ '--d': '1.1s' }} aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>{profile.roles.map((r) => <b key={r + k}>{r}<i className="sep" /></b>)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="block statement">
      <p className="label">Approach</p>
      <ReadingText text="I design and build websites that feel like the person behind them. Careful type, honest code and motion that earns its place from the first sketch to the last deploy." />
    </section>
  );
}

function AboutTeaser() {
  return (
    <section className="block about-teaser">
      <FitLine rows={[['About', profile.name]]} />
      <ReadingText
        className="reading--md"
        text={`${profile.tagline} I study BSc CSIT in ${profile.location} and spend the rest of my time building web apps, designing interfaces and posters and singing. Code gives me structure, design gives me taste and music gives me nerve.`}
      />
      <div className="about-actions">
        <TLink className="more" to="/about">
          <span>More about me</span>
          <i aria-hidden="true">→</i>
        </TLink>
        <Socials variant="round" />
      </div>
    </section>
  );
}

function ExperienceTeaser() {
  return (
    <section className="block">
      <FitLine rows={[['My', 'experience']]} />
      <ol className="rows">
        {experience.map((e, i) => (
          <li key={e.id} className="row" data-reveal style={{ '--d': `${i * 0.06}s` }}>
            <span className="row__no">{String(i + 1).padStart(2, '0')}</span>
            <div><h3>{e.role}</h3><p>{e.org}</p></div>
            <span className="row__aside">{e.kind}</span>
          </li>
        ))}
      </ol>
      <TLink className="more more--block" to="/experience" data-reveal>
        <span>Full experience</span>
        <i aria-hidden="true">→</i>
      </TLink>
    </section>
  );
}

function Toolbox() {
  return (
    <section className="block toolbox">
      <FitLine rows={[['The', 'toolbox']]} />
      <ToolHeap />
    </section>
  );
}

function Values() {
  return (
    <section className="block">
      <FitLine rows={[['How I', 'work']]} />
      <ValueList items={VALUES} />
    </section>
  );
}

function CTA() {
  return (
    <section className="block cta">
      <FitLine rows={[['Let’s', 'talk']]} />
      <p data-reveal>Have a project in mind? Tell me about it and I’ll reply the same day.</p>
      <TLink className="btn btn--lg" to="/contact" data-reveal style={{ '--d': '.15s' }}>Start a project →</TLink>
    </section>
  );
}

export default function Home() {
  useReveal();
  return (
    <>
      <Hero />
      <SelectedWork items={projects.filter((p) => p.featured)} />
      <Statement />
      <AboutTeaser />
      <ExperienceTeaser />
      <Toolbox />
      <Values />
      <CTA />
    </>
  );
}

