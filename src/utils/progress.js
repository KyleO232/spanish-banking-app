import { isAdminMode } from './adminMode.js';

const STORAGE_KEY = 'spanish-banking-progress';
const STATS_KEY = 'spanish-banking-stats';
const FLASH_KEY = 'spanish-banking-flashcards';

// ---------- storage helpers ----------

function readSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // storage unavailable (private mode etc.) — progress just won't persist
  }
}

// ---------- change notifications (used to sync to the cloud) ----------

let changeListener = null;

export function setChangeListener(fn) {
  changeListener = fn;
}

function notifyChanged(immediate = false) {
  if (changeListener) changeListener(immediate);
}

// ---------- lessons ----------

export function lessonKey(moduleId, block) {
  return `${moduleId}::${block}`;
}

export function isCompleted(moduleId, block) {
  return readSet(STORAGE_KEY).has(lessonKey(moduleId, block));
}

export function markCompleted(moduleId, block) {
  const set = readSet(STORAGE_KEY);
  set.add(lessonKey(moduleId, block));
  writeSet(STORAGE_KEY, set);
  notifyChanged();
}

// ---------- flashcard step ----------
// A lesson's quiz unlocks once every flashcard in it has been viewed.

export function isFlashcardsDone(moduleId, block) {
  return readSet(FLASH_KEY).has(lessonKey(moduleId, block));
}

export function markFlashcardsDone(moduleId, block) {
  if (isAdminMode()) return; // admin preview doesn't change real progress
  const set = readSet(FLASH_KEY);
  set.add(lessonKey(moduleId, block));
  writeSet(FLASH_KEY, set);
  notifyChanged();
}

// ---------- XP + streak ----------

const EMPTY_STATS = { xp: 0, streak: 0, lastActive: null };

function dayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readRawStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...EMPTY_STATS, ...JSON.parse(raw) } : { ...EMPTY_STATS };
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function getStats() {
  const stats = readRawStats();
  // a streak only counts if you were active today or yesterday
  if (stats.lastActive) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (stats.lastActive !== dayString() && stats.lastActive !== dayString(yesterday)) {
      stats.streak = 0;
    }
  }
  return stats;
}

// Awards XP for a finished quiz or roleplay and extends the daily streak.
// Returns what to show on the celebration screen.
export function recordQuizResult({ moduleId, block, score, total }) {
  const stats = getStats();
  const perfect = total > 0 && score === total;

  // Admin preview: show the screen as normal, but don't touch real progress.
  if (isAdminMode()) {
    return {
      xpEarned: 0,
      perfect,
      firstCompletion: false,
      streak: stats.streak,
      totalXp: stats.xp,
      preview: true,
    };
  }

  const today = dayString();
  const firstCompletion = Boolean(block) && !isCompleted(moduleId, block);
  const xpEarned = score * 10 + (perfect ? 20 : 0) + (firstCompletion ? 30 : 0);

  if (block) {
    const set = readSet(STORAGE_KEY);
    set.add(lessonKey(moduleId, block));
    writeSet(STORAGE_KEY, set);
  }

  let streak = stats.streak;
  if (stats.lastActive !== today) streak += 1;
  if (streak < 1) streak = 1;

  const next = { xp: stats.xp + xpEarned, streak, lastActive: today };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  notifyChanged();

  return { xpEarned, perfect, firstCompletion, streak, totalXp: next.xp };
}

// ---------- snapshots (for syncing with an account) ----------

export function getSnapshot() {
  const stats = readRawStats();
  return {
    completed: [...readSet(STORAGE_KEY)],
    flashcardsDone: [...readSet(FLASH_KEY)],
    xp: stats.xp,
    streak: stats.streak,
    lastActive: stats.lastActive,
  };
}

export function applySnapshot(snapshot) {
  writeSet(STORAGE_KEY, new Set(snapshot.completed ?? []));
  writeSet(FLASH_KEY, new Set(snapshot.flashcardsDone ?? []));
  try {
    localStorage.setItem(
      STATS_KEY,
      JSON.stringify({
        xp: snapshot.xp ?? 0,
        streak: snapshot.streak ?? 0,
        lastActive: snapshot.lastActive ?? null,
      })
    );
  } catch {
    // ignore
  }
}

// Wipes this device's copy without telling the cloud (used on sign-out).
export function clearLocalProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(FLASH_KEY);
  } catch {
    // ignore
  }
}

// Wipes progress everywhere (the account too, when signed in).
export function resetProgress() {
  clearLocalProgress();
  notifyChanged(true);
}
