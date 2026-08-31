const USES = [
  {
    n: "01",
    t: "Tu plata deja de perder valor",
    d: "Cada mes que duerme en pesos, la devaluación le cobra arriendo. En dólares, no.",
  },
  {
    n: "02",
    t: "Cobras del exterior sin perder",
    d: "Recibes en dólares y los cambias cuando la tasa te convenga, no cuando el banco decida.",
  },
  {
    n: "03",
    t: "Pagas suscripciones sin rechazos",
    d: "Netflix, Spotify, software: se cobran en dólares y se pagan desde tu saldo en dólares.",
  },
  {
    n: "04",
    t: "Ahorras para el viaje",
    d: "Guardas 100 dólares apenas te pagan, antes de que se conviertan en cualquier otra cosa.",
  },
];

/**
 * "Cuatro razones para empezar hoy."
 *
 * A ruled list rather than a card grid: four claims of the same weight read
 * faster stacked than boxed. The rule is drawn as a `border-top` on each row,
 * plus one closing rule after the last — that way a row that wraps does not
 * leave a stray line hanging under it.
 */
export function Uses() {
  return (
    <section className="sec-lg gutter">
      <div className="shell">
        <div className="eyebrow">PARA QUÉ SIRVE</div>
        <h2 className="rv h-section mt-[22px] max-w-[760px]">
          Cuatro razones para empezar hoy.
        </h2>

        <ul className="mt-[clamp(32px,4vw,50px)]">
          {USES.map((u) => (
            <li
              key={u.n}
              className="rv mk-row flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2.5 border-t border-[var(--color-line)] py-[26px]"
            >
              <div className="flex min-w-0 flex-[1_1_320px] items-baseline gap-[18px]">
                <span className="ff-m text-[12px] text-[var(--color-teal)]">
                  {u.n}
                </span>
                <span className="text-[clamp(22px,3vw,32px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  {u.t}
                </span>
              </div>
              <p className="min-w-0 flex-[1_1_340px] text-[17px] leading-[1.5] text-[var(--color-muted)] text-pretty">
                {u.d}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--color-line)]" aria-hidden />
      </div>
    </section>
  );
}
