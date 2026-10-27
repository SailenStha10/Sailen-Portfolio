import { useEffect, useRef } from 'react';

const BADGES = [
  { label: 'React', back: 'UI', fx: 0.86, fy: -0.02, bg: '#2d3a6b', rot: -8 },
  { label: 'Figma', back: 'Design', fx: 0.95, fy: 0.5, bg: '#d4482d', rot: 7 },
  { label: 'Node.js', back: 'API', fx: 0.55, fy: 0.97, bg: '#4f7a63', rot: -5 },
  { label: 'Vocals', back: 'Live', fx: 0.5, fy: -0.03, bg: '#c9a227', rot: 9 },
];

/**
 * Pillow badges around the name. Each floats in place, turns toward the pointer, is pushed aside when
 * the pointer gets close, can be grabbed and thrown (a spring draws it home), and flips on a click.
 */
export default function Badges() {
  const box = useRef(null);
  const els = useRef([]);

  useEffect(() => {
    const root = box.current;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = BADGES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, held: false, flip: 0, tflip: 0, moved: false, ox: 0, oy: 0 }));
    const ptr = { x: -999, y: -999 };
    let raf, last = 0, w = 0, h = 0;

    const measure = () => { w = root.clientWidth; h = root.clientHeight; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      S.forEach((s, i) => {
        if (!s.held) return;
        s.moved = true;
        s.x = ptr.x - s.ox;
        s.y = ptr.y - s.oy;
      });
    };
    window.addEventListener('pointermove', onMove);

    const handlers = els.current.map((el, i) => {
      const s = S[i];
      const down = (e) => {
        e.preventDefault();
        const r = root.getBoundingClientRect();
        const home = { x: BADGES[i].fx * w, y: BADGES[i].fy * h };
        s.held = true; s.moved = false;
        s.ox = e.clientX - r.left - (home.x + s.x);
        s.oy = e.clientY - r.top - (home.y + s.y);
        s.vx = s.vy = 0;
        el.setPointerCapture(e.pointerId);
      };
      const up = () => {
        if (!s.held) return;
        s.held = false;
        if (!s.moved) s.tflip += 180;
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      return [el, down, up];
    });

    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      S.forEach((s, i) => {
        const b = BADGES[i];
        const hx = b.fx * w, hy = b.fy * h;
        const bob = still ? 0 : Math.sin(t / 900 + i * 1.7) * 7;
        if (s.held) {
          const px = s.x, py = s.y;
          s.vx = (s.x - px) / dt; s.vy = (s.y - py) / dt;
        } else {
          // spring back home, plus a push when the pointer comes close
          const cx = hx + s.x, cy = hy + s.y;
          const dx = cx - ptr.x, dy = cy - ptr.y, d = Math.hypot(dx, dy);
          let fx = -s.x * 22, fy = -s.y * 22;
          if (d < 120 && d > 0 && !still) { const k = (1 - d / 120) * 2600; fx += (dx / d) * k; fy += (dy / d) * k; }
          s.vx += fx * dt; s.vy += fy * dt;
          s.vx *= 1 - 5 * dt; s.vy *= 1 - 5 * dt;
          s.x += s.vx * dt; s.y += s.vy * dt;
        }
        s.flip += (s.tflip - s.flip) * 0.14;
        const dx = ptr.x - (hx + s.x), dy = ptr.y - (hy + s.y);
        const lean = Math.max(-1, Math.min(1, dx / 400));
        const nod = Math.max(-1, Math.min(1, dy / 400));
        els.current[i].style.transform =
          `translate3d(${hx + s.x}px, ${hy + s.y + bob}px, 0) translate(-50%, -50%) rotate(${b.rot + s.vx * 0.012}deg) rotateY(${s.flip + lean * 22}deg) rotateX(${-nod * 16}deg) scale(${s.held ? 1.12 : 1})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      handlers.forEach(([el, d, u]) => { el.removeEventListener('pointerdown', d); el.removeEventListener('pointerup', u); el.removeEventListener('pointercancel', u); });
    };
  }, []);

  return (
    <div className="badges" ref={box}>
      {BADGES.map((b, i) => (
        <div key={b.label} className="badge" ref={(el) => (els.current[i] = el)} style={{ '--c': b.bg }}>
          <span className="badge__face">{b.label}</span>
          <span className="badge__face badge__face--back">{b.back}</span>
        </div>
      ))}
    </div>
  );
}
