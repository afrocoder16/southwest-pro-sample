import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChipCard, Lightbox } from '../components/Photo';
import { BeforeAfter, EstimatePanel } from '../components/Estimate';
import { BeforeAfterViewer } from '../components/Compare';
import { projectTypes, projectById, allPhotoIds } from '../data/work';

export default function Work() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('c');
  const filter = raw && (raw === 'home' || raw === 'business' || projectById[raw]) ? raw : 'all';
  const [lb, setLb] = useState({ ids: [], index: null });

  const ids = useMemo(() => {
    if (filter === 'all') return allPhotoIds;
    if (filter === 'home' || filter === 'business') {
      const set = new Set(projectTypes.filter((p) => p.audience === filter).flatMap((p) => p.photos));
      return allPhotoIds.filter((id) => set.has(id));
    }
    return projectById[filter].photos;
  }, [filter]);

  const set = (v) => (v === 'all' ? setParams({}) : setParams({ c: v }));
  const chips = [
    { v: 'all', l: 'All work' },
    { v: 'home', l: 'Homes' },
    { v: 'business', l: 'Business' },
    ...projectTypes.map((p) => ({ v: p.id, l: p.label })),
  ];

  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap">
          <span className="tape">Our work</span>
          <h1 className="h-xl" id="h1">Real jobs from our portfolio.</h1>
          <p className="lead">
            Filter by what you’re painting, and tap a photo to enlarge it. Scroll down for before and afters.
          </p>
        </div>
      </section>

      <section className="section tight" aria-label="Photo gallery">
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filter photos">
            {chips.map((c) => (
              <button key={c.v} type="button" className="pill" aria-pressed={filter === c.v} onClick={() => set(c.v)}>
                {c.l}
              </button>
            ))}
          </div>
          <p className="muted small" aria-live="polite">
            Showing {ids.length} photo{ids.length === 1 ? '' : 's'}.
          </p>
          <ul className="masonry">
            {ids.map((id, n) => (
              <li key={id}>
                <ChipCard id={id} onOpen={() => setLb({ ids, index: n })} sizes="(min-width: 900px) 380px, 90vw" ratio="auto" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="ba-h">
        <div className="wrap">
          <div className="head">
            <span className="tape is-orange">Before and after</span>
            <h2 className="h-lg" id="ba-h">Start to finish.</h2>
            <p className="lead">Drag the roller to paint in the after. Jobs shot from different angles swap with a wipe instead.</p>
          </div>
          <div className="work-ba">
            <BeforeAfterViewer id="work-viewer" />
            <div className="ba-stack">
              <BeforeAfter pairId="siding" onOpen={(i, x) => setLb({ ids: i, index: x })} />
              <BeforeAfter pairId="corner" onOpen={(i, x) => setLb({ ids: i, index: x })} />
              <div className="ba">
                <h3 className="h-md">Side by side</h3>
                <ChipCard id="social-pair" onOpen={() => setLb({ ids: ['social-pair'], index: 0 })} ratio="16 / 9" sizes="(min-width: 900px) 540px, 90vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <EstimatePanel />
      <Lightbox ids={lb.ids} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </>
  );
}
