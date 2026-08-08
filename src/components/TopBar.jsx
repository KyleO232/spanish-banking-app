import { useNavigate } from 'react-router-dom';

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
          ←
        </button>
      )}
      <div className="topbar-titles">
        <h1>{title}</h1>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
