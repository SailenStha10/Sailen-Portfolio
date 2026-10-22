import { Link, useLocation } from 'react-router-dom';
import { navLinks, profile } from '../../data/site';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import { BadgeCounter } from '../ui/AchievementToasts';

/** "What's next" card at the end of every page, so nobody has to hunt for the next step. */
function NextStep() {
  const { pathname } = useLocation();
  const index = Math.max(0, navLinks.findIndex((l) => l.to === pathname));
  const isLast = index >= navLinks.length - 1;
  const next = isLast ? navLinks[0] : navLinks[index + 1];

  return (
    <Link to={next.to} className="next container">
      <span className="next__text">
        <small>{isLast ? 'That was the whole journey' : 'Up next'}</small>
        <strong>{isLast ? 'Back to the start' : next.label}</strong>
        <em>{next.blurb}</em>
      </span>
      <span className="next__steps" aria-hidden="true">
        {navLinks.slice(1).map((l, i) => (
          <i key={l.to} className={i + 1 < index ? 'is-done' : i + 1 === index ? 'is-now' : ''} />
        ))}
      </span>
      <span className="next__arrow">
        <Icon name="arrow" size={26} />
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <>
      <Reveal>
        <NextStep />
      </Reveal>
      <footer className="footer container">
        <p>
          © {new Date().getFullYear()} {profile.name} · Made with React, a lot of chai and all the colours.
        </p>
        <BadgeCounter />
        <ul>
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
