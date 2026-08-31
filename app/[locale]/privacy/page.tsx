import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal-page";
import { routing } from "@/i18n/routing";
import { PRIVACY_EMAIL, SITE_URL } from "@/lib/config";

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
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: `${t("title")} · Monokoro`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/privacy/`]),
      ),
    },
  };
}

export default async function PrivacyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage namespace="privacy" email={PRIVACY_EMAIL} />;
}
