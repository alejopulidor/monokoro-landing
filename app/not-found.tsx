import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

import { Arrow, Wordmark } from "@/components/site/brand";
import { CardFace } from "@/components/shared/card-face";
import { routing } from "@/i18n/routing";
import { waLink } from "@/lib/config";

/*
  From the `Monokoro 404` canvas.

  This renders OUTSIDE `[locale]/layout.tsx`, which constrains it in three ways
  worth knowing before editing:

  - There is no NextIntlClientProvider, so `useTranslations` would throw. The
    copy is hard-coded in Spanish, the only locale the site ships.
  - There is no locale-aware `Link` either, so every destination is a plain
    `<a>` with the locale written into the href.
  - The root layout is a passthrough (`return children`), so nothing above this
    renders a document: it emits its own <html>/<body> and loads its own fonts.
    `app/page.tsx` does the same, for the same reason.

  It builds to out/404.html, which Cloudflare Pages and most static hosts serve
  for any unmatched path.

  The design's optional auto-redirect is deliberately not implemented. Moving
  someone off a page they are still reading is hostile, and it was opt-in in the
  canvas too.
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
const L = (path: string) => `/${routing.defaultLocale}/${path}`;

const DESTINATIONS = [
  {
    n: "01",
    t: "Monokoro para ti",
    href: HOME,
    d: "Compra y guarda dólares digitales desde WhatsApp, con la tasa a la vista.",
  },
  {
    n: "02",
    t: "Monokoro Negocios",
    href: L("negocios/"),
    d: "Tarjetas en dólares para pauta, proveedores y viáticos, con tu marca o por API.",
  },
  {
    n: "03",
    t: "La tarjeta",
    href: L("tarjeta/"),
    d: "Cómo funciona la tarjeta, dónde paga y qué tasa aplica en cada compra.",
  },
  {
    n: "04",
    t: "Aprende",
    href: L("aprende/"),
    d: "Guías cortas sobre dólares digitales, pagos internacionales y ahorro.",
  },
];

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
        <div className="relative w-full overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
            <div
              className="absolute left-[-14vw] top-[-10vw] h-[52vw] w-[52vw] rounded-full blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle,rgba(106,221,155,.20),transparent 66%)",
                animation: "auroraA 32s ease-in-out infinite",
              }}
            />
            <div
              className="absolute right-[-12vw] top-[44vh] h-[46vw] w-[46vw] rounded-full blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle,rgba(51,130,137,.15),transparent 68%)",
                animation: "auroraB 41s ease-in-out infinite",
              }}
            />
          </div>

          <div className="relative z-10">
            <header className="gutter pt-8">
              <div className="shell">
                <a href={HOME} aria-label="Monokoro — inicio">
                  <Wordmark />
                </a>
              </div>
            </header>

            <main className="gutter pb-20 pt-[clamp(40px,7vw,84px)]">
              <div className="shell">
                <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,64px)]">
                  <div className="hero-in min-w-0 flex-[1_1_440px]">
                    <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-teal)]">
                      PÁGINA NO ENCONTRADA
                    </div>
                    <h1 className="mt-6 text-[clamp(38px,6.4vw,80px)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance">
                      Esta página no existe. Tu saldo sí.
                    </h1>
                    <p className="mt-6 max-w-[520px] text-[19px] leading-[1.55] text-[var(--color-muted)] text-pretty">
                      El enlace puede estar roto o la página se movió de sitio.
                      Tus dólares no dependen de esta URL: viven en tu billetera.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a id="nf-home" href={HOME} className="mk-mag btn btn-ink">
                        Volver al inicio <Arrow />
                      </a>
                      <a
                        href={waLink("Hola, llegué a un link roto en la página")}
                        className="mk-mag btn btn-outline"
                      >
                        Escribir por WhatsApp
                      </a>
                    </div>
                  </div>

                  <div
                    className="hero-in flex min-w-0 flex-[1_1_320px] justify-center"
                    style={{ animationDelay: ".14s" }}
                  >
                    <div className="w-[min(400px,86vw)]">
                      <div style={{ animation: "floatY 8s ease-in-out infinite" }}>
                        {/* The joke card. `0404` is the only made-up number on
                            the site that is allowed to be legible. */}
                        <CardFace
                          size="lg"
                          label="LINK ROTO"
                          last4="0404"
                          holder="NO ENCONTRADA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <section className="mt-[clamp(48px,8vw,96px)]">
                  <h2 className="ff-m text-[11.5px] tracking-[0.14em] text-[var(--color-teal)]">
                    A DÓNDE SÍ PUEDES IR
                  </h2>
                  <ul className="mt-5">
                    {DESTINATIONS.map((d) => (
                      <li key={d.n}>
                        <a
                          href={d.href}
                          className="mk-row flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2.5 border-t border-[var(--color-line)] py-6"
                        >
                          <span className="flex min-w-0 flex-[1_1_300px] items-baseline gap-[18px]">
                            <span className="ff-m text-[12px] text-[var(--color-teal)]">
                              {d.n}
                            </span>
                            <span className="text-[clamp(20px,2.6vw,28px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                              {d.t}
                            </span>
                          </span>
                          <span className="min-w-0 flex-[1_1_340px] text-[17px] leading-[1.5] text-[var(--color-muted)] text-pretty">
                            {d.d}
                          </span>
                          <span className="ff-m text-base text-[var(--color-teal)]" aria-hidden>
                            →
                          </span>
                        </a>
                      </li>
                    ))}
                    <li className="border-t border-[var(--color-line)]" aria-hidden />
                  </ul>
                </section>
              </div>
            </main>

            <footer className="gutter pb-10">
              <div className="ff-m shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(13,46,51,0.12)] pt-6 text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
                <span>© 2026 MONOKORO</span>
                <span>ERROR 404 · RECURSO NO ENCONTRADO</span>
              </div>
            </footer>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: LOCALE_FIXUP }} />
      </body>
    </html>
  );
}
