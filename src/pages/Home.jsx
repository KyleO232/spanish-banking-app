import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Zap } from 'lucide-react';
import CoinIcon from '../components/CoinIcon.jsx';
import { getLessonsWithState } from '../data/lessons.js';
import { getTrackInfo } from '../data/tracks.js';
import { useTrack } from '../utils/track.js';
import { titleFor } from '../data/titles.js';
import { getStats, getWallet } from '../utils/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import LessonPath from '../components/LessonPath.jsx';
import AdminTools from '../components/AdminTools.jsx';

export default function Home() {
  const trackId = useTrack();
  const track = getTrackInfo(trackId);
  const [allLessons, setLessons] = useState(() => getLessonsWithState());
  const lessons = useMemo(() => allLessons.filter((l) => l.track === trackId), [allLessons, trackId]);
  const [stats, setStats] = useState(() => getStats());
  const [wallet, setWallet] = useState(() => getWallet());
  const { adminOn } = useAuth();
  const completedCount = lessons.filter((l) => l.state === 'completed').length;
  const title = titleFor(stats.xp);

  // after an admin edits or resets progress, re-read everything shown on this screen
  function refresh() {
    setLessons(getLessonsWithState());
    setStats(getStats());
    setWallet(getWallet());
  }

  return (
    <>
      <div className="topbar topbar-home">
        <div className="topbar-titles">
          <h1>{track.heading}</h1>
          <div className="subtitle">
            {adminOn ? (
              <span className="admin-badge">Admin mode · all unlocked</span>
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
        {adminOn && <AdminTools onChange={refresh} />}
        {lessons.length > 0 ? (
          <LessonPath lessons={lessons} />
        ) : (
          <div className="empty-state">No {track.title.toLowerCase()} modules yet.</div>
        )}
      </div>
    </>
  );
}
