import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Finder, Fan } from '../components/Finder';
import { EstimateLink, CallLink } from '../components/Links';
import { Lightbox, Pic, ChipCard } from '../components/Photo';
import { EstimatePanel } from '../components/Estimate';
import { FallPromo, ResultsSection, AboutTeaser, HiringBand } from '../components/Sections';
import { useEstimate } from '../components/EstimateContext';
import { Arrow } from '../components/Icons';

const ribbon = ['barn-after', 'room-tray', 'pizza-hut', 'door-after', 'ambulance', 'kitchen-after', 'cherry-berry', 'house-after'];

export default function Home() {
  const { notes, patch } = useEstimate();
  const [lb, setLb] = useState({ ids: [], index: null });
  const open = (ids, index) => setLb({ ids, index });

  return (
    <>
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="tape">Southwest Minnesota · Homes &amp; businesses</span>
            <h1 className="h-xl" id="hero-h">
              What are you{' '}
              <span className="mark">
                painting?
                <svg viewBox="0 0 320 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d="M3 14c60-9 120-11 200-6 40 2 80 3 114-1" />
                </svg>
              </span>
            </h1>
            <p className="lead">
              Southwest Pro Painting handles interior and exterior jobs for homes, barns and businesses across Southwest
              Minnesota. Pick yours and see our real work that looks like it.
            </p>

            <Finder value={notes.project} onChange={(project) => patch({ project })} />

            <div className="hero-cta desktop-only">
              <EstimateLink where="hero">Get a free estimate</EstimateLink>
              <CallLink where="hero" />
            </div>
            <ul className="hero-facts">
              <li>Free estimates all year round</li>
              <li>Residential and commercial</li>
              <li>Interior and exterior</li>
            </ul>
          </div>

          <Fan value={notes.project} onOpen={open} />
        </div>
      </section>

      <FallPromo />

      <section className="proof" aria-label="Commercial projects we have painted">
        <div className="wrap proof-in">
          <span className="tape is-night">Commercial projects</span>
          <ul>
            <li>Dairy Queen</li>
            <li>Pizza Hut</li>
            <li>Cherry Berry</li>
            <li>Anytime Fitness</li>
            <li>Tracy Ambulance Building</li>
          </ul>
        </div>
      </section>

      <section className="section paths" aria-labelledby="paths-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">Two ways in</span>
            <h2 className="h-lg" id="paths-h">The right examples for the kind of property you have.</h2>
            <p className="lead">
              A homeowner and a business manager need different proof. Each side of this site shows our work for that
              kind of job, with a clear next step.
            </p>
          </div>
          <div className="paths-grid">
            <article className="path reveal">
              <Pic id="ranch" sizes="(min-width: 900px) 600px, 92vw" ratio="16/10" />
              <div className="path-body">
                <span className="tape">For your home</span>
                <h3 className="h-md">Inside, outside, barns, decks and stain.</h3>
                <p>Our exterior process, our service list, and real homes, barns and rooms we have painted.</p>
                <Link className="btn btn-ink" to="/homes">
                  Explore home painting <Arrow />
                </Link>
              </div>
            </article>
            <article className="path reveal" style={{ '--d': '.1s' }}>
              <Pic id="pizza-hut" sizes="(min-width: 900px) 600px, 92vw" ratio="16/10" />
              <div className="path-body">
                <span className="tape is-orange">For your business</span>
                <h3 className="h-md">Restaurants, storefronts and service buildings.</h3>
                <p>The commercial projects we have done, a walk-through planner, and how we stand behind our work.</p>
                <Link className="btn btn-ink" to="/business">
                  Explore business painting <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <ResultsSection />

      <section className="section ribbon-sec" aria-labelledby="ribbon-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Recent work</span>
            <h2 className="h-lg" id="ribbon-h">Real jobs from our portfolio.</h2>
          </div>
        </div>
        <ul className="ribbon" aria-label="Photos of recent work, scroll sideways">
          {ribbon.map((id, n) => (
            <li key={id}>
              <ChipCard id={id} onOpen={() => open(ribbon, n)} sizes="(min-width: 900px) 360px, 74vw" />
            </li>
          ))}
        </ul>
        <div className="wrap ribbon-more">
          <Link className="link-arrow" to="/work">
            See all of our work <Arrow />
          </Link>
        </div>
      </section>

      <AboutTeaser />
      <HiringBand />
      <EstimatePanel />
      <Lightbox ids={lb.ids} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </>
  );
}
