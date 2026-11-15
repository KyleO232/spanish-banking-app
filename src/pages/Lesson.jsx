import { Link, useParams } from 'react-router-dom';
import { Check, ChevronRight, Lock } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import { getModule } from '../data/modules.js';
import { getLessonSteps } from '../data/lessons.js';
import { MODES } from '../data/modes.js';

const LOCKED_HINT = {
  quiz: 'Go through every flashcard to unlock',
  roleplay: 'Finish the quiz to unlock',
};

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

  const steps = getLessonSteps(moduleId, block);
  const { lesson } = steps;

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

  if (!steps.unlocked.flashcards) {
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

  const done = { flashcards: steps.flashcardsDone, quiz: steps.quizDone };

  return (
    <>
      <TopBar title={block} subtitle={module.title} />
      <div className="main">
        <div className="page-intro">
          <p>
            {lesson.termCount} terms in this lesson. Work through the steps in order.
            {lesson.state === 'completed' && ' You’ve completed this lesson — revisit any time.'}
          </p>
        </div>
        <div className="card-list">
          {MODES.map((mode, i) => {
            const unlocked = steps.unlocked[mode.key];
            const body = (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className={`link-card-icon mode-${mode.key}`}>
                    <mode.Icon size={24} strokeWidth={2.4} />
                  </span>
                  <div>
                    <h3>
                      <span className="step-number">{i + 1}</span> {mode.title}
                    </h3>
                    <div className="meta">{unlocked ? mode.desc : LOCKED_HINT[mode.key]}</div>
                  </div>
                </div>
                {!unlocked ? (
                  <Lock className="chev" size={20} strokeWidth={2.4} />
                ) : done[mode.key] ? (
                  <Check className="step-check" size={24} strokeWidth={3.2} />
                ) : (
                  <ChevronRight className="chev" size={22} />
                )}
              </>
            );

            return unlocked ? (
              <Link
                key={mode.key}
                to={`/module/${moduleId}/lesson/${encodeURIComponent(block)}/${mode.key}`}
                className="card link-card"
              >
                {body}
              </Link>
            ) : (
              <div key={mode.key} className="card link-card step-locked" aria-disabled="true">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
