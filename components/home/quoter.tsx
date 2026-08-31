"use client";

import { useState } from "react";
import { Arrow } from "@/components/site/brand";
import { SectionHead } from "./section-head";
import { digitsOnly, fmtCOP, fmtUSD } from "@/lib/format";
import { RATE_BUY, RATE_CARD, RATE_SELL, waLink } from "@/lib/config";
import { cx } from "@/lib/cx";

/**
 * The quoter.
 *
 * Two tabs and, inside the first, two modes:
 *
 *   tab "exchange" + mode "buy"   COP in  → USD out, at RATE_BUY
 *   tab "exchange" + mode "sell"  USD in  → COP out, at RATE_SELL
 *   tab "card"                    COP in  → USD on the card, at RATE_CARD
 *
 * Each of the three keeps **its own amount** in state instead of sharing one
 * field. Switching from "compro 500.000 pesos" to "vendo dólares" must not
 * carry the 500.000 over and quote a half-million-dollar sale.
 *
 * Amounts are stored as raw digit strings, not numbers. The input displays the
 * grouped form but edits the raw one, so typing never fights the formatter for
 * the caret, and an empty field stays empty instead of collapsing to "0".
 *
 * The rate is **referential**. The line under the CTA says so, and it is not
 * decoration: nothing here is a live quote, and the real number is confirmed
 * in the chat.
 */

type Tab = "exchange" | "card";
type Mode = "buy" | "sell";

