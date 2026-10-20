import { useEffect, useRef } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { lockScroll } from '../hooks/useSmoothScroll';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { BuyButton } from './ui/BuyButton';
import { conceptPrices, formatINR } from '../data/pricing';
import type { Product } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  reducedMotion: boolean;
}

export function ProductModal({ product, onClose, reducedMotion }: ProductModalProps) {
  const panel = useRef<HTMLDivElement | null>(null);
  const backdrop = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const price = product ? conceptPrices[product.id] : undefined;

  /* open / close animation + body lock */
  useEffect(() => {
    if (!product) return;

    returnTo.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const node = panel.current;
    const fade = backdrop.current;

    if (node && fade && !reducedMotion) {
      gsap.fromTo(node, { xPercent: 3, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.72, ease: 'expo.out' });
      gsap.fromTo(fade, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(
        node.querySelectorAll('[data-modal-stagger]'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.12, ease: 'power3.out' },
      );
    }

    const focusTimer = window.setTimeout(() => closeBtn.current?.focus(), 80);

    return () => {
      window.clearTimeout(focusTimer);
      lockScroll(false);
      returnTo.current?.focus?.();
    };
  }, [product, reducedMotion]);

  /* keyboard: escape, tab trap */
  useEffect(() => {
    if (!product) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const node = panel.current;
      if (!node) return;

      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <div
        ref={backdrop}
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[68rem] flex-col overflow-y-auto border-l border-ivory/12 bg-ink-2"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ivory/10 bg-ink-2/95 px-5 py-4 backdrop-blur-sm md:px-8">
          <p className="label-sm text-ivory/45">
            Concept product · {product.index} of 04
          </p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="-mr-1 inline-flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors duration-300 hover:border-saffron hover:text-saffron"
            aria-label="Close product details"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div className="relative">
            <ResponsiveImage
              asset={product.image}
              alt={`${product.name} concept packaging, photographed in a ${product.shortName.toLowerCase()}-toned studio setting.`}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              className="aspect-[4/5] h-full w-full lg:aspect-auto lg:min-h-[34rem]"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(to top, ${product.accent}22, transparent 45%)`,
              }}
              aria-hidden="true"
            />
          </div>

          <div className="px-6 py-8 md:px-10 md:py-12">
            <div className="mb-6 flex items-center gap-3" data-modal-stagger>
              <span
                className="h-2 w-2"
                style={{ backgroundColor: product.accent }}
                aria-hidden="true"
              />
              <span className="label-sm text-ivory/45">{product.note}</span>
            </div>

            <h2
              id="product-dialog-title"
              className="display text-[clamp(2.1rem,4vw,3.4rem)] text-ivory"
              data-modal-stagger
            >
              {product.name}
            </h2>

            <p
              className="serif-accent mt-5 text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-ivory/80"
              data-modal-stagger
            >
              {product.intro}
            </p>

            <p className="mt-5 text-[0.9375rem] leading-[1.75] text-ivory/62" data-modal-stagger>
              {product.body}
            </p>

            <dl className="mt-9 border-t border-ivory/12" data-modal-stagger>
              {product.profile.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-ivory/10 py-3.5"
                >
                  <dt className="label-sm shrink-0 text-ivory/40">{row.label}</dt>
                  <dd className="text-right text-[0.8125rem] leading-snug text-ivory/75">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8" data-modal-stagger>
              <p className="label-sm mb-3 text-ivory/40">Pairs with</p>
              <div className="flex flex-wrap gap-2">
                {product.pairings.map((pair) => (
                  <span
                    key={pair}
                    className="border border-ivory/18 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-ivory/65"
                  >
                    {pair}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 overflow-hidden" data-modal-stagger>
              <ResponsiveImage
                asset={product.detailImage}
                alt={`Whole spices from the ${product.shortName.toLowerCase()} world, photographed in the Suchi campaign.`}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="aspect-[16/9] w-full"
              />
              <p className="label-sm mt-3 text-ivory/30">
                Campaign plate — {product.shortName.toLowerCase()}
              </p>
            </div>

            <div className="mt-9 border-t border-ivory/12 pt-6" data-modal-stagger>
              {price && (
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div>
                  <p className="label-sm text-ivory/40">
                    Concept price · {price.weight} pouch
                  </p>
                  <p className="display mt-2 text-[clamp(1.75rem,3vw,2.25rem)] text-ivory">
                    {formatINR(price.paise)}
                  </p>
                </div>
                <p className="label-sm border border-ivory/18 px-2.5 py-1 text-ivory/45">
                  Razorpay test mode
                </p>
              </div>
              )}

              <div className="mt-5">
                <BuyButton
                  productId={product.id}
                  productName={product.name}
                  accent={product.accent}
                />
              </div>
            </div>

            <div
              className="mt-9 flex flex-col gap-4 border-t border-ivory/12 pt-6 sm:flex-row sm:items-center sm:justify-between"
              data-modal-stagger
            >
              <p className="max-w-[34ch] text-[0.6875rem] leading-relaxed text-ivory/40">
                Fictional packaging, copy and pricing, created for a portfolio
                demonstration. Payments run in Razorpay&rsquo;s test mode — no money
                moves and nothing ships.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost justify-between whitespace-nowrap"
              >
                Back to collection
                <ArrowUpRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
