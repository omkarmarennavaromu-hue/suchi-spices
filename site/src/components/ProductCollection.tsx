import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';
import { ProductModal } from './ProductModal';
import { PENDING_PRODUCT_KEY } from './ui/BuyButton';
import { products, type Product } from '../data/products';

const PLACEMENT = [
  'lg:col-span-6 lg:col-start-1',
  'lg:col-span-4 lg:col-start-9 lg:mt-28',
  'lg:col-span-5 lg:col-start-2 lg:mt-4',
  'lg:col-span-4 lg:col-start-8 lg:mt-12',
];

interface ProductCollectionProps {
  reducedMotion: boolean;
}

export function ProductCollection({ reducedMotion }: ProductCollectionProps) {
  const root = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  // If someone tapped "Sign in to buy" and came back from Google, put the same
  // product modal back up rather than dumping them at the top of the page.
  useEffect(() => {
    let pending: string | null = null;
    try {
      pending = window.sessionStorage.getItem(PENDING_PRODUCT_KEY);
      if (pending) window.sessionStorage.removeItem(PENDING_PRODUCT_KEY);
    } catch {
      return;
    }
    if (!pending) return;
    const match = products.find((item) => item.id === pending);
    if (match) setSelected(match);
  }, []);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-product-card]');
      if (reducedMotion) return;

      cards.forEach((card, i) => {
        const frame = card.querySelector('[data-card-frame]');
        const meta = card.querySelector('[data-card-meta]');

        gsap.set(frame, { clipPath: 'inset(0% 0% 100% 0)' });
        gsap.set(meta, { opacity: 0, y: 18 });

        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: 'top 84%', once: true },
            delay: (i % 2) * 0.08,
          })
          .to(frame, { clipPath: 'inset(0% 0% 0% 0)', duration: 1.25, ease: 'expo.inOut' })
          .to(meta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.25);
      });

      // Header lines
      gsap.from('[data-collection-line]', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-collection-head]', start: 'top 82%', once: true },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  /** Restrained pointer follow — desktop pointers only. */
  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const card = event.currentTarget;
    const img = card.querySelector('[data-card-image]');
    if (!img) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, { x: x * 12, y: y * 12, duration: 0.9, ease: 'power2.out', overwrite: true });
  };

  const onLeave = (event: React.MouseEvent<HTMLElement>) => {
    const img = event.currentTarget.querySelector('[data-card-image]');
    if (img) gsap.to(img, { x: 0, y: 0, duration: 0.9, ease: 'power2.out', overwrite: true });
  };

  return (
    <section
      id="collection"
      ref={root}
      className="relative bg-ink py-20 md:py-28 lg:py-36"
      aria-labelledby="collection-heading"
    >
      <div className="shell">
        <div className="flex items-center justify-between gap-6 border-b border-ivory/15 pb-5">
          <SectionLabel index="03" title="Signature collection" />
          <p className="label-sm hidden text-ivory/40 sm:block">Concept packaging</p>
        </div>

        <div
          data-collection-head
          className="mt-12 grid grid-cols-1 items-end gap-8 md:mt-16 lg:grid-cols-12"
        >
          <h2
            id="collection-heading"
            className="display text-[clamp(2.5rem,7vw,6.2rem)] text-ivory lg:col-span-7"
          >
            <span className="line-mask">
              <span data-collection-line className="block">
                Four blends.
              </span>
            </span>
            <span className="line-mask">
              <span data-collection-line className="block">
                One <span className="serif-accent">grammar</span>.
              </span>
            </span>
          </h2>

          <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="max-w-[36ch] text-[0.9375rem] leading-[1.72] text-ivory/60">
              A chilli that leads, a turmeric that stains, a garam masala that finishes,
              a coriander that holds it all together. Same die-line, same hierarchy,
              four different arguments.
            </p>
            <p className="label-sm mt-5 text-ivory/30">
              Fictional products — portfolio demonstration
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-8">
          {products.map((product, i) => (
            <article
              key={product.id}
              data-product-card
              className={`group/product relative ${PLACEMENT[i]}`}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <button
                type="button"
                onClick={() => setSelected(product)}
                aria-haspopup="dialog"
                className="block w-full text-left"
                aria-label={`View ${product.name} — concept product details`}
              >
                <div className="relative">
                  <span
                    className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/product:scale-x-100 group-focus-visible/product:scale-x-100"
                    style={{ backgroundColor: product.accent }}
                    aria-hidden="true"
                  />
                  <div data-card-frame className="overflow-hidden">
                    <div data-card-image className="will-change-transform">
                      <ResponsiveImage
                        asset={product.image}
                        alt={`${product.name} concept packaging in a ${product.shortName.toLowerCase()}-toned studio setting.`}
                        sizes="(min-width: 1024px) 45vw, (min-width: 768px) 46vw, 92vw"
                        className="aspect-[4/5] w-full"
                        imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/product:scale-[1.045]"
                      />
                    </div>
                  </div>
                  <span
                    className="pointer-events-none absolute right-4 top-4 z-10 font-display text-[0.6875rem] tracking-[0.2em] text-ivory/70 mix-blend-difference"
                    aria-hidden="true"
                  >
                    {product.index}
                  </span>
                </div>

                <div
                  data-card-meta
                  className="mt-5 flex items-start justify-between gap-5 border-t border-ivory/15 pt-4"
                >
                  <div>
                    <h3 className="display text-[clamp(1.25rem,1.7vw,1.6rem)] text-ivory transition-colors duration-500 group-hover/product:text-ivory">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] text-ivory/45">{product.note}</p>
                  </div>
                  <span className="label-sm flex shrink-0 items-center gap-1.5 pt-2 text-ivory/55 transition-colors duration-400 group-hover/product:text-saffron">
                    View
                    <ArrowUpRight size={12} strokeWidth={1.6} />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}
