import { cx } from "@/lib/cx";

/**
 * One headline rate: a mono label, the figure, and the unit spelled out.
 *
 * Rates are **referential** everywhere on this site — the "SE CONFIRMA EN EL
 * CHAT" line next to every quoter CTA is load-bearing, not decoration. Nothing
 * rendered here is a live quote.
 *
 * `tone="dark"` is the emphasised one. Use exactly one per group; two dark
 * cards next to each other read as a table, not as a highlight.
 */
export function RateCard({
  label,
  value,
  unit = "pesos por dólar",
  tone = "light",
  glow = false,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "light" | "dark";
  /** Adds the cursor spotlight. Only worth it on a card big enough to notice. */
  glow?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cx(
        "rv flex flex-1 flex-col justify-center gap-2.5 p-[clamp(26px,3vw,36px)]",
        dark
          ? "panel-flat rounded-[24px] shadow-[0_40px_72px_-50px_rgba(13,46,51,.9)]"
          : "card rounded-[22px]",
        glow && dark && "mk-glow",
      )}
    >
      {glow && dark && (
        <>
          <div className="mk-aur-a opacity-40" aria-hidden />
          <div className="mk-spot" aria-hidden />
        </>
      )}
      <div
        className={cx(
          "ff-m relative text-[11px] tracking-[0.12em]",
          dark ? "text-[var(--color-mint)]" : "text-[var(--color-teal)]",
        )}
      >
        {label}
      </div>
      <div className="tnum relative text-[clamp(38px,5vw,58px)] font-semibold leading-none tracking-[-0.04em]">
        {value}
      </div>
      <div
        className={cx(
          "relative text-[15px]",
          dark ? "text-[rgba(239,246,240,0.7)]" : "text-[var(--color-muted)]",
        )}
      >
        {unit}
      </div>
    </div>
  );
}
