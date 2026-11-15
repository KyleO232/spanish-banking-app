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

// ---------------------------------------------------------------------------
// Costumes: complete head-to-toe looks. While one is worn it replaces everything else.
// "hides" says which of her own parts the costume covers, and the costume then draws
// its own face / arms / feet (limbs go in 'back' so they sit behind the coin).
// The pop-culture ones are look-alikes (hair, hat, mustache, colors) rather than copies.
// ---------------------------------------------------------------------------

const DISC_CLIP = (
  <clipPath id="monCostumeClip">
    <circle cx="60" cy="61" r="47" />
  </clipPath>
);

// a simple limb pair in one color, for costumes that hide her own gold arms and feet
const limbs = (arm, foot, extra = null) => (
  <g>
    <ellipse cx="13" cy="72" rx="8" ry="12" transform="rotate(18 13 72)" fill={arm} />
    <ellipse cx="107" cy="72" rx="8" ry="12" transform="rotate(-18 107 72)" fill={arm} />
    <ellipse cx="45" cy="108" rx="11" ry="6" fill={foot} />
    <ellipse cx="75" cy="108" rx="11" ry="6" fill={foot} />
    {extra}
  </g>
);

const COSTUMES = {
  'cos-skier': {
    back: (
      <g strokeLinejoin="round">
        <path d="M9 113 Q10 108 18 110 L50 111 Q53 111 53 114 Q53 117 50 117 L16 117 Q8 117 9 113 Z" fill="#e5484d" />
        <path d="M111 113 Q110 108 102 110 L70 111 Q67 111 67 114 Q67 117 70 117 L104 117 Q112 117 111 113 Z" fill="#e5484d" />
        <path d="M22 114 H47 M73 114 H98" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      </g>
    ),
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <g clipPath="url(#monCostumeClip)">
          <path d="M6 84 Q60 72 114 84 L114 124 L6 124 Z" fill="#2f6df0" />
          <path d="M6 95 Q60 83 114 95 L114 100 Q60 88 6 100 Z" fill="#fff" />
          <path d="M60 82 V112" stroke="#1d4fc4" strokeWidth="2.4" />
          <rect x="57.5" y="89" width="5" height="8" rx="1.6" fill="#ffd23f" />
        </g>
        <path d="M9 72 L-1 117 M111 72 L121 117" stroke="#6b3f12" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="-0.5" cy="111" r="3.6" fill="none" stroke="#6b3f12" strokeWidth="1.8" />
        <circle cx="120.5" cy="111" r="3.6" fill="none" stroke="#6b3f12" strokeWidth="1.8" />
        <circle cx="11" cy="76" r="6.8" fill="#2f6df0" stroke="#1d4fc4" strokeWidth="2" />
        <circle cx="109" cy="76" r="6.8" fill="#2f6df0" stroke="#1d4fc4" strokeWidth="2" />
        <path d="M25 33 Q25 1 60 1 Q95 1 95 33 Z" fill="#e5484d" />
        <path d="M60 1 V33" stroke="#fff" strokeWidth="5" opacity="0.92" />
        <rect x="23" y="23" width="74" height="7" rx="3.5" fill="#25314f" />
        <rect x="38" y="13" width="44" height="20" rx="10" fill="#ffb347" stroke="#25314f" strokeWidth="3" />
        <path d="M45 20 Q52 16 59 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      </g>
    ),
  },

  'cos-ghost': {
    front: (
      <g strokeLinejoin="round">
        <path d="M12 74 Q1 77 4 94 Q10 99 15 91" fill="#f6f8fc" stroke="#c3cbe0" strokeWidth="2.6" />
        <path d="M108 74 Q119 77 116 94 Q110 99 105 91" fill="#f6f8fc" stroke="#c3cbe0" strokeWidth="2.6" />
        <path
          d="M12 58 Q12 3 60 3 Q108 3 108 58 L108 112 Q101 104 94 114 Q86 104 77 114 Q68 104 60 114 Q52 104 43 114 Q34 104 26 114 Q19 104 12 112 Z"
          fill="#f6f8fc"
          stroke="#c3cbe0"
          strokeWidth="2.6"
        />
        <path d="M21 42 Q23 22 39 13" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
        <ellipse cx="46" cy="46" rx="6.4" ry="9.4" fill="#1b1b26" />
        <ellipse cx="74" cy="46" rx="6.4" ry="9.4" fill="#1b1b26" />
        <ellipse cx="60" cy="69" rx="5.6" ry="8" fill="#1b1b26" />
        <circle cx="34" cy="63" r="5" fill="#ff8fa3" opacity="0.5" />
        <circle cx="86" cy="63" r="5" fill="#ff8fa3" opacity="0.5" />
      </g>
    ),
  },

  'cos-pumpkin': {
    back: limbs('#d96a00', '#d96a00'),
    front: (
      <g strokeLinejoin="round">
        <circle cx="60" cy="64" r="46" fill="#b85a00" />
        <circle cx="60" cy="58" r="46" fill="#f0780f" />
        <ellipse cx="38" cy="62" rx="26" ry="44" fill="#f0780f" stroke="#b85a00" strokeWidth="2.4" />
        <ellipse cx="82" cy="62" rx="26" ry="44" fill="#f0780f" stroke="#b85a00" strokeWidth="2.4" />
        <ellipse cx="60" cy="62" rx="26" ry="46" fill="#ff8a1f" stroke="#b85a00" strokeWidth="2.4" />
        <path d="M36 24 Q25 62 36 102 M84 24 Q95 62 84 102" fill="none" stroke="#d96a00" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        <path d="M54 20 Q53 9 57 2 Q65 -1 66 7 Q66 14 66 20 Z" fill="#4c7a2a" stroke="#2f5418" strokeWidth="2" />
        <path d="M66 11 Q80 2 85 13 Q77 13 71 18" fill="none" stroke="#4c7a2a" strokeWidth="3" strokeLinecap="round" />
        <g fill="#ffd23f" stroke="#3a1d00" strokeWidth="3">
          <path d="M33 55 L47 55 L40 38 Z" />
          <path d="M73 55 L87 55 L80 38 Z" />
          <path d="M60 60 L55 69 H65 Z" />
          <path d="M31 73 L40 69 L47 78 L54 70 L60 79 L66 70 L73 78 L80 69 L89 73 Q85 95 60 97 Q35 95 31 73 Z" />
        </g>
      </g>
    ),
  },

  'cos-mummy': {
    back: limbs('#e9dcbc', '#e9dcbc'),
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <circle cx="60" cy="64" r="46" fill="#cbbd96" />
        <circle cx="60" cy="58" r="46" fill="#ece0c2" />
        <g clipPath="url(#monCostumeClip)" fill="none" stroke="#bfae82" strokeWidth="2.2" strokeLinecap="round">
          <path d="M0 22 L120 10 M0 31 L120 21 M0 40 L120 33" />
          <path d="M0 68 L120 80 M0 77 L120 88 M0 86 L120 96 M0 95 L120 104 M0 104 L120 110" />
          <path d="M30 14 L42 38 M70 10 L58 38 M44 70 L36 108 M78 72 L88 106" />
          <path d="M14 42 L106 40 L106 62 L14 64 Z" fill="#24190f" stroke="none" />
        </g>
        <ellipse cx="46" cy="52" rx="9" ry="8" fill="#fff" />
        <ellipse cx="74" cy="52" rx="9" ry="8" fill="#fff" />
        <circle cx="47" cy="53" r="4.6" fill="#2b1a00" />
        <circle cx="75" cy="53" r="4.6" fill="#2b1a00" />
        <circle cx="48.6" cy="51.2" r="1.6" fill="#fff" />
        <circle cx="76.6" cy="51.2" r="1.6" fill="#fff" />
        <path d="M84 98 Q97 107 99 122 L91 120 Q87 110 78 104 Z" fill="#ece0c2" stroke="#bfae82" strokeWidth="1.8" />
      </g>
    ),
  },

  'cos-skeleton': {
    back: limbs(
      '#1b1b26',
      '#1b1b26',
      <g fill="#f6f8fc">
        <circle cx="7" cy="83" r="3.4" />
        <circle cx="113" cy="83" r="3.4" />
        <circle cx="41" cy="113" r="3" />
        <circle cx="79" cy="113" r="3" />
      </g>
    ),
    front: (
      <g strokeLinejoin="round" strokeLinecap="round">
        <circle cx="60" cy="64" r="46" fill="#0d0d14" stroke="#3b3b52" strokeWidth="1.6" />
        <circle cx="60" cy="58" r="46" fill="#1b1b26" stroke="#3b3b52" strokeWidth="1.6" />
        <circle cx="60" cy="58" r="37" fill="none" stroke="#2c2c3a" strokeWidth="2.5" />
        <g fill="none" stroke="#f6f8fc" strokeWidth="3.4">
          <path d="M60 76 V102" />
          <path d="M37 82 Q60 92 83 82" />
          <path d="M40 90 Q60 100 80 90" />
          <path d="M45 97 Q60 105 75 97" />
        </g>
        <path
          d="M60 13 C36 13 28 31 32 47 C34 55 40 57 40 63 L40 69 Q40 72 43 72 L77 72 Q80 72 80 69 L80 63 C80 57 86 55 88 47 C92 31 84 13 60 13 Z"
          fill="#f6f8fc"
        />
        <ellipse cx="47" cy="43" rx="9" ry="10" fill="#1b1b26" />
        <ellipse cx="73" cy="43" rx="9" ry="10" fill="#1b1b26" />
        <path d="M60 51 L55 61 H65 Z" fill="#1b1b26" strokeWidth="2" stroke="#1b1b26" />
        <path d="M42 65 H78 M46 65 V72 M53 65 V72 M60 65 V72 M67 65 V72 M74 65 V72" fill="none" stroke="#1b1b26" strokeWidth="2.2" />
      </g>
    ),
  },

  'cos-witch': {
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <g clipPath="url(#monCostumeClip)">
          <path d="M6 83 Q60 73 114 83 L114 124 L6 124 Z" fill="#241a3d" />
          <path d="M6 87 Q60 77 114 87" fill="none" stroke="#8b5cf6" strokeWidth="3" />
          <g fill="#ffd23f">
            <circle cx="38" cy="99" r="1.8" />
            <circle cx="80" cy="97" r="1.8" />
            <circle cx="60" cy="105" r="1.8" />
          </g>
        </g>
        <path d="M112 38 L101 112" stroke="#8a5a2b" strokeWidth="4.4" strokeLinecap="round" />
        <path d="M96 105 L108 102 L117 126 L98 128 Z" fill="#d9a441" stroke="#a9690a" strokeWidth="2" />
        <path d="M101 112 L103 127 M107 110 L109 126" stroke="#a9690a" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="60" cy="25" rx="46" ry="8.5" fill="#1d1630" stroke="#0f0b1a" strokeWidth="1.5" />
        <path d="M36 24 Q50 14 54 -6 Q58 -26 74 -31 Q71 -18 76 -4 Q82 12 86 24 Z" fill="#241a3d" />
        <path d="M38 20 Q60 28 84 20 L86 25 Q60 33 36 26 Z" fill="#8b5cf6" />
        <rect x="54" y="19" width="12" height="11" rx="2" fill="none" stroke="#ffd23f" strokeWidth="2.4" />
      </g>
    ),
  },

  'cos-vampire': {
    back: (
      <g strokeLinejoin="round">
        <path d="M18 54 Q-6 92 -2 124 Q60 138 122 124 Q126 92 102 54 Z" fill="#b3162a" stroke="#1b1b26" strokeWidth="3" />
        <path d="M26 62 L2 14 L44 42 Z" fill="#1b1b26" stroke="#3b3b52" strokeWidth="1.6" />
        <path d="M94 62 L118 14 L76 42 Z" fill="#1b1b26" stroke="#3b3b52" strokeWidth="1.6" />
        <path d="M27 58 L9 24 L40 43 Z" fill="#b3162a" />
        <path d="M93 58 L111 24 L80 43 Z" fill="#b3162a" />
      </g>
    ),
    front: (
      <g strokeLinejoin="round">
        <path d="M17 42 Q15 4 60 3 Q105 4 103 42 Q99 22 82 22 Q70 22 60 37 Q50 22 38 22 Q21 22 17 42 Z" fill="#1b1b26" stroke="#3b3b52" strokeWidth="1.6" />
        <path d="M52.5 72 L57.5 72 L55 80 Z" fill="#fff" stroke="#cdd3e0" strokeWidth="1" />
        <path d="M62.5 72 L67.5 72 L65 80 Z" fill="#fff" stroke="#cdd3e0" strokeWidth="1" />
        <circle cx="60" cy="93" r="4.4" fill="#e63946" stroke="#ffd23f" strokeWidth="2" />
      </g>
    ),
  },

  'cos-monster': {
    back: limbs('#6fb645', '#3d6e24'),
    front: (
      <g strokeLinejoin="round">
        <rect x="-1" y="58" width="6" height="14" rx="2" fill="#7c8599" />
        <rect x="4" y="61" width="12" height="8" rx="2" fill="#aab2c4" />
        <rect x="115" y="58" width="6" height="14" rx="2" fill="#7c8599" />
        <rect x="104" y="61" width="12" height="8" rx="2" fill="#aab2c4" />
        <circle cx="60" cy="64" r="46" fill="#4e8a2e" />
        <circle cx="60" cy="58" r="46" fill="#7ac74f" />
        <circle cx="60" cy="58" r="37" fill="none" stroke="#a6dd7e" strokeWidth="2.5" opacity="0.7" />
        <path d="M15 36 L17 6 Q60 -4 103 6 L105 36 Q100 27 94 25 L60 21 L26 25 Q20 27 15 36 Z" fill="#1b1b26" stroke="#3b3b52" strokeWidth="1.6" />
        <path d="M40 31 H80 M46 27 V35 M54 27 V35 M62 27 V35 M70 27 V35 M78 27 V35" fill="none" stroke="#2b3a1a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M33 43 L56 48 M87 43 L64 48" fill="none" stroke="#1b1b26" strokeWidth="4.4" strokeLinecap="round" />
        <ellipse cx="46" cy="55" rx="8.4" ry="7.6" fill="#fff" />
        <ellipse cx="74" cy="55" rx="8.4" ry="7.6" fill="#fff" />
        <circle cx="46" cy="56" r="3.8" fill="#2b1a00" />
        <circle cx="74" cy="56" r="3.8" fill="#2b1a00" />
        <path d="M37.6 55 A8.4 7.6 0 0 1 54.4 55 Z" fill="#6fb645" />
        <path d="M65.6 55 A8.4 7.6 0 0 1 82.4 55 Z" fill="#6fb645" />
        <path d="M60 60 L56.5 68 H63" fill="none" stroke="#3d6e24" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M42 79 Q60 75 78 79 M47 75 V83 M55 75 V83 M65 75 V83 M73 75 V83" fill="none" stroke="#1b1b26" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },

  'cos-tycoon': {
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <g clipPath="url(#monCostumeClip)">
          <path d="M6 82 Q60 74 114 82 L114 124 L6 124 Z" fill="#17171f" />
          <path d="M44 84 L76 84 L60 114 Z" fill="#fff" />
          <path d="M44 84 L60 114 M76 84 L60 114" fill="none" stroke="#34344a" strokeWidth="2" />
        </g>
        <path d="M60 94 L47 87 V101 Z" fill="#c0392b" />
        <path d="M60 94 L73 87 V101 Z" fill="#c0392b" />
        <rect x="56.5" y="90" width="7" height="8" rx="2" fill="#8f2a20" />
        <path d="M110 66 L114 118" stroke="#6b3f12" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="110" cy="64" r="4.6" fill="#ffd23f" stroke="#a9690a" strokeWidth="1.6" />
        <path
          d="M60 71 C54 66 44 66 40 72 C38 76 42 79 46 76 C50 74 54 74 60 76 C66 74 70 74 74 76 C78 79 82 76 80 72 C76 66 66 66 60 71 Z"
          fill="#fff"
          stroke="#cdd3e0"
          strokeWidth="1.6"
        />
        {HATS['hat-top']}
        {EYEWEAR['eye-monocle']}
      </g>
    ),
  },

  'cos-wizard': {
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <clipPath id="monScarfStripes">
          <path d="M26 82 Q60 108 94 82 L98 93 Q60 124 22 93 Z" />
        </clipPath>
        <g clipPath="url(#monCostumeClip)">
          <path d="M6 82 Q60 74 114 82 L114 124 L6 124 Z" fill="#2a2438" />
        </g>
        <path d="M26 82 Q60 108 94 82 L98 93 Q60 124 22 93 Z" fill="#b3162a" />
        <g clipPath="url(#monScarfStripes)" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round">
          <path d="M18 84 L30 126 M38 84 L50 126 M58 84 L70 126 M78 84 L90 126" />
        </g>
        <path d="M76 101 L90 97 L94 121 L80 125 Z" fill="#b3162a" stroke="#7a0f1d" strokeWidth="1.8" />
        <path d="M80 108 L92 104 M81 115 L93 111" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
        <path d="M104 75 L119 49" stroke="#7a5126" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M119 43 L120.4 47.6 L125 49 L120.4 50.4 L119 55 L117.6 50.4 L113 49 L117.6 47.6 Z" fill="#fff3b0" />
        <path
          d="M16 40 Q13 8 60 5 Q107 8 104 40 Q98 24 88 27 L84 15 L74 27 L68 13 L58 27 L48 14 L42 27 L34 16 L28 28 Q20 25 16 40 Z"
          fill="#1b1b26"
          stroke="#3b3b52"
          strokeWidth="1.6"
        />
        <path d="M63 26 L57 33 L61 33 L55 41" fill="none" stroke="#d62839" strokeWidth="2.6" strokeLinecap="round" />
        {EYEWEAR['eye-round']}
      </g>
    ),
  },

  'cos-plumber': {
    front: (
      <g strokeLinejoin="round">
        {DISC_CLIP}
        <g clipPath="url(#monCostumeClip)">
          <path d="M6 82 Q60 74 114 82 L114 124 L6 124 Z" fill="#e5322d" />
          <path d="M8 93 Q60 86 112 93 L112 124 L8 124 Z" fill="#2f6df0" />
          <path d="M32 77 L42 77 L45 97 L34 97 Z" fill="#2f6df0" />
          <path d="M78 77 L88 77 L86 97 L75 97 Z" fill="#2f6df0" />
        </g>
        <circle cx="38" cy="94" r="2.6" fill="#ffd23f" />
        <circle cx="82" cy="94" r="2.6" fill="#ffd23f" />
        <circle cx="11" cy="76" r="6.8" fill="#fff" stroke="#cfd5e3" strokeWidth="2" />
        <circle cx="109" cy="76" r="6.8" fill="#fff" stroke="#cfd5e3" strokeWidth="2" />
        <ellipse cx="60" cy="63" rx="7.8" ry="6.6" fill="#f0a64a" stroke="#c98306" strokeWidth="1.6" />
        <path
          d="M60 71 C54 66 44 67 41 73 C40 78 46 78 50 75 C54 73 57 73 60 75 C63 73 66 73 70 75 C74 78 80 78 79 73 C76 67 66 66 60 71 Z"
          fill="#1b1b26"
        />
        <path d="M24 33 Q24 3 60 3 Q96 3 96 33 Z" fill="#e5322d" />
        <path d="M58 30 Q98 24 108 35 Q90 41 58 37 Z" fill="#b8211d" />
        <circle cx="58" cy="18" r="8.4" fill="#fff" stroke="#e8ebf3" strokeWidth="1.6" />
      </g>
    ),
  },

  'cos-spider': {
    back: limbs('#d62839', '#1d4fc4'),
    front: (
      <g strokeLinejoin="round" strokeLinecap="round">
        {DISC_CLIP}
        <circle cx="60" cy="64" r="46" fill="#8f1624" />
        <circle cx="60" cy="58" r="46" fill="#d62839" />
        <g clipPath="url(#monCostumeClip)">
          <g fill="none" stroke="#1b1b26" strokeWidth="1.8">
            <path d="M60 58 L60 4 M60 58 L98 20 M60 58 L114 58 M60 58 L98 96 M60 58 L22 96 M60 58 L6 58 M60 58 L22 20" />
            <circle cx="60" cy="58" r="13" />
            <circle cx="60" cy="58" r="27" />
            <circle cx="60" cy="58" r="42" />
          </g>
          <path d="M6 90 Q60 102 114 90 L114 124 L6 124 Z" fill="#1d4fc4" />
        </g>
        <path d="M31 51 Q44 35 58 53 Q45 61 31 51 Z" fill="#fff" stroke="#1b1b26" strokeWidth="3.2" />
        <path d="M89 51 Q76 35 62 53 Q75 61 89 51 Z" fill="#fff" stroke="#1b1b26" strokeWidth="3.2" />
      </g>
    ),
  },
};

export function WardrobeBack({ worn = {} }) {
  const back = worn.costume ? COSTUMES[worn.costume]?.back : worn.outfit && BACK[worn.outfit];
  return back ? <g className="wear wear-back">{back}</g> : null;
}

// Front layers. A costume is one complete layer; otherwise, bottom to top: outfit, eyewear, hat.
export function WardrobeFront({ worn = {} }) {
  if (worn.costume) {
    const costume = COSTUMES[worn.costume];
    return costume ? <g className="wear wear-costume">{costume.front}</g> : null;
  }

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
