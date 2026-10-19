import { useEffect, useRef } from 'react';

const SPACING = 28;

/**
 * Fixed full-screen field of dots. Dots near the pointer light up and a slow wave
 * rolls across the grid — the "ASCII dots" feel of a retro monitor.
 */
export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const readRgb = () => getComputedStyle(document.documentElement).getPropertyValue('--dot-rgb').trim() || '150, 224, 247';
    let rgb = readRgb();
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          const wave = (Math.sin(x * 0.012 + t * 0.9) + Math.cos(y * 0.015 - t * 0.7)) * 0.5;
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const near = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
          const alpha = 0.07 + Math.max(0, wave) * 0.07 + near * 0.7;
          const size = 1.2 + near * 2.6;
          ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    };

    const loop = (time) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    const themeObserver = new MutationObserver(() => {
      rgb = readRgb();
      if (reduced) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
