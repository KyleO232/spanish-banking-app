import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import Monedita from '../components/Monedita.jsx';
import AccentBar from '../components/AccentBar.jsx';
import LockedStep from '../components/LockedStep.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';
import { getLessonSteps } from '../data/lessons.js';
import { shuffle } from '../utils/quiz.js';
import { buildPractice, isCorrectTyped, makeRetry, shortSpanish } from '../utils/practice.js';
import { markPracticeDone } from '../utils/progress.js';

// Spanish cheers (with English glosses), same spirit as the quiz.
const CHEERS = [
  ['¡Muy bien!', 'Very good!'],
  ['¡Excelente!', 'Excellent!'],
  ['¡Perfecto!', 'Perfect!'],
  ['¡Así se hace!', "That's how it's done!"],
];
const OOPS = [
  ['¡Casi!', 'Almost!'],
  ['¡Ánimo!', 'Keep going!'],
  ['¡Otra vez!', 'Once more!'],
  ['¡No pasa nada!', 'No worries!'],
];

const HEADINGS = {
  'es-en': 'What does this mean?',
  'en-es': 'How do you say this in Spanish?',
  sentence: 'Pick the word that fits',
  type: 'Write this in Spanish',
  match: 'Tap the matching pairs',
};

// ---------- the shared bottom panel: feedback + Continue ----------

function Feedback({ result, ex, index, onContinue }) {
  const buttonRef = useRef(null);
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const [word, gloss] = (result.correct ? CHEERS : OOPS)[index % 4];
  return (
    <>
      <div className={`quiz-feedback with-mascot ${result.correct ? 'correct' : 'incorrect'}`}>
        <Monedita mood={result.correct ? 'cheer' : 'oops'} size={58} />
        <div className="feedback-text">
          <div className="quiz-feedback-head">
            {result.correct ? <CheckCircle2 size={22} strokeWidth={2.4} /> : <XCircle size={22} strokeWidth={2.4} />}
            {word}
            <small>{gloss}</small>
          </div>
          {ex.kind === 'match' ? (
            <div className="answer-line">
              {result.missed.length > 0 ? 'A few will come back for another try.' : 'No mistakes.'}
            </div>
          ) : (
            (!result.correct || ex.kind === 'sentence') && (
              <div className="answer-line">
                {result.correct ? '' : 'Answer: '}
                <strong>{ex.kind === 'sentence' ? ex.full : ex.answer}</strong>
                {ex.kind === 'sentence' && <div className="answer-sub">{ex.promptEnglish}</div>}
              </div>
            )
          )}
        </div>
      </div>
      <button ref={buttonRef} className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => onContinue(result)}>
        Continue
      </button>
    </>
  );
}

// ---------- tap-to-match pairs ----------

