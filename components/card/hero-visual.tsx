import { CardFace } from "@/components/shared/card-face";

/**
 * The card page's signature moment: the card falls in, overshoots and settles,
 * with its ground shadow timed to the same curve so it looks like it lands on
 * something rather than in front of it.
 *
 * A mount-time animation, not a scroll one — the panel is above the fold, so
 * there is nothing to wait for. The home page's card is the opposite case: it
 * is scroll-driven, because you meet it halfway down the page.
 *
 * `card-drop` / `card-drop-shadow` are pure hooks with no CSS behind them.
 * `cardDrop()` in components/motion/effects.ts finds them, and it owns both the
 * from-state and the overshoot — which used to be a hand-tuned 62% keyframe in
 * each of two separate `@keyframes` blocks that had to be kept in sync.
 *
 * **Nothing here is hidden by CSS.** With no JavaScript the card is simply
 * there, in place, which is the correct outcome for a marketing page.
 */
export function CardHeroVisual() {
  return (
    <div className="relative w-[min(500px,86vw)]">
      <div
        className="card-drop-shadow absolute inset-x-[8%] -bottom-8 h-9 rounded-[50%] blur-[14px]"
        style={{
          background: "radial-gradient(ellipse,rgba(0,0,0,.65),transparent 70%)",
          opacity: 0.4,
        }}
        aria-hidden
      />
      <div className="card-drop" style={{ transformStyle: "preserve-3d" }}>
        {/* The only loop on this page, and it is on a different element from
            the drop so the two never write the same transform. The delay is
            what keeps it from starting before the card has landed. */}
        <div style={{ animation: "floatY 8s ease-in-out 1.6s infinite" }}>
          <CardFace
            size="lg"
            label="USD"
            holder="MARIANA TORRES"
            balance="614,25 USD"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Two cards fanned out, used by the business hero and by the card page's
 * "individual vs empresarial" panel.
 *
 * The negative top margin is what makes them overlap.
 *
 * **The wrapper animates; the card keeps its own rotation.** Each `CardFace`
 * carries a resting `rotate-[-6deg]` / `rotate-[5deg]`, and Tailwind v4
 * compiles those to the standalone `rotate:` property rather than to
 * `transform`. Because they are different properties they *compose*, so GSAP
 * can own the wrapper's transform without flattening the fan. Moving the
 * resting rotation into GSAP would look like a simplification and would break
 * exactly this.
 *
 * `mode` picks which moment it is: `drop` opens on mount (the business hero is
 * above the fold), `stack` opens as you scroll into it (the card page's).
 */
export function CardFan({
  labels = ["INDIVIDUAL", "EMPRESARIAL"],
  last4 = ["4821", "7302"],
  /** `stack` opens on scroll; `drop` opens on mount. */
  mode = "stack",
}: {
  labels?: [string, string] | string[];
  last4?: [string, string] | string[];
  mode?: "stack" | "drop";
}) {
  return (
    <div
      className="relative w-[min(380px,84vw)] pb-16 pt-6"
      data-fan
      data-fan-mode={mode === "drop" ? "mount" : "scroll"}
    >
      <div data-fan-card>
        <CardFace
          compact
          label={labels[0]}
          last4={last4[0]}
          className="rotate-[-6deg] !shadow-[0_30px_60px_rgba(3,20,24,.5)]"
        />
      </div>
      <div data-fan-card style={{ margin: "-26% 0 0 18%" }}>
        <CardFace
          compact
          label={labels[1]}
          last4={last4[1]}
          className="rotate-[5deg] !shadow-[0_34px_66px_rgba(3,20,24,.55)]"
        />
      </div>
    </div>
  );
}
