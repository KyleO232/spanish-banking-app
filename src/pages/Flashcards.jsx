import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';

export default function Flashcards() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const blocks = useMemo(() => (module ? getBlocks(module) : []), [module]);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

  const [activeBlock, setActiveBlock] = useState(lockedBlock ?? 'All');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const terms = useMemo(
    () => (module ? getTermsByBlock(module, activeBlock) : []),
    [module, activeBlock]
  );

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [activeBlock]);

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

  const term = terms[index];

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
      <div className="main">
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
            <div className="flashcard-hint">Tap the card to flip</div>
            <div className="flashcard-nav">
              <button className="btn" style={{ flex: 1 }} onClick={goPrev}>
                ← Prev
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={goNext}>
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">No terms in this block.</div>
        )}
      </div>
    </>
  );
}
