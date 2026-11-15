// Artwork for everything in data/wardrobe.js, drawn in Monedita's own SVG space
// (viewBox 0 0 120 124): face disc centered at (60, 58) with radius 46, eyes at
// (46, 52) and (74, 52), mouth around y 70-82, feet at y 108.
//
// Items are plain SVG groups so they bob, hop and flip together with her body.
// Hats and capes are allowed to stick out past the viewBox (the svg is overflow: visible).

const HATS = {
  'hat-cap': (
    <g>
      <path d="M24 33 Q24 3 60 3 Q96 3 96 33 Z" fill="#2f6df0" />
      <path d="M60 3 Q50 16 50 33" fill="none" stroke="#1d4fc4" strokeWidth="2" opacity="0.6" />
      <path d="M60 3 Q70 16 70 33" fill="none" stroke="#1d4fc4" strokeWidth="2" opacity="0.6" />
      <circle cx="60" cy="3.5" r="3.4" fill="#1d4fc4" />
      <path d="M58 30 Q98 24 108 35 Q90 41 58 37 Z" fill="#1d4fc4" />
      <path d="M62 31 Q88 28 100 34" fill="none" stroke="#5d92ff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  'hat-beanie': (
    <g>
      <path d="M26 30 Q26 -4 60 -4 Q94 -4 94 30 Z" fill="#e5484d" />
      <g stroke="#c93a41" strokeWidth="2.4" strokeLinecap="round" opacity="0.7">
        <path d="M42 4 V24" />
        <path d="M60 -2 V24" />
        <path d="M78 4 V24" />
      </g>
      <rect x="22" y="24" width="76" height="13" rx="6.5" fill="#c93a41" />
      <path d="M26 30 H94" stroke="#e5484d" strokeWidth="2" opacity="0.5" />
      <circle cx="60" cy="-6" r="8.5" fill="#fff" />
      <circle cx="57" cy="-8.5" r="3" fill="#eef1f7" />
    </g>
  ),
  'hat-visor': (
    <g>
      <path d="M20 26 Q60 4 100 26 L100 33 Q60 12 20 33 Z" fill="#1f7a4f" />
      <path d="M22 30 Q60 12 98 30 Q60 48 22 30 Z" fill="#46c37e" fillOpacity="0.78" stroke="#1f7a4f" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M34 28 Q60 16 86 28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </g>
  ),
  'hat-grad': (
    <g>
      <path d="M36 22 L36 36 Q60 47 84 36 L84 22 Z" fill="#26324a" />
      <path d="M60 0 L108 17 L60 34 L12 17 Z" fill="#33415f" stroke="#1b2438" strokeWidth="2" strokeLinejoin="round" />
      <path d="M60 4 L98 17 L60 30 L22 17 Z" fill="#3d4d73" opacity="0.6" />
      <circle cx="60" cy="17" r="3.4" fill="#ffd23f" />
      <path d="M60 17 L98 20 L98 40" fill="none" stroke="#ffd23f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="94.8" y="38" width="6.4" height="11" rx="2.4" fill="#ffd23f" />
      <rect x="94.8" y="45" width="6.4" height="2" fill="#d9a21b" />
    </g>
  ),
  'hat-cowboy': (
    <g>
      <path d="M33 24 Q31 -2 45 -4 Q54 3 60 2 Q66 3 75 -4 Q89 -2 87 24 Z" fill="#a8743c" />
      <path d="M34 18 Q60 25 86 18 L86 24 Q60 31 34 24 Z" fill="#5b3a1a" />
      <path d="M4 22 Q18 35 60 35 Q102 35 116 22 Q104 14 88 22 Q60 27 32 22 Q16 14 4 22 Z" fill="#bf8a4d" stroke="#7a5126" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 -1 Q60 5 76 -1" fill="none" stroke="#c99256" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  'hat-top': (
    <g>
      <rect x="36" y="-17" width="48" height="37" rx="4" fill="#1f1f2a" />
      <rect x="42" y="-13" width="6" height="28" rx="3" fill="#41414f" />
      <rect x="36" y="7" width="48" height="9" fill="#c0392b" />
      <rect x="54" y="6" width="12" height="11" rx="2" fill="none" stroke="#ffd23f" strokeWidth="2.4" />
      <ellipse cx="60" cy="20" rx="42" ry="7.5" fill="#15151d" />
      <ellipse cx="60" cy="18.5" rx="30" ry="3" fill="#2a2a38" opacity="0.7" />
    </g>
  ),
  'hat-crown': (
    <g strokeLinejoin="round">
      <path d="M28 30 L32 3 L47 16 L60 -3 L73 16 L88 3 L92 30 Q60 38 28 30 Z" fill="#ffd23f" stroke="#a9690a" strokeWidth="3" />
      <path d="M30 26 Q60 34 90 26" fill="none" stroke="#a9690a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M36 12 L47 20 M84 12 L73 20" stroke="#fff3b0" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="3" r="3.6" fill="#e63946" stroke="#a9690a" strokeWidth="1.6" />
      <circle cx="60" cy="-3" r="4.2" fill="#3b82f6" stroke="#a9690a" strokeWidth="1.6" />
      <circle cx="88" cy="3" r="3.6" fill="#e63946" stroke="#a9690a" strokeWidth="1.6" />
      <circle cx="60" cy="27" r="3" fill="#e63946" stroke="#a9690a" strokeWidth="1.4" />
    </g>
  ),
};

