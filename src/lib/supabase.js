import { createClient } from '@supabase/supabase-js';

// The URL and publishable key are designed to be public — they ship in every
// browser. Data is protected by Row Level Security policies in the database,
// not by keeping these secret. Override via VITE_* env vars if needed.
const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://jvxdsputxvqnzdntkaob.supabase.co';
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_83L8NActu22zmxQeGQc39w_LcJCLsAj';

export const supabase = createClient(url, key, {
  auth: {
    flowType: 'pkce', // returns ?code=… (not a #fragment), so it doesn't clash with the hash router
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
