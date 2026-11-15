import { isAdminMode } from './adminMode.js';
import { SLOTS, getItem } from '../data/wardrobe.js';
import { titleFor } from '../data/titles.js';

const STORAGE_KEY = 'spanish-banking-progress';
const STATS_KEY = 'spanish-banking-stats';
const FLASH_KEY = 'spanish-banking-flashcards';
const WARDROBE_KEY = 'spanish-banking-wardrobe';

// Coins are earned alongside XP and spent in the shop.
const COINS_PER_CORRECT = 3;
const COINS_PERFECT_BONUS = 15;
const COINS_FIRST_COMPLETION_BONUS = 25;
// Progress made before coins existed is credited at roughly the same rate.
const COINS_PER_LEGACY_XP = 0.3;

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

// xp and coins are both lifetime totals that only ever go up. What the learner can
// spend is coins minus the price of everything they own (see getWallet).
const EMPTY_STATS = { xp: 0, streak: 0, lastActive: null, coins: 0 };

function dayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readRawStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw);
    const stats = { ...EMPTY_STATS, ...parsed };
    if (parsed.coins === undefined) stats.coins = Math.floor((stats.xp ?? 0) * COINS_PER_LEGACY_XP);
    return stats;
  } catch {
    return { ...EMPTY_STATS };
  }
}

// ---------- wardrobe (what Monedita owns and wears) ----------

const EMPTY_WARDROBE = { owned: [], equipped: {}, equippedAt: 0 };

export function getWardrobe() {
  try {
    const raw = localStorage.getItem(WARDROBE_KEY);
    if (!raw) return { ...EMPTY_WARDROBE, owned: [], equipped: {} };
    const parsed = JSON.parse(raw);
    return {
      owned: Array.isArray(parsed.owned) ? parsed.owned : [],
      equipped: parsed.equipped && typeof parsed.equipped === 'object' ? parsed.equipped : {},
      equippedAt: Number(parsed.equippedAt) || 0,
    };
  } catch {
    return { ...EMPTY_WARDROBE, owned: [], equipped: {} };
  }
}

function writeWardrobe(wardrobe) {
  try {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
  } catch {
    // storage unavailable — the purchase just won't persist
  }
}

// What she is wearing right now: only items that exist, fit their slot and are owned.
export function getEquipped() {
  const wardrobe = getWardrobe();
  const worn = {};
  SLOTS.forEach((slot) => {
    const id = wardrobe.equipped[slot];
    const item = id ? getItem(id) : null;
    if (item && item.slot === slot && wardrobe.owned.includes(id)) worn[slot] = id;
  });
  return worn;
}

// coins: lifetime coins earned. spent: the price of everything owned.
// balance: what can be spent now. Because purchases are derived from the owned list,
// merging two devices (union of items, highest coins) can never double-spend or lose items.
export function getWallet() {
  const { coins } = readRawStats();
  const spent = getWardrobe().owned.reduce((sum, id) => sum + (getItem(id)?.price ?? 0), 0);
  return { coins, spent, balance: Math.max(0, coins - spent) };
}

export function buyItem(id) {
  if (isAdminMode()) return { ok: false, reason: 'admin' };
  const item = getItem(id);
  if (!item) return { ok: false, reason: 'unknown' };

  const wardrobe = getWardrobe();
  if (wardrobe.owned.includes(id)) return { ok: false, reason: 'owned' };

  const { balance } = getWallet();
  if (balance < item.price) return { ok: false, reason: 'coins', needed: item.price - balance };

  writeWardrobe({
    owned: [...wardrobe.owned, id],
    equipped: { ...wardrobe.equipped, [item.slot]: id }, // new things get worn right away
    equippedAt: Date.now(),
  });
  notifyChanged();
  return { ok: true, item };
}

// Put an owned item on (or take the slot's item off when id is null).
export function equipItem(slot, id) {
  if (isAdminMode()) return false;
  const wardrobe = getWardrobe();
  const equipped = { ...wardrobe.equipped };

  if (id) {
    const item = getItem(id);
    if (!item || item.slot !== slot || !wardrobe.owned.includes(id)) return false;
    equipped[slot] = id;
  } else {
    delete equipped[slot];
  }

  writeWardrobe({ ...wardrobe, equipped, equippedAt: Date.now() });
  notifyChanged();
  return true;
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
      coinsEarned: 0,
      perfect,
      firstCompletion: false,
      streak: stats.streak,
      totalXp: stats.xp,
      title: titleFor(stats.xp),
      leveledUp: false,
      preview: true,
    };
  }

  const today = dayString();
  const firstCompletion = Boolean(block) && !isCompleted(moduleId, block);
  const xpEarned = score * 10 + (perfect ? 20 : 0) + (firstCompletion ? 30 : 0);
  const coinsEarned =
    score * COINS_PER_CORRECT +
    (perfect ? COINS_PERFECT_BONUS : 0) +
    (firstCompletion ? COINS_FIRST_COMPLETION_BONUS : 0);

  if (block) {
    const set = readSet(STORAGE_KEY);
    set.add(lessonKey(moduleId, block));
    writeSet(STORAGE_KEY, set);
  }

  let streak = stats.streak;
  if (stats.lastActive !== today) streak += 1;
  if (streak < 1) streak = 1;

  const next = { xp: stats.xp + xpEarned, streak, lastActive: today, coins: stats.coins + coinsEarned };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  notifyChanged();

  const before = titleFor(stats.xp);
  const after = titleFor(next.xp);
  return {
    xpEarned,
    coinsEarned,
    perfect,
    firstCompletion,
    streak,
    totalXp: next.xp,
    title: after,
    leveledUp: after.index > before.index,
  };
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
    coins: stats.coins,
    wardrobe: getWardrobe(),
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
        coins: snapshot.coins ?? 0,
      })
    );
  } catch {
    // ignore
  }
  writeWardrobe({
    owned: snapshot.wardrobe?.owned ?? [],
    equipped: snapshot.wardrobe?.equipped ?? {},
    equippedAt: snapshot.wardrobe?.equippedAt ?? 0,
  });
}

// Wipes this device's copy without telling the cloud (used on sign-out).
export function clearLocalProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(FLASH_KEY);
    localStorage.removeItem(WARDROBE_KEY);
  } catch {
    // ignore
  }
}

// Wipes progress everywhere (the account too, when signed in).
export function resetProgress() {
  clearLocalProgress();
  notifyChanged(true);
}
