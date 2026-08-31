import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { breadcrumbSchema, collectionSchema } from "@/lib/schema";
import { ogImage } from "@/lib/og";
import { FEATURED_SLUG, getPost, postsFor } from "@/content/posts";
import { JsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/site/nav";
import { FooterSlim } from "@/components/site/footer";
import { FeaturedPost, PostList } from "@/components/blog/post-list";
import { IndexCta } from "@/components/blog/post-cta";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLE = "Aprende — Dólares digitales explicados sin vueltas";
const DESCRIPTION =
  "Guías cortas sobre dólares digitales, ahorro en dólares y pagos internacionales desde Colombia. Escritas para entender antes de mover tu plata.";

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
      canonical: `${SITE_URL}/${locale}/aprende/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/aprende/`]),
      ),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Monokoro",
      locale: "es_CO",
      type: "website",
      url: `${SITE_URL}/${locale}/aprende/`,
      images: ogImage("aprende", "Aprende — dólares digitales explicados"),
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ogImage("aprende", "Aprende — dólares digitales explicados"),
    },
  };
}

/**
 * The blog index.
 *
 * The featured post is shown first as a full panel **and** again in the list
 * below it. That is deliberate: the list is "todos los artículos" and a reader
 * scanning it should not find a hole where the lead article was.
 */
export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const typed: Locale = locale;

  const posts = postsFor(typed);
  const featured = getPost(typed, FEATURED_SLUG) ?? posts[0];

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(posts, typed),
          breadcrumbSchema([
            { label: "Inicio", href: `/${typed}/` },
            { label: "Aprende" },
          ]),
        ]}
      />

      <Nav activeHref="/aprende" />

      <main>
        <header className="gutter pt-[clamp(44px,7vw,84px)]">
          <div className="shell">
            <div className="eyebrow">APRENDE</div>
            <div className="mt-[22px] flex flex-wrap items-end gap-[clamp(24px,4vw,64px)]">
              <h1 className="hero-in min-w-0 flex-[1_1_460px] text-[clamp(40px,7.2vw,92px)] font-semibold leading-[0.94] tracking-[-0.045em] text-balance">
                Dólares digitales,
                <br />
                explicados sin vueltas.
              </h1>
              <p
                className="hero-in mb-2.5 min-w-0 flex-[1_1_320px] text-[20px] leading-[1.5] text-[var(--color-muted)] text-pretty"
              >
                Guías cortas para entender qué estás comprando, cuánto cuesta de
                verdad y cómo usarlo. Sin jerga y sin promesas raras.
              </p>
            </div>
          </div>
        </header>

        {featured && (
          <section className="gutter pt-[clamp(34px,5vw,56px)]">
            <div className="shell">
              <FeaturedPost post={featured} />
            </div>
          </section>
        )}

        <section className="gutter pt-[clamp(40px,6vw,72px)]">
          <div className="shell">
            <h2 className="ff-m text-[11.5px] tracking-[0.14em] text-[var(--color-teal)]">
              TODOS LOS ARTÍCULOS
            </h2>
            <PostList posts={posts} />
          </div>
        </section>

        <IndexCta />
      </main>

      <FooterSlim />
    </>
  );
}
