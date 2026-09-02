import type { RuledItem } from "@/components/shared/ruled-list";
import type { GridItem } from "@/components/shared/card-grid";
import type { CompareRow } from "@/components/shared/compare-table";
import type { FlowStep } from "@/components/shared/flow-list";
import type { ColoredStep } from "@/components/shared/colored-steps";
import type { ChatMsg } from "@/components/shared/agent-chat";

/**
 * Copy for `/negocios`, from the `Monokoro Negocios v5` canvas.
 *
 * Same copy rules as `content/card.ts`: the balance sits in the *billetera* of
 * the business, never in an account with Monokoro, and the pesos leg lands in
 * the business's *cuenta bancaria*. See CLAUDE.md.
 *
 * **A "bolsillo" is a division of that balance, and nothing more.** Never a
 * *cuenta*, never a *sub-cuenta*, never something Monokoro holds — all three
 * would describe exactly the arrangement claim 2 exists to deny. The money does
 * not move when a bolsillo is created; only the way the business reads it does.
 */

export const BIZ_HERO_SPECS = [
  { k: "TARJETAS", v: "ILIMITADAS" },
  { k: "BOLSILLOS", v: "UN SALDO, VARIAS TARJETAS" },
  { k: "CREACIÓN", v: "EN MINUTOS, DESDE EL CHAT" },
  { k: "CONTROL", v: "WHATSAPP + DASHBOARD" },
  { k: "RESPALDO", v: "DÓLARES DIGITALES TOKENIZADOS" },
  { k: "PAGAS EN", v: "DÓLARES O PESOS" },
  { k: "EN TIENDA", v: "APPLE PAY · GOOGLE PAY" },
];

/**
 * The problem, as three labelled cards rather than a ruled list: they are not
 * three equal points but a chain — the bottleneck, what it costs, and what it
 * should be. The middle one is the dark card, because the cost is the argument.
 */
export const BIZ_PROBLEM = [
  {
    k: "EL CUELLO DE BOTELLA",
    d: "Trabajas para escalar y tu propia tarjeta es lo que te frena.",
  },
  {
    k: "EL COSTO",
    d: "Cada pauta pausada por un cobro rechazado es plata que se lleva tu competencia.",
    dark: true,
  },
  {
    k: "LO QUE DEBERÍA SER",
    d: "Un negocio digital no debería depender de un banco con horario de oficina.",
  },
];

export const BIZ_PERKS: GridItem[] = [
  {
    n: "01",
    t: "Tarjetas ilimitadas",
    d: "Una por proyecto, por cliente o por campaña.",
  },
  {
    n: "02",
    t: "Bolsillos compartidos",
    d: "Un saldo que alimenta varias tarjetas a la vez.",
  },
  {
    n: "03",
    t: "Apple Pay y Google Pay",
    d: "Se agregan a la wallet para pagar también en tienda.",
  },
  {
    n: "04",
    t: "Control desde WhatsApp",
    d: "Congela, elimina o recarga con un mensaje.",
  },
  {
    n: "05",
    t: "Saldo que no se derrite",
    d: "Protegido de la devaluación mientras no lo gastas.",
  },
  {
    n: "06",
    t: "Tasas visibles siempre",
    d: "Antes de cada operación, sin cargos sorpresa.",
  },
];

export const BIZ_FLOW: FlowStep[] = [
  {
    k: "FONDEAS EN PESOS · COP",
    d: "Transfieres desde la cuenta bancaria del negocio y ves la tasa antes de confirmar.",
    dot: "#7A9391",
  },
  {
    k: "SALDO EN DÓLARES · USD",
    d: "Queda en dólares digitales tokenizados, en la billetera de la empresa y a su nombre.",
    dot: "#2C7A80",
  },
  {
    k: "BOLSILLOS",
    d: "Conectas varias tarjetas a un mismo saldo: uno para pauta, uno para un cliente, uno para proveedores.",
    dot: "#338289",
  },
  {
    k: "TARJETAS",
    d: "Emites las que necesites: por campaña, cliente, proveedor o persona.",
    dot: "#4FB89E",
  },
  {
    k: "GASTAS",
    d: "En dólares o en pesos, con comprobante de cada movimiento.",
    dot: "#6ADD9B",
  },
];

