function Crab({ className }) {
  return (
    <svg className={`beach-crab ${className}`} viewBox="0 0 64 40" aria-hidden="true">
      <path d="M8,18 Q2,10 10,6 Q16,10 14,18 Z" />
      <path d="M56,18 Q62,10 54,6 Q48,10 50,18 Z" />
      <ellipse cx="32" cy="20" rx="18" ry="12" />
      <circle className="beach-crab-eye" cx="24" cy="11" r="3" />
      <circle className="beach-crab-eye" cx="40" cy="11" r="3" />
      <path
        className="beach-crab-legs"
        d="M18,30 L10,38 M24,32 L18,40 M40,32 L46,40 M46,30 L54,38"
        fill="none"
      />
    </svg>
  );
}

export default function BeachBackground() {
  return (
    <div className="beach-bg" aria-hidden="true">
      <svg className="beach-waves" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path
          className="beach-wave beach-wave-back"
          d="M0,30 C50,10 100,50 150,30 C200,10 250,50 300,30 C350,10 400,50 400,30 L400,60 L0,60 Z"
        />
        <path
          className="beach-wave beach-wave-front"
          d="M0,40 C60,55 120,25 180,40 C240,55 300,25 360,40 C380,45 400,42 400,40 L400,60 L0,60 Z"
        />
      </svg>

      <svg className="beach-palm" viewBox="0 0 100 140">
        <path className="beach-palm-trunk" d="M50,140 C48,100 44,70 55,40" fill="none" />
        <g className="beach-palm-leaves">
          <path d="M55,40 C30,25 10,35 5,55 C25,50 45,48 55,40 Z" />
          <path d="M55,40 C35,15 15,10 5,20 C20,30 40,38 55,40 Z" />
          <path d="M55,40 C70,15 95,15 100,25 C85,32 65,38 55,40 Z" />
          <path d="M55,40 C80,30 100,40 100,55 C80,48 60,45 55,40 Z" />
          <path d="M55,40 C55,15 50,0 45,0 C48,15 50,30 55,40 Z" />
        </g>
      </svg>

      <Crab className="beach-crab-1" />
      <Crab className="beach-crab-2" />
      <Crab className="beach-crab-3" />
    </div>
  );
}
