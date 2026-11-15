// "Monedita" (little coin): the app's original mascot, drawn as layered SVG so each
// part (eyes, arms, body) can move on its own.
//
// mood: 'idle' (bobs + blinks) | 'wave' (waves a hand) | 'cheer' (jumps with an open
// smile) | 'oops' (wobbles with a worried look)

export default function Monedita({ mood = 'idle', size = 96, className = '' }) {
  const open = mood === 'cheer';
  const worried = mood === 'oops';

  return (
    <div
      className={`monedita mood-${mood} ${className}`}
      style={{ width: size, height: size * 1.04 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 124">
        <defs>
          <linearGradient id="monGold" x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#ffe27a" />
            <stop offset="1" stopColor="#f5b50a" />
          </linearGradient>
        </defs>

        <ellipse className="mon-shadow" cx="60" cy="117" rx="30" ry="5" />

        <g className="mon-all">
          <g className="mon-feet">
            <ellipse cx="45" cy="108" rx="11" ry="6" />
            <ellipse cx="75" cy="108" rx="11" ry="6" />
          </g>

          <g className="mon-arm mon-arm-l">
            <ellipse cx="13" cy="72" rx="8" ry="12" transform="rotate(18 13 72)" />
          </g>
          <g className="mon-arm mon-arm-r">
            <ellipse cx="107" cy="72" rx="8" ry="12" transform="rotate(-18 107 72)" />
          </g>

          {/* coin edge, then face */}
          <circle cx="60" cy="64" r="46" fill="#d48f08" />
          <circle cx="60" cy="58" r="46" fill="url(#monGold)" />
          <circle cx="60" cy="58" r="37" fill="none" stroke="#fff0a8" strokeWidth="2.5" opacity="0.7" />
          <path d="M30 40 Q36 26 52 22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />

          <g className="mon-eyes">
            <ellipse cx="46" cy="52" rx="9" ry="11" fill="#fff" />
            <ellipse cx="74" cy="52" rx="9" ry="11" fill="#fff" />
            <g className="mon-pupils" style={{ transform: worried ? 'translateY(2px)' : undefined }}>
              <circle cx="47" cy="54" r="5.5" fill="#2b1a00" />
              <circle cx="75" cy="54" r="5.5" fill="#2b1a00" />
              <circle cx="49" cy="51.5" r="2" fill="#fff" />
              <circle cx="77" cy="51.5" r="2" fill="#fff" />
            </g>
          </g>

          <circle cx="36" cy="68" r="5.5" fill="#ff8fa3" opacity="0.55" />
          <circle cx="84" cy="68" r="5.5" fill="#ff8fa3" opacity="0.55" />

          {open ? (
            <>
              <path d="M46 68 Q60 94 74 68 Z" fill="#7a2d00" />
              <ellipse cx="60" cy="79" rx="6.5" ry="4" fill="#ff7a8a" />
            </>
          ) : worried ? (
            <path d="M50 77 Q60 68 70 77" fill="none" stroke="#7a4a00" strokeWidth="3.4" strokeLinecap="round" />
          ) : (
            <path d="M48 70 Q60 82 72 70" fill="none" stroke="#7a4a00" strokeWidth="3.4" strokeLinecap="round" />
          )}

          {worried && <path className="mon-sweat" d="M96 36 q-6 9 0 13 q6 -4 0 -13 z" fill="#5ec3ff" />}
        </g>
      </svg>
    </div>
  );
}
