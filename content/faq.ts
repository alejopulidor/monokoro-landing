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
    a: "Una moneda que siempre vale un dólar estadounidense y vive en internet. Técnicamente son USDT, la más usada del mundo, diseñada para mantener el valor de un dólar. Quedan en tu cuenta, a tu nombre.",
  },
  {
    q: "¿Cuál es el monto mínimo?",
    a: `Desde $ ${fmtCOP(MIN_AMOUNT_COP)} COP por operación, tanto para comprar como para vender. Empiezas con lo que tengas.`,
  },
  {
    q: "¿Cómo vendo y recibo mis pesos de vuelta?",
    a: "Igual que compraste: dices cuánto quieres vender, ves la tasa del día, confirmas y recibes los pesos en tu cuenta. Sin trámites nuevos.",
  },
  {
    q: "¿Por qué la tarjeta tiene otra tasa?",
    a: "Porque incluye los costos de procesamiento internacional de la red de pagos. No es una comisión escondida: la ves antes de confirmar cada recarga.",
  },
  {
    q: "¿Qué pasa si pierdo mi celular?",
    a: "Tus dólares no viven en el teléfono, viven en tu cuenta. Recuperas tu número, verificamos que eres tú y sigues justo donde ibas.",
  },
  {
    q: "¿Necesito descargar algo?",
    a: "No. Todo vive en WhatsApp y el agente te guía en cada paso. Pronto habrá app como complemento, nunca como requisito.",
  },
];
