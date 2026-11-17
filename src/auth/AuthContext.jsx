import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { checkIsAdmin, deleteAccountRemote, pushProgress, syncDown } from '../utils/cloud.js';
import { clearLocalProgress, setChangeListener } from '../utils/progress.js';
import { getAdminPreference, saveAdminPreference, setAdminEffective } from '../utils/adminMode.js';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

const PUSH_DELAY_MS = 800;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPref, setAdminPrefState] = useState(getAdminPreference);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const [syncedUserId, setSyncedUserId] = useState(null);
  const [syncVersion, setSyncVersion] = useState(0);
  const [retryToken, setRetryToken] = useState(0);
  const pushTimer = useRef(null);

  const userId = session?.user?.id ?? null;
  const adminOn = isAdmin && adminPref;

  // Lock logic reads this synchronously, so set it before children render.
  setAdminEffective(adminOn);

  // --- session ---
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setReady(true);
      // tidy the one-time ?code=… left in the address bar after a magic-link sign-in
      if (event === 'SIGNED_IN' && window.location.search.includes('code=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // --- on sign-in: merge this device with the account, then check admin ---
  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setSyncedUserId(null);
      setSyncStatus('idle');
      return undefined;
    }

    let cancelled = false;
    setSyncStatus('syncing');

    (async () => {
      try {
        await syncDown(userId);
        const admin = await checkIsAdmin(userId);
        if (cancelled) return;
        setIsAdmin(admin);
        setSyncedUserId(userId);
        setSyncStatus('synced');
        setSyncVersion((v) => v + 1); // remount screens so they pick up the merged progress
      } catch {
        if (!cancelled) setSyncStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, retryToken]);

  // --- upload changes (only after the first sync, so a fresh device can't overwrite the account) ---
  useEffect(() => {
    if (!userId || syncedUserId !== userId) {
      setChangeListener(null);
      return undefined;
    }

    const push = async () => {
      try {
        await pushProgress(userId);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    };

    setChangeListener((immediate) => {
      clearTimeout(pushTimer.current);
      if (immediate) push();
      else pushTimer.current = setTimeout(push, PUSH_DELAY_MS);
    });

    return () => {
      setChangeListener(null);
      clearTimeout(pushTimer.current);
    };
  }, [userId, syncedUserId]);

  const signInWithEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` },
    });
    if (error) throw error;
  }, []);

  const verifyCode = useCallback(async (email, token) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    clearTimeout(pushTimer.current);
    if (userId && syncedUserId === userId) {
      try {
        await pushProgress(userId); // flush anything still waiting to upload
      } catch {
        // offline — the account keeps its last synced copy
      }
    }
    setChangeListener(null);
    clearLocalProgress(); // don't leave one person's progress on a shared device
    await supabase.auth.signOut();
    setSyncVersion((v) => v + 1);
  }, [userId, syncedUserId]);

  // Deletes the account for good, then leaves this device clean like a sign-out does.
  const deleteAccount = useCallback(async () => {
    clearTimeout(pushTimer.current);
    setChangeListener(null); // nothing more may upload for a user that no longer exists
    try {
      await deleteAccountRemote();
    } catch (error) {
      // it failed, so the account still exists: turn syncing back on for this session
      setSyncedUserId(null);
      setRetryToken((t) => t + 1);
      throw error;
    }
    clearLocalProgress();
    saveAdminPreference(true);
    setAdminPrefState(true);
    await supabase.auth.signOut({ scope: 'local' }); // the server session is already gone
    setSyncVersion((v) => v + 1);
  }, []);

  const setAdminPref = useCallback((on) => {
    saveAdminPreference(on);
    setAdminPrefState(on);
  }, []);

  const retrySync = useCallback(() => setRetryToken((t) => t + 1), []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      ready,
      isAdmin,
      adminOn,
      adminPref,
      setAdminPref,
      syncStatus,
      syncVersion,
      retrySync,
      signInWithEmail,
      verifyCode,
      signOut,
      deleteAccount,
    }),
    [
      session,
      ready,
      isAdmin,
      adminOn,
      adminPref,
      setAdminPref,
      syncStatus,
      syncVersion,
      retrySync,
      signInWithEmail,
      verifyCode,
      signOut,
      deleteAccount,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
