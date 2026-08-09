function Leaf({ className }) {
  return (
    <svg className={`autumn-leaf ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20,4 C30,10 34,22 20,36 C6,22 10,10 20,4 Z" />
      <path
        className="autumn-leaf-vein"
        d="M20,6 L20,34 M20,14 L12,10 M20,14 L28,10 M20,22 L11,20 M20,22 L29,20"
        fill="none"
      />
    </svg>
  );
}

function Pumpkin({ className }) {
  return (
    <svg className={`autumn-pumpkin ${className}`} viewBox="0 0 60 50" aria-hidden="true">
      <path className="autumn-pumpkin-stem" d="M30,10 C28,3 34,1 36,5" fill="none" />
      <ellipse className="autumn-pumpkin-body" cx="17" cy="31" rx="13" ry="15" />
      <ellipse className="autumn-pumpkin-body autumn-pumpkin-front" cx="30" cy="29" rx="15" ry="17" />
      <ellipse className="autumn-pumpkin-body" cx="43" cy="31" rx="13" ry="15" />
    </svg>
  );
}

function Lantern({ className }) {
  return (
    <svg className={`autumn-lantern ${className}`} viewBox="0 0 40 60" aria-hidden="true">
      <path className="autumn-lantern-hook" d="M20,2 L20,10" fill="none" />
      <circle className="autumn-lantern-glow" cx="20" cy="31" r="15" />
      <rect className="autumn-lantern-frame" x="10" y="10" width="20" height="8" rx="2" />
      <rect className="autumn-lantern-body" x="12" y="18" width="16" height="26" rx="3" />
      <rect className="autumn-lantern-frame" x="10" y="44" width="20" height="8" rx="2" />
    </svg>
  );
}

export default function AutumnBackground() {
  return (
    <div className="autumn-bg" aria-hidden="true">
      <Lantern className="autumn-lantern-1" />

      <Leaf className="autumn-leaf-a" />
      <Leaf className="autumn-leaf-b" />
      <Leaf className="autumn-leaf-c" />
      <Leaf className="autumn-leaf-d" />

      <Pumpkin className="autumn-pumpkin-1" />
      <Pumpkin className="autumn-pumpkin-2" />
    </div>
  );
}
