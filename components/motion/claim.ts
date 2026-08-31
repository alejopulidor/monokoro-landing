"use client";

import { ScrollTrigger } from "./gsap";

/**
 * Idempotency for the effect list.
 *
 * Every effect runs through `claim()` and nothing calls `querySelectorAll`
 * directly. That is what makes it safe to re-run the *whole* effect list on
 * every DOM mutation: an effect that finds nothing new does one
 * `querySelectorAll` and returns.
 *
 * This is not a micro-optimisation. Three of the five pages animate a chat
 * mock that appends and removes bubbles forever (`STEP_MS` in
 * components/home/whatsapp-demo.tsx, `CARD_CHAT_MS` in content/card.ts), so
 * the MutationObserver in the provider fires every 0.7-4.4 seconds for as long
 * as the tab is open. A reaction that rebuilt anything would be a treadmill.
 *
 * **One flag per effect, not one shared flag.** Elements overlap: a
 * `.rv` inside a `[data-panel]`, a `[data-count]` inside a `.rv`. With a single
 * marker the first effect to claim an element would hide it from every other
 * effect, and the symptom would be one effect silently not applying.
 */
const keys = new Set<string>();

export function claim<T extends Element>(
  sel: string,
  key: string,
  root: ParentNode = document,
): T[] {
  keys.add(key);
  const flag = `data-mk-${key}`;
  const found = Array.from(root.querySelectorAll<T>(`${sel}:not([${flag}])`));
  for (const el of found) el.setAttribute(flag, "");
  return found;
}

/**
 * Drop every claim.
 *
 * Must run in the provider's teardown. `mm.revert()` kills the tweens but
 * knows nothing about these attributes, so without this a matchMedia branch
 * turning back on (rotate a tablet across 900px, plug in a mouse) would find
 * everything already claimed and wire nothing. It presents as a random
 * resize bug, which is why it is two lines with a long comment.
 */
export function unclaim(only: readonly string[]) {
  for (const key of only) {
    document
      .querySelectorAll(`[data-mk-${key}]`)
      .forEach((el) => el.removeAttribute(`data-mk-${key}`));
    keys.delete(key);
  }
}

/** Everything, for the provider's outermost teardown. */
export function unclaimAll() {
  unclaim([...keys]);
}

/**
 * Kill ScrollTriggers whose trigger element has left the document, and report
 * how many died.
 *
 * This is the fix for the failure mode that only shows up on the *second*
 * client navigation. `ScrollTrigger.refresh()` recalculates `start`/`end` for
 * existing triggers; it does not scan the DOM and it does not notice that a
 * trigger's element was removed. `getBoundingClientRect()` on a detached node
 * returns all zeros, so on the next refresh such a trigger computes
 * `start === end === 0`, fires immediately and permanently, and leaks.
 */
export function reap(): number {
  let n = 0;
  for (const st of ScrollTrigger.getAll()) {
    const t = (st.trigger ?? st.vars.trigger) as Element | null | undefined;
    if (t instanceof Element && !t.isConnected) {
      st.kill(true);
      n++;
    }
  }
  return n;
}
