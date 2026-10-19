import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single registration point. Vite HMR can re-execute modules, so guard the
 * call — registering a plugin twice is harmless but re-registering a plugin
 * while ScrollTriggers exist causes duplicate refresh logic.
 */
let registered = false;
if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export const EASE = {
  expo: 'expo.out',
  power: 'power3.out',
  powerInOut: 'power2.inOut',
  soft: 'power2.out',
} as const;

export { gsap, ScrollTrigger };
