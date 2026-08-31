"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import {
  CONSENT_REOPEN_ATTR,
  applyConsent,
  getShouldAsk,
  getShouldAskServer,
  subscribeConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

/**
 * The cookie notice.
 *
 * It exists because two things on this site contradicted each other in
 * production: GA4 was live and setting cookies on arrival, while the privacy
 * policy told the reader **"puedes rechazarlas sin perder acceso al
 * contenido"**. One of the two had to change, and the policy is the promise.
 *
 * ## Two real choices, and no third one
 *
 * "Aceptar" and "Solo las necesarias" are the same size, the same weight and
 * the same distance from the reader's thumb. There is no pre-ticked box, no
 * "gestionar preferencias" maze, and **no close button that means yes**. That
 * is not decoration: a banner where refusing is harder than accepting does not
 * collect consent, it collects clicks, and the policy above would still be
 * false. Refusing is one tap, same as accepting.
 *
 * There is deliberately no third "personalizar" option either — there is
 * exactly one non-essential tag on this site, so a preferences panel would be a
 * single switch dressed up as a menu.
 *
 * ## What it does not do
 *
 * It does not block the page. It is not modal, it traps no focus and it dims
 * nothing: a visitor who ignores it can read and use the whole site, which is
 * again what the policy promises. Measurement simply stays off until they
 * answer, which Consent Mode handles — see `components/site/analytics.tsx` for
 * why the defaults must be emitted before the tag.
 *
 * ## Layout
 *
 * On phones it sits **above** `MobileCta`, not over it. That bar is the
 * conversion on `/tarjeta` and `/negocios`, and covering it with a cookie
 * notice would trade the thing the page is for against a legal checkbox.
 *
 * The "have they answered?" flag comes from `useSyncExternalStore`, not from
 * state seeded in an effect. The answer lives in `localStorage`, which the
 * server cannot read, so the static HTML must contain no notice — and the
 * server snapshot is what guarantees that through hydration too. See
 * `lib/consent.ts`.
 */
export function CookieConsent() {
  const shouldAsk = useSyncExternalStore(
    subscribeConsent,
    getShouldAsk,
    getShouldAskServer,
  );
  // Separate from the store: this is "they asked to see it again", which is a
  // UI state, not a stored decision. Set from a click handler, never in an
  // effect body.
  const [reopened, setReopened] = useState(false);

  // Delegated, so the footer's button stays server-rendered and handler-free.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        `[${CONSENT_REOPEN_ATTR}]`,
      );
      if (el) setReopened(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const answer = useCallback((v: Consent) => {
    writeConsent(v);
    applyConsent(v);
    setReopened(false);
  }, []);

  if (!shouldAsk && !reopened) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-20 z-[95] mx-auto max-w-[720px] rounded-[20px] border border-[var(--color-line)] bg-[var(--color-paper)] p-[clamp(18px,2.6vw,24px)] shadow-[0_28px_60px_-30px_rgba(13,46,51,.55)] min-[760px]:bottom-4"
      style={{ animation: "consentIn .32s cubic-bezier(.2,.8,.2,1) both" }}
    >
      <p className="text-[15px] leading-[1.5] text-[var(--color-muted)] text-pretty">
        Usamos cookies para medir cómo se usa el sitio. Puedes rechazarlas y
        seguir navegando igual.{" "}
        <Link
          href="/privacy"
          className="border-b border-[rgba(44,122,128,0.35)] pb-px font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
        >
          Cómo tratamos tus datos
        </Link>
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => answer("granted")}
          className="btn btn-ink btn-sm flex-1 min-[420px]:flex-none"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => answer("denied")}
          className="btn btn-outline btn-sm flex-1 min-[420px]:flex-none"
        >
          Solo las necesarias
        </button>
      </div>
    </div>
  );
}
