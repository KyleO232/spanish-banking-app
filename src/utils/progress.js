const STORAGE_KEY = 'spanish-banking-progress';
const STATS_KEY = 'spanish-banking-stats';

function readCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeCompleted(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // storage unavailable (private mode etc.) — progress just won't persist
  }
}

export function lessonKey(moduleId, block) {
  return `${moduleId}::${block}`;
}

export function isCompleted(moduleId, block) {
  return readCompleted().has(lessonKey(moduleId, block));
}

export function markCompleted(moduleId, block) {
  const set = readCompleted();
  set.add(lessonKey(moduleId, block));
  writeCompleted(set);
}

// ---------- XP + streak ----------

const EMPTY_STATS = { xp: 0, streak: 0, lastActive: null };

function dayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const stats = raw ? { ...EMPTY_STATS, ...JSON.parse(raw) } : { ...EMPTY_STATS };
    // a streak only counts if you were active today or yesterday
    if (stats.lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastActive !== dayString() && stats.lastActive !== dayString(yesterday)) {
        stats.streak = 0;
      }
    }
    return stats;
  } catch {
    return { ...EMPTY_STATS };
  }
}

// Awards XP for a finished quiz and extends the daily streak.
// Returns what to show on the celebration screen.
export function recordQuizResult({ moduleId, block, score, total }) {
  const stats = getStats();
  const today = dayString();

  const firstCompletion = Boolean(block) && !isCompleted(moduleId, block);
  const perfect = total > 0 && score === total;
  const xpEarned = score * 10 + (perfect ? 20 : 0) + (firstCompletion ? 30 : 0);

  if (block) markCompleted(moduleId, block);

  let streak = stats.streak;
  if (stats.lastActive !== today) streak += 1;
  if (streak < 1) streak = 1;

  const next = { xp: stats.xp + xpEarned, streak, lastActive: today };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }

  return { xpEarned, perfect, firstCompletion, streak, totalXp: next.xp };
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch {
    // ignore
  }
}
