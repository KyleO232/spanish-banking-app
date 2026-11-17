import { getTrack } from '../utils/track.js';

// Titles climb a career ladder as lifetime XP grows, and each track has its own ladder
// (same XP steps, different careers). They are never lost, because XP only ever goes up
// (coins are what the shop spends). XP is shared between tracks, so the same XP total is
// a different title depending on the track.

const BANKING = [
  { xp: 0, es: 'Pasante', en: 'Intern' },
  { xp: 100, es: 'Cajero', en: 'Teller' },
  { xp: 300, es: 'Analista', en: 'Analyst' },
  { xp: 600, es: 'Asesor', en: 'Advisor' },
  { xp: 1000, es: 'Gerente', en: 'Manager' },
  { xp: 1600, es: 'Director', en: 'Director' },
  { xp: 2400, es: 'Socio', en: 'Partner' },
  { xp: 3500, es: 'Presidente', en: 'President' },
];

const MEDICAL = [
  { xp: 0, es: 'Estudiante', en: 'Student' },
  { xp: 100, es: 'Voluntario', en: 'Volunteer' },
  { xp: 300, es: 'Asistente médico', en: 'Medical Assistant' },
  { xp: 600, es: 'Enfermero', en: 'Nurse' },
  { xp: 1000, es: 'Residente', en: 'Resident' },
  { xp: 1600, es: 'Médico', en: 'Physician' },
  { xp: 2400, es: 'Especialista', en: 'Specialist' },
  { xp: 3500, es: 'Director médico', en: 'Medical Director' },
];

export const TITLES_BY_TRACK = { banking: BANKING, medical: MEDICAL };

// The title for a given XP total on a track (the learner's current track by default),
// plus progress toward the next one.
export function titleFor(xp = 0, trackId = getTrack()) {
  const titles = TITLES_BY_TRACK[trackId] ?? BANKING;
  let index = 0;
  titles.forEach((title, i) => {
    if (xp >= title.xp) index = i;
  });

  const current = titles[index];
  const next = titles[index + 1] ?? null;
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
