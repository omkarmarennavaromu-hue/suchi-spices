import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { products } from '../../data/products';
import { conceptPrices, formatINR } from '../../data/pricing';
import { useCart } from '../../shop/CartProvider';
import { useAuth } from '../../auth/AuthProvider';
import { runCheckout } from '../../lib/checkout';
import { lockScroll } from '../../hooks/useSmoothScroll';

type Phase =
  | { kind: 'idle' }
  | { kind: 'busy'; stage: 'creating' | 'opening' | 'verifying' }
  | { kind: 'paid'; paymentId: string; total: number }
  | { kind: 'error'; message: string };

const STAGE_LABEL: Record<'creating' | 'opening' | 'verifying', string> = {
  creating: 'Creating order…',
  opening: 'Opening Razorpay…',
  verifying: 'Verifying…',
};

export function CartDrawer() {
  const { detailed, count, subtotal, isOpen, closeCart, setQuantity, remove, clear } = useCart();
  const { user, signInWithGoogle, configured: authConfigured } = useAuth();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [config, setConfig] = useState<'checking' | 'enabled' | 'unavailable'>('checking');
  const panel = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    fetch('/api/payment-config', { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) =>
        setConfig(data?.enabled ? 'enabled' : 'unavailable'),
      )
      .catch(() => setConfig('unavailable'));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCart();
        return;
      }
      if (event.key !== 'Tab') return;
      const node = panel.current;
      if (!node) return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => closeBtn.current?.focus(), 80);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      lockScroll(false);
    };
  }, [isOpen, closeCart]);

  // A finished checkout resets when the drawer is reopened.
  useEffect(() => {
    if (isOpen && phase.kind === 'error') setPhase({ kind: 'idle' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pay = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setPhase({ kind: 'busy', stage: 'creating' });
    const total = subtotal;

    try {
      const result = await runCheckout(
        detailed.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        {
          profile: {
            name: (user.user_metadata?.full_name as string | undefined) ?? undefined,
            email: user.email ?? undefined,
          },
          accent: '#E9A11B',
          onStage: (stage) => setPhase({ kind: 'busy', stage }),
        },
      );

      if (result.kind === 'dismissed') {
        setPhase({ kind: 'idle' });
        return;
      }
      if (result.kind === 'failed') {
        setPhase({ kind: 'error', message: result.reason });
        return;
      }

      clear();
      setPhase({ kind: 'paid', paymentId: result.paymentId, total });
    } catch (error) {
      setPhase({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  };

  const busy = phase.kind === 'busy';
  const empty = detailed.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col border-l border-ivory/12 bg-ink-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ivory/10 px-5 py-4 md:px-7">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={14} strokeWidth={1.6} className="text-saffron" />
            <p className="label-sm text-ivory/60">
              Basket {count > 0 && <span className="text-saffron">· {count}</span>}
            </p>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={closeCart}
            aria-label="Close basket"
            className="-mr-1 inline-flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors duration-300 hover:border-saffron hover:text-saffron"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
          {phase.kind === 'paid' ? (
            <div className="border border-saffron/40 bg-saffron/5 p-5" aria-live="polite">
              <p className="label-sm flex items-center gap-2 text-saffron">
                <Check size={13} strokeWidth={2} />
                Test payment captured
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/75">
                {formatINR(phase.total)} for your basket
              </p>
              <p className="mt-2 break-all text-[0.6875rem] leading-relaxed text-ivory/40">
                Razorpay payment {phase.paymentId}
              </p>
              <p className="mt-3 border-t border-ivory/12 pt-3 text-[0.6875rem] leading-relaxed text-ivory/40">
                Test mode. No money moved, nothing ships, and no order was placed with anyone.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase({ kind: 'idle' });
                  closeCart();
                }}
                className="btn btn-ghost mt-5 w-full justify-between"
              >
                Keep browsing
                <ArrowUpRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          ) : empty ? (
            <div className="flex h-full flex-col items-start justify-center">
              <p className="label-sm text-ivory/35">Nothing here yet</p>
              <p className="serif-accent mt-3 text-[1.5rem] leading-snug text-ivory/70">
                The basket is empty.
              </p>
              <p className="mt-3 max-w-[34ch] text-[0.8125rem] leading-relaxed text-ivory/45">
                Open any product in the collection and add a pouch. Everything checked out
                here runs in Razorpay&rsquo;s test mode, so nothing is ever charged or shipped.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="btn btn-ghost mt-7 justify-between"
              >
                Back to the collection
                <ArrowUpRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ivory/10">
              {detailed.map((line) => {
                const product = products.find((item) => item.id === line.productId);
                const name = product?.name ?? line.productId;
                return (
                  <li key={line.productId} className="py-5 first:pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="display text-[1.0625rem] leading-tight text-ivory">
                          {name}
                        </p>
                        <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.18em] text-ivory/35">
                          {line.price.weight} pouch
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.productId)}
                        aria-label={`Remove ${name} from basket`}
                        className="mt-1 shrink-0 text-ivory/35 transition-colors hover:text-red-300"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center border border-ivory/20">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label={`Decrease ${name} quantity`}
                          className="inline-flex h-9 w-9 items-center justify-center text-ivory/70 transition-colors hover:text-saffron"
                        >
                          <Minus size={12} strokeWidth={2} />
                        </button>
                        <span
                          className="w-9 text-center text-[0.8125rem] tabular-nums text-ivory"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label={`Increase ${name} quantity`}
                          className="inline-flex h-9 w-9 items-center justify-center text-ivory/70 transition-colors hover:text-saffron"
                        >
                          <Plus size={12} strokeWidth={2} />
                        </button>
                      </div>
                      <p className="text-[0.9375rem] tabular-nums text-ivory">
                        {formatINR(line.lineTotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!empty && phase.kind !== 'paid' && (
          <div className="border-t border-ivory/10 px-5 py-5 md:px-7">
            <div className="flex items-baseline justify-between">
              <p className="label-sm text-ivory/45">Subtotal</p>
              <p className="display text-[1.5rem] tabular-nums text-ivory">
                {formatINR(subtotal)}
              </p>
            </div>
            <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-ivory/35">
              Concept pricing · Razorpay test mode · nothing ships
            </p>

            <button
              type="button"
              onClick={pay}
              disabled={busy || config === 'unavailable' || (!user && !authConfigured)}
              aria-busy={busy}
              className={`btn btn-primary mt-4 w-full justify-between ${
                busy || config === 'unavailable' ? 'cursor-not-allowed opacity-45' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                {busy && <Loader2 size={12} strokeWidth={2} className="animate-spin" />}
                {busy
                  ? STAGE_LABEL[phase.stage]
                  : config === 'unavailable'
                    ? 'Test payments not configured'
                    : !user
                      ? `Sign in to pay · ${formatINR(subtotal)}`
                      : `Pay ${formatINR(subtotal)} · test mode`}
              </span>
              {!busy && <ArrowUpRight size={14} strokeWidth={1.6} />}
            </button>

            {phase.kind === 'error' && (
              <p className="mt-3 text-[0.75rem] leading-relaxed text-red-300/80" role="alert">
                {phase.message}
              </p>
            )}

            {config === 'unavailable' && (
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-ivory/40">
                Razorpay test keys have not been added to this deployment yet.
              </p>
            )}

            {!user && config !== 'unavailable' && (
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-ivory/40">
                Checkout needs an account so the test payment has a name to it. Your basket
                is kept while you sign in.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Small helper so the drawer can show a price without importing the table twice. */
export const priceFor = (productId: string) => conceptPrices[productId];
