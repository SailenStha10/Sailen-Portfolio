import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PixelSprite from '../../components/ui/PixelSprite';
import { HEART } from '../../lib/sprites';
import { RunnerEngine, readColors } from '../../lib/game/engine';
import { recordRun, unlock, gameStore } from '../../lib/achievements';
import { themeStore } from '../../lib/theme';
import { visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';

const KEY_MAP = {
  arrowright: 'right',
  d: 'right',
  arrowleft: 'left',
  a: 'left',
  arrowdown: 'duck',
  s: 'duck',
};
const JUMP_KEYS = ['arrowup', 'w', ' '];

const isTyping = () => ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

/** The playable level for one character. */
export default function RunnerGame({ character, onBack }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const timers = useRef({});
  const statusRef = useRef('ready');
  const progress = useStore(gameStore);
  const visitor = useStore(visitorStore);

  const [status, setStatus] = useState('ready'); // ready | playing | done
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [unlocked, setUnlocked] = useState([]);
  const [banner, setBanner] = useState(null);
  const [notice, setNotice] = useState(null);
  const [flash, setFlash] = useState(0);

  const updateStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const showTemporarily = (setter, value, ms) => {
    const name = setter === setBanner ? 'banner' : 'notice';
    clearTimeout(timers.current[name]);
    setter(value);
    timers.current[name] = setTimeout(() => setter(null), ms);
  };

  // Engine lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new RunnerEngine(
      canvas,
      character,
      {
        onScore: setScore,
        onLives: setLives,
        onJump: () => sound.play('select'),
        onUnlock: (index, cp) => {
          sound.play('coin');
          setUnlocked((u) => [...u, index]);
          showTemporarily(setBanner, { ...cp, key: index }, 2400);
        },
        onHit: () => {
          sound.play('deny');
          setFlash((f) => f + 1);
          showTemporarily(setNotice, 'OUCH! BACK TO CHECKPOINT', 1400);
        },
        onGameOver: () => {
          sound.play('error');
          setFlash((f) => f + 1);
          showTemporarily(setNotice, 'OUT OF LIVES — LIVES RESTORED', 1800);
        },
        onFinish: ({ score: final }) => {
          sound.play('levelup');
          recordRun(character.id, final);
          unlock(character.id);
          setTimeout(() => updateStatus('done'), 900);
        },
      },
      readColors(character.accent),
    );
    engineRef.current = engine;
    engine.resize();
    engine.render();
    engine.run();

    const ro = new ResizeObserver(() => {
      engine.resize();
      engine.render();
    });
    ro.observe(canvas);
    const unsubTheme = themeStore.subscribe(() => {
      engine.colors = readColors(character.accent);
    });
    const onVisibility = () => (document.hidden ? engine.pause() : engine.run());
    document.addEventListener('visibilitychange', onVisibility);
    const clearTimers = timers.current;

    return () => {
      engine.destroy();
      ro.disconnect();
      unsubTheme();
      document.removeEventListener('visibilitychange', onVisibility);
      Object.values(clearTimers).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // Keyboard controls
  useEffect(() => {
    const begin = () => statusRef.current === 'ready' && updateStatus('playing');

    const onDown = (e) => {
      if (isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const engine = engineRef.current;
      if (!engine || statusRef.current === 'done') return;
      if (KEY_MAP[k]) {
        e.preventDefault();
        begin();
        engine.setKey(KEY_MAP[k], true);
      } else if (JUMP_KEYS.includes(k)) {
        e.preventDefault();
        if (!e.repeat) {
          begin();
          engine.jump();
        }
      }
    };
    const onUp = (e) => {
      const name = KEY_MAP[e.key.toLowerCase()];
      if (name) engineRef.current?.setKey(name, false);
    };
    const release = () => ['left', 'right', 'duck'].forEach((n) => engineRef.current?.setKey(n, false));

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', release);
    };
  }, [updateStatus]);

  const restart = () => {
    engineRef.current?.reset();
    setUnlocked([]);
    setBanner(null);
    setNotice(null);
    updateStatus('ready');
  };

  // Touch pad helpers
  const hold = (name) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      if (statusRef.current === 'ready') updateStatus('playing');
      engineRef.current?.setKey(name, true);
    },
    onPointerUp: () => engineRef.current?.setKey(name, false),
    onPointerLeave: () => engineRef.current?.setKey(name, false),
    onPointerCancel: () => engineRef.current?.setKey(name, false),
  });
  const tapJump = () => {
    if (statusRef.current === 'ready') updateStatus('playing');
    engineRef.current?.jump();
  };

  const best = progress[character.id]?.best ?? 0;

  return (
    <motion.section
      className="rg container"
      style={{ '--accent': character.accent }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      aria-label={`${character.name} level`}
    >
      <div className="rg__hud px-box">
        <button type="button" className="rg__back" onClick={onBack}>
          ◀ CHANGE
        </button>
        <span className="rg__who">
          {visitor ? `${visitor.toUpperCase()} as ` : ''}
          {character.name.toUpperCase()}
        </span>
        <span className="rg__lives" aria-label={`${lives} lives left`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < lives ? '' : 'is-lost'}>
              <PixelSprite rows={HEART} />
            </span>
          ))}
        </span>
        <span>
          SKILLS <b>{unlocked.length}</b>/{character.checkpoints.length}
        </span>
        <span>
          SCORE <b>{String(score).padStart(4, '0')}</b>
        </span>
        <span className="rg__best">BEST {String(best).padStart(4, '0')}</span>
      </div>

      <div className="rg__layout">
        <div className="rg__stage px-box">
          {flash > 0 && <span key={flash} className="rg__flash" aria-hidden="true" />}
          <canvas
            ref={canvasRef}
            className="rg__canvas"
            onPointerDown={tapJump}
            role="img"
            aria-label="Side-scrolling level. Use arrow keys to run, up to jump, down to duck."
          />

          <AnimatePresence>
            {status === 'ready' && (
              <motion.div className="rg__ready" exit={{ opacity: 0 }}>
                <p className="rg__ready-title">READY?</p>
                <p>
                  Run to every <b>flag</b> to unlock a skill. Dodge the cacti — duck the birds.
                </p>
                <div className="rg__keys">
                  <span>
                    <kbd>←</kbd>
                    <kbd>→</kbd> run
                  </span>
                  <span>
                    <kbd>↑</kbd>
                    <kbd>space</kbd> jump
                  </span>
                  <span>
                    <kbd>↓</kbd> duck
                  </span>
                </div>
                <p className="rg__ready-hint">press any arrow to start</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {banner && (
              <motion.div
                key={banner.key}
                className="rg__banner"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                role="status"
              >
                <small>★ SKILL UNLOCKED +100</small>
                <strong>{banner.skill}</strong>
                <em>{banner.note}</em>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {notice && (
              <motion.p className="rg__notice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {notice}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status === 'done' && (
              <motion.div className="rg__done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="rg__done-kicker">★ LEVEL COMPLETE ★</p>
                <h2>All skills unlocked</h2>
                <p className="rg__done-score">
                  SCORE <b>{score}</b>
                </p>
                <div className="rg__done-chips">
                  {character.checkpoints.map((c) => (
                    <span key={c.skill} className="chip">
                      ✓ {c.skill}
                    </span>
                  ))}
                </div>
                <div className="rg__done-actions">
                  <button type="button" className="btn" onClick={restart}>
                    ↻ Play again
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={onBack}>
                    Another character
                  </button>
                  <Link to="/skills" className="btn btn--orange">
                    Next: Skills ▶
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ol className="rg__tree px-box" aria-label="Skills to unlock">
          <li className="rg__tree-title">■ SKILL TREE</li>
          {character.checkpoints.map((cp, i) => {
            const open = unlocked.includes(i);
            return (
              <motion.li
                key={cp.skill}
                className={open ? 'is-open' : ''}
                animate={open ? { scale: [1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <span className="rg__tree-icon" aria-hidden="true">
                  {open ? '✓' : '×'}
                </span>
                <span>
                  <strong>{open ? cp.skill : '???'}</strong>
                  <em>{open ? `${cp.note} · ${cp.year}` : 'Reach the next flag'}</em>
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="rg__pad" aria-label="Touch controls">
        <button type="button" {...hold('left')} aria-label="Run left">
          ◀
        </button>
        <button type="button" {...hold('right')} aria-label="Run right">
          ▶
        </button>
        <button type="button" {...hold('duck')} aria-label="Duck">
          ▼
        </button>
        <button type="button" className="rg__jump" onPointerDown={tapJump} aria-label="Jump">
          JUMP
        </button>
      </div>
    </motion.section>
  );
}
