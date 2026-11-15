import { Link } from 'react-router-dom';
import { Flame, Target, Trophy, Zap, Star, RotateCcw, Route as RouteIcon, Shuffle } from 'lucide-react';
import Confetti from './Confetti.jsx';
import Doodle from './Doodle.jsx';

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function doodleFor(pct, reward) {
  if (reward?.moduleJustFinished || pct >= 90) return 'jumping';
  if (pct >= 50) return 'running';
  return 'reading';
}

function headline(pct, reward) {
  if (reward?.moduleJustFinished) return 'Module complete!';
  if (pct === 100) return 'Perfect score!';
  if (pct >= 90) return 'Excellent work!';
  if (pct >= 70) return 'Great job!';
  if (pct >= 50) return 'Nice effort';
  return 'Keep practicing';
}

function subline(scoped, reward, kind) {
  if (reward?.preview) return 'Admin preview — your saved progress was not changed.';
  if (reward?.moduleJustFinished) return 'Every lesson in this module is now gold.';
  if (kind === 'roleplay') return 'Conversation complete.';
  if (!scoped) return 'Quiz finished.';
  return reward?.firstCompletion ? 'Lesson complete — the next one is unlocked.' : 'Lesson practiced again.';
}

export default function ResultsCelebration({
  kind = 'quiz',
  score,
  total,
  reward,
  scoped,
  primary,
  onRetry,
  onChangeTopic,
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const celebrate = pct >= 70 || reward?.firstCompletion || reward?.moduleJustFinished;
  const gold = reward?.moduleJustFinished;
  const offset = CIRCUMFERENCE * (1 - pct / 100);

  return (
    <div className="results">
      {celebrate && <Confetti count={gold ? 80 : 48} />}

      <Doodle name={doodleFor(pct, reward)} className={gold ? 'gold' : ''} />

      <div className={`results-ring ${gold ? 'gold' : ''}`}>
        <svg viewBox="0 0 140 140" width="120" height="120" aria-hidden="true">
          <circle className="results-ring-track" cx="70" cy="70" r={RADIUS} />
          <circle
            className="results-ring-fill"
            cx="70"
            cy="70"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            style={{ '--ring-offset': offset }}
          />
        </svg>
        <div className="results-ring-center">
          {gold ? <Trophy size={24} strokeWidth={2.4} /> : <Star size={24} strokeWidth={2.4} fill="currentColor" />}
          <div className="results-score">
            {score}/{total}
          </div>
        </div>
      </div>

      <h2 className="results-title">{headline(pct, reward)}</h2>
      <p className="results-sub">{subline(scoped, reward, kind)}</p>

      <div className="results-stats">
        <div className="results-stat xp">
          <Zap size={22} strokeWidth={2.6} fill="currentColor" />
          <div className="results-stat-value">+{reward?.xpEarned ?? 0}</div>
          <div className="results-stat-label">XP earned</div>
        </div>
        <div className="results-stat streak">
          <Flame size={22} strokeWidth={2.6} fill="currentColor" />
          <div className="results-stat-value">{reward?.streak ?? 0}</div>
          <div className="results-stat-label">Day streak</div>
        </div>
        <div className="results-stat accuracy">
          <Target size={22} strokeWidth={2.6} />
          <div className="results-stat-value">{pct}%</div>
          <div className="results-stat-label">Accuracy</div>
        </div>
      </div>

      <div className="results-actions">
        {primary ? (
          <button className="btn btn-primary btn-block btn-lg" onClick={primary.onClick}>
            {primary.Icon && <primary.Icon size={20} strokeWidth={2.6} />} {primary.label}
          </button>
        ) : scoped ? (
          <Link className="btn btn-primary btn-block btn-lg" to="/">
            <RouteIcon size={20} strokeWidth={2.6} /> Continue
          </Link>
        ) : (
          <button className="btn btn-primary btn-block btn-lg" onClick={onChangeTopic}>
            <Shuffle size={20} strokeWidth={2.6} /> Change topic
          </button>
        )}
        <button className="btn btn-block btn-lg" onClick={onRetry}>
          <RotateCcw size={20} strokeWidth={2.6} /> Try again
        </button>
      </div>
    </div>
  );
}
