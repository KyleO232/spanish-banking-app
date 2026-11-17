import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import LockedStep from '../components/LockedStep.jsx';
import { getModule } from '../data/modules.js';
import { getLessonSteps } from '../data/lessons.js';

export default function RoleplayList() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

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

  if (lockedBlock) {
    const steps = getLessonSteps(moduleId, lockedBlock);
    if (!steps.unlocked.roleplay) {
      const lessonLocked = steps.state === 'locked';
      return (
        <LockedStep
          title="Roleplay"
          subtitle={`${module.title} · ${lockedBlock}`}
          message={
            lessonLocked
              ? 'Complete the previous lesson to unlock this one.'
              : 'Finish the quiz in this lesson to unlock roleplay.'
          }
          actionTo={
            lessonLocked
              ? '/'
              : `/module/${moduleId}/lesson/${encodeURIComponent(lockedBlock)}/${
                  steps.unlocked.quiz ? 'quiz' : 'flashcards'
                }`
          }
          actionLabel={lessonLocked ? 'Back to Path' : steps.unlocked.quiz ? 'Go to quiz' : 'Go to flashcards'}
        />
      );
    }
  }

  const roleplays = (module.roleplays ?? []).filter((rp) => !lockedBlock || rp.block === lockedBlock);

  return (
    <>
      <TopBar
        title="Roleplay"
        subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title}
      />
      <div className="main mode-roleplay">
        <div className="page-intro">
          <p>Scripted conversations for reading practice.</p>
        </div>
        <div className="card-list">
          {roleplays.map((rp) => (
            <Link
              key={rp.id}
              to={
                lockedBlock
                  ? `/module/${module.id}/lesson/${encodeURIComponent(lockedBlock)}/roleplay/${rp.id}`
                  : `/module/${module.id}/roleplay/${rp.id}`
              }
              className="card link-card"
            >
              <div>
                <h3>{rp.title}</h3>
                <div className="meta">
                  {rp.block} · {rp.lines.length} lines
                </div>
              </div>
              <ChevronRight className="chev" size={22} />
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
