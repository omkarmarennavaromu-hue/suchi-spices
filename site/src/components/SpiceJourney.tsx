import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ResponsiveImage } from './ui/ResponsiveImage';
import { SectionLabel } from './ui/SectionLabel';
import type { AssetKey } from '../data/assets';

interface JourneyScene {
  asset: AssetKey;
  index: string;
  title: string;
  caption: string;
  swatch: string;
  alt: string;
}

const SCENES: readonly JourneyScene[] = [
  {
    asset: '07-spice-explosion',
    index: '01',
    title: 'Chilli, and the first heat',
    caption: 'Scarlet, sun-dried, unapologetic. The note that opens the story.',
    swatch: '#E0352B',
    alt: 'Dried red chillies, turmeric powder, coriander, cardamom and star anise exploding through the air.',
  },
  {
    asset: '08-golden-spice-world',
    index: '02',
    title: 'Turmeric, and the gold',
    caption: 'A powder cloud caught mid-collapse. Gold that stains the light it travels through.',
    swatch: '#E9A11B',
    alt: 'A sculptural cloud of golden turmeric powder surrounded by coriander, cumin and cinnamon.',
  },
  {
    asset: '09-aromatic-dark-spices',
    index: '03',
    title: 'Bark, pod and pepper',
    caption: 'Cinnamon, cardamom, clove. The quiet architecture underneath every masala.',
    swatch: '#C8A24A',
    alt: 'Cinnamon quills, green and brown cardamom, cloves, star anise and peppercorns in a dark burgundy setting.',
  },
  {
    asset: '02-hero-alternative',
    index: '04',
    title: 'The whole universe',
    caption: 'Sixteen spices in one frame — suspended, weightless, and entirely in focus.',
    swatch: '#F3E8D8',
    alt: 'A wide assortment of Indian spices suspended in a warm illuminated space.',
  },
];

interface SpiceJourneyProps {
  reducedMotion: boolean;
}

