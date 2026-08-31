import { Arrow, MonokoroMark } from "@/components/site/brand";
import { SpecList } from "./spec-list";
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
                <CardFace />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The card itself. Drawn in the DOM rather than shipped as an image: it stays
 * crisp at any size, costs no request, and the holder/balance are real text.
 *
 * The aspect ratio is 1.585 — the ISO/IEC 7810 ID-1 ratio a real card has, so
 * it reads as a card and not as a rounded rectangle. The number is masked; the
 * visible digits are not a usable range.
 */
function CardFace() {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-[rgba(106,221,155,0.28)] shadow-[0_44px_84px_rgba(3,20,24,.6)]"
      style={{
        aspectRatio: "1.585",
        background:
          "linear-gradient(140deg,#0D2E33 0%,#2C7A80 62%,#4FB89E 100%)",
      }}
      role="img"
      aria-label="Tarjeta Monokoro en dólares, con saldo de ejemplo"
    >
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-30"
        aria-hidden
      >
        <circle cx="330" cy="52" r="120" fill="#6ADD9B" opacity=".3" />
        <circle cx="330" cy="52" r="76" fill="#0D2E33" opacity=".3" />
      </svg>

      {/* Specular sweep. Clipped by the rounded parent. */}
      <div
        className="absolute left-0 top-0 h-full w-[34%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)]"
        style={{ animation: "sheen 7s ease-in-out 1.2s infinite" }}
        aria-hidden
      />

      <div className="relative flex min-h-full flex-col justify-between gap-2.5 p-[clamp(14px,3vw,28px)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <MonokoroMark size={22} variant="solid" color="#FFFFFF" />
            <span className="text-base font-semibold tracking-[-0.015em] text-[var(--color-onDark)]">
              Monokoro
            </span>
          </div>
          <span className="ff-m text-[11.5px] tracking-[0.16em] text-[var(--color-mint)]">
            USD
          </span>
        </div>

        <div className="flex flex-col gap-[clamp(8px,2.2vw,16px)]">
          <div className="ff-m tnum text-[clamp(13px,2.2vw,19px)] tracking-[0.12em] text-[var(--color-onDark)]">
            •••• •••• •••• 4821
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="ff-m text-[9.5px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                TITULAR
              </div>
              <div className="mt-[3px] text-sm text-[var(--color-onDark)]">
                MARIANA TORRES
              </div>
            </div>
            <div className="text-right">
              <div className="ff-m text-[9.5px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                SALDO
              </div>
              <div className="tnum mt-[3px] text-sm text-[var(--color-mint)]">
                614,25 USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
