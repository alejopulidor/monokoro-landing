import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";

/**
 * The bare "/" redirect shim.
 *
 * Static export cannot run a server redirect, and there is no middleware (by
 * design — see i18n/routing.ts), so the hop to the default locale has to
 * happen in the document itself.
 *
 * `robots: { index: false }` because this page has no content of its own; the
 * canonical points at the locale home so any link equity lands there.
 */

const target = `/${routing.defaultLocale}/`;

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}${target}` },
  robots: { index: false },
};

export default function Index() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        {/*
          Runs while the head is parsed, so it wins over the meta refresh below
          and can carry the query string + hash across the hop. Without that,
          every ad click on the bare domain would reach /es/ stripped of its
          utm_* / gclid and land in analytics as direct traffic. The meta
          refresh stays as the no-JS path (nothing to attribute there anyway).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(
              target,
            )}+window.location.search+window.location.hash);`,
          }}
        />
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <link rel="canonical" href={`${SITE_URL}${target}`} />
        <title>Monokoro</title>
      </head>
      <body>
        <noscript>
          <a href={target}>Monokoro</a>
        </noscript>
      </body>
    </html>
  );
}
