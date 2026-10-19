import { useNavigate } from 'react-router-dom';
import { sessionStore, login, logout } from '../lib/session';
import { themeStore, setTheme } from '../lib/theme';
import { travel } from '../lib/travel';
import { useStore } from '../lib/store';

/** The pieces of app state the shell needs, bundled for `runCommand`. */
export function useShellState() {
  const navigate = useNavigate();
  const loggedIn = useStore(sessionStore);
  const theme = useStore(themeStore);

  return {
    loggedIn,
    theme,
    login,
    logout,
    setTheme,
    travel: (path) => travel(navigate, path),
  };
}
