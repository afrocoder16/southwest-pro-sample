/**
 * Original illustration of a Midwest-style house, used by the Prep Lab.
 * `step` 0 is "before"; 1 to 6 follow Ryan's exterior process. All visual changes are CSS (see lab.css),
 * driven by the data-step attribute, so there is no per-frame JavaScript.
 */

const PEEL = [
  'M184 240 l12-9 l11 8 l-2 15 l-14 7 l-9-11z',
  'M288 236 l16-10 l14 9 l-3 17 l-18 4 l-9-12z',
  'M410 322 l15-8 l12 10 l-6 15 l-17 2z',
  'M462 230 l14-6 l9 12 l-9 14 l-14-4z',
  'M230 338 l16-6 l12 9 l-8 14 l-16-1z',
  'M522 328 l15-7 l12 11 l-9 13 l-16-3z',
  'M626 304 l15-5 l9 12 l-12 11z',
  'M312 142 l12-9 l11 9 l-7 13 l-14 0z',
  'M360 196 l13-6 l9 11 l-10 10 l-12-6z',
  'M186 300 l11-5 l9 9 l-7 11 l-13-3z',
];

const FLAKES = [
  [190, 392], [212, 398], [244, 390], [268, 400], [300, 394], [330, 399], [398, 392], [430, 398], [456, 391], [486, 399],
];

const WINDOWS = [
  { x: 212, y: 212, w: 66, h: 82 },
  { x: 392, y: 212, w: 66, h: 82 },
  { x: 212, y: 304, w: 66, h: 62 },
  { x: 392, y: 304, w: 66, h: 62 },
];

function Win({ x, y, w, h }) {
  return (
    <g>
      <rect className="tr" x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="2" />
      <rect className="glass" x={x} y={y} width={w} height={h} />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} className="mullion" />
      <path d={`M${x + 8} ${y + h - 10} L${x + w * 0.45} ${y + 8}`} className="shine" />
    </g>
  );
}

function Siding({ className }) {
  // The painted surfaces: gable wall, main body, garage wall.
  return (
    <g className={className}>
      <polygon points="180,194 335,98 490,194" />
      <rect x="170" y="190" width="330" height="190" />
      <polygon points="506,264 587,210 668,264" />
      <rect x="500" y="262" width="175" height="118" />
    </g>
  );
}

