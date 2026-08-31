import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, type Locale } from "@/i18n/routing";
import { MIN_AMOUNT_COP, SITE_URL } from "@/lib/config";
import { fmtCOP } from "@/lib/format";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { ogImage } from "@/lib/og";
import { CARD_FAQ_ITEMS } from "@/content/faq";
import {
  CARD_COMPARE,
  CARD_CONTROLS,
  CARD_HERO_SPECS,
  CARD_LEARN_BLURBS,
  CARD_LEARN_SLUGS,
  CARD_PROBLEMS,
  CARD_USES,
  CARD_WA,
} from "@/content/card";
import { CARD_MOBILE_NAV, CARD_NAV } from "@/lib/nav";

import { JsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { ProductHero } from "@/components/shared/product-hero";
import { RuledList } from "@/components/shared/ruled-list";
import { CardGrid } from "@/components/shared/card-grid";
import { CompareTable } from "@/components/shared/compare-table";
import { SectionHead } from "@/components/shared/section-head";
import { Learn } from "@/components/shared/learn";
import { Faq } from "@/components/shared/faq";
import { Closing } from "@/components/shared/closing";
import { CardHeroVisual } from "@/components/card/hero-visual";
import { CardWhatIs } from "@/components/card/what-is";
import { CardHow } from "@/components/card/how";
import { CardTiers } from "@/components/card/tiers";
import { CardStart, CardTopUp } from "@/components/card/start";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLE = "Tarjeta Monokoro — Paga en dólares desde WhatsApp";
const DESCRIPTION =
  "Una tarjeta respaldada en dólares digitales. Se crea en minutos desde el chat, paga en dólares lo que se cobra en dólares y en pesos lo del día a día, con una sola tasa que ves antes de confirmar.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  return {
    title: `${TITLE} | Monokoro`,
    description: DESCRIPTION,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tarjeta/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/tarjeta/`]),
      ),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Monokoro",
      locale: "es_CO",
      type: "website",
      url: `${SITE_URL}/${locale}/tarjeta/`,
      images: ogImage("tarjeta", "Tarjeta Monokoro, respaldada en dólares"),
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ogImage("tarjeta", "Tarjeta Monokoro, respaldada en dólares"),
    },
  };
}

/**
 * `/tarjeta`.
 *
 * The order is an argument, same as the home page: what it costs you today
 * (problema) → what it is (qué es) → how you get it (cómo) → what you can do
 * with it (control, usos) → why it beats the alternative (compara) → where it
 * goes next (individual vs empresarial) → the rate (recarga) → the ask
 * (empezar, faq, cierre).
 */
export default async function CardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const typed: Locale = locale;

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            slug: "tarjeta",
            name: "Tarjeta Monokoro",
            description: DESCRIPTION,
            locale: typed,
          }),
          faqSchema(CARD_FAQ_ITEMS),
          breadcrumbSchema([
            { label: "Inicio", href: `/${typed}/` },
            { label: "Tarjeta" },
          ]),
        ]}
      />

      <Nav
        subtitle="Tarjeta"
        activeHref="/tarjeta"
        links={CARD_NAV}
        mobileLinks={CARD_MOBILE_NAV}
        cta={{ label: "Crear mi tarjeta", message: CARD_WA }}
      />

      <main className="pb-24 min-[760px]:pb-0">
        <ProductHero
          eyebrow="TARJETA MONOKORO · RESPALDADA EN DÓLARES DIGITALES"
          title={
            <>
              Ahorras en dólares.
              <br />
              Pagas donde sea.
            </>
          }
          lede="Tu saldo son dólares digitales tokenizados; la tarjeta los gasta donde sea. Paga en dólares lo que se cobra en dólares y en pesos lo del día a día en Colombia, siempre con una sola tasa competitiva que ves antes de confirmar."
          ctaLabel="Crear mi tarjeta por WhatsApp"
          waMessage={CARD_WA}
          secondaryLabel="Cómo funciona"
          secondaryHref="#que-es"
          perks={[
            "PAGA EN PESOS Y EN DÓLARES",
            "SIN CUENTA EN EL EXTERIOR",
            "SIN APPS NUEVAS",
          ]}
          specs={CARD_HERO_SPECS}
          visual={<CardHeroVisual />}
        />

        <RuledList
          id="problema"
          eyebrow="EL PROBLEMA"
          title="Pagar en dólares con una tarjeta en pesos sale caro."
          lede="El comercio cobra en dólares y tu tarjeta paga en pesos. Entre esas dos monedas pasan tres cosas, y ninguna la decides tú."
          items={CARD_PROBLEMS}
          footnote={{
            a: "CON MONOKORO EL COBRO NACE EN DÓLARES",
            b: "SIN CONVERSIÓN AL PAGAR",
          }}
        />

        <CardWhatIs />
        <CardHow />

        <section id="control" className="sec-lg gutter">
          <div className="shell">
            <div className="eyebrow">CONTROL</div>
            <h2 className="rv h-section mt-[22px] max-w-[780px]">
              Tú mandas, desde el chat.
            </h2>
            <CardGrid
              items={CARD_CONTROLS}
              className="mt-[clamp(32px,4vw,48px)]"
            />
          </div>
        </section>

        <RuledList
          id="usos"
          eyebrow="PARA QUÉ LA USAN"
          title="Sirve para todo. Se respalda en dólares."
          items={CARD_USES}
        />

        <section id="compara" className="sec-lg gutter">
          <div className="shell">
            <SectionHead
              eyebrow="COMPARA"
              title="La misma compra, dos caminos."
              lede="Un cobro de 20 dólares por una suscripción, visto desde cada tarjeta."
            />
            <CompareTable
              rows={CARD_COMPARE}
              labelA="TARJETA EN PESOS"
              labelB="TARJETA MONOKORO"
            />
          </div>
        </section>

        <CardTiers />
        <CardTopUp />
        <CardStart />

        <Learn
          locale={typed}
          title="Entiende qué respalda tu saldo."
          slugs={CARD_LEARN_SLUGS}
          blurbs={CARD_LEARN_BLURBS}
        />

        <Faq
          items={CARD_FAQ_ITEMS}
          title="Sobre la tarjeta."
          lede="Si algo no queda claro, escríbenos y el agente te responde en minutos."
          waMessage="Hola, tengo una pregunta sobre la tarjeta Monokoro"
        />

        <Closing
          eyebrow={`DESDE $ ${fmtCOP(MIN_AMOUNT_COP)} COP · VERIFICACIÓN UNA SOLA VEZ`}
          title="Tu próxima compra, respaldada en dólares."
          lede="Le escribes al agente, confirmas el monto y los datos de la tarjeta llegan al chat."
          ctaLabel="Crear mi tarjeta por WhatsApp"
          waMessage={CARD_WA}
          secondary={{ label: "Solo quiero comprar dólares", href: "/" }}
        />
      </main>

      <Footer locale={typed} />
      <MobileCta label="Crear mi tarjeta" message={CARD_WA} />
    </>
  );
}
