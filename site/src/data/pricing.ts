/**
 * Canonical concept pricing.
 *
 * This file is imported by BOTH the browser bundle and the serverless
 * functions in `api/`. The server is the authority: it looks the price up here
 * and never trusts an amount sent by the browser. Anything a client sends is
 * treated as a product *id* only.
 *
 * These prices are invented for a portfolio demonstration. Nothing is real.
 */
export interface ConceptPrice {
  /** Amount in paise (₹1 = 100 paise). Razorpay only accepts integers. */
  readonly paise: number;
  /** Net weight shown next to the price. */
  readonly weight: string;
  /** Long form used as the Razorpay order description. */
  readonly description: string;
}

export const conceptPrices: Readonly<Record<string, ConceptPrice>> = {
  'red-chilli': {
    paise: 48_000,
    weight: '100 g',
    description: 'Red Chilli Powder · 100 g · concept product',
  },
  turmeric: {
    paise: 42_000,
    weight: '100 g',
    description: 'Turmeric Powder · 100 g · concept product',
  },
  'garam-masala': {
    paise: 56_000,
    weight: '100 g',
    description: 'Garam Masala · 100 g · concept product',
  },
  coriander: {
    paise: 38_000,
    weight: '100 g',
    description: 'Coriander Powder · 100 g · concept product',
  },
};

export const conceptProductIds: readonly string[] = Object.keys(conceptPrices);

/** ₹480 — no decimals, because every concept price is a whole rupee amount. */
export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}
