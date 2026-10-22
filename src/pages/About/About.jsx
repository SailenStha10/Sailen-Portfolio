import { Link } from 'react-router-dom';
import IdCard from './IdCard';
import ScrollText from './ScrollText';
import Points from './Points';
import Walk from './Walk';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { chapters } from '../../data/site';
import './About.css';

const STATEMENT = chapters.map((c) => c.quote).join(' ');

export default function About() {
  return (
    <main className="page about">
      <PageHeader
        eyebrow="About"
        title={
          <>
            Five characters, <span className="hl">one</span> person.
          </>
        }
      />

      <IdCard />

      <ScrollText text={STATEMENT} />

      <Walk />

      <Points />

      <section className="finale band band--ink">
        <div className="container finale__inner">
          <Reveal>
            <h2>
              Now <span className="hl">play</span> it.
            </h2>
            <div className="finale__actions">
              <Link to="/experience" className="btn btn--lg">
                See my experience
              </Link>
              <Link to="/projects" className="btn btn--ghost btn--lg">
                See the work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
