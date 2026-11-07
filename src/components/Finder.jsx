import { useId } from 'react';
import { Link } from 'react-router-dom';
import { projectTypes, projectById, mixedPicks } from '../data/work';
import { ChipCard } from './Photo';
import { Arrow } from './Icons';

/**
 * "What are you painting?" Six real project types in two groups. Native radio inputs, so arrow keys,
 * screen readers and touch all work without extra code. Choosing one switches the photo fan.
 */
export function Finder({ value, onChange }) {
  const name = useId();
  const groups = [
    { key: 'home', title: 'At home' },
    { key: 'business', title: 'At work' },
  ];
  return (
    <div className="finder">
      <div className="finder-groups">
        {groups.map((g) => (
          <fieldset key={g.key} className={`pick-group is-${g.key}`}>
            <legend>{g.title}</legend>
            {projectTypes
              .filter((p) => p.audience === g.key)
              .map((p) => (
                <label key={p.id} className="pick">
                  <input
                    type="radio"
                    name={name}
                    value={p.id}
                    checked={value === p.id}
                    onChange={() => onChange(p.id)}
                  />
                  <span className="pick-body">
                    <span className="pick-label">{p.label}</span>
                    <span className="pick-hint">{p.hint}</span>
                  </span>
                  <span className="pick-dot" aria-hidden="true" />
                </label>
              ))}
          </fieldset>
        ))}
      </div>

      <div className="finder-result" aria-live="polite">
        {value ? (
          <>
            <p>{projectById[value].blurb}</p>
            <div className="finder-actions">
              <Link className="link-arrow" to={`/work?c=${value}`}>
                See all {projectById[value].photos.length} photos <Arrow />
              </Link>
              <button type="button" className="text-btn" onClick={() => onChange(null)}>
                Show a mix again
              </button>
            </div>
          </>
        ) : (
          <p className="muted">
            Pick one to see Ryan’s real jobs that look like yours.
          </p>
        )}
      </div>
    </div>
  );
}

export function Fan({ value, onOpen }) {
  const ids = value ? projectById[value].photos.slice(0, 4) : mixedPicks;
  const label = value ? projectById[value].label : 'A mix of recent work';
  return (
    <div className="fan-wrap">
      <p className="fan-label" aria-live="polite">
        <span className="vh">Showing: </span>
        {label}
      </p>
      {/* key restarts the entrance animation whenever the choice changes */}
      <ol className="fan" key={value || 'mix'}>
        {ids.map((id, n) => (
          <li key={id} style={{ '--n': n }}>
            <ChipCard
              id={id}
              onOpen={() => onOpen(ids, n)}
              eager={n === 0}
              sizes="(min-width: 900px) 360px, 78vw"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
