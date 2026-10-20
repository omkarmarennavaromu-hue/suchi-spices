import { conceptPrices } from '../src/data/pricing.ts';
import { readBody, readString, type ApiHandler } from './_http.ts';

/**
 * POST /api/create-order
 *
 * Accepts either shape:
 *   { productId: "garam-masala" }
 *   { items: [{ productId: "garam-masala", quantity: 2 }, ...] }
 *
 * Prices come from the server's own table and quantities are clamped, so a
 * tampered request can only ever order listed products at their listed prices.
 * Nothing the browser sends about money is used.
 */
const MAX_QUANTITY = 10;
const MAX_LINES = 10;

interface ResolvedLine {
  productId: string;
  quantity: number;
  paise: number;
}

function resolveLines(body: unknown): ResolvedLine[] | null {
  const payload = readBody(body) as Record<string, unknown>;

  // Single-product shape.
  if (typeof payload.productId === 'string') {
    const productId = readString(payload, 'productId');
    const price = conceptPrices[productId];
    if (!price) return null;
    return [{ productId, quantity: 1, paise: price.paise }];
  }

  // Basket shape.
  if (!Array.isArray(payload.items)) return null;

  const seen = new Set<string>();
  const lines: ResolvedLine[] = [];

  for (const raw of payload.items.slice(0, MAX_LINES)) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = raw as Record<string, unknown>;
    if (typeof entry.productId !== 'string') continue;

    const productId = entry.productId.trim();
    const price = conceptPrices[productId];
    if (!price || seen.has(productId)) continue;

    const rawQty = typeof entry.quantity === 'number' ? entry.quantity : 1;
    const quantity = Number.isFinite(rawQty)
      ? Math.min(MAX_QUANTITY, Math.max(1, Math.floor(rawQty)))
      : 1;

    seen.add(productId);
    lines.push({ productId, quantity, paise: price.paise });
  }

  if (!lines.length) return null;

  // Razorpay requires a positive integer number of paise, so round off any
  // stray float before it reaches them.
  const total = lines.reduce((sum, line) => sum + line.quantity * line.paise, 0);
  if (!Number.isInteger(total) || total < 100) return null;

  return lines;
}

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

  const lines = resolveLines(req.body);

  if (!lines) {
    res.status(400).json({ error: 'unknown_product' });
    return;
  }

  const amount = lines.reduce((sum, line) => sum + line.quantity * line.paise, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const description =
    lines.length === 1
      ? conceptPrices[lines[0].productId]?.description ?? 'Suchi Spices concept product'
      : `Suchi Spices · ${itemCount} pouch${itemCount === 1 ? '' : 'es'} (concept)`;

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
        amount,
        currency: 'INR',
        // Razorpay caps receipts at 40 chars.
        receipt: `suchi_${itemCount}i_${Date.now().toString(36)}`.slice(0, 40),
        notes: {
          concept: 'suchi-spices demo',
          lines: lines.map((l) => `${l.productId}x${l.quantity}`).join(',').slice(0, 240),
        },
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
    amount: data.amount ?? amount,
    currency: data.currency ?? 'INR',
    keyId,
    description,
    testMode: keyId.startsWith('rzp_test_'),
  });
};

export default handler;
