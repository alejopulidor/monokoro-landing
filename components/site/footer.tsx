import { Link } from "@/i18n/navigation";
import { Arrow, MonokoroMark, Wordmark } from "./brand";
import { FOOTER_LEGAL, FOOTER_PRODUCT, ready } from "@/lib/nav";
import { postHref, postsFor } from "@/content/posts";
import type { Locale } from "@/i18n/routing";

const LEGAL_STRIP = "TASAS REFERENCIALES · SE CONFIRMAN EN EL CHAT";

/**
 * The full footer, used on the home page.
 *
 * The "Aprende" column is generated from `content/posts.ts` rather than typed
 * out, so publishing an article adds it here for free — and, more usefully, so
 * it can never list a post that was renamed or removed.
 *
 * The product column is filtered through `lib/nav.ts`: Tarjeta and Negocios
 * are in the design but their pages do not exist yet.
 */
export function Footer({ locale }: { locale: Locale }) {
  const posts = postsFor(locale);

  return (
    <footer className="gutter pb-10 pt-[clamp(64px,9vw,112px)]">
      <div className="shell">
        <div className="flex flex-wrap gap-[clamp(32px,4vw,56px)]">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <Link href="/" aria-label="Monokoro — inicio">
              <Wordmark size={36} wordSize={28} />
            </Link>
            <p className="max-w-[420px] text-[17px] leading-[1.55] text-[var(--color-muted)] text-pretty">
              Dólares digitales por WhatsApp. Cotizas, confirmas y recibes — sin
              apps nuevas.
            </p>
          </div>

          <FooterCol title="PRODUCTO" basis="190px">
            {ready(FOOTER_PRODUCT).map((i) => (
              <Link key={i.href} href={i.href} className={linkCls}>
                {i.label}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="APRENDE" basis="230px">
            {posts.map((p) => (
              <Link key={p.slug} href={postHref(p.slug)} className={linkCls}>
                {p.cardTitle ?? p.title}
              </Link>
            ))}
            <Link
              href="/aprende"
              className="text-base text-[var(--color-teal)] hover:text-[var(--color-ink)]"
            >
              Todos los artículos <Arrow />
            </Link>
          </FooterCol>

          <FooterCol title="LEGAL" basis="170px">
            {ready(FOOTER_LEGAL).map((i) => (
              <Link key={i.href} href={i.href} className={linkCls}>
                {i.label}
              </Link>
            ))}
          </FooterCol>
        </div>

        <div className="ff-m mt-[clamp(40px,6vw,64px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(13,46,51,0.12)] pt-6 text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
          <span>© 2026 MONOKORO</span>
          <span>{LEGAL_STRIP}</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * The one-line footer used by the blog index and the articles. Reading pages
 * end on the CTA panel; a four-column sitemap after it would bury the action.
 */
export function FooterSlim() {
  return (
    <footer className="gutter pb-10 pt-[clamp(56px,8vw,96px)]">
      <div className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-[rgba(13,46,51,0.12)] pt-[26px]">
        <Link href="/" aria-label="Monokoro — inicio">
          <span className="inline-flex items-center gap-[11px]">
            <MonokoroMark size={28} />
            <span className="text-[18px] font-semibold tracking-[-0.02em]">
              Monokoro
            </span>
          </span>
        </Link>
        <span className="ff-m text-[11px] tracking-[0.1em] text-[var(--color-faint)]">
          © 2026 · {LEGAL_STRIP}
        </span>
      </div>
    </footer>
  );
}

const linkCls = "text-base text-[var(--color-muted)] hover:text-[var(--color-teal)]";

function FooterCol({
  title,
  basis,
  children,
}: {
  title: string;
  basis: string;
  children: React.ReactNode;
}) {
  return (
    <nav
      aria-label={title}
      className="flex min-w-0 flex-col gap-[13px]"
      style={{ flex: `0 1 ${basis}` }}
    >
      <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-faint)]">
        {title}
      </div>
      {children}
    </nav>
  );
}
