import { useState } from 'react';
import { Flame, Minus, Plus, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import CoinIcon from './CoinIcon.jsx';
import { adminAdjust, getStats, getWallet, resetProgress } from '../utils/progress.js';

// Shown only to verified admins (admin mode on). Each box edits the real value.
const BOXES = [
  { kind: 'streak', label: 'Streak', step: 1, icon: <Flame size={20} strokeWidth={2.6} fill="currentColor" /> },
  { kind: 'xp', label: 'XP', step: 50, icon: <Zap size={20} strokeWidth={2.6} fill="currentColor" /> },
  { kind: 'coins', label: 'Coins', step: 50, icon: <CoinIcon size={20} /> },
];

export default function AdminTools({ onChange }) {
  const [, setTick] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const stats = getStats();
  const values = { streak: stats.streak, xp: stats.xp, coins: getWallet().balance };

  function adjust(kind, delta) {
    adminAdjust(kind, delta);
    setTick((n) => n + 1);
    onChange();
  }

  function reset() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetProgress();
    setConfirming(false);
    onChange();
  }

  return (
    <section className="admin-tools" aria-label="Admin tools">
      <div className="admin-tools-head">
        <ShieldCheck size={16} strokeWidth={2.6} /> Admin tools
        <span>edits your real progress</span>
      </div>

      <div className="admin-stat-grid">
        {BOXES.map(({ kind, label, step, icon }) => (
          <div key={kind} className={`admin-stat ${kind}`}>
            <div className="admin-stat-top">
              {icon}
              <span className="admin-stat-value">{values[kind]}</span>
            </div>
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-buttons">
              <button
                type="button"
                aria-label={`Decrease ${label} by ${step}`}
                disabled={values[kind] <= 0}
                onClick={() => adjust(kind, -step)}
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <button type="button" aria-label={`Increase ${label} by ${step}`} onClick={() => adjust(kind, step)}>
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            <div className="admin-stat-step">±{step}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`admin-reset ${confirming ? 'confirming' : ''}`}
        onClick={reset}
        onBlur={() => setConfirming(false)}
      >
        <RotateCcw size={15} strokeWidth={2.8} />
        {confirming ? 'Tap again to erase ALL progress, coins and outfits' : 'Reset progress'}
      </button>
    </section>
  );
}
