import { GA4_ID, GTM_ID } from "@/lib/config";

/**
 * Google Tag Manager / GA4.
 *
 * Both ids live in `lib/config.ts` and are empty by default, so **this file
 * renders nothing until someone sets one**. No script, no cookie, no request.
 *
 * The tags are plain inline `<script>` elements on purpose. `next/script` with
 * `afterInteractive` only injects after hydration — on a statically exported
 * site that means the tag never reaches the prerendered HTML and misses every
 * visitor who leaves before React boots. Inline runs while the HTML is parsed,
 * which is what Google's own "as high in the page as possible" asks for.
 *
 * **Consent:** there is no consent banner on this site yet, and the privacy
 * policy tells the reader they can reject cookies. Reconcile those two before
 * launching in the EU or anywhere with an equivalent rule — either add a
 * banner (and switch these to Consent Mode v2 defaults) or amend the policy.
 * See "Pending placeholders" in CLAUDE.md.
 */

// GTM's own snippet, verbatim except for the interpolated container id.
const gtmSnippet = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;

const ga4Snippet = (id: string) => `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${id}');`;

/** Goes in `<head>`-ish position — first thing inside `<body>` is fine and is
 *  what Next lets us do without a custom document. */
export function Analytics() {
  if (GTM_ID) {
    return <script dangerouslySetInnerHTML={{ __html: gtmSnippet(GTM_ID) }} />;
  }
  if (GA4_ID) {
    return (
      <>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        />
        <script dangerouslySetInnerHTML={{ __html: ga4Snippet(GA4_ID) }} />
      </>
    );
  }
  return null;
}

/** GTM's no-JS fallback. Must be the first thing in `<body>`. GA4 has no
 *  equivalent — gtag.js needs JS, so there is nothing to render for it. */
export function AnalyticsNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
