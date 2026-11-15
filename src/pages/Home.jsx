import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Zap } from 'lucide-react';
import CoinIcon from '../components/CoinIcon.jsx';
import { getLessonsWithState } from '../data/lessons.js';
import { titleFor } from '../data/titles.js';
import { getStats, getWallet, resetProgress } from '../utils/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import LessonPath from '../components/LessonPath.jsx';

export default function Home() {
  const [lessons, setLessons] = useState(() => getLessonsWithState());
  const [stats, setStats] = useState(() => getStats());
  const [wallet, setWallet] = useState(() => getWallet());
  const { adminOn } = useAuth();
  const completedCount = lessons.filter((l) => l.state === 'completed').length;
  const title = titleFor(stats.xp);

  function handleReset() {
    resetProgress();
    setLessons(getLessonsWithState());
    setStats(getStats());
    setWallet(getWallet());
  }

  return (
    <>
      <div className="topbar topbar-home">
        <div className="topbar-titles">
          <h1>Spanish for Banking</h1>
          <div className="subtitle">
            {adminOn ? (
              <span className="admin-badge">Admin mode · everything unlocked</span>
            ) : (
              <>
                <strong className="rank-name">{title.es}</strong> · {completedCount} / {lessons.length} lessons
              </>
            )}
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
          <Link to="/shop" className="stat-chip coins" title="Coins: tap to open the shop">
            <CoinIcon size={18} />
            {wallet.balance}
          </Link>
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
