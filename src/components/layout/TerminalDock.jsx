import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TerminalLine } from '../terminal/TerminalLines';
import { useShell } from '../terminal/useShell';
import { autocomplete, dirForPath } from '../../lib/shell';
import { sessionStore, slug } from '../../lib/session';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';

/**
 * A slim command bar on inner pages so visitors can keep "travelling" with `cd <place>`.
 * Press "/" anywhere to focus it.
 */
export default function TerminalDock() {
  const { pathname } = useLocation();
  const cwd = dirForPath(pathname);
  const loggedIn = useStore(sessionStore);
  const { lines, busy, asking, answer, run, clear } = useShell(cwd);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const user = loggedIn ? slug(profile.name) : 'guest';
  const prompt = `${user}@portfolio:/${cwd === 'home' ? '' : cwd}$`;

  // Each page starts with a clean log
  useEffect(() => clear(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
    } else if (e.key === 'Escape') {
      clear();
      e.currentTarget.blur();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      sound.play('type');
    }
  };

  return (
    <div className="dock" role="search" aria-label="Terminal navigation">
      <AnimatePresence>
        {lines.length > 0 && (
          <motion.div
            className="dock__log"
            ref={logRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {lines.slice(-14).map((line) => (
              <div key={line.id} className="term__row">
                <TerminalLine line={line} onCommand={execute} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <label className="dock__bar">
        <span className="tprompt">{prompt}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy && !asking}
          placeholder="try: cd projects   (press / to type)"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Type a command, for example cd projects"
        />
      </label>
    </div>
  );
}
