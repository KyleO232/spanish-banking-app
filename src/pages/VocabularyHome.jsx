import { Link } from 'react-router-dom';
import { getModules } from '../data/modules.js';

export default function VocabularyHome() {
  const modules = getModules();

  return (
    <>
      <div className="topbar">
        <div className="topbar-titles">
          <h1>Vocabulary</h1>
          <div className="subtitle">Browse full term lists by topic</div>
        </div>
      </div>
      <div className="main">
        <div className="card-list">
          {modules.map((m) => (
            <Link key={m.id} to={`/vocabulary/${m.id}`} className="card link-card">
              <div>
                <h3>{m.title}</h3>
                <div className="meta">{m.terms.length} terms</div>
              </div>
              <span className="chev">›</span>
            </Link>
          ))}
        </div>
        {modules.length === 0 && <div className="empty-state">No modules found yet.</div>}
      </div>
    </>
  );
}
