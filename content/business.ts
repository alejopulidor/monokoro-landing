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
  { k: "CREACIÓN", v: "EN MINUTOS, DESDE EL CHAT" },
  { k: "CONTROL", v: "CONGELA · RECARGA · ELIMINA" },
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
    t: "Control desde WhatsApp",
    d: "Congela, elimina o recarga con un mensaje.",
  },
  {
    n: "03",
    t: "Saldo que no se derrite",
    d: "Protegido de la devaluación mientras no lo gastas.",
  },
  {
    n: "04",
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
    d: "Divides el saldo por campaña, cliente o proveedor. Varias tarjetas pueden consumir del mismo.",
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
 * The admin surface, and the one section that adds a *second* place to do
 * things. The chat stays the fast path on purpose — every other section on this
 * page, the hero specs and the closing CTA all say "desde WhatsApp", so the
 * copy here is additive ("también lo ves en un panel") and never a correction.
 * Reword it as a replacement and eight other strings start lying.
 */
export const BIZ_PANEL: GridItem[] = [
  {
    n: "01",
    t: "El panel de administración",
    d: "Entras y ves las tarjetas del negocio en una sola pantalla, con su saldo y su estado.",
  },
  {
    n: "02",
    t: "Bolsillos",
    d: "Un monto reservado del que consumen varias tarjetas a la vez. Ideal para pauta: el equipo gasta de un solo bolsillo y tú decides cuánto entra ahí.",
  },
  {
    n: "03",
    t: "Gestión de cada tarjeta",
    d: "Creas, recargas, congelas o eliminas desde el panel, igual que por chat.",
  },
  {
    n: "04",
    t: "Movimientos y comprobantes",
    d: "Cada gasto con su comprobante, filtrable por tarjeta, por bolsillo o por fecha.",
  },
];

export const BIZ_COMPARE: CompareRow[] = [
  { k: "Crear una tarjeta", a: "Solicitud y días hábiles", b: "Minutos, desde el chat o la API" },
  { k: "Cuántas puedes tener", a: "Las que autorice el banco", b: "Ilimitadas" },
  { k: "Cobros en dólares", a: "Conversión y recargo", b: "Se pagan en dólares" },
  { k: "Si una se quema", a: "Reposición y espera", b: "Creas otra al instante" },
  { k: "Saldo entre campañas", a: "En pesos, se devalúa", b: "En dólares, a tu nombre" },
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
    t: "Tu marca también en la wallet",
    d: "El arte cobrandeado se puede llevar al nivel de tokenización, para que la tarjeta se vea con tu marca dentro de Apple Pay y Google Pay. Se cotiza aparte.",
  },
  {
    n: "03",
    t: "Tarjetas para tus clientes",
    d: "Si tu producto necesita emitir tarjetas en dólares, las emites bajo tu nombre.",
  },
  {
    n: "04",
    t: "Reglas a tu medida",
    d: "Límites por tarjeta, por equipo o por campaña, definidos como los maneja tu operación.",
  },
  {
    n: "05",
    t: "Onboarding acompañado",
    d: "Un equipo humano configura, prueba y deja andando el flujo con tu gente.",
  },
];

export const BIZ_BRAND_SPECS = [
  { k: "DISEÑO", v: "TU MARCA" },
  { k: "RESPALDO", v: "DÓLARES DIGITALES" },
  { k: "EMISIÓN", v: "CHAT O API" },
  { k: "EN LA WALLET", v: "SE COTIZA APARTE" },
];

export const BIZ_API: RuledItem[] = [
  {
    n: "01",
    t: "Emisión por API",
    d: "Crea, congela y elimina tarjetas desde tu backend, sin pasar por el chat.",
  },
  {
    n: "02",
    t: "Saldos y movimientos",
    d: "Consulta saldo y transacciones en tiempo real y concílialo con tu contabilidad.",
  },
  {
    n: "03",
    t: "Conversión pesos ↔ dólares",
    d: "Cotiza y ejecuta el cambio desde tu sistema, con la tasa antes de confirmar.",
  },
  {
    n: "04",
    t: "Webhooks y comprobantes",
    d: "Cada gasto notifica a tu sistema con su comprobante, sin exportar planillas.",
  },
  {
    n: "05",
    t: "SDK",
    d: "Sobre la misma API, para integrar sin construir el cliente desde cero.",
  },
  {
    n: "06",
    t: "Iframe con tu marca",
    d: "Los datos de la tarjeta —número, fecha y CVV— se muestran dentro de un iframe que personalizas para que se vea como tu producto, sin que tu sistema tenga que tocarlos.",
  },
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
