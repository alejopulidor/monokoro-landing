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
  height = 380,
}: {
  script: ChatMsg[];
  /** One entry per step, including step 0. `durations.length` is the cycle. */
  durations: number[];
  /** What the panel is, for assistive tech. */
  label: string;
  className?: string;
  /**
   * Fixed height of the message viewport, in px. **Not a minimum** — see the
   * comment on the container below. Pick it from a measurement of the script's
   * tallest step at the narrowest width, not by eye.
   */
  height?: number;
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

      {/*
        **Fixed height, anchored to the bottom, clipped** — the same fix
        `components/home/whatsapp-demo.tsx` already carries, and for the same
        reason. This was `minHeight`, so the last two steps of the loop outgrew
        the floor and the card jumped taller, dragging everything below it. It
        repeated every cycle, forever.

Measure before changing the numbers, because the answer
        changes with the viewport — the bubbles wrap more when the column is
        narrow. Content height at the fullest step of the loop, as built:

        | page       | 390px | 760px | 1024px | 1440px | height |
        | ---------- | ----- | ----- | ------ | ------ | ------ |
        | /negocios  | 491px | 511px | 471px  | 430px  |  550   |
        | /tarjeta   | 328px | 328px | 287px  | 287px  |  380   |

        **760px is the worst case, not 390px** — the two columns are still side
        by side there, so the chat is at its narrowest while the type is at full
        size. An eyeball check at 1440 says the box is 120px too tall; a check
        at 760 says it has 25px to spare. Trust the second one.

        Those 25px are deliberate: at the first pass the box cleared 760px by
        5px, and one longer word or a font-metric change would have clipped the
        payoff bubble — the issued-card receipt, which is the whole point of the
        sequence.

        The jump was 223px on /negocios at 390 and 130px on /tarjeta at 390.
        Note that **the card page looked clean at desktop widths only because
        `ColoredSteps` beside it is taller and the flex row stretched the
        card** — so a reading taken at 1440 alone says "no jump" and is wrong.

        **Anchored to the top, unlike the home demo, and that difference is
        the point.** The home demo's script overflows its viewport, so there
        `justify-end` is right: new messages arrive at the bottom and old ones
        leave through the top. Here the heights clear the measured maximum, so
        nothing has to leave — and with `justify-end` the resting state parked a
        single bubble at the bottom under ~450px of blank card, which reads as a
        rendering fault rather than as a quiet conversation. Growing downwards
        from the top is what a chat window with few messages actually looks
        like.

        `overflow-hidden` and the fade stay as a safety net for a script that
        grows later: the fade is on the *bottom* edge, matching the direction
        the messages grow.

        **The chat ground and its dotted wallpaper are part of the same fix.**
        A fixed box tall enough for the whole script is mostly empty for the
        first half of the loop, and on the plain card background that emptiness
        read as an unfinished panel. On the chat ground — the same
        `--color-chat-bg` and dot pattern the home demo uses — it reads as a
        chat window with room in it, which is what every messaging app looks
        like. Killing the jump traded a moving panel for a tall one; this is
        what makes the tall one look deliberate.
      */}
      <div
        className="mt-2.5 flex flex-col gap-2 overflow-hidden rounded-[14px] bg-[var(--color-chat-bg)] px-3 py-3.5"
        style={{
          height,
          backgroundImage:
            "radial-gradient(rgba(44,122,128,.10) 1px,transparent 1px)",
          backgroundSize: "18px 18px",
          // Only visible if a future script outgrows `height`. Static, so it
          // rasterises once.
          maskImage: "linear-gradient(to top,transparent 0,#000 20px)",
          WebkitMaskImage: "linear-gradient(to top,transparent 0,#000 20px)",
        }}
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
