import { useEffect, useRef } from 'react';

/** The phone: leans toward the pointer, spins when dragged and flips to its other side on click. */
export default function PhoneFlip({ className = '' }) {
  const wrap = useRef(null);
  const obj = useRef(null);
  const st = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, flip: 0, tflip: 0, drag: false, sx: 0, base: 0, moved: false });

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const loop = (t) => {
      const o = st.current;
      o.rx += (o.tx - o.rx) * 0.1;
      o.ry += (o.ty - o.ry) * 0.1;
      o.flip += (o.tflip - o.flip) * 0.1;
      if (obj.current) {
        const idle = still || o.drag || Math.abs(o.tx) + Math.abs(o.ty) > 0.1 ? 0 : Math.sin(t / 1300) * 5;
        const bob = still || o.drag ? 0 : Math.sin(t / 1700) * 8;
        obj.current.style.transform = `translateY(${bob.toFixed(1)}px) rotateX(${o.rx}deg) rotateY(${o.ry + o.flip + idle}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (e) => {
    const o = st.current;
    const r = wrap.current.getBoundingClientRect();
    if (o.drag) {
      o.moved = true;
      o.tflip = o.base + (e.clientX - o.sx) * 0.7;
    } else {
      o.ty = ((e.clientX - r.left) / r.width - 0.5) * 26;
      o.tx = -((e.clientY - r.top) / r.height - 0.5) * 22;
    }
  };
  const down = (e) => {
    const o = st.current;
    o.drag = true; o.moved = false; o.sx = e.clientX; o.base = o.tflip;
    wrap.current.setPointerCapture(e.pointerId);
  };
  const up = () => {
    const o = st.current;
    o.drag = false;
    o.tflip = Math.round(o.tflip / 180) * 180; // settle on a face
    if (!o.moved) o.tflip += 180; // a plain click turns it over
  };
  const leave = () => { const o = st.current; if (!o.drag) { o.tx = 0; o.ty = 0; } };

  return (
    <div
      ref={wrap}
      className={`phone ${className}`}
      onPointerMove={move}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={leave}
      role="img"
      aria-label="A phone. Drag to spin it, or click to see the other side."
    >
      <div ref={obj} className="phone__obj">
        <img className="phone__face" src="/phone.webp" alt="" draggable="false" />
        <img className="phone__face phone__face--back" src="/phone-back.webp" alt="" draggable="false" />
      </div>
    </div>
  );
}
