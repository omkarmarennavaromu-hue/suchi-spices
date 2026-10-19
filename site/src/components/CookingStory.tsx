import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';

interface CookingStoryProps {
  reducedMotion: boolean;
}

export function CookingStory({ reducedMotion }: CookingStoryProps) {
  const root = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.set('[data-ck-mask]', { clipPath: 'inset(12% 12% 12% 12%)' });
      gsap.set('[data-ck-line]', { yPercent: 115 });

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 74%', once: true } })
        .to('[data-ck-mask]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
        .to('[data-ck-line]', { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0.1)
        .from('[data-ck-body]', { opacity: 0, y: 20, duration: 0.9, stagger: 0.08 }, 0.35);

      gsap.to('[data-ck-image]', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-ck-frame]',
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
      ref={root}
      id="cooking"
      className="relative bg-ivory py-20 text-ink md:py-28 lg:py-32"
      aria-labelledby="cooking-heading"
    >
      <div className="shell">
        <div className="flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
          <SectionLabel index="05" title="The art of Indian cooking" tone="dark" />
          <p className="label-sm hidden text-ink/40 sm:block">Plate 10 — the tarka</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <figure data-ck-frame className="lg:col-span-7">
            <div data-ck-mask className="overflow-hidden">
              <div data-ck-image className="will-change-transform">
                <ResponsiveImage
                  asset="10-indian-cooking"
                  alt="A cast-iron kadai of cumin, mustard seed and curry leaves tempering in ghee, with steam rising through warm window light in a contemporary Indian kitchen."
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[5/4]"
                />
              </div>
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-ink/15 pt-3">
              <span className="label-sm text-ink/45">Temper · ghee · thirty seconds</span>
              <span className="label-sm text-ink/25">Natural light</span>
            </figcaption>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <h2
              id="cooking-heading"
              className="display text-[clamp(2.2rem,5vw,4.1rem)]"
            >
              <span className="line-mask">
                <span data-ck-line className="block">
                  Everyday
                </span>
              </span>
              <span className="line-mask">
                <span data-ck-line className="block">
                  cooking,
                </span>
              </span>
              <span className="line-mask">
                <span data-ck-line className="serif-accent block text-vermilion">
                  transformed.
                </span>
              </span>
            </h2>

            <p data-ck-body className="mt-7 text-[0.9375rem] leading-[1.75] text-ink/70">
              The difference between a good dish and a memorable one is usually thirty
              seconds: whole spices hitting hot fat, blooming before anything wet joins
              them.
            </p>
            <p data-ck-body className="mt-4 text-[0.9375rem] leading-[1.75] text-ink/62">
              Our blends are built for that moment — ground coarse enough to survive it,
              fine enough to disappear into the sauce. Nothing in the collection is
              designed to be sprinkled at the table in place of cooking.
            </p>

            <ol data-ck-body className="mt-10 border-t border-ink/15">
              {[
                ['01', 'Temper', 'Whole spices, hot fat, thirty seconds'],
                ['02', 'Bloom', 'Ground spices, low heat, until the oil colours'],
                ['03', 'Layer', 'Finish with garam masala, off the heat'],
              ].map(([n, title, copy]) => (
                <li
                  key={n}
                  className="grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-b border-ink/12 py-4"
                >
                  <span className="label-sm text-vermilion">{n}</span>
                  <div>
                    <p className="font-display text-[0.9375rem] font-medium tracking-[-0.01em]">
                      {title}
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-ink/55">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
