import { defineRouting } from "next-intl/routing";

/**
 * Locales.
 *
 * The site ships **Spanish only** for now: the product is Colombia-first and
 * the design canvas is written in es-CO. The next-intl wiring is kept in place
 * anyway, because retrofitting i18n after the fact means touching every route.
 *
 * Adding a locale is a two-step change:
 *   1. add the code to `locales` below,
 *   2. drop a `messages/<code>.json` next to `messages/es.json`.
 *
 * Everything else — the sitemap's hreflang, the canonical tags, the 404's
 * back-home fixup, the language switcher (which hides itself while there is
 * only one locale) — reads this list.
 */
export const routing = defineRouting({
  locales: ["es"],
  defaultLocale: "es",
  // `always` keeps every URL locale-prefixed, which is what lets the static
  // export work without middleware: there is no request to inspect at runtime.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
