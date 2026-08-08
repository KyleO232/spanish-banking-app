import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';

export default function RoleplayViewer() {
  const { moduleId, roleplayId } = useParams();
  const module = getModule(moduleId);
  const [showEnglish, setShowEnglish] = useState(true);

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

  const roleplay = (module.roleplays ?? []).find((rp) => rp.id === roleplayId);

  if (!roleplay) {
    return (
      <>
        <TopBar title="Roleplay not found" subtitle={module.title} />
        <div className="main">
          <div className="empty-state">We couldn't find that scenario.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={roleplay.title} subtitle={roleplay.block} />
      <div className="main">
        <div className="roleplay-toggle">
          <button className="chip" onClick={() => setShowEnglish((v) => !v)}>
            {showEnglish ? 'Hide English' : 'Show English'}
          </button>
        </div>
        <div className="roleplay-lines">
          {roleplay.lines.map((line, i) => (
            <div key={i} className={`roleplay-line ${line.speaker}`}>
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
      </div>
    </>
  );
}
