import { SectionHead } from "./section-head";

export type RuledItem = { n: string; t: string; d: string };

/**
 * A ruled list of numbered claims — the layout the design reaches for whenever
 * several points carry the same weight and a card grid would just box them.
 *
 * Used by "para qué sirve" on the home page, "el problema" and "para qué la
 * usan" on the card page, and "casos" and "API" on the business page.
 *
 * The rule is a `border-top` on every row plus one closing rule after the last,
 * which is what stops a wrapping row from leaving a stray line hanging under
 * it. The numbering is real information here — these are enumerations the
 * reader can refer back to — not decoration.
 */
export function RuledList({
  id,
  eyebrow,
  title,
  lede,
  items,
  footnote,
  after,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  items: RuledItem[];
  /** Optional mono line under the closing rule. */
  footnote?: { a: string; b?: string };
  /** Extra block inside the same section, under the list — the business page
   *  follows its use cases with a grid of reasons. */
  after?: React.ReactNode;
}) {
  return (
    <section id={id} className="sec-lg gutter">
      <div className="shell">
        {lede ? (
          <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
        ) : (
          <>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="rv h-section mt-[22px] max-w-[780px]">{title}</h2>
          </>
        )}

        <ul className="mt-[clamp(30px,4vw,46px)]">
          {items.map((it) => (
            <li
              key={it.n}
              className="rv mk-row flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2.5 border-t border-[var(--color-line)] py-6"
            >
              <div className="flex min-w-0 flex-[1_1_300px] items-baseline gap-[18px]">
                <span className="ff-m text-[12px] text-[var(--color-teal)]">
                  {it.n}
                </span>
                <span className="text-[clamp(21px,2.8vw,30px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  {it.t}
                </span>
              </div>
              <p className="min-w-0 flex-[1_1_340px] text-[17px] leading-[1.5] text-[var(--color-muted)] text-pretty">
                {it.d}
              </p>
            </li>
          ))}
        </ul>

        {footnote ? (
          <div className="ff-m flex flex-wrap gap-x-4 gap-y-2.5 border-t border-[var(--color-line)] pt-[22px] text-[11.5px] tracking-[0.12em] text-[var(--color-teal)]">
            <span>{footnote.a}</span>
            {footnote.b && (
              <span className="text-[var(--color-faint)]">{footnote.b}</span>
            )}
          </div>
        ) : (
          <div className="border-t border-[var(--color-line)]" aria-hidden />
        )}

        {after}
      </div>
    </section>
  );
}
