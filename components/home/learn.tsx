import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/site/brand";
import { postHref, postsFor } from "@/content/posts";
import type { Locale } from "@/i18n/routing";

/**
 * "Aprende" — the three article cards on the home page.
 *
 * Read from `content/posts.ts` rather than duplicated here, so publishing an
 * article updates the home page, the footer and the blog index at once. It
 * shows the first three; the "ver todos" link covers the rest.
 */
export function Learn({ locale }: { locale: Locale }) {
  const posts = postsFor(locale).slice(0, 3);

  return (
    <section id="aprende" className="sec-lg gutter">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <div className="eyebrow">APRENDE</div>
            <h2 className="rv h-section mt-[22px] max-w-[700px]">
              Entiende antes de mover tu plata.
            </h2>
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
                {p.excerpt}
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
