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
    let io: IntersectionObserver | undefined;
    if (!reduced) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in");
            io?.unobserve(e.target);
          }),
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
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

    // Two frames: the first lets React commit the tree, the second lets the
    // browser lay it out, so the observer measures real boxes instead of
    // firing on everything at position 0.
    const rafs: number[] = [];
    rafs.push(
      requestAnimationFrame(() => {
        rafs.push(
          requestAnimationFrame(() => {
            document.querySelectorAll<HTMLElement>(".rv").forEach((el, i) => {
              // The stagger comes from document order, in groups of four, so
              // a row of cards ripples without any component counting delays.
              el.style.transitionDelay = `${(i % 4) * 80}ms`;
              io?.observe(el);
            });
            // The steps connector uses the same `.in` switch but its own rule.
            const line = document.getElementById("mk-line");
            if (line) io?.observe(line);
            // Position the card correctly on first paint, before any scroll.
            onScrollFrame();
          }),
        );
      }),
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      rafs.forEach(cancelAnimationFrame);
    };
  }, []);

  return null;
}