export function Quoter() {
  const [tab, setTab] = useState<Tab>("exchange");
  const [mode, setMode] = useState<Mode>("buy");
  const [buyRaw, setBuyRaw] = useState("500000");
  const [sellRaw, setSellRaw] = useState("100");
  const [cardRaw, setCardRaw] = useState("500000");

  const isCard = tab === "card";
  const isBuy = mode === "buy";
  /** True whenever the amount being typed is in pesos. */
  const inputIsCOP = isCard || isBuy;

  const raw = isCard ? cardRaw : isBuy ? buyRaw : sellRaw;
  const setRaw = isCard ? setCardRaw : isBuy ? setBuyRaw : setSellRaw;
  const amount = parseInt(raw || "0", 10) || 0;

  const rate = isCard ? RATE_CARD : isBuy ? RATE_BUY : RATE_SELL;
  const output = inputIsCOP ? fmtUSD(amount / rate) : fmtCOP(amount * rate);

  const presets = inputIsCOP ? [200_000, 500_000, 2_000_000] : [100, 500, 2_000];

  const message = isCard
    ? `Hola, quiero recargar mi tarjeta con $${fmtCOP(amount)} COP`
    : isBuy
      ? `Hola, quiero comprar $${fmtCOP(amount)} COP en dólares digitales`
      : `Hola, quiero vender ${fmtCOP(amount)} USD`;

  return (
    <section id="cotiza" className="sec gutter">
      <div className="shell">
        <SectionHead
          eyebrow="COTIZADOR"
          title="Una sola tasa. Sin sorpresas."
          lede="No cobramos comisiones aparte: la tasa que ves ya lo incluye todo. La tarjeta tiene su propia tasa, y también la ves antes de confirmar."
        />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          {/* ── The calculator ─────────────────────────────────────── */}
          <div className="rv card min-w-0 flex-[1_1_420px] p-[clamp(24px,3vw,34px)] shadow-[0_30px_60px_-44px_rgba(13,46,51,.6),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-[8px]">
            <div
              className="flex gap-[5px] rounded-full bg-[rgba(13,46,51,0.06)] p-[5px]"
              role="tablist"
              aria-label="Tipo de operación"
            >
              <TabButton
                selected={!isCard}
                onClick={() => setTab("exchange")}
                label="Comprar / vender"
              />
              <TabButton
                selected={isCard}
                onClick={() => setTab("card")}
                label="Recargar tarjeta"
              />
            </div>

            {!isCard && (
              <div className="ff-m mt-6 inline-flex gap-[22px] text-[12px] tracking-[0.1em]">
                <ModeButton
                  selected={isBuy}
                  onClick={() => setMode("buy")}
                  label="COMPRO DÓLARES"
                />
                <ModeButton
                  selected={!isBuy}
                  onClick={() => setMode("sell")}
                  label="VENDO DÓLARES"
                />
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="quoter-amount"
                className="mb-2.5 block text-sm text-[var(--color-muted)]"
              >
                {isCard
                  ? "Recargas (pesos colombianos)"
                  : isBuy
                    ? "Pagas (pesos colombianos)"
                    : "Vendes (dólares digitales)"}
              </label>
              <div className="flex items-baseline gap-2 border-b border-[rgba(13,46,51,0.22)] pb-1.5">
                <span className="ff-m text-[18px] text-[var(--color-faint)]">
                  {inputIsCOP ? "COP" : "USD"}
                </span>
                <input
                  id="quoter-amount"
                  value={amount ? fmtCOP(amount) : ""}
                  onChange={(e) => setRaw(digitsOnly(e.target.value))}
                  inputMode="numeric"
                  placeholder="500.000"
                  className="tnum w-full border-none bg-transparent py-1 text-[clamp(30px,4.4vw,44px)] font-semibold tracking-[-0.035em] text-[var(--color-ink)] outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {presets.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRaw(String(v))}
                  className="mk-chip ff-m tnum rounded-full border border-[rgba(13,46,51,0.16)] bg-white/70 px-3.5 py-2 text-[11.5px] tracking-[0.08em] text-[var(--color-teal)]"
                >
                  {inputIsCOP ? `$ ${fmtCOP(v)}` : `${fmtCOP(v)} USD`}
                </button>
              ))}
            </div>

            <div className="ff-m tnum mt-1.5 flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-[rgba(13,46,51,0.12)] py-[18px] text-[12px] tracking-[0.08em] text-[var(--color-teal)]">
              <span>{isCard ? "TASA TARJETA" : "TASA MONOKORO"}</span>
              <span>$ {fmtCOP(rate)} COP / USD</span>
            </div>

            <div
              className="mt-[22px] flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2"
              aria-live="polite"
            >
              <span className="text-[15px] text-[var(--color-muted)]">
                {isCard
                  ? "Tu tarjeta recibe"
                  : isBuy
                    ? "Recibes (dólares digitales)"
                    : "Recibes (pesos colombianos)"}
              </span>
              <span className="tnum text-[clamp(30px,4.4vw,44px)] font-semibold tracking-[-0.035em]">
                {output}{" "}
                <span className="ff-m text-[15px] tracking-normal text-[var(--color-faint)]">
                  {inputIsCOP ? "USD" : "COP"}
                </span>
              </span>
            </div>

            {isCard && (
              <p className="mt-[18px] text-[15px] leading-[1.55] text-[var(--color-muted)]">
                La tarjeta usa una tasa distinta porque incluye los costos de
                procesamiento internacional. Aquí también la ves antes de
                confirmar.
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3.5">
              <a className="mk-mag btn btn-ink" href={waLink(message)}>
                Confirmar por WhatsApp <Arrow />
              </a>
              <span className="ff-m text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
                TASA DE REFERENCIA · SE CONFIRMA EN EL CHAT
              </span>
            </div>
          </div>

          {/* ── The two headline rates ─────────────────────────────── */}
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <div className="rv mk-glow panel-flat flex flex-1 flex-col justify-center gap-2.5 p-[clamp(26px,3vw,36px)]">
              <div className="mk-aur-a opacity-50" aria-hidden />
              <div className="mk-spot" aria-hidden />
              <div className="ff-m relative text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
                COMPRAS A
              </div>
              <div className="tnum relative text-[clamp(38px,5vw,60px)] font-semibold leading-none tracking-[-0.04em]">
                $ {fmtCOP(RATE_BUY)}
              </div>
              <div className="relative text-[15px] text-[rgba(239,246,240,0.7)]">
                pesos por dólar
              </div>
            </div>

            <div className="rv card flex flex-1 flex-col justify-center gap-2.5 p-[clamp(26px,3vw,36px)]">
              <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                VENDES A
              </div>
              <div className="tnum text-[clamp(38px,5vw,60px)] font-semibold leading-none tracking-[-0.04em]">
                $ {fmtCOP(RATE_SELL)}
              </div>
              <div className="text-[15px] text-[var(--color-muted)]">
                pesos por dólar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cx(
        "flex-1 rounded-full border-none px-2 py-[11px] text-[14.5px] font-medium transition-colors duration-200",
        selected
          ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
          : "bg-transparent text-[var(--color-ink)]",
      )}
    >
      {label}
    </button>
  );
}

function ModeButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "ff-m border-none bg-transparent pb-[7px] text-[12px] tracking-[0.1em] transition-colors duration-200",
        selected
          ? "border-b-2 border-[var(--color-ink)] text-[var(--color-ink)]"
          : "border-b-2 border-transparent text-[var(--color-faint)]",
      )}
    >
      {label}
    </button>
  );
}
