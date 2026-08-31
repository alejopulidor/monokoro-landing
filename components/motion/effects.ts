"use client";

import { DUR, EASE, SCRUB, STAGGER } from "@/lib/motion";
import { fmtCOP, fmtUSD } from "@/lib/format";
import { claim } from "./claim";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Every animation on the site, one exported function each.
 *
 * ## The contract
 *
 * Each effect finds its own elements through a class, an id or a `data-`
 * attribute and returns **how many it wired**. The provider adds that up and
 * only calls `ScrollTrigger.refresh()` when the number is non-zero — see the
 * comment on `sync` in motion-provider.tsx for why that gate matters.
 *
 * Sections declare what moves and stay **Server Components**. Nothing here is
 * imported by a section, so no section needs `"use client"` and no extra
 * JavaScript ships for a page that happens to animate.
 *
 * ## The from-state guarantee, which is the most important thing in this file
 *
 * **GSAP sets every from-state. CSS sets none.** `reveal()` measures each
 * element first and only hides the ones below the fold. Three consequences,
 * and all three are why it is written this way:
 *
 * - JS never runs — a parse error, a blocked chunk, a crawler that does not
 *   execute scripts — and every element has zero styles from us. The page is
 *   *complete*. Before this, `.rv { opacity: 0 }` lived in the stylesheet and
 *   31 elements on the home page, 43 on /tarjeta and 55 on /negocios were
 *   invisible without JavaScript.
 * - A measurement goes wrong (a starved frame, a mutation batch mid-layout)
 *   and the element measures near `top: 0`, is judged *not* below the fold,
 *   and is left alone. **The failure mode is "no animation", never
 *   "invisible".** That is what makes it safe to run the sync loop
 *   synchronously from a MutationObserver, before layout has settled.
 * - `mm.revert()` on a breakpoint flip removes the inline opacity GSAP added,
 *   so the element is visible again with no extra code.
 *
 * The one deliberate exception is the reading-progress bar, which starts at
 * `scaleX(0)` in CSS. A progress bar with nothing tracking the scroll *should*
 * be absent: it is chrome, not content.
 *
 * ## Two traps, both load-bearing
 *
 * - **Tailwind v4's `rotate-*` compiles to the standalone `rotate:` property**,
 *   not to `transform`. That is why `cardFan` animates the *wrapper* while the
 *   resting rotation stays on the inner card: they compose instead of fighting.
 *   Do not "simplify" it by moving the rotation into GSAP.
 * - **A filled CSS animation beats an inline style.** The two aurora layers
 *   animate `transform` on an infinite loop, so a GSAP transform tween on them
 *   would silently do nothing. `parallax` is therefore pointed at the grid
 *   layer and never at the aurora — the aurora's drift *is* its motion.
 */

/* ─── Scroll: entrances ──────────────────────────────────────────────────── */

/**
 * The generic fade-up. Every section on the site uses this and nothing else,
 * which is the point: one duration, one curve, one distance.
 */
export function reveal() {
  const els = claim<HTMLElement>(".rv", "rv");
  if (!els.length) return 0;

  // Only what is below the fold is ever hidden. See the from-state guarantee.
  const fold = window.innerHeight * 0.9;
  const below = els.filter((el) => el.getBoundingClientRect().top > fold);
  if (below.length) {
    gsap.set(below, { opacity: 0, y: 24 });
    ScrollTrigger.batch(below, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: DUR.enter,
          ease: EASE.enter,
          // Batching is what produces the ripple: three cards crossing the
          // fold on the same frame stagger, while the same three stacked on a
          // phone arrive one at a time and each starts immediately.
          //
          // Note when measuring this: with `batch`'s own 0.1s grouping window
          // plus this stagger and `DUR.enter`, the last card in a group can
          // still be at `opacity: 0` almost a second after it crossed the
          // fold. A harness that samples a few hundred ms after scrolling will
          // report those as "stuck" and they are not — let it settle first.
          stagger: STAGGER.base,
          overwrite: "auto",
        }),
    });
  }
  return els.length;
}

