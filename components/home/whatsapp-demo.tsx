"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { Arrow, MonokoroMark } from "@/components/site/brand";
import { fmtClock, fmtCOP, fmtUSD } from "@/lib/format";
import { RATE_BUY, waLink } from "@/lib/config";
import { cx } from "@/lib/cx";

/**
 * The looping WhatsApp conversation in the hero.
 *
 * It is an **illustration of the product**, not a real chat, so the whole
 * panel is exposed to assistive tech as a single labelled image rather than as
 * a stream of messages appearing and vanishing every few seconds — which is
 * what a live region would announce.
 *
 * How the loop works: `step` walks 0…10 and every element on the panel derives
 * from it. `STEP_MS[n]` is how long step `n` stays on screen before the next
 * one. Nothing is scheduled with a fixed interval, because the beats are
 * deliberately uneven — the pause on the quote (3.4s) is what gives the reader
 * time to read the numbers, and the pause at the end (4.2s) is what keeps the
 * loop from feeling like a GIF.
 *
 * Server-rendered output is the empty chat at step 0, which is also what the
 * design starts with. That is intentional: no hydration mismatch, and no
 * fabricated "conversation" baked into the static HTML.
 *
 * Clicking a quick-reply chip just sets the step; the effect below reschedules
 * on its own, so there is no separate "resume" path to keep in sync.
 */

const STEP_MS = [700, 1100, 1500, 1300, 1500, 1400, 1500, 3400, 1500, 2000, 4200];
const STEPS = STEP_MS.length;

/** The quote the demo walks through. Fixed, not derived from the quoter — the
 *  story has to stay legible while the numbers animate elsewhere. */
const QUOTE_COP = 500_000;

/** Rate-lock countdown, in seconds. The design shows just under five minutes. */
const LOCK_SECONDS = 298;

/** When each rail label lights up. */
const RAIL = [
  { t: "COTIZAS", at: 3 },
  { t: "CONFIRMAS", at: 7 },
  { t: "RECIBES", at: 9 },
] as const;

type Msg = {
  /** Step at which the bubble appears. */
  at: number;
  /** Step at which it disappears again — used only by the typing indicator,
   *  which is replaced by the reply it was standing in for. */
  off?: number;
  mine?: boolean;
  text?: string;
  kind?: "typing" | "chips" | "quote" | "receipt" | "cta";
};

const SCRIPT: Msg[] = [
  { at: 1, mine: true, text: "Hola, quiero comprar dólares digitales 👋" },
  { at: 2, off: 3, kind: "typing" },
  {
    at: 3,
    text: "¡Hola! Soy el agente de Monokoro. Te verificas una sola vez y quedas listo. ¿Cuánto quieres cambiar?",
  },
  { at: 4, off: 5, mine: true, kind: "chips" },
  { at: 5, mine: true, text: "Quiero comprar $500.000" },
  { at: 6, off: 7, kind: "typing" },
  { at: 7, kind: "quote" },
  { at: 8, mine: true, text: "Confirmo" },
  { at: 9, kind: "receipt" },
  { at: 10, kind: "cta" },
];

const CHIPS = ["$ 500.000", "$ 1.000.000", "Otro monto"];

