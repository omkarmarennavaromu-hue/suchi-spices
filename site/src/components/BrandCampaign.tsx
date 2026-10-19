import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { scrollToSection } from '../hooks/useSmoothScroll';
import { ArrowUpRight } from 'lucide-react';

interface BrandCampaignProps {
  reducedMotion: boolean;
}

export function BrandCampaign({ reducedMotion }: BrandCampaignProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        '[data-bc-image]',
        { scale: 1.16 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );

      gsap.set('[data-bc-line]', { yPercent: 115 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 58%', once: true } })
        .to('[data-bc-line]', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 })
        .from('[data-bc-meta]', { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.4);
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="campaign"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink"
      aria-labelledby="campaign-heading"
    >
      <div data-bc-image className="absolute inset-0 -z-10 will-change-transform">
        <ResponsiveImage
          asset="12-brand-still-life"
          alt="The four Suchi Spices concept pouches — red chilli, turmeric, garam masala and coriander — arranged on a dark stone plinth with whole spices at their base."
          sizes="100vw"
          className="h-full w-full"
          imgClassName="object-cover object-[45%_center]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(11,6,7,0.95)_0%,rgba(11,6,7,0.55)_38%,rgba(11,6,7,0.12)_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,6,7,0.85)_0%,rgba(11,6,7,0.45)_38%,transparent_62%)]" />

      <div className="shell relative w-full pb-12 pt-32 md:pb-16">
        <div className="flex items-start justify-between gap-6">
          <p data-bc-meta className="label-sm text-saffron">
            07 — The range
          </p>
          <p data-bc-meta className="label-sm hidden text-right text-ivory/45 sm:block">
            All four blends
            <br />
            One die-line
          </p>
        </div>

        <h2
          id="campaign-heading"
          className="display mt-10 max-w-[22ch] text-[clamp(2.6rem,8.4vw,7.6rem)] text-ivory md:mt-14"
        >
          <span className="line-mask">
            <span data-bc-line className="block">
              Bring more
            </span>
          </span>
          <span className="line-mask">
            <span data-bc-line className="block">
              flavour <span className="serif-accent text-saffron">home</span>.
            </span>
          </span>
        </h2>

        <div className="mt-10 flex flex-col gap-6 border-t border-ivory/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p data-bc-meta className="max-w-[38ch] text-[0.875rem] leading-relaxed text-ivory/55">
            Four blends built on one design system — scarlet, saffron, burgundy and
            ivory, with the same rule weight and the same gold band.
          </p>
          <a
            href="#collection"
            data-bc-meta
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('collection');
            }}
            className="btn btn-primary shrink-0 justify-between sm:justify-center"
          >
            View the collection
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </section>
  );
}
