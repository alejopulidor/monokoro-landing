import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, type Locale } from "@/i18n/routing";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { FAQ_ITEMS } from "@/content/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { Hero } from "@/components/home/hero";
import { Quoter } from "@/components/home/quoter";
import { Steps } from "@/components/home/steps";
import { CardSection } from "@/components/home/card-section";
import { Tiers } from "@/components/home/tiers";
import { Uses } from "@/components/home/uses";
import { Transparency } from "@/components/home/transparency";
import { Learn } from "@/components/home/learn";
import { Faq } from "@/components/home/faq";
import { Closing } from "@/components/home/closing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The home page.
 *
 * Section order is the design's and it is an argument, not a menu: what it is
 * (hero) → what it costs (cotizador) → how it works (pasos) → what you do with
 * it (tarjeta) → how to start (empieza) → why (beneficios) → why trust it
 * (transparencia) → learn more (aprende) → objections (faq) → ask (cierre).
 * Moving a section changes the argument.
 *
 * `pb-24 min-[760px]:pb-0` on the main leaves room for the sticky mobile CTA
 * so it never covers the last line of the footer.
 */
export default async function HomePage({
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
      {/* The FAQ answers here are the same array the accordion renders, so the
          structured data can never drift from the visible copy. */}
      <JsonLd data={[serviceSchema(typed), faqSchema(FAQ_ITEMS)]} />

      <Nav />
      <main className="pb-24 min-[760px]:pb-0">
        <Hero />
        <Quoter />
        <Steps />
        <CardSection />
        <Tiers />
        <Uses />
        <Transparency />
        <Learn locale={typed} />
        <Faq />
        <Closing />
      </main>
      <Footer locale={typed} />
      <MobileCta />
    </>
  );
}
