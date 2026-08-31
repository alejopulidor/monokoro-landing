"use client";

import { useEffect } from "react";

/**
 * All of the site's ambient, page-wide motion, in one client component.
 *
 * The design canvas did this in a single `componentDidMount`, and there is a
 * good reason to keep it that way rather than turning each effect into its own
 * wrapper component: one IntersectionObserver and **one** `pointermove`
 * listener serve the whole document. A per-element version would attach
 * dozens of listeners to the same event and do the same `closest()` walk in
 * each of them.
 *
 * It renders nothing. Mount it once, in the locale layout.
 *
 * **It watches the DOM, not the route.** App Router navigations swap the page's
 * markup without remounting the layout, so an observer wired up once at mount
 * never sees the next page's elements — they stay at `opacity: 0`, and the page
 * arrives with only its hero visible (`.hero-in` is a mount animation and needs
 * no observer). The symptom was having to reload to see a page properly.
 *
 * Keying the effect on `usePathname` looks like the fix and is not: measured,
 * the router updates the pathname *before* the new segment commits on the first
 * navigation, so the sweep runs against the outgoing DOM and finds nothing to
 * observe. A `MutationObserver` sidesteps the race entirely — whenever nodes
 * are added, anything new that wants revealing gets observed, whatever the
 * commit order was. It also covers content that appears without a navigation.
 *
 * The scroll and pointer listeners are attached once and look their targets up
 * by id on each frame, so they survive navigation without being re-bound.
 *
 * What it drives — each one is opt-in via a class name, so a section only
 * needs to add the class:
 *
 *   `.rv`        scroll reveal. Gets `.in` when it enters the viewport, once.
 *   `.mk-mag`    magnetic button. Follows the pointer a few pixels.
 *   `.mk-glow`   panel with a cursor spotlight; must contain a `.mk-spot`.
 *   `#mk-nav`    grows a shadow once the page has scrolled past 24px.
 *   `#mk-prog`   reading-progress bar (article pages only).
 */
