import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { postHref, type Post } from "@/content/posts";

/**
 * The featured post at the top of the blog index — a full-width dark panel, so
 * the eye lands on it before the list.
 *
 * It is chosen explicitly (`FEATURED_SLUG` in content/posts.ts) rather than by
 * date: which article leads is an editorial call.
 */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={postHref(post.slug)}
      className="hero-in panel mk-lift block"
      style={{ animationDelay: ".2s" }}
    >
      <div className="mk-aur-a" aria-hidden />
      <div className="mk-aur-b" aria-hidden />
      <div className="mk-grid" aria-hidden />

      <div className="relative flex flex-wrap items-end gap-x-11 gap-y-[26px] p-[clamp(30px,5vw,64px)]">
        <div className="min-w-0 flex-[1_1_420px]">
          <div className="ff-m flex flex-wrap gap-x-[18px] gap-y-2.5 text-[11.5px] tracking-[0.12em] text-[var(--color-mint)]">
            <span>DESTACADO</span>
            <span className="text-[rgba(239,246,240,0.55)]">{post.tag}</span>
            <span className="text-[rgba(239,246,240,0.55)]">
              {post.minutes} DE LECTURA
            </span>
          </div>
          <h2 className="mt-5 max-w-[640px] text-[clamp(30px,4.8vw,60px)] font-semibold leading-none tracking-[-0.042em] text-[var(--color-onDark)] text-balance">
            {post.title}
          </h2>
          <p className="mt-5 max-w-[560px] text-[18.5px] leading-[1.55] text-[rgba(239,246,240,0.86)] text-pretty">
            {post.excerpt}
          </p>
        </div>

        {/* A span, not a nested link — the whole panel is already the link. */}
        <span className="btn bg-[var(--color-mint)] px-[26px] py-3.5 text-base font-semibold text-[var(--color-ink)]">
          Leer más <Arrow />
        </span>
      </div>
    </Link>
  );
}

/**
 * The full index, as a ruled list rather than a card grid. At three or four
 * posts a grid leaves an obvious hole where the fourth card should be; a list
 * grows gracefully to any number.
 */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-5 flex flex-col">
      {posts.map((p) => (
        <Link
          key={p.slug}
          href={postHref(p.slug)}
          className="rv mk-row flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3.5 border-t border-[var(--color-line)] py-7"
        >
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-2.5">
            <div className="ff-m flex flex-wrap gap-x-4 gap-y-2 text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
              <span>{p.tag}</span>
              <span className="text-[var(--color-faint)]">{p.minutes}</span>
            </div>
            <span className="text-[clamp(22px,3vw,32px)] font-semibold leading-[1.12] tracking-[-0.032em] text-balance">
              {p.title}
            </span>
          </div>
          <p className="min-w-0 flex-[1_1_360px] text-[17px] leading-[1.55] text-[var(--color-muted)] text-pretty">
            {p.excerpt}
          </p>
          <span className="ff-m text-base text-[var(--color-teal)]" aria-hidden>
            →
          </span>
        </Link>
      ))}
      <div className="border-t border-[var(--color-line)]" aria-hidden />
    </div>
  );
}

/** "Sigue leyendo" — two small cards under an article. */
export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <div className="mx-auto mt-[clamp(44px,6vw,72px)] max-w-[860px]">
      <div className="ff-m text-[11.5px] tracking-[0.14em] text-[var(--color-teal)]">
        SIGUE LEYENDO
      </div>
      <div
        className="mt-5 grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}
      >
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={postHref(p.slug)}
            className="rv mk-lift card flex flex-col gap-3 rounded-[22px] p-[clamp(22px,3vw,28px)]"
          >
            <div className="ff-m flex justify-between gap-3 text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
              <span>{p.tag}</span>
              <span className="text-[var(--color-faint)]">{p.minutes}</span>
            </div>
            <h3 className="text-[21px] font-semibold leading-[1.18] tracking-[-0.028em]">
              {p.cardTitle ?? p.title}
            </h3>
            <span className="flex items-center gap-2 text-[15px] font-medium text-[var(--color-teal)]">
              Leer más <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
