import { Field, FillSample, SampleFlag, Sent, useSampleForm } from '../components/Form';
import { Check } from '../components/Icons';
import { CallLink } from '../components/Links';
import { hiring } from '../data/site';

const EXPERIENCE = ['No painting experience yet', 'Some experience', 'Several years of experience'];

export default function Careers() {
  const form = useSampleForm({
    initial: { first: '', last: '', email: '', phone: '', role: '', experience: '', about: '' },
    required: ['first', 'last', 'email', 'phone', 'role'],
    sample: {
      first: 'Jordan',
      last: 'Sample',
      email: 'jordan.sample@example.com',
      phone: '320-555-0188',
      role: hiring.roles[1],
      experience: EXPERIENCE[1],
      about: 'Sample application: detail-oriented, reliable, and ready to learn.',
    },
  });
  const v = form.values;

  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap">
          <span className="tape is-orange">Now hiring</span>
          <h1 className="h-xl" id="h1">{hiring.headline}.</h1>
          <p className="lead">{hiring.intro} {hiring.looking}</p>
          <ul className="job-facts">
            {hiring.roles.map((r) => <li key={r}><Check /> {r}</li>)}
            <li><Check /> {hiring.hours}</li>
          </ul>
        </div>
      </section>

      <section className="section tight" aria-label="Job application">
        <div className="wrap form-grid-page">
          <div className="form-card">
            {form.done ? (
              <Sent
                title={`Thanks, ${v.first}!`}
                backLabel="Back to the application"
                onBack={form.reset}
                summary={[
                  ['Name', `${v.first} ${v.last}`],
                  ['Email', v.email],
                  ['Phone', v.phone],
                  ['Role', v.role],
                  v.experience && ['Experience', v.experience],
                  v.about && ['About you', v.about],
                ].filter(Boolean)}
              />
            ) : (
              <form ref={form.formRef} onSubmit={form.submit} noValidate>
                <SampleFlag />
                <div className="form-grid">
                  <Field form={form} name="first" label="First name" required autoComplete="given-name" />
                  <Field form={form} name="last" label="Last name" required autoComplete="family-name" />
                  <Field form={form} name="email" label="Email" type="email" required autoComplete="email" />
                  <Field form={form} name="phone" label="Phone" type="tel" required autoComplete="tel" />
                  <Field form={form} name="role" label="What are you applying for?" as="select" required span2>
                    <option value="">Choose one</option>
                    {hiring.roles.map((r) => <option key={r}>{r}</option>)}
                  </Field>
                  <Field form={form} name="experience" label="Painting experience" as="select" span2 hint="Experience is preferred but not necessary.">
                    <option value="">Choose one</option>
                    {EXPERIENCE.map((r) => <option key={r}>{r}</option>)}
                  </Field>
                  <Field form={form} name="about" label="Tell us about yourself" as="textarea" rows={5} span2 hint="Optional." />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-orange">Submit application</button>
                  <FillSample form={form} />
                </div>
              </form>
            )}
          </div>

          <aside className="form-aside">
            <div className="aside-card">
              <h2 className="h-md">What we’re looking for</h2>
              <ul className="aside-list plain">
                <li>Detail-oriented</li>
                <li>Hard-working</li>
                <li>Self-motivated</li>
              </ul>
              <p className="muted">Work experience is preferred but not necessary.</p>
            </div>
            <div className="aside-card">
              <h2 className="h-md">Questions first?</h2>
              <p className="muted">Give us a call and we’ll talk it through.</p>
              <div className="aside-actions"><CallLink where="careers-aside" /></div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
