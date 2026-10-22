import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import CharacterSelect from './CharacterSelect';
import RunnerGame from './RunnerGame';
import Timeline from './Timeline';
import './Experience.css';

export default function Experience() {
  const [character, setCharacter] = useState(null);
  const select = useCallback((ch) => setCharacter(ch), []);

  return (
    <main className="page experience">
      <PageHeader
        eyebrow="Experience"
        title={
          <>
            Roles I’ve <span className="hl">led</span> &amp; built.
          </>
        }
      />

      <Timeline />

      <section className="bonus band band--ink">
        <div className="container">
          <Reveal className="bonus__head">
            <p className="eyebrow">Bonus level</p>
            <h2>
              {character ? (
                <>
                  Run<span className="hl">!</span>
                </>
              ) : (
                <>
                  Play to <span className="hl">unlock</span> skills.
                </>
              )}
            </h2>
          </Reveal>
        </div>
        <AnimatePresence mode="wait">
          {character ? (
            <RunnerGame key={character.id} character={character} onBack={() => setCharacter(null)} />
          ) : (
            <CharacterSelect key="select" onSelect={select} />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
