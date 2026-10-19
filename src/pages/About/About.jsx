import { Link } from 'react-router-dom';
import Chapter from './Chapter';
import Countdown from './Countdown';
import IdCard from './IdCard';
import Marquee from '../../components/ui/Marquee';
import Reveal from '../../components/ui/Reveal';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { chapters, profile } from '../../data/site';
import './About.css';

const credits = [
  ['Starring', `${profile.name} as everyone`],
  ['Cast', 'The Student · Developer'],
  ['', 'Designer · Singer'],
  ['Directed by', 'Curiosity'],
  ['Written in', 'React · Node.js'],
  ['Designed in', 'Figma · Illustrator'],
  ['Music by', 'A microphone'],
  ['Catering', 'Chai, endless'],
  ['No bugs were harmed', '(some were fixed)'],
];

export default function About() {
  const wide = useMediaQuery('(min-width: 901px) and (min-height: 640px)');
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pinned = wide && !calm;

  return (
    <main className="about">
      <Countdown pinned={pinned} />

      <IdCard />

      <Marquee className="marquee--film" items={['ACTION', 'CAMERA', 'ROLL', 'CUT', 'PRINT IT']} />

      {chapters.map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} index={i} total={chapters.length} pinned={pinned} />
      ))}

      <section className="finale container" aria-labelledby="finale-title">
        <Reveal direction="none">
          <p className="finale__kicker">— FADE OUT —</p>
        </Reveal>
        <Reveal>
          <h2 id="finale-title" className="finale__title">
            The End?
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="finale__roll px-box">
          <ul aria-label="Credits">
            {credits.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2} className="finale__actions">
          <Link to="/experience" className="btn">
            ▶ Play the journey
          </Link>
          <Link to="/projects" className="btn btn--ghost">
            See the work
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
