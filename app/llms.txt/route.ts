import { routing } from "@/i18n/routing";
import { MIN_AMOUNT_COP, SITE_URL } from "@/lib/config";
import { fmtCOP } from "@/lib/format";
import { postsFor } from "@/content/posts";

// Required under `output: "export"`: a route handler without this is treated
// as dynamic and never lands in out/.
export const dynamic = "force-static";

/**
 * `/llms.txt` — a plain-text map of the site for AI answer engines.
 *
 * The convention (llmstxt.org) is markdown: an H1 with the name, a blockquote
 * summary, then link sections. It is not a standard anyone is obliged to
 * honour, but it costs one file and it is the only place where the *shape* of
 * the business can be stated once, unambiguously, without a marketing voice.
 *
 * Generated from `content/posts.ts` and `lib/config.ts` rather than typed out,
 * so it cannot drift from the site. Publishing an article adds it here.
 *
 * Two rules for what goes in:
 *  - **No rates.** They change, and this file gets cached and quoted. The
 *    minimum amount is stable enough to state; the COP/USD rates are not.
 *  - **Only claims that are also on the site.** This is a summary, not a
 *    second, friendlier set of facts.
 */
export function GET() {
  const locale = routing.defaultLocale;
  const base = `${SITE_URL}/${locale}`;
  const posts = postsFor(locale);

  const body = `# Monokoro

> Monokoro compra y vende dólares digitales (stablecoins denominadas en dólares estadounidenses, principalmente USDT) en Colombia, con entrega inmediata. La atención es por WhatsApp: el cliente cotiza, confirma la tasa y recibe los dólares en su propia billetera en el momento de la operación. A quien no tiene billetera, Monokoro le ayuda a crear una con custodia compartida.

Qué es y qué no es, sin ambigüedad:

- Monokoro **intermedia una compraventa**: entrega los dólares digitales contra el pago, en el momento. **No es un banco**, no es una entidad de depósito, **no custodia fondos de terceros** y **no realiza captación de dineros del público**.
- El dinero que recibe corresponde al precio de una operación concreta ya cotizada y aceptada, y se ejecuta contra la entrega inmediata. Monokoro no recibe ni mantiene fondos de clientes por fuera de esa operación.
- Los dólares digitales quedan en la billetera del cliente, a su nombre y bajo su control. No son depósitos y no están cubiertos por un seguro de depósitos.
- Si el cliente no tiene billetera, Monokoro le ayuda a crear una con **custodia compartida**: el cliente conserva por sí solo la capacidad de disponer de sus dólares, sin pedir permiso a Monokoro. La llave que conserva Monokoro sirve únicamente para apoyar la recuperación del acceso y por sí sola no permite mover los fondos.
- WhatsApp es únicamente el canal de atención. La verificación de identidad, el pago y la entrega ocurren sobre la infraestructura de Monokoro, con comprobante de cada operación.
- Monokoro no es el emisor de la stablecoin ni garantiza su paridad; la paridad depende del emisor y de sus reservas.
- Un dólar digital protege frente al peso, no frente al dólar: si el dólar cae contra el peso, el valor en pesos cae también.
- No hay comisión aparte: el costo del servicio está incluido en la tasa, que se muestra antes de pagar. La recarga de tarjeta usa una tasa distinta porque incorpora los costos de procesamiento internacional.
- Las tasas publicadas en el sitio son **referenciales**; la tasa aplicable se confirma en el chat antes de pagar. Por eso no aparecen en este archivo.
- Mercado: Colombia. Idioma: español. Monto mínimo por operación: $ ${fmtCOP(MIN_AMOUNT_COP)} COP.
- La verificación de identidad se hace una sola vez.

## Páginas

- [Inicio](${base}/): qué es Monokoro, cotizador de compra/venta/recarga, cómo funciona en tres pasos, la tarjeta, preguntas frecuentes.
- [Tarjeta](${base}/tarjeta/): la tarjeta denominada en dólares. Se crea desde el chat, se agrega a Apple Pay o Google Pay para pagar en tienda, paga en dólares lo que se cobra en dólares y en pesos lo local, y su saldo sale de los dólares digitales del cliente.
- [Negocios](${base}/negocios/): tarjetas empresariales en dólares para pauta, proveedores y viáticos. Ilimitadas, cobrandeadas si se quiere, administradas desde un dashboard, con bolsillos —un saldo compartido que se fondea una vez y del que consumen las tarjetas que se le asignen— y conectables por API, SDK y un iframe personalizable.
- [Aprende](${base}/aprende/): guías cortas sobre dólares digitales, ahorro y pagos internacionales desde Colombia.

## Guías

${posts
  .map((p) => `- [${p.title}](${base}/aprende/${p.slug}/): ${p.excerpt}`)
  .join("\n")}

## Legal

- [Términos y condiciones](${base}/terms/)
- [Política de privacidad](${base}/privacy/)

## Contacto

- WhatsApp es el canal principal de atención y de operación.
- Sitio: ${SITE_URL}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
