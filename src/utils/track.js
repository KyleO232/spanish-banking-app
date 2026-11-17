import { useSyncExternalStore } from 'react';
import { DEFAULT_TRACK, TRACKS } from '../data/tracks.js';

// Which career track the learner is working on. It's a per-device preference (progress,
// XP, coins and the streak are shared by every track).

const KEY = 'spanish-banking-track';
const listeners = new Set();

function read() {
  try {
    const saved = localStorage.getItem(KEY);
    return TRACKS.some((t) => t.id === saved && t.available) ? saved : DEFAULT_TRACK;
  } catch {
    return DEFAULT_TRACK;
  }
}

let current = read();

export function getTrack() {
  return current;
}

export function setTrack(id) {
  if (!TRACKS.some((t) => t.id === id && t.available) || id === current) return;
  current = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // storage unavailable: the choice just lasts until the page closes
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// React hook: re-renders when the track changes.
export function useTrack() {
  return useSyncExternalStore(subscribe, getTrack, () => DEFAULT_TRACK);
}
