/**
 * The heading block every section on the home page opens with: a mono eyebrow,
 * a big headline, and an optional paragraph that sits **baseline-aligned to
 * the right of** the headline on wide screens and stacks under it on narrow
 * ones.
 *
 * That layout is the design's signature and it is done with `flex-wrap` plus
 * two `flex: 1 1 <basis>` children rather than a grid with breakpoints: the
 * columns break apart at whatever width the content actually needs, so it
 * behaves the same in a 1320px canvas and in a 380px phone.
 *
 * `title` takes a ReactNode so a section can control its own line breaks —
 * the copy decides where it breaks, not the viewport.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "end",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** `end` baseline-aligns the paragraph with the last line of the headline;
   *  `start` tops them out, for when the paragraph is much taller. */
  align?: "end" | "start";
}) {
  return (
    <>
      <div className="eyebrow">{eyebrow}</div>
      <div
        className={`mt-6 flex flex-wrap gap-[clamp(28px,4vw,64px)] ${
          align === "end" ? "items-end" : "items-start"
        }`}
      >
        <h2 className="rv h-section min-w-0 flex-[1_1_420px]">{title}</h2>
        {lede && (
          <p className="rv lede mb-2.5 min-w-0 flex-[1_1_320px]">{lede}</p>
        )}
      </div>
    </>
  );
}
