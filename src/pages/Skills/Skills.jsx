import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import SkillLogo from '../../components/ui/SkillLogo';
import Icon from '../../components/ui/Icon';
import { skillGroups } from '../../data/site';
import './Skills.css';

const TONE = { dev: 'blue', design: 'coral', music: 'mint' };
const ALL = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g })));

/**
 * An index of skills with a big live preview: point at a name and the logo on the right
 * swaps with a wipe. Filter by area at the top.
 */
export default function Skills() {
  const [filter, setFilter] = useState('all');
  const [activeName, setActiveName] = useState(ALL[0].name);

  const visible = filter === 'all' ? ALL : ALL.filter((s) => s.group.id === filter);
  const active = visible.find((s) => s.name === activeName) ?? visible[0];
  const countOf = (id) => (id === 'all' ? ALL.length : ALL.filter((s) => s.group.id === id).length);

  return (
    <main className="page skills">
      <PageHeader
        eyebrow="Skills"
        title={
          <>
            My <span className="hl">toolbox.</span>
          </>
        }
      />

      <section className="container showcase">
        <div className="filters" role="group" aria-label="Filter skills">
          {[{ id: 'all', label: 'All' }, ...skillGroups].map((g) => (
            <button
              key={g.id}
              type="button"
              className={`filters__btn ${g.id === filter ? 'is-active' : ''}`}
              aria-pressed={g.id === filter}
              onClick={() => {
                setFilter(g.id);
                setActiveName((g.id === 'all' ? ALL : ALL.filter((s) => s.group.id === g.id))[0].name);
              }}
            >
              {g.label}
              <span>{countOf(g.id)}</span>
            </button>
          ))}
        </div>

        <div className="showcase__grid">
          <ol className="slist">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((s, i) => (
                <motion.li
                  key={s.name}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    className={`srow ${s.name === active.name ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveName(s.name)}
                    onFocus={() => setActiveName(s.name)}
                    onClick={() => setActiveName(s.name)}
                  >
                    <span className="srow__thumb" aria-hidden="true">
                      <SkillLogo skill={s} size={42} />
                    </span>
                    <span className="srow__no">{String(ALL.indexOf(s) + 1).padStart(2, '0')}</span>
                    <span className="srow__title">{s.name}</span>
                    <span className="srow__cat">{s.group.label}</span>
                    <Icon name="arrow" size={24} className="srow__go" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>

          <aside className="spreview" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                className={`spreview__pane spreview__pane--${TONE[active.group.id]}`}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ clipPath: 'inset(0 0 0 100%)' }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              >
                <span className="spreview__big">{String(ALL.indexOf(active) + 1).padStart(2, '0')}</span>
                <motion.div
                  className="spreview__logo"
                  initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 160, damping: 13 }}
                >
                  <SkillLogo skill={active} size={170} />
                </motion.div>
                <div className="spreview__foot">
                  <strong>{active.name}</strong>
                  <span className="chip">{active.group.label}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </section>
    </main>
  );
}
