import { Arrow } from "@/components/site/brand";
import { CardFace } from "@/components/shared/card-face";
import { SpecList } from "@/components/shared/spec-list";
import { isReady } from "@/lib/nav";
import { waLink } from "@/lib/config";

const SPECS = [
  { k: "CREACIÓN", v: "EN MINUTOS, DESDE EL CHAT" },
  { k: "GASTO", v: "EN DÓLARES, AUNQUE GANES EN PESOS" },
  { k: "CONTROL", v: "CONGELA · RECARGA · ELIMINA" },
  { k: "TASA", v: "VISIBLE ANTES DE CADA RECARGA" },
];

/**
 * The card section.
 *
 * The design links the two CTAs at `/tarjeta` and `/negocios`. Neither page
 * exists yet, so both fall back to a WhatsApp conversation and to the quoter —
 * a link that 404s costs more trust than a slightly different CTA. `isReady`
 * reads `lib/nav.ts`, so building either page and flipping its flag restores
 * the intended links here without touching this file's markup.
 *
 * `perspective` sits on the wrapper, not on `#mk-card`: the 3D tilt written by
 * `SiteEffects` needs a perspective on an *ancestor* to read as depth. On the
 * element itself it flattens into a shear.
 */
export function CardSection() {
  const cardPageReady = isReady("/tarjeta");
  const businessPageReady = isReady("/negocios");

  return (
    <section className="sec-lg gutter">
      <div className="mk-glow panel shell">
        <div className="mk-aur-b" aria-hidden />
        <div className="mk-grid" aria-hidden />
        <div className="mk-spot" aria-hidden />

        <div className="relative flex flex-wrap gap-[clamp(32px,4vw,52px)] px-[clamp(24px,4vw,56px)] py-[clamp(30px,4.4vw,60px)]">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col justify-between gap-[34px]">
            <div>
              <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
                TARJETA MONOKORO
              </div>
              <h2 className="mt-[22px] text-[clamp(32px,5.2vw,64px)] font-semibold leading-none tracking-[-0.042em] text-[var(--color-onDark)] text-balance">
                Tus dólares, listos para gastar.
              </h2>
              <p className="mt-6 max-w-[460px] text-[19px] leading-[1.55] text-[rgba(239,246,240,0.9)] text-pretty">
                No solo los guardes. Creas la tarjeta desde el mismo chat y pagas
                Netflix, Spotify, vuelos o compras internacionales directo desde
                tu saldo en dólares.
              </p>
            </div>

            <SpecList items={SPECS} />

            <div className="flex flex-wrap gap-3">
              <a
                className="mk-mag btn btn-paper"
                href={
                  cardPageReady
                    ? "/tarjeta"
                    : waLink("Hola, quiero saber más de la tarjeta Monokoro")
                }
              >
                Conoce la tarjeta <Arrow />
              </a>
              <a
                className="mk-mag btn btn-ghost-dark"
                href={
                  businessPageReady
                    ? "/negocios"
                    : waLink("Hola, quiero tarjetas Monokoro para mi negocio")
                }
              >
                Tarjetas para negocios
              </a>
            </div>
          </div>

          <div
            className="flex min-w-0 flex-[1_1_320px] items-center justify-center"
            style={{ perspective: "1500px" }}
          >
            <div id="mk-card" className="w-full max-w-[420px]">
              <div style={{ animation: "floatY 8s ease-in-out infinite" }}>
                <CardFace
                  label="USD"
                  holder="MARIANA TORRES"
                  balance="614,25 USD"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
