import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';
import { SpiceMarquee } from './ui/SpiceMarquee';

interface ManifestoProps {
  reducedMotion: boolean;
}

export function Manifesto({ reducedMotion }: ManifestoProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-mf-line]');

      if (reducedMotion) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set('[data-mf-image]', { clipPath: 'inset(0% 0 0 0)' });
        gsap.set('[data-mf-inner]', { scale: 1 });
        gsap.set('[data-mf-body]', { opacity: 1, y: 0 });
        return;
      }

      gsap.set(lines, { yPercent: 112 });
      gsap.set('[data-mf-image]', { clipPath: 'inset(0% 0 100% 0)' });
      gsap.set('[data-mf-inner]', { scale: 1.16 });
      gsap.set('[data-mf-body]', { opacity: 0, y: 22 });

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: 'top 76%', once: true },
        })
        .to(lines, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09 })
        .to('[data-mf-image]', { clipPath: 'inset(0% 0 0% 0)', duration: 1.4, ease: 'expo.inOut' }, 0.15)
        .to('[data-mf-inner]', { scale: 1, duration: 1.9, ease: 'power2.out' }, 0.15)
        .to('[data-mf-body]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.5);

      // Interior parallax: the frame holds, the photograph drifts.
      gsap.to('[data-mf-inner]', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-mf-frame]',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <section
      id="manifesto"
      ref={root}
      className="relative z-10 -mt-[3.5vh] bg-ivory pb-0 pt-14 text-ink md:-mt-[5vh] md:pt-24"
      aria-labelledby="manifesto-heading"
    >
      <div className="shell">
        <div className="flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
          <SectionLabel index="01" title="Manifesto" tone="dark" />
          <p className="label-sm hidden text-ink/40 sm:block">A universe of flavour</p>
        </div>

        <div className="pt-12 md:pt-16">
          <h2
            id="manifesto-heading"
            className="display max-w-[19ch] text-[clamp(2.6rem,7.4vw,6.8rem)]"
          >
            <span className="line-mask">
              <span data-mf-line className="block">
                Flavour has
              </span>
            </span>
            <span className="line-mask">
              <span data-mf-line className="block">
                no <span className="serif-accent text-vermilion">boundaries</span>.
              </span>
            </span>
          </h2>

        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 pb-16 md:mt-16 lg:grid-cols-12 lg:gap-14 lg:pb-24">
          <figure data-mf-frame className="lg:col-span-7">
            <div data-mf-image className="overflow-hidden">
              <div data-mf-inner className="will-change-transform">
                <ResponsiveImage
                  asset="11-ingredients-heritage"
                  alt="Turmeric roots, coriander seeds, fresh chillies, cardamom and cinnamon arranged on terracotta and ivory surfaces in low afternoon light."
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[4/3] w-full"
                />
              </div>
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-ink/15 pt-3">
              <span className="label-sm text-ink/45">Plate 11 — Ingredients &amp; heritage</span>
              <span className="label-sm text-ink/25">Terracotta · ivory</span>
            </figcaption>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-6">
            <p
              data-mf-body
              className="serif-accent text-[clamp(1.5rem,2.3vw,2.05rem)] leading-[1.28] text-ink/85"
            >
              &ldquo;From vibrant chillies to fragrant cardamom, every spice carries a
              different colour, character and possibility.&rdquo;
            </p>
            <p data-mf-body className="mt-7 max-w-[38ch] text-[0.9375rem] leading-[1.72] text-ink/65">
              We photograph spice the way it actually behaves — in motion, in heat, in
              layers. The collection is built around sixteen whole spices and four
              blends, each one given the scale and light it deserves.
            </p>

            <dl data-mf-body className="mt-10 border-t border-ink/15">
              {[
                ['Colour', 'Scarlet · saffron · umber'],
                ['Origin of form', 'Seed · bark · pod · root'],
                ['Method', 'Tempered, bloomed, layered'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-ink/12 py-3"
                >
                  <dt className="label-sm text-ink/40">{label}</dt>
                  <dd className="text-[0.8125rem] text-ink/75">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="border-y border-ink/15">
        <SpiceMarquee tone="dark" />
      </div>
    </section>
  );
}
