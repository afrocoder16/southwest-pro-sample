import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { Arrow, Phone, Mail } from './Icons';

/** Every "Free estimate" button goes to the estimate form on this site. */
export function EstimateLink({ className = 'btn btn-orange', children = 'Free estimate', where = 'cta', arrow = true, onClick }) {
  return (
    <Link className={className} to="/estimate" data-estimate={where} onClick={onClick}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function MessageLink({ className = 'btn btn-line', children = 'Send us a message', where = 'message' }) {
  return (
    <Link className={className} to="/contact" data-message={where}>
      <Mail />
      {children}
    </Link>
  );
}

export function CallLink({ className = 'btn btn-line', children, where = 'call' }) {
  return (
    <a className={className} href={site.phoneHref} data-call={where}>
      <Phone />
      {children ?? <>Call {site.phoneDisplay}</>}
    </a>
  );
}