export const BIZ_STEPS: ColoredStep[] = [
  {
    n: "01",
    t: "Verifica tu negocio",
    d: "Un mensaje de WhatsApp y el agente te envía el link. Se hace una sola vez.",
  },
  {
    n: "02",
    t: "Fondea en pesos",
    d: "Tu saldo queda en dólares, con la tasa visible antes de confirmar.",
  },
  {
    n: "03",
    t: "Crea las tarjetas",
    d: "Las que necesites, cuando las necesites, y pauta sin interrupciones.",
  },
];

/** Issuing a per-person card, including the authorization code step — which is
 *  the point of the sequence: nobody issues a card without the owner. */
export const BIZ_CHAT: ChatMsg[] = [
  {
    at: 1,
    mine: true,
    text: "Créale viáticos a Laura Gómez por 300 USD y mándasela",
  },
  { at: 2, off: 3, kind: "typing" },
  { at: 3, text: "Va. Para autorizarla te mandé un código a tu número." },
  { at: 4, mine: true, kind: "code", code: "4816" },
  { at: 5, off: 6, kind: "typing" },
  {
    at: 6,
    kind: "card",
    card: {
      kicker: "TARJETA DE VIÁTICOS",
      sub: "Laura Gómez · Viaje Bogotá",
      last4: "7302",
      balance: "300,00 USD",
      action: "Ver tarjeta",
    },
  },
  {
    at: 7,
    text: "Ya le llegó a Laura por WhatsApp. Puedes congelarla o subirle el monto cuando quieras.",
  },
];
export const BIZ_CHAT_MS = [700, 1300, 1400, 1600, 1200, 1500, 2800, 4400];

export const BIZ_CASES: RuledItem[] = [
  {
    n: "01",
    t: "Dropshipper",
    d: "Paga Meta y TikTok Ads con saldo en dólares. Si una tarjeta se quema, creas otra al instante desde el chat.",
  },
  {
    n: "02",
    t: "Agencia",
    d: "Una tarjeta por cliente, gastos separados, control total — sin pedirle la tarjeta personal a nadie.",
  },
  {
    n: "03",
    t: "Marca ecommerce",
    d: "Paga proveedores y herramientas — Shopify, apps, software — en dólares, sin comisiones de sorpresa en el extracto.",
  },
];

/**
 * Bolsillos, from `Monokoro Negocios v2.dc.html` — which is the **newest**
 * canvas for this page despite the version number: the client updated it after
 * v5, and it is where `#bolsillos`, `#dashboard` and `#api` are designed.
 *
 * The canvas settles the framing that two earlier attempts here got wrong. It
 * is not "un monto reservado del saldo" (defines it from the amount, and the
 * client could not tell what it was for) and not "un saldo por frente" (a word
 * nobody uses, invented here). It is: **creas un bolsillo, lo fondeas una vez,
 * y las tarjetas que le asignes consumen de ahí.** Three beats, in that order.
 *
 * "Ideal para marketing" is in the lede on purpose — it was the use case the
 * client named first, and it is what makes the feature concrete.
 *
 * Still, in compliance terms, a bolsillo is a division of the business's *own*
 * balance: never a *cuenta*, never a *sub-cuenta*, never something Monokoro
 * holds. See the file header.
 */
export const BIZ_POCKETS: GridItem[] = [
  {
    n: "01",
    t: "Fondeas una vez",
    d: "Un solo movimiento y el bolsillo queda con saldo para todas las tarjetas que dependen de él.",
  },
  {
    n: "02",
    t: "Reparte solo",
    d: "Cada tarjeta gasta del mismo saldo. No tienes que adivinar cuánto ponerle a cada una.",
  },
  {
    n: "03",
    t: "Varios bolsillos",
    d: "Uno para marketing, otro para proveedores, otro por cliente. Cada uno con su propio saldo y sus tarjetas.",
  },
];

