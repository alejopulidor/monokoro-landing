import cards from "@/scripts/og/cards.json";
import { SITE_URL } from "@/lib/config";

/**
 * Social cards.
 *
 * The card definitions are imported from `scripts/og/cards.json` — the same
 * file the renderer reads — so a card id can never drift from the image that
 * actually exists in `public/og/`. This only runs in `generateMetadata`, at
 * build time, so the JSON never reaches the client bundle.
 *
 * **One image per page.** The preview *is* the ad, and two links that unfurl
 * identically read as duplicates. Pages with nothing worth previewing (the
 * legal documents) get no image at all rather than borrowing the home card
 * with the wrong URL underneath it.
 *
 * To add one: append an entry to `scripts/og/cards.json`, run
 * `pnpm og`, commit the JPEG, and reference the id here.
 */

const IDS = new Set(cards.map((c) => c.id));

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
};

/** 1200×630 is the size every platform crops from. Declaring width/height
 *  lets a crawler lay the card out before it has downloaded the file. */
export function ogImage(id: string, alt: string): OgImage[] {
  // An unknown id would ship a 404 as the card, which unfurls as a broken
  // image — worse than no card. Fail soft to nothing and say so at build time.
  if (!IDS.has(id)) {
    console.warn(
      `[og] No card for "${id}". Add it to scripts/og/cards.json and run \`pnpm og\`.`,
    );
    return [];
  }

  return [
    {
      url: `${SITE_URL}/og/${id}.jpg`,
      width: 1200,
      height: 630,
      alt,
      type: "image/jpeg",
    },
  ];
}
