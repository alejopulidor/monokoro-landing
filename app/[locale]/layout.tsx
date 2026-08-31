import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { ogImage } from "@/lib/og";
import { JsonLd } from "@/components/seo/json-ld";
import { Aurora } from "@/components/site/aurora";
import { SiteEffects } from "@/components/site/site-effects";
import { Analytics, AnalyticsNoScript } from "@/components/site/analytics";
import { AnalyticsEvents } from "@/components/site/analytics-events";

/*
  The real document. `app/layout.tsx` above is a passthrough so this component
  can own <html lang>, which is the only place that knows the locale.

  The two typefaces are the design's. Swapping them is a change in this file
  plus the identical block in app/not-found.tsx (which renders outside this
  layout) — globals.css only ever refers to the CSS variables.
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

/** `themeColor` belongs to the viewport export, not to metadata — Next warns
 *  and drops it if it is declared alongside the title. It matches the paper
 *  background so Android's browser chrome and the iOS status bar do not frame
 *  the page in white. */
export const viewport: Viewport = {
  themeColor: "#F1F4ED",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/`;

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/${locale}/`, languages },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Monokoro",
      locale: "es_CO",
      type: "website",
      url: `${SITE_URL}/${locale}/`,
      images: ogImage(
        "home",
        "Monokoro — ahorra en dólares digitales desde WhatsApp",
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ogImage("home", "Monokoro — dólares digitales por WhatsApp"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const typed: Locale = locale;
  const t = await getTranslations({ locale, namespace: "meta" });

  return (
    <html lang={locale} className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full antialiased">
        {/* Analytics first: the GTM no-script iframe has to be the first thing
            in <body>, and the tag itself wants to run as early as possible.
            Both render null while no id is configured — see lib/config.ts. */}
        <AnalyticsNoScript />
        <Analytics />

        {/* Monokoro is described once, here. Everything else on the page
            references it by @id — see lib/schema.ts. */}
        <JsonLd
          data={[
            organizationSchema(typed, t("description")),
            webSiteSchema(typed),
          ]}
        />

        {/* The whole page sits in an `overflow-x: hidden` box: the aurora
            blobs and the marquee are both wider than the viewport by design,
            and without this they would add a horizontal scrollbar. */}
        <div className="relative w-full overflow-x-hidden">
          <Aurora />
          {/* z-10 lifts the content above the fixed aurora layer. */}
          <div className="relative z-10">
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </div>
        </div>

        <SiteEffects />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
