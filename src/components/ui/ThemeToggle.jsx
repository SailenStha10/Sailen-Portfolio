import { toggleTheme, themeStore } from '../../lib/theme';
import { useStore } from '../../lib/store';
import { unlock } from '../../lib/achievements';
import Icon from './Icon';

/** Switches between the light and dark themes. */
export default function ThemeToggle() {
  const theme = useStore(themeStore);
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => {
        toggleTheme();
        unlock('theme');
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
    </button>
  );
}
