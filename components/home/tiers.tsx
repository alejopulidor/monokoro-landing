import { Arrow } from "@/components/site/brand";
import { SectionHead } from "@/components/shared/section-head";
import { fmtCOP, fmtUSD } from "@/lib/format";
import { RATE_BUY, waLink } from "@/lib/config";
import { cx } from "@/lib/cx";

/**
 * Three starting amounts.
 *
 * Each card is a WhatsApp link with the amount already in the message, so the
 * agent opens on a quote instead of on "hola". The dollar figure next to it is
 * computed from `RATE_BUY` and prefixed with `≈` — it is a reference, and the
 * real rate is confirmed in the chat.
 *
 * The middle tier is the emphasised one (dark fill, mint label). Exactly one
 * card should carry `featured`: two of them cancel each other out.
 */
const TIERS = [
  { cop: 100_000, tag: "PARA PROBAR" },
  { cop: 500_000, tag: "EL MÁS PEDIDO", featured: true },
  { cop: 2_000_000, tag: "PARA AHORRAR" },
];

export function Tiers() {
  return (
    <section id="empieza" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="EMPIEZA HOY"
          title="Empieza con lo que tengas."
          lede="Elige un monto y el chat se abre con la cotización lista. La tasa se confirma antes de pagar."
        />

        <div
          className="mt-[clamp(32px,4vw,48px)] grid gap-[18px]"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}
        >
          {TIERS.map((t) => (
            <a
              key={t.cop}
              href={waLink(
                `Hola, quiero comprar $${fmtCOP(t.cop)} COP en dólares digitales`,
              )}
              className={cx(
                "rv mk-mag flex flex-col gap-3.5 rounded-[24px] border p-[clamp(24px,3vw,34px)] shadow-[0_26px_56px_-46px_rgba(13,46,51,.8)]",
                t.featured
                  ? "border-[rgba(106,221,155,0.3)] bg-[linear-gradient(150deg,#0D2E33,#0A2B31)] text-[var(--color-onDark)]"
                  : "border-[var(--color-line-soft)] bg-[var(--color-card)] text-[var(--color-ink)]",
              )}
            >
              <span
                className={cx(
                  "ff-m text-[11px] tracking-[0.12em]",
                  t.featured ? "text-[var(--color-mint)]" : "text-[var(--color-teal)]",
                )}
              >
                {t.tag}
              </span>
              <span className="tnum text-[clamp(26px,3.4vw,38px)] font-semibold leading-none tracking-[-0.04em]">
                $ {fmtCOP(t.cop)}
              </span>
              <span
                className={cx(
                  "tnum text-base",
                  t.featured ? "text-[rgba(239,246,240,0.72)]" : "text-[var(--color-muted)]",
                )}
              >
                recibes ≈ {fmtUSD(t.cop / RATE_BUY)} USD
              </span>
              <span className="mt-1.5 flex items-center gap-2 text-[15px] font-medium">
                Cotizar este monto <Arrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
