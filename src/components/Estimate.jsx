import { useState } from 'react';
import { useEstimate } from './EstimateContext';
import { EstimateLink, CallLink, EmailLink } from './Links';
import { ZONES } from './Planner';
import { ChipCard } from './Photo';
import { projectById, beforeAfterPairs } from '../data/work';
import { interiorServices, exteriorServices, testimonial, site } from '../data/site';

/** Turns the visitor's notes into plain lines (used for the on-page summary and the email draft). */
export function noteLines(notes) {
  const lines = [];
  if (notes.project) lines.push(['Project', projectById[notes.project]?.label]);
  if (notes.services.length) lines.push(['Interested in', notes.services.join(', ')]);
  if (notes.colors) {
    const c = notes.colors;
    lines.push(['Colors I am trying', [c.siding && `${c.siding} siding`, c.trim && `${c.trim} trim`, c.door && `${c.door} door`].filter(Boolean).join(', ')]);
  }
  if (notes.propertyType) lines.push(['Property', notes.propertyType]);
  if (notes.zones.length) lines.push(['Needs paint', notes.zones.map((z) => ZONES.find((x) => x.id === z)?.label).join(', ')]);
  if (notes.occupancy) lines.push(['During the work', notes.occupancy]);
  if (notes.brandSpecs) lines.push(['Brand colors', notes.brandSpecs]);
  return lines.filter(([, v]) => v);
}

export function EstimatePanel({ lead }) {
  const { notes, reset } = useEstimate();
  const lines = noteLines(notes);
  const body = [
    `Hi Ryan,`,
    ``,
    `I'd like a free estimate.`,
    ``,
    ...(lines.length ? lines.map(([k, v]) => `${k}: ${v}`) : []),
    ...(lines.length ? [``] : []),
    `My name:`,
    `Phone:`,
    `Project address:`,
    ``,
    `Thanks!`,
  ].join('\r\n');

  return (
    <section className="estimate on-dark" id="estimate" aria-labelledby="estimate-h">
      <div className="wrap section estimate-grid">
        <div className="estimate-copy">
          <span className="tape is-orange">Free estimate</span>
          <h2 className="h-lg" id="estimate-h">Tell Ryan what you’re painting.</h2>
          <p className="lead">
            {lead ??
              'Ryan always offers free estimates. Use his estimate form, call, or email. He’ll be in touch shortly.'}
          </p>
          <ol className="estimate-steps">
            <li>
              <span className="num">1</span>
              <div>
                <strong>You reach out</strong>
                <span>Start the free estimate form on Ryan’s site, or call or email.</span>
              </div>
            </li>
            <li>
              <span className="num">2</span>
              <div>
                <strong>Ryan takes a look</strong>
                <span>A time is scheduled to look at your project, talk through what you want and offer suggestions if needed.</span>
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
          <p className="small estimate-src">The three steps above are how Ryan describes his estimates on his interior page.</p>
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
              Nothing yet. Pick a project type, tick services, try some colors or plan a walk-through on this site and
              your choices show up here.
            </p>
          )}

          <div className="estimate-actions">
            <EstimateLink where="panel">Start your free estimate</EstimateLink>
            <div className="estimate-alt">
              <CallLink where="panel" />
              <EmailLink where="panel" subject="Free estimate request" body={body}>
                Email {lines.length ? 'these notes' : 'Ryan'}
              </EmailLink>
            </div>
          </div>
          <p className="small estimate-honest">
            The estimate form is on Ryan’s own website (name, email, phone and address). The email button opens a draft
            in your email app. <strong>This sample page does not collect or send anything.</strong>
          </p>
          {lines.length > 0 && (
            <button type="button" className="text-btn" onClick={reset}>Clear my notes</button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Interior / exterior service lists as toggle pills (Ryan's exact lists). */
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
          Ryan’s own list, word for word. Tap anything you’re interested in and it goes into your estimate notes.
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

export function Testimonial() {
  return (
    <figure className="quote">
      <blockquote>
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption>
        <strong>{testimonial.who}</strong>
        <span>{testimonial.source}</span>
      </figcaption>
    </figure>
  );
}

export const contactLine = `${site.owner} · ${site.phoneDisplay} · ${site.email}`;
