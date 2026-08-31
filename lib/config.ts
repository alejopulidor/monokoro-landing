/**
 * Single source of truth for URLs, contact details and the reference rates.
 *
 * Components import from here — never hard-code one of these in JSX. The same
 * rate shows up in the ticker, the hero specs, the quoter, the tier cards, the
 * FAQ and the blog CTA, and they have to agree.
 *
 * Anything marked TODO is a placeholder the business has to confirm before
 * launch. See "Pending placeholders" in CLAUDE.md.
 */

// ─── Site ─────────────────────────────────────────────────────────────────
export const SITE_URL = "https://monokoro.co";

// ─── WhatsApp ─────────────────────────────────────────────────────────────
/**
 * TODO(business): the real WhatsApp Business number. This is the placeholder
 * that shipped with the design — **every CTA on the site points at it**, so it
 * is the single most important value to replace before going live.
 * Digits only, with country code, no `+`.
 */
export const WHATSAPP_NUMBER = "573001234567";

/** Builds a wa.me deep link with the message prefilled. Every CTA on the site
 *  goes through this, so the copy that opens the chat is always intentional
 *  and the agent knows which page the person came from. */
export const waLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// ─── Reference rates ──────────────────────────────────────────────────────
/**
 * TODO(business): these are the design's placeholder rates. They are shown as
 * **referential** everywhere and the real rate is confirmed in the chat — the
 * "TASA DE REFERENCIA · SE CONFIRMA EN EL CHAT" line next to the quoter CTA is
 * load-bearing, not decoration. Do not present them as live without wiring a
 * real source.
 *
 * The card rate is higher than the buy rate on purpose: it carries the
 * international processing cost. That difference is explained on the page and
 * in the FAQ, so keep `RATE_CARD > RATE_BUY`.
 */
export const RATE_BUY = 4150; // COP per USD, buying dollars
export const RATE_SELL = 4020; // COP per USD, selling dollars back
export const RATE_CARD = 4280; // COP per USD, topping up the card
export const MIN_AMOUNT_COP = 50_000;

// ─── Contact ──────────────────────────────────────────────────────────────
export const CONTACT_EMAIL = "hola@monokoro.co";
export const LEGAL_EMAIL = "legal@monokoro.co";
export const PRIVACY_EMAIL = "privacidad@monokoro.co";

/**
 * Feeds `sameAs` in the Organization schema. Deliberately empty until the
 * profiles exist: an invented or empty `sameAs` is a broken identity claim,
 * which is worse for the entity graph than omitting the field.
 */
export const SOCIAL_URLS: string[] = [];

// ─── Analytics ────────────────────────────────────────────────────────────
/**
 * Leave both empty and **nothing is injected** — no script, no cookie, no
 * network request. That is the state today.
 *
 * Use one or the other, not both: GTM can host the GA4 tag itself, and loading
 * GA4 twice double-counts every pageview.
 *
 * - `GTM_ID`  — a Google Tag Manager container, `GTM-XXXXXXX`. This is what
 *   the Tenko site uses, and the better default: tags are added in the GTM UI
 *   without a deploy.
 * - `GA4_ID`  — a GA4 measurement id, `G-XXXXXXXXXX`, loaded directly via
 *   gtag.js. Simpler if GTM is more machinery than this site needs.
 *
 * TODO(business): see "Analytics" in CLAUDE.md for how to create either one.
 */
export const GTM_ID = "";
export const GA4_ID = "";

// ─── Dates ────────────────────────────────────────────────────────────────
export const LEGAL_LAST_UPDATED_ISO = "2026-08-30";

/**
 * Hand-pinned `lastmod` for app/sitemap.ts. Deliberately not `new Date()`: a
 * lastmod that moves on every deploy teaches Google to ignore the signal.
 * Bump it when the copy actually changes.
 */
export const CONTENT_UPDATED = "2026-08-30";
