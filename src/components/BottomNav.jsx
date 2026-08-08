import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();
  const isVocab = pathname.startsWith('/vocabulary');

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link to="/" className={`bottom-nav-item ${!isVocab ? 'active' : ''}`} aria-label="Path">
        <span className="bottom-nav-icon">🏠</span>
      </Link>
      <Link
        to="/vocabulary"
        className={`bottom-nav-item ${isVocab ? 'active' : ''}`}
        aria-label="Vocabulary"
      >
        <span className="bottom-nav-icon">📖</span>
      </Link>
    </nav>
  );
}
