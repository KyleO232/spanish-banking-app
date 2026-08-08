import { useState } from 'react';
import { getLessonsWithState } from '../data/lessons.js';
import { resetProgress } from '../utils/progress.js';
import LessonPath from '../components/LessonPath.jsx';

export default function Home() {
  const [lessons, setLessons] = useState(() => getLessonsWithState());
  const completedCount = lessons.filter((l) => l.state === 'completed').length;

  function handleReset() {
    resetProgress();
    setLessons(getLessonsWithState());
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-titles">
          <h1>Spanish for Banking</h1>
          <div className="subtitle">
            {completedCount} / {lessons.length} lessons complete
          </div>
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
