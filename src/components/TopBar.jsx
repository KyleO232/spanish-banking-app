import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function TopBar({ title, subtitle, showBack = true }) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      {showBack && (
        <button
          className="topbar-back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      )}
      <div className="topbar-titles">
        <h1>{title}</h1>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
