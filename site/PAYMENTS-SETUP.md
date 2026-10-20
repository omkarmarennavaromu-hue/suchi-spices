# Razorpay test payments — setup

**Status: built and tested. Waiting on two strings from your Razorpay account.**

The button is already on every product modal. Until the keys are added it reads
*"Test payments not configured"* and nothing else on the site changes. Paste two
values and it becomes live — on localhost and on `suchi-spices.vercel.app`.

---

## First: you do not need any documents

This is the thing that worries everyone, so to be clear:

| | Test mode | Live mode |
|---|---|---|
| PAN card | ❌ not needed | ✅ needed |
| Bank account proof | ❌ not needed | ✅ needed |
| GST number | ❌ not needed | ✅ needed |
| Address / business proof | ❌ not needed | ✅ needed |
| Signup details | email + phone only | full KYC |
| Money moves | **no** | yes |

**Test mode needs an email address and a phone number. That is all.** You can
sign up, generate test keys, and take "payments" within a couple of minutes. The
only thing you cannot do is accept real money — which is exactly what you asked
for.

---

## Step 1 — Get test keys (no documents, ~3 minutes)

1. Go to <https://dashboard.razorpay.com/signup>
2. Sign up with your **email** and **phone number**. Verify the phone with the
   OTP. Skip anything that asks for a business name or documents.
3. Your dashboard opens in **Test Mode** by default. Look at the **top of the
   page**: there is a toggle switch that says **Test Mode**. It must be **ON**
   (usually the switch is on the left side, next to "Test Mode").
   - If it says "Live Mode", click the toggle to switch back. You cannot get
     useful keys in live mode without KYC.
4. In the left sidebar go to **Account & Settings** → **API Keys**.
5. Click **Generate Test Key**. (If you see "Regenerate Test Key", you already
   have one — click that instead.)
6. A box appears with two values. **The secret is shown only once.**
   - **Key Id** — starts with `rzp_test_` … this is public-ish, it goes to the browser
   - **Key Secret** — a long random string … this must stay server-side

   Copy both somewhere safe before closing the box. If you lose the secret, just
   click **Regenerate Test Key** and copy the new pair.

> ⚠️ Do **not** turn on Live Mode and use live keys (`rzp_live_…`). The site says
> "test mode" everywhere. Real keys would charge a real card.

---

## Step 2 — Paste them in (I can do this part for you)

Send me the two values and I will add them to Vercel and redeploy. If you would
rather do it yourself:

**On Vercel** — <https://vercel.com> → your `suchi-spices` project →
**Settings** → **Environment Variables** → add two entries:

| Name | Value |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_…` (your Key Id) |
| `RAZORPAY_KEY_SECRET` | the long secret |

For each one, tick **Production**, **Preview** and **Development**. Then go to
**Deployments** → the newest one → **⋯** menu → **Redeploy**.

> **Redeploying is not optional.** Environment variables are read when a build
> runs. Adding them does nothing to a site that is already built.

**On your own machine**, if you want to test locally, put the same two lines in
`site/.env.local` (that file is git-ignored and never uploaded):

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Note there is no `VITE_` in front of these. That is deliberate — see
"How it works" below.

---

## Step 3 — Test a payment

1. Open <https://suchi-spices.vercel.app>, scroll to **Collection**, open any
   product.
2. Click the yellow **Pay ₹— · test mode** button.
   - If you are not signed in it says **Sign in to buy · ₹—** and sends you
     through Google first, then reopens the same product.
3. Razorpay's checkout opens. It is the **real** Razorpay checkout — the same one
   live merchants use.
4. Pay with these official test details:

   | Field | Value |
   |---|---|
   | Card number | `4111 1111 1111 1111` |
   | Expiry | any future date, e.g. `12/34` |
   | CVV | any 3 digits, e.g. `123` |
   | OTP (if asked) | `1234` |
   | UPI (if you pick UPI) | `success@razorpay` |

5. You should land back on the product with a **"Test payment captured"** panel
   showing a Razorpay payment id.
6. Confirm it in the dashboard: **Transactions** → **Payments** in Test Mode. The
   payment is there with the ₹560 (or whatever) amount.

Things to try that should *not* work:

- Card `4000 0000 0000 0002` → declined. You should see a red error inside the
  checkout and no "captured" panel.
- Editing the price in the page's HTML → the amount charged does not change,
  because the server decides it. (See below.)

---

## How it works, and why it is built this way

```
browser                Vercel function                 Razorpay
───────                ───────────────                 ────────
click Pay
   │  POST /api/create-order {productId}
   ├──────────────────►  looks up the price
   │                     in its OWN table
   │                     calls Razorpay orders API ──►  creates order
   │  ◄── {orderId, keyId, amount}                     (amount fixed here)
   opens Checkout
   │  user pays ────────────────────────────────────────►  payment captured
   │  ◄── {payment_id, order_id, signature}
   │  POST /api/verify-payment
   ├──────────────────►  HMAC-SHA256 of
   │                     "order_id|payment_id"
   │                     compared with the secret
   │  ◄── {verified: true}
