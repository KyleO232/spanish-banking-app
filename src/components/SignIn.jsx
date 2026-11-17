import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

// Email sign-in: the person gets an email with a link and a 6-digit code.
//
// The link only works in the same browser the request was made from. A home-screen app
// (or a native app) is a separate place from the browser the link opens in, so there the
// code is the way in, and the screen says so. `standalone` is true in that case.
export default function SignIn({ signInWithEmail, verifyCode, standalone = false, linkFailed = false }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'sent'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function sendLink(e) {
    e.preventDefault();
    if (busy || !email.trim()) return;
    setBusy(true);
    setError('');
    try {
      await signInWithEmail(email.trim());
      setStep('sent');
    } catch (err) {
      setError(err.message || 'Could not send the email. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e) {
    e.preventDefault();
    if (busy || !code.trim()) return;
    setBusy(true);
    setError('');
    try {
      await verifyCode(email.trim(), code.trim());
    } catch (err) {
      setError(err.message || 'That code did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card account-card">
      <div className="account-icon">
        <Mail size={26} strokeWidth={2.4} />
      </div>
      <h2>Save your progress</h2>
      <p className="account-lead">
        Sign in to keep your lessons, XP, and streak on every device. No password needed.
      </p>

      {linkFailed && (
        <div className="account-warning">
          That sign-in link could not sign you in here. Links only work in the same browser where you asked
          for them. Request a new email and type the 6-digit code instead.
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={sendLink} className="account-form">
          <input
            className="quiz-fill-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="you@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy || !email.trim()}>
            {busy ? 'Sending…' : standalone ? 'Email me a code' : 'Email me a sign-in link'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="account-form">
          <div className="account-sent">
            {standalone ? (
              <>
                We emailed a 6-digit code to <strong>{email}</strong>. Type it below.
                <strong className="account-sent-warning">
                  Don't tap the link in the email. It opens your browser, which is a different place from this
                  app, so it can't sign you in here.
                </strong>
              </>
            ) : (
              <>
                We sent a link to <strong>{email}</strong>. Open it on this device to sign in, or type the
                6-digit code from the email below.
              </>
            )}
            <div className="account-sent-note">
              Don't see it? Check your spam or junk folder. It can take a minute to arrive.
            </div>
          </div>
          <input
            className="quiz-fill-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            value={code}
            autoFocus={standalone}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy || !code.trim()}>
            {busy ? 'Checking…' : 'Sign in with code'}
          </button>
          <button
            type="button"
            className="link-btn account-link"
            onClick={() => {
              setStep('email');
              setCode('');
              setError('');
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {error && <div className="account-error">{error}</div>}

      <p className="account-legal-note">
        By continuing you agree to the <Link to="/terms">Terms of Use</Link> and the{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
