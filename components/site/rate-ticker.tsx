import { fmtCOP } from "@/lib/format";
import { MIN_AMOUNT_COP, RATE_BUY, RATE_CARD, RATE_SELL } from "@/lib/config";

/**
 * The mono marquee under the nav.
 *
 * The item list is rendered **twice** because `@keyframes marquee` translates
 * the track by -50%: at that point copy two sits exactly where copy one
 * started, so the loop is seamless. One copy would snap back. The duplicate is
 * `aria-hidden` so a screen reader reads the rates once.
 *
 * Rates come from lib/config.ts and are referential — the strip says so
 * indirectly ("SE CONFIRMAN EN EL CHAT" in the footer); do not present them as
 * live without wiring a real source.
 */
export function RateTicker() {
  const items = [
    `COMPRA $ ${fmtCOP(RATE_BUY)} COP/USD`,
    `VENTA $ ${fmtCOP(RATE_SELL)} COP/USD`,
    `TARJETA $ ${fmtCOP(RATE_CARD)} COP/USD`,
    `DESDE $ ${fmtCOP(MIN_AMOUNT_COP)} COP`,
    "ENTREGA AL MOMENTO",
    "SOPORTE HUMANO 7 DÍAS",
  ];

  return (
    <div className="overflow-hidden border-t border-[rgba(13,46,51,0.07)] bg-white/35">
      <div
        className="flex w-max text-[11px] tracking-[0.14em] text-[var(--color-teal)]"
        style={{ animation: "marquee 38s linear infinite" }}
      >
        <Track items={items} />
        {/* Second pass, hidden from assistive tech: it exists only so the
            -50% translate lands on an identical frame. */}
        <Track items={items} hidden />
      </div>
    </div>
  );
}

/** Defined at module scope, not inside `RateTicker`: a component created
 *  during render gets a new identity every time and remounts its subtree. */
function Track({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <>
      {items.map((t) => (
        <span
          key={t}
          aria-hidden={hidden}
          className="ff-m tnum flex items-center gap-[10px] whitespace-nowrap px-[22px] py-2"
        >
          {t}
          <span
            className="h-[3px] w-[3px] rounded-full bg-[var(--color-mint)]"
            aria-hidden
          />
        </span>
      ))}
    </>
  );
}
