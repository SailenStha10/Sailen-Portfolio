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
  return (
    <div className={`soc soc--${variant} ${className}`}>
      {profile.socials.map((s) => (
        <a
          key={s.label}
          className="soc__a"
          href={s.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={s.label}
          data-tip={s.label}
          style={{ '--b': BRAND[s.icon] || 'var(--accent)', '--b-c': ICON[s.icon] }}
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
