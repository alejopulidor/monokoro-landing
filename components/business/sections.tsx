import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { SectionHead } from "@/components/shared/section-head";
import { SpecList } from "@/components/shared/spec-list";
import { FlowList } from "@/components/shared/flow-list";
import { CardGrid } from "@/components/shared/card-grid";
import { AgentChat } from "@/components/shared/agent-chat";
import { ColoredSteps } from "@/components/shared/colored-steps";
import { RateCard } from "@/components/shared/rate-card";
import { TopUp } from "@/components/shared/topup";
import { TrustPanel } from "@/components/shared/trust-panel";
import { CardFace } from "@/components/shared/card-face";
import { postHref } from "@/content/posts";
import { fmtCOP } from "@/lib/format";
import { RATE_BUY, RATE_CARD, RATE_SELL } from "@/lib/config";
import { cx } from "@/lib/cx";
import {
  BIZ_BRAND,
  BIZ_BRAND_SPECS,
  BIZ_CHAT,
  BIZ_CHAT_MS,
  BIZ_FLOW,
  BIZ_PERKS,
  BIZ_PROBLEM,
  BIZ_REQUIREMENTS,
  BIZ_STEPS,
  BIZ_TRUST,
} from "@/content/business";

/**
 * "Tu banco no fue hecho para un negocio digital."
 *
 * Three labelled cards rather than the ruled list the other pages use: this is
 * a chain — bottleneck, cost, what it should be — and the middle card is dark
 * because the cost is the argument the rest hangs off.
 */
