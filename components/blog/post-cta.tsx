import { Arrow } from "@/components/site/brand";
import { fmtCOP } from "@/lib/format";
import { RATE_BUY, waLink } from "@/lib/config";

/**
 * The dark CTA panel that closes an article, and the lighter one that closes
 * the blog index.
 *
 * Each article passes its own `title` and `message`, so the prefilled WhatsApp
 * text reflects what the person was just reading — the agent opens knowing
 * they came from the savings piece rather than from the home page.
 */
export function PostCta({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="mx-auto mt-[clamp(44px,6vw,72px)] max-w-[860px]">
      <div className="rv panel">
        <div className="mk-aur-a" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-x-[34px] gap-y-6 p-[clamp(28px,4vw,46px)]">
          <div className="min-w-0 flex-[1_1_300px]">
            <div className="ff-m tnum text-[11.5px] tracking-[0.12em] text-[var(--color-mint)]">
              TASA HOY · $ {fmtCOP(RATE_BUY)} COP / USD
            </div>
            <h2 className="mt-3.5 text-[clamp(26px,3.4vw,38px)] font-semibold leading-[1.04] tracking-[-0.038em] text-[var(--color-onDark)] text-balance">
              {title}
            </h2>
          </div>
          <a className="mk-mag btn btn-mint" href={waLink(message)}>
            Cotizar por WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </div>
  );
}

/** The blog index's closing band — light, because the index is not an article
 *  and a second dark panel right after the featured card would flatten both. */
export function IndexCta() {
  return (
    <section className="gutter pt-[clamp(56px,8vw,110px)]">
      <div className="rv card shell flex flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-[26px] p-[clamp(30px,4vw,52px)]">
        <div className="min-w-0 flex-[1_1_380px]">
          <div className="ff-m tnum text-[11.5px] tracking-[0.12em] text-[var(--color-teal)]">
            TASA HOY · $ {fmtCOP(RATE_BUY)} COP / USD
          </div>
          <h2 className="mt-3.5 max-w-[560px] text-[clamp(26px,3.6vw,42px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
            Cuando termines de leer, el chat sigue abierto.
          </h2>
        </div>
        <a
          className="mk-mag btn btn-ink"
          href={waLink("Hola, quiero comprar dólares digitales")}
        >
          Comprar por WhatsApp <Arrow />
        </a>
      </div>
    </section>
  );
}
