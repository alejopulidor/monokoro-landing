import { Link } from "@/i18n/navigation";
import { Arrow, MonokoroMark } from "@/components/site/brand";
import { waLink } from "@/lib/config";

/**
 * The closing CTA panel. A lighter gradient than the other dark panels so it
 * reads as the end of the page rather than as one more section.
 *
 * `secondary` is the escape hatch for a reader the page did not convince —
 * "solo quiero comprar dólares" from the card page, for instance. It is a
 * quiet link, never a second button: two buttons of equal weight is no CTA.
 */
export function Closing({
  eyebrow,
  title,
  lede,
  ctaLabel,
  waMessage,
  mark = false,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  ctaLabel: string;
  waMessage: string;
  /** Shows the isotipo above the eyebrow — the home page's treatment. */
  mark?: boolean;
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="gutter pt-[clamp(72px,10vw,124px)]">
      <div
        className="rv mk-glow panel shell"
        style={{
          background: "linear-gradient(150deg,#14545A,#07242A)",
          boxShadow:
            "0 60px 110px -60px rgba(4,22,26,.95),inset 0 1px 0 rgba(239,246,240,.1)",
        }}
      >
        <div className="mk-aur-a" aria-hidden />
        <div className="mk-aur-b" aria-hidden />
        <div className="mk-grid" aria-hidden />
        <div className="mk-spot" aria-hidden />

        <div className="relative flex flex-col items-center gap-[22px] px-[clamp(24px,4vw,48px)] py-[clamp(60px,9vw,104px)] text-center">
          {mark && <MonokoroMark size={46} variant="solid" />}

          <div className="ff-m tnum text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
            {eyebrow}
          </div>

          <h2 className="max-w-[840px] text-[clamp(34px,6vw,76px)] font-semibold leading-[0.98] tracking-[-0.042em] text-[var(--color-onDark)] text-balance">
            {title}
          </h2>

          <p className="max-w-[520px] text-[19px] leading-[1.55] text-[rgba(239,246,240,0.9)]">
            {lede}
          </p>

          <a className="mk-mag btn btn-mint mt-2" href={waLink(waMessage)}>
            {ctaLabel} <Arrow />
          </a>

          {secondary && (
            <Link
              href={secondary.href}
              className="flex items-center gap-2.5 text-base text-[rgba(239,246,240,0.8)] hover:text-[var(--color-mint)]"
            >
              {secondary.label} <Arrow />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
