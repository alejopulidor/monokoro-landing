/*
  The Monokoro isotipo, lifted from the design canvas.

  Two variants, both from the source file — they are not interchangeable:

  - `duo` is the two-colour lockup (mint body, teal counter-shape). It is the
    identity, and it is what the nav, the footer and the wordmark use.
  - `solid` is a single `fill-rule="evenodd"` path that punches the counter
    out instead of colouring it, so the mark can be drawn in one arbitrary
    colour. It is what goes on the dark panels, the card face and the chat
    avatar, where a teal shape would disappear into the background.

  The geometry is a 45°-rotated group inside a 478×390 viewBox, so the mark is
  wider than it is tall. `size` sets the **width**; the height follows from the
  ratio. Passing both would shear it.

  Server components — no "use client" — so they add nothing to the bundle.
*/

const RATIO = 390 / 478;

/** The two-colour body path (mint) and its counter (teal). */
const BODY_D =
  "M -156.7 -93.3 L 0 -93.3 L 0 -154 L 155.2 -154 L 155.2 95.2 A 60 60 0 0 1 95.2 155.2 L -156.7 155.2 A 60 60 0 0 1 -216.7 95.2 L -216.7 -33.3 A 60 60 0 0 1 -156.7 -93.3 Z";
const COUNTER_D =
  "M -91.9 -92.6 L -91.9 -157.8 A 60 60 0 0 1 -31.9 -217.8 L 95.2 -217.8 A 60 60 0 0 1 155.2 -157.8 L 155.2 -152.6 A 60 60 0 0 1 95.2 -92.6 Z";

/** The single-path version. `evenodd` is what carves the counter out. */
const SOLID_D =
  "M -216.7 -33.3 A 60 60 0 0 1 -156.7 -93.3 L -91.9 -93.3 L -91.9 -157.8 A 60 60 0 0 1 -31.9 -217.8 L 95.2 -217.8 A 60 60 0 0 1 155.2 -157.8 L 155.2 95.2 A 60 60 0 0 1 95.2 155.2 L -156.7 155.2 A 60 60 0 0 1 -216.7 95.2 Z M -76.4 -92 L -76.4 -157.8 A 44.5 44.5 0 0 1 -31.9 -202.3 L 95.2 -202.3 A 44.5 44.5 0 0 1 139.7 -157.8 L 139.7 -143 A 51 51 0 0 1 88.7 -92 Z";

export function MonokoroMark({
  size = 30,
  variant = "duo",
  /** `solid` only. Defaults to the brand mint. */
  color = "#6ADD9B",
  title,
  className,
}: {
  size?: number;
  variant?: "duo" | "solid";
  color?: string;
  /** Give this only when the mark is the sole label of a link. When a visible
   *  "Monokoro" wordmark sits next to it, leave it out — the mark is then
   *  decorative and a second label just makes a screen reader say it twice. */
  title?: string;
  className?: string;
}) {
  const common = {
    width: size,
    height: Math.round(size * RATIO * 100) / 100,
    viewBox: "0 0 478 390",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    role: title ? ("img" as const) : undefined,
    "aria-hidden": title ? undefined : (true as const),
  };

  if (variant === "solid") {
    return (
      <svg {...common}>
        {title && <title>{title}</title>}
        <path
          transform="translate(239,195) rotate(45)"
          fill={color}
          fillRule="evenodd"
          d={SOLID_D}
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      {title && <title>{title}</title>}
      <g transform="translate(239,195) rotate(45)">
        <path fill="#6ADD9B" d={BODY_D} />
        <path fill="#338289" d={COUNTER_D} />
        {/* Drawn last so it sits over the counter's lower edge — this is what
            produces the overlap in the identity. */}
        <rect
          x="-216.7"
          y="-93.3"
          width="371.9"
          height="248.5"
          rx="60"
          ry="60"
          fill="#6ADD9B"
        />
      </g>
    </svg>
  );
}

/** Mark + "Monokoro" wordmark. The lockup used by the nav and both footers. */
export function Wordmark({
  size = 30,
  wordSize = 19,
  className,
}: {
  size?: number;
  wordSize?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-[11px] ${className ?? ""}`}>
      <MonokoroMark size={size} />
      <span
        className="font-semibold tracking-[-0.02em]"
        style={{ fontSize: wordSize }}
      >
        Monokoro
      </span>
    </span>
  );
}

/** The mono arrow the design puts inside every button and link. It is a text
 *  glyph, not an icon: it inherits the label's colour and optical size. */
export function Arrow({ className }: { className?: string }) {
  return (
    <span className={`ff-m ${className ?? ""}`} aria-hidden>
      →
    </span>
  );
}
