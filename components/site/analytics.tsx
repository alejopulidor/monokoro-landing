import { GA4_ID, GTM_ID } from "@/lib/config";
import { CONSENT_KEY } from "@/lib/consent";

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
 * **Consent Mode v2, denied by default.** The privacy policy says "puedes
 * rechazarlas sin perder acceso al contenido", so nothing may write an
 * analytics cookie before the visitor answers `components/site/cookie-consent.tsx`.
 *
 * Order is the whole trick and it is easy to get wrong: the `consent default`
 * call has to run **before** the tag loads, or the tag reads its own defaults
 * (granted) and has already set a cookie by the time the update arrives. So the
 * defaults are a separate, *synchronous, non-async* script emitted first, and
 * `gtag/js` stays `async` behind it.
 *
 * The same snippet then reads `localStorage` and grants immediately if this
 * visitor already said yes — otherwise a returning consenting visitor would
 * spend `wait_for_update` milliseconds cookieless on every page view.
 */

// GTM's own snippet, verbatim except for the interpolated container id.
const gtmSnippet = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;

/**
 * Runs before any tag. Denies everything that stores, then re-grants only what
 * this visitor already agreed to.
 *
 * `wait_for_update` holds the tag's first hit for 500ms so a returning visitor
 * whose answer arrives a tick later is still measured correctly. The read is in
 * a try/catch because `localStorage` throws outright when a browser is set to
 * block site data, and an uncaught throw here would kill the page before the
 * content script runs.
 */
const consentSnippet = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied',
'analytics_storage':'denied','functionality_storage':'granted',
'security_storage':'granted','wait_for_update':500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){
gtag('consent','update',{'analytics_storage':'granted'});}}catch(e){}`;

const ga4Snippet = (id: string) => `gtag('js',new Date());
gtag('config','${id}');`;

/** Goes in `<head>`-ish position — first thing inside `<body>` is fine and is
 *  what Next lets us do without a custom document. */
export function Analytics() {
  if (!GTM_ID && !GA4_ID) return null;
  return (
    <>
      {/* Always first, and never `async`: the defaults must be in the
          dataLayer before the tag below can read them. */}
      <script dangerouslySetInnerHTML={{ __html: consentSnippet }} />
      {GTM_ID ? (
        <script dangerouslySetInnerHTML={{ __html: gtmSnippet(GTM_ID) }} />
      ) : (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          />
          <script dangerouslySetInnerHTML={{ __html: ga4Snippet(GA4_ID) }} />
        </>
      )}
    </>
  );
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
