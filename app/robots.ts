import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

// Required under `output: "export"` — without it the route is treated as
// dynamic and never lands in out/.
export const dynamic = "force-static";

/**
 * Two families of AI crawler, and they do different jobs. Both are listed
 * explicitly rather than left to the `*` rule, because the distinction is a
 * business decision and it should be visible in the file, not implied.
 *
 * **Answer crawlers** fetch a page to cite it in a live answer. These are the
 * ones that decide whether Monokoro shows up when somebody asks ChatGPT how to
 * buy dollars in Colombia. Blocking them means being invisible there.
 */
const ANSWER_BOTS = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // a person asking ChatGPT to open this page
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // a person following a Perplexity citation
  "Claude-User", // a person asking Claude to open this page
  "Claude-SearchBot", // Claude search index
  "DuckAssistBot", // DuckDuckGo AI answers
  "MistralAI-User",
  "Bingbot", // also feeds Copilot
];

/**
 * **Training crawlers** collect pages to train future models. They do not put
 * you in today's answers; the trade is long-term brand presence in models
 * against giving the content away.
 *
 * Allowed here deliberately — a landing page is marketing, and the copy is
 * meant to be repeated. If that ever stops being true, move a name from this
 * list into a `disallow: "/"` rule; the ones that matter most are `GPTBot`,
 * `ClaudeBot`, `Google-Extended` and `Applebot-Extended`, which are all
 * opt-out (silence means yes).
 */
const TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ANSWER_BOTS, allow: "/" },
      { userAgent: TRAINING_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