export function SpiceJourney({ reducedMotion }: SpiceJourneyProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const usePin = isDesktop && !reducedMotion;
  const root = useRef<HTMLElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);
  const counter = useRef<HTMLSpanElement | null>(null);
  const [activeScene, setActiveScene] = useState(0);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* ---------------- pinned, desktop ---------------- */
      if (usePin && pin.current) {
        const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]');
        let lastScene = -1;

        gsap.set(scenes.slice(1), { clipPath: 'inset(0% 0% 100% 0%)' });
        scenes.forEach((scene, i) => {
          gsap.set(scene.querySelector('[data-scene-img]'), { scale: i === 0 ? 1.02 : 1.16 });
        });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 3.1,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(
                scenes.length - 1,
                Math.floor(self.progress * scenes.length + 0.02),
              );
              if (i === lastScene) return;
              lastScene = i;
              setActiveScene(i);
              if (counter.current) counter.current.textContent = `0${i + 1}`;
              gsap.to('[data-tick]', {
                opacity: (_idx, target: Element) =>
                  Number((target as HTMLElement).dataset.tick) <= i ? 1 : 0.28,
                overwrite: true,
                duration: 0.35,
              });
            },
          },
        });

        for (let i = 1; i < scenes.length; i += 1) {
          const at = i - 1;
          tl.to(
            `[data-scene="${i - 1}"] [data-scene-img]`,
            { scale: 1.1, duration: 1 },
            at,
          )
            .to(
              `[data-scene="${i}"]`,
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' },
              at,
            )
            .to(`[data-scene="${i}"] [data-scene-img]`, { scale: 1.02, duration: 1 }, at);
        }

        tl.to('[data-journey-progress]', { scaleY: 1, duration: scenes.length - 1 }, 0);

        return;
      }

      /* ---------------- stacked, mobile / reduced ---------------- */
      const items = gsap.utils.toArray<HTMLElement>('[data-scene]');
      items.forEach((item) => {
        const media = item.querySelector('[data-scene-img]');
        if (reducedMotion) return;
        gsap.set(item.querySelector('[data-scene-mask]'), { clipPath: 'inset(0% 0% 100% 0%)' });
        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
          })
          .to(item.querySelector('[data-scene-mask]'), {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.inOut',
          })
          .from(media, { scale: 1.1, duration: 1.6, ease: 'power2.out' }, 0)
          .from(item.querySelector('[data-scene-cap]'), { opacity: 0, y: 16, duration: 0.7 }, 0.3);
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [usePin, reducedMotion]);

  /* ---------------- desktop ---------------- */
  if (usePin) {
    return (
      <section
        id="journey"
        ref={root}
        className="relative bg-ink"
        aria-labelledby="journey-heading"
      >
        <h2 id="journey-heading" className="sr-only">
          A scroll through the spice universe
        </h2>

        <div ref={pin} className="relative h-[100svh] w-full overflow-hidden">
          {SCENES.map((scene, i) => (
            <div
              key={scene.asset}
              data-scene={i}
              className="absolute inset-0 will-change-[clip-path]"
              aria-hidden={i !== 0}
            >
              <div data-scene-img className="absolute inset-0 will-change-transform">
                <ResponsiveImage
                  asset={scene.asset}
                  alt={scene.alt}
                  sizes="100vw"
                  priority={i === 0}
                  className="h-full w-full"
                  imgClassName="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(11,6,7,0.9)_0%,rgba(11,6,7,0.55)_34%,rgba(11,6,7,0.08)_68%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,6,7,0.92)_0%,rgba(11,6,7,0.35)_34%,transparent_66%)]" />
            </div>
          ))}

          <div className="shell pointer-events-none absolute inset-0 flex flex-col justify-between pb-8 pt-24 md:pt-28">
            <div className="flex items-start justify-between">
              <p className="label-sm text-ivory/45">02 — The journey</p>
              <p className="label-sm hidden text-ivory/35 sm:block">Scroll to travel</p>
            </div>

            <div className="relative min-h-[15rem] sm:min-h-[13rem]">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.asset}
                  data-scene-cap
                  data-cap-index={i}
                  aria-hidden={activeScene !== i}
                  className={`absolute bottom-0 left-0 max-w-[36rem] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeScene === i
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-3 opacity-0'
                  }`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="h-2 w-2"
                      style={{ backgroundColor: scene.swatch }}
                      aria-hidden="true"
                    />
                    <span className="label-sm text-ivory/50">{scene.index} / 04</span>
                  </div>
                  <p className="display text-[clamp(2rem,3.6vw,3.4rem)] text-ivory">
                    {scene.title}
                  </p>
                  <p className="mt-4 max-w-[30rem] text-[0.9375rem] leading-relaxed text-ivory/65">
                    {scene.caption}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-6">
              <p className="label-sm text-ivory/35">A universe of flavour</p>
              <div className="flex items-center gap-5">
                <span className="label-sm tabular-nums text-ivory/60">
                  <span ref={counter}>01</span> / 04
                </span>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {SCENES.map((scene, i) => (
                    <span
                      key={scene.asset}
                      data-tick={i}
                      className="h-px w-8 bg-ivory/60"
                      style={{ opacity: i === 0 ? 1 : 0.28 }}
                    />
                  ))}
                </div>
                <div className="relative h-16 w-px overflow-hidden bg-ivory/15" aria-hidden="true">
                  <span
                    data-journey-progress
                    className="absolute inset-0 origin-top scale-y-0 bg-saffron"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- mobile / reduced ---------------- */
  return (
    <section
      id="journey"
      ref={root}
      className="relative bg-ink py-16 md:py-24"
      aria-labelledby="journey-heading-m"
    >
      <div className="shell">
        <div className="flex items-center justify-between border-b border-ivory/15 pb-5">
          <SectionLabel index="02" title="The journey" />
          <p className="label-sm text-ivory/40">04 scenes</p>
        </div>
        <h2
          id="journey-heading-m"
          className="display mt-10 max-w-[14ch] text-[clamp(2.2rem,9vw,3.4rem)] text-ivory"
        >
          A universe, in four movements.
        </h2>
      </div>

      <div className="mt-10 space-y-14 md:space-y-20">
        {SCENES.map((scene) => (
          <article key={scene.asset} data-scene className="shell">
            <div data-scene-mask className="overflow-hidden">
              <div data-scene-img className="will-change-transform">
                <ResponsiveImage
                  asset={scene.asset}
                  alt={scene.alt}
                  sizes="100vw"
                  className="aspect-[4/5] w-full sm:aspect-[4/3]"
                />
              </div>
            </div>
            <div data-scene-cap className="mt-5 flex items-start justify-between gap-6">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="h-2 w-2"
                    style={{ backgroundColor: scene.swatch }}
                    aria-hidden="true"
                  />
                  <span className="label-sm text-ivory/45">{scene.index} / 04</span>
                </div>
                <h3 className="display text-[clamp(1.6rem,5.4vw,2.1rem)] text-ivory">
                  {scene.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed text-ivory/60">
                  {scene.caption}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
