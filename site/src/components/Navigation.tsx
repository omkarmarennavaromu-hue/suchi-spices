import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { scrollToSection, lockScroll } from '../hooks/useSmoothScroll';

const LINKS = [
  { id: 'journey', label: 'Journey' },
  { id: 'collection', label: 'Collection' },
  { id: 'craft', label: 'Craft' },
  { id: 'campaign', label: 'Range' },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);
  const header = useRef<HTMLElement | null>(null);

  // Nav arrives just before the hero headline — a beat, not a delay.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      el,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power2.out' },
    );
    return () => {
      tween.kill();
      gsap.set(el, { clearProps: 'all' });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 48);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        frame.current = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  // Section spy — cheap, and it never fights the scroll position.
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Let the menu close before the scroll starts so Lenis measures correctly.
    window.setTimeout(() => scrollToSection(id), open ? 260 : 0);
  };

  return (
    <>
      <a
        href="#manifesto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-saffron focus:px-4 focus:py-2 focus:text-[0.625rem] focus:font-semibold focus:uppercase focus:tracking-[0.2em] focus:text-ink"
      >
        Skip to content
      </a>

      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding,border-color] duration-500 ${
          scrolled
            ? 'border-b border-ivory/10 bg-ink/72 py-3 backdrop-blur-md md:py-4'
            : 'border-b border-transparent py-4 md:py-7'
        }`}
      >
        <div className="shell flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('top');
            }}
            className="group hit flex items-baseline gap-2 text-left"
            aria-label="Suchi Spices — back to top"
          >
            <span className="font-display text-[0.95rem] font-semibold uppercase leading-none tracking-[0.18em] text-ivory md:text-[1.05rem]">
              Suchi
            </span>
            <span className="h-3 w-px bg-ivory/30 transition-colors duration-500 group-hover:bg-saffron" />
            <span className="text-[0.5625rem] font-medium uppercase leading-none tracking-[0.36em] text-ivory/65">
              Spices
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                data-active={active === link.id}
                className="link-line label-sm hit text-ivory/70 transition-colors duration-300 hover:text-ivory data-[active=true]:text-ivory"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <span className="hidden text-[0.5625rem] uppercase leading-none tracking-[0.34em] text-ivory/40 xl:block">
              Concept&nbsp;·&nbsp;Vol.&nbsp;01
            </span>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                go('collection');
              }}
              className="hidden items-center gap-2 border border-ivory/25 px-4 py-2.5 text-[0.5625rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors duration-400 hover:border-saffron hover:text-saffron md:inline-flex"
            >
              Shop the range
              <ArrowUpRight size={12} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="-mr-1 inline-flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors duration-300 hover:border-saffron hover:text-saffron lg:hidden"
            >
              {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Read-progress hairline — a quiet signal of position, not decoration. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-saffron/70"
          style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map((link, i) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                tabIndex={open ? 0 : -1}
                className="group flex items-center justify-between border-b border-ivory/12 py-5 text-left transition-[opacity,transform] duration-500"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(14px)',
                  transitionDelay: open ? `${120 + i * 70}ms` : '0ms',
                }}
              >
                <span className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-ivory">
                  {link.label}
                </span>
                <span className="label-sm text-ivory/35">0{i + 1}</span>
              </a>
            ))}
          </nav>

          <div
            className="space-y-4 transition-opacity duration-500"
            style={{ opacity: open ? 1 : 0, transitionDelay: open ? '420ms' : '0ms' }}
          >
            <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ivory/12 pt-5">
              {['Red Chilli', 'Turmeric', 'Coriander', 'Cumin', 'Cardamom', 'Star Anise'].map(
                (spice) => (
                  <span key={spice} className="label-sm text-ivory/35">
                    {spice}
                  </span>
                ),
              )}
            </div>
            <p className="serif-accent text-[1.35rem] leading-snug text-ivory/70">
              A universe of flavour, in four blends.
            </p>
            <a
              href="#collection"
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                go('collection');
              }}
              className="btn btn-primary w-full justify-between"
            >
              Explore the collection
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </a>
            <p className="label-sm text-ivory/30">Concept project · Not a real store</p>
          </div>
        </div>
      </div>
    </>
  );
}
