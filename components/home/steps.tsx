import { SectionHead } from "@/components/shared/section-head";

const STEPS = [
  {
    n: "01",
    t: "Escríbenos",
    d: "Un mensaje de WhatsApp y recibes la tasa del día al instante. La verificación se hace una sola vez.",
  },
  {
    n: "02",
    t: "Confirma y paga",
    d: "Revisas cuánto pagas y cuánto recibes. Si te sirve, confirmas y pagas con un link seguro.",
  },
  {
    n: "03",
    t: "Recibe en tu billetera",
    d: "Te los entregamos al momento en tu billetera, a tu nombre. Guárdalos, véndelos o gástalos con tu tarjeta.",
  },
];

/**
 * "De pesos a dólares, en tres movimientos."
 *
 * `#mk-line` is the hairline connecting the three numbered dots. It is inset
 * 8% from each side so it starts and ends inside the first and last dot rather
 * than running off the edge of the section, and it is hidden below `md`
 * because at one card per row it would be a stray bar across the middle.
 *
 * The grid is `auto-fit` + `minmax(250px, 1fr)`: three across when there is
 * room, then two, then one, with no breakpoints to keep in sync.
 */
export function Steps() {
  return (
    <section id="pasos" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="CÓMO FUNCIONA"
          title="De pesos a dólares, en tres movimientos."
          lede="Sin apps nuevas ni registros largos. La verificación se hace una sola vez, con un link que te envía el agente."
        />

        <div className="relative mt-[clamp(36px,5vw,56px)]">
          <div
            id="mk-line"
            className="absolute left-[8%] right-[8%] top-[30px] hidden h-px bg-[linear-gradient(90deg,#6ADD9B,#2C7A80)] md:block"
            aria-hidden
          />

          <ol
            className="relative grid gap-x-6 gap-y-8"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}
          >
            {STEPS.map((s) => (
              <li key={s.n} className="rv mk-step flex flex-col gap-4">
                <div className="mk-dot ff-m flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[rgba(13,46,51,0.14)] bg-[var(--color-paper)] text-[17px] text-[var(--color-teal)] shadow-[0_10px_26px_-18px_rgba(13,46,51,.9)]">
                  {s.n}
                </div>
                <h3 className="text-[26px] font-semibold tracking-[-0.03em]">
                  {s.t}
                </h3>
                <p className="max-w-[340px] text-[16.5px] leading-[1.55] text-[var(--color-muted)] text-pretty">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
