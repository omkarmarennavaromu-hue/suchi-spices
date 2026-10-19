import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { scrollToSection } from '../hooks/useSmoothScroll';
import { ArrowUpRight } from 'lucide-react';

interface FinalCTAProps {
  reducedMotion: boolean;
}

export function FinalCTA({ reducedMotion }: FinalCTAProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      // Curtain reveal: the section wipes upward into place.
      gsap.fromTo(
        '[data-cta-curtain]',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'top 62%',
            scrub: 0.5,
          },
        },
      );

      gsap.set('[data-cta-line]', { yPercent: 116 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 45%', once: true } })
        .to('[data-cta-line]', { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.1 })
        .from('[data-cta-fade]', { opacity: 0, y: 16, duration: 0.9, stagger: 0.09 }, 0.35);

      gsap.fromTo(
        '[data-cta-image]',
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
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
      id="close"
      className="relative isolate overflow-hidden bg-ink"
      aria-labelledby="cta-heading"
    >
      <div data-cta-curtain className="relative flex min-h-[88svh] items-center justify-center">
        <div data-cta-image className="absolute inset-0 -z-10 will-change-transform">
          <ResponsiveImage
            asset="15-closing-campaign"
            alt="Indian spices framing an open, saffron-lit centre — chillies, turmeric, cinnamon, star anise and peppercorns receding into deep burgundy shadow."
            sizes="100vw"
            className="h-full w-full"
            imgClassName="object-cover object-center"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 -z-10 bg-ink/45" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(233,161,27,0.14),transparent_58%)]" />

        <div className="shell relative w-full py-24 text-center">
          <p data-cta-fade className="label text-saffron">
            08 — Where it starts
          </p>

          <h2
            id="cta-heading"
            className="display mx-auto mt-8 max-w-[24ch] text-[clamp(2.5rem,7.6vw,7rem)] text-ivory"
          >
            <span className="line-mask">
              <span data-cta-line className="block">
                Your next
              </span>
            </span>
            <span className="line-mask">
              <span data-cta-line className="block">
                favourite flavour
              </span>
            </span>
            <span className="line-mask">
              <span data-cta-line className="block">
                starts <span className="serif-accent text-saffron">here</span>.
              </span>
            </span>
          </h2>

          <div
            data-cta-fade
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('collection');
              }}
              className="btn btn-primary justify-between sm:justify-center"
            >
              Revisit the collection
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
            <a
              href="#cooking"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('cooking');
              }}
              className="btn btn-ghost justify-between sm:justify-center"
            >
              Back to the kitchen
            </a>
          </div>

          <p data-cta-fade className="label-sm mx-auto mt-12 max-w-[42ch] text-ivory/60">
            Concept project — fiction: brand, packaging and copy created for a portfolio
            demonstration
          </p>
        </div>
      </div>
    </section>
  );
}
