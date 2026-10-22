import CharacterVisual from './CharacterVisuals';

const TONES = ['yellow', 'blue', 'coral', 'mint', 'ink'];

/** One chapter panel of the walk: a character stage on one side, the words on the other. */
export default function Chapter({ chapter, index, total }) {
  const tone = TONES[index % TONES.length];

  return (
    <article
      id={`scene-${chapter.id}`}
      className={`chapter__card chapter__card--${tone}`}
      aria-labelledby={`title-${chapter.id}`}
    >
      <div className="chapter__stage" aria-hidden="true">
        <span className="chapter__number">{chapter.number}</span>
        <CharacterVisual kind={chapter.kind} />
      </div>

      <div className="chapter__text">
        <p className="chapter__label">
          {chapter.role} · {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </p>
        <h2 id={`title-${chapter.id}`}>{chapter.title}</h2>
        <blockquote className="hl">“{chapter.quote}”</blockquote>
        <ul className="chapter__points">
          {chapter.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
