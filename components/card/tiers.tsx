import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { SpecList } from "@/components/shared/spec-list";
import { CardFan } from "./hero-visual";
import { CARD_TIERS_SPECS } from "@/content/card";

/**
 * "Una para ti. Las que necesites para tu negocio."
 *
 * The bridge to `/negocios`. It is a dark panel rather than another light
 * section because it is a hand-off, not a feature — the reader is either done
 * here or belongs on the other page.
 */
export function CardTiers() {
  return (
    <section className="sec-lg gutter">
      <div className="mk-glow panel shell">
        <div className="mk-aur-b" aria-hidden />
        <div className="mk-grid" aria-hidden />
        <div className="mk-spot" aria-hidden />

        <div className="relative flex flex-wrap gap-[clamp(32px,4vw,52px)] px-[clamp(24px,4vw,56px)] py-[clamp(30px,4.4vw,60px)]">
          <div className="flex min-w-0 flex-[1_1_340px] flex-col justify-between gap-8">
            <div>
              <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
                DOS TIPOS
              </div>
              <h2 className="mt-[22px] text-[clamp(32px,5vw,60px)] font-semibold leading-none tracking-[-0.042em] text-[var(--color-onDark)] text-balance">
                Una para ti. Las que necesites para tu negocio.
              </h2>
              <p className="mt-[22px] max-w-[460px] text-[19px] leading-[1.55] text-[rgba(239,246,240,0.9)] text-pretty">
                La individual gasta tu saldo personal. La empresarial se
                multiplica: una por cliente, por campaña o por proveedor, todas
                controladas desde el mismo chat.
              </p>
            </div>

            <SpecList items={CARD_TIERS_SPECS} />

            <Link className="mk-mag btn btn-paper self-start" href="/negocios">
              Monokoro para negocios <Arrow />
            </Link>
          </div>

          <div className="flex min-w-0 flex-[1_1_300px] items-center justify-center">
            <CardFan />
          </div>
        </div>
      </div>
    </section>
  );
}
