/*
 * The two drifting blobs behind the whole page.
 *
 * `position: fixed` and `z-index: 0`, with the page content on `z-index: 1`,
 * so they stay put while the page scrolls instead of being repainted with it.
 * `pointer-events: none` on the wrapper is what keeps them from swallowing
 * clicks meant for the content above.
 *
 * Sized in `vw` on both axes on purpose — a circle that stays circular as the
 * viewport changes shape. They are pure decoration and carry no meaning.
 *
 * **No `filter: blur()`, and that is a performance decision with a number
 * behind it.** These used to be `blur-[90px]` / `blur-[100px]` on ~800px
 * elements that also run an infinite `transform` animation including
 * `scale(1.25)`. Animating a transform on a filtered element re-rasterises the
 * blur every frame, at a growing size. Measured while scrolling /es/ at
 * 1418×802: with them, 46.8 fps, p95 44ms, worst frame **318ms**, 26 visible
 * stutters. With every filter off, 58.6 fps and 8 stutters; with the blobs gone
 * entirely, 59.5 fps and 4. They were the single largest cost on the page.
 *
 * A radial gradient is already a soft falloff, so the blur was mostly
 * redundant — the extra stops below do the same smoothing for free, and with
 * no filter the transform animation runs on the compositor.
 */

export function Aurora() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute left-[-14vw] top-[-10vw] h-[52vw] w-[52vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(106,221,155,.22) 0%,rgba(106,221,155,.11) 36%,rgba(106,221,155,.04) 56%,transparent 72%)",
          animation: "auroraA 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-12vw] top-[42vh] h-[46vw] w-[46vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(51,130,137,.20) 0%,rgba(51,130,137,.10) 38%,rgba(51,130,137,.035) 58%,transparent 74%)",
          animation: "auroraB 41s ease-in-out infinite",
        }}
      />
    </div>
  );
}
