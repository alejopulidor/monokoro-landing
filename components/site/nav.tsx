"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Arrow, MonokoroMark, Wordmark } from "./brand";
import { RateTicker } from "./rate-ticker";
import { MOBILE_NAV, PRIMARY_NAV, ready, type NavItem } from "@/lib/nav";
import { waLink } from "@/lib/config";
import { cx } from "@/lib/cx";

/**
 * Sticky top bar + rate marquee + full-screen mobile sheet.
 *
 * `#mk-nav` is read by `SiteEffects`, which grows the shadow past 24px of
 * scroll — the id is the contract between the two, so do not rename it.
 *
 * The breakpoint is **900px**, not one of Tailwind's defaults: below it the
 * five links wrap onto a second line and push the CTA off the bar. It is
 * written as `max-[900px]:` / `min-[900px]:` so the number stays visible here
 * instead of hiding behind an alias.
 *
 * Which links appear is decided by `lib/nav.ts`, not here: Tarjeta and
 * Negocios are in the design but their pages do not exist yet, so they carry
 * `ready: false` and are filtered out.
 */
export function Nav({ activeHref }: { activeHref?: string }) {
  const [open, setOpen] = useState(false);
  const links = ready(PRIMARY_NAV);
  const mobileLinks = ready(MOBILE_NAV);
  const buy = waLink("Hola, quiero comprar dólares digitales");

  // Lock the page behind the sheet, and put it back on unmount — otherwise a
  // route change while the sheet is open leaves the body unscrollable.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        id="mk-nav"
        className="sticky top-0 z-[60] border-b border-[var(--color-line-soft)] bg-[rgba(241,244,237,0.82)] backdrop-blur-[18px] transition-shadow duration-300"
      >
        <div className="shell gutter flex items-center justify-between gap-x-7 gap-y-3.5 py-3">
          <Link href="/" aria-label="Monokoro — inicio">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-[26px] text-[15px] text-[var(--color-muted)] max-[900px]:hidden">
            {links.map((l) => (
              <NavLink key={l.href} item={l} active={l.href === activeHref} />
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              className="mk-mag btn btn-ink btn-sm shadow-[0_10px_24px_-14px_rgba(13,46,51,.9)]"
              href={buy}
            >
              Comprar <Arrow />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              className="hidden h-[42px] w-[42px] items-center justify-center rounded-full border border-[rgba(13,46,51,0.16)] max-[900px]:flex"
            >
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="block h-[1.5px] w-4 bg-[var(--color-ink)]" />
                <span className="block h-[1.5px] w-4 bg-[var(--color-ink)]" />
              </span>
            </button>
          </div>
        </div>

        <RateTicker />
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-[rgba(10,43,49,0.96)] px-[clamp(20px,6vw,40px)] py-[22px] backdrop-blur-[10px]"
          style={{ animation: "bubbleIn .3s ease both" }}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-[11px] text-[19px] font-semibold tracking-[-0.02em] text-[var(--color-onDark)]">
              <MonokoroMark size={28} />
              Monokoro
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="h-[42px] w-[42px] rounded-full border border-[rgba(239,246,240,0.3)] text-xl text-[var(--color-onDark)]"
            >
              ×
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-1.5">
            {mobileLinks.map((l) => (
              <NavLink
                key={l.href}
                item={l}
                onNavigate={() => setOpen(false)}
                className="text-[clamp(30px,8vw,44px)] font-semibold leading-[1.18] tracking-[-0.035em] text-[var(--color-onDark)] hover:text-[var(--color-mint)]"
              />
            ))}
          </div>

          <a
            className="btn mk-mag mt-auto bg-[var(--color-mint)] px-6 py-[17px] text-[17px] font-semibold text-[var(--color-ink)]"
            href={buy}
          >
            Comprar por WhatsApp <Arrow />
          </a>
        </div>
      )}
    </>
  );
}

/**
 * Every entry goes through next-intl's `Link`, including the `/#cotiza` form:
 * it resolves to `/es/#cotiza`, so the anchor keeps working from the blog as
 * well as from the home page, where the browser just scrolls.
 */
function NavLink({
  item,
  active,
  className,
  onNavigate,
}: {
  item: NavItem;
  active?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const cls = cx(
    className ?? "transition-colors hover:text-[var(--color-ink)]",
    active && !className && "text-[var(--color-ink)]",
  );

  return (
    <Link href={item.href} className={cls} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}
