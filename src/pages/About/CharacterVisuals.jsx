import { motion } from 'framer-motion';
import PixelSprite from '../../components/ui/PixelSprite';
import { LEGS_A, LEGS_B, PLAYER_BODY, PROPS } from '../../lib/sprites';

const SOLO = {
  student: { prop: 'book', accent: 'var(--orange)' },
  dev: { prop: 'laptop', accent: 'var(--cyan)' },
  designer: { prop: 'brush', accent: 'var(--orange)' },
  singer: { prop: 'mic', accent: 'var(--ink)' },
};

const TRIO = [
  { prop: 'laptop', accent: 'var(--cyan)', legs: LEGS_A },
  { prop: 'brush', accent: 'var(--orange)', legs: LEGS_B },
  { prop: 'mic', accent: 'var(--ink)', legs: LEGS_A },
];

/** A scene's pixel-art cast member with drifting symbols around them. */
export default function CharacterVisual({ kind }) {
  return (
    <div className={`cv cv--${kind}`}>
      {kind === 'all' ? (
        <div className="cv__trio">
          {TRIO.map((c, i) => (
            <motion.div
              key={c.prop}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
            >
              <PixelSprite
                rows={PLAYER_BODY}
                legs={c.legs}
                extra={PROPS[c.prop]}
                accent={c.accent}
                className="cv__sprite cv__sprite--small"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PixelSprite
            rows={PLAYER_BODY}
            legs={LEGS_A}
            extra={PROPS[SOLO[kind].prop]}
            accent={SOLO[kind].accent}
            className="cv__sprite"
          />
        </motion.div>
      )}
      <div className="cv__ground" aria-hidden="true" />
    </div>
  );
}
