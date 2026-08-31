import { fmtCOP } from "@/lib/format";
import { MIN_AMOUNT_COP } from "@/lib/config";

/**
 * The home page FAQ.
 *
 * Exported as data, not JSX, because two places have to agree on it: the
 * accordion that renders it and the `FAQPage` JSON-LD the page emits. Google
 * requires the structured answer to match the visible one exactly, so they
 * must come from the same array — never a hand-copied second version.
 *
 * The minimum amount is interpolated from `lib/config.ts` for the same reason:
 * it also appears in the ticker, the hero specs and the closing CTA.
 */
export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Es seguro comprar por WhatsApp?",
    a: "Sí. WhatsApp es solo el canal de atención: la verificación, el pago y la entrega de tus dólares ocurren sobre nuestra infraestructura, con links de pago seguros y comprobante de cada operación.",
  },
  {
    q: "¿Qué es exactamente un dólar digital?",
    a: "Una moneda que siempre vale un dólar estadounidense y vive en internet. Técnicamente son USDT, la más usada del mundo, diseñada para mantener el valor de un dólar. Quedan en tu billetera, a tu nombre.",
  },
  {
    q: "¿Cuál es el monto mínimo?",
    a: `Desde $ ${fmtCOP(MIN_AMOUNT_COP)} COP por operación, tanto para comprar como para vender. Empiezas con lo que tengas.`,
  },
  {
    q: "¿Cómo vendo y recibo mis pesos de vuelta?",
    a: "Igual que compraste: dices cuánto quieres vender, ves la tasa del día, confirmas y recibes los pesos en tu cuenta bancaria. Sin trámites nuevos.",
  },
  {
    q: "¿Por qué la tarjeta tiene otra tasa?",
    a: "Porque incluye los costos de procesamiento internacional de la red de pagos. No es una comisión escondida: la ves antes de confirmar cada recarga.",
  },
  {
    q: "¿Monokoro guarda mi plata?",
    a: "No. Monokoro compra y vende: te entrega los dólares en tu billetera en el momento de la operación, y ahí termina nuestro rol sobre esos fondos. No recibimos dinero del público para mantenerlo ni administrarlo, y no somos una entidad de depósito.",
  },
  {
    q: "¿Y si no tengo billetera?",
    a: "Te ayudamos a crear una en el mismo chat, sin costo. Queda a tu nombre y con custodia compartida: tú tienes lo necesario para mover tus dólares cuando quieras, sin pedirnos permiso, y nosotros guardamos una llave de respaldo para poder acompañarte si pierdes el acceso. Con esa llave sola no podemos mover tus fondos.",
  },
  {
    q: "¿Qué pasa si pierdo mi celular?",
    a: "Tus dólares no viven en el teléfono: viven en tu billetera, y tú tienes el control de esa billetera. Se recupera con el respaldo que guardaste al crearla, y por eso ese es el paso que más insistimos que no te saltes. Si perdiste el acceso, escríbenos y te acompañamos en lo que podamos.",
  },
  {
    q: "¿Necesito descargar algo?",
    a: "No. Todo vive en WhatsApp y el agente te guía en cada paso. Pronto habrá app como complemento, nunca como requisito.",
  },
];
