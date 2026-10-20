import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { conceptPrices, formatINR } from '../../data/pricing';
import { loadRazorpay, openCheckout } from '../../lib/razorpay';

/** Set before the Google redirect so the product modal can reopen afterwards. */
export const PENDING_PRODUCT_KEY = 'suchi:pending-product';

interface BuyButtonProps {
  readonly productId: string;
  readonly productName: string;
  readonly accent: string;
}

type Config = 'checking' | 'enabled' | 'unavailable';

type Phase =
  | { kind: 'idle' }
  | { kind: 'busy'; label: string }
  | { kind: 'paid'; paymentId: string }
  | { kind: 'error'; message: string };

interface CreateOrderResponse {
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  description?: string;
  message?: string;
}

export function BuyButton({ productId, productName, accent }: BuyButtonProps) {
  const { user, loading: authLoading, signInWithGoogle, configured: authConfigured } = useAuth();
  const [config, setConfig] = useState<Config>('checking');
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  const price = conceptPrices[productId];

  useEffect(() => {
    let alive = true;

    fetch('/api/payment-config', { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!alive) return;
        setConfig(data?.enabled ? 'enabled' : 'unavailable');
      })
      .catch(() => {
        if (alive) setConfig('unavailable');
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleBuy = useCallback(async () => {
    // Signed out: remember which product, send them through Google, and the
    // modal puts itself back up when they land on the page again.
    if (!user) {
      try {
        window.sessionStorage.setItem(PENDING_PRODUCT_KEY, productId);
      } catch {
        /* private mode — the modal simply won't reopen */
      }
      await signInWithGoogle();
      return;
    }

    setPhase({ kind: 'busy', label: 'Starting payment…' });

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const order = (await orderRes.json().catch(() => null)) as CreateOrderResponse | null;

      if (!orderRes.ok || !order?.orderId || !order.keyId) {
        throw new Error(order?.message ?? 'Could not start the payment.');
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error('Razorpay Checkout could not load. An ad blocker may be blocking it.');
      }

      setPhase({ kind: 'busy', label: 'Opening Razorpay…' });

      const outcome = await openCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount ?? price?.paise ?? 0,
        currency: order.currency ?? 'INR',
        description: order.description ?? productName,
        accent,
        prefill: {
          name: (user.user_metadata?.full_name as string | undefined) ?? undefined,
          email: user.email ?? undefined,
        },
      });

      if (outcome.kind === 'dismissed') {
        setPhase({ kind: 'idle' });
        return;
      }
      if (outcome.kind === 'failed') {
        throw new Error(outcome.reason);
      }

      // Razorpay says the payment is captured. Confirm the signature server-side
      // before showing anything resembling a receipt.
      setPhase({ kind: 'busy', label: 'Verifying…' });

      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: outcome.orderId,
          razorpay_payment_id: outcome.paymentId,
          razorpay_signature: outcome.signature,
        }),
      });
      const verified = (await verifyRes.json().catch(() => null)) as { verified?: boolean } | null;

      if (!verified?.verified) {
        throw new Error(
          'The payment went through but its signature did not verify. Nothing has been issued.',
        );
      }

      setPhase({ kind: 'paid', paymentId: outcome.paymentId });
    } catch (error) {
      setPhase({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  }, [user, productId, productName, accent, price, signInWithGoogle]);

  if (!price) return null;

  if (phase.kind === 'paid') {
    return (
      <div className="border border-saffron/40 bg-saffron/5 p-5" aria-live="polite">
        <p className="label-sm flex items-center gap-2 text-saffron">
          <Check size={13} strokeWidth={2} />
          Test payment captured
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/75">
          {formatINR(price.paise)} for {productName} · {price.weight}
        </p>
        <p className="mt-2 break-all text-[0.6875rem] leading-relaxed text-ivory/40">
          Razorpay payment {phase.paymentId}
        </p>
        <p className="mt-3 border-t border-ivory/12 pt-3 text-[0.6875rem] leading-relaxed text-ivory/40">
          Test mode. No money moved, nothing will ship, and no order has been placed with
          anyone. This exists to show the integration working end to end.
        </p>
        <button
          type="button"
          onClick={() => setPhase({ kind: 'idle' })}
          className="label-sm mt-4 inline-flex items-center gap-1.5 text-ivory/60 underline underline-offset-4 transition-colors hover:text-saffron"
        >
          Run it again
        </button>
      </div>
    );
  }

  const busy = phase.kind === 'busy';
  const unavailable = config === 'unavailable';
  const checking = config === 'checking' || authLoading;
  const needsSignIn = !user;

  const label = (() => {
    if (checking) return 'Checking test payments…';
    if (unavailable) return 'Test payments not configured';
    if (busy) return phase.label;
    if (needsSignIn) return `Sign in to buy · ${formatINR(price.paise)}`;
    return `Pay ${formatINR(price.paise)} · test mode`;
  })();

  const disabled = checking || unavailable || busy || (needsSignIn && !authConfigured);

  return (
    <div>
      <button
        type="button"
        onClick={handleBuy}
        disabled={disabled}
        aria-busy={busy}
        aria-live="polite"
        title={
          unavailable
            ? 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the deployment to switch this on.'
            : needsSignIn && !authConfigured
              ? 'Google sign-in is not configured in this build.'
              : undefined
        }
        className={`btn btn-ghost w-full justify-between whitespace-nowrap ${
          disabled ? 'cursor-not-allowed opacity-45' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          {busy && <Loader2 size={12} strokeWidth={2} className="animate-spin" />}
          {label}
        </span>
        {!busy && <ArrowUpRight size={14} strokeWidth={1.6} />}
      </button>

      {phase.kind === 'error' && (
        <p className="mt-3 max-w-[42ch] text-[0.75rem] leading-relaxed text-red-300/80" role="alert">
          {phase.message}
        </p>
      )}

      {unavailable && (
        <p className="mt-3 max-w-[42ch] text-[0.6875rem] leading-relaxed text-ivory/40">
          Razorpay test keys have not been added to this deployment yet. Everything else on
          this page works as normal.
        </p>
      )}

      {needsSignIn && !unavailable && !checking && (
        <p className="mt-3 max-w-[42ch] text-[0.6875rem] leading-relaxed text-ivory/40">
          Checkout needs an account so the test payment has a name to it. You will be
          returned to this product afterwards.
        </p>
      )}
    </div>
  );
}
