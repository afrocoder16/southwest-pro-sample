import { useEffect } from 'react';
import { useEstimate } from './EstimateContext';
import { Check } from './Icons';

/*
 * Business "walk-through planner": an original storefront illustration (outside and inside) with six
 * paintable zones. Ticking a zone highlights it. It only helps a manager get ready for an estimate;
 * the answers feed the email draft on the estimate panel and nothing is sent from this page.
 */

export const ZONES = [
  { id: 'ext-walls', label: 'Exterior walls' },
  { id: 'ext-trim', label: 'Trim, fascia and parapet' },
  { id: 'doors', label: 'Doors and frames' },
  { id: 'int-walls', label: 'Interior walls' },
  { id: 'ceilings', label: 'Ceilings' },
  { id: 'floors', label: 'Concrete floors' }, // "Concrete Floors" is on the interior service list
];

const PROPERTY_TYPES = [
  'Restaurant or food service',
  'Storefront, gym or shop',
  'Office',
  'Garage or service building',
  'Something else',
];
const PROJECT_TO_PROPERTY = {
  'biz-food': PROPERTY_TYPES[0],
  'biz-store': PROPERTY_TYPES[1],
  'biz-service': PROPERTY_TYPES[3],
};
const OCCUPANCY = ['Open to customers while work happens', 'Staff only', 'Empty during the work', 'Not sure yet'];
const BRAND = ['Yes, I have brand colors to match', 'No, open to suggestions', 'Not sure yet'];

function Scene({ zones }) {
  const on = (id) => zones.includes(id);
  const hl = (id) => ({ className: 'hl', 'data-on': on(id) ? 'true' : 'false' });
  return (
    <svg
      className="store"
      viewBox="0 0 780 380"
      role="img"
      aria-label="Illustration of a storefront from the outside and a room from the inside. Ticked zones are highlighted."
    >
      <defs>
        <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b6d9ee" />
          <stop offset="1" stopColor="#eef4ee" />
        </linearGradient>
        <pattern id="s-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="#f08a24" fillOpacity=".38" />
          <rect width="6" height="12" fill="#f08a24" fillOpacity=".92" />
        </pattern>
        <pattern id="s-stripe" width="16" height="10" patternUnits="userSpaceOnUse">
          <rect width="16" height="10" fill="#2f3b45" />
          <rect width="8" height="10" fill="#3d4b57" />
        </pattern>
        {/* shapes reused for the base drawing and the highlight overlay */}
        <rect id="z-wall-ext" x="40" y="112" width="320" height="190" />
        <rect id="z-parapet" x="30" y="90" width="340" height="24" />
        <rect id="z-frame-l" x="56" y="190" width="104" height="98" />
        <rect id="z-frame-r" x="240" y="190" width="104" height="98" />
        <rect id="z-frame-d" x="164" y="186" width="72" height="116" />
        <rect id="z-leaf-l" x="170" y="192" width="28" height="110" />
        <rect id="z-leaf-r" x="202" y="192" width="28" height="110" />
        <rect id="z-leaf-i" x="565" y="108" width="62" height="142" />
        <polygon id="z-back" points="460,70 730,70 730,250 460,250" />
        <polygon id="z-left" points="420,30 460,70 460,250 420,330" />
        <polygon id="z-right" points="770,30 730,70 730,250 770,330" />
        <polygon id="z-ceil" points="420,30 770,30 730,70 460,70" />
        <polygon id="z-floor" points="420,330 770,330 730,250 460,250" />
      </defs>

      {/* ---------- outside ---------- */}
      <rect x="0" y="0" width="400" height="380" rx="16" fill="url(#s-sky)" />
      <rect x="0" y="302" width="400" height="78" fill="#5d646b" />
      <rect x="0" y="302" width="400" height="9" fill="#c9c6bc" />
      <path d="M20 350h52M110 350h52M200 350h52M290 350h52" stroke="#e9e5d6" strokeWidth="4" strokeLinecap="round" opacity=".7" />

      <use href="#z-wall-ext" className="b-wall" />
      <use href="#z-wall-ext" {...hl('ext-walls')} />
      <use href="#z-parapet" className="b-trim" />
      <use href="#z-parapet" {...hl('ext-trim')} />
      {/* blank sign band (left empty on purpose so no brand is implied) */}
      <rect x="92" y="122" width="216" height="38" rx="3" fill="#2a3640" />
      <rect x="100" y="130" width="200" height="22" rx="2" fill="none" stroke="#516472" strokeDasharray="5 5" />

      <use href="#z-frame-l" className="b-trim" />
      <use href="#z-frame-l" {...hl('ext-trim')} />
      <use href="#z-frame-r" className="b-trim" />
      <use href="#z-frame-r" {...hl('ext-trim')} />
      <rect x="64" y="198" width="88" height="82" fill="#9cc7dc" />
      <rect x="248" y="198" width="88" height="82" fill="#9cc7dc" />
      <path d="M72 270 L112 204M92 274 L124 214" stroke="#fff" strokeOpacity=".5" strokeWidth="5" />
      <path d="M256 270 L296 204M276 274 L308 214" stroke="#fff" strokeOpacity=".5" strokeWidth="5" />
      {/* awnings */}
      <polygon points="50,170 166,170 176,192 40,192" fill="url(#s-stripe)" />
      <polygon points="234,170 350,170 360,192 224,192" fill="url(#s-stripe)" />

      <use href="#z-frame-d" className="b-trim" />
      <use href="#z-frame-d" {...hl('ext-trim')} />
      <use href="#z-leaf-l" className="b-door" />
      <use href="#z-leaf-l" {...hl('doors')} />
      <use href="#z-leaf-r" className="b-door" />
      <use href="#z-leaf-r" {...hl('doors')} />
      <rect x="175" y="200" width="18" height="52" fill="#9cc7dc" />
      <rect x="207" y="200" width="18" height="52" fill="#9cc7dc" />
      <path d="M198 252v22M202 252v22" stroke="#d9c27a" strokeWidth="3" strokeLinecap="round" />
      <polygon points="150,302 250,302 276,380 124,380" fill="#cfccc2" />

      {/* ---------- inside ---------- */}
      <rect x="410" y="0" width="370" height="380" rx="16" fill="#f1ede3" />
      <use href="#z-ceil" className="b-ceil" />
      <use href="#z-ceil" {...hl('ceilings')} />
      <use href="#z-back" className="b-int" />
      <use href="#z-back" {...hl('int-walls')} />
      <use href="#z-left" className="b-int-s" />
      <use href="#z-left" {...hl('int-walls')} />
      <use href="#z-right" className="b-int-s" />
      <use href="#z-right" {...hl('int-walls')} />
      <use href="#z-floor" className="b-floor" />
      <use href="#z-floor" {...hl('floors')} />
      {/* light fixtures and a door on the back wall */}
      <rect x="500" y="46" width="44" height="7" rx="3" fill="#fff" opacity=".95" />
      <rect x="640" y="46" width="44" height="7" rx="3" fill="#fff" opacity=".95" />
      <rect x="558" y="102" width="76" height="152" className="b-trim" />
      <use href="#z-leaf-i" className="b-door" />
      <use href="#z-leaf-i" {...hl('doors')} />
      <circle cx="616" cy="184" r="3.5" fill="#d9c27a" />
      <rect x="480" y="196" width="64" height="56" rx="4" fill="#7b6d5b" />
      <rect x="486" y="204" width="52" height="8" rx="3" fill="#97897a" />
      <rect x="660" y="214" width="46" height="36" rx="4" fill="#97897a" />
    </svg>
  );
}

