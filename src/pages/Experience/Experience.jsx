import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { visitorStore } from '../../lib/session';
import { useStore } from '../../lib/store';
import CharacterSelect from './CharacterSelect';
import RunnerGame from './RunnerGame';
import './Experience.css';

export default function Experience() {
  const [character, setCharacter] = useState(null);
  const visitor = useStore(visitorStore);
  const select = useCallback((ch) => setCharacter(ch), []);

  return (
    <main className="page experience">
      <PageHeader
        scene="Stage 03"
        eyebrow="Experience"
        title={character ? `Run, ${visitor || 'player'}. Unlock.` : `${visitor || 'Player'}, choose your character.`}
        lead={
          character
            ? 'Reach every checkpoint to unlock a skill.'
            : 'Each character runs a different level and unlocks different skills.'
        }
      />
      <AnimatePresence mode="wait">
        {character ? (
          <RunnerGame key={character.id} character={character} onBack={() => setCharacter(null)} />
        ) : (
          <CharacterSelect key="select" onSelect={select} />
        )}
      </AnimatePresence>
    </main>
  );
}
