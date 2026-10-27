import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { profile, projects } from '../../data/site';
import { NavProvider, TLink } from './nav';

const LINKS = [
  { to: '/work', label: 'Work', count: projects.length },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Loader({ onDone, leaving }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + 3 + Math.random() * 9);
      setN(Math.floor(v));
      if (v >= 100) { clearInterval(id); setTimeout(onDone, 350); }
    }, 55);
    return () => clearInterval(id);
  }, [onDone]);
  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <span className="loader__name">©{profile.name}</span>
      <span className="loader__count">{String(n).padStart(3, '0')}</span>
      <span className="loader__bar" style={{ transform: `scaleX(${n / 100})` }} />
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 8);
      setHidden(y > last && y > 240);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--progress', max > 0 ? y / max : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header className={`hd ${solid ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <span className="progress" />
        <TLink className="hd__logo" to="/">©{profile.name}</TLink>
        <nav className="hd__nav" aria-label="Primary">
          {LINKS.map((l) => (
            <TLink key={l.to} to={l.to} className={pathname.startsWith(l.to) ? 'is-active' : ''}>
              {l.label}{l.count && <sup>{l.count}</sup>}
            </TLink>
          ))}
        </nav>
        <TLink className="btn btn--sm hd__cta" to="/contact">Hire me</TLink>
        <button className={`hd__burger ${open ? 'is-open' : ''}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <i /><i />
        </button>
      </header>
      <div className={`menu ${open ? 'is-open' : ''}`}>
        {[{ to: '/', label: 'Home' }, ...LINKS].map((l, i) => (
          <TLink key={l.to} to={l.to} style={{ '--i': i }}>{l.label}</TLink>
        ))}
        <a className="menu__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <div className="ft__top">
        <TLink to="/contact" className="ft__big">Let’s <em>talk</em> →</TLink>
        <div className="ft__cols">
          <nav aria-label="Footer">
            <b>Pages</b>
            <TLink to="/">Home</TLink>
            {LINKS.map((l) => <TLink key={l.to} to={l.to}>{l.label}</TLink>)}
          </nav>
          <nav aria-label="Elsewhere">
            <b>Elsewhere</b>
            {profile.socials.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
          </nav>
        </div>
      </div>
      <div className="ft__bar">
        <span>© {new Date().getFullYear()} {profile.fullName} · {profile.location}</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a>
      </div>
    </footer>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('loaded') && pathname === '/');
  const [leaving, setLeaving] = useState(false);
  const root = document.documentElement;

  const release = () => {
    sessionStorage.setItem('loaded', '1');
    root.classList.add('is-go');
    setLeaving(true);
    window.dispatchEvent(new Event('site-go'));
    setTimeout(() => setLoading(false), 1000);
  };
  useEffect(() => {
    if (!loading) {
      root.classList.add('is-go');
      window.dispatchEvent(new Event('site-go'));
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loader onDone={release} leaving={leaving} />}
      <Header />
      <main id="top" key={pathname}><Outlet /></main>
      <Footer />
    </>
  );
}

export default function Layout() {
  return (
    <NavProvider>
      <Shell />
    </NavProvider>
  );
}
