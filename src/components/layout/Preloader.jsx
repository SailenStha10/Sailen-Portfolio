import { useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { Runner } from '../ui/PixelSprite';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';
import './Preloader.css';

const MESSAGES = [
  'WARMING UP THE VOICE',
  'COMPILING IDEAS',
  'MIXING COLOURS',
  'SPAWNING PLAYER ONE',
  'ROLLING THE CAMERA',
];
const BLOCKS = 32;

/**
 * Opening sequence: gate (sound choice = the user gesture audio needs) → loading counter
 * → "SAILEN PRESENTS" title card → film title → site.
 */
export default function Preloader({ onDone }) {
  const [phase, setPhase] = useState('gate'); // gate | load | presents | title
  const [pct, setPct] = useState(0);
  const lastTick = useRef(0);
  const name = profile.name.toUpperCase();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // Any key press (after the gate) skips ahead
  useEffect(() => {
    const onKey = (e) => {
      if (phase === 'gate' && e.key === 'Enter') begin(true);
      else if (phase !== 'gate' && (e.key === 'Escape' || e.key === ' ')) onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (phase !== 'load') return undefined;
    const controls = animate(0, 100, {
      duration: 2.9,
      ease: [0.45, 0.05, 0.3, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => setTimeout(() => setPhase('presents'), 350),
    });
    return () => controls.stop();
  }, [phase]);

  useEffect(() => {
    const step = Math.floor(pct / 10);
    if (phase === 'load' && step > lastTick.current) {
      lastTick.current = step;
      sound.play('tick');
    }
  }, [pct, phase]);

  useEffect(() => {
    if (phase === 'presents') {
      sound.play('boom');
      const id = setTimeout(() => setPhase('title'), 2800);
      return () => clearTimeout(id);
    }
    if (phase === 'title') {
      sound.play('ready');
      const id = setTimeout(onDone, 2100);
      return () => clearTimeout(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function begin(withSound) {
    if (withSound) sound.enable();
    else sound.disable();
    setPhase('load');
  }

  const filled = Math.round((pct / 100) * BLOCKS);
  const message = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor((pct / 100) * MESSAGES.length))];

  return (
    <motion.div className="pre" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6 } }}>
      {phase !== 'gate' && (
        <button type="button" className="pre__skip" onClick={onDone}>
          SKIP ▶▶
        </button>
      )}

      {phase === 'gate' && (
        <motion.div className="pre__gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="pre__kicker">SOMETHING EXCITING IS LOADING</p>
          <h1 className="pre__logo">{name}</h1>
          <p className="pre__gate-sub">Best experienced with sound.</p>
          <div className="pre__buttons">
            <button type="button" className="btn" onClick={() => begin(true)} autoFocus>
              ♪ Start with sound
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => begin(false)}>
              Start silent
            </button>
          </div>
          <p className="pre__hint">press Enter for sound</p>
        </motion.div>
      )}

      {phase === 'load' && (
        <div className="pre__load">
          <p className="pre__status" aria-live="polite">
            {message}
          </p>
          <p className="pre__count" aria-label={`${pct} percent loaded`}>
            {String(pct).padStart(3, '0')}
            <span>%</span>
          </p>
          <div className="pre__track" aria-hidden="true">
            <span className="pre__runner" style={{ left: `${pct}%` }}>
              <Runner running accent="var(--cyan)" />
            </span>
            <div className="pre__blocks">
              {Array.from({ length: BLOCKS }, (_, i) => (
                <i key={i} className={i < filled ? 'is-on' : ''} />
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'presents' && (
        <motion.div
          className="pre__presents"
          animate={{ x: [0, -8, 8, -5, 4, 0] }}
          transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        >
          <motion.div className="pre__flash" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.9 }} />
          <motion.div className="pre__bar pre__bar--top" initial={{ height: '50%' }} animate={{ height: '13%' }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="pre__bar pre__bar--bottom" initial={{ height: '50%' }} animate={{ height: '13%' }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
          <motion.span className="pre__a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            — a —
          </motion.span>
          <h2 className="pre__name" aria-label={name}>
            {[...name].map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 60, scale: 1.6, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </h2>
          <motion.p
            className="pre__presents-word"
            initial={{ opacity: 0, letterSpacing: '1.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ delay: 1, duration: 1.4, ease: 'easeOut' }}
          >
            PRESENTS
          </motion.p>
          <span className="pre__sweep" aria-hidden="true" />
        </motion.div>
      )}

      {phase === 'title' && (
        <motion.div className="pre__title" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p>A PORTFOLIO EXPERIENCE</p>
          <h2>A Colourful Life</h2>
          <span className="pre__rule" />
        </motion.div>
      )}
    </motion.div>
  );
}
