/**
 * Colombian number formatting, written by hand rather than with `Intl`.
 *
 * The quoter renders on the server (static export) and then hydrates in the
 * browser. `Number.prototype.toLocaleString("es-CO")` depends on the ICU data
 * the runtime happens to ship, so Node and the browser can disagree on the
 * separators — and a one-character difference in a prerendered figure is a
 * hydration mismatch React will warn about and repaint.
 *
 * es-CO convention: `.` groups thousands, `,` is the decimal mark.
 */

const group = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Whole pesos: 1234567 → "1.234.567" */
export function fmtCOP(n: number): string {
  const rounded = Math.round(Math.abs(n));
  return (n < 0 ? "-" : "") + group(String(rounded));
}

/** Dollars with cents: 120.4819 → "120,48" */
export function fmtUSD(n: number): string {
  const fixed = Math.abs(n).toFixed(2);
  const [whole, cents] = fixed.split(".");
  return (n < 0 ? "-" : "") + group(whole) + "," + cents;
}

/** Strips everything that is not a digit and caps the length, for the quoter
 *  input. Returns the raw digit string, not a number — the field keeps its own
 *  unformatted value so the caret does not jump while typing. */
export function digitsOnly(raw: string, max = 12): string {
  return raw.replace(/\D/g, "").slice(0, max);
}

/** "298" seconds → "4:58" */
export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
