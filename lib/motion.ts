// One vocabulary for every animation on the site.
//
// The thing that makes a page read as "generated" is not too little motion —
// it is ten animations that each picked their own duration and curve. Before
// this file existed the site had **15 durations and 2 curves**, with values
// that differed by 0.02s for no reason (0.3 / 0.32 / 0.35) and background
// auroras that ran 24s from a CSS class but 32s from the inline style next to
// it. Everything in `components/motion/*` and the CSS pulls its numbers from
// here, so the whole page moves like one system.
//
// The other half of the rule, and the one that matters more: **one loud moment
// per page, everything else restrained.** The loud moments are the WhatsApp
// chat on the home page, the card on /tarjeta and the fan on /negocios.
// Everything else is a DUR.enter fade-up. Exactly one element loops site-wide
// (the closing CTA's halo) — add a second and neither means anything.

/** GSAP ease strings. */
export const EASE = {
  /** Everything that enters. */
  enter: "power2.out",
  /** Scrubbed transforms — no acceleration of their own, the scroll supplies it. */
  scrub: "none",
  /** A little overshoot. Reserved for the card landing on /tarjeta. */
  pop: "back.out(1.4)",
} as const;

export const DUR = {
  /** Small hover swaps: chips, links, nav items. */
  quick: 0.22,
  /** Hover lifts on cards and buttons. */
  hover: 0.32,
  /** Everything that enters. The single most-used number on the site. */
  enter: 0.6,
  /** The loud moments only: the card drop, the fan opening. */
  slow: 0.9,
  /** Counters. Long enough to read the digits moving. */
  count: 1.6,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.07,
  loose: 0.1,
} as const;

/** How far behind the scroll a scrubbed tween lags, in seconds. */
export const SCRUB = {
  tight: 0.6,
  loose: 1,
} as const;

export const MQ = {
  /** Nothing animates without this. Lenis is never even constructed. */
  motion: "(prefers-reduced-motion: no-preference)",
  /**
   * Pointer-driven effects — the card's specular highlight, magnetic buttons,
   * the panel spotlight.
   *
   * A **capability** test, not a width test. The old check was
   * `window.innerWidth > 760`, which was wrong in both directions on a touch
   * laptop and needed a resize listener to stay right. `hover: hover` is the
   * actual question being asked: a tap on a touch screen would jerk the
   * element out from under the finger.
   */
  hover: "(hover: hover) and (pointer: fine)",
  /**
   * 900px because that is already this site's number — it is where the five
   * nav links wrap (`max-[900px]` in components/site/nav.tsx). Don't introduce
   * a third breakpoint; the other one that exists is 760 for the sticky mobile
   * CTA.
   */
  desktop: "(min-width: 900px)",
} as const;

/**
 * Sticky nav height (measured: 69px bar + 34px rate ticker = 103px) plus
 * breathing room.
 *
 * **Mirrored by `[id] { scroll-margin-top }` in app/globals.css.** CSS owns the
 * native anchor jump, this number owns the Lenis one; if they disagree, an
 * anchor lands in a different place depending on whether Lenis is running.
 * Change both together.
 */
export const NAV_OFFSET = 120;
