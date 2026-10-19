import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PixelSprite from '../../components/ui/PixelSprite';
import { LEGS_A, PLAYER_BODY, PROPS } from '../../lib/sprites';
import { characters } from '../../data/site';
import { gameStore } from '../../lib/achievements';
import { useStore } from '../../lib/store';
import { sound } from '../../lib/sound';

/** "Choose your character" screen. ← → to browse, Enter to confirm. */
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
      <p className="select__banner">
        <span>1P</span> CHOOSE YOUR CHARACTER <em>← → to browse · Enter to start</em>
      </p>

      <div className="select__grid">
        {characters.map((ch, i) => {
          const done = progress[ch.id]?.done;
          const focused = i === focus;
          return (
            <motion.button
              key={ch.id}
              type="button"
              className={`char px-box ${focused ? 'is-focus' : ''} ${done ? 'is-done' : ''}`}
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
              {done && <span className="char__done">✓ CLEARED · BEST {progress[ch.id].best}</span>}
              <span className="char__stage">
                <PixelSprite
                  rows={PLAYER_BODY}
                  legs={LEGS_A}
                  extra={PROPS[ch.prop]}
                  accent={ch.accent}
                  className="char__sprite"
                />
                <i className="char__pad" aria-hidden="true" />
              </span>
              <span className="char__name">{ch.name}</span>
              <span className="char__tag">{ch.tagline}</span>

              <span className="char__stats">
                {Object.entries(ch.stats)
                  .slice(0, 4)
                  .map(([k, v]) => (
                    <span key={k}>
                      <b>{k}</b>
                      <span className="char__blocks">
                        {Array.from({ length: 10 }, (_, n) => (
                          <i key={n} className={n < v ? 'is-on' : ''} />
                        ))}
                      </span>
                    </span>
                  ))}
              </span>

              <span className="char__unlocks">
                <small>UNLOCKS</small>
                {ch.checkpoints.map((c) => (
                  <span key={c.skill} className="chip">
                    {c.skill}
                  </span>
                ))}
              </span>
              <span className="char__cta">{focused ? '▶ PRESS START' : 'SELECT'}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
