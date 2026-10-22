import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Topbar } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import PageTransition from './components/layout/PageTransition';
import TerminalDock from './components/layout/TerminalDock';
import Warp from './components/layout/Warp';
import MatrixRain from './components/ui/MatrixRain';
import { AchievementToasts } from './components/ui/AchievementToasts';
import Home from './pages/Home/Home';
import Preloader from './components/layout/Preloader';
import About from './pages/About/About';
import Experience from './pages/Experience/Experience';
import Skills from './pages/Skills/Skills';
import Projects from './pages/Projects/Projects';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import { installGlobalSfx } from './lib/sound';
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
  const [booted, setBooted] = useState(false);
  const finishBoot = useCallback(() => setBooted(true), []);

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
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Warp />
      <MatrixRain />
      <AchievementToasts />

      <AnimatePresence>{!booted && <Preloader key="preloader" onDone={finishBoot} />}</AnimatePresence>

      {booted && (
        <>
          <ScrollProgress />
          <Topbar />
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <Routes location={location} key={location.pathname}>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={<PageTransition>{element}</PageTransition>} />
              ))}
            </Routes>
          </AnimatePresence>
          <Footer />
          <TerminalDock />
        </>
      )}
    </MotionConfig>
  );
}
