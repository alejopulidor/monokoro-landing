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

/**
 * The card page's FAQ.
 *
 * Same contract as the home set: this array is both the accordion and the
 * `FAQPage` structured data on `/tarjeta`, so it can never drift.
 */
export const CARD_FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿De dónde sale el saldo de la tarjeta?",
    a: "De tus dólares digitales. Los compras en el mismo chat a la tasa del día y decides cuánto pasa a la tarjeta. Lo que no gastas sigue guardado en dólares, en tu billetera.",
  },
  {
    q: "¿Necesito cuenta en el exterior?",
    a: "No. La tarjeta se emite a tu nombre desde Colombia y todo se maneja por WhatsApp. Tampoco necesitas tarjeta de crédito ni historial bancario.",
  },
  {
    q: "¿Es una tarjeta física?",
    a: "No, es virtual. Los datos llegan al chat y los usas de inmediato en cualquier compra online o suscripción internacional.",
  },
  {
    q: "¿Puedo pagar en pesos con la tarjeta?",
    a: "Sí. La tarjeta sirve para cualquier compra: si el comercio cobra en pesos, se convierte desde tu saldo en dólares con la tasa Monokoro, que ves en el chat. El respaldo siempre son dólares digitales.",
  },
  {
    q: "¿Sirve en cualquier página?",
    a: "En cualquier comercio online que acepte tarjetas internacionales. Algunos servicios exigen una tarjeta emitida en su propio país; eso no lo resuelve ninguna tarjeta local.",
  },
  {
    q: "¿Puedo devolver el saldo a pesos?",
    a: "Sí. Sacas el saldo de la tarjeta y lo vendes en el chat a la tasa del día. Los pesos llegan a tu cuenta bancaria.",
  },
  {
    q: "¿Por qué la tarjeta tiene otra tasa?",
    a: "Porque incluye los costos de procesamiento internacional de la red de pagos. No es una comisión escondida: la ves antes de confirmar cada recarga.",
  },
  {
    q: "¿Qué pasa si se rechaza un cobro?",
    a: "Casi siempre es saldo insuficiente. Recargas desde el chat en segundos y el comercio vuelve a intentar el cobro.",
  },
  {
    q: "¿Puedo tener más de una?",
    a: "Sí. En la versión empresarial creas las que necesites — una por cliente, por campaña o por proveedor — y las controlas todas desde el mismo chat.",
  },
  {
    q: "¿Cómo la congelo o la elimino?",
    a: "Le escribes al agente. La congelación es inmediata, y si eliminas la tarjeta el saldo que quedaba vuelve a tu billetera.",
  },
  {
    q: "¿Necesito descargar algo?",
    a: "No. La tarjeta se crea y se maneja desde WhatsApp. Pronto habrá app como complemento, nunca como requisito.",
  },
];

/** The business page's FAQ. Same contract again. */
export const BUSINESS_FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Qué respalda el saldo de las tarjetas?",
    a: "Dólares digitales tokenizados a nombre del negocio. Cada unidad vale un dólar; los compras en el chat a la tasa del día y quedan en la billetera de la empresa, bajo su control y sin prestárselos a nadie.",
  },
  {
    q: "¿Las tarjetas pagan solo en dólares?",
    a: "No. Pagan en dólares lo que se cobra en dólares —Meta, TikTok, software, proveedores— y en pesos lo local, convirtiendo desde el saldo con la tasa Monokoro que ves en el chat.",
  },
  {
    q: "¿Cuántas tarjetas puedo crear?",
    a: "Las que necesites: una por campaña, por cliente, por proveedor o por persona del equipo. Crear una nueva toma minutos y no exige trámite adicional.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "RUT o cámara de comercio, el documento del representante legal y un monto para fondear. La verificación del negocio se hace una sola vez.",
  },
  {
    q: "¿Puedo emitir tarjetas con mi marca?",
    a: "Sí. Se emiten cobrandeadas para tu equipo, tus clientes o tu propio producto: tu logo al frente y nuestra infraestructura detrás, por chat o por API.",
  },
  {
    q: "¿Tienen API?",
    a: "Sí: emisión y control de tarjetas, consulta de saldos y movimientos, conversión pesos ↔ dólares y webhooks con el comprobante de cada gasto.",
  },
  {
    q: "¿Qué pasa si alguien sale del equipo?",
    a: "Congelas o eliminas su tarjeta con un mensaje, en el momento. El saldo que quedaba vuelve a la billetera del negocio.",
  },
  {
    q: "¿Cómo lo cuadro con contabilidad?",
    a: "Cada operación queda con comprobante y cada tarjeta con su propio historial, así que el gasto ya viene separado por campaña, cliente o proveedor.",
  },
  {
    q: "¿Puedo devolver el saldo a pesos?",
    a: "Sí. Vendes los dólares en el chat a la tasa del día y los pesos llegan a la cuenta bancaria del negocio.",
  },
];
