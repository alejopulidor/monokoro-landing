export type CompareRow = { k: string; a: string; b: string };

/**
 * The "same thing, two ways" comparison.
 *
 * A real `<table>`, not a grid of divs: it is tabular data, the header cells
 * label their columns, and a screen reader announces "Cobros en dólares,
 * Tarjeta Monokoro, se pagan en dólares" instead of reading three loose
 * fragments.
 *
 * The wrapper scrolls on its own (`overflow-x: auto`) so a narrow phone never
 * makes the whole page scroll sideways. Column widths use `minmax()` through
 * `table-layout: fixed` percentages so the middle column cannot collapse.
 *
 * Column A is the status quo and is set in the muted tone; column B is
 * Monokoro and is set in ink. The tone *is* the argument — keep it.
 */
export function CompareTable({
  rows,
  labelA,
  labelB,
}: {
  rows: CompareRow[];
  labelA: string;
  labelB: string;
}) {
  return (
    <div className="rv card mt-[clamp(30px,4vw,46px)] rounded-[24px] p-[clamp(20px,3vw,34px)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_30px_62px_-48px_rgba(13,46,51,.6)]">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="ff-m text-[clamp(10px,1.5vw,11.5px)] tracking-[0.11em] text-[var(--color-faint)]">
              <th scope="col" className="w-[38%] pb-4 font-normal">
                <span className="sr-only">Concepto</span>
              </th>
              <th scope="col" className="w-[31%] pb-4 font-normal">
                {labelA}
              </th>
              <th
                scope="col"
                className="w-[31%] pb-4 font-normal text-[var(--color-teal)]"
              >
                {labelB}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t border-[rgba(13,46,51,0.12)]">
                <th
                  scope="row"
                  className="py-4 pr-4 align-baseline text-[clamp(14px,1.9vw,17px)] font-medium leading-[1.35]"
                >
                  {r.k}
                </th>
                <td className="py-4 pr-4 align-baseline text-[clamp(13.5px,1.8vw,16px)] leading-[1.4] text-[var(--color-faint)]">
                  {r.a}
                </td>
                <td className="py-4 align-baseline text-[clamp(13.5px,1.8vw,16px)] font-medium leading-[1.4] text-[var(--color-ink)]">
                  {r.b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[rgba(13,46,51,0.12)]" aria-hidden />
    </div>
  );
}
