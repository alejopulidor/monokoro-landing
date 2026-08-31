import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { POSTS, getPost, postsFor, relatedFor } from "@/content/posts";
import { JsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/site/nav";
import { FooterSlim } from "@/components/site/footer";
import { ArticleBody } from "@/components/blog/article-body";
import { PostCta } from "@/components/blog/post-cta";
import { RelatedPosts } from "@/components/blog/post-list";

/**
 * One article per slug, prerendered.
 *
 * `generateStaticParams` enumerates the real posts, so under `output: export`
 * the build fails loudly if a related-post slug points at something that does
 * not exist — which is the whole reason the blog is a typed collection rather
 * than loose files.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    postsFor(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

/** Belt and braces under static export: no unknown slug should ever be
 *  requested, and if one is, answer 404 rather than an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};

  const url = `${SITE_URL}/${locale}/aprende/${post.slug}/`;

  return {
    title: `${post.title} | Monokoro`,
    description: post.excerpt,
    alternates: {
      canonical: url,
      // Only locales that actually publish this slug get an alternate. A
      // hreflang pointing at a page that does not exist is worse than none.
      languages: Object.fromEntries(
        POSTS.filter((p) => p.slug === post.slug).map((p) => [
          p.locale,
          `${SITE_URL}/${p.locale}/aprende/${p.slug}/`,
        ]),
      ),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published,
      url,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const typed: Locale = locale;

  const post = getPost(typed, slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post, typed),
          breadcrumbSchema([
            { label: "Inicio", href: `/${typed}/` },
            { label: "Aprende", href: `/${typed}/aprende/` },
            { label: post.title },
          ]),
        ]}
      />

      {/* Reading progress. `SiteEffects` finds it by id and widens it on
          scroll; pages without it are simply skipped. */}
      <div
        id="mk-prog"
        className="fixed left-0 top-0 z-[90] h-0.5 w-0 bg-[linear-gradient(90deg,#6ADD9B,#2C7A80)]"
        aria-hidden
      />

      <Nav activeHref="/aprende" />

      <article className="gutter pt-[clamp(36px,6vw,72px)]">
        <div className="mx-auto max-w-[860px]">
          <nav
            aria-label="Ruta"
            className="ff-m flex flex-wrap items-center gap-2 text-[11px] tracking-[0.12em] text-[var(--color-faint)]"
          >
            <Link href="/" className="text-[var(--color-faint)] hover:text-[var(--color-teal)]">
              INICIO
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/aprende"
              className="text-[var(--color-faint)] hover:text-[var(--color-teal)]"
            >
              APRENDE
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--color-teal)]">{post.tag}</span>
          </nav>

          <div className="ff-m mt-[26px] flex flex-wrap gap-x-[18px] gap-y-2.5 text-[11.5px] tracking-[0.12em] text-[var(--color-teal)]">
            <span>{post.tag}</span>
            <span className="text-[var(--color-faint)]">
              {post.minutes} DE LECTURA
            </span>
            <span className="text-[var(--color-faint)]">
              {post.updatedLabel}
            </span>
          </div>

          <h1 className="hero-in mt-[18px] text-[clamp(38px,6.4vw,76px)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance">
            {post.title}
          </h1>
          <p
            className="hero-in mt-[26px] max-w-[660px] text-[clamp(19px,2.3vw,23px)] leading-[1.5] text-[var(--color-muted)] text-pretty"
            style={{ animationDelay: ".12s" }}
          >
            {post.lede}
          </p>
        </div>

        <ArticleBody blocks={post.body} />

        <PostCta title={post.ctaTitle} message={post.waMessage} />

        <RelatedPosts posts={relatedFor(post)} />
      </article>

      <FooterSlim />
    </>
  );
}
