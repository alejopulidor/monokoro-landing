export type ColoredStep = { n: string; t: string; d: string };

/**
 * Three stacked step cards in alternating ink / teal.
 *
 * The alternation is fixed here rather than carried per item as it was in the
 * design canvas: it is a rhythm, not data, and passing six colour strings per
 * step through the content layer invites someone to break the pattern by
 * accident. Position decides the colour; add a fourth step and it goes back to
 * ink.
 */
export function ColoredSteps({ steps }: { steps: ColoredStep[] }) {
  return (
    <ol className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
      {steps.map((s, i) => {
        const teal = i % 2 === 1;
        return (
          <li
            key={s.n}
            className="rv flex flex-1 items-start gap-[18px] rounded-[20px] p-[clamp(22px,3vw,28px)]"
            style={{
              background: teal ? "var(--color-teal)" : "var(--color-ink)",
              color: "var(--color-onDark)",
            }}
          >
            <span
              className="ff-m pt-1 text-[13px]"
              style={{ color: teal ? "#D8F7E4" : "var(--color-mint)" }}
            >
              {s.n}
            </span>
            <div>
              <h3 className="text-[21px] font-semibold tracking-[-0.025em]">
                {s.t}
              </h3>
              <p
                className="mt-2 text-base leading-[1.5] text-pretty"
                style={{
                  color: teal
                    ? "rgba(239,246,240,.9)"
                    : "rgba(239,246,240,.75)",
                }}
              >
                {s.d}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