/**
 * The cards drawn hanging off the example bolsillo.
 *
 * `spend` is what makes the drawing work: three cards listed beside a balance
 * could be anything, but three cards each showing what they took *from* it can
 * only mean one thing. That per-card figure is the canvas's idea and it is the
 * reason this version communicates where the last one did not.
 *
 * Every number here is a mock and the panel says so — `SALDO COMPARTIDO ·
 * EJEMPLO` on the figure and again in the `aria-label`. A figure on this site
 * that is not marked referential or as an example is a bug.
 */
export const BIZ_POCKET_CARDS = [
  { tag: "META ADS", num: "•••• 4821", spend: "1.240 USD este mes" },
  { tag: "TIKTOK ADS", num: "•••• 7302", spend: "860 USD este mes" },
  { tag: "HERRAMIENTAS", num: "•••• 5514", spend: "312 USD este mes" },
];

export type DashRow = {
  name: string;
  num: string;
  spend: string;
  limit: string;
  state: string;
  /** Renders the state pill muted instead of mint. */
  off?: boolean;
};

/**
 * The example rows in the dashboard mock.
 *
 * An earlier version of this section deliberately had **no** screenshot,
 * because inventing a product surface nobody has seen is worse than describing
 * one. The canvas now designs that surface, so it is the design's decision
 * rather than this file's invention — and a table showing spend against a
 * limit says what the dashboard is for in a way three bullet points cannot.
 *
 * The frozen row is not filler: it is the only one that shows the dashboard is
 * for *acting*, not just reading.
 */
export const BIZ_DASH_ROWS: DashRow[] = [
  {
    name: "Meta Ads · Campaña Q3",
    num: "•••• 4821",
    spend: "1.240,00 USD",
    limit: "Sin límite",
    state: "Activa",
  },
  {
    name: "TikTok Ads · Creativos",
    num: "•••• 7302",
    spend: "860,00 USD",
    limit: "1.500 USD / mes",
    state: "Activa",
  },
  {
    name: "Herramientas · Software",
    num: "•••• 5514",
    spend: "312,00 USD",
    limit: "500 USD / mes",
    state: "Activa",
  },
  {
    name: "Viáticos · Laura Gómez",
    num: "•••• 9037",
    spend: "148,50 USD",
    limit: "300 USD",
    state: "Congelada",
    off: true,
  },
];

export const BIZ_DASH_PERKS = [
  {
    t: "Todo en una vista",
    d: "Tarjetas, bolsillos, saldos y movimientos, sin abrir el chat.",
  },
  {
    t: "Límites y permisos",
    d: "Defines cuánto puede gastar cada tarjeta y quién del equipo la maneja.",
  },
  {
    t: "Movimientos exportables",
    d: "Descargas el detalle para tu contabilidad cuando lo necesites.",
  },
];

export const BIZ_COMPARE: CompareRow[] = [
  { k: "Crear una tarjeta", a: "Solicitud y días hábiles", b: "Minutos, desde el chat o la API" },
  { k: "Cuántas puedes tener", a: "Las que autorice el banco", b: "Ilimitadas" },
  { k: "Cobros en dólares", a: "Conversión y recargo", b: "Se pagan en dólares" },
  { k: "Si una se quema", a: "Reposición y espera", b: "Creas otra al instante" },
  { k: "Saldo entre campañas", a: "En pesos, se devalúa", b: "En dólares, a tu nombre" },
  { k: "Separar el gasto", a: "Otra cuenta, si el banco la abre", b: "Un bolsillo por campaña o cliente" },
  { k: "Tu marca en la tarjeta", a: "No aplica", b: "Cobrandeada" },
  { k: "Integración", a: "Archivos y conciliación manual", b: "API y webhooks" },
];

