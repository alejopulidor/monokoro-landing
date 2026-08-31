"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { MQ, NAV_OFFSET } from "@/lib/motion";
import { reap, unclaim, unclaimAll } from "./claim";
import {
  always,
  alwaysKeys,
  pointerOnly,
  pointerOnlyKeys,
  type Ctx,
  type Effect,
} from "./effects";
import { gsap, ScrollTrigger } from "./gsap";
import { setLenis } from "./lenis-instance";

/**
 * The single mount point for every animation on the site. Renders nothing.
 *
 * Mounted in `app/[locale]/layout.tsx` **outside `NextIntlClientProvider`**,
 * and in `app/not-found.tsx`, which emits its own document.
 *
 * ## Its imports are a contract
 *
 * `react`, `lenis`, `@/lib/motion` and the three sibling modules. Nothing else,
 * and in particular:
 *
 * - **not `usePathname` from `@/i18n/navigation`.** next-intl's navigation
 *   hooks need `NextIntlClientProvider` above them, and this component is
 *   deliberately outside it. It crashed the static prerender of `/es/aprende`
 *   once already.
 * - **not `usePathname` from `next/navigation`** either, for the reason in
 *   "Navigation" below.
 *
 * ## Navigation — the part with no reference implementation
 *
 * A client navigation swaps the page's markup without remounting the layout,
 * so an effect list run once at mount never sees the next page's elements.
 * There are three separate problems and `ScrollTrigger.refresh()` only solves
 * one of them:
 *
 * 1. **New elements get no triggers.** `refresh()` recalculates `start`/`end`
 *    for triggers that already exist; it does not scan the DOM. The effects
 *    have to be run again.
 * 2. **Old triggers point at detached nodes.** `getBoundingClientRect()` on a
 *    removed element returns all zeros, so on the next refresh such a trigger
 *    computes `start === end === 0`, fires immediately and forever, and leaks.
 *    `reap()` is the guard, and the symptom without it appears on the *second*
 *    navigation, not the first.
 * 3. **Surviving triggers have stale positions**, because the new page is a
 *    different height.
 *
 * So the order is fixed: **reap → wire → refresh.**
 *
 * The signal is a `MutationObserver`, not the pathname. Keying on
 * `usePathname` looks like the fix and is not: measured, the router updates the
 * pathname *before* the new segment commits on the first navigation, so the
 * sweep ran against the outgoing DOM and found nothing (that was the reported
 * bug — "on mobile the blog only loaded the first text"). An observer reacts to
 * *nodes existing*, which is the one signal that cannot arrive early.
 *
 * It is deliberately **not** debounced through `requestAnimationFrame`. That
 * was the first version, and a starved frame left a whole page unanimated.
 * MutationObserver already batches by microtask checkpoint.
 *
 * Which is only affordable because the reaction is incremental. Three of the
 * five pages animate a chat mock that appends bubbles forever, so this observer
 * fires every 0.7–4.4 seconds for as long as the tab is open. `claim()` makes
 * re-running the list nearly free, and the `killed || wired` gate is what keeps
 * `refresh()` from becoming a permanent treadmill.
 */
