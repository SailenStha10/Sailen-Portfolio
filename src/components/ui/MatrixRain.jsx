import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fxStore } from '../../lib/fx';
import { useStore } from '../../lib/store';

const GLYPHS = '01アイウエオカキクケコサシスセソ#<>/{}$=+*';
const SIZE = 18;

function Rain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const styles = getComputedStyle(document.documentElement);
    const rgb = styles.getPropertyValue('--dot-rgb').trim() || '150, 224, 247';
    const bg = styles.getPropertyValue('--bg').trim() || '#000';
    const drops = Array.from({ length: Math.ceil(w / SIZE) }, () => Math.random() * -40);
    ctx.font = `${SIZE}px monospace`;
    let raf;
    let last = 0;

    const draw = (time) => {
      raf = requestAnimationFrame(draw);
      if (time - last < 45) return;
      last = time;
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      drops.forEach((y, i) => {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = `rgba(${rgb}, 0.95)`;
        ctx.fillText(ch, i * SIZE, y * SIZE);
        drops[i] = y * SIZE > h && Math.random() > 0.96 ? 0 : y + 1;
      });
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="matrix__canvas" aria-hidden="true" />;
}

/** "Hacking" rain shown during the terminal login (and the cheat code). */
export default function MatrixRain() {
  const { matrix } = useStore(fxStore);
  return (
    <AnimatePresence>
      {matrix && (
        <motion.div
          className="matrix"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Rain />
          <p className="matrix__label">BYPASSING FIREWALL</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
