import { useEffect, useRef, useState } from 'react';
import House from './House';
import { Pic } from './Photo';
import { Arrow, ChevronL, Pause, Play, Check } from './Icons';
import { processSteps } from '../data/site';
import { useEstimate } from './EstimateContext';

const SIDING = [
  { name: 'Prairie sage', hex: '#9fb496' },
  { name: 'Barn red', hex: '#a8473b' },
  { name: 'Lake blue', hex: '#6f95b4' },
  { name: 'Wheat', hex: '#dcc48f' },
  { name: 'Slate', hex: '#6c7783' },
  { name: 'Cedar stain', hex: '#a35f3a' },
];
const TRIM = [
  { name: 'White', hex: '#f7f5ee' },
  { name: 'Cream', hex: '#eadfc2' },
  { name: 'Charcoal', hex: '#343b42' },
];
const DOOR = [
  { name: 'Red', hex: '#b6382d' },
  { name: 'Blue', hex: '#2c5f8e' },
  { name: 'Black', hex: '#23272b' },
  { name: 'Orange', hex: '#e07a22' },
];

function Swatches({ legend, items, value, onChange }) {
  return (
    <fieldset className="swatches">
      <legend>{legend}</legend>
      <div>
        {items.map((c) => (
          <label key={c.name} className="sw">
            <input type="radio" name={`sw-${legend}`} checked={value.name === c.name} onChange={() => onChange(c)} />
            <span className="sw-dot" style={{ background: c.hex }}>
              <Check />
            </span>
            <span className="vh">{c.name}</span>
          </label>
        ))}
      </div>
      <span className="sw-name" aria-hidden="true">{value.name}</span>
    </fieldset>
  );
}

export default function PrepLab({ title = 'Prep first. Paint second.', intro, id = 'prep-lab' }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [siding, setSiding] = useState(SIDING[0]);
  const [trim, setTrim] = useState(TRIM[0]);
  const [door, setDoor] = useState(DOOR[0]);
  const { patch } = useEstimate();
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= 6) {
          setPlaying(false);
          return 6;
        }
        return s + 1;
      });
    }, 2300);
    return () => clearInterval(timer.current);
  }, [playing]);

  const pick = (setter, key) => (c) => {
    setter(c);
    setStep((s) => (s < 4 ? 4 : s)); // choosing a color shows it painted
    setPlaying(false);
    patch((n) => ({ colors: { ...(n.colors || {}), siding: siding.name, trim: trim.name, door: door.name, [key]: c.name } }));
  };

  const current = step === 0 ? null : processSteps[step - 1];
  const watch = () => {
    if (playing) return setPlaying(false);
    if (step >= 6) setStep(0);
    setPlaying(true);
    setStep((s) => (s >= 6 ? 1 : s + 1));
  };

  return (
    <section className="lab on-dark" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap section">
        <div className="head">
          <span className="tape is-orange">Ryan’s exterior process</span>
          <h2 className="h-lg" id={`${id}-h`}>{title}</h2>
          <p className="lead">
            {intro ??
              'Ryan says he takes pride in thorough preparation and proper coverage. Step through his six exterior steps on this house, then try your own colors.'}
          </p>
        </div>

        <div className="lab-grid">
          <div className="lab-stage">
            <div className="lab-art">
              <House step={step} colors={{ siding: siding.hex, trim: trim.hex, door: door.hex }} />
              <span className="tape lab-step-tape">{step === 0 ? 'Before' : `Step ${step} of 6`}</span>
              <span className={`lab-badge${step === 6 ? ' on' : ''}`} aria-hidden={step !== 6}>
                <Check /> Walk-around done
              </span>
              <span className="lab-caption">Illustration only. Screen colors will not match paint exactly.</span>
            </div>

            <div className="lab-colors">
              <Swatches legend="Siding" items={SIDING} value={siding} onChange={pick(setSiding, 'siding')} />
              <Swatches legend="Trim" items={TRIM} value={trim} onChange={pick(setTrim, 'trim')} />
              <Swatches legend="Door" items={DOOR} value={door} onChange={pick(setDoor, 'door')} />
            </div>
          </div>

          <div className="lab-side">
            <div className="lab-controls">
              <button className="btn btn-orange" onClick={watch} aria-pressed={playing}>
                {playing ? <Pause /> : <Play />} {playing ? 'Pause' : step >= 6 ? 'Watch again' : 'Watch the job'}
              </button>
              <div className="lab-arrows">
                <button
                  className="icon-btn"
                  onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}
                  disabled={step === 0}
                  aria-label="Previous step"
                >
                  <ChevronL />
                </button>
                <button
                  className="btn btn-line btn-sm"
                  onClick={() => { setPlaying(false); setStep((s) => Math.min(6, s + 1)); }}
                  disabled={step === 6}
                >
                  Next step <Arrow />
                </button>
              </div>
            </div>

            <ol className="lab-steps">
              <li className={step === 0 ? 'is-on' : ''}>
                <button onClick={() => { setPlaying(false); setStep(0); }} aria-current={step === 0 ? 'step' : undefined}>
                  <span className="num">0</span>
                  <span className="ttl">Before</span>
                </button>
                {step === 0 && <p>Weathered siding, peeling paint and grime. Where every job starts.</p>}
              </li>
              {processSteps.map((s, i) => (
                <li key={s.title} className={step === i + 1 ? 'is-on' : step > i + 1 ? 'is-done' : ''}>
                  <button onClick={() => { setPlaying(false); setStep(i + 1); }} aria-current={step === i + 1 ? 'step' : undefined}>
                    <span className="num">{i + 1}</span>
                    <span className="ttl">{s.title}</span>
                  </button>
                  {step === i + 1 && <p>{s.text}</p>}
                </li>
              ))}
            </ol>
            <p className="vh" aria-live="polite">
              {current ? `Step ${step}: ${current.title}. ${current.text}` : 'Before: weathered siding.'}
            </p>

            <div className="lab-proof">
              <p className="lab-proof-h">On a real job</p>
              <div className="lab-proof-pics">
                <figure className={step <= 3 ? 'is-lit' : ''}>
                  <Pic id="gray-before" sizes="(min-width: 900px) 200px, 44vw" ratio="4/3" />
                  <figcaption>Peeling siding, before</figcaption>
                </figure>
                <figure className={step >= 4 ? 'is-lit' : ''}>
                  <Pic id="gray-after" sizes="(min-width: 900px) 200px, 44vw" ratio="4/3" />
                  <figcaption>Repainted siding, after</figcaption>
                </figure>
              </div>
              <p className="small">Ryan’s exterior page shows these as a before and after, taken from different angles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
