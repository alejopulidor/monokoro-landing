"use client";

import { useEffect, useState } from "react";
import { MonokoroMark } from "@/components/site/brand";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cx } from "@/lib/cx";

/**
 * The small looping agent conversation used by the card and business pages.
 *
 * A trimmed sibling of `components/home/whatsapp-demo.tsx`: same idea, but
 * without the rate lock, the progress rail, the quick-reply chips or the
 * composer, because those belong to the buying flow rather than to "watch a
 * card get issued". The two are kept separate on purpose — merging them would
 * produce one component with a dozen booleans.
 *
 * Read the home demo's header for the shared reasoning: it is an illustration,
 * so the whole panel is one labelled `role="img"` rather than a live region
 * announcing a message every second; the loop is derived away under reduced
 * motion instead of being corrected in an effect; and `durations[n]` is how
 * long step `n` holds, because the beats are deliberately uneven.
 */

export type ChatCard = {
  kicker: string;
  /** Optional line under the kicker — "Laura Gómez · Viaje Bogotá". */
  sub?: string;
  last4: string;
  balance: string;
  action: string;
};

export type ChatMsg = {
  at: number;
  /** Step at which it disappears — used by the typing indicator, which is
   *  replaced by the reply it stands in for. */
  off?: number;
  mine?: boolean;
  text?: string;
  kind?: "typing" | "code" | "card";
  /** Digits of the authorization code, for `kind: "code"`. */
  code?: string;
  card?: ChatCard;
};

export function AgentChat({
  script,
  durations,
  label,
  className,
  minHeight = 230,
}: {
  script: ChatMsg[];
  /** One entry per step, including step 0. `durations.length` is the cycle. */
  durations: number[];
  /** What the panel is, for assistive tech. */
  label: string;
  className?: string;
  minHeight?: number;
}) {
  const [rawStep, setRawStep] = useState(0);
  const reduced = usePrefersReducedMotion();
  const steps = durations.length;
  const step = reduced ? steps - 1 : rawStep;

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(
      () => setRawStep((rawStep + 1) % steps),
      durations[rawStep],
    );
    return () => window.clearTimeout(id);
  }, [rawStep, reduced, steps, durations]);

  const visible = script.filter(
    (m) => step >= m.at && (m.off === undefined || step < m.off),
  );

  return (
    <div
      className={cx(
        "rv card min-w-0 flex-[1_1_320px] rounded-[24px] p-[clamp(22px,3vw,30px)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_30px_62px_-48px_rgba(13,46,51,.6)]",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="flex items-center gap-2.5 rounded-[14px] bg-[#0A2B31] px-3.5 py-[11px]">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(106,221,155,0.38)] bg-[#0F3B42]">
          <MonokoroMark size={15} variant="solid" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--color-onDark)]">
            Agente Monokoro
          </div>
          <div className="ff-m text-[10px] tracking-[0.08em] text-[var(--color-mint)]">
            ● EN LÍNEA
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 px-0.5 py-4"
        style={{ minHeight }}
      >
        {visible.map((m) => (
          <div
            key={m.at}
            className={cx(
              "flex max-w-[88%] flex-col px-3.5 py-2.5 text-sm leading-[1.45] text-[var(--color-ink)] shadow-[0_1px_2px_rgba(13,46,51,.1)]",
              m.mine ? "self-end" : "self-start",
            )}
            style={{
              background: m.mine ? "var(--color-chat-mine)" : "#FFFFFF",
              borderRadius: m.mine
                ? "14px 14px 4px 14px"
                : "14px 14px 14px 4px",
              animation: "bubbleIn .3s ease both",
            }}
          >
            {m.kind === "typing" && <Typing />}
            {m.kind === "code" && m.code && <Code digits={m.code} />}
            {m.kind === "card" && m.card && <CardBubble card={m.card} />}
            {m.text && <span>{m.text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-[5px] px-0.5 py-1" aria-hidden>
      {[0, 0.18, 0.36].map((d) => (
        <span
          key={d}
          className="h-[7px] w-[7px] rounded-full bg-[var(--color-teal)]"
          style={{ animation: `blinkDot 1.1s ${d}s infinite` }}
        />
      ))}
    </div>
  );
}

/** A one-time authorization code, split into boxes the way an OTP field is. */
function Code({ digits }: { digits: string }) {
  return (
    <div className="flex min-w-[200px] flex-col gap-2">
      <div className="ff-m text-[10.5px] tracking-[0.1em] text-[var(--color-teal)]">
        CÓDIGO DE AUTORIZACIÓN
      </div>
      <div className="flex gap-1.5">
        {digits.split("").map((d, i) => (
          <span
            key={i}
            className="ff-m tnum flex-1 rounded-lg bg-[rgba(13,46,51,0.06)] py-2.5 text-center text-base"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The "card issued" receipt bubble. */
function CardBubble({ card }: { card: ChatCard }) {
  return (
    <div className="flex min-w-[210px] flex-col gap-2">
      <div className="ff-m text-[10.5px] tracking-[0.1em] text-[var(--color-teal)]">
        {card.kicker}
      </div>
      {card.sub && (
        <div className="text-[13.5px] text-[var(--color-muted)]">{card.sub}</div>
      )}
      <div className="ff-m tnum text-sm tracking-[0.1em]">•••• {card.last4}</div>
      <div className="flex justify-between gap-4 border-t border-[rgba(13,46,51,0.12)] pt-2 text-[13.5px]">
        <span className="text-[var(--color-muted)]">Saldo</span>
        <strong className="tnum">{card.balance}</strong>
      </div>
      <div className="mt-1 border-t border-[rgba(13,46,51,0.12)] pt-2.5 text-center text-[13.5px] font-semibold text-[var(--color-teal)]">
        {card.action}
      </div>
    </div>
  );
}
