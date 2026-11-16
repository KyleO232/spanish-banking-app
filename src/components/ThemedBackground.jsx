import { useMemo } from 'react';
import beachImg from '../assets/backgrounds/beach.jpg';
import autumnImg from '../assets/backgrounds/autumn.jpg';
import alpineImg from '../assets/backgrounds/alpine.jpg';
import springImg from '../assets/backgrounds/spring.jpg';

const THEMES = {
  alpine: {
    image: alpineImg,
    fill: 'var(--alpine-fill)',
  },
  spring: {
    image: springImg,
    fill: 'var(--spring-fill)',
  },
  beach: {
    image: beachImg,
    fill: 'var(--beach-sand-bottom)',
  },
  autumn: {
    image: autumnImg,
    fill: 'var(--autumn-ground-bottom)',
  },
};

const rand = (min, max) => min + Math.random() * (max - min);

const LEAF_COLORS = ['#ff8a3d', '#e5482f', '#f2b33d', '#c4602a'];

// Leaves drifting down through the autumn photo.
function Leaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: rand(2, 96),
        size: rand(14, 26),
        delay: -rand(0, 18), // negative: already mid-fall when the screen opens
        duration: rand(11, 19),
        sway: rand(14, 42),
        color: LEAF_COLORS[i % LEAF_COLORS.length],
      })),
    []
  );

  return (
    <div className="particles" aria-hidden="true">
      {leaves.map((l) => (
        <svg
          key={l.id}
          className="leaf"
          viewBox="0 0 24 24"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            '--sway': `${l.sway}px`,
            fill: l.color,
          }}
        >
          <path d="M12 2C19 7 21 15 12 22C3 15 5 7 12 2Z" />
          <path d="M12 6V20" stroke="rgba(0,0,0,0.25)" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  );
}

const PETAL_COLORS = ['#ffd1dc', '#ffb7c9', '#fff0f4', '#ffc2d1'];

// Blossom petals fluttering down through the spring photo.
function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: rand(1, 98),
        size: rand(9, 17),
        delay: -rand(0, 18),
        duration: rand(12, 21),
        sway: rand(18, 50),
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    []
  );

  return (
    <div className="particles" aria-hidden="true">
      {petals.map((p) => (
        <svg
          key={p.id}
          className="petal"
          viewBox="0 0 24 24"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--sway': `${p.sway}px`,
            fill: p.color,
          }}
        >
          <path d="M12 2C17 5 21 11 17 17C15 20 12 22 12 22C12 22 9 20 7 17C3 11 7 5 12 2Z" />
          <path d="M12 3L12 10" stroke="rgba(190,70,110,0.35)" strokeWidth="1.2" fill="none" />
        </svg>
      ))}
    </div>
  );
}

// Snow drifting down over the alpine photo.
function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: rand(1, 98),
        size: rand(3, 8),
        delay: -rand(0, 16),
        duration: rand(10, 20),
        sway: rand(10, 30),
        opacity: rand(0.55, 0.95),
      })),
    []
  );

  return (
    <div className="particles" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            '--sway': `${f.sway}px`,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Sun-glints on the water and a couple of gulls gliding past.
function Seaside() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: rand(4, 94),
        top: rand(20, 96),
        size: rand(8, 17),
        delay: -rand(0, 4),
        duration: rand(2, 3.6),
      })),
    []
  );
  const gulls = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) => ({
        id: i,
        top: rand(5, 18) + i * 9,
        duration: rand(22, 30),
        delay: -rand(0, 20),
        size: rand(26, 36),
      })),
    []
  );

  return (
    <div className="particles" aria-hidden="true">
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="sparkle"
          viewBox="0 0 24 24"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
        </svg>
      ))}
      {gulls.map((g) => (
        <svg
          key={g.id}
          className="gull"
          viewBox="0 0 32 16"
          style={{
            top: `${g.top}%`,
            width: g.size,
            animationDuration: `${g.duration}s`,
            animationDelay: `${g.delay}s`,
          }}
        >
          <path d="M2 12 Q9 0 16 10 Q23 0 30 12" />
        </svg>
      ))}
    </div>
  );
}

export default function ThemedBackground({ theme }) {
  const cfg = THEMES[theme] || THEMES.beach;

  return (
    <div className="theme-bg" style={{ '--theme-fill': cfg.fill }} aria-hidden="true">
      <div className="theme-bg-hero" style={{ backgroundImage: `url(${cfg.image})` }} />
      {theme === 'autumn' ? <Leaves /> : theme === 'alpine' ? <Snow /> : theme === 'spring' ? <Petals /> : <Seaside />}
    </div>
  );
}