const EYEWEAR = {
  'eye-round': (
    <g>
      <g fill="#ffffff" fillOpacity="0.2" stroke="#6b3f12" strokeWidth="3.2">
        <circle cx="45" cy="52" r="14" />
        <circle cx="75" cy="52" r="14" />
      </g>
      <path d="M58 50 Q60 47 62 50" fill="none" stroke="#6b3f12" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 49 L23 45 M89 49 L97 45" stroke="#6b3f12" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 44 Q41 41 47 42" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  'eye-heart': (
    <g strokeLinejoin="round">
      <g fill="#ff5a7a" fillOpacity="0.5" stroke="#d62d57" strokeWidth="3">
        <path d="M0 12 C-18 -2 -12 -18 0 -9 C12 -18 18 -2 0 12 Z" transform="translate(45 50) scale(1.15)" />
        <path d="M0 12 C-18 -2 -12 -18 0 -9 C12 -18 18 -2 0 12 Z" transform="translate(75 50) scale(1.15)" />
      </g>
      <path d="M29 46 L22 43 M91 46 L98 43" stroke="#d62d57" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 44 Q39 41 43 42" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
    </g>
  ),
  'eye-sun': (
    <g>
      <path d="M29 43 H58 V54 Q58 67 43.5 67 Q29 67 29 54 Z" fill="#17171f" />
      <path d="M62 43 H91 V54 Q91 67 76.5 67 Q62 67 62 54 Z" fill="#17171f" />
      <path d="M57 47 Q60 43 63 47" fill="none" stroke="#17171f" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M29 45 L21 42 M91 45 L99 42" stroke="#17171f" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M35 48 L43 48 M68 48 L76 48" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
    </g>
  ),
  'eye-monocle': (
    <g>
      <circle cx="75" cy="52" r="14.5" fill="#ffffff" fillOpacity="0.2" stroke="#c8962a" strokeWidth="3.6" />
      <path d="M66 44 Q70 41 75 42" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M86 62 Q99 78 90 100" fill="none" stroke="#c8962a" strokeWidth="2.2" strokeDasharray="2.4 2.6" strokeLinecap="round" />
    </g>
  ),
};

