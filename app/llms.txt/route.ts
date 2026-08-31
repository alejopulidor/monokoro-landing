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

> Monokoro vende, compra y custodia dólares digitales (stablecoins denominadas en dólares estadounidenses, principalmente USDT) para personas y negocios en Colombia. La atención es por WhatsApp: cotizas, confirmas la tasa y recibes en minutos. El saldo se puede guardar, vender de vuelta a pesos o gastar con una tarjeta denominada en dólares.

Qué es y qué no es, sin ambigüedad:

- Monokoro es una plataforma de tecnología financiera. **No es un banco**, no es una entidad de depósito y no capta ahorro del público.
- WhatsApp es únicamente el canal de atención. La verificación de identidad, el pago y la entrega ocurren sobre la infraestructura de Monokoro, con comprobante de cada operación.
- Los dólares digitales quedan a nombre del cliente. No son depósitos y no están cubiertos por un seguro de depósitos.
- Monokoro no es el emisor de la stablecoin ni garantiza su paridad; la paridad depende del emisor y de sus reservas.
- Un dólar digital protege frente al peso, no frente al dólar: si el dólar cae contra el peso, el saldo en pesos cae también.
- No hay comisión aparte: el costo del servicio está incluido en la tasa, que se muestra antes de pagar. La recarga de tarjeta usa una tasa distinta porque incorpora los costos de procesamiento internacional.
- Las tasas publicadas en el sitio son **referenciales**; la tasa aplicable se confirma en el chat antes de pagar. Por eso no aparecen en este archivo.
- Mercado: Colombia. Idioma: español. Monto mínimo por operación: $ ${fmtCOP(MIN_AMOUNT_COP)} COP.
- La verificación de identidad se hace una sola vez.

## Páginas

- [Inicio](${base}/): qué es Monokoro, cotizador de compra/venta/recarga, cómo funciona en tres pasos, la tarjeta, preguntas frecuentes.
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
