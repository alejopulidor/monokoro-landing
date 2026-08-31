import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

import { Arrow, Wordmark } from "@/components/site/brand";
import { routing } from "@/i18n/routing";
import { waLink } from "@/lib/config";

/*
  This renders OUTSIDE `[locale]/layout.tsx`, so there is no
  NextIntlClientProvider here — `useTranslations` would throw. The copy is
  therefore hard-coded in Spanish, which is the only locale the site ships.

  It also has to emit its own <html>/<body> and load its own fonts: the root
  layout is a passthrough (`return children`), so nothing above this renders a
  document. Same reason `app/page.tsx` does it.

  It builds to out/404.html, which Cloudflare Pages and most static hosts serve
  for any unmatched path.
*/

const sans = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Página no encontrada · Monokoro",
  robots: { index: false },
};

const HOME = `/${routing.defaultLocale}/`;

/**
 * A 404 under `/en/algo` should send you home in *its* locale, not to /es/.
 * The regex is anchored on `(/|$)` so `/english/x` is not mistaken for `en`.
 * With one locale this is a no-op; it is kept so adding a locale does not
 * silently leave a wrong link here.
 */
const LOCALE_FIXUP = `(function () {
  var m = new RegExp("^/(${routing.locales.join("|")})(/|$)").exec(location.pathname);
  if (!m) return;
  var a = document.getElementById("nf-home");
  if (a) a.setAttribute("href", "/" + m[1] + "/");
})();`;

export default function NotFound() {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
          <div
            className="absolute left-1/2 top-[38%] aspect-square w-[820px] max-w-[170vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle,rgba(106,221,155,.30),transparent 64%)",
              animation: "auroraA 32s ease-in-out infinite",
            }}
            aria-hidden
          />

          <div className="relative">
            <a href={HOME} className="opacity-90 transition hover:opacity-100">
              <Wordmark size={32} wordSize={21} />
            </a>

            {/* Decorative: the <h1> below carries the meaning for assistive
                tech, so the numeral itself is hidden from it. */}
            <p
              className="ff-m tnum mt-12 select-none text-[clamp(5rem,19vw,10.5rem)] font-medium leading-[0.85] tracking-tighter text-[var(--color-teal)] opacity-25"
              aria-hidden
            >
              404
            </p>

            <h1 className="mt-7 text-[clamp(32px,6vw,56px)] font-semibold leading-[1.02] tracking-[-0.042em] text-[var(--color-ink)] text-balance">
              Esta página no existe
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[18px] leading-[1.55] text-[var(--color-muted)] text-pretty">
              El enlace puede estar roto, o la página se movió de sitio. El chat
              sigue abierto de todas formas.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a id="nf-home" href={HOME} className="btn btn-ink">
                Volver al inicio <Arrow />
              </a>
              <a
                href={waLink("Hola, llegué a una página que no existe")}
                className="btn btn-outline"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </main>

        <script dangerouslySetInnerHTML={{ __html: LOCALE_FIXUP }} />
      </body>
    </html>
  );
}
