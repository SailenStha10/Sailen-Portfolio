import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PixelSprite from '../../components/ui/PixelSprite';
import Icon from '../../components/ui/Icon';
import { LEGS_A, PLAYER_BODY, PROPS } from '../../lib/sprites';
import { characters } from '../../data/site';
import { gameStore } from '../../lib/achievements';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';

/** "Choose your character" screen. Click a card, or use ← → and Enter. */
export default function CharacterSelect({ onSelect }) {
  const [focus, setFocus] = useState(0);
  const progress = useStore(gameStore);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        sound.play('select');
        setFocus((f) => (f + 1) % characters.length);
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        sound.play('select');
        setFocus((f) => (f - 1 + characters.length) % characters.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        sound.play('grant');
        onSelect(characters[focus]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, onSelect]);

  return (
    <motion.section
      className="select container"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      aria-label="Choose your character"
    >
      <p className="select__hint">
        Click a character to play · <kbd>←</kbd> <kbd>→</kbd> to browse · <kbd>Enter</kbd> to start
      </p>

      <div className="select__grid">
        {characters.map((ch, i) => {
          const done = progress[ch.id]?.done;
          const focused = i === focus;
          return (
            <motion.button
              key={ch.id}
              type="button"
              className={`char ${focused ? 'is-focus' : ''}`}
              style={{ '--accent': ch.accent }}
              onMouseEnter={() => setFocus(i)}
              onFocus={() => setFocus(i)}
              onClick={() => {
                sound.play('grant');
                onSelect(ch);
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-label={`Play as ${ch.name}`}
            >
              <span className="char__stage">
                {done && <span className="char__done">✓ Cleared · best {progress[ch.id].best}</span>}
                <PixelSprite
                  rows={PLAYER_BODY}
                  legs={LEGS_A}
                  extra={PROPS[ch.prop]}
                  accent={ch.accent}
                  className="char__sprite"
                />
              </span>
              <span className="char__body">
                <span className="char__name">{ch.name}</span>
                <span className="char__tag">{ch.tagline}</span>

                <span className="char__stats">
                  {Object.entries(ch.stats)
                    .slice(0, 4)
                    .map(([k, v]) => (
                      <span key={k}>
                        <b>{k.charAt(0) + k.slice(1).toLowerCase()}</b>
                        <span className="char__bar">
                          <i style={{ width: `${v * 10}%` }} />
                        </span>
                      </span>
                    ))}
                </span>

                <span className="char__unlocks">
                  {ch.checkpoints.map((c) => (
                    <span key={c.skill} className="chip">
                      {c.skill}
                    </span>
                  ))}
                </span>
                <span className="char__cta">
                  Play as {ch.short} <Icon name="arrow" size={18} />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
