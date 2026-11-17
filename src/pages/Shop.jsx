import { useEffect, useRef, useState } from 'react';
import { Check, Lock, ShieldCheck, Zap } from 'lucide-react';
import CoinIcon from '../components/CoinIcon.jsx';
import Monedita from '../components/Monedita.jsx';
import Confetti from '../components/Confetti.jsx';
import { SLOTS, SLOT_LABELS, getItem, itemsForSlot, previewLook } from '../data/wardrobe.js';
import { titleFor } from '../data/titles.js';
import { buyItem, equipItem, getEquipped, getStats, getWallet, getWardrobe } from '../utils/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { getTrackInfo } from '../data/tracks.js';
import { useTrack } from '../utils/track.js';

function readState() {
  return { wardrobe: getWardrobe(), wallet: getWallet(), equipped: getEquipped(), xp: getStats().xp };
}

export default function Shop() {
  const { adminOn } = useAuth();
  const trackId = useTrack();
  const mascotName = getTrackInfo(trackId).mascot.name;
  const [state, setState] = useState(readState);
  const [slot, setSlot] = useState('hat');
  const [preview, setPreview] = useState({}); // items being tried on (not owned/saved)
  const [cheer, setCheer] = useState(0); // bumps to retrigger the celebration
  const [message, setMessage] = useState('');
  const cheerTimer = useRef(null);

  useEffect(() => () => clearTimeout(cheerTimer.current), []);

  const { wardrobe, wallet, equipped, xp } = state;
  const title = titleFor(xp, trackId);
  const worn = previewLook(equipped, preview);
  const trying = Object.values(preview).map((id) => getItem(id)?.es);

  function refresh() {
    setState(readState());
  }

  function celebrate(text) {
    setMessage(text);
    setCheer((n) => n + 1);
    clearTimeout(cheerTimer.current);
    cheerTimer.current = setTimeout(() => setMessage(''), 2600);
  }

  function tryOn(item) {
    setPreview((p) => (p[item.slot] === item.id ? withoutSlot(p, item.slot) : { ...p, [item.slot]: item.id }));
  }

  function buy(item) {
    const result = buyItem(item.id);
    if (result.ok) {
      setPreview(withoutSlot(preview, item.slot));
      celebrate(`¡Nuevo! ${item.es}`);
    }
    refresh();
  }

  // a worn costume covers the other items, so they only count as "worn" when no costume is on
  const isWearing = (item) =>
    equipped[item.slot] === item.id && (item.slot === 'costume' || !equipped.costume);

  function toggleEquip(item) {
    const isOn = isWearing(item);
    equipItem(item.slot, isOn ? null : item.id);
    setPreview(withoutSlot(preview, item.slot));
    refresh();
  }

  return (
    <>
      <div className="topbar topbar-home">
        <div className="topbar-titles">
          <h1>Tienda</h1>
          <div className="subtitle">Dress up {mascotName}</div>
        </div>
        <div className="stat-chips">
          <span className="stat-chip coins" title="Coins to spend">
            <CoinIcon size={18} />
            {wallet.balance}
          </span>
        </div>
      </div>

      <div className="main shop">
        {adminOn && (
          <div className="shop-admin">
            <ShieldCheck size={16} strokeWidth={2.6} /> Admin preview — try anything on; buying is off.
          </div>
        )}

        <div className="card shop-hero">
          {cheer > 0 && message && <Confetti key={cheer} count={36} />}
          <div className="shop-stage">
            <Monedita key={cheer} mood={cheer > 0 && message ? 'cheer' : 'idle'} size={150} outfit={worn} />
          </div>
          <div className="shop-message" aria-live="polite">
            {message || (trying.length > 0 ? `Probándote: ${trying.join(' + ')}` : ' ')}
          </div>

          <div className="shop-rank">
            <span className="shop-title">
              {title.es} <small>{title.en}</small>
            </span>
            <div className="shop-xp">
              <Zap size={14} strokeWidth={2.8} fill="currentColor" />
              {title.next ? (
                <span>
                  {xp} / {title.next.xp} XP to {title.next.es}
                </span>
              ) : (
                <span>{xp} XP · top title!</span>
              )}
            </div>
            <div className="shop-xp-bar" aria-hidden="true">
              <div style={{ width: `${Math.round(title.progress * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="chip-row shop-tabs" role="tablist">
          {SLOTS.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={slot === s}
              className={`chip ${slot === s ? 'active' : ''}`}
              onClick={() => setSlot(s)}
            >
              {SLOT_LABELS[s].es} <small>{SLOT_LABELS[s].en}</small>
            </button>
          ))}
        </div>

        <div className="shop-grid">
          {itemsForSlot(slot).map((item) => {
            const owned = wardrobe.owned.includes(item.id);
            const wearing = isWearing(item);
            const affordable = wallet.balance >= item.price;
            const trial = preview[item.slot] === item.id;

            return (
              <div
                key={item.id}
                className={`shop-card ${owned ? 'owned' : ''} ${wearing ? 'wearing' : ''} ${trial ? 'trial' : ''}`}
              >
                <button
                  type="button"
                  className="shop-thumb"
                  onClick={() => tryOn(item)}
                  aria-label={`Try on ${item.en}`}
                >
                  <Monedita size={78} outfit={{ [item.slot]: item.id }} still />
                </button>
                <div className="shop-name">{item.es}</div>
                <div className="shop-name-en">{item.en}</div>

                {owned ? (
                  <button
                    type="button"
                    className={`shop-action ${wearing ? 'on' : ''}`}
                    disabled={adminOn}
                    onClick={() => toggleEquip(item)}
                  >
                    {wearing ? (
                      <>
                        <Check size={15} strokeWidth={3} /> Wearing
                      </>
                    ) : (
                      'Wear'
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`shop-action buy ${affordable && !adminOn ? '' : 'poor'}`}
                    disabled={!affordable || adminOn}
                    onClick={() => buy(item)}
                  >
                    {affordable && !adminOn ? <CoinIcon size={15} strokeWidth={2.8} /> : <Lock size={14} strokeWidth={2.8} />}
                    {item.price}
                  </button>
                )}
                {!owned && !affordable && !adminOn && (
                  <div className="shop-need">{item.price - wallet.balance} more coins</div>
                )}
              </div>
            );
          })}
        </div>

        <p className="shop-hint">
          Earn coins by finishing quizzes and roleplays: 3 per correct answer, plus bonuses for a perfect score and
          for completing a lesson for the first time.
        </p>
      </div>
    </>
  );
}

function withoutSlot(obj, slot) {
  const copy = { ...obj };
  delete copy[slot];
  return copy;
}
