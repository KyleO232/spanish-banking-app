const moduleFiles = import.meta.glob('./modules/*.json', { eager: true });

// The order learners work through the modules. A module not listed here goes last.
const MODULE_ORDER = ['community-banking', 'wealth-management', 'investment-banking', 'insurance'];

const rank = (m) => {
  const i = MODULE_ORDER.indexOf(m.id);
  return i === -1 ? MODULE_ORDER.length : i;
};

const modules = Object.values(moduleFiles)
  .map((file) => file.default ?? file)
  .sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));

export function getModules() {
  return modules;
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
