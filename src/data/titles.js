// Titles climb a banking career ladder as lifetime XP grows. They are never lost,
// because XP only ever goes up (coins are what the shop spends).

export const TITLES = [
  { xp: 0, es: 'Pasante', en: 'Intern' },
  { xp: 100, es: 'Cajero', en: 'Teller' },
  { xp: 300, es: 'Analista', en: 'Analyst' },
  { xp: 600, es: 'Asesor', en: 'Advisor' },
  { xp: 1000, es: 'Gerente', en: 'Manager' },
  { xp: 1600, es: 'Director', en: 'Director' },
  { xp: 2400, es: 'Socio', en: 'Partner' },
  { xp: 3500, es: 'Presidente', en: 'President' },
];

// The title for a given XP total, plus progress toward the next one.
export function titleFor(xp = 0) {
  let index = 0;
  TITLES.forEach((title, i) => {
    if (xp >= title.xp) index = i;
  });

  const current = TITLES[index];
  const next = TITLES[index + 1] ?? null;
  const span = next ? next.xp - current.xp : 0;

  return {
    index,
    es: current.es,
    en: current.en,
    next,
    xpToNext: next ? next.xp - xp : 0,
    progress: next ? Math.min(1, Math.max(0, (xp - current.xp) / span)) : 1,
  };
}
