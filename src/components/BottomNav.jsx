import { Link, useLocation } from 'react-router-dom';
import { Route, BookOpen } from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();
  const isVocab = pathname.startsWith('/vocabulary');

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link to="/" className={`bottom-nav-item ${!isVocab ? 'active' : ''}`} aria-label="Path">
        <Route size={26} strokeWidth={2.4} />
      </Link>
      <Link
        to="/vocabulary"
        className={`bottom-nav-item ${isVocab ? 'active' : ''}`}
        aria-label="Vocabulary"
      >
        <BookOpen size={26} strokeWidth={2.4} />
      </Link>
    </nav>
  );
}
