const ARTICLE = /^(el|la|los|las|al|del)\s+/i;

function stripArticle(s) {
  return s.replace(ARTICLE, '').trim();
}

function trimPunctuation(s) {
  return s
    .replace(/[\s.…¿?¡!,]+$/g, '')
    .replace(/^[\s¿¡]+/, '')
    .trim();
}

// The spellings of a vocabulary term that could appear inside a sentence.
function variantsFor(term) {
  const isPhrase = !term.example; // register phrases have no example sentence
  // drop gloss-style parentheticals like " (SSN)", but keep ones that are part of the
  // word itself, like "401(k)"
  let base = term.spanish.replace(/\s+\([^)]*\)/g, '').trim();
  let variants;

  if (isPhrase) {
    base = trimPunctuation(base);
    variants = base.includes('lo/la')
      ? [base.replace('lo/la', 'lo'), base.replace('lo/la', 'la')]
      : [base];
  } else {
    base = stripArticle(base);
    variants = base.split('/').map((alt) => stripArticle(alt.trim()));
  }

  return variants.map(trimPunctuation).filter((v) => v.length >= 4);
}

// Finds `needle` in `text` as a whole word/phrase (case-insensitive).
function findWhole(text, needle) {
  const haystack = text.toLowerCase();
  const target = needle.toLowerCase();
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(target, from);
    if (i === -1) return -1;
    const before = haystack[i - 1];
    const after = haystack[i + target.length];
    const startsClean = !before || !/\p{L}/u.test(before);
    const endsClean = !after || !/\p{L}/u.test(after);
    if (startsClean && endsClean) return i;
    from = i + 1;
  }
}

// Picks what the learner has to supply in a banker line: an explicit `blank`
// on the line if the content author set one, otherwise the longest module
// vocabulary term or phrase found in the sentence. Returns null if none.
export function buildBlank(line, terms) {
  const text = line.spanish;

  if (line.blank) {
    const i = findWhole(text, line.blank);
    if (i !== -1) return split(text, i, line.blank.length);
  }

  let best = null;
  for (const term of terms) {
    for (const variant of variantsFor(term)) {
      const i = findWhole(text, variant);
      if (i !== -1 && (!best || variant.length > best.length)) {
        best = { index: i, length: variant.length };
      }
    }
  }
  return best ? split(text, best.index, best.length) : null;
}

function split(text, index, length) {
  return {
    before: text.slice(0, index),
    answer: text.slice(index, index + length),
    after: text.slice(index + length),
  };
}

// "cargo por mantenimiento" -> "c____ p__ m___________"
export function hintFor(answer) {
  return answer
    .split(/\s+/)
    .map((w) => w[0] + '_'.repeat(Math.max(w.length - 1, 0)))
    .join(' ');
}
