import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';
import { MODES } from '../data/modes.js';

export default function ModuleHome() {
  const { moduleId } = useParams();
  const module = getModule(moduleId);

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main">
          <div className="empty-state">
            <p>We couldn't find that module.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={module.title} subtitle={`${module.terms.length} terms`} />
      <div className="main">
        <div className="page-intro">
          <p>{module.description}</p>
        </div>
        <div className="card-list">
          {MODES.map((mode) => (
            <Link key={mode.key} to={`/module/${module.id}/${mode.key}`} className="card link-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className={`link-card-icon mode-${mode.key}`}>
                  <mode.Icon size={24} strokeWidth={2.4} />
                </span>
                <div>
                  <h3>{mode.title}</h3>
                  <div className="meta">{mode.desc}</div>
                </div>
              </div>
              <ChevronRight className="chev" size={22} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
