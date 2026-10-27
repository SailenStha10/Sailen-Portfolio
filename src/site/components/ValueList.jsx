import { useState } from 'react';

/**
 * Two axes: the titles run down the left (y), and the selected one opens in a fixed panel on the
 * right (x). Hover, focus or click a title to change the panel. Nothing shifts position, so the
 * list stays steady under the cursor.
 */
export default function ValueList({ items }) {
  const [on, setOn] = useState(0);
  const pad = (n) => String(n + 1).padStart(2, '0');
  const v = items[on];
  return (
    <div className="vl" data-reveal>
      <ul className="vl__list" role="tablist" aria-orientation="vertical">
        {items.map((it, i) => (
          <li key={it.title}>
            <button
              role="tab"
              aria-selected={on === i}
              className={`vl__tab ${on === i ? 'is-on' : ''}`}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
            >
              <span className="vl__no">{pad(i)}</span>
              <span className="vl__name">{it.title}</span>
              <i className="vl__arrow" aria-hidden="true">→</i>
            </button>
          </li>
        ))}
      </ul>
      <div className="vl__panel" role="tabpanel">
        <span className="vl__ghost" aria-hidden="true" key={`n${on}`}>{pad(on)}</span>
        <div className="vl__copy" key={on}>
          <p className="vl__count">{pad(on)} / {pad(items.length - 1)}</p>
          <h3>{v.title}</h3>
          <p className="vl__text">{v.text}</p>
        </div>
        <div className="vl__dots" aria-hidden="true">
          {items.map((it, i) => <i key={it.title} className={i === on ? 'is-on' : ''} />)}
        </div>
      </div>
    </div>
  );
}
