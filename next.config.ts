import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export: the landing has no server-side work to do, and it lets the
  // site be served from any static host (Cloudflare Pages, S3, Vercel static).
  // The i18n setup in i18n/ is built around this — no middleware anywhere.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
