import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile } from '../../data/site';
import SoundToggle from '../ui/SoundToggle';
import ThemeToggle from '../ui/ThemeToggle';
import PixelSprite from '../ui/PixelSprite';
import { BadgeCounter } from '../ui/AchievementToasts';
import { LEGS_A, PLAYER_BODY } from '../../lib/sprites';
import { visitStore } from '../../lib/achievements';
import { sessionStore, visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';
import './Navbar.css';

/** The nav is a route map: a tiny traveller walks between stops as you change page. */
export default function Navbar() {
  const { pathname } = useLocation();
  const visited = useStore(visitStore);
  const loggedIn = useStore(sessionStore);
  const visitor = useStore(visitorStore);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll + close on Escape while the menu is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner container">
          <Link to="/" className="nav__logo" aria-label={`${profile.name} — home`}>
            <span className="nav__logo-mark">{profile.initial}</span>
            <span className="nav__logo-text">{profile.name.toUpperCase()}</span>
          </Link>

          <nav className="nav__links" aria-label="Journey map" hidden={!loggedIn}>
            {navLinks.map((link) => {
              const seen = visited.includes(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={`nav__link ${seen ? 'is-visited' : ''}`}
                >
                  {({ isActive }) => (
                    <>
                      <span className="nav__slot" aria-hidden="true">
                        {isActive && (
                          <motion.span
                            layoutId="traveller"
                            className="nav__traveller"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          >
                            <PixelSprite rows={PLAYER_BODY} legs={LEGS_A} accent="var(--cyan)" />
                          </motion.span>
                        )}
                      </span>
                      <span className="nav__dot" aria-hidden="true" />
                      <span className="nav__link-text">{link.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="nav__tools">
            {loggedIn && visitor && (
              <span className="nav__visitor" title={`Signed in as ${visitor}`}>
                ▶ {visitor.toUpperCase()}
              </span>
            )}
            <BadgeCounter />
            <SoundToggle />
            <ThemeToggle />
          </div>

          <button
            type="button"
            hidden={!loggedIn}
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Sibling of the header: backdrop-filter on the header would otherwise trap this fixed sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__sheet"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                >
                  <NavLink to={link.to} end={link.to === '/'} className="nav__sheet-link">
                    <span className="nav__sheet-num">STOP 0{i + 1}</span>
                    {link.label.toUpperCase()}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
