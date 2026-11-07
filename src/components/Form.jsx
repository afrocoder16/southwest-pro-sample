import { useEffect, useId, useRef, useState } from 'react';
import { CallLink } from './Links';

/*
 * Sample forms. These validate and show a confirmation, but they deliberately send NOTHING:
 * no network request, no storage. The confirmation says so in plain words.
 */

export function useSampleForm({ initial, required = [], sample = {} }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const formRef = useRef(null);

  const set = (key, value) => {
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = (v) => {
    const e = {};
    for (const k of required) if (!String(v[k] ?? '').trim()) e[k] = 'This field is required.';
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
    if (v.phone && v.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    const first = Object.keys(e).find((k) => e[k]);
    if (first) {
      requestAnimationFrame(() => formRef.current?.querySelector(`[name="${first}"]`)?.focus());
      return;
    }
    setDone(true);
  };

  return {
    values,
    set,
    errors,
    done,
    submit,
    formRef,
    fill: () => {
      setValues((s) => ({ ...s, ...sample }));
      setErrors({});
    },
    reset: () => {
      setDone(false);
      setErrors({});
    },
  };
}

export function Field({ form, name, label, type = 'text', required = false, as = 'input', rows = 5, hint, autoComplete, span2 = false, children }) {
  const id = useId();
  const err = form.errors[name];
  const describedBy = [err && `${id}-e`, hint && `${id}-h`].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    name,
    value: form.values[name] ?? '',
    onChange: (e) => form.set(name, e.target.value),
    'aria-invalid': err ? 'true' : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
    autoComplete,
  };
  return (
    <div className={`f${span2 ? ' span2' : ''}${err ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea {...common} rows={rows} />
      ) : as === 'select' ? (
        <select {...common}>{children}</select>
      ) : (
        <input {...common} type={type} />
      )}
      {hint && <p className="f-hint" id={`${id}-h`}>{hint}</p>}
      {err && <p className="f-err" id={`${id}-e`}>{err}</p>}
    </div>
  );
}

/** Banner shown above every form so nobody is led to think a request was delivered. */
export function SampleFlag() {
  return (
    <p className="sample-flag">
      <strong>Design sample.</strong> This form checks your answers but does not send or save anything.
    </p>
  );
}

export function FillSample({ form }) {
  return (
    <button type="button" className="text-btn" onClick={form.fill}>
      Fill in sample details
    </button>
  );
}

/** The confirmation view. Always says plainly that nothing was sent. */
export function Sent({ title, summary = [], onBack, backLabel = 'Back to the form' }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.scrollIntoView({ block: 'center' });
  }, []);
  return (
    <div className="sent" ref={ref} tabIndex={-1} role="status">
      <span className="tape is-orange">Sample preview</span>
      <h2 className="h-md">{title}</h2>
      <p>
        <strong>Nothing was sent or saved.</strong> This website is a design sample, so your details stayed in this
        browser tab. On the finished site, this is where we would confirm your request.
      </p>
      {summary.length > 0 && (
        <dl className="notes sent-notes">
          {summary.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="sent-actions">
        <button type="button" className="btn btn-ink" onClick={onBack}>{backLabel}</button>
        <CallLink where="sent" />
      </div>
    </div>
  );
}
