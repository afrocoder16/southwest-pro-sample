import { Field, FillSample, SampleFlag, Sent, useSampleForm } from '../components/Form';
import { CallLink, MessageLink } from '../components/Links';
import { useEstimate } from '../components/EstimateContext';
import { noteLines } from '../components/Estimate';
import { estimateLine } from '../data/site';

const KINDS = ['Home: outside', 'Home: inside', 'Barn or farm building', 'Deck, stain or wood', 'Business or commercial', 'Not sure yet'];
const KIND_FROM_PROJECT = {
  'home-exterior': 'Home: outside',
  'home-interior': 'Home: inside',
  'home-barn': 'Barn or farm building',
  'home-wood': 'Deck, stain or wood',
  'biz-food': 'Business or commercial',
  'biz-store': 'Business or commercial',
  'biz-service': 'Business or commercial',
};

export default function Estimate() {
  const { notes, patch } = useEstimate();
  const lines = noteLines(notes);
  const form = useSampleForm({
    initial: {
      first: '',
      last: '',
      email: '',
      phone: '',
      address: '',
      kind: KIND_FROM_PROJECT[notes.project] || '',
      details: lines.map(([k, v]) => `${k}: ${v}`).join('\n'),
    },
    required: ['first', 'last', 'email', 'phone'],
    sample: {
      first: 'Jamie',
      last: 'Sample',
      email: 'jamie.sample@example.com',
      phone: '320-555-0142',
      address: '123 Sample Street, Anytown, MN',
      kind: 'Home: inside',
      details: 'Sample request: two bedrooms, a hallway and the trim.',
    },
  });
  const v = form.values;

  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap">
          <span className="tape is-orange">Free estimate</span>
          <h1 className="h-xl" id="h1">Get your free estimate.</h1>
          <p className="lead">
            <strong>{estimateLine}</strong> Fill out the form and we’ll be in touch shortly.
          </p>
        </div>
      </section>

      <section className="section tight" aria-label="Free estimate form">
        <div className="wrap form-grid-page">
          <div className="form-card">
            {form.done ? (
              <Sent
                title={`Thanks, ${v.first}!`}
                onBack={form.reset}
                summary={[
                  ['Name', `${v.first} ${v.last}`],
                  ['Email', v.email],
                  ['Phone', v.phone],
                  v.address && ['Address', v.address],
                  v.kind && ['Project', v.kind],
                  v.details && ['Details', v.details],
                ].filter(Boolean)}
              />
            ) : (
              <form ref={form.formRef} onSubmit={form.submit} noValidate>
                <SampleFlag />
                {notes.offer && (
                  <p className="offer-pill">
                    <span>Offer: <strong>{notes.offer}</strong> (sample offer)</span>
                    <button type="button" className="text-btn" onClick={() => patch({ offer: null })}>Remove</button>
                  </p>
                )}
                <div className="form-grid">
                  <Field form={form} name="first" label="First name" required autoComplete="given-name" />
                  <Field form={form} name="last" label="Last name" required autoComplete="family-name" />
                  <Field form={form} name="email" label="Email" type="email" required autoComplete="email" />
                  <Field form={form} name="phone" label="Phone" type="tel" required autoComplete="tel" />
                  <Field form={form} name="address" label="Project address" autoComplete="street-address" span2 hint="Optional. It helps us plan the visit." />
                  <Field form={form} name="kind" label="What are you painting?" as="select" span2>
                    <option value="">Choose one</option>
                    {KINDS.map((k) => <option key={k}>{k}</option>)}
                  </Field>
                  <Field form={form} name="details" label="Tell us about the project" as="textarea" rows={6} span2 hint={lines.length ? 'We filled this in from the choices you made on the site. Edit it any way you like.' : undefined} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-orange">Request my free estimate</button>
                  <FillSample form={form} />
                </div>
              </form>
            )}
          </div>

          <aside className="form-aside">
            <div className="aside-card">
              <h2 className="h-md">What happens next</h2>
              <ol className="mini-steps">
                <li><span className="num">1</span><p>We schedule a time to look at your project and talk through what you want.</p></li>
                <li><span className="num">2</span><p>We offer suggestions if needed.</p></li>
                <li><span className="num">3</span><p>You get a detailed proposal with an accurate price before your project begins.</p></li>
              </ol>
            </div>
            <div className="aside-card">
              <h2 className="h-md">Prefer to talk?</h2>
              <p className="muted">Give us a call or send a quick message instead.</p>
              <div className="aside-actions">
                <CallLink where="estimate-aside" />
                <MessageLink where="estimate-aside" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
