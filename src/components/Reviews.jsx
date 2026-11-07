import { useState } from 'react';
import { reviews } from '../data/reviews';
import { ChevronL, ChevronR } from './Icons';

/** One customer comment at a time. No auto-advance, so nobody is rushed. */
export default function Reviews() {
  const [i, setI] = useState(0);
  const go = (n) => setI((n + reviews.length) % reviews.length);
  return (
    <div className="reviews" role="region" aria-roledescription="carousel" aria-label="Customer comments">
      <p className="reviews-label">What our customers say</p>
      <div className="reviews-stage" aria-live="polite">
        {reviews.map((r, n) => (
          <figure key={r.name} className={n === i ? 'on' : ''} aria-hidden={n !== i}>
            <span className="q-mark" aria-hidden="true">“</span>
            <blockquote>
              <p>{r.text}</p>
            </blockquote>
            <figcaption>
              <strong>{r.name}</strong>
              <span>Customer comment · Facebook and Google</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="reviews-nav">
        <button type="button" className="icon-btn" onClick={() => go(i - 1)} aria-label="Previous comment">
          <ChevronL />
        </button>
        <ul className="dots" aria-label="Choose a comment">
          {reviews.map((r, n) => (
            <li key={r.name}>
              <button type="button" aria-label={`Comment ${n + 1} of ${reviews.length}, ${r.name}`} aria-current={n === i ? 'true' : undefined} onClick={() => go(n)} />
            </li>
          ))}
        </ul>
        <button type="button" className="icon-btn" onClick={() => go(i + 1)} aria-label="Next comment">
          <ChevronR />
        </button>
        <span className="reviews-count" aria-hidden="true">{i + 1} / {reviews.length}</span>
      </div>
    </div>
  );
}
