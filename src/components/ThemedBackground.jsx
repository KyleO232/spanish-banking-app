import beachImg from '../assets/backgrounds/beach.jpg';
import autumnImg from '../assets/backgrounds/autumn.jpg';

const THEMES = {
  beach: {
    image: beachImg,
    fill: 'var(--beach-sand-bottom)',
  },
  autumn: {
    image: autumnImg,
    fill: 'var(--autumn-ground-bottom)',
  },
};

export default function ThemedBackground({ theme }) {
  const cfg = THEMES[theme] || THEMES.beach;

  return (
    <div className="theme-bg" style={{ '--theme-fill': cfg.fill }} aria-hidden="true">
      <div className="theme-bg-hero" style={{ backgroundImage: `url(${cfg.image})` }} />
    </div>
  );
}
