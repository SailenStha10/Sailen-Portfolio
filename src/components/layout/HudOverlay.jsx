import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { navLinks } from '../../data/site';
import { sessionStore, visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';

const pad = (n, l = 2) => String(n).padStart(l, '0');

/** CRT scanlines + vignette, plus a film-style REC / timecode / scene readout. */
export default function HudOverlay() {
  const { pathname } = useLocation();
  const loggedIn = useStore(sessionStore);
  const visitor = useStore(visitorStore);
  const timeRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const ms = performance.now() - start;
      const frames = Math.floor((ms % 1000) / (1000 / 24));
      const s = Math.floor(ms / 1000);
      if (timeRef.current) {
        timeRef.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:${pad(frames)}`;
      }
    }, 80);
    return () => clearInterval(id);
  }, []);

  const index = Math.max(
    0,
    navLinks.findIndex((l) => l.to === pathname),
  );
  const label = navLinks.find((l) => l.to === pathname)?.label ?? 'Lost';

  return (
    <>
      <div className="crt" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="hud" aria-hidden="true">
        <span className="hud__rec">
          <i /> REC <b ref={timeRef}>00:00:00:00</b>
        </span>
        <span className="hud__scene">
          {loggedIn && visitor ? `${visitor.toUpperCase()} · ` : ''}STOP {pad(index + 1)} / {label.toUpperCase()}
        </span>
      </div>
    </>
  );
}
