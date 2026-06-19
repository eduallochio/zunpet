import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Força invalidação do cache de build do Vercel após a introdução do
  // middleware.ts — um deploy anterior sem middleware deixou o cache
  // restaurado inconsistente (ENOENT em middleware.js.nft.json).
  generateBuildId: async () => `i18n-middleware-${Date.now()}`,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
