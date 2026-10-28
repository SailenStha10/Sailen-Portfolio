import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavCtx = createContext(() => {});

/** Each destination gets its own curtain: how it covers the screen, and how the new page then arrives. */
export function variantFor(pathname) {
  const [seg, sub] = pathname.split('/').filter(Boolean);
  if (!seg) return 'iris';
  if (seg === 'work') return sub ? 'blinds' : 'up';
  return { about: 'split', experience: 'rows', gallery: 'blinds', contact: 'iris' }[seg] || 'up';
}
export function enterFor(pathname) {
  const [seg, sub] = pathname.split('/').filter(Boolean);
  if (!seg) return 'zoom';
  if (seg === 'work') return sub ? 'case' : 'rise';
  return { about: 'drop', experience: 'wipe', gallery: 'tilt', contact: 'left' }[seg] || 'rise';
}

/** Internal navigation behind a curtain that covers the page, swaps it, then reveals the new one. */
export function NavProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [phase, setPhase] = useState('idle');
  const [look, setLook] = useState({ variant: 'up', x: '50%', y: '50%' });
  const busy = useRef(false);

  const go = useCallback(
    (to, at) => {
      if (busy.current) return;
      if (to === pathname) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      busy.current = true;
      const hit = at && (at.x || at.y);
      setLook({ variant: variantFor(to), x: hit ? `${at.x}px` : '50%', y: hit ? `${at.y}px` : '50%' });
      setPhase('in');
      setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);
        setPhase('out');
        setTimeout(() => {
          setPhase('idle');
          busy.current = false;
        }, 750);
      }, 600);
    },
    [navigate, pathname],
  );

  return (
    <NavCtx.Provider value={go}>
      {children}
      <div className={`curtain cv-${look.variant} is-${phase}`} style={{ '--x': look.x, '--y': look.y }} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((n) => <i key={n} style={{ '--n': n }} />)}
      </div>
    </NavCtx.Provider>
  );
}

export const useGo = () => useContext(NavCtx);

export function TLink({ to, children, onClick, ...rest }) {
  const go = useGo();
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to, { x: e.clientX, y: e.clientY });
      }}
    >
      {children}
    </a>
  );
}
