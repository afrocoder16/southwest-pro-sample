import { Link } from 'react-router-dom';
import { fallOffers, fallPerk } from '../data/promos';
import { hiring, site, estimateLine, estimateSub } from '../data/site';
import { EstimateLink, MessageLink } from './Links';
import { useEstimate } from './EstimateContext';
import { BeforeAfterViewer } from './Compare';
import Reviews from './Reviews';
import { Pic } from './Photo';
import { Arrow, Check } from './Icons';

/* ---------- fall promo ---------- */

const MAPLE = 'M50 4 58 27 79 16 72 40 96 37 81 55 93 70 67 68 62 96 50 82 38 96 33 68 7 70 19 55 4 37 28 40 21 16 42 27Z';
const ROUND = 'M50 6C82 24 88 62 50 94 12 62 18 24 50 6Z';
const LEAVES = [
  { x: 4, s: 46, t: 19, d: -4, sway: 40, rot: 200, c: '#f0a53a', k: 'maple' },
  { x: 13, s: 30, t: 24, d: -15, sway: -30, rot: -240, c: '#d9622b', k: 'round' },
  { x: 24, s: 54, t: 21, d: -9, sway: 50, rot: 160, c: '#c8801f', k: 'maple' },
  { x: 37, s: 28, t: 26, d: -20, sway: -40, rot: 300, c: '#f2c14e', k: 'round' },
  { x: 49, s: 42, t: 18, d: -2, sway: 36, rot: -180, c: '#e0562a', k: 'maple' },
  { x: 61, s: 34, t: 23, d: -12, sway: -34, rot: 220, c: '#f0a53a', k: 'round' },
  { x: 72, s: 56, t: 22, d: -7, sway: 44, rot: -200, c: '#b8452a', k: 'maple' },
  { x: 83, s: 30, t: 25, d: -18, sway: -28, rot: 260, c: '#f2c14e', k: 'maple' },
  { x: 91, s: 44, t: 20, d: -5, sway: 30, rot: -150, c: '#d9622b', k: 'round' },
  { x: 55, s: 24, t: 27, d: -23, sway: 24, rot: 180, c: '#e8a23a', k: 'round' },
];

function Leaves() {
  return (
    <div className="leaves" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{ '--x': `${l.x}%`, '--s': `${l.s}px`, '--t': `${l.t}s`, '--d': `${l.d}s`, '--sway': `${l.sway}px`, '--rot': `${l.rot}deg`, '--ty': `${(i * 37) % 80}%` }}
        >
          <svg viewBox="0 0 100 100" focusable="false">
            <path d={l.k === 'maple' ? MAPLE : ROUND} fill={l.c} />
            {l.k === 'round' && <path d="M50 14V90M50 40 34 28M50 54 66 40M50 68 36 58" stroke="#7a2e12" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />}
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Autumn offers right under the hero. The offers are labelled as samples on the page itself. */
export function FallPromo() {
  const { patch } = useEstimate();
  return (
    <section className="fall" aria-labelledby="fall-h">
      <Leaves />
      <div className="wrap fall-in">
        <div className="fall-head">
          <div className="fall-tags">
            <span className="tape is-paper">Fall &amp; winter offers</span>
            <span className="sample-pill">Sample offers</span>
          </div>
          <h2 className="h-lg" id="fall-h">Fall into a fresh look.</h2>
          <p className="lead">
            Outdoor painting season is winding down, which makes now a great time to refresh a room, a kitchen or a
            whole floor, and to get on the calendar for spring.
          </p>
        </div>

        <ul className="offers">
          {fallOffers.map((o) => (
            <li key={o.id}>
              <article className="offer" style={{ '--chip': o.color }}>
                <div className={`offer-chip${o.ink ? ' on-light' : ''}`}>
                  <span>{o.chip}</span>
                </div>
                <div className="offer-body">
                  <p className="offer-when">{o.when}</p>
                  <h3>{o.title}</h3>
                  <p className="offer-big">{o.big}</p>
                  <p>{o.body}</p>
                  <EstimateLink className="btn btn-orange btn-sm" where={`offer-${o.id}`} onClick={() => patch({ offer: o.title })}>
                    Claim at your estimate
                  </EstimateLink>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="fall-foot">
          <div>
            <p className="fall-estimate"><strong>{estimateLine}</strong> {estimateSub}</p>
            <p className="fall-perk"><Check /> {fallPerk}</p>
          </div>
          <div className="fall-cta">
            <EstimateLink where="fall-foot">Free estimate form</EstimateLink>
            <MessageLink where="fall-foot" />
          </div>
        </div>
        <p className="fall-fine">
          Sample offers for design purposes only. The real offers and terms are set by {site.name}. Mention an offer when
          you request your estimate.
        </p>
      </div>
    </section>
  );
}

/* ---------- before / after + reviews ---------- */

export function ResultsSection({ id = 'results', title = 'See the difference. Hear it from them.', intro }) {
  return (
    <section className="results on-dark" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap section">
        <div className="head">
          <span className="tape is-orange">Before and after</span>
          <h2 className="h-lg" id={`${id}-h`}>{title}</h2>
          <p className="lead">
            {intro ?? 'Drag the roller across each job to paint in the after. Then read what our customers have to say.'}
          </p>
        </div>
        <div className="results-grid">
          <BeforeAfterViewer id={`${id}-viewer`} />
          <Reviews />
        </div>
      </div>
    </section>
  );
}

/* ---------- about teaser (the only home-page section that names the owner) ---------- */

export function AboutTeaser() {
  return (
    <section className="section about-tease" data-allow-name aria-labelledby="at-h">
      <div className="wrap about-tease-grid">
        <div className="about-tease-pic reveal">
          <Pic id="detail-cut" sizes="(min-width: 900px) 520px, 90vw" ratio="4/3" />
        </div>
        <div className="about-tease-copy reveal" style={{ '--d': '.08s' }}>
          <span className="tape">About us</span>
          <h2 className="h-lg" id="at-h">Meet the owner.</h2>
          <p className="lead">
            {site.owner} owns and runs {site.name}. His stated mission is to consistently provide quality work, keep
            pricing affordable and offer professional service in the region.
          </p>
          <blockquote className="mini-quote">
            <p>“I look forward to meeting you and having the opportunity to earn your business!”</p>
            <footer>{site.owner}, owner</footer>
          </blockquote>
          <Link className="btn btn-ink" to="/about">
            More about us <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- now hiring ---------- */

export function HiringBand() {
  return (
    <section className="hiring" aria-labelledby="hire-h">
      <div className="wrap hiring-in">
        <div className="hiring-copy">
          <span className="tape is-night">Now hiring</span>
          <h2 className="h-lg" id="hire-h">{hiring.headline}.</h2>
          <p className="lead">
            {hiring.intro} {hiring.looking}
          </p>
        </div>
        <div className="hiring-card">
          <ul>
            {hiring.roles.map((r) => (
              <li key={r}><Check /> {r}</li>
            ))}
          </ul>
          <p>{hiring.hours}</p>
          <Link className="btn btn-orange" to="/careers">
            Apply now <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
