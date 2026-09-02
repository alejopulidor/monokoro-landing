/**
 * The site map, in one place.
 *
 * Every destination carries a `ready` flag and the chrome renders only the
 * ready ones, so a page can be linked from everywhere the moment it exists and
 * from nowhere before that. **To turn a page on:** build the route, flip
 * `ready`. The nav, the mobile sheet, the footer and any in-page CTA that uses
 * `isReady` pick it up in the same commit.
 */

export type NavItem = {
  /** Visible label. Spanish only for now — see i18n/routing.ts. */
  label: string;
  /** Locale-relative path, or `/#anchor` on the home page. */
  href: string;
  ready: boolean;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Cotizador", href: "/#cotiza", ready: true },
  { label: "Cómo funciona", href: "/#pasos", ready: true },
  { label: "Tarjeta", href: "/tarjeta", ready: true },
  { label: "Negocios", href: "/negocios", ready: true },
  { label: "Aprende", href: "/aprende", ready: true },
];

/** The mobile sheet shows one more entry than the desktop bar. */
export const MOBILE_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  { label: "Preguntas", href: "/#faq", ready: true },
];

/**
 * The card page's own bar: its in-page anchors first, then the way back out to
 * the rest of the site. A product page's nav is a table of contents, not the
 * site map — the site map is in the footer.
 */
export const CARD_NAV: NavItem[] = [
  { label: "Qué es", href: "#que-es", ready: true },
  { label: "Cómo funciona", href: "#como", ready: true },
  { label: "Para qué sirve", href: "#usos", ready: true },
  { label: "Compara", href: "#compara", ready: true },
  { label: "Recarga", href: "#recarga", ready: true },
];

export const CARD_MOBILE_NAV: NavItem[] = [
  ...CARD_NAV,
  { label: "Empezar", href: "#empezar", ready: true },
  { label: "Preguntas", href: "#faq", ready: true },
  { label: "Comprar dólares", href: "/", ready: true },
  { label: "Negocios", href: "/negocios", ready: true },
  { label: "Aprende", href: "/aprende", ready: true },
];

export const BUSINESS_NAV: NavItem[] = [
  { label: "Cómo funciona", href: "#como", ready: true },
  { label: "Casos", href: "#casos", ready: true },
  { label: "Tasas", href: "#tasas", ready: true },
  { label: "Tu marca", href: "#marca", ready: true },
  { label: "API", href: "#api", ready: true },
];

export const BUSINESS_MOBILE_NAV: NavItem[] = [
  { label: "El problema", href: "#problema", ready: true },
  { label: "Qué es", href: "#que-es", ready: true },
  ...BUSINESS_NAV,
  // Mobile-only, deliberately: `components/site/nav.tsx` documents that the
  // five desktop links already wrap below 900px and push the CTA off the bar.
  { label: "Bolsillos", href: "#bolsillos", ready: true },
  { label: "Dashboard", href: "#dashboard", ready: true },
  { label: "Compara", href: "#compara", ready: true },
  { label: "Empezar", href: "#empezar", ready: true },
  { label: "Preguntas", href: "#faq", ready: true },
  { label: "Para ti", href: "/", ready: true },
  { label: "Tarjeta", href: "/tarjeta", ready: true },
  { label: "Aprende", href: "/aprende", ready: true },
];

export const FOOTER_PRODUCT: NavItem[] = [
  { label: "Cotizador", href: "/#cotiza", ready: true },
  { label: "Cómo funciona", href: "/#pasos", ready: true },
  { label: "Tarjeta", href: "/tarjeta", ready: true },
  { label: "Para negocios", href: "/negocios", ready: true },
];

export const FOOTER_LEGAL: NavItem[] = [
  { label: "Términos", href: "/terms", ready: true },
  { label: "Privacidad", href: "/privacy", ready: true },
];

export const ready = (items: NavItem[]): NavItem[] =>
  items.filter((i) => i.ready);

/** True when a destination is live, so a section can swap its CTA for the
 *  WhatsApp fallback instead of linking into nothing. */
export const isReady = (href: string): boolean =>
  [...PRIMARY_NAV, ...FOOTER_PRODUCT].some((i) => i.href === href && i.ready);
