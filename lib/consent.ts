/**
 * Cookie consent — the one source of truth for the stored decision.
 *
 * Three consumers have to agree on the key and the two values, and one of them
 * is a **string** that runs before React exists (the inline snippet in
 * `components/site/analytics.tsx`), so it cannot import anything. That snippet
 * interpolates `CONSENT_KEY` from here rather than repeating the literal —
 * which is the whole reason this file exists for four constants.
 *
 * **Stored in `localStorage`, not a cookie**, on purpose: setting a cookie to
 * record that someone refused cookies is a bad look, and this preference never
 * needs to reach a server. It is also the one bit of storage that is strictly
 * necessary — without it the banner cannot honour the answer it was given.
 *
 * Every read is wrapped: `localStorage` *throws* on access in some contexts
 * (Safari private mode historically, and any browser set to block site data),
 * so an unguarded read takes the page down rather than degrading.
 */

export const CONSENT_KEY = "mk-consent";

export type Consent = "granted" | "denied";

/** Reads the stored decision. `null` means "never asked". */
export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * The banner reads this through `useSyncExternalStore`, not through a
 * `useState` seeded in an effect.
 *
 * The reason is hydration. The answer lives in `localStorage`, which the server
 * cannot see, so the static HTML must contain no banner — but a `useState`
 * initialiser that peeks at `localStorage` renders one on the very first client
 * pass and mismatches that HTML. `useSyncExternalStore` is built for exactly
 * this: `getServerSnapshot` answers for the server *and* for the hydration
 * pass, then React re-reads on the client and the banner appears if it should.
 * (It is also what the `react-hooks/set-state-in-effect` lint rule is pushing
 * you towards.)
 */
let listeners: Array<() => void> = [];
let cached: boolean | null = null;

/** True when nobody has answered yet — the only reason to show the notice. */
export function getShouldAsk(): boolean {
  if (cached === null) cached = readConsent() === null;
  return cached;
}

/** Never ask during SSR or hydration: the server does not know the answer, and
 *  guessing "ask" flashes the notice at everyone who already answered. */
export function getShouldAskServer(): boolean {
  return false;
}

export function subscribeConsent(cb: () => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function writeConsent(v: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // Storage blocked. The choice holds for this page view — `applyConsent`
    // still runs — and the notice will ask again next time. Asking twice is the
    // right failure; the alternative is measuring someone who said no.
  }
  cached = false;
  for (const l of listeners) l();
}

/**
 * Tells Google about a decision, in Consent Mode v2 terms.
 *
 * Only `analytics_storage` moves. The four ad signals stay denied because this
 * site runs no ad tag at all; granting them would be claiming a permission
 * nothing uses. `functionality_storage` and `security_storage` are granted in
 * the defaults and never change — they cover the consent choice itself.
 */
export function applyConsent(v: Consent): void {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  w.gtag?.("consent", "update", { analytics_storage: v });
  // GTM containers listen for this instead; harmless when only gtag.js is live.
  w.dataLayer?.push({ event: v === "granted" ? "consent_granted" : "consent_denied" });
}

/**
 * Marks the control that reopens the banner.
 *
 * The banner listens for clicks on `[data-consent-reopen]` by delegation
 * instead of exposing a callback, which is what lets the footer stay a **Server
 * Component**: it renders a plain `<button>` with this attribute and no handler
 * of its own. Someone has to be able to change their mind — the privacy policy
 * says the choice is theirs, and a decision with no way back is not a choice.
 */
export const CONSENT_REOPEN_ATTR = "data-consent-reopen";
