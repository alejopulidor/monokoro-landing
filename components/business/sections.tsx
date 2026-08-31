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
import { fmtCOP, fmtUSD } from "@/lib/format";
import { RATE_BUY, RATE_CARD, RATE_SELL, waLink } from "@/lib/config";
import { cx } from "@/lib/cx";
import {
  BIZ_BRAND,
  BIZ_BRAND_SPECS,
  BIZ_CHAT,
  BIZ_CHAT_MS,
  BIZ_FLOW,
  BIZ_PANEL,
  BIZ_PERKS,
  BIZ_POCKET_CARDS,
  BIZ_POCKETS,
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
            height={550}
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
 * The band that closes `#api`, passed in through `RuledList`'s `after` slot.
 *
 * The canvas had a dark band here with a `POST /v1/cards` chip and a
 * "Ver documentación →" link whose `href` was `#`. Neither shipped, and the
 * endpoint chip still should not: printing a plausible-but-unverified route is
 * the same class of mistake as printing a plausible BIN on the card face. So
 * the band asks for access instead, which is true today and is also how the
 * SDK and the iframe actually get handed over.
 *
 * `lib/nav.ts` already has the `ready` flag for the day a docs page exists —
 * that is where the link belongs then, not here.
 */
export function BizApiAccess() {
  return (
    <div className="rv panel-flat mt-[clamp(30px,4vw,44px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-6 p-[clamp(26px,3.4vw,40px)]">
      <div className="min-w-0 flex-[1_1_400px]">
        <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
          PARA EMPEZAR A INTEGRAR
        </div>
        <p className="mt-4 max-w-[560px] text-[clamp(19px,2.4vw,26px)] leading-[1.25] tracking-[-0.025em] text-pretty">
          Te damos las credenciales, la documentación y el SDK, y un equipo
          acompaña la primera integración.
        </p>
      </div>
      <a
        href={waLink(
          "Hola, quiero integrar por API. ¿Me pasan el acceso y la documentación?",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mk-mag btn btn-paper"
      >
        Pedir el acceso <Arrow />
      </a>
    </div>
  );
}

/**
 * "Un saldo por frente, y las tarjetas que hagan falta."
 *
 * The two-column shape `BizBrand` uses: something drawn on the left, the
 * reasons on the right. The drawing is the argument here -- "varias tarjetas
 * consumen del mismo saldo" is one of those claims a diagram settles in a
 * second and a paragraph never quite does.
 *
 * The figure is a **mock**, and it is labelled as one twice: `SALDO DE EJEMPLO`
 * on the panel and again inside the `aria-label`. Same rule as `CardFace`'s
 * balance -- a number on this site that is not marked referential or as an
 * example is a bug. And `role="img"` collapses the subtree, so the label has to
 * carry everything a sighted reader gets.
 */
export function BizPockets() {
  return (
    <section id="bolsillos" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="BOLSILLOS"
          title="Un saldo por frente, y las tarjetas que hagan falta."
          lede="Un bolsillo es un monto reservado del saldo del negocio, y varias tarjetas consumen del mismo. El gasto de pauta queda separado del de proveedores sin que tengas que repartir montos tarjeta por tarjeta."
        />

        <div className="mt-[clamp(30px,4vw,46px)] flex flex-wrap gap-5">
          <div
            className="rv panel-flat flex min-w-0 flex-[1_1_320px] flex-col self-start p-[clamp(26px,3.4vw,38px)]"
            role="img"
            aria-label="Ejemplo de un bolsillo llamado Pauta con un saldo de ejemplo de 4.500,00 dólares, del que consumen tres tarjetas: Meta Ads terminada en 4821, TikTok Ads terminada en 7302 y Google Ads terminada en 5140."
          >
            <div className="ff-m text-[11px] tracking-[0.14em] text-[var(--color-mint)]">
              BOLSILLO · PAUTA
            </div>
            <div className="tnum mt-3 text-[clamp(34px,4.6vw,52px)] font-semibold leading-none tracking-[-0.04em]">
              {fmtUSD(4500)}{" "}
              <span className="text-[0.42em] font-medium">USD</span>
            </div>
            <div className="ff-m mt-2.5 text-[10.5px] tracking-[0.14em] text-[rgba(239,246,240,0.5)]">
              SALDO DE EJEMPLO
            </div>

            <SpecList
              items={BIZ_POCKET_CARDS}
              className="mt-[clamp(22px,3vw,30px)]"
            />

            <div className="ff-m mt-4 text-[10.5px] tracking-[0.14em] text-[rgba(239,246,240,0.5)]">
              TRES TARJETAS · UN SOLO SALDO
            </div>
          </div>

          <CardGrid
            items={BIZ_POCKETS}
            min={250}
            className="min-w-0 flex-[1_1_420px] content-start gap-4"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * "Todo lo que pasa por el chat, también lo ves en un panel."
 *
 * The one section that introduces a *second* place to operate, which is why the
 * copy is additive rather than corrective. `BIZ_HERO_SPECS`, `BIZ_PERKS`, the
 * compare table and the closing CTA all promise WhatsApp; the panel is where a
 * team *reads* the operation, and the chat stays the fast path for changing it.
 * Reword it as a replacement and eight other strings start lying.
 *
 * The `id` is `panel`, and that is the only place the word may appear as an
 * identifier: `.panel` and `.panel-flat` in `app/globals.css` are the dark
 * surface primitives, so a class named after this product would collide with
 * them. Product word in the copy and the anchor, never in a class name.
 */
export function BizPanel() {
  return (
    <section id="panel" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="ADMINISTRACIÓN"
          title="Todo lo que pasa por el chat, también lo ves en un panel."
          lede="El chat sigue siendo lo más rápido para crear o congelar una tarjeta. El panel es donde tu equipo lo ve todo junto: cada tarjeta, cada bolsillo y cada movimiento."
        />
        <CardGrid items={BIZ_PANEL} min={240} className="mt-[clamp(32px,4vw,48px)]" />
      </div>
    </section>
  );
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
          <RateCard label="FONDEAS A" value={`$ ${fmtCOP(RATE_BUY)}`} count={RATE_BUY} />
          <RateCard label="VENDES A" value={`$ ${fmtCOP(RATE_SELL)}`} count={RATE_SELL} />
          <RateCard
            tone="dark"
            label="GASTO CON TARJETA"
            value={`$ ${fmtCOP(RATE_CARD)}`}
            count={RATE_CARD}
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
                    on a mock implies a client relationship that does not exist.
                    `watermark={false}` for the same reason — the section's whole
                    claim is that this face is the client's, so Monokoro's
                    isotipo embossed across it would contradict the copy. The
                    "POWERED BY MONOKORO" line below is where the attribution
                    belongs. */}
                <CardFace
                  compact
                  watermark={false}
                  label="TU LOGO AQUÍ"
                  last4="0000"
                />
                <div className="ff-m mt-4 text-center text-[10px] tracking-[0.14em] text-[rgba(239,246,240,0.55)]">
                  POWERED BY MONOKORO
                </div>
              </div>
            </div>
            <SpecList
              items={BIZ_BRAND_SPECS}
              className="rv panel-flat rounded-[22px] p-[clamp(22px,3vw,28px)]"
            />
            {/* The only place on the site that names a cost without naming a
                figure, so it needs somewhere to ask. Same quiet link treatment
                as the article link in `BizWhatIs` — never a second button, or
                it competes with the page's one CTA. */}
            <a
              href={waLink(
                "Hola, quiero saber qué incluye el cobranding de las tarjetas y cuánto cuesta",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 self-start border-b border-[rgba(44,122,128,0.35)] pb-[3px] text-[17px] font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
            >
              Pedir el detalle del cobranding <Arrow />
            </a>
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
