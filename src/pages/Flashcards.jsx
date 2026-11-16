import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import Monedita from '../components/Monedita.jsx';
import LockedStep from '../components/LockedStep.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';
import { getLessonSteps } from '../data/lessons.js';
import { markFlashcardsDone } from '../utils/progress.js';

export default function Flashcards() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const blocks = useMemo(() => (module ? getBlocks(module) : []), [module]);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

  const [activeBlock, setActiveBlock] = useState(lockedBlock ?? 'All');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [visited, setVisited] = useState([]);

  const terms = useMemo(
    () => (module ? getTermsByBlock(module, activeBlock) : []),
    [module, activeBlock]
  );

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [activeBlock]);

  // In a lesson, remember which cards have been seen; seeing them all unlocks the quiz.
  useEffect(() => {
    if (!lockedBlock) return;
    setVisited((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, [index, lockedBlock]);

  const allViewed = Boolean(lockedBlock) && terms.length > 0 && visited.length >= terms.length;

  useEffect(() => {
    if (allViewed) markFlashcardsDone(moduleId, lockedBlock);
  }, [allViewed, moduleId, lockedBlock]);

  const steps = lockedBlock ? getLessonSteps(moduleId, lockedBlock) : null;

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main mode-flashcards">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  if (steps && !steps.unlocked.flashcards) {
    return (
      <LockedStep
        title="Flashcards"
        subtitle={`${module.title} · ${lockedBlock}`}
        message="Complete the previous lesson to unlock this one."
        actionTo="/"
        actionLabel="Back to Path"
      />
    );
  }

  const term = terms[index];
  const practiceUnlocked = Boolean(steps?.flashcardsDone) || allViewed;

  function goNext() {
    setFlipped(false);
    setIndex((i) => (i + 1) % terms.length);
  }

  function goPrev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + terms.length) % terms.length);
  }

  return (
    <>
      <TopBar
        title="Flashcards"
        subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title}
      />
      <div className="main mode-flashcards">
        {!lockedBlock && (
          <div className="chip-row">
            <button
              className={`chip ${activeBlock === 'All' ? 'active' : ''}`}
              onClick={() => setActiveBlock('All')}
            >
              All
            </button>
            {blocks.map((b) => (
              <button
                key={b}
                className={`chip ${activeBlock === b ? 'active' : ''}`}
                onClick={() => setActiveBlock(b)}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {term ? (
          <>
            <div className="flashcard-progress">
              {index + 1} / {terms.length}
            </div>
            <div className="flashcard-scene">
              <div
                className={`flashcard ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
              >
                <div className="flashcard-face front">
                  <span className="flashcard-label">{term.block}</span>
                  <div className="flashcard-term">{term.spanish}</div>
                  {term.note && <div className="flashcard-note">{term.note}</div>}
                </div>
                <div className="flashcard-face back">
                  <span className="flashcard-label">English</span>
                  <div className="flashcard-term">{term.english}</div>
                  {term.example && (
                    <div className="flashcard-example">
                      <div className="es">{term.example.es}</div>
                      <div className="en">{term.example.en}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flashcard-hint">
              {lockedBlock && !practiceUnlocked
                ? `Tap the card to flip · viewed ${visited.length} of ${terms.length}`
                : 'Tap the card to flip'}
            </div>
            <div className="flashcard-nav">
              <button className="btn" style={{ flex: 1 }} onClick={goPrev}>
                <ChevronLeft size={20} strokeWidth={2.6} /> Prev
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={goNext}>
                Next <ChevronRight size={20} strokeWidth={2.6} />
              </button>
            </div>
            {lockedBlock && practiceUnlocked && (
              <div className="card unlock-card">
                <Monedita mood="cheer" size={56} />
                <div>
                  <h3>¡Práctica desbloqueada!</h3>
                  <div className="meta">You've gone through every card.</div>
                </div>
                <Link
                  className="btn btn-primary"
                  to={`/module/${moduleId}/lesson/${encodeURIComponent(lockedBlock)}/practice`}
                >
                  Start practice
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">No terms in this block.</div>
        )}
      </div>
    </>
  );
}