export function SiteEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ─── Scroll reveal ───────────────────────────────────────────────────
    // Under reduced motion the CSS already renders `.rv` visible, so the
    // observer would only add a class nothing reads. Skip it entirely.
    // Stagger timers, cleared on unmount so a fast navigation cannot reveal
    // elements belonging to a page that is already gone.
    const timers: number[] = [];

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      io = new IntersectionObserver(
        (entries) => {
          // Stagger by what enters *together*, not by document order. A row of
          // three cards crossing the fold in the same frame ripples; the same
          // three stacked on a phone arrive one at a time and each starts
          // immediately, because on mobile they are no longer a row. Sorting by
          // position keeps the ripple left-to-right, top-to-bottom regardless
          // of the order the observer hands them over in.
          const arriving = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => {
              const ra = a.boundingClientRect;
              const rb = b.boundingClientRect;
              return ra.top - rb.top || ra.left - rb.left;
            });

          arriving.forEach((e, i) => {
            const el = e.target as HTMLElement;
            io?.unobserve(el);
            // The stagger defers the class rather than setting an inline
            // `transition-delay`. A lingering inline delay would also apply to
            // the element's *next* transition — `.mk-lift` cards would take a
            // quarter second to react to hover, long after the reveal was done.
            // Capped at four, so a long list entering at once does not make the
            // last item wait.
            const delay = Math.min(i, 4) * 70;
            if (delay === 0) {
              el.classList.add("in");
            } else {
              timers.push(
                window.setTimeout(() => el.classList.add("in"), delay),
              );
            }
          });
        },
        {
          // `threshold: 0` rather than a ratio: an element several viewports
          // tall can never reach 14% visible, and would stay hidden forever.
          // The negative bottom margin is what delays the trigger instead.
          threshold: 0,
          rootMargin: "0px 0px -8% 0px",
        },
      );
    }

    // ─── Scroll: nav shadow, reading progress, card tilt ─────────────────
    // All three share one listener and one rAF. Each looks its element up by
    // id and does nothing when the page does not have it, which is how the
    // article bar and the home page's card can live in the same handler.
    let raf = 0;
    const onScrollFrame = () => {
      raf = 0;

      const nav = document.getElementById("mk-nav");
      if (nav) {
        nav.style.boxShadow =
          window.scrollY > 24 ? "0 18px 40px -34px rgba(13,46,51,.8)" : "none";
      }

      const bar = document.getElementById("mk-prog");
      if (bar) {
        const doc = document.documentElement;
        // `|| 1` guards a page shorter than the viewport, where the divisor
        // would be 0 and the width would come out NaN.
        const max = doc.scrollHeight - doc.clientHeight || 1;
        bar.style.width = `${Math.min(100, (doc.scrollTop / max) * 100)}%`;
      }

      // The card lands as it scrolls in: 0 → 1 over the top 72% of the
      // viewport, eased out cubic, driving opacity and a 3D tilt. Reduced
      // motion leaves it flat — globals.css already renders it in place.
      const card = !reduced && document.getElementById("mk-card");
      if (card) {
        const r = card.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.72)));
        const e = 1 - Math.pow(1 - p, 3);
        card.style.opacity = String(Math.min(1, e * 1.7));
        card.style.transform =
          `translateY(${(1 - e) * -120}px) rotateX(${(1 - e) * 38}deg)` +
          ` rotateZ(${(1 - e) * -13}deg) scale(${0.82 + e * 0.18})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(onScrollFrame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScrollFrame();

    // ─── Pointer: magnetic buttons + panel spotlight ─────────────────────
    let lastMag: HTMLElement | null = null;
    const onMove = (ev: PointerEvent) => {
      const target = ev.target as Element | null;
      const mag =
        target && "closest" in target
          ? (target.closest(".mk-mag") as HTMLElement | null)
          : null;

      // Release the previous button before adopting a new one, or it stays
      // stuck at its last offset after the pointer leaves.
      if (lastMag && lastMag !== mag) {
        lastMag.style.transform = "";
        lastMag = null;
      }
      // Coarse pointers get nothing: there is no hover on a touch screen, and
      // a tap would jerk the button out from under the finger.
      if (mag && window.innerWidth > 760) {
        const b = mag.getBoundingClientRect();
        const dx = (ev.clientX - (b.left + b.width / 2)) / b.width;
        const dy = (ev.clientY - (b.top + b.height / 2)) / b.height;
        mag.style.transform = `translate(${(dx * 7).toFixed(2)}px,${(dy * 5 - 2).toFixed(2)}px)`;
        lastMag = mag;
      }

      document.querySelectorAll<HTMLElement>(".mk-glow").forEach((glow) => {
        const spot = glow.querySelector<HTMLElement>(".mk-spot");
        if (!spot) return;
        const b = glow.getBoundingClientRect();
        const inside =
          ev.clientX > b.left &&
          ev.clientX < b.right &&
          ev.clientY > b.top &&
          ev.clientY < b.bottom;
        spot.style.opacity = inside ? "1" : "0";
        if (inside) {
          spot.style.background = `radial-gradient(340px circle at ${ev.clientX - b.left}px ${ev.clientY - b.top}px,rgba(106,221,155,.17),transparent 62%)`;
        }
      });
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    /**
     * Observe anything that wants revealing and is not revealed yet.
     * `:not(.in)` makes this idempotent, so it can run as often as it likes.
     */
    const sweep = () => {
      document
        .querySelectorAll<HTMLElement>(
          ".rv:not(.in), .mk-stack:not(.in), #mk-line:not(.in)",
        )
        .forEach((el) => io?.observe(el));
      // A newly arrived page may bring its own card; place it before it paints.
      onScrollFrame();
    };

    // Two frames: the first lets React commit the tree, the second lets the
    // browser lay it out, so the observer measures real boxes instead of
    // firing on everything at position 0.
    const rafs: number[] = [];
    rafs.push(
      requestAnimationFrame(() => {
        rafs.push(requestAnimationFrame(sweep));
      }),
    );

    // Re-sweep whenever the DOM gains nodes — a navigation, in practice.
    //
    // Deliberately *not* debounced through `requestAnimationFrame`. That was
    // the first version and it was the fragile part: a frame callback can be
    // starved, and then a whole page never gets observed. MutationObserver
    // already batches — its callback fires once per microtask checkpoint, not
    // once per inserted node — and `sweep()` is a `querySelectorAll` plus an
    // idempotent `observe()`, so running it per batch is cheap and cannot be
    // skipped. Re-observing an already-observed element is a documented no-op,
    // which is what makes running it several times per navigation harmless.
    const mo = new MutationObserver((records) => {
      if (!records.some((r) => r.addedNodes.length > 0)) return;
      sweep();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      io?.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      rafs.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
