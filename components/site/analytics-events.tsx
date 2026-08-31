"use client";

import { useEffect } from "react";
import { GA4_ID, GTM_ID } from "@/lib/config";

/**
 * Conversion tracking.
 *
 * This site has exactly one conversion — opening WhatsApp — and it happens by
 * leaving the page, so a pageview-only setup measures none of it. Every CTA on
 * the site is a `wa.me` link, which makes them all catchable with a single
 * delegated listener instead of a callback threaded through twenty components.
 *
 * Fired in the **capture** phase: by the bubble phase the browser may already
 * be tearing the page down for the navigation, and the beacon never leaves.
 *
 * Renders nothing, and does nothing at all when no analytics id is configured.
 *
 * The event reaches both destinations because they are read differently:
 *   - GTM listens on `dataLayer` — set up a Custom Event trigger named
 *     `whatsapp_click` and point a GA4 Event tag at it.
 *   - gtag.js needs an actual `gtag('event', …)` call; a bare dataLayer push
 *     is not an event to it.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsEvents() {
  useEffect(() => {
    if (!GTM_ID && !GA4_ID) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link =
        target && "closest" in target
          ? target.closest<HTMLAnchorElement>('a[href*="wa.me"]')
          : null;
      if (!link) return;

      const payload = {
        // The label is what makes the report readable: it says *which* CTA,
        // and every wa.me link on this site carries a distinct prefilled
        // message, so the destination doubles as the identifier.
        link_text: (link.textContent ?? "").trim().slice(0, 100),
        link_url: link.href,
        page_path: window.location.pathname,
      };

      window.dataLayer?.push({ event: "whatsapp_click", ...payload });
      window.gtag?.("event", "whatsapp_click", payload);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
