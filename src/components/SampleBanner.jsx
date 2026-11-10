// OPTIONAL. A thin bar above the site that says plainly this is an unofficial sample made by Midvora.
// Use it on every sample so nobody (the client, their customers, a search engine) mistakes it for the real site.
// Wire it in main.jsx inside <SampleGate>, above <App />. Styles are at the bottom of gate.css.
export default function SampleBanner({ client }) {
  // Fail loudly rather than show a client the placeholder from main.jsx.example.
  if (!client || client.includes('Client Name Here')) {
    throw new Error('SampleBanner: pass the real client name, e.g. <SampleBanner client="Acme Plumbing" />.')
  }
  return (
    <div className="sample-banner" role="note">
      <strong>Unofficial sample</strong> prepared by Midvora for {client}.
      Not the live website. Prices, photos, and offers are placeholders.
    </div>
  )
}
