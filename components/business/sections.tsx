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
  BIZ_API,
  BIZ_API_ENDPOINTS,
  BIZ_BRAND,
  BIZ_BRAND_SPECS,
  BIZ_DASH_PERKS,
  BIZ_DASH_ROWS,
  BIZ_CHAT,
  BIZ_CHAT_MS,
  BIZ_FLOW,
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
 * "Móntalo dentro de tu producto." — `#api`.
 *
 * From the v2 canvas, and it **absorbed personalización**. There used to be a
 * separate `#marca` item promising cobranded artwork inside Apple Pay and
 * Google Pay; the canvas moved that here, next to the iframe, because both are
 * the same claim seen from the buyer's side — *your users see your brand, we
 * supply the rails*. Telling it in two places was worse than either.
 *
 * `#marca` keeps the card face and the client's own issuance. If a wallet or
 * cobranding sentence reappears there, one of the two is now stale.
 *
 * ## The endpoints
 *
 * `BIZ_API_ENDPOINTS` prints three real-looking routes, and an earlier version
 * of this section deliberately printed none — a plausible-but-unverified route
 * is the same class of mistake as a plausible BIN on the card face. They are
 * here **only** because the canvas specifies them, which makes them the
 * client's own spec rather than this repo's guess. That is the whole
 * justification; if the real API differs they come out again.
 *
 * ## The iframe mock
 *
 * Browser chrome, a dashed card standing in for the client's artwork, and two
 * buttons. Deliberately **not** a `CardFace`: that component draws Monokoro's
 * card, and the entire point here is that the face belongs to someone else.
 * The dashed border is what reads as "your design goes here" rather than as a
 * card we designed badly.
 *
 * The CTA is the one place on this site that names a cost without naming a
 * figure, so it has to offer a way to ask.
 */
