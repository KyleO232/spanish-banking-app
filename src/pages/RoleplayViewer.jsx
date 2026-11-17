import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import RoleplayPractice from '../components/RoleplayPractice.jsx';
import LockedStep from '../components/LockedStep.jsx';
import { getModule, rolesOf } from '../data/modules.js';
import { getLessonSteps } from '../data/lessons.js';

export default function RoleplayViewer() {
  const { moduleId, roleplayId, block: blockParam } = useParams();
  const lessonBlock = blockParam ? decodeURIComponent(blockParam) : null;
  const navigate = useNavigate();
  const module = getModule(moduleId);
  const [mode, setMode] = useState('practice'); // 'practice' | 'read'
  const [showEnglish, setShowEnglish] = useState(true);
  const [attempt, setAttempt] = useState(0);

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main mode-roleplay">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  const roles = rolesOf(module);
  const roleplay = (module.roleplays ?? []).find((rp) => rp.id === roleplayId);

  if (!roleplay) {
    return (
      <>
        <TopBar title="Roleplay not found" subtitle={module.title} />
        <div className="main mode-roleplay">
          <div className="empty-state">We couldn't find that scenario.</div>
        </div>
      </>
    );
  }

  if (lessonBlock && !getLessonSteps(moduleId, lessonBlock).unlocked.roleplay) {
    return (
      <LockedStep
        title={roleplay.title}
        subtitle={roleplay.block}
        message="Finish this lesson's quiz to unlock roleplay."
        actionTo={`/module/${moduleId}/lesson/${encodeURIComponent(lessonBlock)}`}
        actionLabel="Back to lesson"
      />
    );
  }

  return (
    <>
      <TopBar title={roleplay.title} subtitle={roleplay.block} />
      <div className="main mode-roleplay">
        <div className="roleplay-toolbar">
          <div className="segmented" role="tablist" aria-label="Roleplay mode">
            <button
              role="tab"
              aria-selected={mode === 'practice'}
              className={mode === 'practice' ? 'active' : ''}
              onClick={() => setMode('practice')}
            >
              Practice
            </button>
            <button
              role="tab"
              aria-selected={mode === 'read'}
              className={mode === 'read' ? 'active' : ''}
              onClick={() => setMode('read')}
            >
              Read
            </button>
          </div>
          <button className="chip" onClick={() => setShowEnglish((v) => !v)}>
            {showEnglish ? 'Hide English' : 'Show English'}
          </button>
        </div>

        {mode === 'practice' ? (
          <RoleplayPractice
            key={`${roleplay.id}-${attempt}`}
            roleplay={roleplay}
            terms={module.terms}
            moduleId={module.id}
            roles={roles}
            showEnglish={showEnglish}
            onRestart={() => setAttempt((a) => a + 1)}
            onExit={() => navigate(-1)}
          />
        ) : (
          <>
            <div className="roleplay-lines">
              {roleplay.lines.map((line, i) => (
                <div key={i} className={`roleplay-line ${line.speaker === roles.you ? 'Banker' : 'Client'}`}>
                  <div className="roleplay-speaker">{line.speaker}</div>
                  <div className="roleplay-es">{line.spanish}</div>
                  {showEnglish && <div className="roleplay-en">{line.english}</div>}
                </div>
              ))}
            </div>

            {module.registerNotes?.length > 0 && (
              <div className="card notes-card">
                <h3>Register notes</h3>
                <ul>
                  {module.registerNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
