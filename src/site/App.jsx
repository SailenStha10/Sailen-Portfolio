import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import WorkIndex from './pages/WorkIndex';
import Case from './pages/Case';
import Experience from './pages/Experience';
import RoleCase from './pages/RoleCase';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<WorkIndex />} />
        <Route path="work/:id" element={<Case />} />
        <Route path="experience" element={<Experience />} />
        <Route path="experience/:id" element={<RoleCase />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