export function BizApi() {
  return (
    <section id="api" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="PARA EQUIPOS TÉCNICOS"
          title="Móntalo dentro de tu producto."
          lede="Si en vez de usar nuestras tarjetas quieres emitir las tuyas, tenemos API y SDK. Tus usuarios ven tu marca; nosotros ponemos la infraestructura."
        />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          <div className="rv flex min-w-0 flex-[1_1_360px] flex-col gap-[22px] rounded-[22px] bg-[var(--color-ink)] p-[clamp(26px,3.6vw,40px)] text-[var(--color-onDark)]">
            <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
              TU IFRAME, TU MARCA
            </div>

            <div
              className="overflow-hidden rounded-[16px] border border-[rgba(239,246,240,0.16)] bg-[rgba(239,246,240,0.06)]"
              role="img"
              aria-label="Ejemplo del componente embebido en la aplicación del cliente: la tarjeta con su logo y sus colores, y los botones de recargar y congelar."
            >
              <div className="flex items-center gap-[7px] border-b border-[rgba(239,246,240,0.14)] px-3.5 py-[11px]">
                <span className="h-[9px] w-[9px] rounded-full bg-[rgba(239,246,240,0.28)]" />
                <span className="h-[9px] w-[9px] rounded-full bg-[rgba(239,246,240,0.28)]" />
                <span className="h-[9px] w-[9px] rounded-full bg-[rgba(239,246,240,0.28)]" />
                <span className="ff-m ml-2 text-[10.5px] tracking-[0.1em] text-[rgba(239,246,240,0.55)]">
                  TU APP
                </span>
              </div>
              <div className="flex flex-col gap-3.5 p-[clamp(18px,3vw,24px)]">
                <div className="flex aspect-[1.585] items-center justify-center rounded-[14px] border border-dashed border-[rgba(239,246,240,0.45)] bg-[linear-gradient(140deg,#2C7A80,#4FB89E)]">
                  <span className="ff-m text-[11px] tracking-[0.12em] text-[#062A2F]">
                    TU LOGO · TUS COLORES
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 rounded-[10px] bg-[var(--color-mint)] py-2.5 text-center text-[13px] font-semibold text-[var(--color-ink)]">
                    Recargar
                  </span>
                  <span className="flex-1 rounded-[10px] border border-[rgba(239,246,240,0.28)] py-2.5 text-center text-[13px]">
                    Congelar
                  </span>
                </div>
              </div>
            </div>

            <code className="ff-m block rounded-[10px] border border-[rgba(239,246,240,0.16)] bg-[rgba(239,246,240,0.08)] px-4 py-3.5 text-[13px] leading-[1.7] whitespace-pre text-[var(--color-mint)]">
              {BIZ_API_ENDPOINTS.join("\n")}
            </code>
          </div>

          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            {BIZ_API.map((a) => (
              <div
                key={a.n}
                className="rv card mk-lift flex flex-1 flex-col gap-3 rounded-[20px] p-[clamp(24px,3vw,32px)]"
              >
                <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                  {a.n}
                </div>
                <h3 className="text-[21px] font-semibold leading-[1.15] tracking-[-0.025em]">
                  {a.t}
                </h3>
                <p className="text-base leading-[1.55] text-[var(--color-muted)] text-pretty">
                  {a.d}
                </p>
              </div>
            ))}

            <div className="rv flex flex-wrap items-center gap-x-5 gap-y-3.5 rounded-[20px] border border-[var(--color-line-soft)] bg-[#E9F0E4] p-[clamp(20px,3vw,26px)]">
              <p className="min-w-0 flex-[1_1_200px] text-base leading-[1.5] text-[var(--color-muted)] text-pretty">
                ¿Necesitas el detalle técnico o una cotización de co-branding?
              </p>
              <a
                href={waLink(
                  "Hola, quiero información sobre la API y el SDK de Monokoro",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mk-mag btn btn-ink btn-sm"
              >
                Pedir más información <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "Un solo saldo para muchas tarjetas." — `#bolsillos`.
 *
 * Copy and drawing both come from `Monokoro Negocios v2.dc.html`, the newest
 * canvas for this page. Two earlier attempts here failed for reasons worth
 * keeping written down: the first defined a bolsillo from the amount ("un
 * monto reservado del saldo") and the client could not tell what it did; the
 * second invented the word "frente". The canvas's lede is three beats in
 * order — creas, fondeas una vez, las tarjetas que le asignes consumen de
 * ahí — and it names marketing, which is the use case that makes it concrete.
 *
 * The drawing is the argument. A balance with three cards *listed* beside it
 * could mean anything; three cards each showing what they took **from** it can
 * only mean one thing. That is why every chip carries a `spend`, and why the
 * hairline runs from the balance down into the grid: it draws the relationship
 * instead of asserting it.
 *
 * The figure is a mock and says so twice, on the label and in the
 * `aria-label`. `role="img"` collapses the subtree, so the label has to carry
 * everything a sighted reader gets.
 */
export function BizPockets() {
  return (
    <section id="bolsillos" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="BOLSILLOS"
          title="Un solo saldo para muchas tarjetas."
          lede="Creas un bolsillo, lo fondeas una vez y todas las tarjetas que le asignes consumen de ahí. Ideal para marketing: no tienes que repartir el presupuesto tarjeta por tarjeta."
        />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          <div
            className="rv flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-[26px] rounded-[22px] bg-[linear-gradient(150deg,#12464C,#07242A)] p-[clamp(28px,4vw,44px)]"
            role="img"
            aria-label="Ejemplo de un bolsillo llamado Marketing Q3 con un saldo compartido de ejemplo de 8.400,00 dólares. Tres tarjetas consumen de ese mismo saldo: Meta Ads terminada en 4821, con 1.240 dólares gastados este mes; TikTok Ads terminada en 7302, con 860 dólares; y Herramientas terminada en 5514, con 312 dólares."
          >
            <div className="rounded-[18px] border border-[rgba(106,221,155,0.28)] bg-[rgba(239,246,240,0.08)] p-[clamp(18px,3vw,24px)]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                <span className="text-base font-semibold text-[var(--color-onDark)]">
                  Bolsillo · Marketing Q3
                </span>
                <span className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
                  SALDO COMPARTIDO · EJEMPLO
                </span>
              </div>
              <div className="tnum mt-3.5 text-[clamp(30px,4.4vw,42px)] font-semibold leading-none tracking-[-0.035em] text-[var(--color-onDark)]">
                {fmtUSD(8400)}{" "}
                <span className="ff-m text-[15px] tracking-normal text-[rgba(239,246,240,0.6)]">
                  USD
                </span>
              </div>
            </div>

            {/* The connector. Decorative on its own, but it is what turns a
                balance plus a list into "these draw from that". */}
            <div className="flex justify-center" aria-hidden>
              <span className="h-[26px] w-px bg-[rgba(106,221,155,0.5)]" />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
              {BIZ_POCKET_CARDS.map((c) => (
                <div
                  key={c.num}
                  className="flex flex-col gap-2 rounded-[14px] border border-[rgba(239,246,240,0.16)] bg-[rgba(239,246,240,0.06)] px-4 py-3.5"
                >
                  <span className="ff-m text-[10px] tracking-[0.12em] text-[var(--color-mint)]">
                    {c.tag}
                  </span>
                  <span className="ff-m tnum text-[12.5px] tracking-[0.1em] text-[var(--color-onDark)]">
                    {c.num}
                  </span>
                  <span className="tnum text-[12.5px] text-[rgba(239,246,240,0.62)]">
                    {c.spend}
                  </span>
                </div>
              ))}
            </div>

            <p className="ff-m text-[11px] tracking-[0.1em] text-[rgba(239,246,240,0.5)]">
              TODAS CONSUMEN DEL MISMO BOLSILLO
            </p>
          </div>

          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            {BIZ_POCKETS.map((p) => (
              <div
                key={p.n}
                className="rv card mk-lift flex flex-1 flex-col gap-3 rounded-[20px] p-[clamp(24px,3vw,32px)]"
              >
                <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                  {p.n}
                </div>
                <h3 className="text-[21px] font-semibold leading-[1.15] tracking-[-0.025em]">
                  {p.t}
                </h3>
                <p className="text-base leading-[1.55] text-[var(--color-muted)] text-pretty">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "Y si prefieres pantalla, también." — `#dashboard`.
 *
 * The id is `dashboard`, not `panel`, because that is what the canvas and the
 * product call it — and because `.panel` / `.panel-flat` are this site's dark
 * surface primitives, so a product called "panel" would collide with them the
 * moment anyone reached for a class name.
 *
 * **The mock is the canvas's decision, not this file's.** The first version of
 * this section deliberately showed nothing, on the grounds that inventing a
 * screen nobody has seen is worse than describing one. The canvas now designs
 * that screen, and a table of spend against a limit says what a dashboard is
 * *for* in a way three bullet points never did.
 *
 * Its whole point is that it does not replace the chat. `BIZ_HERO_SPECS`,
 * `BIZ_PERKS` and the closing CTA all promise WhatsApp, so the lede puts them
 * in order — WhatsApp is the shortcut, the dashboard is the full view — rather
 * than correcting them.
 *
 * Marked `role="img"`: every figure in it is invented, and a screen reader
 * walking the cells would meet four fake balances as if they were the
 * visitor's own.
 */
export function BizDashboard() {
  return (
    <section id="dashboard" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="DASHBOARD"
          title="Y si prefieres pantalla, también."
          lede="WhatsApp es el atajo; el dashboard de administración es la vista completa. Todas tus tarjetas y bolsillos en un lugar, con todo lo que necesitas para gestionarlos."
        />

        <div
          className="rv mt-[clamp(32px,4vw,48px)] overflow-hidden rounded-[22px] border border-[rgba(13,46,51,0.1)] bg-white"
          role="img"
          aria-label="Vista de ejemplo del dashboard: las tarjetas activas del bolsillo Marketing Q3, con su gasto del mes, su límite y su estado. Meta Ads terminada en 4821, 1.240 dólares, sin límite, activa. TikTok Ads terminada en 7302, 860 dólares, límite de 1.500 al mes, activa. Herramientas terminada en 5514, 312 dólares, límite de 500 al mes, activa. Viáticos de Laura Gómez terminada en 9037, 148,50 dólares, límite de 300, congelada."
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 border-b border-[rgba(13,46,51,0.1)] bg-[rgba(13,46,51,0.03)] px-[clamp(18px,3vw,28px)] py-[18px]">
            <span className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-faint)]">
              TARJETAS ACTIVAS · BOLSILLO MARKETING Q3
            </span>
            <span className="text-[14.5px] font-medium text-[var(--color-teal)]">
              Exportar movimientos
            </span>
          </div>

          {/* Scrolls rather than squashing: four columns do not fit a phone. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[330px] border-collapse text-left">
              <thead>
                <tr className="ff-m text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
                  <th
                    scope="col"
                    className="w-[42%] px-[clamp(11px,2vw,24px)] py-3.5 font-normal"
                  >
                    TARJETA
                  </th>
                  <th
                    scope="col"
                    className="px-[clamp(11px,2vw,24px)] py-3.5 font-normal"
                  >
                    GASTO DEL MES
                  </th>
                  {/* Four columns need 540px, so the table scrolls — but on a
                      phone that puts ESTADO out of reach, and the frozen pill
                      is the one cell that shows the dashboard is for *acting*.
                      Dropping LÍMITE below 560px keeps the three that carry the
                      point. The `aria-label` still describes all four. */}
                  <th
                    scope="col"
                    className="hidden px-[clamp(11px,2vw,24px)] py-3.5 font-normal min-[560px]:table-cell"
                  >
                    LÍMITE
                  </th>
                  <th
                    scope="col"
                    className="px-[clamp(11px,2vw,24px)] py-3.5 font-normal"
                  >
                    ESTADO
                  </th>
                </tr>
              </thead>
              <tbody>
                {BIZ_DASH_ROWS.map((r) => (
                  <tr
                    key={r.num}
                    className="border-t border-[rgba(13,46,51,0.09)] text-[15px]"
                  >
                    <th
                      scope="row"
                      className="px-[clamp(11px,2vw,24px)] py-4 text-left font-medium"
                    >
                      <span className="flex flex-col gap-[3px]">
                        <span>{r.name}</span>
                        <span className="ff-m tnum text-xs font-normal tracking-[0.08em] text-[var(--color-faint)]">
                          {r.num}
                        </span>
                      </span>
                    </th>
                    <td className="tnum px-[clamp(11px,2vw,24px)] py-4 text-[var(--color-muted)]">
                      {r.spend}
                    </td>
                    <td className="tnum hidden px-[clamp(11px,2vw,24px)] py-4 text-[var(--color-muted)] min-[560px]:table-cell">
                      {r.limit}
                    </td>
                    <td className="px-[clamp(11px,2vw,24px)] py-4">
                      <span
                        className={cx(
                          "inline-block rounded-full px-3 py-[5px] text-[12.5px] font-medium",
                          r.off
                            ? "bg-[rgba(13,46,51,0.08)] text-[var(--color-muted)]"
                            : "bg-[rgba(106,221,155,0.18)] text-[#1B6B4A]",
                        )}
                      >
                        {r.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {BIZ_DASH_PERKS.map((d) => (
            <div
              key={d.t}
              className="rv card flex flex-col gap-2.5 rounded-[20px] p-[clamp(22px,3vw,28px)]"
            >
              <h3 className="text-[19px] font-semibold leading-[1.15] tracking-[-0.02em]">
                {d.t}
              </h3>
              <p className="text-[15.5px] leading-[1.55] text-[var(--color-muted)] text-pretty">
                {d.d}
              </p>
            </div>
          ))}
        </div>
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
          lede="Emítelas cobrandeadas para tu equipo, tus clientes o tu propio producto. Nosotros ponemos la infraestructura en dólares digitales; la cara la pones tú. Llevar tu marca a la wallet se cotiza aparte — el detalle está más abajo, con la API."
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
