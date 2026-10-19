import { PLAYER_BODY as PLAYER_ROWS, LEGS_A as LEGS_A_ROWS, LEGS_B as LEGS_B_ROWS } from '../../lib/sprites';

const PALETTE = {
  h: 'var(--ink)',
  s: '#e9c9a3',
  e: '#050505',
  p: 'color-mix(in srgb, var(--ink) 55%, var(--bg))',
  g: 'color-mix(in srgb, var(--ink) 70%, var(--bg))',
  c: 'var(--cyan)',
  o: 'var(--orange)',
};

const cells = (rows, yOffset = 0) =>
  rows.flatMap((row, y) =>
    [...row].map((ch, x) => (ch === '.' ? null : { x, y: y + yOffset, ch })).filter(Boolean),
  );

/** Draws rows of pixel-art characters as crisp SVG rects. */
export default function PixelSprite({
  rows,
  extra = [],
  legs,
  accent = 'var(--cyan)',
  className = '',
  label,
}) {
  const body = cells(rows);
  const legCells = legs ? cells(legs, rows.length) : [];
  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length + (legs ? legs.length : 0);
  const fill = (ch) => (ch === 'b' ? accent : PALETTE[ch]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`sprite ${className}`}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {[...body, ...legCells].map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="1.02" height="1.02" fill={fill(c.ch)} />
      ))}
      {extra.map(([x, y, ch]) => (
        <rect key={`x${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill(ch)} />
      ))}
    </svg>
  );
}

/** The player character with animated running legs (two frames toggled in CSS). */
export function Runner({ running, accent }) {
  return (
    <span className={`runner ${running ? 'is-running' : ''}`}>
      <span className="runner__legs runner__legs--a">
        <PixelSprite rows={PLAYER_ROWS} legs={LEGS_A_ROWS} accent={accent} />
      </span>
      <span className="runner__legs runner__legs--b">
        <PixelSprite rows={PLAYER_ROWS} legs={LEGS_B_ROWS} accent={accent} />
      </span>
    </span>
  );
}
