/**
 * The site map, in one place.
 *
 * The design canvas links to five destinations — Cotizador, Cómo funciona,
 * Tarjeta, Negocios and Aprende — but only three of them exist as pages so
 * far. Rather than shipping links to 404s, every destination carries a
 * `ready` flag and the chrome renders only the ready ones.
 *
 * **To turn a page on:** build the route, then flip `ready` to `true` here.
 * The nav, the mobile menu and the footer pick it up in the same commit —
 * that is the whole point of keeping this list out of the components.
 */

export type NavItem = {
  /** Visible label. Spanish only for now — see i18n/routing.ts. */
  label: string;
  /** Locale-relative path, or a `#anchor` on the home page. */
  href: string;
  ready: boolean;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Cotizador", href: "/#cotiza", ready: true },
  { label: "Cómo funciona", href: "/#pasos", ready: true },
  { label: "Tarjeta", href: "/tarjeta", ready: false },
  { label: "Negocios", href: "/negocios", ready: false },
  { label: "Aprende", href: "/aprende", ready: true },
];

/** The mobile sheet shows one more entry than the desktop bar. */
export const MOBILE_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  { label: "Preguntas", href: "/#faq", ready: true },
];

export const FOOTER_PRODUCT: NavItem[] = [
  { label: "Cotizador", href: "/#cotiza", ready: true },
  { label: "Cómo funciona", href: "/#pasos", ready: true },
  { label: "Tarjeta", href: "/tarjeta", ready: false },
  { label: "Para negocios", href: "/negocios", ready: false },
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
