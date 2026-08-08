import { Link, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';

export default function RoleplayList() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

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

  const roleplays = (module.roleplays ?? []).filter((rp) => !lockedBlock || rp.block === lockedBlock);

  return (
    <>
      <TopBar
        title="Roleplay"
        subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title}
      />
      <div className="main">
        <div className="page-intro">
          <p>Scripted client/banker dialogues for reading practice.</p>
        </div>
        <div className="card-list">
          {roleplays.map((rp) => (
            <Link key={rp.id} to={`/module/${module.id}/roleplay/${rp.id}`} className="card link-card">
              <div>
                <h3>{rp.title}</h3>
                <div className="meta">
                  {rp.block} · {rp.lines.length} lines
                </div>
              </div>
              <span className="chev">›</span>
            </Link>
          ))}
        </div>
        {roleplays.length === 0 && (
          <div className="empty-state">No roleplay scenarios in this block yet.</div>
        )}
      </div>
    </>
  );
}
