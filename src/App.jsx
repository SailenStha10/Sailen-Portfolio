import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import PageTransition from './components/layout/PageTransition';
import Preloader from './components/layout/Preloader';
import HudOverlay from './components/layout/HudOverlay';
import TerminalDock from './components/layout/TerminalDock';
import Warp from './components/layout/Warp';
import MatrixRain from './components/ui/MatrixRain';
import { AchievementToasts } from './components/ui/AchievementToasts';
import DotField from './components/ui/DotField';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Experience from './pages/Experience/Experience';
import Skills from './pages/Skills/Skills';
import Projects from './pages/Projects/Projects';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import { installGlobalSfx, sound } from './lib/sound';
import { sessionStore } from './lib/session';
import { useStore } from './lib/store';
import { recordVisit, unlock } from './lib/achievements';
import { runMatrix } from './lib/fx';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/experience', element: <Experience /> },
  { path: '/skills', element: <Skills /> },
  { path: '/projects', element: <Projects /> },
  { path: '/contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
];


export default function App() {
  const location = useLocation();
  // The "SAILEN PRESENTS" intro plays on every fresh load
  const [booted, setBooted] = useState(false);
  const loggedIn = useStore(sessionStore);
  const firstRoute = useRef(true);
  const onHome = location.pathname === '/';

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    return installGlobalSfx();
  }, []);

  // Track visited stops (for the Globetrotter badge)
  useEffect(() => {
    recordVisit(location.pathname);
  }, [location.pathname]);

  // Hidden hook: the Konami code
  useEffect(() => {
    const code = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let at = 0;
    const onKey = (e) => {
      at = e.key.toLowerCase() === code[at] ? at + 1 : e.key.toLowerCase() === code[0] ? 1 : 0;
      if (at === code.length) {
        at = 0;
        unlock('cheat');
        runMatrix(2600);
        sound.play('grant');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Whoosh on every scene change (not on the very first load)
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    sound.play('whoosh');
  }, [location.pathname]);

  const finishBoot = () => setBooted(true);

  // Everything except the terminal and the 404 needs a login first
  const isPublic = (path) => path === '/' || path === '*';

  return (
    <MotionConfig reducedMotion="user">
      <DotField />
      <HudOverlay />
      <Warp />
      <MatrixRain />
      <AchievementToasts />
      <AnimatePresence>{!booted && <Preloader key="preloader" onDone={finishBoot} />}</AnimatePresence>

      {booted && (
        <>
          <ScrollProgress />
          <Navbar />
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <Routes location={location} key={location.pathname}>
              {routes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    isPublic(path) || loggedIn ? (
                      <PageTransition>{element}</PageTransition>
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
              ))}
            </Routes>
          </AnimatePresence>
          {!onHome && loggedIn && <Footer />}
          {!onHome && loggedIn && <TerminalDock />}
        </>
      )}
    </MotionConfig>
  );
}
