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

function Tree({ className }) {
  return (
    <svg className={`autumn-tree ${className}`} viewBox="0 0 100 130" aria-hidden="true">
      <path className="autumn-tree-trunk" d="M50,130 L50,78 M50,98 L36,84 M50,94 L64,80" fill="none" />
      <circle className="autumn-tree-leaf-2" cx="34" cy="56" r="23" />
      <circle className="autumn-tree-leaf-1" cx="62" cy="48" r="27" />
      <circle className="autumn-tree-leaf-3" cx="54" cy="72" r="21" />
      <circle className="autumn-tree-leaf-2" cx="30" cy="78" r="17" />
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

function Mushroom({ className }) {
  return (
    <svg className={`autumn-mushroom ${className}`} viewBox="0 0 30 30" aria-hidden="true">
      <rect className="autumn-mushroom-stem" x="12" y="16" width="6" height="12" rx="2" />
      <path className="autumn-mushroom-cap" d="M15,4 C24,4 27,16 15,16 C3,16 6,4 15,4 Z" />
      <circle className="autumn-mushroom-spot" cx="11" cy="8" r="1.6" />
      <circle className="autumn-mushroom-spot" cx="19" cy="9" r="1.4" />
      <circle className="autumn-mushroom-spot" cx="15" cy="6" r="1.2" />
    </svg>
  );
}

export default function AutumnBackground() {
  return (
    <div className="autumn-bg" aria-hidden="true">
      <svg className="autumn-sun" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="14" />
      </svg>

      <Lantern className="autumn-lantern-1" />

      <Tree className="autumn-tree-1" />
      <Tree className="autumn-tree-2" />

      <Leaf className="autumn-leaf-a" />
      <Leaf className="autumn-leaf-b" />
      <Leaf className="autumn-leaf-c" />
      <Leaf className="autumn-leaf-d" />
      <Leaf className="autumn-leaf-e" />
      <Leaf className="autumn-leaf-f" />
      <Leaf className="autumn-leaf-g" />

      <Pumpkin className="autumn-pumpkin-1" />
      <Pumpkin className="autumn-pumpkin-2" />

      <Mushroom className="autumn-mushroom-1" />
      <Mushroom className="autumn-mushroom-2" />
    </div>
  );
}
