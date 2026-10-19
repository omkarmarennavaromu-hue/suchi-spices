import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';

interface CraftSectionProps {
  reducedMotion: boolean;
}

const ZONES = [
  ['01', 'Scarlet', 'Chilli, dried and flaked'],
  ['02', 'Gold', 'Turmeric root and powder'],
  ['03', 'Earth', 'Coriander, cumin, fennel, mustard'],
  ['04', 'Shadow', 'Cinnamon, clove, star anise, pepper'],
];

export function CraftSection({ reducedMotion }: CraftSectionProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.set('[data-cr-line]', { yPercent: 114 });
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-cr-head]', start: 'top 82%', once: true } })
        .to('[data-cr-line]', { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09 });

      gsap.from('[data-cr-reveal]', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-cr-reveal]', start: 'top 88%', once: true },
      });

      gsap.fromTo(
        '[data-cr-still]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '[data-cr-still]', start: 'top 88%', once: true },
        },
      );

      // Panorama drift — a slow lateral and vertical travel inside the frame.
      gsap.fromTo(
        '[data-cr-pano-img]',
        { yPercent: -8, scale: 1.14 },
        {
          yPercent: 8,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-cr-pano]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );

      gsap.from('[data-cr-zone]', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-cr-zones]', start: 'top 92%', once: true },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="craft"
      className="relative overflow-hidden bg-ink py-20 md:py-28 lg:py-32"
      aria-labelledby="craft-heading"
    >
      <div className="shell">
        <div className="flex items-center justify-between gap-6 border-b border-ivory/15 pb-5">
          <SectionLabel index="06" title="Ingredients & craft" />
          <p className="label-sm hidden text-ivory/40 sm:block">Plates 11 &amp; 14</p>
        </div>

        <div data-cr-head className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-12">
          <h2
            id="craft-heading"
            className="display text-[clamp(2.5rem,7vw,6rem)] text-ivory lg:col-span-7"
          >
            <span className="line-mask">
              <span data-cr-line className="block">
                Aroma is a kind
              </span>
            </span>
            <span className="line-mask">
              <span data-cr-line className="block">
                of <span className="serif-accent text-saffron">memory</span>.
              </span>
            </span>
          </h2>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p data-cr-reveal className="text-[0.9375rem] leading-[1.75] text-ivory/62">
              Colour tells you what a spice will do before you taste it. Scarlet means
              heat and pigment. Saffron means earth and stain. Deep umber means warmth
              that arrives late.
            </p>
            <p data-cr-reveal className="mt-4 text-[0.9375rem] leading-[1.75] text-ivory/55">
              We keep whole spices whole for as long as possible — bark, pod, seed and
              root all hold their character far longer than powder does.
            </p>
          </div>
        </div>
      </div>

      {/* layered still life — intentionally off-centre */}
      <div className="shell mt-14 md:mt-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <figure className="lg:col-span-8 lg:col-start-5">
            <div data-cr-still className="overflow-hidden">
              <ResponsiveImage
                asset="11-ingredients-heritage"
                alt="Turmeric roots, coriander, cumin, fresh and dried chillies and cardamom laid out on terracotta and ivory."
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="aspect-[4/3] w-full"
              />
            </div>
          </figure>
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-8">
            <p
              data-cr-reveal
              aria-hidden="true"
              className="font-display text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.05em] text-ivory/12"
            >
              06
            </p>
            <p data-cr-reveal className="label-sm mt-6 text-ivory/40">
              The raw set
            </p>
            <p data-cr-reveal className="mt-4 max-w-[26ch] text-[0.875rem] leading-relaxed text-ivory/55">
              Whole roots, ridged seeds and split bark, arranged the way they arrive —
              before the grinder has any say in it.
            </p>

            <dl data-cr-reveal className="mt-8 border-t border-ivory/15">
              {[
                ['Surface', 'Terracotta'],
                ['Ground', 'Ivory plaster'],
                ['Accent', 'Aged brass'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-ivory/10 py-2.5"
                >
                  <dt className="label-sm text-ivory/30">{k}</dt>
                  <dd className="text-[0.75rem] text-ivory/60">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* panorama band */}
      <div data-cr-pano className="relative mt-16 overflow-hidden md:mt-24">
        <div className="relative h-[46vh] min-h-[260px] w-full overflow-hidden md:h-[62vh]">
          <div data-cr-pano-img className="absolute inset-0 will-change-transform">
            <ResponsiveImage
              asset="14-ingredient-panorama"
              alt="An ultra-wide arrangement of Indian spices reading left to right as a colour spectrum, from scarlet chillies through golden turmeric and earthy seeds to dark aromatic spices."
              sizes="100vw"
              className="h-full w-full"
              imgClassName="object-cover object-center"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,6,7,0.65),transparent_45%)]" />
        </div>

        <div className="shell">
          <div
            data-cr-zones
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-ivory/15 py-6 md:grid-cols-4"
          >
            {ZONES.map(([n, title, copy]) => (
              <div key={n} data-cr-zone className="border-l border-ivory/15 pl-4">
                <p className="label-sm text-saffron">{n}</p>
                <p className="mt-2 font-display text-[0.9375rem] font-medium tracking-[-0.01em] text-ivory">
                  {title}
                </p>
                <p className="mt-1 text-[0.75rem] leading-snug text-ivory/45">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