export function WhatsappDemo() {
  const [rawStep, setRawStep] = useState(0);
  const [rawLock, setRawLock] = useState(LOCK_SECONDS);
  const reduced = usePrefersReducedMotion();

  /**
   * Under reduced motion the loop is not stopped — it is never started, and
   * the panel is *derived* as the finished conversation. Deriving rather than
   * writing state in an effect keeps the first paint correct and avoids a
   * render pass that exists only to correct the previous one.
   */
  const step = reduced ? STEPS - 1 : rawStep;
  const lock = reduced ? 0 : rawLock;

  const payFmt = fmtCOP(QUOTE_COP);
  const getFmt = fmtUSD(QUOTE_COP / RATE_BUY);

  // The loop advances by re-running this effect on every step, so each step
  // gets its own duration without a self-recursive scheduler. Changing `step`
  // from anywhere — including a chip click — restarts the timer for free.
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      const next = (rawStep + 1) % STEPS;
      // Wrapping back to the start resets the rate lock, or the second pass
      // would open with a countdown already half spent.
      if (next === 0) setRawLock(LOCK_SECONDS);
      setRawStep(next);
    }, STEP_MS[rawStep]);
    return () => window.clearTimeout(id);
  }, [rawStep, reduced]);

  // The lock only counts down once the quote is on screen.
  useEffect(() => {
    if (reduced || rawStep < 6) return;
    const id = window.setInterval(
      () => setRawLock((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [rawStep, reduced]);

  const status =
    step >= 9
      ? "● OPERACIÓN COMPLETADA"
      : step >= 7
        ? "● TASA FIJA POR 5 MIN"
        : "● EN LÍNEA · RESPONDE EN MINUTOS";

  const visible = SCRIPT.filter(
    (m) => step >= m.at && (m.off === undefined || step < m.off),
  );

  return (
    <div
      className="flex w-full max-w-[410px] flex-col overflow-hidden rounded-[22px] bg-[var(--color-chat-bg)] shadow-[0_34px_74px_rgba(4,22,26,.5),inset_0_1px_0_rgba(255,255,255,.6)]"
      role="img"
      aria-label="Ejemplo de la conversación en WhatsApp: pides una cotización, confirmas la tasa y recibes tus dólares digitales en minutos."
    >
      {/* ── Chat header ─────────────────────────────────────────────── */}
      {/*
        **The header's height is reserved, not natural.** `status` cycles
        through three strings and the longest,
        "EN LÍNEA · RESPONDE EN MINUTOS", wraps to two lines below ~430px while
        the other two fit on one — so the header grew and shrank on every loop
        and the page moved 16px with it, measured at 390px. It is the same class
        of defect as the message viewport below, in a place nobody looks.

        Two things that did *not* work, so they do not get tried again:
        hiding the WHATSAPP caption freed ~86px and the string still wrapped
        (the mock sits inside a padded panel, so the column is far narrower than
        the viewport); and `nowrap` with a smaller face fitted it only by
        ellipsising — measured 197px of text into a 130px box at 360, which cut
        "RESPONDE EN MINUTOS" off on every phone.

        So the height is pinned per regime instead: two lines' worth below
        430px, one above. Re-derive by removing the classes and measuring the
        tallest `status` at 360px and at 1440px.
      */}
      <div className="relative flex h-[79px] items-center gap-[11px] overflow-hidden bg-[#0A2B31] px-[15px] py-[13px] min-[430px]:h-[64px]">
        <div
          className="pointer-events-none absolute inset-0 h-[40%] bg-[linear-gradient(90deg,transparent,rgba(106,221,155,.12),transparent)]"
          style={{ animation: "scanline 6s linear infinite" }}
          aria-hidden
        />
        <div className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(106,221,155,0.34)] bg-[rgba(106,221,155,0.14)]">
          <MonokoroMark size={17} variant="solid" />
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="text-[14.5px] font-semibold text-[var(--color-onDark)]">
            Agente Monokoro
          </div>
          <div className="ff-m text-[10.5px] tracking-[0.08em] text-[var(--color-mint)]">
            {status}
          </div>
        </div>
        <span className="ff-m relative text-[10px] tracking-[0.1em] text-[rgba(239,246,240,0.5)]">
          WHATSAPP
        </span>
      </div>

      {/* ── Progress rail ───────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--color-line-soft)] bg-[var(--color-chat-bar)] px-3.5 py-[11px]">
        {RAIL.map((r) => {
          const on = step >= r.at;
          return (
            <div key={r.t} className="flex flex-1 flex-col gap-1.5">
              <div
                className="h-0.5 rounded-sm transition-colors duration-500"
                style={{ background: on ? "var(--color-teal)" : "rgba(13,46,51,.14)" }}
              />
              <span
                className="ff-m text-[9.5px] tracking-[0.1em] transition-colors duration-500"
                style={{ color: on ? "var(--color-teal)" : "var(--color-slate)" }}
              >
                {r.t}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Messages ────────────────────────────────────────────────── */}
      {/*
        **Fixed height, anchored to the bottom, clipped.** It was
        `min-h-[405px] flex-1`, so when the last two messages arrived the content
        outgrew the minimum and the whole card jumped taller — a layout shift in
        the middle of the hero, which is the worst place for one.

        A real chat does not resize: it has a viewport, new messages arrive at
        the bottom and old ones leave through the top. `justify-end` plus
        `overflow-hidden` is exactly that, and it makes this card's height a
        constant, so nothing below it can move either.

        Losing the earliest bubbles off the top is the intended behaviour, not a
        compromise — the newest message is the one being read.
      */}
      <div
        className="flex h-[430px] flex-col justify-end gap-2 overflow-hidden px-3 py-[15px]"
        style={{
          backgroundImage: "radial-gradient(rgba(44,122,128,.10) 1px,transparent 1px)",
          backgroundSize: "18px 18px",
          // Fades the top edge so the oldest bubble leaving the viewport reads
          // as intended rather than as a clipping bug. Static, so it rasterises
          // once — unlike the blurs this page had, which were re-rasterised
          // every frame.
          maskImage: "linear-gradient(to bottom,transparent 0,#000 22px)",
          WebkitMaskImage: "linear-gradient(to bottom,transparent 0,#000 22px)",
        }}
      >
        {visible.map((m) => (
          <Bubble key={m.at} m={m}>
            {m.kind === "typing" && <Typing />}
            {m.kind === "chips" && (
              <div className="flex flex-wrap justify-end gap-[7px]">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setRawStep(5)}
                    className="mk-chip rounded-full border border-[rgba(13,46,51,0.2)] bg-white/85 px-3.5 py-2 text-[13px] text-[var(--color-ink)]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            {m.kind === "quote" && (
              <Quote pay={payFmt} get={getFmt} lock={lock} />
            )}
            {m.kind === "receipt" && <Receipt balance={getFmt} />}
            {m.kind === "cta" && <CardCta />}
            {m.text && <span>{m.text}</span>}
          </Bubble>
        ))}
      </div>

      {/* ── Composer (decorative; the button is the real CTA) ────────── */}
      <div className="flex items-center gap-[9px] border-t border-[var(--color-line-soft)] bg-[var(--color-chat-bar)] px-[13px] py-[11px]">
        <div className="flex-1 rounded-full bg-white px-3.5 py-[9px] text-[13px] text-[var(--color-faint)]">
          Escribe un mensaje…
        </div>
        <a
          href={waLink("Hola, quiero comprar dólares digitales")}
          aria-label="Abrir WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-onDark)] transition-colors hover:bg-[var(--color-teal)]"
        >
          <Arrow />
        </a>
      </div>
    </div>
  );
}

/* ─── Bubble shell ──────────────────────────────────────────────────── */

function Bubble({ m, children }: { m: Msg; children: React.ReactNode }) {
  // The quick-reply chips are not a message — they are controls floating on
  // the chat background, so the bubble chrome is dropped for them.
  const bare = m.kind === "chips";
  return (
    <div
      className={cx(
        "flex flex-col text-[14px] leading-[1.45] text-[var(--color-ink)]",
        m.mine ? "self-end" : "self-start",
      )}
      style={{
        background: bare ? "transparent" : m.mine ? "var(--color-chat-mine)" : "#FFFFFF",
        borderRadius: m.mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        maxWidth: bare ? "96%" : "86%",
        padding: bare ? 0 : "9px 13px",
        boxShadow: bare ? "none" : "0 1px 2px rgba(13,46,51,.1)",
        animation: "bubbleIn .34s cubic-bezier(.2,.85,.25,1) both",
      }}
    >
      {children}
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

/* ─── Rich bubbles ──────────────────────────────────────────────────── */

function Quote({ pay, get, lock }: { pay: string; get: string; lock: number }) {
  const pct = Math.max(0, Math.round((lock / LOCK_SECONDS) * 100));
  return (
    <div className="flex min-w-[225px] flex-col gap-2.5">
      <div className="ff-m flex items-center justify-between gap-3 text-[10.5px]">
        <span className="tracking-[0.1em] text-[var(--color-teal)]">
          TU COTIZACIÓN
        </span>
        <span className="tnum tracking-[0.06em] text-[var(--color-faint)]">
          TASA FIJA {fmtClock(lock)}
        </span>
      </div>
      <Row label="Pagas" value={`$ ${pay} COP`} />
      <Row label="Recibes" value={`${get} USD`} accent />
      <div className="border-t border-[rgba(13,46,51,0.12)] pt-[9px]">
        <Row label="Tasa Monokoro" value={`$ ${fmtCOP(RATE_BUY)}`} />
      </div>
      <div className="h-[3px] overflow-hidden rounded-sm bg-[rgba(13,46,51,0.1)]">
        <div
          className="h-full bg-[linear-gradient(90deg,#6ADD9B,#2C7A80)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-[13.5px]">
      <span className="text-[var(--color-muted)]">{label}</span>
      <strong
        className={cx("tnum", accent && "text-[var(--color-check)]")}
      >
        {value}
      </strong>
    </div>
  );
}

/** "Entregado", not "acreditado", and "en tu billetera", not "saldo": the
 *  dollars go to the customer's own wallet at the moment of the trade.
 *  Monokoro never holds them — see the copy rules in CLAUDE.md. */
function Receipt({ balance }: { balance: string }) {
  return (
    <div className="flex min-w-[210px] items-center gap-[11px]">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <circle cx="13" cy="13" r="12" fill="none" stroke="#6ADD9B" strokeWidth="1.5" />
        <path
          d="M7.5 13.4 L11.4 17 L18.5 9.4"
          fill="none"
          stroke="var(--color-check)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="22"
          strokeDashoffset="22"
          style={{ animation: "drawCheck .6s cubic-bezier(.2,.85,.25,1) .15s forwards" }}
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-semibold">Entregado</span>
        <span className="ff-m tnum text-[11.5px] tracking-[0.06em] text-[var(--color-teal)]">
          EN TU BILLETERA · {balance} USD
        </span>
      </div>
    </div>
  );
}

/** The closing bubble hands the reader to the card page. `Link`, not `<a>`:
 *  a raw internal href loses the `/es/` prefix and 404s. */
function CardCta() {
  return (
    <div className="flex min-w-[215px] flex-col gap-[9px]">
      <span>¿Creamos tu tarjeta para gastarlos?</span>
      <Link
        href="/tarjeta"
        className="btn bg-[var(--color-ink)] px-3.5 py-2.5 text-[13.5px] text-[var(--color-onDark)] transition-colors hover:bg-[var(--color-teal)]"
      >
        Ver la tarjeta <Arrow />
      </Link>
    </div>
  );
}
