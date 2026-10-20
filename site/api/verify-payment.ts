import { createHmac, timingSafeEqual } from 'node:crypto';
import { readBody, readString, type ApiHandler } from './_http.ts';

/**
 * POST /api/verify-payment
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Razorpay signs `order_id|payment_id` with the key secret. We recompute it here
 * and compare in constant time. This is the only thing standing between a real
 * captured payment and a browser that simply claims one succeeded — which is why
 * it happens on the server and not in the client.
 *
 * Verification proves the payment is genuine. It does NOT prove the amount: the
 * amount was fixed by `create-order` before checkout opened.
 */
const handler: ApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';
  if (!keySecret) {
    res.status(503).json({ error: 'payments_not_configured' });
    return;
  }

  const body = readBody(req.body);
  const orderId = readString(body, 'razorpay_order_id');
  const paymentId = readString(body, 'razorpay_payment_id');
  const signature = readString(body, 'razorpay_signature');

  if (!orderId || !paymentId || !signature) {
    res.status(400).json({ verified: false, error: 'missing_fields' });
    return;
  }

  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const givenBuf = Buffer.from(signature, 'utf8');
  const verified =
    expectedBuf.length === givenBuf.length && timingSafeEqual(expectedBuf, givenBuf);

  res.setHeader('Cache-Control', 'no-store');
  res.status(verified ? 200 : 400).json({
    verified,
    orderId,
    paymentId,
  });
};

export default handler;
