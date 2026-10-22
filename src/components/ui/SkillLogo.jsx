import { useState } from 'react';
import Icon from './Icon';

const DEVICON = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${name}/${name}-original.svg`;
const OVERRIDE = {
  photoshop: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/photoshop/photoshop-plain.svg',
  illustrator: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/illustrator/illustrator-plain.svg',
};

/** A skill's logo (devicon) or drawn icon; falls back to the first letter if the image can't load. */
export default function SkillLogo({ skill, size = 56 }) {
  const [failed, setFailed] = useState(false);

  if (skill.glyph) {
    return (
      <span className="logo logo--glyph" style={{ width: size, height: size }}>
        <Icon name={skill.icon} size={size * 0.6} />
      </span>
    );
  }
  if (failed) {
    return (
      <span className="logo logo--letter" style={{ width: size, height: size }}>
        {skill.name.charAt(0)}
      </span>
    );
  }
  return (
    <img
      className="logo"
      src={OVERRIDE[skill.icon] ?? DEVICON(skill.icon)}
      alt=""
      loading="lazy"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
