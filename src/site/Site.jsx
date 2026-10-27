import { useEffect, useState } from 'react';
import { profile, projects, experience } from '../data/site';

const NAV = [
  { href: '#work', label: 'Work', count: projects.length },
  { href: '#services', label: 'Services' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
];

const SERVICES = [
  { title: 'Website build', text: 'A responsive React site, built from your design or from scratch, ready to edit and deploy.', time: 'Typically 1–2 weeks' },
  { title: 'UI / UX design', text: 'Research, wireframes and a clickable Figma prototype with a small design system.', time: 'Typically 1 week' },
  { title: 'Graphics & brand', text: 'Posters, logos and social artwork with a clear typographic voice.', time: 'Typically 3–5 days' },
];

const VALUES = [
  { title: 'Design with personality', text: 'Sites that feel like the people behind them, not a template.' },
  { title: 'One person, start to finish', text: 'Design and code from the same hands, so nothing is lost in handoff.' },
  { title: 'Yours to edit', text: 'Clean, data-driven code you can change without calling me.' },
  { title: 'Quick, clear replies', text: 'Plain answers, honest timelines, no disappearing acts.' },
];

const pad = (n) => String(n + 1).padStart(2, '0');

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > last && y > 240);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--progress', max > 0 ? y / max : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`hd ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <span className="progress" />
      <a className="hd__logo" href="#top">©{profile.name}</a>
      <nav className="hd__nav" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
            {n.count && <sup>{n.count}</sup>}
          </a>
        ))}
      </nav>
      <a className="btn btn--sm" href="#contact">Get in touch</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <h1 className="hero__name">
        <span className="mask"><span className="mask__in" style={{ '--d': '0.1s' }}>{profile.name}</span></span>
        <span className="hero__thumbs" aria-hidden="true">
          {projects.slice(0, 5).map((p, i) => (
            <i key={p.id} style={{ background: p.accent, '--d': `${0.5 + i * 0.09}s` }} />
          ))}
        </span>
        <span className="mask"><span className="mask__in" style={{ '--d': '0.25s' }}>{profile.fullName.split(' ').slice(1).join(' ')}</span></span>
      </h1>
      <div className="hero__row rise" style={{ '--d': '0.7s' }}>
        <p className="hero__tag">
          Developer and designer for sites with <em>personality</em>.
        </p>
        <div className="hero__cta">
          <a className="btn" href="#contact">
            <span className="avatar">{profile.initial}</span> Let’s work together
          </a>
          <a className="btn btn--ghost" href="#work">See my work ↓</a>
        </div>
      </div>
      <div className="marquee rise" style={{ '--d': '0.9s' }} aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>{profile.roles.map((r) => <b key={r + k}>{r} <i>✺</i></b>)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="sec" id="work">
      <div className="sec__head" data-reveal>
        <h2>Selected work</h2>
        <span className="sec__count">({String(projects.length).padStart(2, '0')})</span>
      </div>
      <ol className="work">
        {projects.map((p, i) => (
          <li key={p.id} className="work__item" data-reveal>
            <a className="work__link" href={p.live}>
              <div className="poster" style={{ background: p.accent }}>
                <span className="poster__no">{pad(i)}</span>
                <span className="poster__title">{p.title}</span>
              </div>
              <div className="work__body">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <span className="work__tags">{[p.category, ...p.tags].join(' / ')}</span>
                <span className="work__view">View case →</span>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Services() {
  return (
    <section className="sec" id="services">
      <div className="sec__head" data-reveal>
        <h2>What I do</h2>
        <span className="sec__count">({String(SERVICES.length).padStart(2, '0')})</span>
      </div>
      <ol className="rows">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="row" data-reveal style={{ '--d': `${i * 0.08}s` }}>
            <span className="row__no">{pad(i)}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
            <span className="row__aside">{s.time}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Experience() {
  return (
    <section className="sec" id="experience">
      <div className="sec__head" data-reveal>
        <h2>Experience</h2>
        <span className="sec__count">({String(experience.length).padStart(2, '0')})</span>
      </div>
      <ol className="rows">
        {experience.map((e, i) => (
          <li key={e.id} className="row" data-reveal style={{ '--d': `${i * 0.08}s` }}>
            <span className="row__no">{pad(i)}</span>
            <div>
              <h3>{e.role}</h3>
              <p>{e.org}</p>
            </div>
            <span className="row__aside">{e.kind}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function About() {
  return (
    <section className="sec about" id="about">
      <div className="sec__head" data-reveal>
        <h2>About {profile.name}</h2>
      </div>
      <div className="about__grid">
        <div className="about__portrait" data-reveal>
          {profile.photo ? <img src={profile.photo} alt={profile.fullName} /> : <span>{profile.initial}</span>}
        </div>
        <div>
          <p className="about__lead">{profile.tagline}</p>
          <dl className="facts">
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Studying</dt><dd>BSc CSIT</dd></div>
            <div><dt>Tools</dt><dd>React, Node.js, MongoDB, Figma, Photoshop, Illustrator</dd></div>
            <div><dt>Elsewhere</dt><dd>{profile.socials.map((s, i) => (
              <span key={s.label}>{i > 0 && ', '}<a href={s.href}>{s.label}</a></span>
            ))}</dd></div>
          </dl>
        </div>
      </div>
      <ul className="values">
        {VALUES.map((v, i) => (
          <li key={v.title} data-reveal style={{ '--d': `${i * 0.1}s` }}>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <section className="sec contact" id="contact">
      <h2 className="contact__big" data-reveal>Let’s <em>talk</em>.</h2>
      <p data-reveal style={{ '--d': '0.15s' }}>Have a project in mind? Tell me about it and I’ll reply the same day.</p>
      <a className="btn btn--lg" data-reveal style={{ '--d': '0.3s' }} href={`mailto:${profile.email}`}>{profile.email}</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <span>© {new Date().getFullYear()} {profile.fullName} · {profile.location}</span>
      <nav aria-label="Footer">
        {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        <a href="#top">Back to top ↑</a>
      </nav>
    </footer>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Site() {
  useReveal();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <Services />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
