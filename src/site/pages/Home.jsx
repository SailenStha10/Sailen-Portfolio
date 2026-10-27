import { useEffect, useRef } from 'react';
import { experience, profile, projects, skillGroups } from '../../data/site';
import FitLine from '../components/FitLine';
import Badges from '../components/Badges';
import ToolCloud from '../components/ToolCloud';
import HeroPortrait from '../components/HeroPortrait';
import Poster from '../components/Poster';
import ReadingText from '../components/ReadingText';
import { TLink, useGo } from '../components/nav';
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

/**
 * Work: the title stays pinned in the middle of the screen and the posters scroll over it,
 * staggered left and right, each drifting at its own pace and leaning with the speed of the scroll.
 * The text of whichever poster crosses the reading line shows in a caption pinned to the bottom.
 */
function Work() {
  const go = useGo();
  const section = useRef(null);
  const caption = useRef(null);

  useEffect(() => {
    const sec = section.current;
    const list = sec.querySelector('.work__list');
    const cap = caption.current;
    const cards = [...list.querySelectorAll('.work-card')].map((el, n) => ({
      el,
      media: el.querySelector('.work-card__media'),
      set: '',
      p: 0,
      drift: [0.06, -0.1, 0.04, -0.12, 0.08, -0.05][n % 6],
      p6: projects[n],
    }));

    // Cursor tag that follows the pointer over a poster
    const cleanups = cards.map(({ el }) => {
      const follow = (e) => {
        const b = el.getBoundingClientRect();
        el.style.setProperty('--tag-x', `${e.clientX - b.left}px`);
        el.style.setProperty('--tag-y', `${e.clientY - b.top}px`);
      };
      const enter = (e) => { if (e.pointerType === 'mouse') { follow(e); el.classList.add('is-hovered'); } };
      const leave = () => el.classList.remove('is-hovered');
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', follow);
      el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', follow); el.removeEventListener('pointerleave', leave); };
    });

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let shown = null, lean = 0, leanV = 0, lastY = scrollY, last = null, raf = 0, onScreen = false;

    const show = (card) => {
      if (card === shown) return;
      const first = shown === null;
      shown = card;
      cap.classList.toggle('is-on', !!card);
      if (!card) return;
      cap.querySelector('.work__caption-name').textContent = card.p6.title;
      cap.querySelector('.work__caption-desc').textContent = card.p6.summary;
      cap.querySelector('.work__caption-tags').textContent = [card.p6.category, ...card.p6.tags].join(' / ');
      cap.querySelector('a').setAttribute('href', `/work/${card.p6.id}`);
      if (first || still) return;
      cap.querySelectorAll('.work__caption-name, .work__caption-desc').forEach((el, n) =>
        el.animate([{ opacity: 0, transform: 'translateY(.4em)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: n * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }),
      );
    };

    const frame = (now) => {
      const dt = last === null ? 0.016 : Math.min(Math.max((now - last) / 1000, 0.001), 0.05);
      last = now;
      const H = innerHeight;
      if (!still) {
        const speed = (scrollY - lastY) / dt / H;
        const target = Math.max(-1, Math.min(1, speed * 0.55));
        leanV += ((target - lean) * 60 - leanV * 12) * dt;
        lean += leanV * dt;
        list.style.setProperty('--v', lean.toFixed(4));
      }
      lastY = scrollY;
      const line = H * 0.42;
      let nearest = null, dist = Infinity;
      const boxes = cards.map((c) => c.media.getBoundingClientRect());
      cards.forEach((c, i) => {
        const b = boxes[i];
        if (b.bottom < -200 || b.top > H + 200) return;
        if (!still) {
          const centre = b.top + b.height / 2 - c.p;
          const next = ((centre - H / 2) * c.drift).toFixed(1);
          if (next !== c.set) { c.el.style.setProperty('--p', next); c.set = next; c.p = parseFloat(next); }
        }
        if (b.top > H * 0.72 || b.bottom < H * 0.18) return;
        const away = Math.abs(b.top + b.height / 2 - line);
        if (away < dist) { dist = away; nearest = c; }
      });
      show(nearest);
      raf = onScreen && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (raf || !onScreen || document.hidden) return;
      last = null; lastY = scrollY;
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; wake(); });
    io.observe(sec);
    document.addEventListener('visibilitychange', wake);

    return () => {
      cleanups.forEach((c) => c());
      io.disconnect();
      document.removeEventListener('visibilitychange', wake);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="work" ref={section}>
      <div className="work__stage">
        <FitLine rows={[['Selected', 'work']]} />
        <p className="work__count">({String(projects.length).padStart(2, '0')} projects)</p>
      </div>
      <ol className="work__list">
        {projects.map((p, i) => (
          <li key={p.id} className="work-card">
            <TLink to={`/work/${p.id}`} className="work-card__media" aria-label={p.title}>
              <Poster p={p} index={i} />
              <span className="cursor-tag">View case</span>
            </TLink>
            <div className="work-card__caption">
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="work__caption" ref={caption}>
        <div>
          <h3 className="work__caption-name" />
          <p className="work__caption-desc" />
        </div>
        <div className="work__caption-side">
          <span className="work__caption-tags" />
          <a className="btn btn--sm" href="/work" onClick={(e) => { e.preventDefault(); go(e.currentTarget.getAttribute('href')); }}>View case →</a>
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
        text={`${profile.tagline} I study BSc CSIT in ${profile.location} and spend the rest of my time building web apps, designing interfaces and posters, and singing. Code gives me structure, design gives me taste and music gives me nerve.`}
      />
      <TLink className="more" to="/about">
        <span>More about me</span>
        <i aria-hidden="true">→</i>
      </TLink>
      <Socials variant="round" />
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
      <ToolCloud />
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
      <Work />
      <Statement />
      <AboutTeaser />
      <ExperienceTeaser />
      <Toolbox />
      <Values />
      <CTA />
    </>
  );
}