/** Above-the-fold entrance. Fires on mount — there is nothing to scroll for. */
export function heroIntro() {
  const els = claim<HTMLElement>(".hero-in", "hero");
  if (!els.length) return 0;

  gsap.set(els, { opacity: 0, y: 30 });
  const play = () => {
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: DUR.slow,
      ease: EASE.enter,
      stagger: STAGGER.base,
    });
    // The font swap invalidates every measurement taken before it. Without
    // this, every ScrollTrigger below the hero is off by however much the
    // headline reflowed.
    ScrollTrigger.refresh();
  };

  // Raced against a timeout on purpose: a hero that never appears because
  // `fonts.ready` hung is far worse than one that animates a beat early.
  Promise.race([
    document.fonts?.ready ?? Promise.resolve(undefined),
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(play);

  return els.length;
}

/**
 * The card page's signature moment: the card falls, overshoots, settles, and
 * its ground shadow scales on the same timeline so it lands *on* something.
 *
 * Replaces two CSS keyframe animations whose 62% overshoot frame was hand-tuned
 * in both. `back.out(1.4)` is that idea, expressed once.
 */
export function cardDrop() {
  const els = claim<HTMLElement>(".card-drop", "drop");
  for (const el of els) {
    const shadow =
      el.parentElement?.querySelector<HTMLElement>(".card-drop-shadow");
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { y: -230, rotationX: 46, rotationZ: -15, scale: 0.76, opacity: 0 },
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        opacity: 1,
        duration: DUR.slow,
        ease: EASE.pop,
      },
      0,
    );
    if (shadow) {
      tl.fromTo(
        shadow,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: DUR.slow, ease: EASE.pop },
        0,
      );
    }
  }
  return els.length;
}

/**
 * The two fanned cards. Two modes, and they are genuinely different moments:
 *
 * - `mount` (the business hero) — above the fold, so the pair *opens* on load.
 * - scrubbed (the card page's "individual vs empresarial") — the fan opens as
 *   you scroll into it, which is that page's loud moment.
 *
 * The stagger is a per-card trigger offset rather than a timeline stagger,
 * because in the scrubbed case a shared trigger opens both on the same frame.
 */
export function cardFan() {
  const fans = claim<HTMLElement>("[data-fan]", "fan");
  for (const fan of fans) {
    const cards = Array.from(
      fan.querySelectorAll<HTMLElement>("[data-fan-card]"),
    );
    if (!cards.length) continue;
    const mount = fan.dataset.fanMode === "mount";

    cards.forEach((card, i) => {
      const from = { y: -90, rotation: -13, scale: 0.85, opacity: 0 };
      const to = { y: 0, rotation: 0, scale: 1, opacity: 1 };
      if (mount) {
        gsap.fromTo(card, from, {
          ...to,
          duration: DUR.slow,
          ease: EASE.pop,
          delay: i * STAGGER.loose,
        });
      } else {
        gsap.fromTo(card, from, {
          ...to,
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: fan,
            start: `top ${88 - i * 6}%`,
            end: `top ${54 - i * 6}%`,
            scrub: SCRUB.tight,
          },
        });
      }
    });
  }
  return fans.length;
}

/* ─── Scroll: scrubbed ───────────────────────────────────────────────────── */

/**
 * The home page's card, tilting upright as it scrolls in.
 *
 * **Transform only, never opacity.** The version this replaces ramped opacity
 * from 0 alongside the tilt, and a scrubbed `opacity: 0` from-state is the one
 * thing that can leave real content invisible if `start`/`end` mismeasure. It
 * also reached 1 at ~59% progress and was doing almost nothing by then.
 *
 * The start values used to exist twice — once as the CSS start state on
 * `#mk-card`, once in the tilt maths — so changing one and not the other made
 * the card jump on the first frame. Now they exist here only.
 */
export function cardTilt() {
  const els = claim<HTMLElement>("#mk-card", "tilt");
  for (const el of els) {
    gsap.fromTo(
      el,
      { y: -100, rotationX: 34, rotationZ: -11, scale: 0.85 },
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=6%",
          end: "top 42%",
          scrub: SCRUB.tight,
        },
      },
    );
  }
  return els.length;
}

/**
 * Hairlines that draw themselves.
 *
 * Scrubbed, not fired, deliberately: a one-shot version left every line
 * permanently drawn, which made scrolling back up the page feel dead.
 */
export function rules() {
  const els = claim<HTMLElement>("#mk-line, [data-rule]", "rule");
  for (const el of els) {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: EASE.scrub,
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: el,
          start: "top 94%",
          end: "top 68%",
          scrub: SCRUB.tight,
        },
      },
    );
  }
  return els.length;
}

/**
 * Decoration layers drifting against the scroll. `data-parallax` is the
 * fraction of its own height an element travels; the trigger is its parent, so
 * the range covers the whole panel rather than the layer's own box.
 */
