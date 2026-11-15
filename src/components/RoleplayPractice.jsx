import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, Lightbulb, XCircle } from 'lucide-react';
import { buildBlank, hintFor } from '../utils/roleplay.js';
import { normalizeAnswer } from '../utils/quiz.js';
import { recordQuizResult } from '../utils/progress.js';

const ResultsCelebration = lazy(() => import('./ResultsCelebration.jsx'));

const TYPING_MS = 750;

function Bubble({ entry, line, blank, showEnglish }) {
  const isYou = line.speaker === 'Banker';

  let spanish = line.spanish;
  if (isYou && blank) {
    spanish = (
      <>
        {blank.before}
        <span className={`blank-fill ${entry.correct ? 'correct' : 'incorrect'}`}>{blank.answer}</span>
        {blank.after}
      </>
    );
  }

  return (
    <div className={`chat-row ${isYou ? 'you' : 'them'}`}>
      <div className="chat-bubble">
        <div className="chat-name">{isYou ? 'You · Banker' : 'Client'}</div>
        <div className="chat-es">{spanish}</div>
        {showEnglish && <div className="chat-en">{line.english}</div>}
      </div>
      {isYou && entry.correct === false && (
        <div className="chat-miss">
          {entry.typed ? (
            <>
              You wrote: <strong>{entry.typed}</strong>
            </>
          ) : (
            'Answer revealed'
          )}
        </div>
      )}
    </div>
  );
}

export default function RoleplayPractice({ roleplay, terms, moduleId, showEnglish, onRestart, onExit }) {
  const lines = roleplay.lines;
  const blanks = useMemo(
    () => lines.map((l) => (l.speaker === 'Banker' ? buildBlank(l, terms) : null)),
    [lines, terms]
  );
  const total = blanks.filter(Boolean).length;

  const [shown, setShown] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [typing, setTyping] = useState(false);
  const [answer, setAnswer] = useState('');
  const [hintOn, setHintOn] = useState(false);
  const [checked, setChecked] = useState(null);
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState(null);

  const rewarded = useRef(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const resultsRef = useRef(null);

  const done = cursor >= lines.length;
  const blank = !done ? blanks[cursor] : null;
  const line = !done ? lines[cursor] : null;

  // Client lines (and any banker line without a blank) play automatically.
  useEffect(() => {
    if (done || blanks[cursor]) return undefined;
    setTyping(true);
    const timer = setTimeout(() => {
      setShown((s) => [...s, { index: cursor }]);
      setTyping(false);
      setCursor((c) => c + 1);
    }, TYPING_MS);
    return () => clearTimeout(timer);
  }, [cursor, done, blanks]);

  // Award XP once, when the conversation ends.
  useEffect(() => {
    if (!done || rewarded.current) return;
    rewarded.current = true;
    if (total > 0) setReward(recordQuizResult({ moduleId, block: null, score, total }));
  }, [done, total, moduleId, score]);

  // Keep the newest message in view and the answer box focused on the learner's turn.
  useEffect(() => {
    if (done) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [shown.length, typing, checked, done]);

  // When the conversation ends, bring the results into view.
  useEffect(() => {
    if (reward) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [reward]);

  useEffect(() => {
    if (blank && !checked) inputRef.current?.focus({ preventScroll: true });
  }, [blank, checked]);

  function finishTurn(result) {
    if (result.correct) setScore((s) => s + 1);
    setChecked(result);
    setShown((s) => [...s, { index: cursor, ...result }]);
  }

  function check(e) {
    e.preventDefault();
    if (!blank || checked || !answer.trim()) return;
    const correct = normalizeAnswer(answer) === normalizeAnswer(blank.answer);
    finishTurn({ correct, typed: answer.trim() });
  }

  function reveal() {
    if (!blank || checked) return;
    finishTurn({ correct: false, typed: '' });
  }

  function next() {
    setChecked(null);
    setAnswer('');
    setHintOn(false);
    setCursor((c) => c + 1);
  }

  return (
    <div className="chat-wrap">
      <div className="chat-intro">
        You're the <strong>banker</strong>. Read what the client says, then fill in the blank to reply.
      </div>

      <div className="chat">
        {shown.map((entry, i) => (
          <Bubble
            key={i}
            entry={entry}
            line={lines[entry.index]}
            blank={blanks[entry.index]}
            showEnglish={showEnglish}
          />
        ))}
        {typing && (
          <div className="chat-row them">
            <div className="chat-bubble typing" aria-label="Client is typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={endRef} className="chat-end" />
      </div>

      {done && total > 0 && (
        <div ref={resultsRef} className="chat-results">
          <Suspense fallback={null}>
            {reward && (
              <ResultsCelebration
                kind="roleplay"
                score={score}
                total={total}
                reward={reward}
                scoped={false}
                primary={{ label: 'Back to scenarios', Icon: ArrowLeft, onClick: onExit }}
                onRetry={onRestart}
              />
            )}
          </Suspense>
        </div>
      )}

      {blank && (
        <form className="compose" onSubmit={check}>
          <div className="compose-label">Your reply — say it in Spanish</div>
          <div className="compose-english">“{line.english}”</div>
          <div className="compose-sentence">
            {blank.before}
            <span className={`compose-gap ${checked ? (checked.correct ? 'correct' : 'incorrect') : ''}`}>
              {checked ? blank.answer : ''}
            </span>
            {blank.after}
          </div>

          <div className="compose-row">
            <input
              ref={inputRef}
              className="quiz-fill-input compose-input"
              type="text"
              placeholder="Type the missing Spanish"
              value={answer}
              disabled={Boolean(checked)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              onChange={(e) => setAnswer(e.target.value)}
            />
            {!checked && (
              <button className="btn btn-primary" type="submit" disabled={!answer.trim()}>
                Check
              </button>
            )}
          </div>

          {!checked && (
            <div className="compose-tools">
              <button type="button" className="link-btn" onClick={() => setHintOn((v) => !v)}>
                <Lightbulb size={16} strokeWidth={2.4} /> Hint
              </button>
              <button type="button" className="link-btn" onClick={reveal}>
                <Eye size={16} strokeWidth={2.4} /> Show answer
              </button>
              <span className="compose-note">Accents optional</span>
            </div>
          )}
          {hintOn && !checked && <div className="compose-hint">{hintFor(blank.answer)}</div>}

          {checked && (
            <>
              <div className={`quiz-feedback ${checked.correct ? 'correct' : 'incorrect'}`}>
                <div className="quiz-feedback-head">
                  {checked.correct ? (
                    <CheckCircle2 size={24} strokeWidth={2.4} />
                  ) : (
                    <XCircle size={24} strokeWidth={2.4} />
                  )}
                  {checked.correct ? 'Correct!' : 'Not quite'}
                </div>
                {!checked.correct && (
                  <div className="answer-line">
                    Answer: <strong>{blank.answer}</strong>
                  </div>
                )}
              </div>
              <button type="button" className="btn btn-primary btn-block btn-lg compose-next" onClick={next}>
                Continue
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
