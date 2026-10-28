import { useEffect, useRef } from 'react';
import { profile } from '../../data/site';

/**
 * Cut-out portrait that stays rooted behind the marquee strip but is a little alive: it bobs gently,
 * sways toward the pointer from its base, and on hover grows a touch with a springy pop.
 */
export default function HeroPortrait() {
  const wrap = useRef(null);
  const tilt = useRef(null);
  const st = useRef({ x: 0, y: 0, tx: 0, ty: 0, s: 1, ts: 1, v: 0, over: false });

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const loop = (t) => {
      const o = st.current;
      o.x += (o.tx - o.x) * 0.08;
      o.y += (o.ty - o.y) * 0.08;
      // springy scale so the hover pop overshoots and settles
      o.v += (o.ts - o.s) * 0.16;
      o.v *= 0.78;
      o.s += o.v;
      const bob = still ? 0 : Math.sin(t / 1300) * 5;
      if (tilt.current) {
        tilt.current.style.transform = `translateY(${bob}px) rotate(${o.x * 2.4}deg) skewX(${-o.x * 1.2}deg) rotateX(${o.y * 2}deg) scale(${o.s})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      const o = st.current;
      o.tx = Math.max(-1, Math.min(1, (e.clientX - innerWidth / 2) / (innerWidth / 2)));
      o.ty = Math.max(-1, Math.min(1, (e.clientY - innerHeight / 2) / (innerHeight / 2)));
    };
    addEventListener('pointermove', onMove);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div
      ref={wrap}
      className="portrait rise"
      style={{ '--d': '0.5s' }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') st.current.ts = 1.045; }}
      onPointerLeave={() => { st.current.ts = 1; }}
    >
      <div ref={tilt} className="portrait__tilt">
        <img className="portrait__img" src="/photos/hero-front.webp" alt={profile.fullName} draggable="false" />
      </div>
    </div>
  );
}
