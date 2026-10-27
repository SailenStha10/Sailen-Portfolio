import FitLine from '../components/FitLine';
import { TLink } from '../components/nav';

export default function NotFound() {
  return (
    <div className="page">
      <FitLine hero rows={[['Page', 'lost']]} />
      <p className="lede">That page doesn’t exist. Let’s get you back.</p>
      <TLink className="btn" to="/">Back home</TLink>
    </div>
  );
}
