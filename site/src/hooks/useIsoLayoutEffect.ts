import { useEffect, useLayoutEffect } from 'react';

/** useLayoutEffect in the browser, useEffect during SSR/prerender. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
