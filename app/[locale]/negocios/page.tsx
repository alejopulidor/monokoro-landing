import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { ogImage } from "@/lib/og";
import { BUSINESS_FAQ_ITEMS } from "@/content/faq";
import {
  BIZ_CASES,
  BIZ_COMPARE,
  BIZ_HERO_SPECS,
  BIZ_LEARN_BLURBS,
  BIZ_LEARN_SLUGS,
  BIZ_WA,
} from "@/content/business";
import { BUSINESS_MOBILE_NAV, BUSINESS_NAV } from "@/lib/nav";

import { JsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { ProductHero } from "@/components/shared/product-hero";
import { RuledList } from "@/components/shared/ruled-list";
import { CompareTable } from "@/components/shared/compare-table";
import { SectionHead } from "@/components/shared/section-head";
import { Learn } from "@/components/shared/learn";
import { Faq } from "@/components/shared/faq";
import { Closing } from "@/components/shared/closing";
import { CardFan } from "@/components/card/hero-visual";
import {
  BizApi,
  BizBrand,
  BizDashboard,
  BizHow,
  BizPerks,
  BizPockets,
  BizProblem,
  BizRates,
  BizStart,
  BizWhatIs,
} from "@/components/business/sections";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLE = "Monokoro Negocios — Tarjetas en dólares para tu operación";
const DESCRIPTION =
  "Tarjetas empresariales en dólares para pauta, proveedores y viáticos. Ilimitadas, creadas desde WhatsApp y administradas en un dashboard, con bolsillos que comparten saldo entre varias tarjetas y API, SDK e iframe para montarlas en tu producto.";

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
      canonical: `${SITE_URL}/${locale}/negocios/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/negocios/`]),
      ),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Monokoro",
      locale: "es_CO",
      type: "website",
      url: `${SITE_URL}/${locale}/negocios/`,
      images: ogImage("negocios", "Monokoro Negocios — tarjetas en dólares"),
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ogImage("negocios", "Monokoro Negocios — tarjetas en dólares"),
    },
  };
}

/**
 * `/negocios`.
 *
 * Same argument shape as `/tarjeta` but aimed at an operator rather than a
 * person: what breaks today (problema) → what it is (qué es) → how you start
 * (cómo) → who it is for (casos) → how the money is organised (bolsillos) →
 * where you run it (dashboard) → what the rates are (tasas) → why it beats the
 * bank (compara) → what makes it yours (marca, api) → the ask (empezar, faq,
 * cierre).
 *
 * `bolsillos` and `dashboard` sit after `casos` in that order because they
 * answer the two questions the use cases raise, and only in that order: "how do
 * I keep forty cards' money apart?" and then "where do I watch it?".
 *
 * **`Monokoro Negocios v2.dc.html` is the current canvas for this page**, not
 * v5 — the client updated it later, despite the version number. It designs
 * `#bolsillos`, `#dashboard` and `#api`, and it is also **leaner than what
 * ships here**: it has no `#que-es`, `#compara`, `#marca`, `#empezar`,
 * `#aprende` or `#faq`. Those are kept deliberately for now — dropping `#faq`
 * would take the `FAQPage` structured data with it and `#aprende` the internal
 * links — but the divergence is a decision someone should make on purpose
 * rather than discover.
 */
export default async function BusinessPage({
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
            slug: "negocios",
            name: "Tarjetas empresariales Monokoro",
            description: DESCRIPTION,
            locale: typed,
          }),
          faqSchema(BUSINESS_FAQ_ITEMS),
          breadcrumbSchema([
            { label: "Inicio", href: `/${typed}/` },
            { label: "Negocios" },
          ]),
        ]}
      />

      <Nav
        subtitle="Negocios"
        activeHref="/negocios"
        links={BUSINESS_NAV}
        mobileLinks={BUSINESS_MOBILE_NAV}
        cta={{ label: "Hablar con ventas", message: BIZ_WA }}
      />

      <main className="pb-24 min-[760px]:pb-0">
        <ProductHero
          eyebrow="ECOMMERCE · DROPSHIPPING · AGENCIAS · SAAS"
          title="La tarjeta que no te tumba la pauta."
          lede="Tarjetas en dólares, ilimitadas, creadas desde WhatsApp. Una por campaña, por cliente o por proveedor, con el saldo respaldado en dólares digitales a nombre de tu negocio."
          ctaLabel="Crear mi tarjeta empresarial"
          waMessage={BIZ_WA}
          secondaryLabel="Cómo funciona"
          secondaryHref="#como"
          perks={["TARJETAS ILIMITADAS", "CON TU MARCA", "API Y SDK"]}
          specs={BIZ_HERO_SPECS}
          visual={
            <CardFan
              mode="drop"
              labels={["META ADS", "TIKTOK ADS"]}
              last4={["4821", "7302"]}
            />
          }
          caption={{
            k: "UNA TARJETA POR CAMPAÑA, POR CLIENTE, POR PROVEEDOR",
            d: "Si una se quema a las 11 de la noche, creas otra en el chat y sigues pautando.",
          }}
        />

        <BizProblem />
        <BizWhatIs />
        <BizHow />

        <RuledList
          id="casos"
          eyebrow="CASOS DE USO"
          title="Hecho para los que venden online."
          items={BIZ_CASES}
          after={<BizPerks />}
        />

        <BizPockets />

        <BizDashboard />

        <BizRates />

        <section id="compara" className="sec-lg gutter">
          <div className="shell">
            <SectionHead
              eyebrow="COMPARA"
              title="Tu banco, y esto."
              lede="La misma operación —crear una tarjeta, pagar una pauta, reponerla cuando se quema— vista desde cada lado."
            />
            <CompareTable
              rows={BIZ_COMPARE}
              labelA="TARJETA BANCARIA"
              labelB="MONOKORO NEGOCIOS"
            />
          </div>
        </section>

        <BizBrand />

        <BizApi />

        <BizStart />

        <Learn
          locale={typed}
          title="Entiende qué respalda el saldo."
          slugs={BIZ_LEARN_SLUGS}
          blurbs={BIZ_LEARN_BLURBS}
        />

        <Faq
          items={BUSINESS_FAQ_ITEMS}
          title="Sobre las tarjetas empresariales."
          lede="Si algo no queda claro, escríbenos y el agente te responde en minutos."
          waMessage="Hola, tengo una pregunta sobre las tarjetas empresariales"
        />

        <Closing
          eyebrow="TARJETAS ILIMITADAS · CONTROL DESDE WHATSAPP"
          title="Tu próxima campaña no debería depender del humor de tu banco."
          lede="Verificas el negocio una vez, fondeas en pesos y creas las tarjetas que necesites — con tu marca si así lo quieres."
          ctaLabel="Crear mi tarjeta empresarial"
          waMessage={BIZ_WA}
          secondary={{ label: "Solo quiero comprar dólares", href: "/" }}
        />
      </main>

      <Footer locale={typed} />
      <MobileCta label="Crear mi tarjeta empresarial" message={BIZ_WA} />
    </>
  );
}
