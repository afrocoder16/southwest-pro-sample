import { Pic } from '../components/Photo';
import { EstimateLink, CallLink, EmailLink } from '../components/Links';
import { EstimatePanel } from '../components/Estimate';
import { site } from '../data/site';
import { External } from '../components/Icons';

const words = [
  { q: 'Thorough preparation and proper coverage.', s: 'On exterior work. Paraphrased from Ryan’s exterior page.' },
  { q: 'Proper paint coverage and sharp cut lines set the work apart.', s: 'On interior work. Paraphrased from Ryan’s interior page.' },
  { q: 'Clean, professional and detailed work on every interior and exterior project.', s: 'On his goal. Paraphrased from Ryan’s about page.' },
];

export default function About() {
  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap about-hero">
          <div>
            <span className="tape">About</span>
            <h1 className="h-xl" id="h1">Quality. Affordable. Service.</h1>
            <p className="lead">
              {site.legal} is run by {site.owner}. His stated mission is to consistently provide quality work, keep
              pricing affordable and offer professional service across {site.region}.
            </p>
          </div>
          <div className="about-pic">
            <Pic id="detail-cut" eager sizes="(min-width: 900px) 460px, 90vw" ratio="4/3" />
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="words-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape is-orange">What Ryan stands for</span>
            <h2 className="h-lg" id="words-h">How he describes the work.</h2>
          </div>
          <ul className="words">
            {words.map((w, n) => (
              <li key={w.q} className="reveal" style={{ '--d': `${n * 0.08}s` }}>
                <p>{w.q}</p>
                <span>{w.s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="contact-h">
        <div className="wrap contact-grid">
          <div>
            <div className="head">
              <span className="tape">Contact</span>
              <h2 className="h-lg" id="contact-h">Talk to Ryan.</h2>
              <p className="lead">The quickest next step is the free estimate form. A call or email works too.</p>
            </div>
            <div className="hero-cta">
              <EstimateLink where="about" />
              <CallLink where="about" />
              <EmailLink where="about" />
            </div>
          </div>
          <div className="contact-card">
            <h3 className="h-md">{site.legal}</h3>
            <dl>
              <div><dt>Owner</dt><dd>{site.owner}</dd></div>
              <div><dt>Phone</dt><dd><a href={site.phoneHref}>{site.phoneDisplay}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              <div><dt>Serving</dt><dd>{site.region}</dd></div>
            </dl>
            <p className="small muted">
              Looking for painting work instead? Ryan’s hiring page is on his current site:{' '}
              <a href={site.hiringUrl} target="_blank" rel="noopener noreferrer">
                open the hiring page <External className="inline-ic" />
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="note-h">
        <div className="wrap">
          <aside className="sample-note">
            <h2 className="h-md" id="note-h">About this design sample</h2>
            <p>
              This page is a private concept showing one way Southwest Pro Painting could present itself online. It is
              not the live website, and nothing here is sent anywhere. The estimate buttons open Ryan’s existing free
              estimate form at southwestpro.com. Photos, names, the customer comment and the warranty line are taken
              from Ryan’s current site and would be confirmed with him before any public use.
            </p>
          </aside>
        </div>
      </section>

      <EstimatePanel />
    </>
  );
}
