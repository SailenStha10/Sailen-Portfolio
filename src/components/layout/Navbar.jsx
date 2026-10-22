import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile } from '../../data/site';
import SoundToggle from '../ui/SoundToggle';
import ThemeToggle from '../ui/ThemeToggle';
import Icon from '../ui/Icon';
import { setPalette } from '../../lib/ui';

/** The one and only navigation bar: brand, page links, and three small tools. */
export function Topbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

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
      <header className="topbar">
        <div className="topbar__inner container">
          <Link to="/" className="brand" aria-label={`${profile.name} — home`}>
            <span className="brand__mark">{profile.initial}</span>
            <span className="brand__name">{profile.name}</span>
          </Link>

          <nav className="topnav" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className="topnav__link">
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="navline"
                        className="topnav__line"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__tools">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPalette(true)}
              aria-label="Open command bar (press /)"
              title="Command bar  ( / )"
            >
              <Icon name="terminal" size={19} />
            </button>
            <SoundToggle />
            <ThemeToggle />
            <button
              type="button"
              className={`burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                >
                  <NavLink to={link.to} end={link.to === '/'} className="sheet__link">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {link.label}
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
