/**
 * The "Aprende" articles.
 *
 * Content lives here rather than in `messages/*.json` for two reasons: the
 * blog index and `generateStaticParams` need to *enumerate* posts (messages
 * are keyed lookups, not a queryable collection), and long-form prose in a
 * flat JSON file becomes unreadable fast.
 *
 * The body is a small typed block list instead of raw HTML or Markdown. That
 * keeps the article renderer free of `dangerouslySetInnerHTML`, and it means
 * the four shapes the design actually supports — paragraph, heading, numbered
 * list, aside — are the only four anyone can author. Adding a fifth is a
 * deliberate change to `components/blog/article-body.tsx`, not a surprise in
 * production.
 *
 * `locale` is carried per post so a translated set can live alongside these
 * without restructuring anything; the index and the routes filter on it.
 */

export type Block =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "list"; items: { n: string; t: string; d: string }[] }
  /** The "CÓMO LO HACEMOS" aside — a product note set apart from the argument
   *  so the reader can tell reporting from pitch. */
  | { t: "note"; tag: string; x: string };

export type Post = {
  slug: string;
  locale: string;
  /** Mono kicker: GUÍA, AHORRO, PAGOS. */
  tag: string;
  /** Reading time as the design writes it — "3 MIN". */
  minutes: string;
  title: string;
  /** Short title for cards where the full one would wrap three lines. */
  cardTitle?: string;
  lede: string;
  /** One-line summary for the index and the related-posts cards. */
  excerpt: string;
  /** ISO date. Feeds `datePublished` in the Article schema; never `new Date()`,
   *  which would re-stamp every article on every deploy. */
  published: string;
  /** Human-readable freshness stamp shown under the title. */
  updatedLabel: string;
  /** Prefilled WhatsApp message for the article's own CTA — the agent can tell
   *  which piece the person was reading. */
  waMessage: string;
  /** Headline of the article's closing CTA panel. */
  ctaTitle: string;
  /** Slugs of the two posts shown under "sigue leyendo". */
  related: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "que-es-un-dolar-digital",
    locale: "es",
    tag: "GUÍA",
    minutes: "3 MIN",
    title: "¿Qué es un dólar digital y por qué existe?",
    lede: "Se compran desde el celular, valen siempre un dólar y en Colombia se volvieron la forma más directa de dejar de perder contra la devaluación. Esto es lo que hay que entender antes de mover el primer peso.",
    excerpt:
      "Qué son, quién los respalda, en qué se diferencian de una criptomoneda volátil y cómo se usan en Colombia. La base para decidir con criterio.",
    published: "2026-08-30",
    updatedLabel: "ACTUALIZADO AGO 2026",
    waMessage: "Hola, leí la guía del dólar digital y quiero cotizar",
    ctaTitle: "Prueba con un monto pequeño y decide después.",
    related: ["ahorrar-en-dolares-colombia", "tarjeta-rechazada-pagos-internacionales"],
    body: [
      {
        t: "p",
        x: "Un dólar digital es un dólar estadounidense representado en internet. No es una acción, no es una apuesta y no cambia de precio según el ánimo del mercado: una unidad vale un dólar, hoy y el mes que viene.",
      },
      { t: "h2", x: "Qué es, en una frase" },
      {
        t: "p",
        x: "Es dinero que se mueve por internet y mantiene el valor del dólar. La versión más usada del mundo se llama USDT. Cada unidad está respaldada por reservas en dólares y activos equivalentes, y por eso su precio se mantiene pegado a la moneda que representa.",
      },
      {
        t: "p",
        x: "La diferencia práctica con el dólar en efectivo es la velocidad. Enviar dólares digitales toma minutos, funciona los domingos y no depende de que un banco corresponsal abra sus puertas.",
      },
      { t: "h2", x: "Por qué existe" },
      {
        t: "p",
        x: "Nació de un problema concreto: mover dólares entre países es lento y caro. En América Latina se sumó otro motivo, la devaluación. Cuando la moneda local pierde valor frente al dólar, ahorrar en pesos es aceptar una pérdida silenciosa cada mes.",
      },
      {
        t: "p",
        x: "Durante años, protegerse exigía tener cuenta en el exterior o comprar efectivo y guardarlo. El dólar digital quitó ese requisito: se compra desde el celular y se guarda sin caja fuerte.",
      },
      { t: "h2", x: "En qué se diferencia de una criptomoneda volátil" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "Precio.",
            d: "Bitcoin sube y baja. Un dólar digital está diseñado para valer siempre un dólar. Si el dólar sube frente al peso, tu saldo en pesos sube con él; no hay una segunda apuesta encima.",
          },
          {
            n: "02",
            t: "Propósito.",
            d: "Una es un activo especulativo. El otro es un medio para guardar y mover valor sin fricción.",
          },
          {
            n: "03",
            t: "Respaldo.",
            d: "Detrás de cada dólar digital hay reservas declaradas y auditorías periódicas. Detrás de una cripto volátil solo está su mercado.",
          },
        ],
      },
      { t: "h2", x: "Para qué sirve en Colombia" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "Ahorrar sin perder contra la devaluación.",
            d: "Guardas en dólares y vuelves a pesos cuando lo necesites, a la tasa de ese día.",
          },
          {
            n: "02",
            t: "Cobrar del exterior.",
            d: "Freelancers y equipos remotos reciben en dólares y deciden cuándo cambiar, en vez de aceptar la tasa del día del giro.",
          },
          {
            n: "03",
            t: "Pagar servicios que cobran en dólares.",
            d: "Suscripciones, software, publicidad y vuelos se pagan desde el saldo en dólares, sin conversión doble ni rechazos.",
          },
          {
            n: "04",
            t: "Pagar proveedores afuera.",
            d: "Un negocio que importa envía el pago en minutos y con comprobante, sin esperar el corte del banco.",
          },
        ],
      },
      { t: "h2", x: "Qué revisar antes de comprar" },
      {
        t: "p",
        x: "Tres cosas separan una operación tranquila de un dolor de cabeza. Primero, que la tasa sea una sola y esté a la vista antes de pagar: si aparecen comisiones después, el precio real nunca fue el que te mostraron. Segundo, que exista comprobante de cada movimiento. Tercero, que haya una persona respondiendo cuando algo se sale del guion.",
      },
      {
        t: "note",
        tag: "CÓMO LO HACEMOS",
        x: "En Monokoro la tasa que ves ya incluye todo, la verificación se hace una sola vez y cada operación queda con comprobante. Los dólares se entregan al momento en tu propia billetera —no los guardamos nosotros— y si no tienes una, te ayudamos a crearla con custodia compartida.",
      },
      { t: "h2", x: "Cómo se compra, paso a paso" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "Escribes por WhatsApp.",
            d: "Dices cuánto quieres cambiar y recibes la tasa del día al instante.",
          },
          {
            n: "02",
            t: "Confirmas y pagas.",
            d: "Ves cuánto pagas y cuánto recibes. Si te sirve, pagas con un link seguro.",
          },
          {
            n: "03",
            t: "Recibes y decides.",
            d: "Los dólares quedan al momento en tu billetera, a tu nombre. Los guardas, los vendes de vuelta o los gastas con la tarjeta.",
          },
        ],
      },
      { t: "h2", x: "Lo que hay que tener claro" },
      {
        t: "p",
        x: "Un dólar digital protege del peso, no del dólar. Si el dólar cae frente al peso, tu saldo en pesos cae también. Tampoco es una cuenta bancaria: no genera rendimientos por sí solo ni está cubierto por el seguro de depósitos. Es, exactamente, guardar dólares — con la comodidad de que caben en el celular.",
      },
    ],
  },

  {
    slug: "ahorrar-en-dolares-colombia",
    locale: "es",
    tag: "AHORRO",
    minutes: "2 MIN",
    title: "Ahorrar en dólares en Colombia: tres formas y sus costos",
    lede: "Todas las opciones cumplen lo mismo: sacar tu plata del peso. Lo que cambia es cuánto trámite exige entrar, cuánto se pierde en el camino y qué tan rápido puedes volver.",
    excerpt:
      "Cuenta en el exterior, casa de cambio y dólar digital. Qué pide cada una y qué cuesta entrar y salir.",
    published: "2026-08-30",
    updatedLabel: "ACTUALIZADO AGO 2026",
    waMessage: "Hola, quiero empezar a ahorrar en dólares",
    ctaTitle: "Empieza con lo que tengas y sal cuando quieras.",
    related: ["que-es-un-dolar-digital", "tarjeta-rechazada-pagos-internacionales"],
    body: [
      {
        t: "p",
        x: "La pregunta no es si conviene ahorrar en dólares, sino por dónde hacerlo sin que el trámite se coma la ganancia. En Colombia hay tres caminos realistas y cada uno cobra su peaje en un lugar distinto.",
      },
      { t: "h2", x: "Cuenta en el exterior" },
      {
        t: "p",
        x: "Es la opción clásica: abrir una cuenta en un banco de otro país y girar. Funciona, y para montos grandes sigue siendo razonable. El costo está en la entrada — comprobantes de ingresos, mínimos de apertura y a veces presencia física — y en cada giro internacional, donde el banco intermediario cobra su parte y la transferencia puede tardar días.",
      },
      { t: "h2", x: "Efectivo en casa de cambio" },
      {
        t: "p",
        x: "Rápido y sin papeleo para montos pequeños. El costo aparece en el spread: la diferencia entre la tasa a la que te venden y a la que te recompran suele ser amplia, y no siempre está publicada. Después queda el problema de guardar billetes en casa y de que, para gastarlos afuera, hay que volver a cambiarlos.",
      },
      { t: "h2", x: "Dólar digital" },
      {
        t: "p",
        x: "Se compra desde el celular, queda a tu nombre y se vende de vuelta a pesos cuando quieras. La verificación se hace una sola vez. El costo está en la tasa, así que la única pregunta relevante es si esa tasa es una sola y se ve antes de pagar.",
      },
      { t: "h2", x: "Qué comparar, en concreto" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "Costo de entrada.",
            d: "Cuánto trámite y cuánto tiempo pasa entre que decides y que tienes el primer dólar guardado.",
          },
          {
            n: "02",
            t: "Costo de salida.",
            d: "A qué tasa te recompran. Es donde más plata se pierde y donde menos gente mira.",
          },
          {
            n: "03",
            t: "Monto mínimo.",
            d: "Si tienes que juntar un millón para empezar, la decisión se aplaza y la devaluación sigue corriendo.",
          },
          {
            n: "04",
            t: "Qué puedes hacer con el saldo.",
            d: "Guardarlo es una cosa. Poder gastarlo en dólares sin volver a pesos es otra.",
          },
        ],
      },
      {
        t: "note",
        tag: "CÓMO LO HACEMOS",
        x: "En Monokoro la tasa incluye todo, no hay comisión aparte y ves cuánto recibes antes de confirmar. Puedes empezar desde $50.000 COP y vender de vuelta cuando quieras.",
      },
      { t: "h2", x: "Cómo elegir sin complicarse" },
      {
        t: "p",
        x: "Si vas a mover cifras grandes y con poca frecuencia, la cuenta en el exterior sigue teniendo sentido. Si el objetivo es empezar este mes, con lo que hay, y poder salir el día que lo necesites, el dólar digital es el camino con menos fricción. Lo importante es no dejar la decisión para cuando la tasa esté peor.",
      },
    ],
  },

  {
    slug: "tarjeta-rechazada-pagos-internacionales",
    locale: "es",
    tag: "PAGOS",
    minutes: "2 MIN",
    title: "Por qué tu tarjeta rebota en pagos internacionales",
    lede: "Netflix, un vuelo, una herramienta de trabajo: el cobro es en dólares y la tarjeta dice que no. Casi siempre no es falta de saldo, es cómo viaja el pago.",
    excerpt:
      "Conversión doble, cupo cerrado y bloqueos por riesgo. Cómo evitar el rechazo con una tarjeta en dólares.",
    published: "2026-08-30",
    updatedLabel: "ACTUALIZADO AGO 2026",
    waMessage: "Hola, quiero una tarjeta para pagar en dólares",
    ctaTitle: "Paga dólares con dólares y deja de reintentar.",
    related: ["que-es-un-dolar-digital", "ahorrar-en-dolares-colombia"],
    body: [
      {
        t: "p",
        x: "Un rechazo internacional rara vez significa que no tengas plata. Significa que alguno de los eslabones entre tu banco y el comercio decidió no dejar pasar la operación.",
      },
      { t: "h2", x: "Lo que pasa cuando pagas en dólares con una tarjeta en pesos" },
      {
        t: "p",
        x: "El comercio cobra en dólares. Tu tarjeta paga en pesos. En el medio, la red convierte, el banco aplica su propia tasa y suma el recargo por transacción en moneda extranjera. Ese cobro llega mayor al que viste en pantalla, y a veces ni siquiera llega: se cae antes.",
      },
      { t: "h2", x: "Las cuatro razones más comunes del rechazo" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "Cupo internacional cerrado.",
            d: "Muchas tarjetas vienen con las compras en el exterior desactivadas por defecto. El comercio ve un rechazo genérico y no dice más.",
          },
          {
            n: "02",
            t: "Bloqueo por riesgo.",
            d: "Un cobro recurrente desde otro país activa la alerta antifraude. La operación se cae y el reintento automático del comercio también.",
          },
          {
            n: "03",
            t: "Conversión doble.",
            d: "Si el cobro pasa por una tercera moneda antes de llegar a pesos, se convierte dos veces. El monto final cambia y puede exceder el límite autorizado.",
          },
          {
            n: "04",
            t: "Restricción del comercio.",
            d: "Algunos servicios solo aceptan tarjetas emitidas en ciertos países o rechazan rangos que identifican como prepago local.",
          },
        ],
      },
      { t: "h2", x: "Cómo se evita" },
      {
        t: "p",
        x: "La forma más directa es que el pago nazca ya en dólares. Con una tarjeta en dólares no hay conversión en el momento del cobro: el comercio pide dólares y recibe dólares, así que desaparecen el recargo por moneda extranjera y la mayoría de los rechazos asociados a la conversión.",
      },
      {
        t: "note",
        tag: "CÓMO LO HACEMOS",
        x: "La tarjeta Monokoro se crea desde el chat y gasta directo de tu saldo en dólares. La tasa de recarga se ve antes de confirmar, y puedes congelarla o eliminarla en cualquier momento.",
      },
      { t: "h2", x: "Qué revisar antes del próximo intento" },
      {
        t: "list",
        items: [
          {
            n: "01",
            t: "En qué moneda está el cobro.",
            d: "Si el comercio ofrece pagar en pesos, casi siempre sale más caro que dejar el cobro en dólares.",
          },
          {
            n: "02",
            t: "Con qué saldo lo estás pagando.",
            d: "Pagar dólares con dólares elimina el paso donde se pierde plata y donde se cae la transacción.",
          },
          {
            n: "03",
            t: "Si el cobro es recurrente.",
            d: "Una suscripción que rebota una vez suele volver a rebotar. Cambia el medio de pago antes de que suspendan el servicio.",
          },
        ],
      },
    ],
  },
];

/** The post the blog index leads with. Kept explicit rather than "the newest"
 *  so editorial order is a decision, not a side effect of a date field. */
export const FEATURED_SLUG = "que-es-un-dolar-digital";

export const postsFor = (locale: string): Post[] =>
  POSTS.filter((p) => p.locale === locale);

export const getPost = (locale: string, slug: string): Post | undefined =>
  POSTS.find((p) => p.locale === locale && p.slug === slug);

export const relatedFor = (post: Post): Post[] =>
  post.related
    .map((slug) => getPost(post.locale, slug))
    .filter((p): p is Post => Boolean(p));

/** Blog path helper, so the `/aprende/` prefix is written in exactly one
 *  place. Locale prefixing is handled by next-intl's `Link`. */
export const postHref = (slug: string) => `/aprende/${slug}`;
