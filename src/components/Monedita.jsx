import { useEffect, useState } from 'react';

// "Monedita" (little coin): the app's original mascot, drawn as layered SVG so each
// part (eyes, arms, body) can move on its own.
//
// mood: 'idle'  – bobs and blinks, and every few seconds does a random little
//                 behavior (see IDLE_ACTS) so she never feels like a loop
//       'wave'  – waves a hand
//       'cheer' – jumps with an open smile
//       'oops'  – wobbles with a worried look

// name -> how long (ms) the behavior lasts before she settles back to idle
const IDLE_ACTS = {
  look: 2400, // glances left and right
  hop: 1500, // two little hops
  flip: 1250, // flips like a coin
  wave: 1900, // waves hello
  shimmy: 1600, // happy wiggle
  wink: 900, // winks
  yawn: 2300, // big sleepy yawn
  whistle: 2900, // whistles, music notes float up
  kiss: 1700, // blows a heart
};
const ACT_NAMES = Object.keys(IDLE_ACTS);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// `forceAct` pins one behavior (for demos/tests) instead of picking randomly.
export default function Monedita({ mood = 'idle', size = 96, className = '', forceAct = null }) {
  const [randomAct, setAct] = useState(null);
  const act = forceAct ?? randomAct;

  // Pick a random behavior every few seconds (never the same one twice in a row).
  useEffect(() => {
    if (mood !== 'idle' || forceAct || prefersReducedMotion()) {
      setAct(null);
      return undefined;
    }

    let timer;
    let last = null;

    const rest = () => {
      timer = setTimeout(perform, 2200 + Math.random() * 3200);
    };

    function perform() {
      const pool = ACT_NAMES.filter((name) => name !== last);
      const next = pool[Math.floor(Math.random() * pool.length)];
      last = next;
      setAct(next);
      timer = setTimeout(() => {
        setAct(null);
        rest();
      }, IDLE_ACTS[next]);
    }

    timer = setTimeout(perform, 1200 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, [mood, forceAct]);

  const open = mood === 'cheer';
  const worried = mood === 'oops';
  const mouth = open
    ? 'open'
    : worried
      ? 'worried'
      : act === 'yawn'
        ? 'yawn'
        : act === 'whistle' || act === 'kiss'
          ? 'o'
          : 'smile';

  return (
    <div
      className={`monedita mood-${mood} ${act ? `act-${act}` : ''} ${className}`}
      style={{ width: size, height: size * 1.04 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 124">
        <defs>
          <linearGradient id="monGold" x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#ffe27a" />
            <stop offset="1" stopColor="#f5b50a" />
          </linearGradient>
          {/* same gradient in absolute coordinates, so eyelids blend into the face exactly */}
          <linearGradient id="monGoldFace" gradientUnits="userSpaceOnUse" x1="14" y1="12" x2="96.8" y2="104">
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

          {/* eyelids: face-colored covers that close the eyes for winks and yawns */}
          <ellipse className="mon-lid mon-lid-l" cx="46" cy="52" rx="10.5" ry="12.5" fill="url(#monGoldFace)" />
          <ellipse className="mon-lid mon-lid-r" cx="74" cy="52" rx="10.5" ry="12.5" fill="url(#monGoldFace)" />
          <path className="mon-line mon-line-l" d="M37 53 Q46 59 55 53" fill="none" stroke="#7a4a00" strokeWidth="3.2" strokeLinecap="round" />
          <path className="mon-line mon-line-r" d="M65 53 Q74 59 83 53" fill="none" stroke="#7a4a00" strokeWidth="3.2" strokeLinecap="round" />

          <circle cx="36" cy="68" r="5.5" fill="#ff8fa3" opacity="0.55" />
          <circle cx="84" cy="68" r="5.5" fill="#ff8fa3" opacity="0.55" />

          {mouth === 'open' && (
            <>
              <path d="M46 68 Q60 94 74 68 Z" fill="#7a2d00" />
              <ellipse cx="60" cy="79" rx="6.5" ry="4" fill="#ff7a8a" />
            </>
          )}
          {mouth === 'worried' && (
            <path d="M50 77 Q60 68 70 77" fill="none" stroke="#7a4a00" strokeWidth="3.4" strokeLinecap="round" />
          )}
          {mouth === 'yawn' && (
            <g className="mon-yawn">
              <ellipse cx="60" cy="76" rx="8.5" ry="11" fill="#7a2d00" />
              <ellipse cx="60" cy="83" rx="5" ry="3.5" fill="#ff7a8a" />
            </g>
          )}
          {mouth === 'o' && <ellipse className="mon-o" cx="60" cy="74" rx="4.2" ry="5.2" fill="#7a2d00" />}
          {mouth === 'smile' && (
            <path d="M48 70 Q60 82 72 70" fill="none" stroke="#7a4a00" strokeWidth="3.4" strokeLinecap="round" />
          )}

          {worried && <path className="mon-sweat" d="M96 36 q-6 9 0 13 q6 -4 0 -13 z" fill="#5ec3ff" />}
        </g>

        {act === 'whistle' && (
          <g className="mon-notes">
            {[0, 0.9].map((delay, i) => (
              <g key={i} className="mon-note" style={{ animationDelay: `${delay}s` }}>
                <circle cx={96 + i * 8} cy={38 - i * 6} r="3.4" fill="#7a4a00" />
                <path d={`M${99 + i * 8} ${38 - i * 6} V${25 - i * 6} q7 2 6 8`} fill="none" stroke="#7a4a00" strokeWidth="2.4" strokeLinecap="round" />
              </g>
            ))}
          </g>
        )}

        {act === 'kiss' && (
          <g transform="translate(78 62)">
            <path className="mon-heart" d="M0 7 C-10 -3 -3 -12 0 -5 C3 -12 10 -3 0 7 Z" fill="#ff5a7a" />
          </g>
        )}
      </svg>
    </div>
  );
}
