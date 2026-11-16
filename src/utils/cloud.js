import { supabase } from '../lib/supabase.js';
import { applySnapshot, getSnapshot } from './progress.js';

const union = (a = [], b = []) => [...new Set([...a, ...b])];

// Progress made before coins existed is credited at roughly the same rate as new play.
const legacyCoins = (xp) => Math.floor((xp ?? 0) * 0.3);

// Items are unioned (nothing bought is ever lost). What she is wearing comes from
// whichever device changed it last, as long as she owns it.
function mergeWardrobes(local = {}, remote = {}) {
  const owned = union(local.owned, remote.owned);
  const localNewer = (local.equippedAt ?? 0) >= (remote.equippedAt ?? 0);
  const source = (localNewer ? local.equipped : remote.equipped) ?? {};
  const equipped = {};
  Object.entries(source).forEach(([slot, id]) => {
    if (owned.includes(id)) equipped[slot] = id;
  });
  return {
    owned,
    equipped,
    equippedAt: Math.max(local.equippedAt ?? 0, remote.equippedAt ?? 0),
  };
}

// Combine progress from this device and the account so nothing is ever lost:
// finished lessons/flashcards are unioned, XP and coins keep the higher total, owned
// items are unioned, and the streak comes from whichever side was active more recently.
export function mergeSnapshots(local, remote) {
  const localDate = local.lastActive ?? '';
  const remoteDate = remote.lastActive ?? '';
  let streak;
  let lastActive;
  if (localDate === remoteDate) {
    streak = Math.max(local.streak, remote.streak);
    lastActive = local.lastActive ?? remote.lastActive ?? null;
  } else if (localDate > remoteDate) {
    streak = local.streak;
    lastActive = local.lastActive;
  } else {
    streak = remote.streak;
    lastActive = remote.lastActive;
  }

  return {
    completed: union(local.completed, remote.completed),
    flashcardsDone: union(local.flashcardsDone, remote.flashcardsDone),
    practiceDone: union(local.practiceDone, remote.practiceDone),
    xp: Math.max(local.xp, remote.xp),
    coins: Math.max(local.coins ?? 0, remote.coins ?? 0),
    wardrobe: mergeWardrobes(local.wardrobe, remote.wardrobe),
    streak,
    lastActive,
  };
}

function fromRow(row) {
  const xp = row.xp ?? 0;
  return {
    completed: row.completed ?? [],
    flashcardsDone: row.flashcards_done ?? [],
    practiceDone: row.practice_done ?? [],
    xp,
    // a row that has XP but no coins predates the shop
    coins: row.coins > 0 ? row.coins : legacyCoins(xp),
    wardrobe: row.wardrobe ?? {},
    streak: row.streak ?? 0,
    lastActive: row.last_active ?? null,
  };
}

// If the database doesn't have the newer columns yet (shop, practice), keep syncing the rest.
const isMissingColumn = (error) =>
  error?.code === '42703' ||
  error?.code === 'PGRST204' ||
  /column .*(coins|wardrobe|practice_done)|(coins|wardrobe|practice_done).* column/i.test(error?.message ?? '');

export async function pushProgress(userId, snapshot = getSnapshot()) {
  const base = {
    user_id: userId,
    completed: snapshot.completed,
    flashcards_done: snapshot.flashcardsDone,
    xp: snapshot.xp,
    streak: snapshot.streak,
    last_active: snapshot.lastActive,
    updated_at: new Date().toISOString(),
  };

  // newest schema first, falling back to older ones if a column hasn't been added yet
  const attempts = [
    { ...base, coins: snapshot.coins, wardrobe: snapshot.wardrobe, practice_done: snapshot.practiceDone ?? [] },
    { ...base, coins: snapshot.coins, wardrobe: snapshot.wardrobe },
    base,
  ];
  let error = null;
  for (const row of attempts) {
    ({ error } = await supabase.from('user_progress').upsert(row, { onConflict: 'user_id' }));
    if (!error || !isMissingColumn(error)) break;
  }
  if (error) throw error;
}

// On sign-in: pull the account's progress, merge it with this device's, save the
// result locally and back to the account.
export async function syncDown(userId) {
  const columns = 'completed, flashcards_done, xp, streak, last_active';
  const selects = [`${columns}, coins, wardrobe, practice_done`, `${columns}, coins, wardrobe`, columns];
  let data = null;
  let error = null;
  for (const select of selects) {
    ({ data, error } = await supabase.from('user_progress').select(select).eq('user_id', userId).maybeSingle());
    if (!error || !isMissingColumn(error)) break;
  }
  if (error) throw error;

  const merged = data ? mergeSnapshots(getSnapshot(), fromRow(data)) : getSnapshot();
  applySnapshot(merged);
  await pushProgress(userId, merged);
}

export async function checkIsAdmin(userId) {
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}
