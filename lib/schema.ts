// Schema.org builders. Pure functions returning plain objects — pages compose
// them and <JsonLd> does the serializing, so the escaping rule lives in one
// place instead of being copy-pasted next to every <script> tag.
//
// Crawlers merge every ld+json block on a page into a single graph, so a block
// can reference an entity declared in another block by @id. That is what makes
// ORG_ID work: Monokoro is described once, in the locale layout, and
// everything else points at it instead of declaring a second, competing
// organization.

import { CONTACT_EMAIL, SITE_URL, SOCIAL_URLS } from "@/lib/config";
import { routing, type Locale } from "@/i18n/routing";
import type { Post } from "@/content/posts";

export const BRAND = "Monokoro";

/** Makes a site-relative path absolute. JSON-LD is not resolved against
 *  `metadataBase` the way the OG tags are, so every URL has to be spelled out. */
export const abs = (path: string): string =>
  path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The one company entity.
 *
 * Two deliberate omissions, both for the same reason — a fabricated identity
 * claim is worse than a missing field:
 *   - no `telephone` / `address`: the WhatsApp number in lib/config.ts is
 *     still the design's placeholder and there is no registered address yet.
 *   - no `sameAs` unless `SOCIAL_URLS` is non-empty.
 *
 * `FinancialService` is *not* claimed, and neither is custody. Monokoro buys
 * and sells digital dollars and delivers them to the customer's own wallet;
 * it does not hold client funds. Asserting a regulated service type — custody,
 * deposit-taking — without the licence is a compliance problem, not an SEO
 * trick, and in Colombia the specific risk is *captación*. Revisit only when
 * the licensing position actually changes.
 */
export function organizationSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND,
    description,
    // Trailing slash to match the canonical — the site is trailingSlash: true.
    url: `${SITE_URL}/${locale}/`,
    logo: abs("/logo/monokoro-mark.svg"),
    email: CONTACT_EMAIL,
    areaServed: { "@type": "Country", name: "Colombia" },
    knowsLanguage: [...routing.locales],
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
  };
}

/** Feeds the site name search engines show in place of the bare domain. */
export function webSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BRAND,
    url: `${SITE_URL}/${locale}/`,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** The product, described once on the home page. */
export function serviceSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "Compra y venta de dólares digitales",
    description:
      "Compra y venta de dólares digitales con atención por WhatsApp y entrega inmediata a la billetera del cliente. Monokoro no custodia fondos de terceros; a quien no tiene billetera, le ayuda a crear una con custodia compartida.",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Colombia" },
    url: `${SITE_URL}/${locale}/`,
  };
}

/**
 * Note: since August 2023 Google only shows FAQ rich results for government
 * and health-authority sites, so this will not produce an accordion in the
 * SERP. It is emitted for entity understanding and for AI answer surfaces —
 * and it costs nothing, because the Q&A is already on the page.
 *
 * The answers must match the visible text exactly, which is why callers pass
 * the same array the accordion renders (`content/faq.ts`).
 */
export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export type Crumb = { label: string; href?: string };

/** The last crumb is the current page: per spec it carries no `item`. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: abs(crumb.href) } : {}),
    })),
  };
}

/**
 * One article. `datePublished` comes from the post's own `published` field —
 * never `new Date()`, which would re-stamp every article on every deploy and
 * teach crawlers the dates mean nothing.
 *
 * `dateModified` mirrors it until posts carry a real revision date.
 */
export function articleSchema(post: Post, locale: Locale) {
  const url = `${SITE_URL}/${locale}/aprende/${post.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    datePublished: post.published,
    dateModified: post.published,
    articleSection: post.tag,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** The blog index. `hasPart` lets a crawler discover every article from the
 *  one page, without depending on it walking each card link. */
export function collectionSchema(posts: Post[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/${locale}/aprende/#collection`,
    name: `Aprende — ${BRAND}`,
    description:
      "Guías sobre dólares digitales, ahorro en dólares y pagos internacionales desde Colombia.",
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE_URL}/${locale}/aprende/${p.slug}/`,
      datePublished: p.published,
    })),
  };
}
