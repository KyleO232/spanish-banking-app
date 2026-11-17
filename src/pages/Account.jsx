import { useState } from 'react';
import { Check, Cloud, CloudOff, LogOut, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import WeekStreak from '../components/WeekStreak.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { TRACKS, getTrackInfo } from '../data/tracks.js';
import { setTrack, useTrack } from '../utils/track.js';

// Pick the career the learner is studying Spanish for. Progress, XP and coins are shared;
// each track has its own path of lessons.
function TrackPicker() {
  const current = useTrack();
  const [justChanged, setJustChanged] = useState(false);

  function choose(id) {
    if (id === current) return;
    setTrack(id);
    setJustChanged(true);
  }

  return (
    <div className="card track-card">
      <h2>Your track</h2>
      <p className="account-lead">Choose the kind of work you want to use Spanish for.</p>
      <div className="track-list" role="radiogroup" aria-label="Career track">
        {TRACKS.map((track) => {
          const selected = track.id === current;
          return (
            <button
              key={track.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!track.available}
              className={`track-option ${selected ? 'selected' : ''}`}
              onClick={() => choose(track.id)}
            >
              <span className="track-icon">
                <track.Icon size={24} strokeWidth={2.3} />
              </span>
              <span className="track-text">
                <strong>
                  {track.title} <span className="track-es">· {track.es}</span>
                </strong>
                <span className="track-tagline">{track.available ? track.tagline : 'Coming soon'}</span>
              </span>
              {selected && <Check className="track-check" size={22} strokeWidth={3} />}
            </button>
          );
        })}
      </div>
      {justChanged && (
        <div className="track-switched">
          Switched to {getTrackInfo(current).title}.{' '}
          <Link to="/" className="link-btn">
            Go to your path
          </Link>
        </div>
      )}
    </div>
  );
}

function SignIn() {
  const { signInWithEmail, verifyCode } = useAuth();
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
            {busy ? 'Sending…' : 'Email me a sign-in link'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="account-form">
          <div className="account-sent">
            We sent a link to <strong>{email}</strong>. Open it on this device to sign in, or enter the
            code from the email below.
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
    </div>
  );
}

function SyncStatus({ status, onRetry }) {
  if (status === 'syncing') {
    return (
      <div className="sync-status">
        <RefreshCw size={16} strokeWidth={2.6} className="spin" /> Syncing…
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="sync-status error">
        <CloudOff size={16} strokeWidth={2.6} /> Couldn't sync.{' '}
        <button className="link-btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  return (
    <div className="sync-status ok">
      <Cloud size={16} strokeWidth={2.6} /> Progress saved to your account
    </div>
  );
}

function Profile() {
  const { user, isAdmin, adminPref, setAdminPref, syncStatus, retrySync, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const initial = (user.email ?? '?')[0].toUpperCase();

  return (
    <>
      <div className="card profile-card">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <div className="profile-email">{user.email}</div>
          <SyncStatus status={syncStatus} onRetry={retrySync} />
        </div>
      </div>

      {isAdmin && (
        <div className="card admin-card">
          <div className="admin-card-text">
            <h3>
              <ShieldCheck size={18} strokeWidth={2.6} /> Admin mode
            </h3>
            <div className="meta">
              Open every lesson and step without unlocking. Quizzes and roleplay won't change your
              saved progress while this is on.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={adminPref}
            aria-label="Admin mode"
            className={`switch ${adminPref ? 'on' : ''}`}
            onClick={() => setAdminPref(!adminPref)}
          >
            <span />
          </button>
        </div>
      )}

      <button
        className="btn btn-block btn-lg account-signout"
        disabled={signingOut}
        onClick={async () => {
          setSigningOut(true);
          await signOut();
          setSigningOut(false);
        }}
      >
        <LogOut size={20} strokeWidth={2.6} /> {signingOut ? 'Signing out…' : 'Sign out'}
      </button>
    </>
  );
}

export default function Account() {
  const { user, ready } = useAuth();

  return (
    <>
      <TopBar title="Profile" showBack={false} />
      <div className="main">
        <WeekStreak />

        <TrackPicker />
        {!ready ? (
          <div className="empty-state">Loading…</div>
        ) : user ? (
          <Profile />
        ) : (
          <SignIn />
        )}
      </div>
    </>
  );
}
