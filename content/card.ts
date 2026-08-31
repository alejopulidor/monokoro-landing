import type { RuledItem } from "@/components/shared/ruled-list";
import type { GridItem } from "@/components/shared/card-grid";
import type { CompareRow } from "@/components/shared/compare-table";
import type { FlowStep } from "@/components/shared/flow-list";
import type { ColoredStep } from "@/components/shared/colored-steps";
import type { ChatMsg } from "@/components/shared/agent-chat";
import { fmtCOP } from "@/lib/format";
import { MIN_AMOUNT_COP } from "@/lib/config";

/**
 * Copy for `/tarjeta`, from the `Monokoro Tarjeta v5` canvas.
 *
 * It lives here rather than inline in each section because the sections are
 * compositions of shared primitives now — the same `RuledList` renders the card
 * page's problem list and the business page's use cases, so the copy has to
 * arrive as data.
 *
 * **Two copy rules apply to everything in this file** (see CLAUDE.md):
 * the dollars live in the customer's *billetera*, never in an account with
 * Monokoro; and the pesos leg of a sale lands in their *cuenta bancaria*,
 * which is the only "cuenta" allowed on the site.
 */

export const CARD_HERO_SPECS = [
  { k: "CREACIÓN", v: "EN MINUTOS, DESDE EL CHAT" },
  { k: "RESPALDO", v: "DÓLARES DIGITALES TOKENIZADOS" },
  { k: "PAGAS EN", v: "DÓLARES O PESOS" },
  { k: "TASA", v: "UNA SOLA, VISIBLE ANTES" },
  { k: "CONTROL", v: "CONGELA · RECARGA · ELIMINA" },
];

export const CARD_PROBLEMS: RuledItem[] = [
  {
    n: "01",
    t: "El cobro llega en dólares",
    d: "Tu tarjeta paga en pesos, así que alguien tiene que convertir. Ese alguien pone la tasa.",
  },
  {
    n: "02",
    t: "El recargo por moneda extranjera",
    d: "Además de la tasa, la mayoría de tarjetas suma un porcentaje por cada compra en el exterior.",
  },
  {
    n: "03",
    t: "Los rechazos",
    d: "Cupo internacional cerrado, alerta antifraude o restricción del comercio: el cobro se cae y casi nunca te dicen por qué.",
  },
];

/** Where the money goes, in order. The dot darkens along the sequence. */
export const CARD_FLOW: FlowStep[] = [
  {
    k: "PESOS · COP",
    d: "Le dices al agente cuánto quieres cambiar y ves la tasa del día.",
    dot: "#7A9391",
  },
  {
    k: "DÓLARES DIGITALES · USD",
    d: "Confirmas y los dólares quedan en tu billetera, a tu nombre.",
    dot: "#2C7A80",
  },
  {
    k: "TARJETA",
    d: "Pasas parte del saldo a la tarjeta y pagas en dólares o en pesos, donde sea.",
    dot: "#6ADD9B",
  },
];

export const CARD_STEPS: ColoredStep[] = [
  {
    n: "01",
    t: "Pídela en el chat",
    d: "Le dices al agente que quieres tu tarjeta y con cuánto saldo empezar.",
  },
  {
    n: "02",
    t: "Confirma el monto",
    d: "Ves la tasa de recarga y cuántos dólares quedan en la tarjeta antes de aceptar.",
  },
  {
    n: "03",
    t: "Úsala de inmediato",
    d: "Los datos llegan al chat y ya puedes pagar. Sin esperar plástico ni días hábiles.",
  },
];

/** The issuing conversation. `at` is the step the bubble appears on; see
 *  components/shared/agent-chat.tsx for how the loop is driven. */
export const CARD_CHAT: ChatMsg[] = [
  { at: 1, mine: true, text: "Quiero crear mi tarjeta con 150 dólares" },
  { at: 2, off: 3, kind: "typing" },
  { at: 3, text: "Listo, la creo con tu saldo. ¿Confirmas?" },
  { at: 4, mine: true, text: "Confirmo" },
  {
    at: 5,
    kind: "card",
    card: {
      kicker: "TARJETA CREADA",
      last4: "4821",
      balance: "150,00 USD",
      action: "Ver tarjeta",
    },
  },
];
export const CARD_CHAT_MS = [700, 1100, 1400, 1200, 2600, 4200];

