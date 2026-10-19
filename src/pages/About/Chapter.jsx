import { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import CharacterVisual from './CharacterVisuals';
import Clapperboard from '../../components/ui/Clapperboard';
import { sound } from '../../lib/sound';

/**
 * A staged element: fades/slides in once the scene's scroll progress passes `at`.
 * When the scene is not pinned (small screens) it renders plainly.
 */
function Stage({ progress, at, pinned, className, as = 'div', children }) {
  const opacity = useTransform(progress, [at, at + 0.1], [0, 1]);
  const y = useTransform(progress, [at, at + 0.1], [32, 0]);
  const filter = useTransform(progress, [at, at + 0.1], ['blur(8px)', 'blur(0px)']);
  const Comp = motion[as];
  return (
    <Comp className={className} style={pinned ? { opacity, y, filter } : undefined}>
      {children}
    </Comp>
  );
}

/**
 * One story scene. On desktop the scene is pinned for ~2 screens of scrolling while its
 * pieces reveal one by one, like a title sequence. On small screens it stacks normally.
 */
export default function Chapter({ chapter, index, total, pinned }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.9, 1], [1, 1, 1, 0]);
  const frameScale = useTransform(scrollYProgress, [0, 0.35], [0.82, 1]);
  const frameRotate = useTransform(scrollYProgress, [0, 0.35], [index % 2 ? 4 : -4, 0]);
  const numberY = useTransform(scrollYProgress, [0, 1], ['10%', '-18%']);
  const meter = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Play a short chime whenever the scene comes into view
  const visible = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (visible) sound.play(chapter.id === 'climax' ? 'boom' : 'scene');
  }, [visible, chapter.id]);
  // white "cut" flash as the scene starts
  const flash = useTransform(scrollYProgress, [0, 0.02, 0.1], [0, 0.35, 0]);

  const flip = index % 2 === 1;
  const p = scrollYProgress;

  return (
    <section
      ref={ref}
      id={`scene-${chapter.id}`}
      className={`scene ${pinned ? 'scene--pinned' : ''}`}
      style={{ '--accent': chapter.accent }}
      aria-labelledby={`title-${chapter.id}`}
    >
      <div className="scene__sticky">
        <div className="scene__tint" aria-hidden="true" />
        {pinned && <motion.div className="scene__flash" style={{ opacity: flash }} aria-hidden="true" />}
        <motion.span className="scene__number" style={pinned ? { y: numberY } : undefined} aria-hidden="true">
          {chapter.number}
        </motion.span>

        <motion.div className="scene__content" style={pinned ? { opacity: sceneOpacity } : undefined}>
          <div className="container scene__top">
            <span className="scene__label">
              {chapter.label} / {String(total).padStart(2, '0')}
            </span>
            <span className="scene__meter" aria-hidden="true">
              <motion.i style={{ width: meter }} />
            </span>
          </div>

          <div className={`container scene__grid ${flip ? 'is-flipped' : ''}`}>
            <div className="scene__text">
              <Stage progress={p} at={0} pinned={pinned} className="scene__tone">
                <Clapperboard scene={index + 1} title={chapter.role} />
              </Stage>
              <Stage progress={p} at={0.02} pinned={pinned} as="h2" className="scene__title">
                <span id={`title-${chapter.id}`}>{chapter.title}</span>
              </Stage>
              <Stage progress={p} at={0.12} pinned={pinned} as="p" className="scene__quote">
                “{chapter.quote}”
              </Stage>
              <Stage progress={p} at={0.24} pinned={pinned} as="p" className="scene__meaning">
                {chapter.meaning}
              </Stage>
              <Stage progress={p} at={0.36} pinned={pinned} as="ul" className="scene__points">
                {chapter.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </Stage>
            </div>

            <motion.div
              className="scene__visual"
              style={pinned ? { scale: frameScale, rotate: frameRotate } : undefined}
            >
              <div className="viewfinder">
                <i className="viewfinder__c viewfinder__c--tl" />
                <i className="viewfinder__c viewfinder__c--tr" />
                <i className="viewfinder__c viewfinder__c--bl" />
                <i className="viewfinder__c viewfinder__c--br" />
                <span className="viewfinder__rec">
                  <b /> REC
                </span>
                <span className="viewfinder__meta">24FPS · ISO 800</span>
                <CharacterVisual kind={chapter.kind} />
              </div>
            </motion.div>
          </div>

          <Stage progress={p} at={0.5} pinned={pinned} as="p" className="scene__subtitle">
            <span>{chapter.caption}</span>
          </Stage>
        </motion.div>
      </div>
    </section>
  );
}
