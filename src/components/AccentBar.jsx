// A row of tap-to-insert keys for Spanish letters, shown under answer boxes so learners
// on a phone keyboard don't have to long-press. Accents are never required for an
// answer to be marked right; these just make it easy to type them.

const KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];

export default function AccentBar({ inputRef, value, onChange, disabled = false }) {
  function insert(char) {
    const el = inputRef?.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + char + value.slice(end));
    // put the cursor right after the new letter, and keep the keyboard open
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus({ preventScroll: true });
      el.setSelectionRange(start + 1, start + 1);
    });
  }

  return (
    <div className="accent-bar" role="group" aria-label="Spanish letters">
      {KEYS.map((char) => (
        <button
          key={char}
          type="button"
          className="accent-key"
          disabled={disabled}
          // keep focus (and the on-screen keyboard) on the answer box
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => insert(char)}
          aria-label={`Insert ${char}`}
        >
          {char}
        </button>
      ))}
    </div>
  );
}
