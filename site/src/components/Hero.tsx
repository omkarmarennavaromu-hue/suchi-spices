import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, EASE } from '../lib/gsap';
import { useIsoLayoutEffect } from '../hooks/useIsoLayoutEffect';
import { scrollToSection } from '../hooks/useSmoothScroll';
import { ResponsiveImage } from './ui/ResponsiveImage';

interface HeroProps {
  reducedMotion: boolean;
}

export function Hero({ reducedMotion }: HeroProps) {
  const section = useRef<HTMLElement | null>(null);
  const media = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoSrc, setVideoSrc] = useState('/videos/suchi-hero.mp4');
  const [poster, setPoster] = useState('/videos/suchi-hero-poster.jpg');

  useEffect(() => {
    const small = window.matchMedia('(max-width: 767px)').matches;
    if (small) {
      setVideoSrc('/videos/suchi-hero-mobile.mp4');
      setPoster('/videos/suchi-hero-poster-sm.jpg');
    }
  }, []);

  // Autoplay is a request, not a guarantee — a rejected promise must not throw.
  useEffect(() => {
    const el = video.current;
    if (!el || reducedMotion || videoFailed) return;
    const attempt = () => {
      el.play().catch(() => {
        /* Poster remains; the layer beneath is already a finished image. */
      });
    };
    if (el.readyState >= 2) attempt();
    else el.addEventListener('loadeddata', attempt, { once: true });
    return () => el.removeEventListener('loadeddata', attempt);
  }, [reducedMotion, videoFailed, videoSrc]);

  const showVideo = !reducedMotion && !videoFailed;

  /* ---------------- entrance ---------------- */
  useIsoLayoutEffect(() => {
    const root = section.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
      const fade = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

      if (reducedMotion) {
        gsap.set([lines, fade], { yPercent: 0, y: 0, opacity: 1, clipPath: 'none' });
        gsap.set('[data-hero-media]', { scale: 1, opacity: 1 });
        return;
      }

      gsap.set(lines, { yPercent: 118 });
      gsap.set(fade, { opacity: 0, y: 16 });
      gsap.set('[data-hero-media]', { scale: 1.08 });

      const tl = gsap.timeline({ delay: 0.35 });

      tl.to('[data-hero-media]', { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
        .to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.9, ease: EASE.expo }, 0.15)
        .to(
          lines,
          { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.11 },
          0.28,
        )
        .to(
          '[data-hero-copy]',
          { opacity: 1, y: 0, duration: 1, ease: EASE.power },
          0.72,
        )
        .to(
          '[data-hero-cta]',
          { opacity: 1, y: 0, duration: 0.9, ease: EASE.power, stagger: 0.09 },
          0.86,
        )
        .to(
          '[data-hero-meta]',
          { opacity: 1, y: 0, duration: 0.9, ease: EASE.power, stagger: 0.07 },
          1.0,
        )
        .to('[data-hero-cue]', { opacity: 1, duration: 0.8 }, 1.15);
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  /* ---------------- exit / parallax ---------------- */
  useIsoLayoutEffect(() => {
    const root = section.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Copy leaves first, headline follows — a hierarchy, not one fade.
      tl.to('[data-hero-copy]', { opacity: 0, y: -24, ease: 'none', duration: 0.32 }, 0)
        .to('[data-hero-cta]', { opacity: 0, y: -18, ease: 'none', duration: 0.3 }, 0.04)
        .to('[data-hero-headline]', { yPercent: -6, opacity: 0.15, ease: 'none', duration: 0.55 }, 0.1)
        .to('[data-hero-media]', { scale: 1.14, yPercent: 6, ease: 'none', duration: 1 }, 0)
        .to('[data-hero-scrim]', { opacity: 1, ease: 'none', duration: 0.8 }, 0.15)
        .to('[data-hero-meta], [data-hero-cue]', { opacity: 0, ease: 'none', duration: 0.25 }, 0);

      return () => tl.scrollTrigger?.kill();
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Keep triggers honest after the poster/video swap changes nothing but fonts do.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      id="top"
      ref={section}
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink"
      aria-label="Suchi Spices — introduction"
    >
      {/* ---- media ---- */}
      <div ref={media} data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        {showVideo ? (
          <video
            ref={video}
            className="h-full w-full object-cover object-[58%_center] md:object-[62%_center]"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setVideoFailed(true)}
            disablePictureInPicture
          />
        ) : (
          <ResponsiveImage
            asset="01-hero-cinematic"
            alt=""
            decorative
            priority
            sizes="100vw"
            className="h-full w-full"
            imgClassName="object-[58%_center] md:object-[62%_center]"
          />
        )}
      </div>

      {/* ---- scrims: legibility without flattening the footage ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,6,7,0.94)_0%,rgba(11,6,7,0.82)_26%,rgba(11,6,7,0.42)_52%,rgba(11,6,7,0.12)_78%,rgba(11,6,7,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,6,7,0.95)_0%,rgba(11,6,7,0.45)_28%,transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(11,6,7,0.8),transparent)]" />
      </div>
      <div
        data-hero-scrim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-ink opacity-0"
      />

      {/* ---- content ---- */}
      <div
        ref={content}
        className="shell relative flex min-h-[100svh] flex-col pb-6 pt-24 md:pb-8 md:pt-[clamp(5.5rem,11svh,7rem)]"
      >
        <div className="flex items-start justify-between gap-8">
          <p
            data-hero-eyebrow
            className="label flex items-center gap-3 text-saffron opacity-0"
            style={{ transform: 'translateY(10px)' }}
          >
            <span className="h-px w-8 bg-saffron/70" />
            The art of Indian spices
          </p>
          <p className="label-sm hidden text-right text-ivory/40 md:block">
            Scroll
            <br />
            to begin
          </p>
        </div>

        <div className="mt-auto max-w-[68rem] pt-12 md:pt-[clamp(2.5rem,7svh,4rem)]">
          <h1
            data-hero-headline
            className="display text-[clamp(2.6rem,min(10.2vw,14svh),10.5rem)] text-ivory"
          >
            <span className="line-mask">
              <span data-hero-line className="block">
                A Universe
              </span>
            </span>
            <span className="line-mask">
              <span data-hero-line className="block">
                of <span className="serif-accent pr-[0.06em]">Flavour</span>
                <span className="text-saffron">.</span>
              </span>
            </span>
          </h1>

          <p
            data-hero-copy
            data-hero-fade
            className="mt-6 max-w-[33rem] text-[0.9375rem] leading-relaxed text-ivory/72 opacity-0 md:mt-8 md:text-[1.0625rem]"
          >
            Discover the colours, aromas and character of India&rsquo;s extraordinary
            spices — photographed as a universe rather than a shelf.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-[clamp(1.25rem,3.5svh,2.25rem)]">
            <a
              href="#collection"
              data-hero-cta
              data-hero-fade
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('collection');
              }}
              className="btn btn-primary justify-between opacity-0 sm:justify-center"
            >
              Explore the collection
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
            <a
              href="#manifesto"
              data-hero-cta
              data-hero-fade
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('manifesto');
              }}
              className="btn btn-ghost justify-between opacity-0 sm:justify-center"
            >
              Discover our world
              <ArrowDownRight size={14} strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-6 border-t border-ivory/15 pt-5 md:mt-[clamp(1.5rem,4svh,2.5rem)]">
          <div className="flex gap-8 md:gap-14">
            <p data-hero-meta data-hero-fade className="label-sm text-ivory/45 opacity-0 [@media(max-height:760px)]:hidden">
              Sixteen spices
              <br />
              <span className="text-ivory/25">Whole &amp; ground</span>
            </p>
            <p data-hero-meta data-hero-fade className="label-sm text-ivory/45 opacity-0 [@media(max-height:760px)]:hidden">
              Four blends
              <br />
              <span className="text-ivory/25">One grammar</span>
            </p>
          </div>

          <div
            data-hero-cue
            data-hero-fade
            className="flex flex-col items-center gap-3 opacity-0"
            aria-hidden="true"
          >
            <span className="label-sm [writing-mode:vertical-rl] text-ivory/40">Scroll</span>
            <span className="relative h-12 w-px overflow-hidden bg-ivory/25 md:h-16">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-saffron" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
