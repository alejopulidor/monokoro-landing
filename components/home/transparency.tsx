import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { postHref } from "@/content/posts";

const TRUST = [
  { k: "VERIFICACIÓN", v: "UNA SOLA VEZ" },
  { k: "PAGOS", v: "LINK SEGURO · TRAZABLE" },
  { k: "DATOS", v: "CIFRADOS" },
  { k: "SOPORTE", v: "HUMANO, NO BOT" },
];

/**
 * "¿Qué es un dólar digital?" — the section that answers the objection before
 * the FAQ has to.
 *
 * Two claims here are load-bearing and must not be softened into marketing:
 * that the asset is USDT, and that WhatsApp is only the support channel while
 * verification, payment and delivery happen on Monokoro's own infrastructure.
 * Naming the instrument plainly is the whole point of the section — the copy
 * even says so ("te lo contamos porque no tenemos nada que esconder").
 */
export function Transparency() {
  return (
    <section id="confianza" className="sec-lg gutter">
      <div className="shell">
        <div className="eyebrow">TRANSPARENCIA</div>

        <div className="mt-6 flex flex-wrap items-start gap-[clamp(28px,4vw,64px)]">
          <h2 className="rv h-section min-w-0 flex-[1_1_420px]">
            ¿Qué es un dólar digital?
          </h2>

          <div className="rv flex min-w-0 flex-[1_1_340px] flex-col gap-[18px]">
            <p className="lede">
              Es una moneda que siempre vale un dólar estadounidense. Funciona
              como los dólares en efectivo, pero vive en internet: los guardas,
              los mueves en minutos y los vendes cuando quieras volver a pesos.
            </p>
            <p className="lede">
              Con Monokoro los recibes en tu cuenta y decides: los dejas
              guardados, los gastas con tarjeta o los vendes de vuelta.
            </p>
            <Link
              href={postHref("que-es-un-dolar-digital")}
              className="flex items-center gap-2.5 self-start border-b border-[rgba(44,122,128,0.35)] pb-[3px] text-[17px] font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
            >
              Leer la guía completa · 3 min <Arrow />
            </Link>
          </div>
        </div>

        <div
          className="mt-[clamp(34px,5vw,52px)] grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div className="rv card flex flex-col gap-4 p-[clamp(26px,3vw,38px)]">
            <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
              SON TUYOS
            </div>
            <h3 className="text-[clamp(22px,2.8vw,29px)] font-semibold leading-[1.13] tracking-[-0.03em]">
              ¿De quién son los dólares?
            </h3>
            <p className="text-[16.5px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              Tuyos. Tú los compras, nosotros te los entregamos. No le estás
              prestando tu plata a nadie: decides cuándo guardarlos, gastarlos o
              venderlos de vuelta.
            </p>
            <p className="border-t border-[rgba(13,46,51,0.1)] pt-4 text-[15px] leading-[1.6] text-[var(--color-faint)] text-pretty">
              Técnicamente son USDT, la moneda digital más usada del mundo,
              diseñada para mantener el valor de un dólar. Te lo contamos porque
              no tenemos nada que esconder.
            </p>
          </div>

          <div className="rv mk-glow panel-flat flex flex-col gap-4 p-[clamp(26px,3vw,38px)]">
            <div className="mk-aur-a opacity-40" aria-hidden />
            <div className="mk-spot" aria-hidden />
            <div className="ff-m relative text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
              SEGURIDAD
            </div>
            <h3 className="relative text-[clamp(22px,2.8vw,29px)] font-semibold leading-[1.13] tracking-[-0.03em]">
              Qué hay detrás del chat
            </h3>

            <dl className="relative flex flex-col">
              {TRUST.map((t) => (
                <div key={t.k} className="spec-row">
                  <dt>{t.k}</dt>
                  <dd className="text-[var(--color-mint)]">{t.v}</dd>
                </div>
              ))}
              <div className="border-t border-[rgba(239,246,240,0.2)]" aria-hidden />
            </dl>

            <p className="relative text-[15px] leading-[1.6] text-[rgba(239,246,240,0.62)] text-pretty">
              WhatsApp es el canal de atención. La verificación, el pago y la
              entrega ocurren sobre nuestra infraestructura, con comprobante de
              cada operación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
