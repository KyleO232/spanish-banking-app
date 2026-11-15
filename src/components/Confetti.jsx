import { useMemo } from 'react';

const COLORS = ['#35c9a5', '#f4c430', '#ff6b6b', '#4dabf7', '#b197fc', '#ffa94d'];

export default function Confetti({ count = 48 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 6 + Math.random() * 7;
        const round = Math.random() > 0.65;
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.7,
          duration: 2.4 + Math.random() * 1.6,
          width: size,
          height: round ? size : size * 1.7,
          radius: round ? '50%' : '2px',
          color: COLORS[i % COLORS.length],
          drift: (Math.random() - 0.5) * 140,
          spin: 360 + Math.random() * 540,
        };
      }),
    [count]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.radius,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
