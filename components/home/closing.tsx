import { Arrow, MonokoroMark } from "@/components/site/brand";
import { fmtCOP } from "@/lib/format";
import { MIN_AMOUNT_COP, waLink } from "@/lib/config";

/** The closing CTA panel. Lighter gradient than the other dark panels so it
 *  reads as the end of the page rather than as another section. */
export function Closing() {
  return (
    <section className="gutter pt-[clamp(72px,10vw,124px)]">
      <div
        className="rv mk-glow panel shell"
        style={{
          background: "linear-gradient(150deg,#14545A,#07242A)",
          boxShadow:
            "0 60px 110px -60px rgba(4,22,26,.95),inset 0 1px 0 rgba(239,246,240,.1)",
        }}
      >
        <div className="mk-aur-a" aria-hidden />
        <div className="mk-aur-b" aria-hidden />
        <div className="mk-grid" aria-hidden />
        <div className="mk-spot" aria-hidden />

        <div className="relative flex flex-col items-center gap-[22px] px-[clamp(24px,4vw,48px)] py-[clamp(60px,9vw,104px)] text-center">
          <MonokoroMark size={46} variant="solid" />

          <div className="ff-m tnum text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
            DESDE $ {fmtCOP(MIN_AMOUNT_COP)} COP · VERIFICACIÓN UNA SOLA VEZ
          </div>

          <h2 className="max-w-[840px] text-[clamp(34px,6vw,76px)] font-semibold leading-[0.98] tracking-[-0.042em] text-[var(--color-onDark)] text-balance">
            Tu primer dólar está a un mensaje.
          </h2>

          <p className="max-w-[520px] text-[19px] leading-[1.55] text-[rgba(239,246,240,0.9)]">
            Cotizas, confirmas la tasa y recibes. Todo en el chat que ya tienes
            abierto.
          </p>

          <a
            className="mk-mag btn btn-mint mt-2"
            href={waLink("Hola, quiero comprar dólares digitales")}
          >
            Comprar dólares por WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
