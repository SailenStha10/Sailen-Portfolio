import { useEffect, useState } from 'react';

const BLOCKS = 24;

/** An ASCII progress bar that fills over `ms`. */
export function ProgressLine({ label, ms }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = () => {
      const p = Math.min(1, Math.max(0, (performance.now() - start) / ms));
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ms]);

  const filled = Math.min(BLOCKS, Math.max(0, Math.round((pct / 100) * BLOCKS)));
  return (
    <span className="tline tline--progress">
      [{'█'.repeat(filled)}
      {'░'.repeat(BLOCKS - filled)}] {String(pct).padStart(3, ' ')}% {label}
    </span>
  );
}

/** Renders one terminal output line according to its kind. */
export function TerminalLine({ line, onCommand }) {
  switch (line.kind) {
    case 'progress':
      return <ProgressLine label={line.label} ms={line.ms} />;
    case 'dirs':
      return (
        <span className="tline tline--dirs">
          {line.names.map((name) => (
            <button
              key={name}
              type="button"
              className="tdir"
              onClick={() => onCommand(name === 'login' ? 'cd login' : `cd ${name}`)}
            >
              {name}/
            </button>
          ))}
        </span>
      );
    case 'cmd':
      return (
        <span className="tline tline--cmd">
          <span className="tprompt">{line.prompt}</span> {line.text}
        </span>
      );
    default:
      return <span className={`tline tline--${line.kind}`}>{line.text || ' '}</span>;
  }
}
