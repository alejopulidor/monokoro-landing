import { MonokoroMark } from "@/components/site/brand";
import { cx } from "@/lib/cx";

/**
 * The Monokoro card, drawn in the DOM rather than shipped as an image: it stays
 * crisp at any size, costs no request, and the holder/balance are real text
 * that a screen reader can reach.
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
 */
export function CardFace({
  label,
  holder,
  balance,
  last4 = "4821",
  size = "md",
  compact = false,
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
  className?: string;
}) {
  const lg = size === "lg";

  return (
    <div
      className={cx(
        "relative overflow-hidden border border-[rgba(106,221,155,0.28)]",
        lg
          ? "rounded-[24px] shadow-[0_54px_100px_rgba(3,20,24,.65)]"
          : "rounded-[22px] shadow-[0_44px_84px_rgba(3,20,24,.6)]",
        className,
      )}
      style={{
        aspectRatio: "1.585",
        background:
          "linear-gradient(140deg,#0D2E33 0%,#2C7A80 60%,#4FB89E 100%)",
      }}
      role="img"
      aria-label={
        holder
          ? `Tarjeta Monokoro ${label} de ${holder}, con saldo de ejemplo`
          : `Tarjeta Monokoro ${label}`
      }
    >
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-30"
        aria-hidden
      >
        <circle cx="336" cy="46" r="130" fill="#6ADD9B" opacity=".3" />
        <circle cx="336" cy="46" r="82" fill="#0D2E33" opacity=".32" />
      </svg>

      {/* Specular sweep. Clipped by the rounded parent. */}
      <div
        className="absolute left-0 top-0 h-full w-[32%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)]"
        style={{ animation: "sheen 6.5s ease-in-out 1.8s infinite" }}
        aria-hidden
      />

      <div
        className={cx(
          "relative flex min-h-full flex-col justify-between gap-2.5",
          lg ? "p-[clamp(16px,3.2vw,32px)]" : "p-[clamp(14px,2.8vw,24px)]",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <MonokoroMark
              size={lg ? 26 : 20}
              variant="solid"
              color="#FFFFFF"
            />
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
