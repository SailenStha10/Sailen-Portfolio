import { useState } from 'react';
import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';
import useReveal from '../components/useReveal';
import { FAQ, SERVICES, STEPS } from '../content';

export default function Services() {
  const [open, setOpen] = useState(0);
  useReveal();
  return (
    <div className="page">
      <FitLine hero rows={[['What', 'I do']]} />
      <p className="lede" data-reveal>Three ways to work together. Each has a clear scope, a clear timeline and one person responsible.</p>
      <ol className="pack">
        {SERVICES.map((s, i) => (
          <li key={s.id} className="pack__item" data-reveal style={{ '--d': `${i * 0.1}s` }}>
            <span className="pack__no">0{i + 1}</span>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="pack__foot"><span>{s.time}</span><TLink to="/contact">Start →</TLink></div>
          </li>
        ))}
      </ol>

      <h2 className="h2" data-reveal>How it works</h2>
      <ol className="steps">
        {STEPS.map(([t, d], i) => (
          <li key={t} data-reveal style={{ '--d': `${i * 0.08}s` }}>
            <span>0{i + 1}</span><h3>{t}</h3><p>{d}</p>
          </li>
        ))}
      </ol>

      <h2 className="h2" data-reveal>Questions</h2>
      <div className="faq" data-reveal>
        {FAQ.map(([q, a], i) => (
          <div key={q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span><i />
            </button>
            <div className="faq__a"><p>{a}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
