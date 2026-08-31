import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { getPost, postHref, postsFor, type Post } from "@/content/posts";
import type { Locale } from "@/i18n/routing";

/**
 * The "Aprende" article cards.
 *
 * Read from `content/posts.ts` rather than duplicated per page, so publishing
 * an article updates the home page, the product pages, the footer and the blog
 * index at once — and so a card can never point at a post that was renamed.
 *
 * `slugs` picks specific articles (the product pages each lead with the two
 * that answer their own objections); omitting it shows the newest three.
 *
 * `blurbs` overrides an excerpt per slug. The same article is worth reading for
 * different reasons depending on where the reader came from: on the card page,
 * "¿Qué es un dólar digital?" is about *what backs the card balance*.
 */
export function Learn({
  locale,
  title,
  slugs,
  blurbs,
}: {
  locale: Locale;
  title: React.ReactNode;
  slugs?: string[];
  blurbs?: Record<string, string>;
}) {
  const posts: Post[] = slugs
    ? slugs
        .map((s) => getPost(locale, s))
        .filter((p): p is Post => Boolean(p))
    : postsFor(locale).slice(0, 3);

  if (!posts.length) return null;

  return (
    <section id="aprende" className="sec-lg gutter">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <div className="eyebrow">APRENDE</div>
            <h2 className="rv h-section mt-[22px] max-w-[700px]">{title}</h2>
          </div>
          <Link
            href="/aprende"
            className="flex items-center gap-2.5 text-base font-medium text-[var(--color-teal)] hover:text-[var(--color-ink)]"
          >
            Ver todos los artículos <Arrow />
          </Link>
        </div>

        <div
          className="mt-[clamp(32px,4vw,48px)] grid gap-[18px]"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}
        >
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={postHref(p.slug)}
              className="rv mk-lift card flex flex-col gap-3.5 p-[clamp(24px,3vw,32px)]"
            >
              <div className="ff-m flex items-center justify-between gap-3 text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                <span>{p.tag}</span>
                <span className="text-[var(--color-faint)]">{p.minutes}</span>
              </div>
              <h3 className="text-[clamp(21px,2.5vw,27px)] font-semibold leading-[1.16] tracking-[-0.03em]">
                {p.title}
              </h3>
              <p className="text-base leading-[1.55] text-[var(--color-muted)] text-pretty">
                {blurbs?.[p.slug] ?? p.excerpt}
              </p>
              <span className="mt-1 flex items-center gap-2 text-[15px] font-medium text-[var(--color-teal)]">
                Leer más <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
