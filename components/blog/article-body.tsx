import type { Block } from "@/content/posts";

/**
 * Renders a post body from the typed block list in `content/posts.ts`.
 *
 * Four shapes, and deliberately no fifth: paragraph, heading, numbered list,
 * and the set-apart product note. There is no `dangerouslySetInnerHTML`
 * anywhere, so nothing an author writes can inject markup.
 *
 * Measure is capped at 700px while the page is wider, which is what keeps a
 * long article readable on a desktop monitor.
 *
 * Every block carries `.rv`, so the reveal observer in `SiteEffects` staggers
 * them as the reader scrolls — see globals.css.
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mx-auto mt-[clamp(36px,5vw,56px)] flex max-w-[860px] flex-col gap-1">
      {blocks.map((b, i) => (
        <div key={i} className="rv flex flex-col">
          {b.t === "h2" && (
            <h2 className="mt-[clamp(30px,4vw,48px)] max-w-[700px] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.035em] text-balance">
              {b.x}
            </h2>
          )}

          {b.t === "p" && (
            <p className="mt-[18px] max-w-[700px] text-[18.5px] leading-[1.68] text-[var(--color-muted)] text-pretty">
              {b.x}
            </p>
          )}

          {b.t === "list" && (
            <ol className="mt-5 flex max-w-[700px] flex-col">
              {b.items.map((it) => (
                <li
                  key={it.n}
                  className="flex gap-4 border-t border-[rgba(13,46,51,0.13)] py-4"
                >
                  <span className="ff-m shrink-0 pt-1 text-[11.5px] tracking-[0.1em] text-[var(--color-teal)]">
                    {it.n}
                  </span>
                  <p className="text-[17.5px] leading-[1.6] text-[var(--color-muted)] text-pretty">
                    <strong className="font-semibold text-[var(--color-ink)]">
                      {it.t}
                    </strong>{" "}
                    {it.d}
                  </p>
                </li>
              ))}
              <li
                className="border-t border-[rgba(13,46,51,0.13)]"
                aria-hidden
              />
            </ol>
          )}

          {b.t === "note" && (
            <aside className="card mt-[26px] max-w-[700px] rounded-[22px] p-[clamp(22px,3vw,30px)]">
              <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
                {b.tag}
              </div>
              <p className="mt-3 text-[17.5px] leading-[1.62] text-[var(--color-muted)] text-pretty">
                {b.x}
              </p>
            </aside>
          )}
        </div>
      ))}
    </div>
  );
}
