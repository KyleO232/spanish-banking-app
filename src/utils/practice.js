import { getFillBlank, normalizeAnswer, shuffle } from './quiz.js';

// Builds a practice round: a mix of short exercises over a lesson's terms, easiest first
// (matching pairs, then recognizing meanings, then recalling Spanish, then typing it).

const stripArticle = (s) => s.replace(/^(el|la|los|las|al|del)\s+/i, '').trim();
const stripGloss = (s) => s.replace(/\s+\([^)]*\)/g, '').trim();

// Alternates are written " / " with spaces ("el asesor / la asesora"). A slash with no
// spaces joins two words that belong together ("abrir/cerrar una cuenta"), so it stays.
const ALTERNATE = /\s+\/\s+/;

// The Spanish of a term without its alternates: "el agente / la agente" -> "el agente".
export function shortSpanish(term) {
  return term.spanish.split(ALTERNATE)[0].trim();
}

// Accents, case and punctuation are ignored, and so is spacing around a slash.
const canon = (s) => normalizeAnswer(s).replace(/\s*\/\s*/g, '/');

// "abrir/cerrar una cuenta" -> itself, "abrir una cuenta" and "cerrar una cuenta";
// "Con gusto lo/la ayudo." -> itself, "...lo ayudo." and "...la ayudo."
function slashVariants(form) {
  const match = form.match(/(\S+)\/(\S+)/);
  if (!match) return [form];
  return [
    form,
    ...slashVariants(form.replace(match[0], match[1])),
    ...slashVariants(form.replace(match[0], match[2])),
  ];
}

// Everything a learner may type for a term and still be right: either side of a " / ",
// with or without the article or a gloss like "(SSN)", and either word of a paired
// "open/close".
export function acceptedAnswers(term) {
  const accepted = new Set([canon(term.spanish)]);
  [term.spanish, stripGloss(term.spanish)].forEach((form) => {
    form.split(ALTERNATE).forEach((alt) => {
      slashVariants(alt.trim()).forEach((text) => {
        if (!text) return;
        accepted.add(canon(text));
        accepted.add(canon(stripArticle(text)));
      });
    });
  });
  return accepted;
}

export function isCorrectTyped(term, input) {
  const typed = canon(input);
  return typed !== '' && acceptedAnswers(term).has(typed);
}

// Typing is only asked for words and short phrases, not whole sentences.
const MAX_TYPED_WORDS = 6;
const wordCount = (term) => stripArticle(stripGloss(shortSpanish(term))).split(/\s+/).length;

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

// Picks wrong options from the other terms: none that repeat the right answer, none that
// are a piece of it (or contain it), and none that `reject` says to skip.
function pickOthers(terms, term, count, textOf, avoid, reject = () => false) {
  const seen = new Set([avoid]);
  const out = [];
  for (const other of shuffle(terms)) {
    if (other === term) continue;
    // a term can list others it is easy to mix up with ("premium" and "monthly payment")
    if (term.confusable?.includes(other.spanish) || other.confusable?.includes(term.spanish)) continue;
    const text = textOf(other);
    const key = normalizeAnswer(text);
    if (!text || seen.has(key) || reject(key)) continue;
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
      const sentence = normalizeAnswer(fill.blanked);
      const distractors = pickOthers(
        terms,
        term,
        3,
        (t) => stripArticle(stripGloss(shortSpanish(t))),
        normalizeAnswer(fill.answer),
        (key) => sentence.includes(key) // already written in the sentence: a free elimination
      );
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
    return { id, kind, term, prompt: term.spanish, answer: term.english, options: shuffle([term.english, ...distractors]) };
  }

  if (kind === 'en-es') {
    const distractors = pickOthers(terms, term, 3, (t) => t.spanish, normalizeAnswer(term.spanish));
    return { id, kind, term, prompt: term.english, answer: term.spanish, options: shuffle([term.spanish, ...distractors]) };
  }

  // type: write the Spanish for an English prompt (long sentences are picked instead)
  if (wordCount(term) > MAX_TYPED_WORDS) return makeExercise('en-es', term, terms);
  return { id, kind: 'type', term, prompt: term.english, answer: term.spanish };
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
