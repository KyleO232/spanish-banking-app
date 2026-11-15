import { useState } from 'react';
import { Flame, Zap } from 'lucide-react';
import { getLessonsWithState } from '../data/lessons.js';
import { getStats, resetProgress } from '../utils/progress.js';
import LessonPath from '../components/LessonPath.jsx';

export default function Home() {
  const [lessons, setLessons] = useState(() => getLessonsWithState());
  const [stats, setStats] = useState(() => getStats());
  const completedCount = lessons.filter((l) => l.state === 'completed').length;

  function handleReset() {
    resetProgress();
    setLessons(getLessonsWithState());
    setStats(getStats());
  }

  return (
    <>
      <div className="topbar topbar-home">
        <div className="topbar-titles">
          <h1>Spanish for Banking</h1>
          <div className="subtitle">
            {completedCount} / {lessons.length} lessons complete
          </div>
        </div>
        <div className="stat-chips">
          <span className="stat-chip streak" title="Day streak">
            <Flame size={18} strokeWidth={2.6} fill="currentColor" />
            {stats.streak}
          </span>
          <span className="stat-chip xp" title="Total XP">
            <Zap size={18} strokeWidth={2.6} fill="currentColor" />
            {stats.xp}
          </span>
        </div>
      </div>
      <div className="main">
        {lessons.length > 0 ? (
          <LessonPath lessons={lessons} />
        ) : (
          <div className="empty-state">No modules found. Add a JSON file to src/data/modules.</div>
        )}
        {lessons.length > 0 && (
          <button className="reset-progress-btn" onClick={handleReset}>
            Reset progress
          </button>
        )}
      </div>
    </>
  );
}
