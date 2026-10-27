import { useEffect, useRef, useState } from 'react';
import FitLine from '../components/FitLine';
import useReveal from '../components/useReveal';
import { GALLERY } from '../content';

const DRIFT = [0.05, -0.08, 0.1, -0.05, 0.07, -0.1, 0.06];

export default function Gallery() {
  const grid = useRef(null);
  const [open, setOpen] = useState(null);
  useReveal();

  // Each tile drifts at its own pace as the page scrolls
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [...grid.current.children];
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = innerHeight / 2;
      items.forEach((el, i) => {
        const b = el.getBoundingClientRect();
        if (b.bottom < -200 || b.top > innerHeight + 200) return;
        const centre = b.top + b.height / 2 - (parseFloat(el.style.getPropertyValue('--p')) || 0);
        el.style.setProperty('--p', ((centre - mid) * DRIFT[i % DRIFT.length]).toFixed(1));
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  return (
    <div className="page">
      <FitLine hero rows={[['The', 'gallery']]} />
      <div className="gallery__strip" aria-hidden="true">
        <div>
          {[0, 1, 2, 3].map((k) => GALLERY.map((g) => <b key={g.id + k}>{g.caption}<i className="sep" /></b>))}
        </div>
      </div>
      <div className="gallery" ref={grid}>
        {GALLERY.map((g, i) => (
          <button
            key={g.id}
            className={`gallery__item g--${g.size}`}
            data-reveal
            style={{ '--d': `${(i % 3) * 0.1}s`, '--c': g.color }}
            onClick={() => g.src && setOpen(g)}
            aria-label={g.caption}
          >
            {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
            <span className="gallery__no">{String(i + 1).padStart(2, '0')}</span>
            <span className="gallery__cap">{g.caption}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <figure><img src={open.src} alt={open.caption} /><figcaption>{open.caption}</figcaption></figure>
        </div>
      )}
    </div>
  );
}
