import { Link, useLocation } from 'react-router-dom';
import { Route, BookOpen, User } from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();
  const section = pathname.startsWith('/vocabulary')
    ? 'vocab'
    : pathname.startsWith('/account')
      ? 'account'
      : 'path';

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link to="/" className={`bottom-nav-item ${section === 'path' ? 'active' : ''}`} aria-label="Path">
        <Route size={26} strokeWidth={2.4} />
      </Link>
      <Link
        to="/vocabulary"
        className={`bottom-nav-item ${section === 'vocab' ? 'active' : ''}`}
        aria-label="Vocabulary"
      >
        <BookOpen size={26} strokeWidth={2.4} />
      </Link>
      <Link
        to="/account"
        className={`bottom-nav-item ${section === 'account' ? 'active' : ''}`}
        aria-label="Profile"
      >
        <User size={26} strokeWidth={2.4} />
      </Link>
    </nav>
  );
}
