export type FlowStep = { k: string; d: string; dot: string };

/**
 * "El recorrido de tu plata" — a dotted timeline showing money changing form:
 * pesos → dólares digitales → tarjeta.
 *
 * An ordered list, because the order is the whole point. The connecting line is
 * a flex child that grows to fill the row, so it stretches to whatever height
 * the copy needs instead of being a fixed rule that misses.
 *
 * `dot` is passed per step and darkens along the sequence — the colour is a
 * position cue, not decoration, which is why it lives with the data.
 */
export function FlowList({
  title,
  steps,
}: {
  title: string;
  steps: FlowStep[];
}) {
  return (
    <div className="rv card min-w-0 flex-[1_1_340px] p-[clamp(24px,3vw,36px)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_30px_62px_-48px_rgba(13,46,51,.6)]">
      <h3 className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
        {title}
      </h3>
      <ol className="mt-5 flex flex-col">
        {steps.map((s) => (
          <li
            key={s.k}
            className="flex gap-4 border-t border-[rgba(13,46,51,0.12)] py-[18px]"
          >
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <span
                className="h-[9px] w-[9px] shrink-0 rounded-full"
                style={{ background: s.dot }}
                aria-hidden
              />
              <span
                className="w-px flex-1 bg-[rgba(13,46,51,0.14)]"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                {s.k}
              </div>
              <p className="mt-2 text-[16.5px] leading-[1.55] text-[var(--color-muted)] text-pretty">
                {s.d}
              </p>
            </div>
          </li>
        ))}
        <li className="border-t border-[rgba(13,46,51,0.12)]" aria-hidden />
      </ol>
    </div>
  );
}
