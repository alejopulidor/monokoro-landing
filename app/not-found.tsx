import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
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
  description:
    "El link que abriste no existe o se movió. Desde aquí puedes volver a Monokoro.",
  robots: { index: false },
};

/** The canvas sets this, and on a full-dark page it matters: without it the
 *  browser chrome on Android stays paper-white above a near-black page. */
export const viewport = { themeColor: "#07242A" };

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
      {/*
        The whole page is dark, and that is the canvas's decision rather than a
        variation on it: every other route is paper with dark panels inside,
        so inverting the ground is what makes a 404 read as a different kind of
        surface the moment it loads.

        The gradient goes on <body> as an inline style rather than as a utility
        because `@layer base body { background: var(--color-paper) }` in
        globals.css would otherwise win — an inline declaration outranks every
        cascade layer.
      */}
      <body
        className="min-h-full antialiased"
        style={{
          background: "linear-gradient(160deg,#0E3F45,#07242A 62%)",
          color: "var(--color-onDark)",
        }}
      >
        {/* `clip`, not `hidden` — see the note in app/[locale]/layout.tsx. */}
        <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
          <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute left-[-16vw] top-[-14vw] h-[56vw] w-[56vw] rounded-full blur-[96px]"
              style={{
                background:
                  "radial-gradient(circle,rgba(106,221,155,.20),transparent 66%)",
                animation: "auroraA 32s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-[-16vw] right-[-14vw] h-[48vw] w-[48vw] rounded-full blur-[104px]"
              style={{
                background:
                  "radial-gradient(circle,rgba(51,130,137,.28),transparent 68%)",
                animation: "auroraB 41s ease-in-out infinite",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-1 flex-col">
            {/* Not the site nav: no links, no CTA. The only chrome worth having
                on a 404 is "you are still on Monokoro" and "this is a 404". */}
            <nav className="gutter flex flex-wrap items-center justify-between gap-x-7 gap-y-3.5 border-b border-[rgba(239,246,240,0.12)] py-[18px]">
              <a href={HOME} aria-label="Monokoro — inicio">
                <Wordmark />
              </a>
              <div className="ff-m flex items-center gap-2.5 text-[11px] tracking-[0.14em] text-[var(--color-mint)]">
                <span
                  className="h-[7px] w-[7px] rounded-full bg-[var(--color-mint)]"
                  aria-hidden
                />
                ERROR 404
              </div>
            </nav>

            <main className="gutter flex flex-1 items-center py-[clamp(44px,7vw,88px)]">
              <div className="shell flex w-full flex-wrap items-center gap-[clamp(32px,5vw,72px)]">
                <div className="hero-in flex min-w-0 flex-[1_1_440px] flex-col gap-[26px]">
                  <div className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
                    PÁGINA NO ENCONTRADA
                  </div>
                  <h1 className="text-[clamp(38px,6.6vw,86px)] font-semibold leading-[0.94] tracking-[-0.045em] text-balance">
                    Esta página no existe. Tu saldo sí.
                  </h1>
                  {/* "siguen donde los dejaste" — never "en tu cuenta". The
                      dollars live in the customer's own billetera; see the three
                      claims in CLAUDE.md. */}
                  <p className="max-w-[520px] text-[19px] leading-[1.55] text-[rgba(239,246,240,0.78)] text-pretty">
                    El link que abriste se movió o quedó escrito distinto. Nada
                    le pasó a tus dólares ni a tus tarjetas: siguen donde los
                    dejaste, en tu billetera y en el chat.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a id="nf-home" href={HOME} className="mk-mag btn btn-mint">
                      Volver al inicio <Arrow />
                    </a>
                    <a
                      href={waLink("Hola, llegué a un link roto en la página")}
                      className="mk-mag btn btn-ghost-dark"
                    >
                      Escribir por WhatsApp
                    </a>
                  </div>
                </div>

                <div className="hero-in flex min-w-0 flex-[1_1_340px] items-center justify-center">
                  {/*
                    The **card** is in normal flow and the numeral is absolute
                    behind it, not the other way round.

                    The canvas has it the other way, and at 390px that breaks:
                    the numeral clamps to 150px tall while the card is ~207px,
                    so an absolutely positioned card overflowed its own box
                    upward and landed on top of the WhatsApp button. Letting the
                    card define the height makes the layout correct at every
                    width, and the numeral is decoration either way.
                  */}
                  <div className="relative w-[min(430px,88vw)]">
                    {/* Decorative and aria-hidden: the page already says
                        "Página no encontrada" in real text, and a screen reader
                        announcing "404" a third time adds nothing. */}
                    <div
                      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="text-[clamp(150px,22vw,268px)] font-semibold leading-[0.8] tracking-[-0.06em] text-[rgba(239,246,240,0.07)]">
                        404
                      </span>
                    </div>
                    {/* The float is a translate on this wrapper and the tilt is
                        a `rotate:` on the card. Tailwind v4 compiles
                        `rotate-[-6deg]` to the standalone property, so the two
                        compose instead of overwriting each other — which is why
                        this reuses the shared `floatY` keyframe rather than
                        needing one with the rotation baked in. */}
                    <div
                      className="relative z-10 px-[8%]"
                      style={{ animation: "floatY 7s ease-in-out infinite" }}
                    >
                      <CardFace
                        compact
                        label="LINK ROTO"
                        last4="0404"
                        className="rotate-[-6deg]"
                      />
                      <div className="ff-m mt-5 text-center text-[9.5px] tracking-[0.12em] text-[rgba(239,246,240,0.5)]">
                        NO ENCONTRADA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <section className="gutter pb-[clamp(48px,7vw,88px)]">
              <div className="shell">
                <h2 className="ff-m text-[12px] tracking-[0.14em] text-[var(--color-mint)]">
                  A DÓNDE SÍ PUEDES IR
                </h2>
                <ul className="mt-[clamp(20px,3vw,32px)]">
                  {DESTINATIONS.map((d) => (
                    <li key={d.n}>
                      <a
                        href={d.href}
                        className="mk-row flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2.5 border-t border-[rgba(239,246,240,0.16)] py-6 hover:bg-[rgba(239,246,240,0.05)]"
                      >
                        <span className="flex min-w-0 flex-[1_1_280px] items-baseline gap-[18px]">
                          <span className="ff-m text-[12px] text-[var(--color-mint)]">
                            {d.n}
                          </span>
                          <span className="text-[clamp(20px,2.6vw,28px)] font-semibold leading-[1.18] tracking-[-0.03em]">
                            {d.t}
                          </span>
                        </span>
                        <span className="min-w-0 flex-[1_1_320px] text-[17px] leading-[1.5] text-[rgba(239,246,240,0.72)] text-pretty">
                          {d.d}
                        </span>
                      </a>
                    </li>
                  ))}
                  <li
                    className="border-t border-[rgba(239,246,240,0.16)]"
                    aria-hidden
                  />
                </ul>
              </div>
            </section>

            <footer className="gutter pb-9">
              <div className="ff-m shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(239,246,240,0.12)] pt-6 text-[11px] tracking-[0.1em] text-[rgba(239,246,240,0.5)]">
                <span>© 2026 MONOKORO</span>
                <span>ERROR 404 · RECURSO NO ENCONTRADO</span>
              </div>
            </footer>
          </div>
        </div>

        {/* This page renders outside `[locale]/layout.tsx`, so it has to mount
            the motion provider itself. Without it the two `.mk-mag` buttons and
            the card here were dead hooks — markup asking for effects that
            nothing was driving. */}
        <MotionProvider />

        <script dangerouslySetInnerHTML={{ __html: LOCALE_FIXUP }} />
      </body>
    </html>
  );
}
