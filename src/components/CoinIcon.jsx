// A plain coin (like Monedita herself): used wherever coins are shown.
export default function CoinIcon({ size = 18, strokeWidth = 2.6, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth={strokeWidth} fill="currentColor" fillOpacity="0.18" />
      <circle cx="12" cy="12" r="5.6" strokeWidth={Math.max(1.6, strokeWidth - 0.9)} />
      <path d="M12 9.4 V14.6" strokeWidth={Math.max(1.6, strokeWidth - 0.9)} />
    </svg>
  );
}
