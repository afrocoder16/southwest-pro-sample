import { useState } from 'react';
import { ChipCard } from '../components/Photo';
import { Lightbox } from '../components/Photo';
import PrepLab from '../components/PrepLab';
import { EstimatePanel, Services, BeforeAfter, Testimonial } from '../components/Estimate';
import { EstimateLink, CallLink } from '../components/Links';
import { projectById } from '../data/work';

const rooms = projectById['home-interior'].photos.slice(0, 4);
const wood = projectById['home-wood'].photos.slice(0, 4);

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
              Ryan calls homeowners the backbone of his business. From a single bedroom to the whole exterior, here is
              everything he lists on his service pages.
            </p>
            <div className="hero-cta">
              <EstimateLink where="homes-hero">Get a free estimate</EstimateLink>
              <CallLink where="homes-hero" />
            </div>
          </div>
          <div className="collage" aria-hidden={false}>
            <ChipCard id="ranch" eager tape="Outside" className="c1" onOpen={() => open(['ranch', 'room-accent', 'deck'], 0)} sizes="(min-width: 900px) 420px, 80vw" />
            <ChipCard id="room-accent" eager tape="Inside" className="c2" onOpen={() => open(['ranch', 'room-accent', 'deck'], 1)} sizes="(min-width: 900px) 320px, 60vw" />
            <ChipCard id="deck" className="c3" tape="Stain" onOpen={() => open(['ranch', 'room-accent', 'deck'], 2)} sizes="(min-width: 900px) 300px, 55vw" />
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="svc-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">What do you need painted?</span>
            <h2 className="h-lg" id="svc-h">Everything Ryan paints, in his own words.</h2>
          </div>
          <Services />
        </div>
      </section>

      <PrepLab
        id="prep-lab"
        intro="Exterior work starts with prep, and Ryan lists six steps. Step through them on this house, then try colors. Your picks carry into your estimate notes."
      />

      <section className="section" aria-labelledby="ba-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Proof</span>
            <h2 className="h-lg" id="ba-h">What prep looks like when it’s done.</h2>
          </div>
          <BeforeAfter pairId="siding" onOpen={open} />
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="rooms-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Inside</span>
            <h2 className="h-lg" id="rooms-h">Color, ceilings and clean lines.</h2>
            <p className="lead">Ryan says proper paint coverage and sharp cut lines are what sets his work apart.</p>
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

      <section className="section tight" aria-labelledby="wood-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Stain and wood</span>
            <h2 className="h-lg" id="wood-h">Decks, stain and wood.</h2>
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

      <section className="section tight" aria-label="Customer comment">
        <div className="wrap quote-wrap reveal">
          <Testimonial />
        </div>
      </section>

      <EstimatePanel lead="Ryan always offers free estimates. Your project type, services and colors from this page are ready to copy into his form or an email." />
      <Lightbox ids={lb.ids} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </>
  );
}
