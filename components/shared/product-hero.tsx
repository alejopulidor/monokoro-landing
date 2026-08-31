import { Arrow } from "@/components/site/brand";
import { SpecList } from "./spec-list";
import { waLink } from "@/lib/config";

/**
 * The hero both product pages open with: eyebrow, headline, supporting column
 * with two CTAs and a mono perks row, then a dark panel holding the page's
 * signature visual above a spec list.
 *
 * The headline and the supporting column are two `flex: 1 1 <basis>` children
 * of a wrapping row, baseline-aligned at the bottom — the same pattern the home
 * hero uses, and the reason these pages have almost no breakpoint prefixes.
 *
 * `visual` is whatever belongs in the panel: the card page drops one card, the
 * business page fans two. Keeping it a slot is what stops this from growing a
 * `variant` prop and a branch for each page.
 */
export function ProductHero({
  eyebrow,
  title,
  lede,
  ctaLabel,
  waMessage,
  secondaryLabel,
  secondaryHref,
  perks,
  specs,
  visual,
  caption,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  ctaLabel: string;
  waMessage: string;
  secondaryLabel: string;
  /** Same-page anchor. */
  secondaryHref: string;
  perks: string[];
  specs: { k: string; v: string }[];
  visual: React.ReactNode;
  /** Optional line between the visual and the specs. */
  caption?: { k: string; d: string };
}) {
  return (
    <header className="gutter pt-[clamp(48px,7vw,84px)]">
      <div className="shell">
        <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-teal)]">
          {eyebrow}
        </div>

        <div className="mt-[26px] flex flex-wrap items-end gap-[clamp(28px,4vw,64px)]">
          <h1 className="hero-in min-w-0 flex-[1_1_440px] text-[clamp(42px,7.4vw,96px)] font-semibold leading-[0.92] tracking-[-0.045em] text-balance">
            {title}
          </h1>

          <div
            className="hero-in flex min-w-0 flex-[1_1_320px] flex-col gap-[26px] pb-2.5"
            style={{ animationDelay: ".14s" }}
          >
            <p className="text-[20px] leading-[1.5] text-[var(--color-muted)] text-pretty">
              {lede}
            </p>

            <div className="flex flex-wrap gap-3">
              <a className="mk-mag btn btn-ink" href={waLink(waMessage)}>
                {ctaLabel} <Arrow />
              </a>
              <a className="mk-mag btn btn-outline" href={secondaryHref}>
                {secondaryLabel}
              </a>
            </div>

            <div className="ff-m flex flex-wrap gap-x-[18px] gap-y-2 text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
              {perks.map((p, i) => (
                <span key={p} className="contents">
                  {i > 0 && <span aria-hidden>·</span>}
                  <span>{p}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="hero-in mk-glow panel mt-[clamp(30px,5vw,54px)]"
          style={{ animationDelay: ".26s" }}
        >
          <div className="mk-aur-a" aria-hidden />
          <div className="mk-grid" aria-hidden />
          <div className="mk-spot" aria-hidden />

          {/* `perspective` belongs on this wrapper, not on the card itself: a 3D
              transform needs perspective on an *ancestor* to read as depth. */}
          <div
            className="relative flex flex-col items-center gap-[clamp(26px,4vw,40px)] px-[clamp(24px,4vw,56px)] pb-[clamp(36px,5vw,60px)] pt-[clamp(48px,8vw,92px)]"
            style={{ perspective: "1600px" }}
          >
            {visual}

            {caption && (
              <div className="w-full max-w-[860px] text-center">
                <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
                  {caption.k}
                </div>
                <p className="mt-3 text-[17px] leading-[1.55] text-[rgba(239,246,240,0.82)] text-pretty">
                  {caption.d}
                </p>
              </div>
            )}

            <SpecList items={specs} className="w-full max-w-[860px]" />
          </div>
        </div>
      </div>
    </header>
  );
}
