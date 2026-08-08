import { Link, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';

const MODES = [
  {
    key: 'flashcards',
    icon: '🗂️',
    title: 'Flashcards',
    desc: 'Flip through terms with example sentences.',
  },
  {
    key: 'quiz',
    icon: '📝',
    title: 'Quiz',
    desc: 'Multiple choice and fill-in-the-blank, scored.',
  },
  {
    key: 'roleplay',
    icon: '💬',
    title: 'Roleplay',
    desc: 'Read scripted client/banker dialogues.',
  },
];

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="link-card-icon">{mode.icon}</span>
                <div>
                  <h3>{mode.title}</h3>
                  <div className="meta">{mode.desc}</div>
                </div>
              </div>
              <span className="chev">›</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
