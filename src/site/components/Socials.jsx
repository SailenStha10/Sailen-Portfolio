import { profile } from '../../data/site';
import SocialGlyph from './SocialGlyph';

const BRAND = {
  github: '#24292f',
  linkedin: '#0a66c2',
  instagram: 'linear-gradient(45deg, #f09433, #dc2743 55%, #bc1888)',
  youtube: '#e62117',
};
const ICON = { github: '#24292f', linkedin: '#0a66c2', instagram: '#d6249f', youtube: '#e62117' };
const NOTE = {
  github: 'Code and projects',
  linkedin: 'Work and network',
  instagram: 'Photos and life',
  youtube: 'Songs and videos',
};

/**
 * Social links. `variant`: 'round' (icon buttons), 'pill' (icon + name) or 'tile' (big card).
 * Each one fills with its brand colour on hover.
 */
export default function Socials({ className = '', variant = 'round' }) {
  // round icons lean a little towards the pointer
  const pull = (e) => {
    if (variant !== 'round') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.28}px`);
    e.currentTarget.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.28}px`);
  };
  const release = (e) => {
    e.currentTarget.style.setProperty('--mx', '0px');
    e.currentTarget.style.setProperty('--my', '0px');
  };
  return (
    <div className={`soc soc--${variant} ${className}`}>
      {profile.socials.map((s, i) => (
        <a
          key={s.label}
          onMouseMove={pull}
          onMouseLeave={release}
          className="soc__a"
          href={s.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={s.label}
          data-tip={s.label}
          style={{ '--b': BRAND[s.icon] || 'var(--accent)', '--b-c': ICON[s.icon], '--i': i }}
        >
          <span className="soc__mark" aria-hidden="true"><SocialGlyph name={s.icon} /></span>
          {variant !== 'round' && (
            <span className="soc__txt">
              <b>{s.label}</b>
              {variant === 'tile' && <small>{NOTE[s.icon]}</small>}
            </span>
          )}
          {variant !== 'round' && <span className="soc__arrow" aria-hidden="true">↗</span>}
          {variant === 'tile' && <span className="soc__ghost" aria-hidden="true"><SocialGlyph name={s.icon} /></span>}
        </a>
      ))}
    </div>
  );
}
