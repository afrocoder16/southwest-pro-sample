import { Link } from 'react-router-dom';
import { Pic } from '../components/Photo';
import { EstimateLink, CallLink, MessageLink } from '../components/Links';
import { EstimatePanel } from '../components/Estimate';
import { HiringBand } from '../components/Sections';
import { site } from '../data/site';
import { Arrow } from '../components/Icons';

const words = [
  { q: 'Thorough preparation and proper coverage.', s: 'On our exterior work' },
  { q: 'Proper paint coverage and sharp cut lines set our work apart.', s: 'On our interior work' },
  { q: 'Clean, professional and detailed work on every interior and exterior project.', s: 'On our goal' },
];

export default function About() {
  return (
    <>
      <section className="page-hero compact" aria-labelledby="h1">
        <div className="wrap about-hero">
          <div>
            <span className="tape">About us</span>
            <h1 className="h-xl" id="h1">Quality. Affordable. Service.</h1>
            <p className="lead">
              {site.legal} is a full-service painting contractor for homes and businesses across {site.region}, inside
              and out.
            </p>
          </div>
          <div className="about-pic">
            <Pic id="detail-cut" eager sizes="(min-width: 900px) 460px, 90vw" ratio="4/3" />
          </div>
        </div>
      </section>

      <section className="section tight" data-allow-name aria-labelledby="owner-h">
        <div className="wrap owner-grid">
          <div className="reveal">
            <span className="tape is-orange">The owner</span>
            <h2 className="h-lg" id="owner-h">Meet {site.owner}.</h2>
          </div>
          <div className="owner-copy reveal" style={{ '--d': '.08s' }}>
            <p>
              {site.owner} owns and runs {site.legal}. His stated mission is to consistently provide quality work,
              maintain affordable pricing and provide professional service in the region.
            </p>
            <p>
              When you request a free estimate, he’ll be in touch. He wants to hear what you have in mind, take a look at
              your project and earn your business.
            </p>
            <blockquote className="mini-quote">
              <p>“I look forward to meeting you and having the opportunity to earn your business!”</p>
              <footer>{site.owner}, owner</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="words-h">
        <div className="wrap">
          <div className="head reveal">
            <span className="tape">How we work</span>
            <h2 className="h-lg" id="words-h">What we stand for.</h2>
          </div>
          <ul className="words">
            {words.map((w, n) => (
              <li key={w.q} className="reveal" style={{ '--d': `${n * 0.08}s` }}>
                <p>{w.q}</p>
                <span>{w.s}</span>
              </li>
            ))}
          </ul>
          <p className="about-links">
            <Link className="link-arrow" to="/work">See our work <Arrow /></Link>
          </p>
        </div>
      </section>

      <section className="section tight" data-allow-name aria-labelledby="contact-h">
        <div className="wrap contact-grid">
          <div>
            <div className="head">
              <span className="tape">Contact</span>
              <h2 className="h-lg" id="contact-h">Talk to us.</h2>
              <p className="lead">The quickest next step is the free estimate form. A call or a message works too.</p>
            </div>
            <div className="hero-cta">
              <EstimateLink where="about" />
              <CallLink where="about" />
              <MessageLink where="about" />
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
          </div>
        </div>
      </section>

      <HiringBand />

      <section className="section tight" aria-labelledby="note-h">
        <div className="wrap">
          <aside className="sample-note">
            <h2 className="h-md" id="note-h">About this design sample</h2>
            <p>
              This site is a private concept showing one way {site.name} could present itself online. It is not the live
              website. The estimate, message and job application forms check your answers but do not send or save
              anything. Photos, customer comments, the warranty line and the hiring details come from the company’s own
              pages and files, and the fall offers are samples. All of it would be confirmed before any public use.
            </p>
          </aside>
        </div>
      </section>

      <EstimatePanel />
    </>
  );
}
