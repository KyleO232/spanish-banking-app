import { supabase } from '../lib/supabase.js';
import { applySnapshot, getSnapshot } from './progress.js';

const union = (a = [], b = []) => [...new Set([...a, ...b])];

// Combine progress from this device and the account so nothing is ever lost:
// finished lessons/flashcards are unioned, XP keeps the higher total, and the
// streak comes from whichever side was active more recently.
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
    xp: Math.max(local.xp, remote.xp),
    streak,
    lastActive,
  };
}

function fromRow(row) {
  return {
    completed: row.completed ?? [],
    flashcardsDone: row.flashcards_done ?? [],
    xp: row.xp ?? 0,
    streak: row.streak ?? 0,
    lastActive: row.last_active ?? null,
  };
}

export async function pushProgress(userId, snapshot = getSnapshot()) {
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      completed: snapshot.completed,
      flashcards_done: snapshot.flashcardsDone,
      xp: snapshot.xp,
      streak: snapshot.streak,
      last_active: snapshot.lastActive,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

// On sign-in: pull the account's progress, merge it with this device's, save the
// result locally and back to the account.
export async function syncDown(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('completed, flashcards_done, xp, streak, last_active')
    .eq('user_id', userId)
    .maybeSingle();
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
