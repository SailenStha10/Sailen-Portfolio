import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalLine } from './TerminalLines';
import { useShell } from './useShell';
import { autocomplete, DIRS } from '../../lib/shell';
import { slug } from '../../lib/session';
import { profile } from '../../data/site';
import './terminal.css';

const CHIPS = ['help', 'ls', ...Object.keys(DIRS).filter((d) => d !== 'home').map((d) => `cd ${d}`)];
const prompt = `${slug(profile.name)}@portfolio:~$`;

/** An interactive terminal that does everything the menus do, with commands. */
export default function Terminal() {
  const { lines, busy, run, print, reset } = useShell('home');
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const history = useRef([]);
  const cursor = useRef(-1);

  // Boot message. The `dead` flag stops a stale run (StrictMode / unmount) from printing.
  useEffect(() => {
    let dead = false;
    reset();
    const say = async (text, kind) => {
      if (!dead) await print(text, kind);
    };
    (async () => {
      await new Promise((r) => setTimeout(r, 400));
      await say(`Last login: ${new Date().toDateString()}`, 'dim');
      await say('');
      await say('Type `ls` to see where you can go,', 'ok');
      await say('then `cd projects` (or click a chip below).', 'out');
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

  const execute = async (raw) => {
    if (busy) return;
    if (raw.trim()) history.current.push(raw.trim());
    cursor.current = history.current.length;
    setValue('');
    await run(raw, prompt);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      execute(value);
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
      setValue((v) => autocomplete(v, true));
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      reset();
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <motion.section
      className="term"
      aria-label="Interactive terminal"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="term__title">terminal — zsh</span>
        <span className="term__state is-on">Online</span>
      </header>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="term__body" ref={bodyRef} onClick={focusInput}>
        <div role="log" aria-live="polite" className="term__lines">
          {lines.map((line) => (
            <div key={line.id} className="term__row">
              <TerminalLine line={line} onCommand={execute} />
            </div>
          ))}
        </div>

        <label className="term__input-row">
          <span className="tprompt">{prompt}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="Type a command"
          />
        </label>
      </div>

      <footer className="term__chips" aria-label="Suggested commands">
        <span>Try</span>
        {CHIPS.map((c) => (
          <button key={c} type="button" className="tchip" disabled={busy} onClick={() => execute(c)}>
            {c}
          </button>
        ))}
      </footer>
    </motion.section>
  );
}
