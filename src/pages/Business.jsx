import { useState } from 'react';
import { ChipCard, Lightbox } from '../components/Photo';
import Planner from '../components/Planner';
import { EstimatePanel, BeforeAfter } from '../components/Estimate';
import { EstimateLink, CallLink } from '../components/Links';
import { useEstimate } from '../components/EstimateContext';
import { projectById } from '../data/work';
import { site } from '../data/site';

const bizTypes = ['biz-food', 'biz-store', 'biz-service'].map((id) => projectById[id]);

const triptych = [
  {
    t: 'Quality',
    d: 'Ryan’s stated mission is to consistently provide quality work, keep pricing affordable and offer professional service.',
  },
  {
    t: 'Reliable',
    d: 'His goal is high-quality work at a reasonable price, with clean, professional and detailed results on interior and exterior projects.',
  },
  {
    t: 'Warranty',
    d: `He says he is confident in his painting process and application and stands behind his work for two years.`,
  },
];

export default function Business() {
  const { notes, patch } = useEstimate();
  const [lb, setLb] = useState({ ids: [], index: null });
  const open = (ids, index) => setLb({ ids, index });
  const active = bizTypes.find((b) => b.id === notes.project) || bizTypes[0];

  return (
    <>
      <section className="page-hero is-biz" aria-labelledby="h1">
        <div className="wrap page-hero-grid">
          <div className="page-hero-copy">
            <span className="tape is-orange">For your business</span>
            <h1 className="h-xl" id="h1">Painting for restaurants, storefronts and service buildings.</h1>
            <p className="lead">
              Ryan’s commercial projects include a Dairy Queen, a Pizza Hut and a Cherry Berry in Marshall, an Anytime
              Fitness storefront and the Tracy Ambulance Building.
            </p>
            <div className="hero-cta">
              <EstimateLink where="biz-hero">Get a free estimate</EstimateLink>
              <CallLink where="biz-hero" />
            </div>
            <p className="warranty">
              <span className="stamp" aria-hidden="true">2-year<br />warranty</span>
              <span>
                Ryan says he stands behind his work for two years. Ask him for the details when you talk.
              </span>
            </p>
          </div>
          <div className="collage is-biz">
            <ChipCard id="pizza-hut" eager className="c1" tape="Restaurant" tapeTone="is-night" onOpen={() => open(['pizza-hut', 'ambulance', 'cherry-berry'], 0)} sizes="(min-width: 900px) 420px, 80vw" />
            <ChipCard id="ambulance" eager className="c2" tape="Service building" onOpen={() => open(['pizza-hut', 'ambulance', 'cherry-berry'], 1)} sizes="(min-width: 900px) 320px, 60vw" />
            <ChipCard id="cherry-berry" className="c3" onOpen={() => open(['pizza-hut', 'ambulance', 'cherry-berry'], 2)} sizes="(min-width: 900px) 300px, 55vw" />
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="types-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">See your kind of property</span>
            <h2 className="h-lg" id="types-h">Pick the closest match.</h2>
            <p className="lead">
              These are the commercial projects Ryan shows on his site, grouped by property type. Customer names appear
              as he lists them.
            </p>
          </div>

          <div className="tabs is-big" role="tablist" aria-label="Property types">
            {bizTypes.map((b) => (
              <button
                key={b.id}
                role="tab"
                id={`bt-${b.id}`}
                aria-selected={active.id === b.id}
                aria-controls="bt-panel"
                tabIndex={active.id === b.id ? 0 : -1}
                onClick={() => patch({ project: b.id })}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div id="bt-panel" role="tabpanel" aria-labelledby={`bt-${active.id}`} className="bt-panel" key={active.id}>
            <p className="bt-blurb">{active.blurb}</p>
            <ul className="grid-3">
              {active.photos.map((id, n) => (
                <li key={id}>
                  <ChipCard id={id} onOpen={() => open(active.photos, n)} sizes="(min-width: 900px) 380px, 90vw" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="trip-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">How Ryan describes it</span>
            <h2 className="h-lg" id="trip-h">Quality. Reliable. Warranty.</h2>
          </div>
          <ul className="triptych">
            {triptych.map((x, n) => (
              <li key={x.t} className="reveal" style={{ '--d': `${n * 0.08}s` }}>
                <span className="trip-n">0{n + 1}</span>
                <h3 className="h-md">{x.t}</h3>
                <p>{x.d}</p>
              </li>
            ))}
          </ul>
          <p className="small muted trip-src">Paraphrased from the commercial page of southwestpro.com.</p>
        </div>
      </section>

      <Planner />

      <section className="section tight" aria-labelledby="ba-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">Proof</span>
            <h2 className="h-lg" id="ba-h">The difference a repaint makes.</h2>
          </div>
          <BeforeAfter pairId="corner" onOpen={open} />
        </div>
      </section>

      <EstimatePanel lead="Ryan always offers free estimates. Your property type and what needs paint from the planner are ready to drop into his form, a call, or an email." />
      <Lightbox ids={lb.ids} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </>
  );
}