function MatchExercise({ ex, onComplete, finished }) {
  const { terms } = ex;
  const rightOrder = useMemo(() => shuffle(terms.map((_, i) => i)), [terms]);
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [missed, setMissed] = useState([]);

  function evaluate(left, right) {
    if (left === right) {
      const next = [...matched, left];
      setMatched(next);
      setSelLeft(null);
      setSelRight(null);
      if (next.length === terms.length) onComplete(missed.map((i) => terms[i]));
      return;
    }
    setWrong({ left, right });
    setMissed((m) => [...new Set([...m, left, right])]);
    setTimeout(() => {
      setWrong(null);
      setSelLeft(null);
      setSelRight(null);
    }, 520);
  }

  function pickLeft(i) {
    if (finished || wrong || matched.includes(i)) return;
    setSelLeft(i);
    if (selRight !== null) evaluate(i, selRight);
  }

  function pickRight(i) {
    if (finished || wrong || matched.includes(i)) return;
    setSelRight(i);
    if (selLeft !== null) evaluate(selLeft, i);
  }

  const cls = (side, i) => {
    let c = 'match-tile';
    if (matched.includes(i)) return `${c} done`;
    if (wrong && (side === 'l' ? wrong.left === i : wrong.right === i)) return `${c} wrong`;
    if (side === 'l' ? selLeft === i : selRight === i) return `${c} selected`;
    return c;
  };

  return (
    <div className="match-grid">
      <div className="match-col">
        {terms.map((t, i) => (
          <button key={`l${i}`} type="button" className={cls('l', i)} onClick={() => pickLeft(i)} disabled={matched.includes(i)}>
            {shortSpanish(t)}
          </button>
        ))}
      </div>
      <div className="match-col">
        {rightOrder.map((i) => (
          <button key={`r${i}`} type="button" className={cls('r', i)} onClick={() => pickRight(i)} disabled={matched.includes(i)}>
            {terms[i].english}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- one exercise (the parent re-keys this for each new one) ----------

function Exercise({ ex, index, onContinue }) {
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null); // null until checked
  const inputRef = useRef(null);

  useEffect(() => {
    if (ex.kind === 'type') inputRef.current?.focus({ preventScroll: true });
  }, [ex.kind]);

  function check(e) {
    e?.preventDefault();
    if (result) return;
    if (ex.kind === 'type') {
      if (!typed.trim()) return;
      setResult({ correct: isCorrectTyped(ex.term, typed), missed: [] });
    } else if (selected !== null) {
      setResult({ correct: selected === ex.answer, missed: [] });
    }
  }

  const canCheck = ex.kind === 'type' ? typed.trim() !== '' : selected !== null;

  return (
    <>
      <div className="practice-heading">{HEADINGS[ex.kind]}</div>

      {ex.kind !== 'match' && (
        <div className="card quiz-question-card practice-prompt-card">
          <div className="quiz-prompt">{ex.prompt}</div>
          {ex.kind === 'sentence' && <div className="practice-sub">{ex.promptEnglish}</div>}
          {(ex.kind === 'es-en' || ex.kind === 'type') && ex.note && <div className="practice-sub">{ex.note}</div>}
        </div>
      )}

      {ex.kind === 'match' && (
        <MatchExercise
          ex={ex}
          finished={Boolean(result)}
          onComplete={(missed) => setResult({ correct: true, missed })}
        />
      )}

      {(ex.kind === 'es-en' || ex.kind === 'en-es' || ex.kind === 'sentence') && (
        <div className="quiz-options">
          {ex.options.map((opt) => {
            let cls = 'quiz-option';
            if (result && opt === ex.answer) cls += ' correct';
            else if (result && opt === selected) cls += ' incorrect';
            else if (!result && opt === selected) cls += ' selected';
            return (
              <button key={opt} type="button" className={cls} disabled={Boolean(result)} onClick={() => setSelected(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {ex.kind === 'type' && (
        <form onSubmit={check}>
          <input
            ref={inputRef}
            className={`quiz-fill-input ${result ? (result.correct ? 'correct' : 'incorrect') : ''}`}
            type="text"
            placeholder="Type it in Spanish"
            value={typed}
            disabled={Boolean(result)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => setTyped(e.target.value)}
          />
          {!result && <AccentBar inputRef={inputRef} value={typed} onChange={setTyped} />}
          {!result && <div className="practice-note">Accents are optional.</div>}
        </form>
      )}

      {!result && ex.kind !== 'match' && (
        <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} disabled={!canCheck} onClick={check}>
          Check
        </button>
      )}

      {result && <Feedback result={result} ex={ex} index={index} onContinue={onContinue} />}
    </>
  );
}

// ---------- the page ----------

export default function Practice() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const blocks = useMemo(() => (module ? getBlocks(module) : []), [module]);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

  const [activeBlock, setActiveBlock] = useState(lockedBlock ?? 'All');
  const [phase, setPhase] = useState(lockedBlock ? 'active' : 'setup');
  const [terms, setTerms] = useState(() => (lockedBlock && module ? getTermsByBlock(module, lockedBlock) : []));
  const [queue, setQueue] = useState(() => (lockedBlock && module ? buildPractice(getTermsByBlock(module, lockedBlock)) : []));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0); // exercises answered right so far
  const [mistakes, setMistakes] = useState(0);
  const [startTotal, setStartTotal] = useState(() => queue.length);

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main mode-practice">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  if (lockedBlock) {
    const steps = getLessonSteps(moduleId, lockedBlock);
    if (!steps.unlocked.practice) {
      const lessonLocked = steps.state === 'locked';
      return (
        <LockedStep
          title="Practice"
          subtitle={`${module.title} · ${lockedBlock}`}
          message={
            lessonLocked
              ? 'Complete the previous lesson to unlock this one.'
              : 'Go through every flashcard in this lesson to unlock practice.'
          }
          actionTo={lessonLocked ? '/' : `/module/${moduleId}/lesson/${encodeURIComponent(lockedBlock)}/flashcards`}
          actionLabel={lessonLocked ? 'Back to Path' : 'Go to flashcards'}
        />
      );
    }
  }

  function start() {
    const chosen = getTermsByBlock(module, activeBlock);
    const built = buildPractice(chosen);
    setTerms(chosen);
    setQueue(built);
    setStartTotal(built.length);
    setIdx(0);
    setCorrect(0);
    setMistakes(0);
    setPhase('active');
  }

  function handleContinue(result) {
    const ex = queue[idx];
    const extra = [];
    if (ex.kind === 'match') {
      result.missed.forEach((t) => extra.push(makeRetry('match', t, terms)));
      setMistakes((m) => m + result.missed.length);
    } else if (!result.correct) {
      extra.push(makeRetry(ex.kind, ex.term, terms));
      setMistakes((m) => m + 1);
    }
    if (result.correct) setCorrect((c) => c + 1);

    const nextQueue = [...queue, ...extra];
    setQueue(nextQueue);
    if (idx + 1 >= nextQueue.length) {
      if (lockedBlock) markPracticeDone(moduleId, lockedBlock);
      setPhase('done');
    } else {
      setIdx(idx + 1);
    }
  }

  const subtitle = lockedBlock ? `${module.title} · ${lockedBlock}` : module.title;

  if (phase === 'setup') {
    return (
      <>
        <TopBar title="Practice" subtitle={module.title} />
        <div className="main mode-practice">
          <div className="page-intro">
            <h2>Choose a topic</h2>
            <p>Pick a block to practice, or mix the whole module.</p>
          </div>
          <div className="chip-row">
            <button className={`chip ${activeBlock === 'All' ? 'active' : ''}`} onClick={() => setActiveBlock('All')}>
              All
            </button>
            {blocks.map((b) => (
              <button key={b} className={`chip ${activeBlock === b ? 'active' : ''}`} onClick={() => setActiveBlock(b)}>
                {b}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" onClick={start}>
            Start practice
          </button>
        </div>
      </>
    );
  }

  if (phase === 'done') {
    const clean = mistakes === 0;
    return (
      <>
        <TopBar title="Practice" subtitle={subtitle} />
        <div className="main mode-practice">
          <div className="card practice-done">
            <Monedita mood="cheer" size={110} />
            <h2>¡Práctica completa!</h2>
            <p className="meta">
              {clean
                ? `Not a single mistake across ${startTotal} exercises.`
                : `${startTotal} exercises done. ${mistakes} ${mistakes === 1 ? 'word' : 'words'} came back for a second try.`}
            </p>
            {lockedBlock ? (
              <>
                <div className="practice-done-note">The quiz is unlocked.</div>
                <Link className="btn btn-primary btn-block" to={`/module/${moduleId}/lesson/${encodeURIComponent(lockedBlock)}/quiz`}>
                  Start quiz
                </Link>
                <button className="btn btn-block" onClick={start}>
                  Practice again
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-block" onClick={start}>
                  Practice again
                </button>
                <button className="btn btn-block" onClick={() => setPhase('setup')}>
                  Change topic
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  const ex = queue[idx];
  const remaining = queue.length - idx;
  const progress = correct + remaining > 0 ? correct / (correct + remaining) : 0;

  return (
    <>
      <TopBar title="Practice" subtitle={subtitle} />
      <div className="main mode-practice">
        <div className="quiz-progress-bar" aria-label={`${Math.round(progress * 100)} percent done`}>
          <div className="quiz-progress-fill" style={{ width: `${Math.max(progress * 100, 3)}%` }} />
        </div>
        <Exercise key={ex.id} ex={ex} index={idx} onContinue={handleContinue} />
      </div>
    </>
  );
}
