import { useEffect, useRef, useState } from 'react';
import { LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth, avatarFor } from '../../auth/AuthProvider';

/** Official Google "G" mark — used only on the sign-in control. */
function GoogleMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.5 13.5 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

interface AccountChipProps {
  /** Compact variant is used inside the mobile menu panel. */
  variant?: 'nav' | 'menu';
}

/**
 * Sign-in control. Signed out it is a restrained bordered button; signed in it
 * becomes an avatar chip that opens a small account panel. Both states are real
 * HTML text so they remain readable and focusable.
 */
export function AccountChip({ variant = 'nav' }: AccountChipProps) {
  const { configured, loading, user, signInWithGoogle, signOut, error, dismissError } = useAuth();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);

  const avatar = avatarFor(user);
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Guest';
  const firstName = displayName.split(' ')[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isMenu = variant === 'menu';

  /* ---------- signed out ---------- */
  if (!user) {
    const disabled = !configured || loading;
    return (
      <div className={isMenu ? 'w-full' : ''}>
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          disabled={disabled}
          title={!configured ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign-in' : undefined}
          className={`group inline-flex items-center justify-center gap-2.5 border px-4 py-2.5 text-[0.5625rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 ${
            isMenu ? 'w-full justify-between' : ''
          } ${
            disabled
              ? 'cursor-not-allowed border-ivory/12 text-ivory/30'
              : 'border-ivory/25 text-ivory hover:border-saffron hover:text-saffron'
          }`}
        >
          <span className="inline-flex items-center gap-2.5">
            {loading ? (
              <Loader2 size={13} strokeWidth={2} className="animate-spin" aria-hidden="true" />
            ) : (
              <GoogleMark size={13} />
            )}
            {loading ? 'Checking…' : 'Sign in with Google'}
          </span>
        </button>
        {!configured && isMenu && (
          <p className="mt-2 text-[0.625rem] leading-snug text-ivory/30">
            Sign-in is not configured in this build.
          </p>
        )}
      </div>
    );
  }

  /* ---------- signed in ---------- */
  return (
    <div ref={wrap} className={`relative ${isMenu ? 'w-full' : ''}`}>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
        className={`flex items-center gap-2.5 border border-ivory/20 py-1.5 pl-1.5 pr-3 transition-colors duration-300 hover:border-saffron/60 ${
          isMenu ? 'w-full justify-between' : ''
        }`}
      >
        <span className="flex items-center gap-2.5">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              width={26}
              height={26}
              referrerPolicy="no-referrer"
              className="h-[26px] w-[26px] rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-saffron text-[0.625rem] font-semibold uppercase text-ink"
            >
              {firstName.slice(0, 1)}
            </span>
          )}
          <span className="text-[0.6875rem] font-medium tracking-[0.04em] text-ivory">
            {firstName}
          </span>
        </span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          aria-hidden="true"
          className={`text-ivory/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        ref={panel}
        role="menu"
        aria-label="Account"
        hidden={!open}
        className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 border border-ivory/15 bg-ink-2 p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
      >
        <p className="truncate text-[0.75rem] font-medium text-ivory">{displayName}</p>
        <p className="mt-0.5 truncate text-[0.6875rem] text-ivory/45">{user.email}</p>

        <div className="my-3 h-px bg-ivory/12" />

        <p className="label-sm mb-3 text-ivory/30">Concept auth · portfolio demo</p>

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            void signOut();
          }}
          className="flex w-full items-center justify-between border border-ivory/15 px-3 py-2.5 text-[0.625rem] uppercase tracking-[0.2em] text-ivory/75 transition-colors duration-300 hover:border-saffron hover:text-saffron"
        >
          Sign out
          <LogOut size={12} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      {error && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 border border-scarlet/40 bg-ink-2 p-3">
          <p className="text-[0.6875rem] leading-snug text-ivory/75">{error}</p>
          <button
            type="button"
            onClick={dismissError}
            className="mt-2 text-[0.5625rem] uppercase tracking-[0.2em] text-saffron"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export { GoogleMark };