export default function House({ step, colors }) {
  const rungs = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg
      className="house"
      data-step={step}
      viewBox="0 0 720 460"
      role="img"
      aria-label="Illustration of a house being painted in stages, from weathered siding to a finished repaint"
      style={{ '--siding': colors.siding, '--trim': colors.trim, '--door': colors.door }}
    >
      <defs>
        <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d3ec" />
          <stop offset="1" stopColor="#eef4ee" />
        </linearGradient>
        <linearGradient id="h-grime" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3a32" stopOpacity="0" />
          <stop offset="1" stopColor="#3b3a32" stopOpacity=".6" />
        </linearGradient>
        <pattern id="h-lap" width="10" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 13.2H10" stroke="#000" strokeOpacity=".16" strokeWidth="1.4" />
        </pattern>
        <clipPath id="h-wipe" clipPathUnits="userSpaceOnUse">
          <rect className="wipe" x="140" y="60" width="560" height="340" />
        </clipPath>
      </defs>

      {/* backdrop */}
      <rect width="720" height="460" fill="url(#h-sky)" />
      <circle cx="610" cy="76" r="30" fill="#fff6d8" opacity=".9" />
      <g className="trees">
        <circle cx="70" cy="300" r="74" fill="#88a97c" />
        <circle cx="130" cy="338" r="56" fill="#7a9c70" />
        <rect x="64" y="330" width="12" height="62" fill="#6f5a46" />
        <circle cx="660" cy="292" r="84" fill="#7c9d73" />
        <circle cx="610" cy="334" r="54" fill="#8aab7e" />
      </g>
      <rect y="380" width="720" height="80" fill="#a9c48a" />
      <polygon points="322,380 350,380 380,460 290,460" fill="#d9d4c6" />
      <polygon points="520,380 650,380 712,460 498,460" fill="#cfcdc7" />

      {/* roof edges (behind walls) */}
      <polyline points="164,200 335,86 506,200" fill="none" stroke="#475360" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="494,272 587,204 680,272" fill="none" stroke="#475360" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

      {/* painted surfaces */}
      <Siding className="sd-base" />
      <Siding className="paint-finish" />
      <g>
        <rect x="170" y="190" width="330" height="190" fill="url(#h-lap)" />
        <rect x="500" y="262" width="175" height="118" fill="url(#h-lap)" />
        <polygon points="180,194 335,98 490,194" fill="url(#h-lap)" />
        <polygon points="506,264 587,210 668,264" fill="url(#h-lap)" />
      </g>

      {/* weathering: peeling paint, then bare scraped patches, then covered by primer */}
      <g className="peel">
        {PEEL.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="grime">
        <rect x="170" y="290" width="330" height="90" fill="url(#h-grime)" />
        <rect x="500" y="320" width="175" height="60" fill="url(#h-grime)" />
        <rect x="212" y="294" width="66" height="34" fill="url(#h-grime)" opacity=".7" />
        <rect x="392" y="294" width="66" height="34" fill="url(#h-grime)" opacity=".7" />
      </g>

      {/* trim */}
      <polyline points="172,198 335,92 498,198" fill="none" className="tr-stroke" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="500,268 587,208 675,268" fill="none" className="tr-stroke" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="tr" x="170" y="190" width="9" height="190" />
      <rect className="tr" x="491" y="190" width="9" height="190" />
      <rect className="tr" x="500" y="262" width="8" height="118" />
      <rect className="tr" x="667" y="262" width="8" height="118" />
      <rect x="170" y="372" width="330" height="10" fill="#8d8b85" />
      <rect x="500" y="372" width="175" height="10" fill="#8d8b85" />

      {/* gable vent */}
      <rect className="tr" x="311" y="122" width="48" height="58" rx="24" />
      <rect className="glass" x="317" y="128" width="36" height="46" rx="18" />

      {WINDOWS.map((w) => (
        <Win key={`${w.x}-${w.y}`} {...w} />
      ))}

      {/* front door */}
      <rect className="tr" x="298" y="288" width="74" height="94" rx="2" />
      <rect className="door" x="305" y="296" width="60" height="86" />
      <rect className="glass" x="314" y="305" width="42" height="24" />
      <circle cx="356" cy="346" r="3" fill="#d9c27a" />
      <rect x="292" y="378" width="86" height="7" fill="#d9d4c6" />

      {/* garage door */}
      <rect className="tr" x="526" y="290" width="128" height="92" rx="2" />
      <rect x="533" y="297" width="114" height="85" fill="#ece8de" />
      <path d="M533 325H647M533 353H647M590 297V382" stroke="#b9b4a6" strokeWidth="2" />

      {/* caulk beads around windows and door (step 3) */}
      <g className="caulk">
        {WINDOWS.map((w) => (
          <rect key={`c-${w.x}-${w.y}`} x={w.x - 7} y={w.y - 7} width={w.w + 14} height={w.h + 14} rx="3" />
        ))}
        <rect x="296" y="286" width="78" height="98" rx="3" />
      </g>

      {/* bushes */}
      <circle cx="196" cy="378" r="22" fill="#6f9468" />
      <circle cx="224" cy="384" r="17" fill="#7ea576" />
      <circle cx="470" cy="379" r="21" fill="#6f9468" />
      <circle cx="440" cy="385" r="16" fill="#7ea576" />

      {/* prep gear that appears and disappears */}
      <g className="flakes">
        {FLAKES.map(([x, y]) => (
          <path key={x} d={`M${x} ${y} l7-3 l4 4 l-6 4z`} />
        ))}
      </g>
      <polygon className="dropcloth" points="176,384 494,384 520,402 152,402" />
      <g className="ladder">
        <line x1="112" y1="396" x2="170" y2="200" />
        <line x1="138" y1="396" x2="196" y2="200" />
        {rungs.map((i) => {
          const t = (i + 1) / 12;
          const xl = 112 + (170 - 112) * t, xr = 138 + (196 - 138) * t, y = 396 - (396 - 200) * t;
          return <line key={i} x1={xl} y1={y} x2={xr} y2={y} className="rung" />;
        })}
      </g>
      <g className="can">
        <rect x="236" y="380" width="26" height="26" rx="3" />
        <rect x="236" y="388" width="26" height="9" className="can-label" />
        <path d="M238 382c6-14 18-14 24 0" fill="none" />
      </g>

      {/* the roller that "applies" the finish coat */}
      <g className="roller">
        <rect x="0" y="236" width="64" height="20" rx="10" />
        <path d="M64 246h14v-18h16" fill="none" />
        <rect x="92" y="212" width="6" height="40" rx="3" className="roller-handle" />
      </g>

      {/* final walk-around sparkle */}
      <g className="sparkle">
        <path d="M245 224l4-12 4 12 12 4-12 4-4 12-4-12-12-4z" />
        <path d="M425 232l3-9 3 9 9 3-9 3-3 9-3-9-9-3z" />
        <path d="M335 140l3-8 3 8 8 3-8 3-3 8-3-8-8-3z" />
      </g>
    </svg>
  );
}