export function BizProblem() {
  return (
    <section id="problema" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="EL PROBLEMA"
          title="Tu banco no fue hecho para un negocio digital."
          lede="Tu campaña está escalando y a las 11 de la noche el banco rechaza el cobro de Meta. Pauta pausada, ventas perdidas, y a rogarle a un call center al otro día."
        />

        <div
          className="mt-[clamp(30px,4vw,46px)] grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}
        >
          {BIZ_PROBLEM.map((c) => (
            <div
              key={c.k}
              className={cx(
                "rv flex flex-col gap-4 rounded-[22px] p-[clamp(24px,3vw,34px)]",
                c.dark
                  ? "panel-flat shadow-[0_40px_80px_-56px_rgba(13,46,51,.95)]"
                  : "card",
              )}
            >
              <div
                className={cx(
                  "ff-m text-[11px] tracking-[0.12em]",
                  c.dark
                    ? "text-[var(--color-mint)]"
                    : "text-[var(--color-teal)]",
                )}
              >
                {c.k}
              </div>
              <p
                className={cx(
                  "text-[clamp(19px,2.4vw,24px)] font-medium leading-[1.25] tracking-[-0.02em] text-pretty",
                  c.dark ? "text-[var(--color-onDark)]" : "",
                )}
              >
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Una tesorería en dólares que vive en el chat." */
export function BizWhatIs() {
  return (
    <section id="que-es" className="sec-lg gutter">
      <div className="shell">
        <div className="eyebrow">QUÉ ES</div>

        <div className="mt-6 flex flex-wrap gap-[clamp(28px,4vw,56px)]">
          <div className="rv flex min-w-0 flex-[1_1_420px] flex-col gap-[22px]">
            <h2 className="text-[clamp(32px,5.2vw,64px)] font-semibold leading-none tracking-[-0.042em] text-balance">
              Una tesorería en dólares que vive en el chat.
            </h2>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              El negocio fondea en pesos y el saldo queda en dólares digitales
              tokenizados, en la billetera de la empresa y a su nombre. Desde ese
              saldo emites las tarjetas que necesites: una por campaña, por
              cliente, por proveedor o por persona.
            </p>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              Cada tarjeta paga en dólares lo que se cobra en dólares, y en pesos
              lo local — convirtiendo desde el saldo con la tasa Monokoro, la
              misma que ves en el chat. Sin recargos escondidos encima.
            </p>
            <Link
              href={postHref("que-es-un-dolar-digital")}
              className="flex items-center gap-2.5 self-start border-b border-[rgba(44,122,128,0.35)] pb-[3px] text-[17px] font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
            >
              Qué es un dólar digital · 3 min <Arrow />
            </Link>
          </div>

          <FlowList title="EL RECORRIDO DE LA PLATA" steps={BIZ_FLOW} />
        </div>
      </div>
    </section>
  );
}

/** "Tres pasos y estás pautando." */
export function BizHow() {
  return (
    <section id="como" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="CÓMO FUNCIONA"
          title="Tres pasos y estás pautando."
          lede="Verificas el negocio una sola vez. Después, cada tarjeta nueva sale del chat en minutos."
        />
        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          <AgentChat
            script={BIZ_CHAT}
            durations={BIZ_CHAT_MS}
            minHeight={300}
            label="Ejemplo de la conversación en WhatsApp: pides una tarjeta de viáticos para alguien del equipo, la autorizas con un código y le llega a esa persona."
          />
          <ColoredSteps steps={BIZ_STEPS} />
        </div>
      </div>
    </section>
  );
}

/** The four reasons, under the use cases. */
export function BizPerks() {
  return <CardGrid items={BIZ_PERKS} min={240} className="mt-5" />;
}

/**
 * "Sin cargos sorpresa en el extracto."
 *
 * All three rates on one screen. Showing the buy and sell rates next to the
 * card rate is what stops the card rate from looking arbitrary — and the card
 * rate is the one people find out about at checkout if a site hides it.
 */
export function BizRates() {
  return (
    <section id="tasas" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="TRANSPARENCIA"
          title="Sin cargos sorpresa en el extracto."
          lede="Las tres tasas que existen, a la vista. La de la tarjeta es distinta porque incluye los costos de procesamiento internacional de la red de pagos."
        />

        <div
          className="mt-[clamp(30px,4vw,46px)] grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
        >
          <RateCard label="FONDEAS A" value={`$ ${fmtCOP(RATE_BUY)}`} />
          <RateCard label="VENDES A" value={`$ ${fmtCOP(RATE_SELL)}`} />
          <RateCard
            tone="dark"
            label="GASTO CON TARJETA"
            value={`$ ${fmtCOP(RATE_CARD)}`}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-5">
          <TopUp
            heading="SIMULA UNA RECARGA"
            initial="2000000"
            message="Hola, quiero recargar una tarjeta empresarial"
          />
          <TrustPanel
            title="Qué hay detrás del chat"
            specs={BIZ_TRUST}
            note="WhatsApp es el canal de atención. La verificación del negocio, el fondeo y la emisión de cada tarjeta ocurren sobre nuestra infraestructura, con comprobante de cada operación."
            className="flex-[1_1_320px]"
          />
        </div>
      </div>
    </section>
  );
}

/** "Tarjetas con tu marca, no con la nuestra." */
export function BizBrand() {
  return (
    <section id="marca" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="PERSONALIZACIÓN"
          title="Tarjetas con tu marca, no con la nuestra."
          lede="Emítelas cobrandeadas para tu equipo, tus clientes o tu propio producto. Nosotros ponemos la infraestructura en dólares digitales; la cara la pones tú."
        />

        <div className="mt-[clamp(30px,4vw,46px)] flex flex-wrap gap-5">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <div className="rv flex items-center justify-center rounded-[24px] bg-[linear-gradient(150deg,#12464C,#07242A)] p-[clamp(26px,4vw,44px)]">
              <div className="w-[min(320px,80vw)]">
                {/* A blank card standing in for the customer's own artwork.
                    Deliberately not a real brand: putting someone else's logo
                    on a mock implies a client relationship that does not exist. */}
                <CardFace compact label="TU LOGO AQUÍ" last4="0000" />
                <div className="ff-m mt-4 text-center text-[10px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                  POWERED BY MONOKORO
                </div>
              </div>
            </div>
            <SpecList
              items={BIZ_BRAND_SPECS}
              className="rv panel-flat rounded-[22px] p-[clamp(22px,3vw,28px)]"
            />
          </div>

          <CardGrid
            items={BIZ_BRAND}
            min={210}
            className="min-w-0 flex-[1_1_380px] content-start gap-4"
          />
        </div>
      </div>
    </section>
  );
}

/** "Tres cosas y estás andando." Requirements + the security panel. */
export function BizStart() {
  return (
    <section id="empezar" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="EMPEZAR"
          title="Tres cosas y estás andando."
          lede="Sin comité de crédito, sin sucursal y sin esperar días hábiles. La verificación del negocio se hace una sola vez."
        />
        <CardGrid
          items={BIZ_REQUIREMENTS}
          min={240}
          lift={false}
          className="mt-[clamp(30px,4vw,46px)]"
        />
      </div>
    </section>
  );
}
