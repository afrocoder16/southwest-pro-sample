import { useState } from 'react'

// MIDVORA SAMPLE GATE (kit version 2.1). Reusable lead-capture gate for every Midvora sample website.
// Shows a name-and-email card before the sample, emails Midvora through Web3Forms, then opens the sample.
// Full instructions: the Midvora sample kit README (private repo afrocoder16/midvora-sample-kit).
//
// ──────────────── EDIT THESE TWO LINES FOR EACH NEW SAMPLE ────────────────
const CLIENT = 'Southwest Pro Painting'               // shown to the visitor and used in the email subject
const SAMPLE_LABEL = 'Southwest Pro Painting website' // the "sample" field in the notification email
// ───────────────────────────────────────────────────────────────────────────

// Fail loudly rather than show a client someone else's name (or this placeholder).
if (CLIENT.includes('CLIENT NAME HERE') || SAMPLE_LABEL.includes('CLIENT NAME HERE')) {
  throw new Error('SampleGate: set CLIENT and SAMPLE_LABEL at the top of SampleGate.jsx before using the kit.')
}

// Set at build time. In GitHub Actions it comes from the repo variable VITE_GATE_KEY. Locally: .env.local
// The Web3Forms access key is a PUBLIC key by design (it ends up in the page code), so a variable is fine.
const KEY = import.meta.env.VITE_GATE_KEY
// VITE_FORCE_GATE=1 shows the gate even without a key (to design or test it). Nothing is sent in that mode.
const FORCE = import.meta.env.VITE_FORCE_GATE === '1'
// If the notification cannot be sent (ad blocker, network), offer a way in rather than trapping the client.
const ALLOW_SKIP_ON_FAILURE = true

// Every GitHub Pages sample under one account shares ONE browser origin (youraccount.github.io), so the
// "remembered visitor" key must be unique per sample or opening one client's sample would unlock the others.
const slug = CLIENT.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const STORE = `midvora-sample-visitor:${slug}`

function readVisitor() {
  try { return JSON.parse(localStorage.getItem(STORE)) } catch { return null }
}

async function notifyMidvora({ name, email }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject: `Sample opened: ${name} (${CLIENT})`,
        from_name: 'Midvora sample gate',
        replyto: email,
        name,
        email,
        sample: SAMPLE_LABEL,
        page: window.location.href,
        opened_at: new Date().toISOString(),
        referrer: document.referrer || 'direct',
        browser: navigator.userAgent,
      }),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.message || `Web3Forms returned ${response.status}`)
  } finally {
    clearTimeout(timer)
  }
}

export default function SampleGate({ children }) {
  const [visitor, setVisitor] = useState(readVisitor)
  const [sent, setSent] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  // No key and not forced: nothing could be sent, so do not show a gate that pretends to collect anything.
  if (!KEY && !FORCE) {
    if (!import.meta.env.DEV) console.warn('Sample gate disabled: VITE_GATE_KEY was not set at build time, so visitors are not being recorded.')
    return children
  }
  if (visitor) return children

  const remember = (record) => {
    try { localStorage.setItem(STORE, JSON.stringify(record)) } catch { /* private mode: they just see the gate again next visit */ }
  }
  const open = (record) => { remember(record); setVisitor(record) }

  async function submit(event) {
    event.preventDefault()
    // Honeypot: a hidden CHECKBOX that only a bot would tick. It must not be a text field: browser autofill
    // fills hidden text fields, and the form then silently did nothing for real visitors.
    if (new FormData(event.currentTarget).get('botcheck')) return
    const record = { name: name.trim(), email: email.trim() }
    setBusy(true)
    setFailed(false)
    try {
      if (KEY) await notifyMidvora(record)
      remember(record)
      setSent(record)
    } catch (error) {
      console.error('Sample gate could not send the request:', error)
      setFailed(true)
    }
    setBusy(false)
  }

  const first = sent?.name ? sent.name.split(' ')[0] : ''

  return (
    <div className="gate">
      <div className="gate__glow gate__glow--one" aria-hidden="true" />
      <div className="gate__glow gate__glow--two" aria-hidden="true" />
      <main className="gate__card" aria-live="polite">
        <img className="gate__logo" src={`${import.meta.env.BASE_URL}midvora-logo.png`} alt="Midvora. From the Midwest. For the World." width="237" height="146" />

        {sent ? (
          <div className="gate__done">
            <span className="gate__check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </span>
            {/* Only claim we received something if it was really sent. */}
            <h1>{KEY ? `We got your request${first ? `, ${first}` : ''}.` : `Welcome${first ? `, ${first}` : ''}.`}</h1>
            <p className="gate__lede">{KEY ? 'Thank you for your interest. ' : ''}Your {CLIENT} sample is ready.</p>
            <button type="button" className="gate__button" onClick={() => setVisitor(sent)}>Open the sample</button>
          </div>
        ) : (
          <>
            <p className="gate__eyebrow">Private preview</p>
            <h1>Welcome to your sample.</h1>
            <p className="gate__lede">We built a sample website for {CLIENT}. Tell us who you are and we will open it for you.</p>
            <form onSubmit={submit}>
              <label>
                <span>Your name</span>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jane Smith" required />
              </label>
              <label>
                <span>Your email</span>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="jane@company.com" required />
              </label>
              <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="gate__trap" />
              {failed && (
                <p className="gate__error" role="alert">
                  We could not send your request just now. Please try again in 5 minutes.
                  {ALLOW_SKIP_ON_FAILURE && (
                    <> Or <button type="button" className="gate__skip" onClick={() => open({ name: name.trim(), email: email.trim() })}>open the sample anyway</button>.</>
                  )}
                </p>
              )}
              <button type="submit" className="gate__button" disabled={busy}>{busy ? 'Sending…' : failed ? 'Try again' : 'View the sample'}</button>
            </form>
            <p className="gate__fine">{KEY ? 'Your name, email, and browser details are sent to Midvora (through the Web3Forms service) so we know the sample was opened.' : 'Preview mode: nothing is sent.'}</p>
          </>
        )}
      </main>
    </div>
  )
}
