import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navLinks, profile } from '../../data/site';
import Reveal from '../ui/Reveal';
import { travel } from '../../lib/travel';
import { visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';
import './Footer.css';

/** End-credits style footer. */
function NextStop() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const visitor = useStore(visitorStore);
  const index = Math.max(0, navLinks.findIndex((l) => l.to === pathname));
  const isLast = index >= navLinks.length - 1;
  const next = isLast ? navLinks[0] : navLinks[index + 1];

  return (
    <button type="button" className="nextstop px-box" onClick={() => travel(navigate, next.to)}>
      <small>
        {isLast ? 'END OF THE LINE' : `NEXT STOP${visitor ? ` FOR ${visitor.toUpperCase()}` : ''} · ${index + 2}/${navLinks.length}`}
      </small>
      <strong>{isLast ? 'Back to the start' : next.label} →</strong>
      <span className="nextstop__route" aria-hidden="true">
        {navLinks.map((l, i) => (
          <i key={l.to} className={i < index ? 'is-done' : i === index ? 'is-now' : ''} />
        ))}
      </span>
    </button>
  );
}

export default function Footer() {
  return (
    <>
      <NextStop />
      <footer className="footer">
      <div className="container footer__inner">
        <Reveal direction="none">
          <p className="footer__end">— THE END? —</p>
        </Reveal>
        <Reveal>
          <p className="footer__big">
            A film by <b>{profile.name.toUpperCase()}</b>
          </p>
        </Reveal>

        <dl className="footer__credits">
          <div>
            <dt>Written &amp; coded by</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Starring</dt>
            <dd>React · Figma · A microphone</dd>
          </div>
          <div>
            <dt>Scenes</dt>
            <dd>
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </dd>
          </div>
          <div>
            <dt>Find me on</dt>
            <dd>
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label} ↗
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <p className="footer__small">© {new Date().getFullYear()} {profile.name} · All colours reserved</p>
      </div>
      </footer>
    </>
  );
}
