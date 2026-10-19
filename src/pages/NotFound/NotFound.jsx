import { Link } from 'react-router-dom';
import GlitchText from '../../components/ui/GlitchText';
import SplitText from '../../components/ui/SplitText';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="page not-found">
      <div className="container not-found__inner">
        <p className="not-found__code">
          <GlitchText className="glitch--auto">404</GlitchText>
        </p>
        <SplitText as="h1" className="section-title" text="Signal lost." delay={0.6} />
        <p className="section-lead">This scene was cut from the final edit.</p>
        <Link to="/" className="btn not-found__btn">
          ▶ Back to the start
        </Link>
      </div>
    </main>
  );
}
