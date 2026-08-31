import { cx } from "@/lib/cx";

/**
 * The dark "qué hay detrás del chat" panel: a mono spec list plus the sentence
 * that draws the line between the channel and the infrastructure.
 *
 * That sentence is a compliance position, not a reassurance line. WhatsApp is
 * the support channel; verification, payment and delivery happen on Monokoro's
 * own infrastructure, and Monokoro does not hold the customer's funds. See
 * "The three claims the site must never get wrong" in CLAUDE.md before editing
 * any copy passed in here.
 */
export function TrustPanel({
  eyebrow = "SEGURIDAD",
  title,
  specs,
  note,
  className,
}: {
  eyebrow?: string;
  title: string;
  specs: { k: string; v: string }[];
  note: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rv panel-flat flex min-w-0 flex-col gap-4 rounded-[24px] p-[clamp(26px,3vw,38px)]",
        className,
      )}
    >
      <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-mint)]">
        {eyebrow}
      </div>
      <h3 className="text-[clamp(22px,2.8vw,29px)] font-semibold leading-[1.13] tracking-[-0.03em]">
        {title}
      </h3>

      <dl className="flex flex-col">
        {specs.map((s) => (
          <div key={s.k} className="spec-row !border-[rgba(239,246,240,0.2)]">
            <dt>{s.k}</dt>
            <dd className="text-[var(--color-mint)]">{s.v}</dd>
          </div>
        ))}
        <div className="border-t border-[rgba(239,246,240,0.2)]" aria-hidden />
      </dl>

      <p className="text-[15px] leading-[1.6] text-[rgba(239,246,240,0.62)] text-pretty">
        {note}
      </p>
    </div>
  );
}
