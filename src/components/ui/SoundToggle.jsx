import { sound } from '../../lib/sound';
import { useSoundEnabled } from '../../hooks/useSound';
import Icon from './Icon';

/** Speaker icon button. */
export default function SoundToggle() {
  const on = useSoundEnabled();

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => sound.toggle()}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      title={on ? 'Sound on' : 'Sound off'}
    >
      <Icon name={on ? 'sound' : 'mute'} size={19} />
    </button>
  );
}
