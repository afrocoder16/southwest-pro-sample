import { site } from '../data/site';
import { Arrow, Phone, Mail } from './Icons';

/** Every estimate button on the site goes to Ryan's existing free-estimate route. */
export function EstimateLink({ className = 'btn btn-orange', children = 'Free estimate', where = 'cta' }) {
  return (
    <a className={className} href={site.estimateUrl} target="_blank" rel="noopener noreferrer" data-estimate={where}>
      {children}
      <Arrow />
      <span className="vh"> (opens Ryan’s free estimate form on southwestpro.com in a new tab)</span>
    </a>
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

export function EmailLink({ className = 'btn btn-line', children, subject = 'Free estimate request', body = '', where = 'email' }) {
  const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  return (
    <a className={className} href={href} data-email={where}>
      <Mail />
      {children ?? 'Email Ryan'}
    </a>
  );
}
