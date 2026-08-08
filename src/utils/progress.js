const STORAGE_KEY = 'spanish-banking-progress';

function readCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeCompleted(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
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

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
