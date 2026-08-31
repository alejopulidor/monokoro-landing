/**
 * The mono key/value rows on the dark panels (TASA HOY · DESDE · GESTIÓN…).
 *
 * A `<dl>`, not a table or a list of divs: these are literally term/definition
 * pairs, and the semantics come free. The hairline is drawn as a `border-top`
 * on every row plus one closing rule after the last, which is how the design
 * gets a fully ruled block without a stray line under a wrapping row.
 */
export function SpecList({
  items,
  className,
}: {
  items: { k: string; v: string }[];
  className?: string;
}) {
  return (
    <dl
      className={`flex flex-col text-[rgba(239,246,240,0.92)] ${className ?? ""}`}
    >
      {items.map((s) => (
        <div key={s.k} className="spec-row">
          <dt>{s.k}</dt>
          <dd className="tnum text-[var(--color-mint)]">{s.v}</dd>
        </div>
      ))}
      <div
        className="border-t border-[rgba(239,246,240,0.24)]"
        aria-hidden
      />
    </dl>
  );
}
