/**
 * Flat, solid-colour illustrations (no gradients). Each one is a 200×160 scene that
 * uses the theme tokens, so it re-colours itself in light and dark mode.
 */
const I = 'var(--ink)';
const Y = 'var(--yellow)';
const C = 'var(--coral)';
const B = 'var(--blue)';
const M = 'var(--mint)';
const P = 'var(--bg-2)';

const SCENES = {
  laptop: (
    <>
      <circle cx="160" cy="36" r="22" fill={Y} stroke={I} strokeWidth="3" />
      <rect x="38" y="30" width="124" height="82" rx="8" fill={B} stroke={I} strokeWidth="3" />
      <rect x="48" y="40" width="104" height="62" rx="3" fill={P} stroke={I} strokeWidth="2" />
      <path d="M70 62 58 71l12 9M130 62l12 9-12 9M110 55 90 87" stroke={I} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 118h160l-12 20H32z" fill={C} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <rect x="82" y="124" width="36" height="6" rx="3" fill={I} />
    </>
  ),
  palette: (
    <>
      <path d="M100 20c42 0 76 28 76 62 0 18-12 22-26 20-14-2-18 8-10 18 6 8 2 22-20 22-44 0-76-30-76-64s14-58 56-58Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="64" cy="70" r="11" fill={C} stroke={I} strokeWidth="3" />
      <circle cx="96" cy="48" r="11" fill={B} stroke={I} strokeWidth="3" />
      <circle cx="132" cy="62" r="11" fill={M} stroke={I} strokeWidth="3" />
      <circle cx="74" cy="108" r="11" fill={P} stroke={I} strokeWidth="3" />
      <path d="M150 20l26 26M176 20l-10 10" stroke={I} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  mic: (
    <>
      <circle cx="100" cy="82" r="62" fill={C} stroke={I} strokeWidth="3" />
      <rect x="78" y="22" width="44" height="72" rx="22" fill={P} stroke={I} strokeWidth="3" />
      <path d="M78 52h44M78 66h44" stroke={I} strokeWidth="3" />
      <path d="M62 80c0 26 16 42 38 42s38-16 38-42M100 122v22M78 146h44" stroke={I} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M26 40l10 4M20 70h12M170 40l-10 4M180 70h-12" stroke={I} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  plane: (
    <>
      <circle cx="100" cy="82" r="64" fill={Y} stroke={I} strokeWidth="3" />
      <path d="M30 78 168 30 132 132 98 104 78 124 74 98Z" fill={P} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <path d="M74 98 168 30 98 104Z" fill={B} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 120h26M24 136h22" stroke={I} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  book: (
    <>
      <rect x="30" y="34" width="140" height="96" rx="8" fill={M} stroke={I} strokeWidth="3" />
      <path d="M100 34v96" stroke={I} strokeWidth="3" />
      <path d="M44 56h42M44 72h42M44 88h30M114 56h42M114 72h42M114 88h30" stroke={I} strokeWidth="4" strokeLinecap="round" />
      <path d="M150 12l6 14 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  crown: (
    <>
      <circle cx="100" cy="86" r="62" fill={B} stroke={I} strokeWidth="3" />
      <path d="M44 110 36 56l36 28 28-40 28 40 36-28-8 54Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <rect x="44" y="110" width="112" height="16" rx="4" fill={C} stroke={I} strokeWidth="3" />
      <circle cx="36" cy="54" r="7" fill={P} stroke={I} strokeWidth="3" />
      <circle cx="100" cy="42" r="7" fill={P} stroke={I} strokeWidth="3" />
      <circle cx="164" cy="54" r="7" fill={P} stroke={I} strokeWidth="3" />
    </>
  ),
  people: (
    <>
      <rect x="14" y="108" width="172" height="34" rx="6" fill={Y} stroke={I} strokeWidth="3" />
      <circle cx="56" cy="56" r="20" fill={C} stroke={I} strokeWidth="3" />
      <path d="M22 108c0-24 14-38 34-38s34 14 34 38Z" fill={C} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="144" cy="56" r="20" fill={M} stroke={I} strokeWidth="3" />
      <path d="M110 108c0-24 14-38 34-38s34 14 34 38Z" fill={M} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="38" r="16" fill={B} stroke={I} strokeWidth="3" />
      <path d="M72 92c0-20 12-32 28-32s28 12 28 32Z" fill={B} stroke={I} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  building: (
    <>
      <rect x="22" y="132" width="156" height="10" rx="3" fill={I} />
      <rect x="40" y="30" width="72" height="102" fill={B} stroke={I} strokeWidth="3" />
      <rect x="112" y="64" width="54" height="68" fill={C} stroke={I} strokeWidth="3" />
      <path d="M54 46h12v12H54zM86 46h12v12H86zM54 76h12v12H54zM86 76h12v12H86zM126 80h12v12h-12zM146 80h8v12h-8z" fill={Y} stroke={I} strokeWidth="2" />
      <rect x="68" y="104" width="18" height="28" fill={P} stroke={I} strokeWidth="3" />
      <circle cx="162" cy="30" r="14" fill={Y} stroke={I} strokeWidth="3" />
    </>
  ),
  pen: (
    <>
      <circle cx="100" cy="82" r="62" fill={M} stroke={I} strokeWidth="3" />
      <path d="M46 126 54 94 130 18l28 28-76 76Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <path d="M130 18l28 28" stroke={I} strokeWidth="3" />
      <path d="M46 126 54 94l24 24Z" fill={P} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <path d="M118 128h50M138 144h30" stroke={I} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  star: (
    <>
      <circle cx="100" cy="82" r="64" fill={C} stroke={I} strokeWidth="3" />
      <path d="m100 22 18 38 42 6-30 30 7 42-37-20-37 20 7-42-30-30 42-6Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
};

export const ART_FOR = { Development: 'laptop', Design: 'palette', Music: 'mic' };

export default function Art({ name, className = '', label }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={`art ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {SCENES[name] ?? SCENES.star}
    </svg>
  );
}
