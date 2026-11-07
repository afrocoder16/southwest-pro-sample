import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { CallLink, EstimateLink } from './Links';
import { Close, Menu, Phone, Arrow, External } from './Icons';
import { site } from '../data/site';

const nav = [
  { to: '/homes', label: 'Homes' },
  { to: '/business', label: 'Business' },
  { to: '/work', label: 'Our work' },
  { to: '/about', label: 'About' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const btn = useRef(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap site-header-in">
        <Link to="/" className="brand">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-cta">
          <a className="header-phone" href={site.phoneHref}>
            <Phone /> {site.phoneDisplay}
          </a>
          <EstimateLink className="btn btn-orange btn-sm" where="header" />
        </div>

        <button
          ref={btn}
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {open && (
        <div className="sheet" id="mobile-menu">
          <nav aria-label="Mobile">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                {n.label} <Arrow />
              </NavLink>
            ))}
          </nav>
          <div className="sheet-cta">
            <EstimateLink where="menu" />
            <CallLink className="btn btn-line" where="menu" />
          </div>
        </div>
      )}
    </header>
  );
}

/** Phone only: Call + Free estimate stay one tap away on every page. */
export function StickyBar() {
  return (
    <div className="sticky-bar" role="region" aria-label="Quick actions">
      <a className="sticky-call" href={site.phoneHref} data-call="sticky">
        <Phone />
        <span>Call</span>
      </a>
      <EstimateLink className="sticky-est" where="sticky">
        Free estimate
      </EstimateLink>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="wrap footer-grid">
        <div>
          <Logo inverted />
          <p className="footer-blurb">
            Interior and exterior painting for homes and businesses in {site.region}. Free estimates.
          </p>
        </div>
        <div>
          <h2 className="footer-h">Contact</h2>
          <ul className="footer-list">
            <li>{site.owner}</li>
            <li>
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer-h">Explore</h2>
          <ul className="footer-list">
            <li><Link to="/homes">Homes</Link></li>
            <li><Link to="/business">Business</Link></li>
            <li><Link to="/work">Our work</Link></li>
            <li><Link to="/about">About Ryan</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-h">Next step</h2>
          <ul className="footer-list">
            <li>
              <a href={site.estimateUrl} target="_blank" rel="noopener noreferrer">
                Free estimate form <External className="inline-ic" />
              </a>
            </li>
            <li>
              <a href={site.hiringUrl} target="_blank" rel="noopener noreferrer">
                Hiring: Ryan’s application page <External className="inline-ic" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-note">
        <p>
          <strong>Design sample.</strong> This is a private concept prepared for Southwest Pro Painting. It is not the
          live website. Photos and the customer quote come from southwestpro.com.
        </p>
      </div>
    </footer>
  );
}
