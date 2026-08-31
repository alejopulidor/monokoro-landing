import { Arrow, MonokoroMark } from "@/components/site/brand";
import { SpecList } from "@/components/shared/spec-list";
import { WhatsappDemo } from "./whatsapp-demo";
import { fmtCOP } from "@/lib/format";
import { MIN_AMOUNT_COP, RATE_BUY, waLink } from "@/lib/config";

/**
 * Hero.
 *
 * The headline and the supporting column are two `flex: 1 1 <basis>` children
 * of a wrapping flex row, baseline-aligned at the bottom. They break apart
 * when the content needs it rather than at a named breakpoint — the same
 * pattern `SectionHead` uses, and the reason this page has almost no `md:`
 * prefixes in it.
 *
 * `hero-in` is a mount-time entrance, not a scroll reveal: this block is
 * already in view when the page opens, so there is nothing to wait for. The
 * stagger is a hand-set `animation-delay` on each of the three pieces.
 */
export function Hero() {
  const buy = waLink("Hola, quiero comprar dólares digitales");

  const specs = [
    { k: "TASA HOY", v: `$ ${fmtCOP(RATE_BUY)} COP / USD` },
    { k: "DESDE", v: `$ ${fmtCOP(MIN_AMOUNT_COP)} COP` },
    { k: "ENTREGA", v: "AL MOMENTO, A TU BILLETERA" },
    { k: "VERIFICACIÓN", v: "UNA SOLA VEZ" },
  ];

  return (
    <header id="top" className="gutter pt-[clamp(44px,6.5vw,80px)]">
      <div className="shell">
        <div className="ff-m flex items-center gap-2.5 text-[12px] tracking-[0.14em] text-[var(--color-teal)]">
          <span className="relative flex h-[7px] w-[7px]" aria-hidden>
            <span
              className="absolute inset-0 rounded-full bg-[var(--color-mint)]"
              style={{ animation: "pulseRing 2.4s ease-out infinite" }}
            />
            <span className="relative h-[7px] w-[7px] rounded-full bg-[var(--color-mint)]" />
          </span>
          DÓLARES DIGITALES · COLOMBIA
        </div>

        <div className="mt-[22px] flex flex-wrap items-end gap-[clamp(24px,4vw,64px)]">
          <h1 className="hero-in h-hero min-w-0 flex-[1_1_440px]">
            Ahorra en dólares.
            <br />
            Desde WhatsApp.
          </h1>

          <div
            className="hero-in flex min-w-0 flex-[1_1_330px] flex-col gap-6 pb-2.5"
            style={{ animationDelay: ".14s" }}
          >
            <p className="text-[20px] leading-[1.5] text-[var(--color-muted)] text-pretty">
              Cotizas, confirmas la tasa y recibes en minutos. Después los gastas
              con tu tarjeta Monokoro, en dólares, donde quieras.
            </p>

            <div className="flex flex-wrap gap-3">
              <a className="mk-mag btn btn-ink" href={buy}>
                Comprar dólares por WhatsApp <Arrow />
              </a>
              <a className="mk-mag btn btn-outline" href="#cotiza">
                Ver cuánto recibes
              </a>
            </div>

            <div className="ff-m flex flex-wrap gap-x-[18px] gap-y-2 text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
              <span>SIN APPS NUEVAS</span>
              <span aria-hidden>·</span>
              <span>SIN COMISIÓN APARTE</span>
              <span aria-hidden>·</span>
              <span>SOPORTE HUMANO</span>
            </div>
          </div>
        </div>

        {/* ── The dark panel: pitch on the left, live-looking chat on the right ── */}
        <div
          className="hero-in mk-glow panel mt-[clamp(28px,5vw,54px)]"
          style={{ animationDelay: ".26s" }}
        >
          <div className="mk-aur-a" aria-hidden />
          <div className="mk-aur-b" aria-hidden />
          <div className="mk-grid" aria-hidden />
          <div className="mk-spot" aria-hidden />

          <div className="relative flex flex-wrap gap-[clamp(26px,4vw,48px)] p-[clamp(24px,4vw,48px)]">
            <div className="flex min-w-0 flex-[1_1_330px] flex-col justify-between gap-[30px]">
              <div>
                <div className="ff-m flex items-center gap-3 text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
                  <MonokoroMark size={17} variant="solid" />
                  COTIZAS → CONFIRMAS → RECIBES
                </div>
                <p className="mt-5 max-w-[470px] text-[clamp(20px,2.6vw,29px)] leading-[1.22] tracking-[-0.024em] text-[var(--color-onDark)] text-pretty">
                  Una conversación. La misma que ya tienes abierta todo el día.
                </p>
              </div>

              <SpecList items={specs} />
            </div>

            <div className="flex min-w-0 flex-[1_1_350px] justify-center">
              <WhatsappDemo />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
