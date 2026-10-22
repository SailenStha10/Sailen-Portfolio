import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TerminalLine } from '../terminal/TerminalLines';
import { useShell } from '../terminal/useShell';
import { autocomplete, DIRS, dirForPath } from '../../lib/shell';
import { paletteStore, setPalette } from '../../lib/ui';
import { sessionStore, slug } from '../../lib/session';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';

const SUGGESTIONS = Object.keys(DIRS).filter((d) => d !== 'home').map((d) => `cd ${d}`);

/**
 * The command bar for inner pages: a small centred terminal that opens over the page.
 * Open it with the "Command" button or by pressing "/"; Esc closes it.
 */
export default function TerminalDock() {
  const { pathname } = useLocation();
  const cwd = dirForPath(pathname);
  const open = useStore(paletteStore);
  const loggedIn = useStore(sessionStore);
  const { lines, busy, asking, answer, run, clear } = useShell(cwd);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const prompt = `${loggedIn ? slug(profile.name) : 'guest'}@portfolio:/${cwd === 'home' ? '' : cwd}$`;

  // Each page starts with a clean log and a closed bar
  useEffect(() => {
    clear();
    setPalette(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        setPalette(true);
      } else if (e.key === 'Escape') {
        setPalette(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const execute = (raw) => {
    setValue('');
    run(raw, prompt);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && asking) {
      sound.play('click');
      answer(value);
      setValue('');
    } else if (e.key === 'Enter' && !busy) {
      sound.play('click');
      execute(value);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setValue((v) => autocomplete(v, loggedIn));
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      sound.play('type');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPalette(false)}
        >
          <motion.div
            className="palette__box"
            role="dialog"
            aria-modal="true"
            aria-label="Command bar"
            initial={{ y: -24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <label className="palette__bar">
              <span className="tprompt">{asking ? '>' : prompt}</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy && !asking}
                placeholder="Type a command, e.g. cd projects"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label="Type a command, for example cd projects"
              />
              <kbd>esc</kbd>
            </label>

            {lines.length > 0 && (
              <div className="palette__log" ref={logRef}>
                {lines.slice(-14).map((line) => (
                  <div key={line.id} className="term__row">
                    <TerminalLine line={line} onCommand={execute} />
                  </div>
                ))}
              </div>
            )}

            <div className="palette__chips">
              <span>Jump to</span>
              {SUGGESTIONS.map((c) => (
                <button key={c} type="button" className="tchip" disabled={busy} onClick={() => execute(c)}>
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