export default function Planner() {
  const { notes, patch } = useEstimate();
  const zones = notes.zones;

  // Follow the business type chosen elsewhere (home page or the tabs above), until the visitor sets it themselves.
  useEffect(() => {
    const guess = PROJECT_TO_PROPERTY[notes.project];
    if (guess && !notes.propertyTouched && notes.propertyType !== guess) patch({ propertyType: guess });
  }, [notes.project, notes.propertyTouched, notes.propertyType, patch]);

  const toggle = (id) =>
    patch((n) => ({ zones: n.zones.includes(id) ? n.zones.filter((z) => z !== id) : [...n.zones, id] }));

  return (
    <section className="planner section tight" id="walkthrough" aria-labelledby="planner-h">
      <div className="wrap">
        <div className="head">
          <span className="tape">Plan your walk-through</span>
          <h2 className="h-lg" id="planner-h">Know what you want painted before the walk-through.</h2>
          <p className="lead">
            Tick what needs paint and answer three quick questions. This page does not send anything. It builds a
            note you can use on the estimate form, in a call, or in an email draft.
          </p>
        </div>

        <div className="planner-grid">
          <div className="planner-art">
            <span className="tape planner-t1 is-paper">Outside</span>
            <span className="tape planner-t2 is-paper">Inside</span>
            <Scene zones={zones} />
          </div>

          <div className="planner-form">
            <fieldset className="zone-list">
              <legend>What needs paint?</legend>
              {ZONES.map((z) => (
                <label key={z.id} className="zone-pill">
                  <input type="checkbox" checked={zones.includes(z.id)} onChange={() => toggle(z.id)} />
                  <span>
                    <span className="box"><Check /></span>
                    {z.label}
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="field">
              <label htmlFor="ptype">What kind of property?</label>
              <select id="ptype" value={notes.propertyType} onChange={(e) => patch({ propertyType: e.target.value, propertyTouched: true })}>
                <option value="">Choose one</option>
                {PROPERTY_TYPES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="occ">Will people be in the space while the work happens?</label>
              <select id="occ" value={notes.occupancy} onChange={(e) => patch({ occupancy: e.target.value })}>
                <option value="">Choose one</option>
                {OCCUPANCY.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="brand">Do you have brand colors to match?</label>
              <select id="brand" value={notes.brandSpecs} onChange={(e) => patch({ brandSpecs: e.target.value })}>
                <option value="">Choose one</option>
                {BRAND.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
