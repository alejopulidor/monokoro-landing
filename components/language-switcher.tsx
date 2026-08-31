"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";

/**
 * Locale menu.
 *
 * **Renders nothing while the site has a single locale** — which is the state
 * today (see i18n/routing.ts). A picker with one option is noise. Add a locale
 * and it appears on its own; it is not mounted anywhere yet, so drop it into
 * the nav at that point.
 *
 * `router.replace`, not push, so switching language does not stack a history
 * entry the back button has to walk through. `usePathname` from
 * i18n/navigation returns the locale-less path, which is what keeps you on
 * /privacy/ instead of dropping you on the home page.
 */
export function LanguageSwitcher({ inverted = false }: { inverted?: boolean }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (routing.locales.length < 2) return null;

  const change = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("label")}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx(
          "ff-m inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] tracking-[0.1em] transition",
          inverted
            ? "text-[rgba(239,246,240,0.8)] hover:bg-white/10 hover:text-[var(--color-onDark)]"
            : "text-[var(--color-muted)] hover:bg-black/5 hover:text-[var(--color-ink)]",
        )}
      >
        {locale.toUpperCase()}
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-xl border border-[var(--color-line-soft)] bg-white py-1 shadow-[0_18px_50px_-16px_rgba(13,46,51,0.35)]"
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              role="menuitem"
              onClick={() => change(l)}
              className={cx(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
                l === locale
                  ? "bg-[var(--color-mint)]/20 font-semibold text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:bg-black/5",
              )}
            >
              <span>{t(l)}</span>
              <span className="ff-m text-[10px] text-[var(--color-faint)]">
                {l.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
