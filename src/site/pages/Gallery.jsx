import { useEffect, useRef, useState } from 'react';
import FitLine from '../components/FitLine';
import useReveal from '../components/useReveal';
import { GALLERY } from '../content';

/** A video tile: a poster block that plays a muted preview on hover when it has a file. */
function VideoTile({ g, i, onOpen }) {
  const vid = useRef(null);
  const start = () => vid.current?.play().catch(() => {});
  const stop = () => { if (vid.current) { vid.current.pause(); vid.current.currentTime = 0; } };
  return (
    <li className="gtile gtile--video" data-reveal style={{ '--d': `${(i % 4) * 0.07}s`, '--c': g.color }}>
      <button type="button" onClick={() => onOpen(g)} onMouseEnter={start} onMouseLeave={stop} onFocus={start} onBlur={stop} aria-label={`Play ${g.caption}`}>
        {g.src ? <video ref={vid} src={g.src} muted loop playsInline preload="metadata" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
        <span className="gtile__badge">Video</span>
        <span className="gtile__play" aria-hidden="true"><i /></span>
        <span className="gallery__cap">{g.caption}</span>
      </button>
    </li>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  useReveal();

  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  const photos = GALLERY.filter((g) => g.kind !== 'video').length;
  const videos = GALLERY.length - photos;
  return (
    <div className="page">
      <FitLine hero rows={[['The', 'gallery']]} />
      <div className="gallery__strip" aria-hidden="true">
        <div>
          {[0, 1, 2, 3].map((k) => GALLERY.map((g) => <b key={g.id + k}>{g.caption}<i className="sep" /></b>))}
        </div>
      </div>
      <p className="gallery__count" data-reveal>{photos} photos · {videos} videos</p>
      <ul className="gallery">
        {GALLERY.map((g, i) => (g.kind === 'video' ? (
          <VideoTile key={g.id} g={g} i={i} onOpen={setOpen} />
        ) : (
          <li key={g.id} className="gtile" data-reveal style={{ '--d': `${(i % 4) * 0.07}s`, '--c': g.color }}>
            <button type="button" onClick={() => g.src && setOpen(g)} aria-label={g.caption}>
              {g.src ? <img src={g.src} alt="" loading="lazy" /> : <span className="gallery__art" aria-hidden="true"><i /><i /></span>}
              <span className="gallery__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="gallery__cap">{g.caption}</span>
            </button>
          </li>
        )))}
      </ul>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <figure onClick={(e) => e.stopPropagation()}>
            {open.kind === 'video'
              ? (open.src
                ? <video src={open.src} controls autoPlay playsInline />
                : open.yt
                  ? <iframe src={`https://www.youtube-nocookie.com/embed/${open.yt}?autoplay=1`} title={open.caption} allow="autoplay; encrypted-media" allowFullScreen />
                  : <p className="lightbox__empty">Add a video file or YouTube id for “{open.caption}” in content.js.</p>)
              : <img src={open.src} alt={open.caption} />}
            <figcaption>{open.caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
