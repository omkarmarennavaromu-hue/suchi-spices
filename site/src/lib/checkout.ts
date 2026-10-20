import { loadRazorpay, openCheckout } from './razorpay';

/**
 * One place that turns "a list of things to buy" into a captured+verified
 * Razorpay payment. Both the per-product button and the basket go through here,
 * so there is only one checkout path to reason about.
 */

export interface CheckoutItem {
  readonly productId: string;
  readonly quantity: number;
}

export interface CheckoutProfile {
  readonly name?: string;
  readonly email?: string;
}

export type CheckoutResult =
  | { readonly kind: 'paid'; readonly paymentId: string; readonly orderId: string }
  | { readonly kind: 'dismissed' }
  | { readonly kind: 'failed'; readonly reason: string };

interface OrderResponse {
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  description?: string;
  message?: string;
}

interface OpenArgs {
  readonly items: readonly CheckoutItem[];
  readonly profile: CheckoutProfile;
  readonly accent: string;
  /** Called as the flow moves between stages, for the button's label. */
  readonly onStage?: (stage: 'creating' | 'opening' | 'verifying') => void;
}

export async function runCheckout(items: readonly CheckoutItem[], {
  profile,
  accent,
  onStage,
}: Omit<OpenArgs, 'items'>): Promise<CheckoutResult> {
  if (!items.length) return { kind: 'failed', reason: 'Nothing to check out.' };

  onStage?.('creating');
  const orderRes = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const order = (await orderRes.json().catch(() => null)) as OrderResponse | null;

  if (!orderRes.ok || !order?.orderId || !order.keyId) {
    return { kind: 'failed', reason: order?.message ?? 'Could not start the payment.' };
  }

  const loaded = await loadRazorpay();
  if (!loaded) {
    return {
      kind: 'failed',
      reason: 'Razorpay Checkout could not load. An ad blocker may be blocking it.',
    };
  }

  onStage?.('opening');
  const outcome = await openCheckout({
    keyId: order.keyId,
    orderId: order.orderId,
    amount: order.amount ?? 0,
    currency: order.currency ?? 'INR',
    description: order.description ?? 'Suchi Spices concept order',
    accent,
    prefill: profile,
  });

  if (outcome.kind !== 'paid') return outcome;

  onStage?.('verifying');
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
    return {
      kind: 'failed',
      reason: 'The payment went through but its signature did not verify. Nothing has been issued.',
    };
  }

  return { kind: 'paid', paymentId: outcome.paymentId, orderId: outcome.orderId };
}
