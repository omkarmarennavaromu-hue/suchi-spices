import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { scrollToSection } from '../hooks/useSmoothScroll';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';

interface FlavourInMotionProps {
  reducedMotion: boolean;
}

export function FlavourInMotion({ reducedMotion }: FlavourInMotionProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.set('[data-fim-mask]', { clipPath: 'inset(0% 0% 0% 100%)' });
      gsap.set('[data-fim-line]', { yPercent: 115 });

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: 'top 68%', once: true },
        })
        .to('[data-fim-mask]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
        .to('[data-fim-line]', { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09 }, 0.12)
        .from('[data-fim-block]', { scaleY: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.3)
        .from('[data-fim-copy]', { opacity: 0, y: 16, duration: 0.8 }, 0.55);

      gsap.to('[data-fim-image]', {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-fim-frame]',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // The oversized word drifts against the scroll for depth.
      gsap.fromTo(
        '[data-fim-ghost]',
        { xPercent: 4 },
        {
          xPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="motion"
      className="relative overflow-hidden bg-burgundy-deep py-20 md:py-28 lg:py-36"
      aria-labelledby="motion-heading"
    >
      <p
        data-fim-ghost
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] left-0 select-none whitespace-nowrap font-display text-[19vw] font-semibold leading-none tracking-[-0.05em] text-ivory/[0.028] will-change-transform"
      >
        Motion Motion
      </p>

      <div className="shell relative">
        <div className="flex items-center justify-between gap-6 border-b border-ivory/12 pb-5">
          <SectionLabel index="04" title="Flavour in motion" />
          <p className="label-sm hidden text-ivory/35 sm:block">Plate 13 — powder study</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <span
              data-fim-block
              className="mb-8 block h-14 w-[3px] origin-top bg-saffron"
              aria-hidden="true"
            />

            <h2
              id="motion-heading"
              className="display text-[clamp(2.4rem,6.2vw,5.2rem)] text-ivory"
            >
              <span className="line-mask">
                <span data-fim-line className="block">
                  Not just
                </span>
              </span>
              <span className="line-mask">
                <span data-fim-line className="block">
                  an ingredient.
                </span>
              </span>
              <span className="line-mask">
                <span data-fim-line className="serif-accent block text-saffron">
                  An experience.
                </span>
              </span>
            </h2>

            <p
              data-fim-copy
              className="mt-8 max-w-[34ch] text-[0.9375rem] leading-[1.75] text-ivory/60"
            >
              Ground spice behaves like pigment: it moves, it settles, it stains the air
              it travels through. We shot it at a fraction of a second to show the
              movement a kitchen feels but never sees.
            </p>

            <a
              href="#craft"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('craft');
              }}
              className="btn btn-ghost mt-9 justify-between"
              data-fim-copy
            >
              Read the craft
              <ArrowDownRight size={14} strokeWidth={1.6} />
            </a>
          </div>

          <figure data-fim-frame className="relative lg:col-span-6 lg:col-start-7">
            <div data-fim-mask className="overflow-hidden">
              <div data-fim-image className="will-change-transform">
                <ResponsiveImage
                  asset="13-abstract-spice-background"
                  alt="Scarlet and saffron spice powder swirling into sculptural ribbons against a dark background."
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[5/6] w-full lg:aspect-[4/5]"
                />
              </div>
            </div>
            <div
              data-fim-block
              className="absolute -bottom-4 -left-4 hidden h-16 w-16 origin-top bg-scarlet lg:block"
              aria-hidden="true"
            />
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-ivory/15 pt-3">
              <span className="label-sm text-ivory/40">Chilli · turmeric · time</span>
              <span className="label-sm text-ivory/25">01 / 8000 sec</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