export function parallax() {
  const els = claim<HTMLElement>("[data-parallax]", "para");
  for (const el of els) {
    const s = Number(el.dataset.parallax) || 0.08;
    gsap.fromTo(
      el,
      { yPercent: -s * 100 },
      {
        yPercent: s * 100,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: SCRUB.tight,
        },
      },
    );
  }
  return els.length;
}

/**
 * The dark panels settling into place as you reach them. Small on purpose —
 * 40px and 2.5% of scale — because there are five of these per page and they
 * are the page's structure, not its punctuation.
 */
export function panels() {
  const els = claim<HTMLElement>("[data-panel]", "panel");
  for (const el of els) {
    gsap.fromTo(
      el,
      { y: 40, scale: 0.975 },
      {
        y: 0,
        scale: 1,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "top 62%",
          scrub: SCRUB.tight,
        },
      },
    );
  }
  return els.length;
}

/*
 * There is deliberately no `steps` effect.
 *
 * The obvious target is the three cards in `components/shared/colored-steps.tsx`
 * -- a per-index trigger offset on them would be the right shape, since on
 * desktop they share a top edge and one shared trigger fires them on the same
 * frame. But those <li>s already carry `.rv`, so it would put two tweens on the
 * same element's `y`: `reveal` fired-once, and a scrubbed lift. That is exactly
 * the double authorship this file exists to remove, and the reveal is the better
 * of the two. If you want the numerals to ramp, give the numeral its own hook --
 * not the card.
 */

/**
 * Figures counting up.
 *
 * The element ships **the real, formatted value** in its HTML and carries the
 * raw number in `data-count`, so a crawler and a visitor without JavaScript see
 * `$ 4.150` and never `0`.
 *
 * Do not replace this with the usual regex-and-`Number()` approach, which
 * strips commas and parses what is left. Colombian money is written `$ 4.150`
 * with the dot grouping thousands, and `Number("4.150")` is **4.15**.
 * Intermediate frames go through the site's own formatter, and `onComplete`
 * restores the authored string byte for byte, so the final frame is identical
 * to the prerendered HTML.
 */
const FMT = { cop: fmtCOP, usd: fmtUSD } as const;

