import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/site';
import Socials from './Socials';

export default function IdCard() {
  const wrap = useRef(null);
  const card = useRef(null);
  const st = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, flip: 0, tflip: 0, drag: false, sx: 0, base: 0, moved: false });
  const [back, setBack] = useState(false);

  useEffect(() => {
    let raf;
    const loop = (t) => {
      const o = st.current;
      o.rx += (o.tx - o.rx) * 0.1;
      o.ry += (o.ty - o.ry) * 0.1;
      o.flip += (o.tflip - o.flip) * 0.1;
      if (card.current) {
        const sway = o.drag || Math.abs(o.tx) + Math.abs(o.ty) > 0.1 ? 0 : Math.sin(t / 1100) * 4;
        card.current.style.transform = `rotateX(${o.rx}deg) rotateY(${o.ry + o.flip + sway}deg)`;
        card.current.style.setProperty('--gx', `${50 + o.ry * 2.2}%`);
        card.current.style.setProperty('--gy', `${50 - o.rx * 2.2}%`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (e) => {
    const o = st.current;
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (o.drag) {
      o.moved = true;
      o.tflip = o.base + (e.clientX - o.sx) * 0.6;
    } else {
      o.ty = x * 24;
      o.tx = -y * 20;
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
    // snap to nearest face (front = 0, back = 180 mod 360)
    const face = Math.round(o.tflip / 180);
    o.tflip = face * 180;
    setBack(Math.abs(face) % 2 === 1);
    if (!o.moved) {
      o.tflip += 180;
      setBack((b) => !b);
    }
  };
  const leave = () => { const o = st.current; if (!o.drag) { o.tx = 0; o.ty = 0; } };

  return (
    <div className="idwrap rise" style={{ '--d': '0.6s' }}>
      <div className="lanyard" aria-hidden="true"><span /></div>
      <div
        ref={wrap}
        className="idscene"
        onPointerMove={move}
        onPointerDown={down}
        onPointerUp={up}
        onPointerLeave={leave}
        role="img"
        aria-label={`${profile.fullName} ID card. Drag or click to flip.`}
      >
        <div ref={card} className="idcard">
          <div className="idface idface--front">
            <div className="idface__top"><b>©{profile.name}</b><span>ID · 2026</span></div>
            <div className="idface__photo">
              {profile.photo ? <img src={profile.photo} alt="" draggable="false" /> : <span>{profile.initial}</span>}
            </div>
            <h3>{profile.fullName}</h3>
            <p className="idface__role">{profile.roles[0]} + {profile.roles[1]}</p>
            <ul className="idface__chips">
              {['React', 'Figma', 'Node.js', 'Vocals'].map((c) => <li key={c}>{c}</li>)}
            </ul>
            <div className="idface__bar" aria-hidden="true">
              {Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: 1 + ((i * 7) % 4) }} />)}
            </div>
            <span className="idface__hint">{back ? '' : 'Drag to spin · click to flip'}</span>
            <span className="idface__glare" />
          </div>
          <div className="idface idface--back">
            <div className="idface__top"><b>Contact</b><span>Open to work</span></div>
            <div className="qr" aria-hidden="true">
              {Array.from({ length: 121 }, (_, i) => <i key={i} className={(i * 37 + (i >> 2) * 11) % 3 === 0 ? 'on' : ''} />)}
            </div>
            <p className="idface__mail">{profile.email}</p>
            <p className="idface__loc">{profile.location}</p>
            <Socials className="idface__soc" />
            <span className="idface__glare" />
          </div>
        </div>
      </div>
    </div>
  );
}

