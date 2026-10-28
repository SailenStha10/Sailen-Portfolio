import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { profile, projects } from '../../data/site';
import { NavProvider, TLink, enterFor } from './nav';
import Socials from './Socials';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work', count: projects.length },
  { to: '/experience', label: 'Experience' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];
const isActive = (pathname, to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

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
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 8);
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
      <header className={`hd ${solid ? 'is-solid' : ''}`}>
        <span className="progress" />
        <TLink className="hd__logo" to="/">©{profile.name}</TLink>
        <nav className="hd__nav" aria-label="Primary">
          {LINKS.map((l) => (
            <TLink key={l.to} to={l.to} className={isActive(pathname, l.to) ? 'is-active' : ''}>
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
        {LINKS.map((l, i) => (
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
        <nav className="ft__nav" aria-label="Footer">
          <b>Pages</b>
          <div>{LINKS.map((l) => <TLink key={l.to} to={l.to}>{l.label}</TLink>)}</div>
        </nav>
      </div>
      <Socials variant="tile" className="ft__soc" />
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
      <main id="top" key={pathname} data-enter={enterFor(pathname)}><Outlet /></main>
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
