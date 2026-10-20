import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../shop/CartProvider';

interface CartButtonProps {
  /** `menu` renders the wide version used inside the mobile menu panel. */
  readonly variant?: 'header' | 'menu';
  readonly tabIndex?: number;
}

export function CartButton({ variant = 'header', tabIndex }: CartButtonProps) {
  const { count, openCart } = useCart();

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={openCart}
        tabIndex={tabIndex}
        className="btn btn-ghost w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag size={13} strokeWidth={1.6} />
          Basket
          {count > 0 && <span className="text-saffron">· {count}</span>}
        </span>
        <span className="label-sm text-ivory/40">
          {count > 0 ? 'View' : 'Empty'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Open basket, ${count} item${count === 1 ? '' : 's'}` : 'Open basket'}
      className="group relative inline-flex h-10 items-center gap-2 border border-ivory/20 px-3 text-ivory transition-colors duration-300 hover:border-saffron hover:text-saffron"
    >
      <ShoppingBag size={14} strokeWidth={1.6} />
      <span className="label-sm hidden sm:inline">Basket</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center bg-saffron px-1 text-[0.5625rem] font-semibold tabular-nums text-ink">
          {count}
        </span>
      )}
    </button>
  );
}
