import { cx } from "@/lib/cx";

export type GridItem = { n: string; t: string; d: string };

/**
 * A responsive grid of numbered cards. The design's other way of listing
 * several equal points — used where each one is a *capability* rather than a
 * step, so order does not matter and the reader can enter anywhere.
 *
 * `auto-fit` + `minmax` rather than breakpoints: the grid drops from four
 * columns to three to one at whatever width the content actually needs, and
 * there is nothing to keep in sync when a card is added.
 */
export function CardGrid({
  items,
  min = 250,
  className,
  lift = true,
}: {
  items: GridItem[];
  /** Minimum column width in px before the grid reflows. */
  min?: number;
  className?: string;
  lift?: boolean;
}) {
  return (
    <div
      className={cx("grid gap-5", className)}
      style={{ gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))` }}
    >
      {items.map((it) => (
        <div
          key={it.n + it.t}
          className={cx(
            "rv card flex flex-col gap-3.5 rounded-[20px] p-[clamp(24px,3vw,32px)]",
            lift &&
              "transition-[transform,border-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 hover:border-[rgba(13,46,51,0.26)]",
          )}
        >
          <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
            {it.n}
          </div>
          <h3 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.025em]">
            {it.t}
          </h3>
          <p className="text-base leading-[1.55] text-[var(--color-muted)] text-pretty">
            {it.d}
          </p>
        </div>
      ))}
    </div>
  );
}
