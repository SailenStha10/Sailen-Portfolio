import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="page not-found">
      <div className="container not-found__inner">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">This page wandered off.</h1>
        <p className="not-found__lead">Maybe it was cut from the final edit. Let’s get you back on the journey.</p>
        <Link to="/" className="btn btn--violet btn--lg">
          Back to the start
        </Link>
      </div>
    </main>
  );
}
