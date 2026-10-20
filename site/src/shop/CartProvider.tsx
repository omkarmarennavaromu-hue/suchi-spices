import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { conceptPrices, conceptProductIds, type ConceptPrice } from '../data/pricing';

export const CART_STORAGE_KEY = 'suchi:cart';
const MAX_PER_LINE = 10;

export interface CartLine {
  readonly productId: string;
  readonly quantity: number;
}

export interface CartLineDetail extends CartLine {
  readonly price: ConceptPrice;
  readonly lineTotal: number;
}

interface CartState {
  readonly lines: readonly CartLine[];
  readonly detailed: readonly CartLineDetail[];
  readonly count: number;
  readonly subtotal: number;
  readonly isOpen: boolean;
  readonly lastAdded: string | null;
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartState | null>(null);

/** Drop anything that is no longer a real product, or that a stored cart made up. */
function sanitise(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: CartLine[] = [];

  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const { productId, quantity } = raw as Record<string, unknown>;
    if (typeof productId !== 'string' || !conceptProductIds.includes(productId)) continue;
    if (seen.has(productId)) continue;
    const qty =
      typeof quantity === 'number' && Number.isFinite(quantity)
        ? Math.min(MAX_PER_LINE, Math.max(1, Math.floor(quantity)))
        : 1;
    seen.add(productId);
    out.push({ productId, quantity: qty });
  }

  return out;
}

/**
 * Read the stored basket. Deliberately synchronous in the state initialiser
 * rather than in an effect: doing it in an effect means the persistence effect
 * below can fire with the empty initial value first and wipe the saved basket
 * (React StrictMode double-invokes effects, which made that reliably fatal).
 */
function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? sanitise(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota / private mode */
    }
  }, [lines]);

  const add = useCallback((productId: string, quantity = 1) => {
    if (!conceptProductIds.includes(productId)) return;
    setLines((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (!existing) return [...current, { productId, quantity: Math.min(MAX_PER_LINE, quantity) }];
      return current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity + quantity) }
          : line,
      );
    });
    setLastAdded(productId);
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(MAX_PER_LINE, Math.floor(quantity)) }
              : line,
          ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  // Clear the "just added" flag so the button label can settle back.
  useEffect(() => {
    if (!lastAdded) return;
    const timer = window.setTimeout(() => setLastAdded(null), 2400);
    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  const value = useMemo<CartState>(() => {
    const detailed = lines.flatMap<CartLineDetail>((line) => {
      const price = conceptPrices[line.productId];
      if (!price) return [];
      return [{ ...line, price, lineTotal: price.paise * line.quantity }];
    });

    return {
      lines,
      detailed,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: detailed.reduce((sum, line) => sum + line.lineTotal, 0),
      isOpen,
      lastAdded,
      add,
      remove,
      setQuantity,
      clear,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [lines, isOpen, lastAdded, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
