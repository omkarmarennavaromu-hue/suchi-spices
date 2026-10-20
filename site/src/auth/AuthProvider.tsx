import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isAuthConfigured } from '../lib/supabase';

interface AuthState {
  readonly configured: boolean;
  readonly loading: boolean;
  readonly user: User | null;
  readonly session: Session | null;
  readonly error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  dismissError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

/** Google avatars arrive as `avatar_url`; fall back to `picture`. */
const readAvatar = (user: User | null): string | null => {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const candidate = meta.avatar_url ?? meta.picture;
  return typeof candidate === 'string' ? candidate : null;
};

export const avatarFor = readAvatar;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isAuthConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    // Restores an existing session on load and picks up the redirect back
    // from Google once supabase-js has exchanged the PKCE code.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    // Strip the OAuth artefacts (`?code=` / `#access_token=`) so a refresh does
    // not replay the exchange and the URL stays copyable.
    if (/[?#].*(code|access_token|error_description)=/.test(window.location.href)) {
      const clean = window.location.pathname + window.location.search.replace(
        /[?&](code|state|error|error_description)=[^&]*/g,
        '',
      );
      window.history.replaceState({}, '', clean.replace(/[?&]$/, '') || '/');
    }

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      setError('Sign-in is not configured in this build.');
      return;
    }
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        queryParams: { access_type: 'offline', prompt: 'select_account' },
      },
    });
    if (oauthError) setError(oauthError.message);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error: outError } = await supabase.auth.signOut();
    if (outError) setError(outError.message);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      configured: isAuthConfigured,
      loading,
      user: session?.user ?? null,
      session,
      error,
      signInWithGoogle,
      signOut,
      dismissError: () => setError(null),
    }),
    [loading, session, error, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