shows the receipt
```

Three decisions worth knowing about:

**1. The browser never sends a price.** It sends `{ productId: "garam-masala" }`.
The server looks that id up in `src/data/pricing.ts` and uses *its own* number.
So even if someone opens devtools and rewrites the page, they cannot buy a ₹560
pouch for ₹1 — the order is created server-side at the real amount.

**2. The key secret never reaches the browser.** That is why these variables have
no `VITE_` prefix: Vite inlines every `VITE_*` variable into the JavaScript it
ships, and a secret in a public bundle is not a secret. `RAZORPAY_KEY_SECRET` only
exists inside the functions in `api/`.

**3. A payment is only called successful after the server checks the signature.**
Razorpay signs `order_id|payment_id` with your key secret. The browser is not
trusted to report success — `api/verify-payment.ts` recomputes the signature in
constant time and compares. A page that simply claims "paid" gets nothing.

| File | Role |
|---|---|
| `src/data/pricing.ts` | The four concept prices. Imported by both the browser and the server; the server is the authority. |
| `api/create-order.ts` | Creates the Razorpay order at the server-side price, returns the order id + publishable key id. |
| `api/verify-payment.ts` | HMAC signature check. |
| `api/payment-config.ts` | Tells the page whether keys exist, so the button can say "not configured" instead of failing when clicked. |
| `src/lib/razorpay.ts` | Loads Razorpay's Checkout script on demand and wraps its callbacks in a promise. |
| `src/components/ui/BuyButton.tsx` | The button and its five states: checking / not configured / signed out / paying / captured / error. |
| `vite.config.ts` | Dev-only middleware that serves `api/` locally. Vercel ignores it and runs the real functions. |

---

## What I actually verified, and what I could not

Verified locally against the real Razorpay API and the real Checkout script:

- `GET /api/payment-config` → `{enabled:false}` with no keys, `{enabled:true,testMode:true}` with keys.
- `POST /api/create-order` with **invalid** credentials → Razorpay's own reply,
  HTTP 502, message *"Authentication failed"*. This proves the request genuinely
  reaches Razorpay and is rejected by them, not by our code.
- `POST /api/create-order` with an unknown product id → `400 unknown_product`,
  even when the request also supplied a fake `amount: 1`. The amount is ignored.
- `POST /api/verify-payment` with a correctly signed payload → `{verified:true}`.
  With one altered character → `{verified:false}`, HTTP 400.
- In the browser: button reads **Sign in to buy · ₹560** when signed out and
  **Pay ₹560 · test mode** when signed in; the bad-credential path surfaces
  "Authentication failed" inline; Razorpay's Checkout iframe really loads
  (`https://api.razorpay.com/v1/checkout/public`).
- `tsc` clean, production build clean.

**Not verified — and I cannot verify it from here:** completing a real test
payment, because it needs a working order, which needs your keys. The full
round trip (checkout → success callback → signature verify → receipt panel) is
built and unit-tested at the seam, but the middle of it has not been exercised
end to end. Run Step 3 and tell me if anything looks wrong.

Also still untested on this site, as before: Safari and Firefox (headless
Chromium only).

---

## Honest limits

- **Test mode only.** As configured, this cannot take real money. That is
  deliberate, and it matches the "concept" labelling on the rest of the site.
- **No order record is stored.** A successful payment shows a receipt on screen
  and that is all. There is no database of orders, no email confirmation, no
  stock decrement, no shipping calculation. Adding those is a real feature, not
  a tweak.
- **Amounts are fixed per product.** No quantities, no basket, no discount codes,
  no tax lines. One product per payment.
- **The prices are invented.** ₹480 / ₹420 / ₹560 / ₹380 for 100 g are
  plausible-looking figures chosen for the demo, not market research.
