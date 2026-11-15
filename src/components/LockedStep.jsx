import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import TopBar from './TopBar.jsx';

export default function LockedStep({ title, subtitle, message, actionTo, actionLabel }) {
  return (
    <>
      <TopBar title={title} subtitle={subtitle} />
      <div className="main">
        <div className="empty-state">
          <Lock size={36} strokeWidth={2.2} style={{ marginBottom: 10 }} />
          <p>{message}</p>
          {actionTo && (
            <Link to={actionTo} className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
