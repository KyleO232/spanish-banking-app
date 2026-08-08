import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';
import { generateQuizQuestions, normalizeAnswer } from '../utils/quiz.js';
import { markCompleted } from '../utils/progress.js';

export default function Quiz() {
  const { moduleId, block: blockParam } = useParams();
  const module = getModule(moduleId);
  const blocks = useMemo(() => (module ? getBlocks(module) : []), [module]);
  const lockedBlock = blockParam ? decodeURIComponent(blockParam) : null;

  const [activeBlock, setActiveBlock] = useState(lockedBlock ?? 'All');
  const [phase, setPhase] = useState(lockedBlock ? 'active' : 'setup');
  const [questions, setQuestions] = useState(() =>
    lockedBlock && module ? generateQuizQuestions(getTermsByBlock(module, lockedBlock)) : []
  );
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [fillValue, setFillValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (phase === 'done' && lockedBlock) {
      markCompleted(moduleId, lockedBlock);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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

  function startQuiz() {
    const terms = getTermsByBlock(module, activeBlock);
    setQuestions(generateQuizQuestions(terms));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFillValue('');
    setSubmitted(false);
    setPhase('active');
  }

  const q = questions[current];

  function submitMultipleChoice(option) {
    if (submitted) return;
    setSelected(option);
    setSubmitted(true);
    if (option === q.answer) setScore((s) => s + 1);
  }

  function submitFillBlank(e) {
    e.preventDefault();
    if (submitted) return;
    setSubmitted(true);
    if (normalizeAnswer(fillValue) === normalizeAnswer(q.answer)) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      setPhase('done');
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setFillValue('');
    setSubmitted(false);
  }

  if (phase === 'setup') {
    return (
      <>
        <TopBar title="Quiz" subtitle={module.title} />
        <div className="main">
          <div className="page-intro">
            <h2>Choose a topic</h2>
            <p>Pick a block to focus on, or quiz across the whole module.</p>
          </div>
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
          <button className="btn btn-primary btn-block" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <>
        <TopBar title="Quiz Results" subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title} />
        <div className="main">
          <div className="card quiz-summary">
            <p>You scored</p>
            <div className="score-big">
              {score} / {questions.length}
            </div>
            <p>{pct}% correct</p>
            {lockedBlock && <p style={{ marginTop: 10, color: 'var(--success)' }}>Lesson complete!</p>}
          </div>
          <div className="btn-row">
            {lockedBlock ? (
              <Link className="btn" style={{ flex: 1 }} to="/">
                Back to Path
              </Link>
            ) : (
              <button className="btn" style={{ flex: 1 }} onClick={() => setPhase('setup')}>
                Change Topic
              </button>
            )}
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={startQuiz}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Quiz" subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title} />
      <div className="main">
        <div className="quiz-score">
          <span>
            Question {current + 1} / {questions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>

        <div className="card quiz-question-card">
          {q.type === 'multiple-choice' ? (
            <div className="quiz-direction">
              {q.direction === 'es-en' ? 'Translate to English' : 'Translate to Spanish'}
            </div>
          ) : (
            <div className="quiz-direction">Fill in the blank</div>
          )}
          <div className="quiz-prompt">{q.prompt}</div>
        </div>

        {q.type === 'multiple-choice' ? (
          <div className="quiz-options">
            {q.options.map((opt) => {
              let cls = 'quiz-option';
              if (submitted && opt === q.answer) cls += ' correct';
              else if (submitted && opt === selected) cls += ' incorrect';
              return (
                <button
                  key={opt}
                  className={cls}
                  disabled={submitted}
                  onClick={() => submitMultipleChoice(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={submitFillBlank}>
            <input
              className={`quiz-fill-input ${
                submitted ? (normalizeAnswer(fillValue) === normalizeAnswer(q.answer) ? 'correct' : 'incorrect') : ''
              }`}
              type="text"
              placeholder="Type the missing Spanish word or phrase"
              value={fillValue}
              disabled={submitted}
              autoCapitalize="none"
              autoCorrect="off"
              onChange={(e) => setFillValue(e.target.value)}
            />
            {!submitted && (
              <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} type="submit">
                Check
              </button>
            )}
          </form>
        )}

        {submitted && (
          <div
            className={`quiz-feedback ${
              (q.type === 'multiple-choice' ? selected === q.answer : normalizeAnswer(fillValue) === normalizeAnswer(q.answer))
                ? 'correct'
                : 'incorrect'
            }`}
          >
            {(q.type === 'multiple-choice' ? selected === q.answer : normalizeAnswer(fillValue) === normalizeAnswer(q.answer))
              ? 'Correct!'
              : 'Not quite.'}
            <div className="answer-line">
              Answer: <strong>{q.answer}</strong>
              {q.type === 'fill-blank' && ` — ${q.promptEnglish}`}
            </div>
          </div>
        )}

        {submitted && (
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={nextQuestion}>
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </>
  );
}
