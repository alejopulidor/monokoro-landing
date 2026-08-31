import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/config";
import { postsFor } from "@/content/posts";

// Required under `output: "export"` — without it the route is treated as
// dynamic and never lands in out/.
export const dynamic = "force-static";

/**
 * Locale-less route segments, no leading or trailing slash. "" is the home.
 *
 * Only indexable pages belong here. Anything carrying `robots: {index:false}`
 * is deliberately absent — listing a page in the sitemap and then telling
 * Google not to index it is a contradiction, and Search Console reports it as
 * one. That currently excludes the bare "/" redirect shim.
 *
 * Articles are appended per locale from `content/posts.ts`, so publishing one
 * puts it in the sitemap with no second edit to remember.
 */
const STATIC_PATHS = ["", "aprende", "terms", "privacy"] as const;

/** The home is the entry point; everything else is supporting material. */
const PRIORITY: Record<string, number> = { "": 1, aprende: 0.8 };

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => {
    const paths: string[] = [
      ...STATIC_PATHS,
      ...postsFor(locale).map((p) => `aprende/${p.slug}`),
    ];

    return paths.map((path) => {
      const suffix = path ? `${path}/` : "";

      // hreflang for the pages every locale has. Article URLs are the same
      // slug across locales by construction, so the same map holds.
      const languages: Record<string, string> = {};
      for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${suffix}`;
      languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/${suffix}`;

      const base = PRIORITY[path] ?? 0.6;

      return {
        url: `${SITE_URL}/${locale}/${suffix}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: "monthly" as const,
        // Spanish is the primary market; anything else is a translation of it.
        priority:
          locale === routing.defaultLocale ? base : Math.max(base - 0.1, 0.1),
        alternates: { languages },
      };
    });
  });
}
