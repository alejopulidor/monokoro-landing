"use client";

import { useId, useState } from "react";
import { Arrow } from "@/components/site/brand";
import { FAQ_ITEMS } from "@/content/faq";
import { waLink } from "@/lib/config";

/**
 * FAQ accordion.
 *
 * All answers are in the DOM at all times and collapsed with `max-height`, not
 * conditionally rendered. Two reasons: the `max-height` transition needs a box
 * to animate, and — more importantly — the answers stay in the static HTML for
 * crawlers and for in-page search, which is the whole point of publishing an
 * FAQ. `-1` is the "everything closed" state.
 *
 * The `max-height: 420px` ceiling is the design's. An answer longer than that
 * would clip, so keep them short — which they should be anyway.
 *
 * The copy lives in `content/faq.ts` because the page also emits it as
 * `FAQPage` structured data, and the two must not drift.
 */
export function Faq() {
  const [open, setOpen] = useState(-1);
  const uid = useId();

  return (
    <section id="faq" className="sec-lg gutter">
      <div className="shell flex flex-wrap gap-[clamp(28px,4vw,64px)]">
        <div className="rv flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <div className="eyebrow">FAQ</div>
          <h2 className="text-[clamp(32px,4.6vw,58px)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance">
            Lo que preguntan antes de comprar.
          </h2>
          <p className="text-[18px] leading-[1.55] text-[var(--color-muted)] text-pretty">
            ¿Tienes otra pregunta? Escríbenos y el agente te responde en minutos.
          </p>
          <a
            className="mk-mag btn btn-outline self-start"
            href={waLink("Hola, tengo una pregunta sobre Monokoro")}
          >
            Preguntar por WhatsApp <Arrow />
          </a>
        </div>

        <div className="flex min-w-0 flex-[1_1_440px] flex-col">
          {FAQ_ITEMS.map((f, i) => {
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
                      className="ff-m shrink-0 text-[18px] text-[var(--color-teal)] transition-transform duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]"
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