const OUTFITS = {
  'out-tie': (
    <g strokeLinejoin="round">
      <path d="M38 86 L57 90 L50 102 Z" fill="#fff" stroke="#d3d8e2" strokeWidth="1.4" />
      <path d="M82 86 L63 90 L70 102 Z" fill="#fff" stroke="#d3d8e2" strokeWidth="1.4" />
      <path d="M55 89 L65 89 L63.5 96 L56.5 96 Z" fill="#b81f2b" />
      <path d="M56.5 96 L63.5 96 L69 115 L60 122 L51 115 Z" fill="#e03a44" />
      <path d="M60 98 L60 117" stroke="#000" strokeWidth="1.6" opacity="0.14" strokeLinecap="round" />
    </g>
  ),
  'out-bow': (
    <g strokeLinejoin="round">
      <path d="M60 93 L38 82 Q36 92 38 104 Z" fill="#8b5cf6" stroke="#5f35c4" strokeWidth="2" />
      <path d="M60 93 L82 82 Q84 92 82 104 Z" fill="#8b5cf6" stroke="#5f35c4" strokeWidth="2" />
      <path d="M46 90 L54 93 M74 90 L66 93" stroke="#c4a8ff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <rect x="53.5" y="86" width="13" height="14" rx="4.5" fill="#6a3fd1" stroke="#5f35c4" strokeWidth="2" />
    </g>
  ),
  'out-scarf': (
    <g strokeLinejoin="round">
      <clipPath id="monScarfClip">
        <path d="M24 80 Q60 120 96 80 L99 92 Q60 132 21 92 Z" />
      </clipPath>
      <path d="M24 80 Q60 120 96 80 L99 92 Q60 132 21 92 Z" fill="#e5484d" />
      <g clipPath="url(#monScarfClip)" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" opacity="0.9">
        <path d="M14 78 L22 130" />
        <path d="M30 78 L38 130" />
        <path d="M46 78 L54 130" />
        <path d="M62 78 L70 130" />
        <path d="M78 78 L86 130" />
        <path d="M94 78 L102 130" />
      </g>
      <path d="M24 80 Q60 120 96 80" fill="none" stroke="#b9323a" strokeWidth="2" strokeLinecap="round" />
      <path d="M80 104 L94 99 L99 124 L85 128 Z" fill="#e5484d" stroke="#b9323a" strokeWidth="2" />
      <path d="M83 112 L97 108 M84 119 L98 115" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    </g>
  ),
  'out-medal': (
    <g strokeLinejoin="round">
      <path d="M35 81 L45 81 L60 95 L75 81 L85 81 L66 103 L54 103 Z" fill="#2f6df0" stroke="#1d4fc4" strokeWidth="1.6" />
      <path d="M48 81 L60 92 L72 81" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="60" cy="108" r="10.5" fill="#fff3b0" stroke="#a9690a" strokeWidth="3" />
      <path d="M60 102 L62 106.5 L67 107 L63.2 110 L64.4 115 L60 112.4 L55.6 115 L56.8 110 L53 107 L58 106.5 Z" fill="#e63946" />
    </g>
  ),
  'out-vest': (
    <g strokeLinejoin="round">
      <clipPath id="monVestClip">
        <circle cx="60" cy="61" r="47" />
      </clipPath>
      <g clipPath="url(#monVestClip)">
        <path d="M44 82 L76 82 L60 116 Z" fill="#fff" />
        <path d="M6 80 L46 83 L60 118 L6 118 Z" fill="#25314f" />
        <path d="M114 80 L74 83 L60 118 L114 118 Z" fill="#25314f" />
        <path d="M46 83 L60 118 M74 83 L60 118" fill="none" stroke="#415588" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M56.5 85 L63.5 85 L62.5 91 L57.5 91 Z" fill="#b81f2b" />
        <path d="M57.5 91 L62.5 91 L64.5 106 L60 110 L55.5 106 Z" fill="#e03a44" />
        <circle cx="38" cy="98" r="2.4" fill="#ffd23f" />
        <circle cx="82" cy="98" r="2.4" fill="#ffd23f" />
        <circle cx="46" cy="106" r="2.4" fill="#ffd23f" />
        <circle cx="74" cy="106" r="2.4" fill="#ffd23f" />
      </g>
    </g>
  ),
};

// The cape hangs behind the body, so it is drawn before the coin.
const BACK = {
  'out-cape': (
    <g strokeLinejoin="round">
      <path d="M22 50 Q-8 88 -4 124 Q16 114 36 126 Q60 114 84 126 Q104 114 124 124 Q128 88 98 50 Z" fill="#d62839" stroke="#9c1626" strokeWidth="2.4" />
      <path d="M12 74 Q4 98 6 116 M108 74 Q116 98 114 116" fill="none" stroke="#f05a68" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <path d="M36 112 Q36 120 38 124 M84 112 Q84 120 82 124" fill="none" stroke="#9c1626" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </g>
  ),
};

// The clasp and chain that hold the cape on, drawn in front.
const CAPE_CLASP = (
  <g>
    <path d="M29 90 Q60 112 91 90" fill="none" stroke="#ffd23f" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="29" cy="90" r="4.2" fill="#ffd23f" stroke="#a9690a" strokeWidth="1.6" />
    <circle cx="91" cy="90" r="4.2" fill="#ffd23f" stroke="#a9690a" strokeWidth="1.6" />
  </g>
);

export function WardrobeBack({ worn = {} }) {
  return worn.outfit && BACK[worn.outfit] ? <g className="wear wear-back">{BACK[worn.outfit]}</g> : null;
}

// Front layers, bottom to top: outfit, eyewear, hat.
export function WardrobeFront({ worn = {} }) {
  const outfit = worn.outfit && OUTFITS[worn.outfit];
  const eyewear = worn.eyewear && EYEWEAR[worn.eyewear];
  const hat = worn.hat && HATS[worn.hat];

  return (
    <>
      {outfit && <g className="wear wear-outfit">{outfit}</g>}
      {worn.outfit === 'out-cape' && <g className="wear wear-outfit">{CAPE_CLASP}</g>}
      {eyewear && <g className="wear wear-eyewear">{eyewear}</g>}
      {hat && <g className="wear wear-hat">{hat}</g>}
    </>
  );
}
