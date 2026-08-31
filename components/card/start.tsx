import { SectionHead } from "@/components/shared/section-head";
import { CardGrid } from "@/components/shared/card-grid";
import { TrustPanel } from "@/components/shared/trust-panel";
import { RateCard } from "@/components/shared/rate-card";
import { TopUp } from "@/components/shared/topup";
import { fmtCOP } from "@/lib/format";
import { RATE_BUY, RATE_CARD } from "@/lib/config";
import { CARD_REQUIREMENTS, CARD_SECURITY } from "@/content/card";

/**
 * "La tasa, antes de confirmar."
 *
 * The card rate is higher than the buy rate, and this section exists to say why
 * *before* anyone finds out at checkout. Both figures are shown side by side on
 * purpose — hiding the buy rate here would make the card rate look arbitrary.
 */
export function CardTopUp() {
  return (
    <section id="recarga" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="RECARGA"
          title="La tasa, antes de confirmar."
          lede="La tarjeta usa una tasa distinta a la de compra porque incluye los costos de procesamiento internacional. No es una comisión escondida: la ves cada vez, antes de aceptar."
        />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          <TopUp message="Hola, quiero recargar mi tarjeta Monokoro" />

          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
            <RateCard
              tone="dark"
              label="TASA TARJETA"
              value={`$ ${fmtCOP(RATE_CARD)}`}
            />
            <RateCard label="COMPRA DE DÓLARES" value={`$ ${fmtCOP(RATE_BUY)}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Tres cosas y ya tienes tarjeta." Requirements next to the trust panel, so
 *  the ask and the reassurance land together. */
export function CardStart() {
  return (
    <section id="empezar" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="EMPEZAR"
          title="Tres cosas y ya tienes tarjeta."
          lede="Nada de sucursal, formularios largos ni espera de días hábiles. La verificación se hace una sola vez."
        />

        <div className="mt-[clamp(30px,4vw,46px)] flex flex-wrap gap-5">
          <CardGrid
            items={CARD_REQUIREMENTS}
            min={200}
            lift={false}
            className="min-w-0 flex-[1_1_380px] content-start gap-4"
          />
          <TrustPanel
            title="Qué hay detrás del chat"
            specs={CARD_SECURITY}
            note="WhatsApp es el canal de atención. La emisión de la tarjeta, la recarga y cada movimiento ocurren sobre nuestra infraestructura, con comprobante de cada operación."
            className="flex-[1_1_340px]"
          />
        </div>
      </div>
    </section>
  );
}
