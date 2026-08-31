/**
 * The two drifting blobs behind the whole page.
 *
 * `position: fixed` and `z-index: 0`, with the page content on `z-index: 1`,
 * so they stay put while the page scrolls instead of being repainted with it.
 * `pointer-events: none` on the wrapper is what keeps them from swallowing
 * clicks meant for the content above.
 *
 * Sized in `vw` on both axes on purpose — a circle that stays circular as the
 * viewport changes shape. They are pure decoration and carry no meaning.
 */
export function Aurora() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute left-[-14vw] top-[-10vw] h-[52vw] w-[52vw] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle,rgba(106,221,155,.20),transparent 66%)",
          animation: "auroraA 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-12vw] top-[42vh] h-[46vw] w-[46vw] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle,rgba(51,130,137,.16),transparent 68%)",
          animation: "auroraB 41s ease-in-out infinite",
        }}
      />
    </div>
  );
}
