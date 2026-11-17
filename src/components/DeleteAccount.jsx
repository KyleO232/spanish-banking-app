import { useState } from 'react';
import { Trash2 } from 'lucide-react';

// Permanent account deletion (required by the app stores for any app with accounts).
// Two steps: a button, then a confirmation panel that needs the word DELETE typed in.
// `onDelete` does the deleting and throws on failure; `onDeleted` runs after it worked.

const WORD = 'DELETE';

export default function DeleteAccount({ onDelete, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ready = typed.trim().toUpperCase() === WORD;

  function close() {
    setOpen(false);
    setTyped('');
    setError('');
  }

  async function confirm(e) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      await onDelete();
      onDeleted?.();
    } catch (err) {
      setError(
        err?.code === '42883' || err?.code === 'PGRST202'
          ? 'Account deletion is not available right now. Please try again later.'
          : 'We could not delete your account. Check your connection and try again.'
      );
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-block delete-account-open" onClick={() => setOpen(true)}>
        <Trash2 size={18} strokeWidth={2.6} /> Delete account
      </button>
    );
  }

  return (
    <form className="card delete-card" onSubmit={confirm}>
      <h3>Delete your account?</h3>
      <p>
        This permanently deletes your account from our servers: your email address, your progress, XP, coins and
        outfits. It cannot be undone. Progress saved on this device is cleared too.
      </p>
      <label className="delete-label" htmlFor="delete-confirm">
        Type <strong>{WORD}</strong> to confirm
      </label>
      <input
        id="delete-confirm"
        className="quiz-fill-input"
        type="text"
        value={typed}
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        disabled={busy}
        onChange={(e) => setTyped(e.target.value)}
      />
      {error && <div className="account-error">{error}</div>}
      <div className="delete-actions">
        <button type="button" className="btn" disabled={busy} onClick={close}>
          Cancel
        </button>
        <button type="submit" className="btn btn-danger" disabled={!ready || busy}>
          {busy ? 'Deleting…' : 'Delete everything'}
        </button>
      </div>
    </form>
  );
}
