import { Field, FillSample, SampleFlag, Sent, useSampleForm } from '../components/Form';
import { CallLink, EstimateLink } from '../components/Links';
import { estimateLine, estimateSub, site } from '../data/site';

export default function Contact() {
  const form = useSampleForm({
    initial: { name: '', email: '', phone: '', message: '' },
    required: ['name', 'email', 'message'],
    sample: {
      name: 'Jamie Sample',
      email: 'jamie.sample@example.com',
      phone: '320-555-0142',
      message: 'Sample message: I have a question about painting a kitchen. Could someone get back to me?',
    },
  });
  const v = form.values;

  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap">
          <span className="tape">Contact</span>
          <h1 className="h-xl" id="h1">Send us a message.</h1>
          <p className="lead">
            <strong>{estimateLine}</strong> {estimateSub}
          </p>
        </div>
      </section>

      <section className="section tight" aria-label="Contact form">
        <div className="wrap form-grid-page">
          <div className="form-card">
            {form.done ? (
              <Sent
                title={`Thanks, ${v.name.split(' ')[0]}!`}
                onBack={form.reset}
                summary={[['Name', v.name], ['Email', v.email], v.phone && ['Phone', v.phone], ['Message', v.message]].filter(Boolean)}
              />
            ) : (
              <form ref={form.formRef} onSubmit={form.submit} noValidate>
                <SampleFlag />
                <div className="form-grid">
                  <Field form={form} name="name" label="Your name" required autoComplete="name" span2 />
                  <Field form={form} name="email" label="Email" type="email" required autoComplete="email" />
                  <Field form={form} name="phone" label="Phone" type="tel" autoComplete="tel" hint="Optional." />
                  <Field form={form} name="message" label="Message" as="textarea" rows={7} required span2 />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-orange">Send message</button>
                  <FillSample form={form} />
                </div>
              </form>
            )}
          </div>

          <aside className="form-aside">
            <div className="aside-card">
              <h2 className="h-md">{site.legal}</h2>
              <ul className="aside-list">
                <li><span>Phone</span> <a href={site.phoneHref}>{site.phoneDisplay}</a></li>
                <li><span>Serving</span> {site.region}</li>
              </ul>
              <div className="aside-actions">
                <CallLink where="contact-aside" />
              </div>
            </div>
            <div className="aside-card">
              <h2 className="h-md">Ready for a price?</h2>
              <p className="muted">The estimate form takes about a minute.</p>
              <div className="aside-actions">
                <EstimateLink where="contact-aside" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
