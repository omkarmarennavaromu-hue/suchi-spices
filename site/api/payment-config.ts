import type { ApiHandler } from './_http.ts';

/**
 * GET /api/payment-config
 *
 * Tells the browser whether Razorpay credentials exist on the server, without
 * exposing them. The client uses this to decide between a live "Buy" button and
 * an honest "not configured yet" state, so the UI never dangles.
 */
const handler: ApiHandler = (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID ?? '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    enabled: Boolean(keyId && keySecret),
    testMode: keyId.startsWith('rzp_test_'),
  });
};

export default handler;
