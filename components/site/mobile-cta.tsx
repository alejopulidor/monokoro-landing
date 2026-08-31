import { Arrow } from "./brand";
import { waLink } from "@/lib/config";

/**
 * The sticky "Comprar por WhatsApp" bar on phones.
 *
 * Hidden above 760px with a CSS media query rather than by measuring the
 * viewport in JS. The design canvas branched on a `isMobile` state, which on a
 * statically exported page means the bar is absent from the HTML and pops in
 * after hydration — and is wrong for the whole first paint. A `hidden`
 * utility costs nothing and is right immediately.
 *
 * The page adds bottom padding at the same breakpoint so the bar never covers
 * the last line of the footer.
 */
export function MobileCta({
  label = "Comprar dólares por WhatsApp",
  message = "Hola, quiero comprar dólares digitales",
}: {
  label?: string;
  message?: string;
} = {}) {
  return (
    <a
      href={waLink(message)}
      className="btn fixed inset-x-4 bottom-4 z-[70] bg-[var(--color-ink)] px-5 py-4 text-base text-[var(--color-paper)] shadow-[0_14px_34px_rgba(7,36,42,.4)] min-[760px]:hidden"
    >
      {label} <Arrow />
    </a>
  );
}
