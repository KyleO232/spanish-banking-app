import { lazy, Suspense, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Flame, XCircle } from 'lucide-react';
import TopBar from '../components/TopBar.jsx';
import Monedita from '../components/Monedita.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';
import LockedStep from '../components/LockedStep.jsx';
import { getLessonsWithState, getLessonSteps } from '../data/lessons.js';
import { generateQuizQuestions, normalizeAnswer } from '../utils/quiz.js';
import { recordQuizResult } from '../utils/progress.js';

// Spanish cheers (with English glosses) so the encouragement teaches a little too.
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

const ResultsCelebration = lazy(() => import('../components/ResultsCelebration.jsx'));

function isModuleFinished(moduleId) {
  return getLessonsWithState()
    .filter((l) => l.moduleId === moduleId)
    .every((l) => l.state === 'completed');
}

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
  const [reward, setReward] = useState(null);
  const [run, setRun] = useState(0); // correct answers in a row

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main mode-quiz">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  if (lockedBlock) {
    const steps = getLessonSteps(moduleId, lockedBlock);
    if (!steps.unlocked.quiz) {
      const lessonLocked = steps.state === 'locked';
      return (
        <LockedStep
          title="Quiz"
          subtitle={`${module.title} · ${lockedBlock}`}
          message={
            lessonLocked
              ? 'Complete the previous lesson to unlock this one.'
              : 'Go through every flashcard in this lesson to unlock the quiz.'
          }
          actionTo={
            lessonLocked
              ? '/'
              : `/module/${moduleId}/lesson/${encodeURIComponent(lockedBlock)}/flashcards`
          }
          actionLabel={lessonLocked ? 'Back to Path' : 'Go to flashcards'}
        />
      );
    }
  }

  function startQuiz() {
    const terms = getTermsByBlock(module, activeBlock);
    setQuestions(generateQuizQuestions(terms));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFillValue('');
    setSubmitted(false);
    setReward(null);
    setRun(0);
    setPhase('active');
  }

  const q = questions[current];

  function submitMultipleChoice(option) {
    if (submitted) return;
    setSelected(option);
    setSubmitted(true);
    if (option === q.answer) {
      setScore((s) => s + 1);
      setRun((r) => r + 1);
    } else {
      setRun(0);
    }
  }

  function submitFillBlank(e) {
    e.preventDefault();
    if (submitted) return;
    setSubmitted(true);
    if (normalizeAnswer(fillValue) === normalizeAnswer(q.answer)) {
      setScore((s) => s + 1);
      setRun((r) => r + 1);
    } else {
      setRun(0);
    }
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      const wasModuleFinished = lockedBlock ? isModuleFinished(moduleId) : false;
      const result = recordQuizResult({
        moduleId,
        block: lockedBlock,
        score,
        total: questions.length,
      });
      setReward({
        ...result,
        moduleJustFinished: lockedBlock ? !wasModuleFinished && isModuleFinished(moduleId) : false,
      });
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
        <div className="main mode-quiz">
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
    return (
      <>
        <TopBar title="Quiz Results" subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title} />
        <div className="main mode-quiz">
          <Suspense fallback={null}>
            <ResultsCelebration
              score={score}
              total={questions.length}
              reward={reward}
              scoped={Boolean(lockedBlock)}
              onRetry={startQuiz}
              onChangeTopic={() => setPhase('setup')}
            />
          </Suspense>
        </div>
      </>
    );
  }

  const answeredCorrectly =
    submitted &&
    (q.type === 'multiple-choice'
      ? selected === q.answer
      : normalizeAnswer(fillValue) === normalizeAnswer(q.answer));
  const reaction = (answeredCorrectly ? CHEERS : OOPS)[current % 4];

  return (
    <>
      <TopBar title="Quiz" subtitle={lockedBlock ? `${module.title} · ${lockedBlock}` : module.title} />
      <div className="main mode-quiz">
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

        <div className="card quiz-question-card" key={`q-${current}`}>
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
          <div className={`quiz-feedback with-mascot ${answeredCorrectly ? 'correct' : 'incorrect'}`}>
            {answeredCorrectly && run >= 3 && (
              <div className="combo" key={run}>
                <Flame size={16} strokeWidth={2.6} fill="currentColor" /> ¡{run} seguidas!
                <small>{run} in a row</small>
              </div>
            )}
            <Monedita mood={answeredCorrectly ? 'cheer' : 'oops'} size={58} />
            <div className="feedback-text">
              <div className="quiz-feedback-head">
                {answeredCorrectly ? (
                  <CheckCircle2 size={22} strokeWidth={2.4} />
                ) : (
                  <XCircle size={22} strokeWidth={2.4} />
                )}
                {reaction[0]}
                <small>{reaction[1]}</small>
              </div>
              <div className="answer-line">
                Answer: <strong>{q.answer}</strong>
                {q.type === 'fill-blank' && ` — ${q.promptEnglish}`}
              </div>
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
