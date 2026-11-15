import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';
import { getLessonsWithState } from '../data/lessons.js';
import { MODES } from '../data/modes.js';

export default function Lesson() {
  const { moduleId, block: blockParam } = useParams();
  const block = decodeURIComponent(blockParam ?? '');
  const module = getModule(moduleId);

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  const lesson = getLessonsWithState().find((l) => l.moduleId === moduleId && l.block === block);

  if (!lesson) {
    return (
      <>
        <TopBar title="Lesson not found" subtitle={module.title} />
        <div className="main">
          <div className="empty-state">We couldn't find that lesson.</div>
        </div>
      </>
    );
  }

  if (lesson.state === 'locked') {
    return (
      <>
        <TopBar title={block} subtitle={module.title} />
        <div className="main">
          <div className="empty-state">
            <Lock size={36} strokeWidth={2.2} style={{ marginBottom: 10 }} />
            <p>Complete the previous lesson to unlock this one.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
              Back to Path
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={block} subtitle={module.title} />
      <div className="main">
        <div className="page-intro">
          <p>
            {lesson.termCount} terms in this lesson.
            {lesson.state === 'completed' && ' You’ve completed this lesson — revisit any time.'}
          </p>
        </div>
        <div className="card-list">
          {MODES.map((mode) => (
            <Link
              key={mode.key}
              to={`/module/${moduleId}/lesson/${encodeURIComponent(block)}/${mode.key}`}
              className="card link-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="link-card-icon">
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
