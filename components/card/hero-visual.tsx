import { CardFace } from "@/components/shared/card-face";

/**
 * The card page's signature moment: the card falls in, overshoots and settles,
 * with its ground shadow timed to the same curve so it looks like it lands on
 * something rather than in front of it.
 *
 * This is a mount-time animation, not a scroll one — the panel is above the
 * fold, so there is nothing to wait for. The home page's card is the opposite
 * case: it is scroll-driven from `SiteEffects`, because you meet it halfway
 * down the page.
 *
 * `card-drop` / `card-drop-shadow` are named so the reduced-motion block in
 * globals.css can neutralize both without reaching into the markup.
 */
export function CardHeroVisual() {
  return (
    <div className="relative w-[min(500px,86vw)]">
      <div
        className="card-drop-shadow absolute inset-x-[8%] -bottom-8 h-9 rounded-[50%] blur-[14px]"
        style={{
          background: "radial-gradient(ellipse,rgba(0,0,0,.65),transparent 70%)",
          animation: "shadowIn 1.5s cubic-bezier(.2,.85,.25,1) both",
        }}
        aria-hidden
      />
      <div
        className="card-drop"
        style={{
          animation: "heroDrop 1.5s cubic-bezier(.2,.85,.25,1) both",
          transformStyle: "preserve-3d",
        }}
      >
        {/* The float starts after the drop lands, so the two never fight. */}
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
 * The negative top margin is what makes them overlap; each card keeps its own
 * resting `rotate()`, which is why the reveal is an animation rather than a
 * transition — see `.mk-stack` in globals.css.
 */
export function CardFan({
  labels = ["INDIVIDUAL", "EMPRESARIAL"],
  last4 = ["4821", "7302"],
  /** `stack` reveals on scroll; `drop` plays on mount. */
  mode = "stack",
}: {
  labels?: [string, string] | string[];
  last4?: [string, string] | string[];
  mode?: "stack" | "drop";
}) {
  const dropStyle = (delay: string) => ({
    animation: `fanDrop 1s cubic-bezier(.2,.85,.25,1) ${delay} both`,
  });

  return (
    <div className="relative w-[min(380px,84vw)] pb-16 pt-6">
      <div
        className={mode === "stack" ? "mk-stack" : undefined}
        style={mode === "drop" ? dropStyle(".1s") : undefined}
      >
        <CardFace
          compact
          label={labels[0]}
          last4={last4[0]}
          className="rotate-[-6deg] !shadow-[0_30px_60px_rgba(3,20,24,.5)]"
        />
      </div>
      <div
        className={mode === "stack" ? "mk-stack" : undefined}
        style={{
          margin: "-26% 0 0 18%",
          ...(mode === "drop" ? dropStyle(".28s") : { animationDelay: ".2s" }),
        }}
      >
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
