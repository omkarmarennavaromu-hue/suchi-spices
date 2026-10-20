/**
 * Thin wrapper around Razorpay's Checkout script.
 *
 * The script is loaded on demand the first time someone actually tries to pay —
 * it is ~100 kB and has no business slowing down the first paint of a
 * photography-led landing page.
 */

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailure {
  error?: { description?: string; reason?: string };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (payload: RazorpayFailure) => void) => void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

type RazorpayWindow = Window & { Razorpay?: RazorpayConstructor };

let loading: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  const win = window as RazorpayWindow;
  if (win.Razorpay) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(Boolean((window as RazorpayWindow).Razorpay));
    script.onerror = () => {
      loading = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loading;
}

export type CheckoutOutcome =
  | { readonly kind: 'paid'; readonly paymentId: string; readonly orderId: string; readonly signature: string }
  | { readonly kind: 'dismissed' }
  | { readonly kind: 'failed'; readonly reason: string };

interface OpenCheckoutArgs {
  readonly keyId: string;
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly description: string;
  readonly accent: string;
  readonly prefill: { name?: string; email?: string };
}

export function openCheckout(args: OpenCheckoutArgs): Promise<CheckoutOutcome> {
  const RazorpayCtor = (window as RazorpayWindow).Razorpay;
  if (!RazorpayCtor) return Promise.resolve({ kind: 'failed', reason: 'Checkout failed to load.' });

  return new Promise<CheckoutOutcome>((resolve) => {
    let settled = false;
    const finish = (outcome: CheckoutOutcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };

    const checkout = new RazorpayCtor({
      key: args.keyId,
      order_id: args.orderId,
      amount: args.amount,
      currency: args.currency,
      name: 'Suchi Spices',
      description: args.description,
      image: `${window.location.origin}/favicon.svg`,
      prefill: args.prefill,
      notes: { concept: 'portfolio demo, test mode' },
      theme: { color: args.accent },
      modal: {
        ondismiss: () => finish({ kind: 'dismissed' }),
        escape: true,
        backdropclose: true,
      },
      handler: (response: RazorpaySuccess) => {
        finish({
          kind: 'paid',
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
    });

    checkout.on('payment.failed', (payload) => {
      finish({
        kind: 'failed',
        reason: payload?.error?.description ?? 'The payment did not go through.',
      });
    });

    checkout.open();
  });
}
