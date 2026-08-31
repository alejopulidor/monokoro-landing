import { MONOKORO_SOLID_D, MonokoroMark } from "@/components/site/brand";
import { cx } from "@/lib/cx";

/**
 * The Monokoro card, drawn in the DOM rather than shipped as an image: it stays
 * crisp at any size and costs no request.
 *
 * The aspect ratio is **1.585** — the ISO/IEC 7810 ID-1 ratio a real card has,
 * which is what makes it read as a card and not as a rounded rectangle.
 *
 * The PAN is masked and the visible digits are not a usable range. Never put a
 * plausible BIN on a marketing page.
 *
 * `size` only changes type and padding; the geometry is identical, so the same
 * component serves the home page's inset card, the card page's hero drop, and
 * the little fanned pair in "individual vs empresarial".
 *
 * **Accessibility.** `role="img"` on the root makes the whole subtree
 * unreachable — a screen reader announces the label and nothing else, so the
 * holder and balance rendered inside are invisible to it no matter that they
 * are real text. That is correct for an illustration, and it means the label
 * has to carry the entire reading. `aria-label` below is assembled from the
 * same props the card draws, so the two cannot drift.
 *
 * **The material lives in `app/globals.css`** (`.card-face`, `.card-lit`,
 * `.card-chip`) rather than in Tailwind utilities, because it is five stacked
 * layers with an explicit z-order, a blend mode and a registered custom
 * property. Read the comment there before changing any of it.
 */
export function CardFace({
  label,
  holder,
  balance,
  last4 = "4821",
  size = "md",
  compact = false,
  watermark = true,
  className,
}: {
  /** Mono tag top-right: "USD", "INDIVIDUAL", "EMPRESARIAL". */
  label: string;
  holder?: string;
  balance?: string;
  last4?: string;
  size?: "md" | "lg";
  /** Drops the masked PAN's leading groups and the holder/balance row, for the
   *  small stacked cards where they would be illegible anyway. */
  compact?: boolean;
  /** The embossed isotipo behind the content. **Off for the co-branded card on
   *  /negocios** — that one is the client's brand, and stamping Monokoro's mark
   *  across it contradicts the whole point of the section. */
  watermark?: boolean;
  className?: string;
}) {
  const lg = size === "lg";

  // Everything the card says, in one string, because role="img" hides the rest.
  const reading = [
    `Tarjeta Monokoro ${label}`,
    `terminada en ${last4}`,
    holder ? `a nombre de ${holder}` : null,
    balance ? `saldo de ejemplo ${balance}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cx(
        "card-face",
        lg
          ? "rounded-[24px] shadow-[0_54px_100px_rgba(3,20,24,.65)]"
          : "rounded-[22px] shadow-[0_44px_84px_rgba(3,20,24,.6)]",
        className,
      )}
      role="img"
      aria-label={reading}
    >
      {watermark && (
        /* The isotipo, flat, bleeding toward the right edge.
           `<MonokoroMark>` cannot do this: it emits hard width/height
           attributes, so it can neither be sized in percentages nor cross an
           edge — hence the inlined path.

           **One path, fill only, no stroke.** It went through an embossed
           version first — a plate plus a dark and a light offset stroke — and
           the outline read as a hard edge stuck on top of the card rather than
           as relief in the material. A stroke in the *fill* colour does not fix
           that either: a stroke straddles the path, so its inner half
           composites on top of the fill and the outline still comes out as a
           brighter ring. Flat means no stroke.

           The alpha carries the whole shape now, so it is higher than the
           embossed version's plate was — there are no edges left to define it. */
        <svg
          viewBox="0 0 478 390"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute top-[17%] right-[3%] z-0 h-[68%] w-auto"
          aria-hidden
        >
          <path
            transform="translate(239,195) rotate(45)"
            fill="rgba(255,255,255,0.075)"
            fillRule="evenodd"
            d={MONOKORO_SOLID_D}
          />
        </svg>
      )}

      {/* A fixed specular highlight — part of the material, not a hover
          effect. */}
      <div className="card-lit" aria-hidden />

      {/* The hover treatment: a mint light travelling around the border. Pure
          CSS, gated on `(hover: hover)`, so nothing here needs JavaScript and
          a touch screen gets nothing to get stuck on. */}
      <div className="mk-ring" aria-hidden />

      <div
        className={cx(
          "relative z-[4] flex min-h-full flex-col justify-between gap-2.5",
          lg ? "p-[clamp(16px,3.2vw,32px)]" : "p-[clamp(14px,2.8vw,24px)]",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <MonokoroMark size={lg ? 26 : 20} variant="solid" color="#FFFFFF" />
            <span
              className={cx(
                "font-semibold tracking-[-0.015em] text-[var(--color-onDark)]",
                lg ? "text-[17px]" : "text-sm",
              )}
            >
              Monokoro
            </span>
          </div>
          <span
            className={cx(
              "ff-m tracking-[0.14em] whitespace-nowrap",
              lg ? "text-[12px] text-[var(--color-mint)]" : "text-[10px]",
              !lg && label === "EMPRESARIAL"
                ? "text-[var(--color-mint)]"
                : !lg
                  ? "text-[rgba(239,246,240,0.75)]"
                  : "",
            )}
          >
            {label}
          </span>
        </div>

        {/* Width in percent rather than px so the chip keeps its proportion on
            the 200px fanned pair and on the 440px hero card alike. */}
        <div className="card-chip w-[9.5%] aspect-[1.36]" aria-hidden />

        <div className={cx("flex flex-col", lg ? "gap-[18px]" : "gap-2")}>
          <div
            className={cx(
              "ff-m tnum tracking-[0.12em] text-[var(--color-onDark)]",
              lg ? "text-[clamp(16px,2.6vw,21px)]" : "text-[13px]",
            )}
          >
            {compact ? `•••• ${last4}` : `•••• •••• •••• ${last4}`}
          </div>

          {!compact && (holder || balance) && (
            <div className="flex items-end justify-between gap-4">
              {holder && (
                <div>
                  <div className="ff-m text-[10px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                    TITULAR
                  </div>
                  <div className="mt-1 text-[15px] text-[var(--color-onDark)]">
                    {holder}
                  </div>
                </div>
              )}
              {balance && (
                <div className="text-right">
                  <div className="ff-m text-[10px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                    SALDO
                  </div>
                  <div className="tnum mt-1 text-[15px] text-[var(--color-mint)]">
                    {balance}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
