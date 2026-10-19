import { sound } from '../../lib/sound';
import { useSoundEnabled } from '../../hooks/useSound';

/** Equalizer-style sound switch. */
export default function SoundToggle() {
  const on = useSoundEnabled();

  return (
    <button
      type="button"
      className={`sound-toggle ${on ? 'is-on' : ''}`}
      onClick={() => sound.toggle()}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
    >
      <span className="sound-toggle__bars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ animationDelay: `${i * 0.13}s` }} />
        ))}
      </span>
      <span className="sound-toggle__label">SOUND {on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