export function counters() {
  const els = claim<HTMLElement>("[data-count]", "count");
  els.forEach((el, i) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const fmt = FMT[el.dataset.countFormat as keyof typeof FMT] ?? String;
    const final = el.textContent ?? "";
    const prefix = final.match(/^[^\d]*/)?.[0] ?? "";
    const suffix = final.match(/[^\d]*$/)?.[0] ?? "";
    const proxy = { v: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          v: target,
          duration: DUR.count,
          ease: EASE.enter,
          delay: i * STAGGER.loose,
          onUpdate: () => {
            el.textContent = `${prefix}${fmt(proxy.v)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = final;
          },
        });
      },
    });
  });
  return els.length;
}

/* ─── Scroll: chrome ─────────────────────────────────────────────────────── */

/** The nav grows a shadow once the page has moved. CSS owns the shadow. */
export function navCompact() {
  const els = claim<HTMLElement>("#mk-nav", "nav");
  if (!els.length) return 0;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) =>
      document.documentElement.classList.toggle(
        "nav-compact",
        self.scroll() > 24,
      ),
  });
  return els.length;
}

/**
 * The reading-progress bar on article pages. The only effect whose from-state
 * is in CSS, and that is correct — see the exception noted at the top.
 */
export function progress() {
  const els = claim<HTMLElement>("#mk-prog", "prog");
  for (const el of els) {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: EASE.scrub,
        transformOrigin: "left center",
        scrollTrigger: { start: 0, end: "max", scrub: SCRUB.tight },
      },
    );
  }
  return els.length;
}

/* ─── Pointer ────────────────────────────────────────────────────────────── */

/**
 * Listener bookkeeping. The pointer effects attach real DOM listeners, which
 * `mm.revert()` knows nothing about, so the provider hands each branch an `on`
 * that records what has to be removed again.
 */
export type Ctx = {
  on: (
    el: EventTarget,
    type: string,
    fn: EventListener,
    opts?: AddEventListenerOptions,
  ) => void;
};

/**
 * Magnetic buttons: the element leans a few pixels toward the pointer.
 *
 * `gsap.quickTo` rather than a CSS transition on `transform`, which would have
 * to be re-triggered on every pointermove and would fight its own easing.
 *
 * Per-element listeners, not one delegated `pointermove` on the window: 13
 * buttons is cheap, and the delegated version had to walk `closest()` on every
 * pointer event across the whole document *and* remember to release the
 * previous button or it stayed stuck at its last offset.
 */
export function magnetic(ctx: Ctx) {
  const els = claim<HTMLElement>(".mk-mag", "mag");
  for (const el of els) {
    const x = gsap.quickTo(el, "x", { duration: DUR.hover, ease: EASE.enter });
    const y = gsap.quickTo(el, "y", { duration: DUR.hover, ease: EASE.enter });
    ctx.on(el, "pointermove", (ev) => {
      const e = ev as PointerEvent;
      const b = el.getBoundingClientRect();
      x(((e.clientX - (b.left + b.width / 2)) / b.width) * 7);
      y(((e.clientY - (b.top + b.height / 2)) / b.height) * 5);
    });
    ctx.on(el, "pointerleave", () => {
      x(0);
      y(0);
    });
  }
  return els.length;
}

/** Cursor spotlight on a dark panel. The gradient is CSS; JS writes only the
 *  position and the on/off, so the panel is finished without a pointer. */
export function spotlight(ctx: Ctx) {
  const els = claim<HTMLElement>(".mk-glow", "glow");
  for (const el of els) {
    const spot = el.querySelector<HTMLElement>(".mk-spot");
    if (!spot) continue;
    ctx.on(el, "pointermove", (ev) => {
      const e = ev as PointerEvent;
      const b = el.getBoundingClientRect();
      spot.style.setProperty("--mk-x", `${e.clientX - b.left}px`);
      spot.style.setProperty("--mk-y", `${e.clientY - b.top}px`);
      spot.style.opacity = "1";
    });
    ctx.on(el, "pointerleave", () => {
      spot.style.opacity = "0";
    });
  }
  return els.length;
}

/**
 * The card's specular highlight tracking the pointer.
 *
 * This is what replaced a white bar sweeping the card on a 6.5s infinite loop —
 * the single most recognisable tell of a template card. The three custom
 * properties are registered in globals.css so `--mk-lit` can be transitioned;
 * the position is written raw, because it should track the pointer exactly and
 * easing it would read as lag.
 */
export function cardLight(ctx: Ctx) {
  const els = claim<HTMLElement>(".card-face", "lit");
  for (const el of els) {
    ctx.on(el, "pointermove", (ev) => {
      const e = ev as PointerEvent;
      const b = el.getBoundingClientRect();
      el.style.setProperty(
        "--mk-mx",
        `${((e.clientX - b.left) / b.width) * 100}%`,
      );
      el.style.setProperty(
        "--mk-my",
        `${((e.clientY - b.top) / b.height) * 100}%`,
      );
      el.style.setProperty("--mk-lit", "1");
    });
    ctx.on(el, "pointerleave", () => {
      // Back to the authored resting values rather than to nothing: the static
      // highlight is a finished look, not a fallback.
      el.style.removeProperty("--mk-mx");
      el.style.removeProperty("--mk-my");
      el.style.setProperty("--mk-lit", "0");
    });
  }
  return els.length;
}

/* ─── The lists the provider runs ────────────────────────────────────────── */

export type Effect = (ctx: Ctx) => number;

/**
 * The claim key every effect writes, listed beside the effect list it belongs
 * to. This is the one piece of duplication in the file and it is deliberate:
 * the provider's per-branch teardown has to drop exactly the keys that branch
 * wrote, or the branch cannot wire anything the next time its media query
 * flips back on. **Add an effect to a list, add its key to the list below it.**
 */

/** Everything that needs only `prefers-reduced-motion: no-preference`. */
export const always: Effect[] = [
  navCompact,
  progress,
  heroIntro,
  reveal,
  panels,
  parallax,
  rules,
  counters,
  cardTilt,
  cardDrop,
  cardFan,
];

export const alwaysKeys = [
  "nav",
  "prog",
  "hero",
  "rv",
  "panel",
  "para",
  "rule",
  "count",
  "tilt",
  "drop",
  "fan",
] as const;

/** Needs a real pointer. A separate matchMedia branch rather than an `if`, so
 *  that plugging a mouse in wires them and unplugging one reverts them. */
export const pointerOnly: Effect[] = [magnetic, spotlight, cardLight];

export const pointerOnlyKeys = ["mag", "glow", "lit"] as const;
