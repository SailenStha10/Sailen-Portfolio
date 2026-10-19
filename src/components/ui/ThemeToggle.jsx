import { toggleTheme, themeStore } from '../../lib/theme';
import { useStore } from '../../lib/store';
import { unlock } from '../../lib/achievements';

/** Switches between the black (dark) and cream (light) screens. */
export default function ThemeToggle() {
  const theme = useStore(themeStore);
  const next = theme === 'dark' ? 'cream' : 'black';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        toggleTheme();
        unlock('theme');
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span aria-hidden="true" className="theme-toggle__icon" />
      <span className="theme-toggle__label">{theme === 'dark' ? 'BLACK' : 'CREAM'}</span>
    </button>
  );
}
