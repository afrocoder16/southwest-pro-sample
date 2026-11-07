import { Link } from 'react-router-dom';
import { EstimateLink } from '../components/Links';

export default function NotFound() {
  return (
    <section className="page-hero compact">
      <div className="wrap">
        <span className="tape is-orange">404</span>
        <h1 className="h-xl">That page is still wet paint.</h1>
        <p className="lead">We couldn’t find that page. Try one of these instead.</p>
        <div className="hero-cta">
          <Link className="btn btn-ink" to="/">Back to home</Link>
          <EstimateLink where="404" />
        </div>
      </div>
    </section>
  );
}
