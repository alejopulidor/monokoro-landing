"use client";

import { useId, useState } from "react";
import { Arrow } from "@/components/site/brand";
import type { FaqItem } from "@/content/faq";
import { waLink } from "@/lib/config";
import { cx } from "@/lib/cx";

/**
 * FAQ accordion.
 *
 * All answers stay in the DOM and are collapsed with `max-height`, not
 * conditionally rendered. Two reasons: the transition needs a box to animate,
 * and — more importantly — the answers stay in the static HTML for crawlers and
 * for in-page search, which is the whole point of publishing an FAQ. `-1` is
 * the "everything closed" state.
 *
 * The `max-height: 420px` ceiling is the design's. An answer longer than that
 * clips, so keep them short — which they should be anyway.
 *
 * Every page passes the same array it emits as `FAQPage` structured data, so
 * the two can never drift. Edit the copy in `content/faq.ts`.
 */
export function Faq({
  items,
  title,
  lede,
  waMessage,
  ctaLabel = "Preguntar por WhatsApp",
}: {
  items: FaqItem[];
  title: string;
  lede: string;
  waMessage: string;
  ctaLabel?: string;
}) {
  const [open, setOpen] = useState(-1);
  const uid = useId();

  return (
    <section id="faq" className="sec-lg gutter">
      <div className="shell flex flex-wrap gap-[clamp(28px,4vw,64px)]">
        <div className="rv flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <div className="eyebrow">FAQ</div>
          <h2 className="text-[clamp(32px,4.6vw,58px)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance">
            {title}
          </h2>
          <p className="text-[18px] leading-[1.55] text-[var(--color-muted)] text-pretty">
            {lede}
          </p>
          <a className="mk-mag btn btn-outline self-start" href={waLink(waMessage)}>
            {ctaLabel} <Arrow />
          </a>
        </div>

        <div className="flex min-w-0 flex-[1_1_440px] flex-col">
          {items.map((f, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-panel-${i}`;
            const buttonId = `${uid}-button-${i}`;
            return (
              <div key={f.q} className="border-t border-[var(--color-line)]">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-baseline justify-between gap-5 py-[22px] text-left"
                  >
                    <span className="text-[clamp(18px,2.2vw,21px)] font-medium leading-[1.3] tracking-[-0.02em]">
                      {f.q}
                    </span>
                    <span
                      className={cx(
                        "ff-m shrink-0 text-[18px] text-[var(--color-teal)] transition-transform duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]",
                      )}
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden transition-[max-height,opacity] duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                  style={{
                    maxHeight: isOpen ? "420px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="max-w-[620px] pb-6 text-[16.5px] leading-[1.6] text-[var(--color-muted)] text-pretty">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="border-t border-[var(--color-line)]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
