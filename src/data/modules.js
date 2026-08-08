const moduleFiles = import.meta.glob('./modules/*.json', { eager: true });

const modules = Object.values(moduleFiles)
  .map((file) => file.default ?? file)
  .sort((a, b) => a.title.localeCompare(b.title));

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
