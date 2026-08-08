export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

export function normalizeAnswer(s) {
  return s
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, '')
    .trim();
}

function stripArticle(s) {
  return s.replace(/^(el|la|los|las|al|del)\s+/i, '').trim();
}

export function getFillBlank(term) {
  if (!term.example || !term.example.es) return null;
  let base = term.spanish.replace(/\([^)]*\)/g, '').trim();
  base = stripArticle(base);
  const alts = base
    .split('/')
    .map((a) => stripArticle(a.trim()))
    .filter(Boolean);

  const sentence = term.example.es;
  for (const alt of alts) {
    const idx = sentence.toLowerCase().indexOf(alt.toLowerCase());
    if (idx !== -1) {
      const matched = sentence.substring(idx, idx + alt.length);
      const blanked = sentence.slice(0, idx) + '_____' + sentence.slice(idx + alt.length);
      return { blanked, answer: matched, full: sentence, englishFull: term.example.en };
    }
  }
  return null;
}

// Builds a randomized set of quiz questions from a list of terms.
// Each question is either multiple-choice (translation) or fill-in-the-blank.
export function generateQuizQuestions(terms) {
  const pool = shuffle(terms);

  return pool.map((term, i) => {
    const fillBlank = getFillBlank(term);
    const useFillBlank = fillBlank && Math.random() < 0.4;

    if (useFillBlank) {
      return {
        id: `${term.spanish}-${i}`,
        type: 'fill-blank',
        term,
        prompt: fillBlank.blanked,
        promptEnglish: fillBlank.englishFull,
        answer: fillBlank.answer,
      };
    }

    const direction = Math.random() < 0.5 ? 'es-en' : 'en-es';
    const correct = direction === 'es-en' ? term.english : term.spanish;
    const distractorPool = terms.filter((t) => t.spanish !== term.spanish);
    const distractors = shuffle(distractorPool)
      .slice(0, 3)
      .map((t) => (direction === 'es-en' ? t.english : t.spanish));

    const options = shuffle([correct, ...distractors]);

    return {
      id: `${term.spanish}-${i}`,
      type: 'multiple-choice',
      term,
      direction,
      prompt: direction === 'es-en' ? term.spanish : term.english,
      options,
      answer: correct,
    };
  });
}
