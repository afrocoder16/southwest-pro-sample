import { useState } from 'react';
import { ChipCard, Lightbox } from '../components/Photo';
import { EstimatePanel, Services, ProcessSteps } from '../components/Estimate';
import { ResultsSection } from '../components/Sections';
import { EstimateLink, CallLink } from '../components/Links';
import { projectById } from '../data/work';

const rooms = projectById['home-interior'].photos.slice(0, 4);
const barns = projectById['home-barn'].photos.slice(0, 4);
const wood = projectById['home-wood'].photos.slice(0, 4);
const heroIds = ['house-after', 'kitchen-after', 'barn-after'];

export default function Homes() {
  const [lb, setLb] = useState({ ids: [], index: null });
  const open = (ids, index) => setLb({ ids, index });

  return (
    <>
      <section className="page-hero" aria-labelledby="h1">
        <div className="wrap page-hero-grid">
          <div className="page-hero-copy">
            <span className="tape">For your home</span>
            <h1 className="h-xl" id="h1">Painting for your home, inside and out.</h1>
            <p className="lead">
              Homeowners are the backbone of our business. From a single bedroom to the whole exterior, and from
              kitchen cabinets to the barn out back, here is everything we paint.
            </p>
            <div className="hero-cta">
              <EstimateLink where="homes-hero">Get a free estimate</EstimateLink>
              <CallLink where="homes-hero" />
            </div>
          </div>
          <div className="collage">
            <ChipCard id={heroIds[0]} eager tape="Outside" className="c1" ratio="4 / 5" onOpen={() => open(heroIds, 0)} sizes="(min-width: 900px) 420px, 80vw" />
            <ChipCard id={heroIds[1]} eager tape="Inside" className="c2" ratio="4 / 5" onOpen={() => open(heroIds, 1)} sizes="(min-width: 900px) 320px, 60vw" />
            <ChipCard id={heroIds[2]} className="c3" tape="Barn" ratio="1 / 1" onOpen={() => open(heroIds, 2)} sizes="(min-width: 900px) 300px, 55vw" />
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="svc-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">What do you need painted?</span>
            <h2 className="h-lg" id="svc-h">Everything we paint.</h2>
          </div>
          <Services />
        </div>
      </section>

      <ResultsSection id="home-results" />

      <section className="section" aria-labelledby="proc-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Our exterior process</span>
            <h2 className="h-lg" id="proc-h">Thorough preparation, proper coverage.</h2>
            <p className="lead">Every exterior job follows the same six steps.</p>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="rooms-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Inside</span>
            <h2 className="h-lg" id="rooms-h">Color, cabinets, ceilings and clean lines.</h2>
            <p className="lead">Proper paint coverage and sharp cut lines are what set our work apart.</p>
          </div>
          <ul className="grid-4">
            {rooms.map((id, n) => (
              <li key={id} className="reveal" style={{ '--d': `${n * 0.07}s` }}>
                <ChipCard id={id} onOpen={() => open(rooms, n)} sizes="(min-width: 900px) 300px, 90vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tight" aria-labelledby="barn-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">Barns and farm buildings</span>
            <h2 className="h-lg" id="barn-h">Big buildings, brought back.</h2>
          </div>
          <ul className="grid-4">
            {barns.map((id, n) => (
              <li key={id} className="reveal" style={{ '--d': `${n * 0.07}s` }}>
                <ChipCard id={id} ratio="3 / 4" onOpen={() => open(barns, n)} sizes="(min-width: 900px) 300px, 90vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="wood-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Stain and wood</span>
            <h2 className="h-lg" id="wood-h">Decks, doors, stain and wood.</h2>
          </div>
          <ul className="grid-4">
            {wood.map((id, n) => (
              <li key={id} className="reveal" style={{ '--d': `${n * 0.07}s` }}>
                <ChipCard id={id} onOpen={() => open(wood, n)} sizes="(min-width: 900px) 300px, 90vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EstimatePanel lead="Your project type and the services you tapped on this page carry into the estimate form." />
      <Lightbox ids={lb.ids} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </>
  );
}
