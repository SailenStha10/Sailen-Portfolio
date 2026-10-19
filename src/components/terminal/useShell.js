import { useCallback, useRef, useState } from 'react';
import { runCommand } from '../../lib/shell';
import { runMatrix } from '../../lib/fx';
import { setVisitor } from '../../lib/session';
import { useShellState } from '../../hooks/useShellContext';

let nextId = 0;
const PRINT_DELAY = 38;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Holds the output lines of a terminal and runs commands against the shared shell engine.
 * `cwd` is the directory key the terminal is "standing in" ('home', 'about', ...).
 */
export function useShell(cwd) {
  const state = useShellState();
  const stateRef = useRef(state);
  stateRef.current = state;

  const [lines, setLines] = useState([]);
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(null); // { resolve } while waiting for an answer

  const push = useCallback((line) => setLines((l) => [...l, { id: (nextId += 1), ...line }]), []);

  const print = useCallback(
    async (text, kind = 'out') => {
      push({ text, kind });
      await sleep(PRINT_DELAY);
    },
    [push],
  );

  const run = useCallback(
    async (raw, prompt) => {
      const clean = raw.trim();
      if (!clean) {
        push({ kind: 'cmd', text: '', prompt });
        return;
      }
      setBusy(true);
      push({ kind: 'cmd', text: clean, prompt });
      const ctx = {
        ...stateRef.current,
        cwd,
        print,
        wait: sleep,
        dirs: async (names) => {
          push({ kind: 'dirs', names });
          await sleep(PRINT_DELAY);
        },
        progress: async (label, ms) => {
          push({ kind: 'progress', label, ms });
          await sleep(ms + 120);
        },
        clear: () => setLines([]),
        setVisitor,
        fx: (name, ms) => name === 'matrix' && runMatrix(ms),
        ask: (question) =>
          new Promise((resolve) => {
            push({ kind: 'warn', text: question });
            setAsking({ resolve });
          }),
      };
      try {
        await runCommand(clean, ctx);
      } finally {
        setBusy(false);
      }
    },
    [cwd, print, push],
  );

  /** Supplies the answer to a pending `ask`. */
  const answer = useCallback(
    (text) => {
      setAsking((a) => {
        a?.resolve(text);
        return null;
      });
      push({ kind: 'cmd', text, prompt: '>' });
    },
    [push],
  );

  return { lines, busy, asking: Boolean(asking), answer, run, print, clear: () => setLines([]), reset: () => setLines([]) };
}
