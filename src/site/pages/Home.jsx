import { useEffect, useRef } from 'react';
import { experience, profile, projects, skillGroups } from '../../data/site';
import FitLine from '../components/FitLine';
import Badges from '../components/Badges';
import IdCard from '../components/IdCard';
import Poster from '../components/Poster';
import ReadingText from '../components/ReadingText';
import { TLink, useGo } from '../components/nav';
import useReveal from '../components/useReveal';
import { SERVICES } from '../content';

const pad = (n) => String(n + 1).padStart(2, '0');

function Hero() {
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__left">
          <p className="hero__eyebrow rise" style={{ '--d': '0.2s' }}>
            <i className="dot" /> Available for new projects · {profile.location}
          </p>
          <div className="hero__stage">
            <FitLine hero className="hero__name" as="h1" rows={[[profile.name], [profile.fullName.split(' ').slice(1).join(' ')]]} />
            <Badges />
          </div>
          <div className="hero__row rise" style={{ '--d': '0.9s' }}>
            <p className="hero__tag">
              Developer and designer for sites with <em>personality</em>.
            </p>
            <div className="hero__cta">
              <TLink className="btn" to="/contact">
                <span className="avatar">{profile.initial}</span> Let’s work together
              </TLink>
              <TLink className="btn btn--ghost" to="/work">See my work</TLink>
            </div>
          </div>
        </div>
        <IdCard />
      </div>
      <div className="marquee rise" style={{ '--d': '1.1s' }} aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>{profile.roles.map((r) => <b key={r + k}>{r} <i>✺</i></b>)}</span>
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

    // Posters take their width and position from the two words of the pinned title
    const words = [...sec.querySelectorAll('.work__stage .fit__word')];
    const match = () => {
      if (words.length < 2) return;
      const origin = list.getBoundingClientRect().left;
      ['a', 'b'].forEach((k, n) => {
        const b = words[n].getBoundingClientRect();
        const bleed = parseFloat(getComputedStyle(words[n]).fontSize) * 0.02;
        list.style.setProperty(`--${k}-x`, `${(b.left - bleed - origin).toFixed(1)}px`);
        list.style.setProperty(`--${k}-w`, `${(b.width + bleed * 2).toFixed(1)}px`);
      });
    };
    const ro = new ResizeObserver(match);
    ro.observe(sec.querySelector('.work__stage .fit'));
    words.forEach((w) => ro.observe(w));
    document.fonts?.ready.then(match);
    match();

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
      ro.disconnect(); io.disconnect();
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
      <ReadingText text="I design and build websites that feel like the person behind them. Careful type, honest code, and motion that earns its place, from the first sketch to the last deploy." />
    </section>
  );
}

function ServicesTeaser() {
  return (
    <section className="block">
      <FitLine rows={[['What', 'I do']]} />
      <ol className="rows">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="row" data-reveal style={{ '--d': `${i * 0.08}s` }}>
            <span className="row__no">{pad(i)}</span>
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
            <span className="row__aside">{s.time}</span>
          </li>
        ))}
      </ol>
      <TLink className="textlink" to="/services">See all services →</TLink>
    </section>
  );
}

function AboutTeaser() {
  return (
    <section className="block">
      <FitLine rows={[['About', profile.name]]} />
      <div className="about-teaser">
        <p className="about-teaser__lead" data-reveal>{profile.tagline}</p>
        <div className="chips" data-reveal style={{ '--d': '.1s' }}>
          {skillGroups.flatMap((g) => g.skills.slice(0, 4)).map((s) => <span key={s.name}>{s.name}</span>)}
        </div>
        <ul className="mini" data-reveal style={{ '--d': '.2s' }}>
          {experience.slice(0, 3).map((e) => <li key={e.id}><b>{e.role}</b><span>{e.org}</span></li>)}
        </ul>
        <TLink className="textlink" to="/about">More about me →</TLink>
      </div>
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
      <ServicesTeaser />
      <AboutTeaser />
      <CTA />
    </>
  );
}

