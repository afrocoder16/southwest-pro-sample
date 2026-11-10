import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Static, latin-only font files for just the weights used (variable fonts were measurably slower to lay out)
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
import '@fontsource/figtree/latin-400.css';
import '@fontsource/figtree/latin-600.css';
import '@fontsource/figtree/latin-700.css';
import '@fontsource/figtree/latin-800.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/features.css';
import './gate.css';
import App from './App';
import SampleGate from './components/SampleGate';
import SampleBanner from './components/SampleBanner';

// Render once, after the fonts used above the fold are ready (capped at 1.5 s). Rendering first and letting six
// font files swap in one by one made the browser re-lay-out the whole page several times.
const wanted = [
  '800 1em "Bricolage Grotesque"',
  '700 1em "Bricolage Grotesque"',
  '400 1em Figtree',
  '600 1em Figtree',
  '700 1em Figtree',
  '800 1em Figtree',
];
const fontsReady = document.fonts?.load
  ? Promise.race([Promise.all(wanted.map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 1500))])
  : Promise.resolve();

fontsReady.catch(() => {}).then(() => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SampleGate>
          <SampleBanner client="Southwest Pro Painting" />
          <App />
        </SampleGate>
      </BrowserRouter>
    </React.StrictMode>,
  );
});
