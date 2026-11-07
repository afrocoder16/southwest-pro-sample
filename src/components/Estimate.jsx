import { useState } from 'react';
import { useEstimate } from './EstimateContext';
import { EstimateLink, CallLink, MessageLink } from './Links';
import { ZONES } from './Planner';
import { ChipCard } from './Photo';
import { projectById, beforeAfterPairs } from '../data/work';
import { interiorServices, exteriorServices, processSteps, estimateLine, estimateSub } from '../data/site';

/** Turns the visitor's notes into plain lines (on-page summary and the estimate form's details box). */
export function noteLines(notes) {
  const lines = [];
  if (notes.offer) lines.push(['Offer', `${notes.offer} (sample offer)`]);
  if (notes.project) lines.push(['Project', projectById[notes.project]?.label]);
  if (notes.services.length) lines.push(['Interested in', notes.services.join(', ')]);
  if (notes.propertyType) lines.push(['Property', notes.propertyType]);
  if (notes.zones.length) lines.push(['Needs paint', notes.zones.map((z) => ZONES.find((x) => x.id === z)?.label).join(', ')]);
  if (notes.occupancy) lines.push(['During the work', notes.occupancy]);
  if (notes.brandSpecs) lines.push(['Brand colors', notes.brandSpecs]);
  return lines.filter(([, v]) => v);
}

export function EstimatePanel({ lead }) {
  const { notes, reset } = useEstimate();
  const lines = noteLines(notes);

  return (
    <section className="estimate on-dark" id="estimate" aria-labelledby="estimate-h">
      <div className="wrap section estimate-grid">
        <div className="estimate-copy">
          <span className="tape is-orange">Free estimate</span>
          <h2 className="h-lg" id="estimate-h">Tell us what you’re painting.</h2>
          <p className="lead">
            <strong>{estimateLine}</strong> {lead ?? estimateSub}
          </p>
          <ol className="estimate-steps">
            <li>
              <span className="num">1</span>
              <div>
                <strong>You reach out</strong>
                <span>Use the free estimate form, send us a message, or give us a call.</span>
              </div>
            </li>
            <li>
              <span className="num">2</span>
              <div>
                <strong>We take a look</strong>
                <span>We schedule a time to look at your project, talk through what you want and offer suggestions if needed.</span>
              </div>
            </li>
            <li>
              <span className="num">3</span>
              <div>
                <strong>You get a detailed proposal</strong>
                <span>It includes an accurate price before your project begins.</span>
              </div>
            </li>
          </ol>
        </div>

        <div className="estimate-card">
          <h3 className="h-md">Your notes</h3>
          {lines.length ? (
            <dl className="notes">
              {lines.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="muted">
              Nothing yet. Pick a project type, tick services or plan a walk-through on this site, and your choices show
              up here and carry into the estimate form.
            </p>
          )}

          <div className="estimate-actions">
            <EstimateLink where="panel">Start your free estimate</EstimateLink>
            <div className="estimate-alt">
              <CallLink where="panel" />
              <MessageLink where="panel" />
            </div>
          </div>
          {lines.length > 0 && (
            <button type="button" className="text-btn" onClick={reset}>Clear my notes</button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Interior / exterior service lists as toggle pills (the company's exact lists). */
export function Services() {
  const [tab, setTab] = useState('exterior');
  const { notes, patch } = useEstimate();
  const list = tab === 'exterior' ? exteriorServices : interiorServices;
  const toggle = (name) =>
    patch((n) => ({ services: n.services.includes(name) ? n.services.filter((s) => s !== name) : [...n.services, name] }));

  return (
    <div className="services">
      <div className="tabs" role="tablist" aria-label="Service lists">
        {['exterior', 'interior'].map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="svc-panel"
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setTab(tab === 'exterior' ? 'interior' : 'exterior');
            }}
          >
            {t === 'exterior' ? 'Exterior' : 'Interior'}
          </button>
        ))}
      </div>
      <div id="svc-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <p className="muted small svc-hint">
          Everything we paint. Tap anything you’re interested in and it goes into your estimate notes.
        </p>
        <ul className="pills">
          {list.map((s) => (
            <li key={s}>
              <button type="button" className="pill" aria-pressed={notes.services.includes(s)} onClick={() => toggle(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Static two-up before/after (used for photo pairs taken from different angles). */
export function BeforeAfter({ pairId, onOpen }) {
  const pair = beforeAfterPairs.find((p) => p.id === pairId);
  return (
    <div className="ba">
      <h3 className="h-md">{pair.title}</h3>
      <div className="ba-grid">
        <ChipCard id={pair.before} tape="Before" tapeTone="is-night" onOpen={() => onOpen([pair.before, pair.after], 0)} sizes="(min-width: 900px) 540px, 90vw" />
        <ChipCard id={pair.after} tape="After" tapeTone="is-orange" onOpen={() => onOpen([pair.before, pair.after], 1)} sizes="(min-width: 900px) 540px, 90vw" />
      </div>
      <p className="small muted">{pair.note}</p>
    </div>
  );
}

/** Our six-step exterior process as a simple numbered row (no animation). */
export function ProcessSteps() {
  return (
    <ol className="steps6">
      {processSteps.map((s, i) => (
        <li key={s.title}>
          <span className="num">{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
