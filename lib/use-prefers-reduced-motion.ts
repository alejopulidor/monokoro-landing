"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribes to the OS "reduce motion" setting.
 *
 * `useSyncExternalStore` rather than `useEffect` + `useState`: the server
 * snapshot is `false`, the client reads the real value during the first
 * render, and a change to the setting re-renders without an extra pass that
 * exists only to correct the previous one.
 *
 * Components should use this to *derive* what they render, not to write state
 * in an effect — see `components/home/whatsapp-demo.tsx`. Anything that is
 * purely CSS should use the `@media (prefers-reduced-motion: reduce)` block in
 * globals.css instead; this hook is only for motion driven from JS.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