export function MotionProvider() {
  useEffect(() => {
    // Showing or hiding the iOS address bar fires a resize mid-scroll, and
    // recalculating every trigger at that moment reads as a jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    /**
     * Wire one branch's effect list and keep it wired.
     *
     * Returned to `mm.add`, so GSAP calls it as the branch's teardown when the
     * query stops matching. `mm.revert()` undoes the tweens; this undoes the
     * DOM listeners and the claim flags, which GSAP knows nothing about.
     */
    const branch = (effects: Effect[], keys: readonly string[]) => {
      const offs: Array<() => void> = [];
      const ctx: Ctx = {
        on: (el, type, fn, opts) => {
          el.addEventListener(type, fn, opts);
          offs.push(() => el.removeEventListener(type, fn, opts));
        },
      };

      const sync = () => {
        const killed = reap();
        const wired = effects.reduce((n, fn) => n + fn(ctx), 0);
        // Only remeasure when the trigger population actually changed.
        // Without this gate the looping chat mocks would force a full
        // ScrollTrigger.refresh() every second, forever.
        if (killed || wired) ScrollTrigger.refresh();
      };

      // Belt and braces, and the two passes do different jobs. The
      // synchronous one guarantees nothing is left unwired if rAF is starved;
      // the deferred one (two frames: commit, then layout) makes sure the
      // measurements are taken against real boxes. Running both is safe
      // because `claim()` is idempotent, and a mismeasurement here fails
      // *visible* — see the from-state guarantee in effects.ts.
      sync();
      const frames: number[] = [];
      frames.push(
        requestAnimationFrame(() => {
          frames.push(requestAnimationFrame(sync));
        }),
      );

      const mo = new MutationObserver((records) => {
        if (!records.some((r) => r.addedNodes.length > 0)) return;
        sync();
      });
      // `attributes` is deliberately absent: writing the claim flags and GSAP
      // writing inline styles must not re-trigger this.
      mo.observe(document.body, { childList: true, subtree: true });

      return () => {
        mo.disconnect();
        frames.forEach(cancelAnimationFrame);
        offs.forEach((off) => off());
        unclaim(keys);
      };
    };

    mm.add(MQ.motion, () => {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, autoRaf: false });
      setLenis(lenis);

      // One clock. Lenis drives ScrollTrigger's update, and GSAP's ticker
      // drives Lenis, so the smooth scroll and every scrubbed tween advance on
      // the same frame instead of on two rAFs that drift apart.
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      // Lag smoothing exists to stop GSAP fast-forwarding after a stall; with
      // a scroll-driven timeline that fast-forward is exactly the jump we do
      // not want.
      gsap.ticker.lagSmoothing(0);

      /**
       * Same-page anchors, routed through Lenis.
       *
       * Two details are load-bearing, both learned the hard way elsewhere:
       *
       * - `scrollTo` gets a **number**, not the element. Given an element,
       *   Lenis derives the position from `offsetTop`, which is measured
       *   against the offsetParent rather than the document, and every anchor
       *   lands ~80px low.
       * - `history.pushState` is ours to do. Lenis's built-in
       *   `anchors: { offset }` swallows the click without updating the URL,
       *   which breaks both linkability and the back button.
       *
       * The selector catches only bare `#anchors`, which is exactly right:
       * `lib/nav.ts` also carries `/#cotiza`, and from /tarjeta that is a
       * navigation, not a scroll.
       */
      const onClick = (ev: MouseEvent) => {
        if (ev.defaultPrevented || ev.button !== 0) return;
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        const a = (ev.target as Element | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href")?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;

        ev.preventDefault();
        // The mobile sheet's own onNavigate stops Lenis in the same click, and
        // a stopped Lenis swallows scrollTo. Start it again first.
        lenis.start();
        lenis.scrollTo(
          target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
        );
        history.pushState(null, "", `#${id}`);
      };
      document.addEventListener("click", onClick);

      const teardown = branch(always, alwaysKeys);

      // Arriving on /es/#cotiza from another page is a navigation, so the
      // handler above never sees it and the browser has already jumped without
      // the nav offset. Re-land it once, after the effects have wired.
      const hash = location.hash.slice(1);
      if (hash) {
        requestAnimationFrame(() => {
          const target = document.getElementById(hash);
          if (target) {
            lenis.scrollTo(
              target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
              { immediate: true },
            );
          }
        });
      }

      return () => {
        document.removeEventListener("click", onClick);
        teardown();
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        setLenis(null);
      };
    });

    mm.add(`${MQ.motion} and ${MQ.hover}`, () =>
      branch(pointerOnly, pointerOnlyKeys),
    );

    return () => {
      mm.revert();
      unclaimAll();
      document.documentElement.classList.remove("nav-compact");
    };
  }, []);

  return null;
}
