import { Check, Flame } from 'lucide-react';
import { getStats } from '../utils/progress.js';

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// This week (Mon–Sun) with the days of the current streak checked off. The streak is
// a run of consecutive days ending on the last active day, so no extra history is stored.
export default function WeekStreak() {
  const { streak, lastActive } = getStats();

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIndex);

  let first = null;
  if (lastActive && streak > 0) {
    const start = new Date(`${lastActive}T12:00:00`);
    start.setDate(start.getDate() - (streak - 1));
    first = ymd(start);
  }

  const days = LABELS.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const key = ymd(date);
    return {
      label,
      key,
      active: Boolean(first) && key >= first && key <= lastActive,
      isToday: i === todayIndex,
    };
  });

  return (
    <div className="week-streak">
      <div className="week-streak-title">
        <Flame size={18} strokeWidth={2.6} fill="currentColor" /> {streak > 0 ? `${streak}-day streak` : 'Start a streak today'}
      </div>
      <div className="week-streak-days">
        {days.map((d, i) => (
          <div key={d.key} className={`week-day ${d.active ? 'active' : ''} ${d.isToday ? 'today' : ''}`}>
            <span className="week-day-label">{d.label}</span>
            <span className="week-day-dot" style={{ animationDelay: `${0.9 + i * 0.07}s` }}>
              {d.active && <Check size={16} strokeWidth={3.6} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
