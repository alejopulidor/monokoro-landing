"use client";

import { useState } from "react";
import { Arrow } from "@/components/site/brand";
import { digitsOnly, fmtCOP, fmtUSD } from "@/lib/format";
import { RATE_CARD, waLink } from "@/lib/config";

/**
 * The card top-up simulator: pesos in, dollars on the card out, at
 * `RATE_CARD`.
 *
 * That rate is deliberately higher than the buy rate because it carries the
 * international processing cost, and the page says so in full next to this
 * widget. It is not a hidden margin, and the copy explaining it should not be
 * trimmed for space.
 *
 * The amount is kept as a raw digit string and formatted for display, so typing
 * never fights the formatter for the caret and an empty field stays empty
 * instead of collapsing to "0" — same reasoning as `components/home/quoter.tsx`.
 */
export function TopUp({
  initial = "500000",
  ctaLabel = "Recargar por WhatsApp",
  message = "Hola, quiero recargar mi tarjeta Monokoro",
  heading,
}: {
  initial?: string;
  ctaLabel?: string;
  /** Prefilled WhatsApp text. The amount is appended. */
  message?: string;
  /** Optional small heading above the field ("Simula una recarga"). */
  heading?: string;
}) {
  const [raw, setRaw] = useState(initial);
  const amount = parseInt(raw || "0", 10) || 0;

  return (
    <div className="rv card min-w-0 flex-[1_1_420px] rounded-[24px] p-[clamp(24px,3vw,34px)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_30px_62px_-48px_rgba(13,46,51,.6)]">
      {heading && (
        <h3 className="ff-m mb-4 text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
          {heading}
        </h3>
      )}

      <label
        htmlFor="topup-amount"
        className="mb-2.5 block text-sm text-[var(--color-muted)]"
      >
        Recargas (pesos colombianos)
      </label>
      <div className="flex items-baseline gap-2 border-b border-[rgba(13,46,51,0.22)] pb-1.5">
        <span className="ff-m text-[18px] text-[var(--color-faint)]">COP</span>
        <input
          id="topup-amount"
          value={amount ? fmtCOP(amount) : ""}
          onChange={(e) => setRaw(digitsOnly(e.target.value))}
          inputMode="numeric"
          placeholder="500.000"
          className="tnum w-full border-none bg-transparent py-1 text-[clamp(30px,4.4vw,44px)] font-semibold tracking-[-0.035em] text-[var(--color-ink)] outline-none"
        />
      </div>

      <div className="ff-m tnum flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-[rgba(13,46,51,0.12)] py-[18px] text-[12px] tracking-[0.08em] text-[var(--color-teal)]">
        <span>TASA TARJETA</span>
        <span>$ {fmtCOP(RATE_CARD)} COP / USD</span>
      </div>

      <div
        className="mt-[22px] flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2"
        aria-live="polite"
      >
        <span className="text-[15px] text-[var(--color-muted)]">
          Tu tarjeta recibe
        </span>
        <span className="tnum text-[clamp(30px,4.4vw,44px)] font-semibold tracking-[-0.035em]">
          {fmtUSD(amount / RATE_CARD)}{" "}
          <span className="ff-m text-[15px] tracking-normal text-[var(--color-faint)]">
            USD
          </span>
        </span>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3.5">
        <a
          className="mk-mag btn btn-ink"
          href={waLink(`${message} con $${fmtCOP(amount)} COP`)}
        >
          {ctaLabel} <Arrow />
        </a>
        <span className="ff-m text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
          TASA DE REFERENCIA · SE CONFIRMA EN EL CHAT
        </span>
      </div>
    </div>
  );
}
