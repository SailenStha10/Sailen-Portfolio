import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavCtx = createContext(() => {});

/** Internal navigation behind a curtain that wipes up, swaps the page, then wipes away. */
export function NavProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [phase, setPhase] = useState('idle');
  const busy = useRef(false);

  const go = useCallback(
    (to) => {
      if (busy.current) return;
      if (to === pathname) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      busy.current = true;
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
      <div className={`curtain is-${phase}`} aria-hidden="true" />
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
        go(to);
      }}
    >
      {children}
    </a>
  );
}
