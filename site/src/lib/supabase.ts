import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase browser client.
 *
 * The URL and publishable (anon) key are *meant* to be public — every request
 * is authorised by row-level security, not by hiding the key. They are still
 * kept in Vite env vars so the same build can point at a different project
 * without a code change.
 *
 * `null` when the environment is not configured: the UI then renders a
 * disabled, clearly-labelled sign-in rather than throwing at runtime.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isAuthConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isAuthConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        // PKCE + automatic code exchange on the redirect back from Google.
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'suchi-spices-auth',
      },
    })
  : null;