export const CARD_CONTROLS: GridItem[] = [
  {
    n: "01",
    t: "Congélala al instante",
    d: "¿Un cobro raro? Un mensaje y queda bloqueada mientras revisas.",
  },
  {
    n: "02",
    t: "Recarga cuando quieras",
    d: "Desde tu saldo en dólares o comprando en el momento. Ves la tasa antes.",
  },
  {
    n: "03",
    t: "Elimínala y crea otra",
    d: "Si se quema en un comercio, la borras y creas una nueva en el mismo chat.",
  },
  {
    n: "04",
    t: "Nada de sorpresas",
    d: "Cada movimiento con comprobante. Lo que gastas es lo que sale de tu saldo.",
  },
];

export const CARD_USES: RuledItem[] = [
  {
    n: "01",
    t: "Suscripciones y software",
    d: "Netflix, Spotify, Adobe, herramientas de IA: cobros recurrentes que dejan de rebotar.",
  },
  {
    n: "02",
    t: "Vuelos y hoteles",
    d: "Reservas en páginas internacionales sin que el banco frene la compra a mitad de camino.",
  },
  {
    n: "03",
    t: "Compras online",
    d: "Tiendas de afuera que cobran en dólares, sin conversión sorpresa en el extracto.",
  },
  {
    n: "04",
    t: "Publicidad y trabajo",
    d: "Meta Ads, Google Ads y las herramientas que tu operación paga en dólares cada mes.",
  },
  {
    n: "05",
    t: "El día a día en Colombia",
    d: "Domicilios, mercado, transporte: el comercio cobra en pesos y sale de tu saldo en dólares, a la tasa del momento.",
  },
];

export const CARD_COMPARE: CompareRow[] = [
  { k: "Cobros en dólares", a: "Se convierten a pesos", b: "Se pagan en dólares" },
  { k: "Cobros en pesos", a: "Tasa y recargos del banco", b: "Tasa Monokoro, visible antes" },
  { k: "Respaldo del saldo", a: "Pesos en cuenta", b: "Dólares digitales a tu nombre" },
  { k: "Recargo por moneda extranjera", a: "Por cada compra", b: "No aplica" },
  { k: "Rechazos por conversión", a: "Frecuentes", b: "No hay conversión" },
  { k: "Para empezar", a: "Producto bancario", b: "WhatsApp y verificación una vez" },
  { k: "Si algo pasa", a: "Línea de atención", b: "Congelas o eliminas por chat" },
];

export const CARD_TIERS_SPECS = [
  { k: "INDIVIDUAL", v: "UNA TARJETA · TU SALDO" },
  { k: "EMPRESARIAL", v: "TARJETAS ILIMITADAS" },
  { k: "SEPARACIÓN", v: "POR CLIENTE O CAMPAÑA" },
  { k: "CONTROL", v: "TODO DESDE WHATSAPP" },
];

export const CARD_REQUIREMENTS: GridItem[] = [
  {
    n: "01",
    t: "WhatsApp",
    d: "El único canal que necesitas: pides, confirmas y controlas todo ahí.",
  },
  {
    n: "02",
    t: "Tu cédula",
    d: "Verificación una sola vez, con un link que te envía el agente.",
  },
  {
    n: "03",
    t: "Un monto para empezar",
    d: `Desde $ ${fmtCOP(MIN_AMOUNT_COP)} COP. Recargas cuando quieras, sin mínimos mensuales.`,
  },
];

export const CARD_SECURITY = [
  { k: "EMISIÓN", v: "A TU NOMBRE" },
  { k: "SALDO", v: "EN DÓLARES, TUYO" },
  { k: "MOVIMIENTOS", v: "CON COMPROBANTE" },
  { k: "CONGELAR", v: "INMEDIATO" },
];

/** Why these two articles: one explains what backs the balance, the other
 *  explains the problem the card solves. Blurbs are rewritten for this page. */
export const CARD_LEARN_SLUGS = [
  "que-es-un-dolar-digital",
  "tarjeta-rechazada-pagos-internacionales",
];
export const CARD_LEARN_BLURBS: Record<string, string> = {
  "que-es-un-dolar-digital":
    "De dónde sale el saldo de la tarjeta, quién lo respalda y por qué siempre vale un dólar.",
  "tarjeta-rechazada-pagos-internacionales":
    "Conversión doble, cupo cerrado y bloqueos por riesgo, explicados uno por uno.",
};

export const CARD_WA = "Hola, quiero crear mi tarjeta Monokoro";
