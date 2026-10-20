import { conceptPrices } from '../src/data/pricing.ts';
import { readBody, readString, type ApiHandler } from './_http.ts';

/**
 * POST /api/create-order
 *
 * Body: { productId: string }
 *
 * The browser sends a product id and nothing else. The amount comes from the
 * server's own price table, so a tampered request can only ever order a listed
 * product at its listed price — it cannot invent a ₹1 chilli pouch.
 *
 * Returns the order id plus the publishable key id, which is what Razorpay
 * Checkout needs to open. The key secret never leaves this function.
 */
const handler: ApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID ?? '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';

  if (!keyId || !keySecret) {
    res.status(503).json({
      error: 'payments_not_configured',
      message: 'Razorpay test keys are not set on this deployment.',
    });
    return;
  }

  const productId = readString(readBody(req.body), 'productId');
  const price = conceptPrices[productId];

  if (!price) {
    res.status(400).json({ error: 'unknown_product' });
    return;
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  let upstream: Response;
  try {
    upstream = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: price.paise,
        currency: 'INR',
        // Razorpay caps receipts at 40 chars and wants them unique-ish.
        receipt: `suchi_${productId}_${Date.now().toString(36)}`.slice(0, 40),
        notes: { productId, concept: 'suchi-spices demo' },
      }),
    });
  } catch {
    res.status(502).json({ error: 'razorpay_unreachable' });
    return;
  }

  const data = (await upstream.json().catch(() => null)) as
    | { id?: string; amount?: number; currency?: string; error?: { description?: string } }
    | null;

  if (!upstream.ok || !data?.id) {
    res.status(502).json({
      error: 'order_failed',
      message: data?.error?.description ?? 'Razorpay rejected the order request.',
    });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    orderId: data.id,
    amount: data.amount ?? price.paise,
    currency: data.currency ?? 'INR',
    keyId,
    description: price.description,
    testMode: keyId.startsWith('rzp_test_'),
  });
};

export default handler;
