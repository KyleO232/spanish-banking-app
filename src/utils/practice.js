import { getFillBlank, normalizeAnswer, shuffle } from './quiz.js';

// Builds a practice round: a mix of short exercises over a lesson's terms, easiest first
// (matching pairs, then recognizing meanings, then recalling Spanish, then typing it).

const stripArticle = (s) => s.replace(/^(el|la|los|las|al|del)\s+/i, '').trim();

// The Spanish of a term without a gender alternate: "el agente / la agente" -> "el agente".
export function shortSpanish(term) {
  return term.spanish.split('/')[0].trim();
}

// Everything a learner may type for a term and still be right: either side of a "/",
// with or without the article or a gloss like "(SSN)". Accents and case are ignored.
export function acceptedAnswers(term) {
  const accepted = new Set([normalizeAnswer(term.spanish)]);
  const withoutGloss = term.spanish.replace(/\s+\([^)]*\)/g, '').trim();
  [term.spanish, withoutGloss].forEach((form) => {
    form.split('/').forEach((alt) => {
      const text = alt.trim();
      if (!text) return;
      accepted.add(normalizeAnswer(text));
      accepted.add(normalizeAnswer(stripArticle(text)));
    });
  });
  return accepted;
}

export function isCorrectTyped(term, input) {
  const typed = normalizeAnswer(input);
  return typed !== '' && acceptedAnswers(term).has(typed);
}

// What to try next when someone misses an exercise: a different angle on the same word.
const RETRY_KIND = {
  'es-en': 'en-es',
  'en-es': 'es-en',
  sentence: 'en-es',
  type: 'en-es',
  match: 'es-en',
};

const KIND_ORDER = ['es-en', 'en-es', 'sentence', 'type'];
const RANK = { match: 0, 'es-en': 1, 'en-es': 2, sentence: 3, type: 4 };

function pickOthers(terms, term, count, textOf, avoid) {
  const seen = new Set([avoid]);
  const out = [];
  for (const other of shuffle(terms)) {
    if (other === term) continue;
    const text = textOf(other);
    const key = normalizeAnswer(text);
    if (!text || seen.has(key)) continue;
    // skip near-duplicates that would make two options equally right
    if ([...seen].some((s) => s && (s.includes(key) || key.includes(s)))) continue;
    seen.add(key);
    out.push(text);
    if (out.length === count) break;
  }
  return out;
}

let nextId = 0;

export function makeExercise(kind, term, terms) {
  const id = `ex-${nextId++}`;

  if (kind === 'sentence') {
    const fill = getFillBlank(term);
    if (fill) {
      const distractors = pickOthers(terms, term, 3, (t) => stripArticle(shortSpanish(t)).replace(/\s+\([^)]*\)/g, ''), normalizeAnswer(fill.answer));
      if (distractors.length === 3) {
        return {
          id,
          kind,
          term,
          prompt: fill.blanked,
          promptEnglish: fill.englishFull,
          full: fill.full,
          answer: fill.answer,
          options: shuffle([fill.answer, ...distractors]),
        };
      }
    }
    return makeExercise('en-es', term, terms);
  }

  if (kind === 'es-en') {
    const distractors = pickOthers(terms, term, 3, (t) => t.english, normalizeAnswer(term.english));
    return { id, kind, term, prompt: term.spanish, note: term.note, answer: term.english, options: shuffle([term.english, ...distractors]) };
  }

  if (kind === 'en-es') {
    const distractors = pickOthers(terms, term, 3, (t) => t.spanish, normalizeAnswer(term.spanish));
    return { id, kind, term, prompt: term.english, answer: term.spanish, options: shuffle([term.spanish, ...distractors]) };
  }

  // type: write the Spanish for an English prompt
  return { id, kind: 'type', term, prompt: term.english, note: term.note, answer: term.spanish };
}

export function makeRetry(kind, term, terms) {
  return makeExercise(RETRY_KIND[kind] ?? 'en-es', term, terms);
}

// A round of tap-to-match pairs for a handful of terms.
function makeMatch(group) {
  return { id: `ex-${nextId++}`, kind: 'match', terms: group };
}

export function buildPractice(terms) {
  const pool = shuffle(terms);
  const exercises = [];

  // matching rounds of about five pairs each
  const rounds = Math.max(1, Math.round(pool.length / 5));
  const per = Math.floor(pool.length / rounds);
  const extra = pool.length % rounds;
  let start = 0;
  for (let r = 0; r < rounds; r++) {
    const size = per + (r < extra ? 1 : 0);
    exercises.push(makeMatch(pool.slice(start, start + size)));
    start += size;
  }

  // every word also gets one exercise of its own
  pool.forEach((term, i) => exercises.push(makeExercise(KIND_ORDER[i % KIND_ORDER.length], term, terms)));

  // easy to hard, with a little shuffling inside each level
  return exercises
    .map((ex) => ({ ex, key: RANK[ex.kind] + Math.random() * 1.1 }))
    .sort((a, b) => a.key - b.key)
    .map(({ ex }) => ex);
}
