import { DEFAULT_TRACK } from './tracks.js';

const moduleFiles = import.meta.glob('./modules/*.json', { eager: true });

// The order learners work through the modules (within a track). A module not listed
// here goes last.
const MODULE_ORDER = [
  'community-banking',
  'wealth-management',
  'investment-banking',
  'insurance',
  'anatomy',
  'symptoms',
  'exams',
];

const rank = (m) => {
  const i = MODULE_ORDER.indexOf(m.id);
  return i === -1 ? MODULE_ORDER.length : i;
};

const modules = Object.values(moduleFiles)
  .map((file) => file.default ?? file)
  .sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));

export function trackOf(module) {
  return module.track ?? DEFAULT_TRACK;
}

// Every module, or just the ones in one track.
export function getModules(trackId) {
  return trackId ? modules.filter((m) => trackOf(m) === trackId) : modules;
}

export function getModule(id) {
  return modules.find((m) => m.id === id);
}

export function getBlocks(module) {
  return [...new Set(module.terms.map((t) => t.block))];
}

export function getTermsByBlock(module, block) {
  if (!block || block === 'All') return module.terms;
  return module.terms.filter((t) => t.block === block);
}

// What to call the two people in a roleplay. Banking uses Banker/Client; a module can
// set its own with `roles` ({ you, other }), and its dialogue lines use those names.
const rolesCache = new WeakMap(); // keeps the same object per module so React sees no change
export function rolesOf(module) {
  if (!module) return { you: 'Banker', other: 'Client' };
  if (!rolesCache.has(module)) {
    rolesCache.set(module, { you: module.roles?.you ?? 'Banker', other: module.roles?.other ?? 'Client' });
  }
  return rolesCache.get(module);
}
