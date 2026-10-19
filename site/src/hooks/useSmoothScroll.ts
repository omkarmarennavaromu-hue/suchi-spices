import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

let instance: Lenis | null = null;

/**
 * Absolute document offset. ScrollTrigger wraps pinned sections in a
 * `.pin-spacer`, and while pinned the element itself is position:fixed — so we
 * measure from the spacer instead of the element's live rect.
 */
const absoluteTop = (el: HTMLElement): number => {
  const spacer = el.closest('.pin-spacer') as HTMLElement | null;
  let node: HTMLElement | null = spacer ?? el;
  let y = 0;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
};

/** Imperative anchor navigation that behaves correctly around pinned sections. */
export const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector('header');
  const offset = (header?.getBoundingClientRect().height ?? 72) + 12;
  const top = Math.max(0, absoluteTop(target) - offset);

  if (instance) {
    instance.scrollTo(top, { duration: 1.35 });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export const lockScroll = (locked: boolean) => {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.classList.toggle('lenis-stopped', locked);
  document.body.style.overflow = locked ? 'hidden' : '';
};

/**
 * Wires Lenis into the GSAP ticker so ScrollTrigger and the smooth scroller
 * advance on the same frame. Returns nothing — the instance is module-scoped
 * so there is only ever one, even through hot reloads.
 */
export function useSmoothScroll(enabled: boolean) {
  const raf = useRef<((time: number) => void) | null>(null);

  const destroy = useCallback(() => {
    if (raf.current) {
      gsap.ticker.remove(raf.current);
      raf.current = null;
    }
    instance?.destroy();
    instance = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      destroy();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
    });
    instance = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    raf.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images change layout height after mount; make sure the
    // trigger positions are recalculated rather than trusting first paint.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      if (raf.current) gsap.ticker.remove(raf.current);
      raf.current = null;
      lenis.destroy();
      instance = null;
    };
  }, [enabled, destroy]);
}
