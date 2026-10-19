import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from '../ui/GlitchText';
import { TerminalLine } from './TerminalLines';
import { useShell } from './useShell';
import { autocomplete, DIRS } from '../../lib/shell';
import { sessionStore, slug, visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';
import './terminal.css';

const GUEST_CHIPS = ['cd login', 'help', 'theme light'];
const USER_CHIPS = ['ls', ...Object.keys(DIRS).filter((d) => d !== 'home').map((d) => `cd ${d}`)];

/** The home page: a full-screen interactive terminal. */
export default function Terminal() {
  const loggedIn = useStore(sessionStore);
  const shell = useShell('home');
  const { lines, busy, asking, answer, run, print, reset } = shell;
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const history = useRef([]);
  const cursor = useRef(-1);

  const userName = loggedIn ? slug(profile.name) : 'guest';
  const prompt = `${userName}@portfolio:~$`;

  // Boot message. The `dead` flag stops a stale run (StrictMode / unmount) from printing.
  useEffect(() => {
    let dead = false;
    reset();
    const say = async (text, kind) => {
      if (!dead) await print(text, kind);
    };
    (async () => {
      await new Promise((r) => setTimeout(r, 900));
      await say(`Last login: ${new Date().toDateString()} on ttys001`, 'dim');
      await say('portfolio OS 1.0 — all systems colourful', 'dim');
      await say('');
      if (sessionStore.get()) {
        await say(`Welcome back, ${visitorStore.get()}. Type \`ls\` to pick your next stop.`, 'ok');
      } else {
        await say('Welcome, guest. Type `help` for commands,', 'out');
        await say('or begin your journey:  cd login', 'warn');
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!busy || asking) inputRef.current?.focus({ preventScroll: true });
  }, [busy, asking]);

  const execute = async (raw) => {
    if (busy) return;
    if (raw.trim()) history.current.push(raw.trim());
    cursor.current = history.current.length;
    setValue('');
    await run(raw, prompt);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      sound.play('click');
      if (asking) {
        answer(value);
        setValue('');
      } else {
        execute(value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.current.length) return;
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(history.current[cursor.current] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor.current = Math.min(history.current.length, cursor.current + 1);
      setValue(history.current[cursor.current] ?? '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setValue((v) => autocomplete(v, loggedIn));
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      reset();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      sound.play('type');
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  const chips = loggedIn ? USER_CHIPS : GUEST_CHIPS;

  return (
    <main className="term-page">
      <motion.section
        className="term"
        aria-label="Interactive terminal"
        initial={{ scaleY: 0.015, opacity: 0 }}
        animate={{ scaleY: [0.015, 0.015, 1], opacity: [0, 1, 1] }}
        transition={{ delay: 0.5, duration: 0.9, times: [0, 0.35, 1], ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="term__bar">
          <span className="term__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="term__title">{prompt.replace('$', '')} — zsh</span>
          <span className={`term__state ${loggedIn ? 'is-on' : ''}`}>{loggedIn ? '● SIGNED IN' : '○ GUEST'}</span>
        </header>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div className="term__body" ref={bodyRef} onClick={focusInput}>
          <div className="term__banner">
            <h1 className="term__name">
              <GlitchText className="glitch--auto">{profile.name.toUpperCase()}</GlitchText>
            </h1>
            <p className="term__tag">PORTFOLIO OS · BSc CSIT · DEV / DESIGN / VOICE</p>
          </div>

          <div role="log" aria-live="polite" className="term__lines">
            {lines.map((line) => (
              <div key={line.id} className="term__row">
                <TerminalLine line={line} onCommand={execute} />
              </div>
            ))}
          </div>

          <label className="term__input-row">
            <span className="tprompt">{asking ? '>' : prompt}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={busy && !asking}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Type a command"
            />
          </label>
        </div>

        <footer className="term__chips" aria-label="Suggested commands">
          <span>TRY:</span>
          {chips.map((c) => (
            <button key={c} type="button" className="tchip" disabled={busy} onClick={() => execute(c)}>
              {c}
            </button>
          ))}
        </footer>
      </motion.section>
    </main>
  );
}
