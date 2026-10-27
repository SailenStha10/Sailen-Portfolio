import { useEffect, useRef } from 'react';

/**
 * Bold words fitted edge to edge, like the name in the reference hero.
 * rows: [['Selected', 'work']] — each inner array is one row; the widest row fills the width.
 * The words rise out of their masks when the line enters view (or, with `hero`, when the loader lifts).
 */
export default function FitLine({ rows, hero = false, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const box = el.parentElement;
    const fit = () => {
      el.style.fontSize = '100px';
      const widest = Math.max(...[...el.querySelectorAll('.fit__row')].map((r) => r.getBoundingClientRect().width));
      const room = box.clientWidth - parseFloat(getComputedStyle(box).paddingInline) * 2;
      if (widest > 0 && room > 0) el.style.fontSize = `${(100 * room) / widest}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);

    const show = () => el.classList.add('is-in');
    let io;
    const onGo = () => show();
    if (hero) {
      if (document.documentElement.classList.contains('is-go')) show();
      else window.addEventListener('site-go', onGo, { once: true });
    } else {
      io = new IntersectionObserver(([e]) => e.isIntersecting && (show(), io.disconnect()), { threshold: 0.25 });
      io.observe(el);
    }
    return () => {
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener('site-go', onGo);
    };
  }, [hero]);

  let n = 0;
  return (
    <Tag ref={ref} className={`fit ${className}`}>
      {rows.map((row, i) => (
        <span className="fit__row" key={i}>
          {row.map((w) => (
            <span className="fit__word" key={w}>
              <span style={{ '--d': `${n++ * 0.12}s` }}>{w}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