export const BIZ_BRAND: GridItem[] = [
  {
    n: "01",
    t: "Tu logo en la tarjeta",
    d: "Diseño cobrandeado: tu marca al frente y nuestra infraestructura detrás.",
  },
  {
    n: "02",
    t: "Tarjetas para tus clientes",
    d: "Si tu producto necesita emitir tarjetas en dólares, las emites bajo tu nombre.",
  },
  {
    n: "03",
    t: "Reglas a tu medida",
    d: "Límites por tarjeta, por equipo o por campaña, definidos como los maneja tu operación.",
  },
  {
    n: "04",
    t: "Onboarding acompañado",
    d: "Un equipo humano configura, prueba y deja andando el flujo con tu gente.",
  },
];

export const BIZ_BRAND_SPECS = [
  { k: "DISEÑO", v: "TU MARCA" },
  { k: "RESPALDO", v: "DÓLARES DIGITALES" },
  { k: "EMISIÓN", v: "CHAT O API" },
];

/**
 * `#api`, from the v2 canvas — and note it now carries **personalización**
 * too. The canvas folded what used to be a separate `#marca` story into here,
 * which is why 02 and 03 are about the client's brand rather than about
 * endpoints: the honest order is "here is how you put your product in front of
 * it", not "here are our verbs".
 *
 * 03 states the cost. It is the only price-shaped sentence on the site and it
 * names no figure on purpose — "te lo cotizamos según el volumen" is the
 * canvas's own wording and it routes to the chat.
 */
export const BIZ_API: GridItem[] = [
  {
    n: "01",
    t: "API y SDK",
    d: "Creas tarjetas, bolsillos y consultas movimientos desde tu propio backend. Sin pasar por el chat.",
  },
  {
    n: "02",
    t: "Iframe personalizable",
    d: "El componente donde tu usuario ve y usa la tarjeta se adapta a tu marca: colores, tipografía y estilos propios.",
  },
  {
    n: "03",
    t: "Tokenización con tu marca",
    d: "Las tarjetas pueden salir co-brandeadas en Apple Pay y Google Pay. Tiene un costo aparte — te lo cotizamos según el volumen.",
  },
];

/**
 * Printed in the dark panel of `#api`.
 *
 * These stayed out of the first version of that section on purpose: a
 * plausible-but-unverified route is the same class of mistake as a plausible
 * BIN on the card face. The v2 canvas specifies them, so they are the client's
 * own spec now rather than this repo's guess — **which is the only reason they
 * are here.** If the real API differs, they come out again.
 */
export const BIZ_API_ENDPOINTS = [
  "POST /v1/pockets",
  "POST /v1/cards",
  "GET  /v1/cards/:id/transactions",
];

export const BIZ_REQUIREMENTS: GridItem[] = [
  {
    n: "01",
    t: "RUT o cámara de comercio",
    d: "Verificamos el negocio una sola vez con un link que envía el agente.",
  },
  {
    n: "02",
    t: "Documento del representante",
    d: "Cédula de quien firma. Sin comité de crédito ni historial bancario.",
  },
  {
    n: "03",
    t: "Un monto para fondear",
    d: "Transfieres en pesos y el saldo queda en dólares, listo para emitir tarjetas.",
  },
];

export const BIZ_TRUST = [
  { k: "VERIFICACIÓN", v: "DEL NEGOCIO, UNA VEZ" },
  { k: "PAGOS", v: "LINK SEGURO · TRAZABLE" },
  { k: "DATOS", v: "CIFRADOS" },
  { k: "SOPORTE", v: "HUMANO, TAMBIÉN DE NOCHE" },
];

export const BIZ_LEARN_SLUGS = [
  "que-es-un-dolar-digital",
  "tarjeta-rechazada-pagos-internacionales",
];
export const BIZ_LEARN_BLURBS: Record<string, string> = {
  "que-es-un-dolar-digital":
    "Qué respalda el saldo del negocio, quién lo emite y por qué siempre vale un dólar.",
  "tarjeta-rechazada-pagos-internacionales":
    "Conversión doble, cupo cerrado y bloqueos por riesgo: por qué se cae la pauta.",
};

export const BIZ_WA = "Hola, quiero tarjetas empresariales en dólares";
