"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The one place `registerPlugin` is ever called. Every other module imports
 * gsap and ScrollTrigger *from here*, so the plugin cannot be missing.
 *
 * Importing this during the prerender is safe: GSAP guards its own `window`
 * access at module scope, which is why nothing here needs `next/dynamic` or a
 * `typeof window` check. Only the DOM work inside the effects has to stay in
 * `useEffect`.
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
