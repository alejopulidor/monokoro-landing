import type Lenis from "lenis";

/**
 * The live Lenis instance, held at module scope.
 *
 * This exists for one reason: `components/site/nav.tsx` needs to freeze the
 * page behind the mobile sheet, and importing the provider to get at the
 * instance would pull GSAP and Lenis into the nav's chunk. A two-function
 * module costs nothing and keeps the nav's imports where they were.
 *
 * `null` whenever Lenis is not running \u2014 under `prefers-reduced-motion: reduce`
 * it is never constructed at all \u2014 so **every caller uses `?.`** and needs a
 * path that works without it.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
