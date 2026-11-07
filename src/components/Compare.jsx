import { useEffect, useRef, useState } from 'react';
import { img } from '../data/work';
import { transforms } from '../data/transforms';

/*
 * Roller-reveal before/after viewer.
 * "slide" pairs share an angle: drag the roller left to paint in the "after".
 * "flip" pairs were shot from different angles, so a slider would look wrong; those swap with a wipe.
 * Keyboard and screen-reader access comes from a real <input type="range"> laid over the photo.
 */

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function RollerGrip() {
  return (
    <svg viewBox="0 0 56 84" aria-hidden="true" focusable="false" className="roller-svg">
      <rect x="1" y="1" width="54" height="82" rx="27" fill="none" />
      <g stroke="#1b2228" strokeWidth="2.4" strokeLinecap="round" opacity=".55">
        <path d="M17 22h22M17 31h22M17 40h22M17 49h22M17 58h22" />
      </g>
      <path d="M13 42 6 36v12ZM43 42l7-6v12Z" fill="#1b2228" />
    </svg>
  );
}

function useSweep(active, resetKey) {
  const [pos, setPos] = useState(100);
  const raf = useRef(0);
  const stop = () => cancelAnimationFrame(raf.current);

  useEffect(() => {
    stop();
    if (!active) return undefined;
    if (reduceMotion()) {
      setPos(50);
      return undefined;
    }
    setPos(100);
    const start = performance.now() + 250;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1500));
      const eased = 1 - Math.pow(1 - t, 3);
      setPos(100 - eased * 50);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return stop;
  }, [active, resetKey]);

  return [pos, (v) => { stop(); setPos(v); }];
}

export function Compare({ pair }) {
  const box = useRef(null);
  const [seen, setSeen] = useState(false);
  const [shown, setShown] = useState('before');
  const before = img(pair.before);
  const after = img(pair.after);
  const slide = pair.mode === 'slide';
  const [pos, setPos] = useSweep(slide && seen, pair.id);

  // start the intro once the viewer is actually on screen
  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // flip pairs: show "before" briefly, then wipe to "after"
  useEffect(() => {
    if (slide) return undefined;
    setShown(reduceMotion() ? 'after' : 'before');
    if (!seen || reduceMotion()) return undefined;
    const t = setTimeout(() => setShown('after'), 900);
    return () => clearTimeout(t);
  }, [pair.id, slide, seen]);

  return (
    <div className="cmp-wrap">
      <div
        ref={box}
        className={`cmp ${slide ? 'is-slide' : 'is-flip'}`}
        data-shown={slide ? undefined : shown}
        style={slide ? { '--pos': `${pos}%` } : undefined}
      >
        <img className="cmp-after" src={after.src} srcSet={after.srcSet} sizes="(min-width: 900px) 520px, 92vw" width={after.width} height={after.height} alt={pair.afterAlt} loading="lazy" decoding="async" />
        {slide ? (
          <div className="cmp-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img src={before.src} srcSet={before.srcSet} sizes="(min-width: 900px) 520px, 92vw" width={before.width} height={before.height} alt={pair.beforeAlt} loading="lazy" decoding="async" />
          </div>
        ) : (
          <img className="cmp-flipimg" src={before.src} srcSet={before.srcSet} sizes="(min-width: 900px) 520px, 92vw" width={before.width} height={before.height} alt={pair.beforeAlt} loading="lazy" decoding="async" />
        )}

        <span className={`tape t-before${slide && pos < 18 ? ' fade' : ''}${!slide && shown === 'after' ? ' fade' : ''}`}>Before</span>
        <span className={`tape is-orange t-after${slide && pos > 82 ? ' fade' : ''}${!slide && shown === 'before' ? ' fade' : ''}`}>After</span>

        {slide && (
          <>
            <input
              className="cmp-range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(pos)}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label={`Before and after: ${pair.title}. Drag the roller to reveal the after photo.`}
              aria-valuetext={`${Math.round(100 - pos)} percent of the after photo showing`}
            />
            <div className="cmp-handle" aria-hidden="true">
              <span className="cmp-grip"><RollerGrip /></span>
            </div>
          </>
        )}
      </div>

      {slide ? (
        <p className="cmp-hint">Drag the roller to paint in the after.</p>
      ) : (
        <div className="seg" role="group" aria-label={`Show before or after: ${pair.title}`}>
          <button type="button" aria-pressed={shown === 'before'} onClick={() => setShown('before')}>Before</button>
          <button type="button" aria-pressed={shown === 'after'} onClick={() => setShown('after')}>After</button>
        </div>
      )}
      {pair.note && <p className="cmp-note">{pair.note}</p>}
    </div>
  );
}

/** Viewer plus a strip of paint-chip thumbnails to switch between jobs. */
export function BeforeAfterViewer({ pairs = transforms, id = 'ba' }) {
  const [i, setI] = useState(0);
  const pair = pairs[i];
  return (
    <div className="ba-viewer" id={id}>
      <Compare key={pair.id} pair={pair} />
      <p className="cmp-title" aria-live="polite">
        <strong>{pair.title}</strong>
        <span>{pair.tag}</span>
      </p>
      <ul className="cmp-chips" aria-label="Choose a job">
        {pairs.map((p, n) => {
          const t = img(p.after);
          return (
            <li key={p.id}>
              <button type="button" className="cmp-chip" aria-pressed={n === i} onClick={() => setI(n)}>
                <img src={t.src} srcSet={t.srcSet} sizes="90px" width={t.width} height={t.height} alt="" loading="lazy" decoding="async" />
                <span>{p.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
