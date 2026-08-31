import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

// Required under `output: "export"` — without it the route is treated as
// dynamic and never lands in out/.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
