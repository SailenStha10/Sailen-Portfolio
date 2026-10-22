import { useState } from 'react';

const SRC = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${name}/${name}-original.svg`;

/** Brand logo for a social link. Instagram and YouTube are drawn inline; the others load from devicon. */
export default function SocialIcon({ name, label }) {
  const [failed, setFailed] = useState(false);

  if (name === 'instagram') {
    return (
      <svg className="social__img" viewBox="0 0 44 44" aria-hidden="true">
        <rect x="4" y="4" width="36" height="36" rx="11" fill="#d6249f" />
        <rect x="11" y="11" width="22" height="22" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="22" cy="22" r="5.5" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="29.500" cy="14.500" r="1.800" fill="#fff" />
      </svg>
    );
  }
  if (name === 'youtube') {
    return (
      <svg className="social__img" viewBox="0 0 44 44" aria-hidden="true">
        <rect x="3" y="9" width="38" height="26" rx="8" fill="#e62117" />
        <path d="M18 15.500v13l11-6.500z" fill="#fff" />
      </svg>
    );
  }
  if (failed || !name) return <span className="social__letter">{label.charAt(0)}</span>;
  return <img className="social__img" src={SRC(name)} alt="" width="44" height="44" onError={() => setFailed(true)} />;
}
