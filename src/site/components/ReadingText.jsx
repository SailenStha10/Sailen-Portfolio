import { useEffect, useRef } from 'react';

/** Words start dim and light up as they cross a reading line about two thirds down the screen. */
export default function ReadingText({ text, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const words = [...ref.current.querySelectorAll('span')];
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.68;
      words.forEach((w) => w.classList.toggle('is-lit', w.getBoundingClientRect().top < line));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <p ref={ref} className={`reading ${className}`}>
      {text.split(' ').map((w, i) => <span key={i}>{w} </span>)}
    </p>
  );
}
