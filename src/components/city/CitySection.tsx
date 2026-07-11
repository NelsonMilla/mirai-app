import { RevealSection } from '@/components/ui/RevealSection';

/* TODO(Nelson): audit the "typical day" times/wording below — this schedule
   is illustrative copy introduced with the section, not from the event deck. */
const DAY_LOOP = [
  { time: '08:00', name: 'Breakfast', sub: 'hotel lobby — the whole city at one table', hot: false, cx: 380, cy: 120, tx: 380, ty: 58, anchor: 'middle' },
  { time: '10:00', name: 'Lab', sub: 'wet labs at KBIC, a walk away', hot: true, cx: 544.5, cy: 215, tx: 576, ty: 200, anchor: 'start' },
  { time: '14:00', name: 'Talk', sub: 'programming, demos, workshops', hot: false, cx: 544.5, cy: 405, tx: 576, ty: 390, anchor: 'start' },
  { time: '17:00', name: 'Onsen', sub: 'recover, Kobe-style', hot: false, cx: 380, cy: 500, tx: 380, ty: 534, anchor: 'middle' },
  { time: '19:00', name: 'Dinner', sub: 'same faces as breakfast', hot: false, cx: 215.5, cy: 405, tx: 184, ty: 390, anchor: 'end' },
  { time: '22:00', name: 'Build by night', sub: 'hacker houses hum till late', hot: true, cx: 215.5, cy: 215, tx: 184, ty: 200, anchor: 'end' },
] as const;

const CHEVRONS = [
  [475, 145.5, 30], [570, 310, 90], [475, 474.5, 150],
  [285, 474.5, 210], [190, 310, 270], [285, 145.5, 330],
] as const;

export default function CitySection() {
  return (
    <RevealSection id="city" dataSection="city" once threshold={0.05}>
      <div className="section-label stagger">The format</div>

      <h2 className="fmt-head display">
        One island. One month.<br />
        <em>One loop, on repeat.</em>
      </h2>

      <p className="fmt-lead">
        A popup city is a <strong>temporary village</strong>: a curated community that
        lives, works, and builds together in one place for one month. Housing, labs,
        programming, and social life share the same few blocks on Port Island — so a
        single day looks like this.
      </p>

      <div
        className="fmt-diagram"
        role="img"
        aria-label="Circular diagram of one day on Port Island: breakfast at 8, lab at 10, talks at 2, onsen at 5, dinner at 7, build by night at 10 — repeated for 31 days, all within the same few blocks."
      >
        <svg viewBox="0 0 760 620" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="fmt-iri" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FFB8CC" />
              <stop offset=".55" stopColor="#B8E3FF" />
              <stop offset="1" stopColor="#D4B8FF" />
            </linearGradient>
            <radialGradient id="fmt-glow" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#FF6B92" stopOpacity=".07" />
              <stop offset="1" stopColor="#FF6B92" stopOpacity="0" />
            </radialGradient>
            <path id="fmt-inner-ring" d="M380,196 a114,114 0 1,1 -0.1,0" />
          </defs>

          <circle cx="380" cy="310" r="230" fill="url(#fmt-glow)" />
          <circle cx="380" cy="310" r="190" stroke="#8585A8" strokeOpacity=".38" strokeWidth="1.2" strokeDasharray="2 7" />
          <circle cx="380" cy="310" r="114" stroke="#8585A8" strokeOpacity=".14" strokeWidth="1" />
          <text className="fmt-t-ring">
            <textPath href="#fmt-inner-ring" startOffset="2">
              SAME FEW BLOCKS · HOUSING · LABS · STAGE · SAME FEW BLOCKS · HOUSING · LABS ·
            </textPath>
          </text>

          <g stroke="#8585A8" strokeOpacity=".55" strokeWidth="1.3">
            {CHEVRONS.map(([x, y, rot]) => (
              <path key={`${x}-${y}`} d="M-4,-4 L4,0 L-4,4" transform={`translate(${x},${y}) rotate(${rot})`} />
            ))}
          </g>

          {DAY_LOOP.map((n) => (
            <g key={n.time}>
              <circle cx={n.cx} cy={n.cy} r="10" stroke={n.hot ? '#FF6B92' : '#8585A8'} strokeWidth={n.hot ? 1.4 : 1.3} />
              <circle cx={n.cx} cy={n.cy} r="3.4" fill={n.hot ? '#FF6B92' : '#fff'} />
              <text className="fmt-t-time" x={n.tx} y={n.ty} textAnchor={n.anchor}>{n.time}</text>
              <text className={`fmt-t-name${n.hot ? ' fmt-hot' : ''}`} x={n.tx} y={n.ty + 20} textAnchor={n.anchor}>
                {n.name.toUpperCase()}
              </text>
              <text className="fmt-t-sub" x={n.tx} y={n.ty + 38} textAnchor={n.anchor}>{n.sub}</text>
            </g>
          ))}

          <text className="fmt-t-kanji" x="380" y="342" textAnchor="middle">未来</text>
          <text className="fmt-t-big" x="380" y="322" textAnchor="middle" fill="url(#fmt-iri)">×31</text>
          <text className="fmt-t-cmono" x="380" y="352" textAnchor="middle">DAYS ON REPEAT</text>
          <text className="fmt-t-cmono fmt-pk" x="380" y="374" textAnchor="middle">OCT 1 — 31 · PORT ISLAND</text>
        </svg>

        {/* Vertical fallback, shown only under 600px */}
        <div className="fmt-loop-list" aria-hidden="true">
          {DAY_LOOP.map((n) => (
            <div key={n.time} className={`fmt-loop-item${n.hot ? ' fmt-hot' : ''}`}>
              <div className="fmt-loop-time mono">{n.time}</div>
              <div className="fmt-loop-name mono">{n.name.toUpperCase()}</div>
              <div className="fmt-loop-sub">{n.sub}</div>
            </div>
          ))}
          <div className="fmt-loop-repeat mono">↺ REPEAT ×31 · OCT 1—31 · PORT ISLAND</div>
        </div>
      </div>

      <p className="fmt-caption">
        The people you meet at breakfast <span className="fmt-dim">are the ones</span> you
        build with by night.
      </p>

      <div className="fmt-trio">
        <div className="fmt-trio-cell">
          <div className="fmt-trio-tag mono">LIVE</div>
          <div className="fmt-trio-title display">300 residents, one island</div>
          <div className="fmt-trio-sub">A hotel + hacker houses, all on Port Island.</div>
        </div>
        <div className="fmt-trio-arrow mono" aria-hidden="true">→</div>
        <div className="fmt-trio-cell">
          <div className="fmt-trio-tag mono">BUILD</div>
          <div className="fmt-trio-title display">Three tracks, real labs</div>
          <div className="fmt-trio-sub">Pick a track. Labs at KBIC.</div>
          <div className="fmt-track-dots mono">
            <span><i className="fmt-dot--dev" />DEVICES</span>
            <span><i className="fmt-dot--thr" />THERAPIES</span>
            <span><i className="fmt-dot--bld" />BUILDER</span>
          </div>
        </div>
        <div className="fmt-trio-arrow mono" aria-hidden="true">→</div>
        <div className="fmt-trio-cell">
          <div className="fmt-trio-tag mono">SHOW</div>
          <div className="fmt-trio-title display">One runway finale</div>
          <div className="fmt-trio-sub">It all culminates in the Frontier Human Fashion Show.</div>
        </div>
      </div>
    </RevealSection>
  );
}
