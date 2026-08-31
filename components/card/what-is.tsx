import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { FlowList } from "@/components/shared/flow-list";
import { CARD_FLOW } from "@/content/card";
import { postHref } from "@/content/posts";

/**
 * "Compra donde sea. El respaldo son dólares."
 *
 * The three paragraphs do distinct jobs and none is padding: the first says
 * there is no conversion on a dollar charge, the second says the card still
 * works for everything else — including at a physical counter, which is what
 * Apple Pay / Google Pay is doing in there — and the third names the
 * instrument: tokenized digital dollars, in the customer's own wallet. That
 * third one is the compliance sentence; do not soften it into "tu saldo".
 *
 * Note the two senses of "wallet" on this page. The customer's *billetera* is
 * where the dollars live; Apple Pay / Google Pay is where the card lives. They
 * are unrelated, and the copy never uses the Spanish word for the second one.
 */
export function CardWhatIs() {
  return (
    <section id="que-es" className="sec-lg gutter">
      <div className="shell">
        <div className="eyebrow">QUÉ ES</div>

        <div className="mt-6 flex flex-wrap gap-[clamp(28px,4vw,56px)]">
          <div className="rv flex min-w-0 flex-[1_1_420px] flex-col gap-[22px]">
            <h2 className="text-[clamp(32px,5.2vw,64px)] font-semibold leading-none tracking-[-0.042em] text-balance">
              Compra donde sea. El respaldo son dólares.
            </h2>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              La tarjeta está denominada en dólares. Cuando pagas una suscripción
              o un vuelo, el comercio pide dólares y la tarjeta entrega dólares:
              no hay conversión en el momento del cobro ni recargo por moneda
              extranjera.
            </p>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              Y sirve para todo lo demás. La agregas a Apple Pay o Google Pay
              y pagas en tienda con el celular; si el comercio cobra en pesos,
              la tarjeta convierte desde tu saldo con la tasa Monokoro — la
              misma que ves en el chat, sin recargos escondidos encima.
            </p>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-[var(--color-muted)] text-pretty">
              El respaldo son dólares digitales tokenizados: cada unidad vale un
              dólar y está a tu nombre, en tu billetera. Compras el saldo en el
              mismo chat a la tasa del día y lo que no gastas sigue guardado en
              dólares, no en pesos.
            </p>
            <Link
              href={postHref("que-es-un-dolar-digital")}
              className="flex items-center gap-2.5 self-start border-b border-[rgba(44,122,128,0.35)] pb-[3px] text-[17px] font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
            >
              Qué es un dólar digital · 3 min <Arrow />
            </Link>
          </div>

          <FlowList title="EL RECORRIDO DE TU PLATA" steps={CARD_FLOW} />
        </div>
      </div>
    </section>
  );
}
